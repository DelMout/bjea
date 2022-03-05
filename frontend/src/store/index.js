import { createStore } from "vuex";

export default createStore({
	state: {
		connected: false,
	},
	mutations: {
		IS_TRUE(state) {
			state.connected = true;
		},
		IS_FALSE(state) {
			state.connected = false;
		},
	},
	actions: {},
	modules: {},
});
