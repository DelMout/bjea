<template>
	<div class="home">
		<img src="../assets/logo_bjea.jpg" alt="logo bjea" width="100" />
		<div>
			<table>
				<tr>
					<th>Photo</th>
					<th>Nom</th>
					<th>Catégorie</th>
					<th>Marque</th>
					<th>Nombre joueurs</th>
					<th>Stock</th>
					<th>Emprunteur</th>
					<th>Modif données</th>
				</tr>
				<tr v-for="gam in games" :key="gam.id">
					<td>{{ gam.photo }}</td>
					<td>{{ gam.name }}</td>
					<td>{{ gam.category }}</td>
					<td>{{ gam.brand }}</td>
					<td>{{ gam.players }}</td>
					<td>{{ gam.inStock }}</td>
					<td>{{ gam.memberId }}</td>
					<td>modif</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
	name: "Home",
	data() {
		return {
			games: [],
		};
	},
	created: function () {
		this.getAllGames();
	},
	methods: {
		//* Get all games
		getAllGames: function () {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "game/getallgames",
			}).then((games) => {
				for (let i = 0; i < games.data.length; i++) {
					this.games.push({
						id: games.data[i].id,
						photo: games.data[i].photo,
						name: games.data[i].name,
						category: games.data[i].category,
						brand: games.data[i].brand,
						players: games.data[i].players,
						inStock: games.data[i].inStock,
						memberId: games.data[i].memberId,
					});
					// sort alpha order
					this.games.sort(function (a, b) {
						var nameA = a.name;
						var nameB = b.name;

						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					});
				}
			});
		},
	},
};
</script>
<style scoped>
.home {
	color: black;
	display: flex;
	flex-direction: column;
}

table {
	margin: auto;
	border-collapse: collapse;
	background-color: rgb(189, 129, 207);
}
td,
th {
	border: 5px solid rgb(63, 12, 78);
	width: 10rem;
	height: 2.5rem;
}
</style>
