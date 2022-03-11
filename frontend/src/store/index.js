import { createStore } from "vuex";
import jwt_decode from "jwt-decode";
import moment from "moment";

export default createStore({
	state: {
		connected: false,
		isAdmin: 0,
		token: null,
		expired: false,
	},
	mutations: {
		IS_TRUE(state) {
			state.connected = true;
		},
		IS_FALSE(state) {
			state.connected = false;
		},
		setAdmin(state, isAdmin) {
			state.isAdmin = isAdmin;
		},
		setToken(state, token) {
			state.token = token;
		},
		setExpired(state, expired) {
			state.expired = expired;
		},
	},
	getters: {
		dateNow() {
			moment.locale("fr");
			return Date.now();
		},
		decoded(state) {
			return jwt_decode(state.token);
		},
		dateExp(state, getters) {
			return new Date(getters.decoded.exp * 1000);
		},
	},
	actions: {
		checkConnect(context) {
			if (context.state.token) {
				if (this.getters.dateExp > this.getters.dateNow) {
					context.commit("IS_TRUE");
				} else {
					context.commit("IS_FALSE");
					context.commit("setExpired", true);
				}
			} else {
				context.commit("IS_FALSE");
			}
		},
		disconnect(context) {
			context.commit("IS_FALSE");
			context.commit("setAdmin", 0);
		},
	},
	modules: {},
});
