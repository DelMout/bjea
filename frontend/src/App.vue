<template>
	<div>
		<div id="entete">
			<div>
				<img src="./assets/logo_bjea.jpg" alt="logo bjea" width="100" />
			</div>
			<div id="nav">
				<router-link to="/">Jeux</router-link>
				<router-link v-if="!connected" to="/access">Accès Admin</router-link>
				<router-link v-if="connected" to="/adherents">Adhérents</router-link>
				<router-link v-if="connected" to="/mail_adherents">Email</router-link>
				<a href="/" v-if="connected" @click="disconnect">Déconnexion</a>
			</div>
		</div>
		<router-view />
	</div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
	computed: {
		...mapState(["connected"]),
	},
	methods: {
		...mapActions(["disconnect"]),

		//* Disconnect
		disconnect: function () {
			this.$store.dispatch("disconnect");
		},
	},
};
</script>

<style>
#app {
	font-family: Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: white;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #979fa8;
}

#nav a.router-link-exact-active {
	color: white;
}
a {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}
#entete {
	display: flex;
	justify-content: center;
	position: fixed;
	background-color: rgb(63, 12, 78);
	width: 100%;
}
</style>
