import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/login",
    name: "login",
    component: () => import("../views/ClientViews/Login.vue"),
    meta: {
      requiresGuest: true, // Only accessible when not logged in
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ClientViews/Profile.vue"),
    meta: {
      requiresAuth: true, // Requires authentication
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/AdminViews/DashboardView.vue"),
    meta: {
      requiresAuth: true, // Requires authentication
    },
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("../views/ClientViews/MyOrders.vue"),
    meta: {
      requiresAuth: true, // Requires authentication
    },
  },

  {
    path: "/wishlist",
    name: "wishlist",
    component: () => import("../views/ClientViews/WishlistView.vue"),
    meta: {
      requiresAuth: true, // Requires authentication
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/ClientViews/CartView.vue"),
    meta: {
      requiresAuth: true, // Requires authentication
    },
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("../views/ProductsViews/CategoryView.vue"),
  },
  {
    path: "/category/:id",
    name: "category-products",
    component: () => import("../views/ProductsViews/CategoryProductsView.vue"),
  },
  {
    path: "/category/:categoryId/product/:productId",
    name: "product-detail",
    component: () => import("../views/ProductDetailView.vue"),
  },
  {
    path: "/product/:productId",
    name: "product-detail-direct",
    component: () => import("../views/ProductDetailView.vue"),
  },
  {
    path: "/products",
    name: "products",
    component: () => import("../views/ProductsViews/AllProductsView.vue"),
  },
  {
    path: "/successful",
    name: "payment-success",
    component: () =>
      import("../views/PaymentStatusViews/SuccessfulPaymentView.vue"),
  },
  {
    path: "/cancelled",
    name: "payment-cancelled",
    component: () =>
      import("../views/PaymentStatusViews/CancelledPaymentView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authenticated = localStorage.getItem("token");

  if (to.meta.requiresAuth) {
    if (authenticated) {
      next();
    } else {
      console.log("Access denied: Authentication required");
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }
  } else if (to.meta.requiresGuest) {
    if (authenticated) {
      console.log("Already authenticated, redirecting to home");
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
