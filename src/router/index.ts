import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layout/layout.vue";
const path = "/OOAD";

export const TestRoute: RouteRecordRaw = {
  path: `${path}/test`,
  name: "test",
  component: () => import("@/views/test.vue"),
  meta: {
    title: "test",
  },
};

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: `${path}/home`,
  meta: {
    title: "Root",
  },
};

export const LoginRoute: RouteRecordRaw = {
  path: `${path}/login`,
  name: "Login",
  component: () => import("@/views/login.vue"),
  meta: {
    title: "登入",
    public: true,
  },
};

export const HomeRoute: RouteRecordRaw = {
  path: path,
  component: DefaultLayout,
  children: [
    {
      path: "home",
      name: "home",
      component: () => import("@/views/home.vue"),
      meta: {
        title: "首頁",
        requiresAuth: true,
      },
    },
    {
      path: "report",
      name: "report",
      component: () => import("@/views/report.vue"),
      meta: {
        title: "帳務報表",
        requiresAuth: true,
      },
    },
    {
      path: "settings",
      name: "settings",
      component: () => import("@/views/settings.vue"),
      meta: {
        title: "設定",
        requiresAuth: true,
      },
    },
    {
      path: "403",
      name: "403",
      component: () => import("@/views/exception/403.vue"),
      meta: {
        title: "403",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/exception/404.vue"),
    },
  ],
};

export const constantRouter: RouteRecordRaw[] = [
  LoginRoute,
  HomeRoute,
  RootRoute,
  TestRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const redirectPath = to.query.redirectPath as string | undefined;
  if (redirectPath) {
    next(redirectPath);
  } else {
    next();
  }
});

export default router;
