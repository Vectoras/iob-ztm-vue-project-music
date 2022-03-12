import Nprogress from "nprogress";

export default (router) => {
  router.beforeEach((to, from, next) => {
    Nprogress.start();
    next();
  });

  router.afterEach(Nprogress.done);
};
