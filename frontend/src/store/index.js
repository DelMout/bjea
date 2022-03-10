import { createStore } from "vuex";

export default createStore({
	state: {
		connected: false,
		isAdmin: 0,
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
	},
	actions: {
		disconnect(context) {
			context.commit("IS_FALSE");
			context.commit("setAdmin", 0);
		},
	},
	modules: {},
});
