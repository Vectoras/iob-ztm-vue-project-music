import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import About from "@/views/AboutView.vue";
import Manage from "@/views/ManageView.vue";
import Song from "@/views/Song.vue";
import store from "@/store";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    path: "/manage",
    component: Manage,
    meta: {
      requiresAuth: true,
    },
    beforeEnter: (to, from, next) => {
      // console.log("Manage Route Guard");
      if (!to.matched.some((record) => record.meta.requiresAuth)) {
        next();
        return;
      }

      if (store.state.userLoggedIn) {
        next();
        return;
      }

      router.push({ name: "home" });
    },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  // console.log("Global Guard");

  next();
});

export default router;
