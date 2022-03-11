<template>
	<div id="access">
		<h1>Accès réservé à l'administrateur</h1>

		<div id="login">
			<div>
				<p class="p-float-label">
					<InputText
						class="email"
						id="email"
						type="text"
						inputStyle="width:100%"
						v-model="email"
					/>
					<label for="email">Email</label>
				</p>
				<p v-if="!forgot" class="p-float-label password">
					<Password
						class=" "
						id="password"
						@keyup.enter="enter"
						v-model="password"
						inputStyle="width:100%"
						:feedback="false"
						toggleMask
					>
					</Password>

					<label for="password">Mot de passe</label>
				</p>
				<p id="init" v-if="forgot">
					Merci de renseigner votre adresse email.<br />Vous allez recevoir un email pour
					initialiser votre mot de passe.
				</p>

				<Button v-if="!forgot" label="Valider" class="connect" @click="toConnect" />
				<Button
					v-if="!forgot"
					label="Mot de passe oublié"
					class="forgot p-button-text p-button-warning"
					id="forgot"
					@click="forgotten"
				/>
				<Button
					v-if="forgot"
					label="Initialiser mot de passe"
					class="forgot_button"
					@click="sendLinkPassword"
				/>
			</div>
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
import { mapMutations, mapState } from "vuex";

export default {
	data() {
		return {
			email: "",
			password: "",
			forgot: false,
		};
	},
	computed: {
		...mapState(["token", "connected", "expired", "isAdmin"]),
	},
	methods: {
		...mapMutations(["IS_TRUE", "setAdmin", "setToken"]),
		//* To connect
		toConnect: function () {
			console.log("on y est !");
			console.log("connected =" + this.$store.state.connected);
			axios
				.post(process.env.VUE_APP_API + "member/login", {
					email: this.email,
					password: this.password,
				})
				.then((member) => {
					console.log("you are connected !");
					const { token, isAdmin } = member.data;
					this.$store.commit("IS_TRUE");
					this.setAdmin(isAdmin);
					this.setToken(token);

					// update jeton
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "member/newjeton/" + this.email,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then(() => {
							console.log("jeton OK");
							this.$router.push("/");
						})
						.catch(() => {
							console.log("jeton NOT OK");

							this.$router.push("/");
						});
				})
				.catch((err) => {
					if (err.response.data === "Password not OK") {
						this.$toast.add({
							severity: "error",
							detail: "Mot de passe incorrect !",
							closable: false,
							life: 4000,
						});
					} else {
						this.$toast.add({
							severity: "error",
							detail: "Email inconnu !",
							closable: false,
							life: 4000,
						});
					}
				});
		},

		//* Password forgotten
		forgotten: function () {
			this.forgot = true;
		},

		//* Send email for forgotten password
		sendLinkPassword: function () {
			axios
				.post(process.env.VUE_APP_API + "member/emailpassword/" + this.email)
				.then(() => {
					console.log("email sent!");
					this.$toast.add({
						severity: "info",
						detail: "Email envoyé !",
						closable: false,
						life: 4000,
					});
					this.forgot = false;
				})
				.catch(() => {
					this.$toast.add({
						severity: "error",
						detail: "Cette adresse email ne correspond à aucun compte.",
						closable: false,
						life: 4000,
					});
				});
		},

		//* Press Enter on password cell
		enter: function () {
			this.toConnect();
		},
	},
};
</script>
<style scoped>
#access {
	color: white;
	display: flex;
	flex-direction: column;
}
h1 {
	margin-top: 7rem;
}
#login {
	/* background-color: pink; */
	margin-top: 3vh;
	display: flex;
	width: 35%;
	margin: auto;
}
#login > div {
	font-size: 1.2rem;
	width: 35%;
	/* background-color: blue; */
	margin: auto;
	text-align: left;
	display: flex;
	flex-direction: column;
}
#email {
	width: 100%;
}
.connect {
	margin-top: 2vh;
	font-size: 1.2rem;
}
#forgot {
	margin-top: 3vh;
	color: white;
}
</style>
