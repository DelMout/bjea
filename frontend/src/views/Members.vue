<template>
	<div>
		<h1>Liste des adhérents</h1>
		<div>
			<table>
				<tr>
					<th>Prénom</th>
					<th>Nom</th>
					<th>Email</th>
					<th>Cotisation 2021/2022</th>
					<th>Caution</th>
				</tr>
				<tr v-for="memb in members" :key="memb.id">
					<td>{{ memb.first_name }}</td>
					<td>{{ memb.last_name }}</td>
					<td>{{ memb.email }}</td>
					<td>{{ memb.cotisation }}</td>
					<td>{{ memb.caution }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			members: [],
		};
	},
	created: function () {
		this.getAllMembers();
	},
	methods: {
		//* Get all members
		getAllMembers: function () {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "member/getallmembers",
			}).then((memb) => {
				for (let i = 0; i < memb.data.length; i++) {
					this.members.push({
						id: memb.data[i].id,
						first_name: memb.data[i].first_name,
						last_name: memb.data[i].last_name,
						email: memb.data[i].email,
						cotisation: memb.data[i].cotisation,
						caution: memb.data[i].caution,
					});
					// sort alpha order
					this.members.sort(function (a, b) {
						var first_nameA = a.first_name;
						var first_nameB = b.first_name;

						if (first_nameA < first_nameB) {
							return -1;
						}
						if (first_nameA > first_nameB) {
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
div {
	color: white;
}
table {
	margin: auto;
	border-collapse: collapse;
	background-color: rgb(189, 129, 207);
	color: black;
}
td,
th {
	border: 5px solid rgb(63, 12, 78);
	width: 10rem;
	height: 2.5rem;
}
</style>
