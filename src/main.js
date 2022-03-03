import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import "./assets/tailwind.css";
import "./assets/main.css";

// create VueJs app
let app = createApp(App);

// register the modules/plugins
app.use(store);
app.use(router);
app.use(VeeValidatePlugin);

// mount the app
app.mount("#app");
