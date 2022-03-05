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
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			email: "",
			password: "",
			forgot: false,
		};
	},
	methods: {
		//* To connect
		toConnect: function () {
			console.log("on y est !");
			axios
				.post(process.env.VUE_APP_API + "member/login", {
					email: this.email,
					password: this.password,
				})
				.then(() => {
					console.log("you are connected !");
				})
				.catch((err) => {
					if (err.response.data === "Password not OK") {
						// this.$toast.add({
						// 	severity: "error",
						// 	detail: "Mot de passe incorrect !",
						// 	closable: false,
						// 	life: 4000,
						// });
					} else {
						// this.$toast.add({
						// 	severity: "error",
						// 	detail: "Email inconnu !",
						// 	closable: false,
						// 	life: 4000,
						// });
					}
				});
		},
	},
};
</script>
<style scoped>
#access {
	color: white;
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
#login > div > p {
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
