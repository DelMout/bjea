import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
// import Dialog from "primevue/dialog";

import "primevue/resources/themes/mdc-light-deeppurple/theme.css";
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

createApp(App)
	.use(router)
	.use(PrimeVue)
	// .component("Dialog", Dialog)
	.component("InputText", InputText)
	.component("Button", Button)
	.component("Password", Password)

	.mount("#app");
