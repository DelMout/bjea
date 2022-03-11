<template>
	<div id="password">
		<h1>Bonjour {{ prenom }} {{ nom }},</h1>
		<p>Merci de renseigner ci-dessous votre nouveau mot de passe.</p>
		<div id="juxtaButton">
			<p class="p-float-label field">
				<Password
					class="fill"
					id="password"
					@keyup.enter="enter"
					v-model="password"
					inputStyle="width:100%"
					:feedback="true"
					toggleMask
				>
					<template #footer>
						<br />
						<ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
							<li>Au moins 1 minuscule</li>
							<li>Au moins 1 majuscule</li>
							<li>Au moins 1 chiffre</li>
							<li>Minimum 8 caractères</li>
						</ul>
					</template>
				</Password>
				<label for="password">Mot de passe</label>
			</p>
			<Button label="Valider" class="p-button-raised p-button valider" @click="setpassword" />
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			password: "",
			email: "",
		};
	},
	beforeMount: function () {
		this.findDatas();
	},
	computed: {
		...mapState(["token", "connected", "expired", "isAdmin"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		...mapMutations(["IS_TRUE", "setAdmin", "setToken"]),
		//* Find datas user from jeton
		findDatas: function () {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "member/fromjeton/" + this.$route.params.jeton,
			}).then((member) => {
				this.prenom = member.data.first_name;
				this.nom = member.data.last_name;
				this.email = member.data.email;
			});
		},

		//* Save new password
		setpassword: function () {
			axios
				.put(process.env.VUE_APP_API + "member/password/" + this.$route.params.jeton, {
					password: this.password,
				})
				.then(() => {
					// login
					axios
						.post(process.env.VUE_APP_API + "member/login", {
							email: this.email,
							password: this.password,
						})
						.then((memb) => {
							const { token, isAdmin } = memb.data;
							this.$store.commit("IS_TRUE");
							this.setAdmin(isAdmin);
							this.setToken(token);
							// this.$store.commit("setExpired", false);
							this.$store.dispatch("checkConnect");
							this.$router.push("/");

							// update jeton
							axios({
								method: "put",
								url: process.env.VUE_APP_API + "member/newjeton/" + this.email,
								headers: {
									Authorization: `Bearer ${this.token}`,
								},
							})
								.then(() => {
									this.$router.push("/");
								})
								.catch(() => {
									this.$router.push("/");
								});
						});
				});
		},
		//* Press Enter on password cell
		enter: function () {
			this.setpassword();
		},
	},
};
</script>
<style scoped>
h1 {
	color: white;
	margin-top: 10rem;
}
.field {
	width: 20vw;
	margin-right: 2rem;
}
.fill {
	width: 20vw;
}
#juxtaButton {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}
.valider {
	height: 40px;
}
#password {
	display: flex;
	flex-direction: column;
}
</style>
