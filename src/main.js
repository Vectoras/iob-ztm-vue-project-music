import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
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
    app.directive("icon", Icon);

    // mount the app
    app.mount("#app");
  }
});
