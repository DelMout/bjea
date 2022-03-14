import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/access",
		name: "Access",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Access.vue"),
	},
	{
		path: "/adherents",
		name: "Members",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Members.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (store.state.isAdmin != 1) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/mail_adherents",
		name: "EmailMembers",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/EmailMembers.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (store.state.isAdmin != 1) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/setpassword/:jeton",
		name: "Password",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Password.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
