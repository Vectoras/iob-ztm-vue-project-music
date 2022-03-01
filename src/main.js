import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import "./assets/main.css";

// create VueJs app
let app = createApp(App);

// register the modules/plugins
app.use(store);
app.use(router);

// mount the app
app.mount("#app");
