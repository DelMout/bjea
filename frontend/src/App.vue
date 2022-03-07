<template>
	<div id="nav">
		<router-link to="/">Jeux</router-link> |
		<router-link to="/access">Accès Admin</router-link>
		| <router-link to="/adherents">Adhérents</router-link> |
		<router-link to="/mail_adherents">Email</router-link>
	</div>
	<router-view />
</template>

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
</style>
