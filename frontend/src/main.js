import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Editor from "primevue/editor";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";

import "primevue/resources/themes/mdc-light-deeppurple/theme.css";
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import store from "./store";

createApp(App)
	.use(store)
	.use(router)
	.use(PrimeVue, {
		locale: {
			weak: "Faible",
			medium: "Moyen",
			strong: "Fort",
			passwordPrompt: "Saisir un mot de passe",
			accept: "OK",
			reject: "Non",
		},
	})
	.component("Dialog", Dialog)
	.use(ToastService)
	.component("Toast", Toast)
	.component("InputText", InputText)
	.component("Button", Button)
	.component("Password", Password)
	.component("Dropdown", Dropdown)
	.component("Editor", Editor)
	.component("ProgressSpinner", ProgressSpinner)

	.mount("#app");
