import { createRouter, createWebHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/index.vue"),
    children: [
      {
        path: "/project",
        component: () => import("../views/project.vue"),
      },
      {
        path: "/setting",
        component: () => import("../views/setting.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
