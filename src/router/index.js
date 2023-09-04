import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },

  {
    path: "/home",
    component: () => import("../index/index.vue"),
    meta: { title: "list" },
  },
  {
    path: "/login",
    component: () => import("../login.vue"),
  },
];
const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
