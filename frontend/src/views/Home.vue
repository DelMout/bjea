<template>
	<div class="home">
		<img src="../assets/logo_bjea.jpg" alt="logo bjea" width="100" />
		<!-- <div>
			<Button
				id=""
				label="Ajouter un jeu"
				class="p-button-raised p-button-success"
				@click="wantCreateGame"
			/>
		</div> -->
		<div>
			<table>
				<tr>
					<th>Photo</th>
					<th>Nom</th>
					<th>Stock</th>
					<th>Emprunteur</th>
					<th>Catégorie</th>
					<th>Marque</th>
					<th class="short">
						Mini<br />
						joueurs
					</th>
					<th class="short">Maxi<br />joueurs</th>
					<th class="modif_button"></th>
				</tr>
				<tr :class="gam.style" v-for="gam in games" :key="gam.id">
					<td>{{ gam.photo }}</td>
					<td>
						<div v-if="gam.style != 'orange'">{{ gam.name }}</div>
						<input v-if="gam.style == 'orange'" type="text" v-model="gam.name" />
					</td>
					<td>
						<button
							v-if="gam.inStock > 0"
							class="stock on_stock"
							type="button"
							@click="moveStock($event, gam)"
						>
							EN STOCK
						</button>
						<button
							v-if="gam.inStock === 0"
							class="stock off_stock"
							type="button"
							@click="moveStock($event, gam)"
						>
							SORTI
						</button>
					</td>
					<td @click="wantChooseMember($event, gam)">
						<div v-if="gam.wantToOOS === 0">{{ gam.name_member }}</div>
						<Dropdown
							v-if="gam.wantToOOS > 0"
							@click="displayMembers"
							v-model="memberModel"
							:options="members"
							optionLabel="name"
							optionValue="id"
							:placeholder="gam.name_member"
						/>
					</td>
					<td>
						<div v-if="gam.style != 'orange'">{{ gam.category }}</div>
						<Dropdown
							id="category"
							v-if="gam.style == 'orange'"
							v-model="categoryModel"
							:options="categories"
							optionLabel="category"
							optionValue="category"
							:placeholder="gam.category"
						/>
					</td>
					<td>
						<div v-if="gam.style != 'orange'">{{ gam.brand }}</div>
						<input v-if="gam.style == 'orange'" type="text" v-model="gam.brand" />
					</td>
					<td class="short">
						<div v-if="gam.style != 'orange'">{{ gam.players_mini }}</div>
						<input
							v-if="gam.style == 'orange'"
							type="text"
							class="short"
							v-model="gam.players_mini"
						/>
					</td>
					<td class="short">
						<div v-if="gam.style != 'orange'">{{ gam.players_maxi }}</div>
						<input
							v-if="gam.style == 'orange'"
							type="text"
							class="short"
							v-model="gam.players_maxi"
						/>
					</td>
					<td class="modif_button">
						<Button
							:id="gam.style_modif"
							:label="gam.modif"
							class="p-button-raised p-button-warning"
							@click="modifGame($event, gam)"
						/>
					</td>
				</tr>
				<!-- Creation a new game -->
				<tr class="creation">
					<th>Photo</th>
					<th>Nom</th>
					<th>Stock</th>
					<th>Emprunteur</th>
					<th>Catégorie</th>
					<th>Marque</th>
					<th class="short">
						Mini<br />
						joueurs
					</th>
					<th class="short">Maxi<br />joueurs</th>
					<th class="modif_button"></th>
				</tr>
				<tr class="creation">
					<td>
						<div class="uploadFile">
							<button class="btn-upload">Choisir un fichier</button>
							<input type="file" name="image" @change="onFileChange" />
						</div>
					</td>
					<td>
						<input class="creation" type="text" v-model="nameCrea" />
					</td>
					<td>EN STOCK</td>
					<td>Ne pas renseigner</td>
					<td>
						<Dropdown
							class="creation"
							v-model="categoryCrea"
							:options="categories"
							optionLabel="category"
							optionValue="category"
						/>
					</td>
					<td>
						<input class="creation" type="text" v-model="brandCrea" />
					</td>
					<td class="short">
						<input type="text" class="short creation" v-model="players_miniCrea" />
					</td>
					<td class="short">
						<input type="text" class="short creation" v-model="players_maxiCrea" />
					</td>
					<td class="modif_button">
						<Button
							label="Ajouter"
							class="p-button-raised p-button-success"
							@click="creaGame"
						/>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
// import FormData from "form-data";

export default {
	name: "Home",
	data() {
		return {
			games: [],
			borrower: 5,
			memberModel: "",
			members: [],
			gameId: "",
			styleSaved: "",
			categories: [],
			categoryModel: "",
			nameCrea: "",
			categoryCrea: "",
			brandCrea: "",
			players_miniCrea: "",
			players_maxiCrea: "",
			image: null,
		};
	},
	created: function () {
		this.getAllGames();
		this.displayCategories();
	},
	methods: {
		//* Get all games
		getAllGames: function () {
			this.games = [];
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "game/getallgames",
			}).then((games) => {
				for (let i = 0; i < games.data.length; i++) {
					axios({
						method: "get",
						url: process.env.VUE_APP_API + "member/fromid/" + games.data[i].memberId,
					}).then((name_member) => {
						if (games.data[i].inStock === 0) {
							this.styleSaved = "grey";
						} else {
							this.styleSaved = "purple";
						}
						this.games.push({
							id: games.data[i].id,
							photo: games.data[i].photo,
							name: games.data[i].name,
							category: games.data[i].category,
							brand: games.data[i].brand,
							players_mini: games.data[i].players_mini,
							players_maxi: games.data[i].players_maxi,
							inStock: games.data[i].inStock,
							memberId: games.data[i].memberId,
							name_member: name_member.data,
							wantToOOS: 0,
							style: this.styleSaved,
							modif: "Modifier",
							style_modif: "",
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
					});
				}
			});
		},

		//* Move the stock of the game selected
		moveStock: function (event, gam) {
			if (gam.inStock === 0) {
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "game/intostock/" + gam.id,
					// headers: {
					// 			Authorization: `Bearer ${this.token}`,
					// 		},
				}).then(() => {
					this.getAllGames();
				});
			} else {
				if (this.gameId != gam.id) {
					//Compare gameId of members's dropdown and gameId of button EN STOCK / SORTI
					if (this.gameId == "") {
						console.log(this.gameId);
						console.log(
							"Merci de sélectionner le nom de l'emprunteur avant de sortir le jeu du stock."
						);
					} else {
						console.log("Vous venez de sélectionner un membre pour un autre jeu !");
					}
				} else {
					axios({
						method: "put",
						url:
							process.env.VUE_APP_API +
							"game/outofstock/" +
							gam.id +
							"/" +
							this.memberModel,
						// headers: {
						// 			Authorization: `Bearer ${this.token}`,
						// 		},
					}).then(() => {
						this.getAllGames();
					});
				}
			}
		},

		//* Want to choose a member (so display list of members)
		wantChooseMember: function (event, gam) {
			if (gam.inStock === 0) {
				console.log("Le jeu n'est pas en stock actuellement !");
			} else {
				gam.style = "white";
				gam.wantToOOS = 1;
				this.gameId = gam.id;
			}
		},

		//* Display list of members
		displayMembers: function () {
			this.members = [];
			axios.get(process.env.VUE_APP_API + "member/getallmembers").then((memb) => {
				for (let i = 0; i < memb.data.length; i++) {
					this.members.push({
						name: memb.data[i].first_name + " " + memb.data[i].last_name,
						id: memb.data[i].id,
					});
				}
			});
		},

		//* Modify datas of a game
		modifGame: function (event, gam) {
			if (gam.modif == "Modifier") {
				gam.style = "orange";
				this.displayCategories();
				this.categoryModel = gam.category;
				gam.modif = "Valider";
				gam.style_modif = "green";
			} else {
				this.saveModifications(event, gam);
				gam.style = "purple";
				gam.modif = "Modifier";
				gam.style_modif = "";
			}
		},

		//* Display list of categories
		displayCategories: function () {
			this.categories = [];
			axios.get(process.env.VUE_APP_API + "category/getallcategories").then((cat) => {
				for (let i = 0; i < cat.data.length; i++) {
					this.categories.push({
						category: cat.data[i].category,
						id: cat.data[i].id,
					});
				}
			});
		},

		//* Save modifications of game datas
		saveModifications: function (event, gam) {
			// const formData = new FormData();
			// formData.append("name", gam.name);
			// formData.append("category", this.categoryModel);
			// formData.append("brand", gam.brand);
			// formData.append("players_mini", gam.players_mini);
			// formData.append("players_maxi", gam.players_maxi);
			// console.log(gam.id);

			//!formData.append("image", this.image);
			axios({
				method: "put",
				url: process.env.VUE_APP_API + "game/modifygame/" + gam.id,
				data: {
					name: gam.name,
					category: this.categoryModel,
					brand: gam.brand,
					players_mini: gam.players_mini,
					players_maxi: gam.players_maxi,
					//image:this.image
				},
				headers: {
					content_type: "multipart/form-data",
					// 	Authorization: `Bearer ${this.token}`,
				},
			})
				.then(() => {
					console.log("Les modifications ont été prises en compte.");
					this.getAllGames();
				})
				.catch((err) => console.log(err));
		},

		//* Select a photo
		onFileChange: function (event) {
			this.image = event.target.files[0];
		},

		//* Save a new game
		creaGame: function () {
			if (
				this.nameCrea === "" ||
				this.categoryCrea === "" ||
				this.brandCrea === "" ||
				this.players_miniCrea === "" ||
				this.players_maxiCrea === ""
			) {
				//!
				console.log("il manque qqchose !");
			} else {
				console.log(this.image);
				const formData = new FormData();
				formData.append("name", this.nameCrea);
				formData.append("category", this.categoryCrea);
				formData.append("brand", this.brandCrea);
				formData.append("players_mini", this.players_miniCrea);
				formData.append("players_maxi", this.players_maxiCrea);
				formData.append("memberId", 5);
				formData.append("image", this.image);
				//! creer un perso pour "personne" avec is Admin=2

				axios({
					method: "post",
					url: process.env.VUE_APP_API + "game/create",
					data: formData,
					// data: {
					// 	name: this.nameCrea,
					// 	category: this.categoryCrea,
					// 	brand: this.brandCrea,
					// 	players_mini: this.players_miniCrea,
					// 	players_maxi: this.players_maxiCrea,
					// 	memberId: null,
					// 	image: this.image,
					// },
					headers: {
						// content_type: "multipart/form-data",
						// 	Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						console.log("Nouveau jeu sauvegardé !");
						this.getAllGames();
					})
					.catch((err) => {
						if (err.response.data === "name must be unique") {
							//!
							console.log("Ce jeu existe déjà dans la liste !");
						} else {
							console.log(err);
						}
					});
			}
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
.stock {
	width: 10rem;
	height: 2.5rem;
	margin-left: 0;
	cursor: pointer;
	color: black;
	font-weight: bold;
	font-size: 1rem;
	font-family: Arial, Helvetica, sans-serif;
}
.on_stock {
	background-color: rgb(20, 243, 39);
}
.off_stock {
	background-color: rgb(231, 28, 28);
	color: white;
}
tr > .short {
	width: 5rem;
}
.short {
	width: 5rem;
	text-align: center;
}
.white {
	background-color: white;
}
.purple {
	background-color: rgb(189, 129, 207);
}
.orange {
	background-color: orange;
}
.grey {
	background-color: rgb(88, 85, 85);
	color: white;
}
.modif_button {
	background-color: rgb(63, 12, 78);
	width: 6rem;
}
input,
#category {
	background-color: orange;
	width: 10rem;
	height: 2.5rem;
	font-size: 1rem;
}
#green {
	background-color: green;
	color: white;
}
.creation {
	background-color: rgb(71, 211, 71);
}
</style>
