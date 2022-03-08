import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import "./assets/tailwind.css";
import "./assets/main.css";

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    // create VueJs app
    app = createApp(App);

    // register the modules/plugins
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);

    // mount the app
    app.mount("#app");
  }
});
