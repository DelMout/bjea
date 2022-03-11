<template>
	<div class="home">
		<h1>Liste JEUX</h1>
		<div>
			<Button
				v-if="connected"
				id="wantcreate"
				label="Ajouter un jeu"
				class="p-button-raised p-button-success"
				@click="wantCreateGame"
			/>
		</div>
		<div>
			<table>
				<tr id="sort">
					<th class="photo_head"></th>
					<th>
						<button class="short sort_button" type="button" @click="getAllGames">
							<span class="pi pi-sort-alpha-down"></span>
						</button>
					</th>
					<th></th>
					<th v-if="connected"></th>
					<th>
						<button class="short sort_button" type="button" @click="sortCategories">
							<span class="pi pi-sort-alpha-down"></span>
						</button>
					</th>
					<th></th>
					<th class="short"></th>
					<th class="short">
						<button class="short sort_button" type="button" @click="sortMaxiPlayers">
							<span class="pi pi-sort-numeric-down"></span>
						</button>
					</th>
					<th v-if="connected" class="modif_button"></th>
				</tr>

				<tr>
					<th class="photo_head">Photo</th>
					<th>Nom</th>
					<th>Stock</th>
					<th v-if="connected">Emprunteur</th>
					<th>Catégorie</th>
					<th>Marque</th>
					<th class="short">
						Mini<br />
						joueurs
					</th>
					<th class="short">Maxi<br />joueurs</th>
					<th v-if="connected" class="modif_button"></th>
				</tr>
				<tr :class="gam.style" v-for="gam in games" :key="gam.id">
					<td class="photo photo_head">
						<div class="photo photo_head">
							<img
								crossorigin="anonymous"
								class="photo"
								v-if="gam.photo && gam.style != 'orange'"
								style="max-width: 5rem; max-height: 5rem; width: auto"
								:src="gam.photo"
								alt="boite jeu"
							/>
							<input
								class="photo_head input_image"
								v-if="gam.style == 'orange'"
								type="file"
								name="image"
								@change="onFileChange"
							/>
						</div>
					</td>
					<td>
						<div id="name" v-if="gam.style != 'orange'">{{ gam.name }}</div>
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
					<td v-if="connected" @click="wantChooseMember($event, gam)">
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
					<td v-if="connected" class="modif_button">
						<Button
							:id="gam.style_modif"
							:label="gam.modif"
							class="p-button-raised p-button-warning"
							@click="modifGame($event, gam)"
						/>
					</td>
				</tr>
				<!-- Creation a new game -->
				<tr v-if="connected" class="creation">
					<th class="photo_head">Photo</th>
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
				<tr v-if="connected" class="creation photo photo_head">
					<td class="photo_head">
						<input
							class="creation photo_head"
							type="file"
							name="image"
							@change="onFileChange"
						/>
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
		<div style="width: 30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

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
	computed: {
		...mapState([
			"token",
			"connected",
			// "expired",
		]),
	},
	created: function () {
		this.getAllGames();
		this.displayCategories();
	},
	methods: {
		...mapActions(["checkConnect"]),

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

		//* Sort all games by maxi players
		sortMaxiPlayers: function () {
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
							var maxipA = a.players_maxi;
							var maxipB = b.players_maxi;

							if (maxipA < maxipB) {
								return -1;
							}
							if (maxipA > maxipB) {
								return 1;
							}
							return 0;
						});
					});
				}
			});
		},

		//* Sort all games by categories
		sortCategories: function () {
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
							var categoryA = a.category;
							var categoryB = b.category;

							if (categoryA < categoryB) {
								return -1;
							}
							if (categoryA > categoryB) {
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (gam.inStock === 0) {
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "game/intostock/" + gam.id,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					}).then(() => {
						this.getAllGames();
					});
				} else {
					if (this.gameId != gam.id) {
						//Compare gameId of members's dropdown and gameId of button EN STOCK / SORTI
						if (this.gameId == "") {
							this.$toast.add({
								severity: "error",
								detail: "Merci de sélectionner le nom de l'emprunteur avant de sortir le jeu du stock.",
								closable: false,
								life: 4000,
							});
						} else {
							this.$toast.add({
								severity: "error",
								detail: "Vous venez de sélectionner un membre pour un autre jeu !",
								closable: false,
								life: 4000,
							});
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
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						}).then(() => {
							this.getAllGames();
						});
					}
				}
			}
		},

		//* Want to choose a member (so display list of members)
		wantChooseMember: function (event, gam) {
			if (gam.inStock === 0) {
				this.$toast.add({
					severity: "error",
					detail: "Le jeu n'est pas en stock actuellement !",
					closable: false,
					life: 4000,
				});
			} else {
				gam.style = "white";
				gam.wantToOOS = 1;
				this.gameId = gam.id;
			}
		},

		//* Display list of members
		displayMembers: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				this.members = [];
				axios({
					method: "get",
					url: process.env.VUE_APP_API + "member/getmemberswithcaution",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then((memb) => {
					for (let i = 0; i < memb.data.length; i++) {
						this.members.push({
							name: memb.data[i].first_name + " " + memb.data[i].last_name,
							id: memb.data[i].id,
						});
					}
				});
			}
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const formData = new FormData();
				formData.append("name", gam.name);
				formData.append("category", this.categoryModel);
				formData.append("brand", gam.brand);
				formData.append("players_mini", gam.players_mini);
				formData.append("players_maxi", gam.players_maxi);

				formData.append("image", this.image);
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "game/modifygame/" + gam.id,

					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						this.getAllGames();
					})
					.catch((err) => {
						this.$toast.add({
							severity: "error",
							detail: err,
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Select a photo
		onFileChange: function (event) {
			this.image = event.target.files[0];
		},

		//* Want create a game (scroll down on the page)
		wantCreateGame: function () {
			window.scrollTo(0, document.body.scrollHeight);
		},

		//* Save a new game
		creaGame: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (
					this.nameCrea === "" ||
					this.categoryCrea === "" ||
					this.brandCrea === "" ||
					this.players_miniCrea === "" ||
					this.players_maxiCrea === ""
				) {
					this.$toast.add({
						severity: "error",
						detail: "Merci de renseigner un nom de jeu, une catégorie, une marque, nombre de joueurs minimum et maximum.",
						closable: false,
						life: 4000,
					});
				} else {
					console.log(this.image);
					const formData = new FormData();
					formData.append("name", this.nameCrea);
					formData.append("category", this.categoryCrea);
					formData.append("brand", this.brandCrea);
					formData.append("players_mini", this.players_miniCrea);
					formData.append("players_maxi", this.players_maxiCrea);
					formData.append("memberId", process.env.VUE_APP_NOBODY);
					formData.append("image", this.image);

					axios({
						method: "post",
						url: process.env.VUE_APP_API + "game/create",
						data: formData,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then(() => {
							this.$toast.add({
								severity: "success",
								detail: "Jeu créé !",
								closable: false,
								life: 4000,
							});
							this.nameCrea = "";
							this.categoryCrea = "";
							this.brandCrea = "";
							this.players_miniCrea = "";
							this.players_maxiCrea = "";
							this.image = null;
							this.getAllGames();
						})
						.catch((err) => {
							if (err.response.data === "name must be unique") {
								this.$toast.add({
									severity: "error",
									detail: "Ce jeu existe déjà dans la liste !",
									closable: false,
									life: 4000,
								});
							} else {
								this.$toast.add({
									severity: "error",
									detail: err,
									closable: false,
									life: 4000,
								});
							}
						});
				}
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
h1 {
	color: white;
	margin-top: 7rem;
}

table {
	margin: auto;
	border-collapse: collapse;
	background-color: rgb(189, 129, 207);
	margin-bottom: 2rem;
}
td,
th {
	border: 5px solid rgb(63, 12, 78);
	width: 10rem;
	height: 2.5rem;
}
#name {
	font-size: 1rem;
	font-weight: bold;
}
.stock {
	width: 10rem;
	height: 5rem;
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
.photo {
	/* width: 5rem; */
	height: 5rem;
}
.photo_head {
	width: 5rem;
}
.input_image {
	margin-top: 1.5rem;
}
#wantcreate {
	margin-bottom: 1rem;
}
#sort {
	background-color: rgb(63, 12, 78);
}
.sort_button {
	height: 2.5rem;
	color: white;
	background-color: rgb(63, 12, 78);
	border: 5px solid rgb(63, 12, 78);
	cursor: pointer;
}
span {
	font-size: 1.5rem;
}
</style>
