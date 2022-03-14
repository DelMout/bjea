<template>
	<div id="member">
		<h1>Liste des adhérents</h1>
		<div>
			<Button
				id="addmember"
				label="Ajouter un adhérent"
				class="p-button-raised p-button-success"
				@click="wantCreateMember"
			/>
		</div>
		<div>
			<table>
				<tr>
					<th>Prénom</th>
					<th>Nom</th>
					<th>Email</th>
					<th class="short">Cotisation<br />2021/2022</th>
					<th class="short">Caution</th>
				</tr>
				<tr v-for="memb in members" :key="memb.id">
					<td>{{ memb.first_name }}</td>
					<td>{{ memb.last_name }}</td>
					<td>{{ memb.email }}</td>
					<td class="short">
						<button
							v-if="memb.cotisation > 0"
							class="payment done"
							@click="changeCotisation($event, memb)"
						>
							Payée
						</button>
						<button
							v-if="memb.cotisation === 0"
							class="payment no_done"
							@click="changeCotisation($event, memb)"
						>
							Non<br />
							payée
						</button>
					</td>
					<td class="short">
						<button
							v-if="memb.caution > 0"
							class="payment done"
							@click="changeCaution($event, memb)"
						>
							Versée
						</button>
						<button
							v-if="memb.caution === 0"
							class="payment no_done"
							@click="changeCaution($event, memb)"
						>
							Non<br />
							Versée
						</button>
					</td>
				</tr>
				<!-- Creation of new member -->
				<tr class="creation">
					<th>Prénom</th>
					<th>Nom</th>
					<th>Email</th>
					<th class="short">Cotisation<br />2021/2022</th>
					<th class="short">Caution</th>
				</tr>
				<tr class="creation">
					<td><input type="text" class="" v-model="first_name" /></td>
					<td><input type="text" class="" v-model="last_name" /></td>
					<td><input type="text" class="email" v-model="email" /></td>
					<td class="short">
						<button
							v-if="cotisation > 0"
							class="payment done"
							@click="changeCreaCotisation"
						>
							Payée
						</button>
						<button
							v-if="cotisation === 0"
							class="payment no_done"
							@click="changeCreaCotisation"
						>
							Non<br />
							payée
						</button>
					</td>
					<td class="short">
						<button v-if="caution > 0" class="payment done" @click="changeCreaCaution">
							Versée
						</button>
						<button
							v-if="caution === 0"
							class="payment no_done"
							@click="changeCreaCaution"
						>
							Non<br />
							Versée
						</button>
					</td>
				</tr>
			</table>
		</div>
		<div>
			<Button
				id="createmember"
				label="Valider nouvel adhérent"
				class="p-button-raised p-button-success"
				@click="saveMember"
			/>
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
	data() {
		return {
			members: [],
			first_name: "",
			last_name: "",
			email: "",
			cotisation: 1,
			caution: 0,
			cotisation_value: "",
		};
	},
	computed: {
		...mapState(["connected", "token"]),
	},
	created: function () {
		this.getAllMembers();
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Get all members
		getAllMembers: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				this.members = [];
				axios({
					method: "get",
					url: process.env.VUE_APP_API + "member/getallmembers",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
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
			}
		},

		//* Change status of Cotisation (in modification)
		changeCotisation: function (event, memb) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (memb.cotisation === 0) {
					this.cotisation_value = 1;
				} else {
					this.cotisation_value = 0;
				}
				axios({
					method: "put",
					url:
						process.env.VUE_APP_API +
						"member/cotisation/" +
						memb.id +
						"/" +
						this.cotisation_value,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then(() => {
					this.getAllMembers();
				});
			}
		},

		//* Change status of Caution (in modification)
		changeCaution: function (event, memb) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (memb.caution === 0) {
					this.caution_value = 1;
				} else {
					this.caution_value = 0;
				}
				axios({
					method: "put",
					url:
						process.env.VUE_APP_API +
						"member/caution/" +
						memb.id +
						"/" +
						this.caution_value,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then(() => {
					this.getAllMembers();
				});
			}
		},

		//* Change status of Cotisation (in creation of member)
		changeCreaCotisation: function () {
			if (this.cotisation === 0) {
				this.cotisation = 1;
			} else {
				this.cotisation = 0;
			}
		},

		//* Change status of Caution (in creation of member)
		changeCreaCaution: function () {
			if (this.caution === 0) {
				this.caution = 1;
			} else {
				this.caution = 0;
			}
		},

		//* Want create a new member (scroll down on the page)
		wantCreateMember: function () {
			window.scrollTo(0, document.body.scrollHeight);
		},

		//* Save new member
		saveMember: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (this.first_name === "" || this.last_name === "" || this.email === "") {
					this.$toast.add({
						severity: "error",
						detail: "Le prénom, nom et email doivent être renseignés !",
						closable: false,
						life: 4000,
					});
				} else {
					axios({
						method: "post",
						url: process.env.VUE_APP_API + "member/create",
						data: {
							email: this.email,
							last_name: this.last_name,
							first_name: this.first_name,
							cotisation: this.cotisation,
							caution: this.caution,
							password: null,
						},
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then(() => {
							this.$toast.add({
								severity: "success",
								detail: "Nouvel adhérent créé !",
								closable: false,
								life: 4000,
							});
							this.getAllMembers();
							this.email = "";
							this.last_name = "";
							this.first_name = "";
							this.cotisation = 1;
							this.caution = 0;
						})
						.catch((err) => {
							if (err.response.data === "email must be unique") {
								this.$toast.add({
									severity: "error",
									detail: "Cette adresse email est déjà affectée à un adhérent.",
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
#member {
	display: flex;
	flex-direction: column;
}
h1 {
	margin-top: 7rem;
}
#addmember {
	margin-bottom: 1rem;
}
#createmember {
	margin-bottom: 2rem;
	margin-top: 1rem;
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
	height: 3rem;
}
.creation {
	background-color: white;
}
input {
	width: 10rem;
	height: 3rem;
}
.payment {
	width: 7rem;
	height: 3rem;
	margin-left: 0;
	cursor: pointer;
	color: black;
	font-size: 0.9rem;
	font-family: Arial, Helvetica, sans-serif;
}
.done {
	background-color: rgb(20, 243, 39);
}
.no_done {
	background-color: rgb(231, 28, 28);
	color: white;
}
.short {
	width: 7rem;
}
@media only screen and (max-width: 768px) {
	table {
		font-size: 0.8rem;
	}
	td,
	th {
		border: 3px solid rgb(63, 12, 78);
		width: 5rem;
		/* height: 3rem; */
	}
	.creation {
		background-color: white;
	}
	input {
		width: 5rem;
		/* height: 3rem; */
	}
	.payment {
		width: 5rem;
		font-size: 0.8rem;
	}
	.short {
		width: 5rem;
	}
	.email {
		width: 8rem;
	}
}
</style>
