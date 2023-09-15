import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/list",
  },

  {
    path: "/home",
    component: () => import("../index/index.vue"),
    meta: { title: "list" },
  },
  {
    path: "/list1",
    component: () => import("../verList.vue"),
  },
  {
    path: "/list",
    component: () => import("../verList2.vue"),
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
