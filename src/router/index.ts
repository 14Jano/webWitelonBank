import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import CloseAccount from "../views/CloseAccount.vue";
import Dashboard from "../views/Dashboard.vue";
import ExportTransactions from "../views/ExportTransactions.vue";
import NotificationsSettings from "../views/NotificationsSettings.vue";
import Recipients from "../views/Recipients.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Account from "../views/Account.vue";
import AppLayout from "../components/AppLayout.vue";



const routes = [
    { path: "/", component: Home },
    { path: "/about", component: About },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/close-account", component: CloseAccount },
    { path: "/dashboard", component: AppLayout, children: [
            { path: "", component: Dashboard },
            { path: 'profile', component: () => import('../views/Account.vue') },
        ],
        meta: { requiresAuth: true }
    },
    { path: "/export-transactions", component: ExportTransactions },
    { path: "/notifications-settings", component: NotificationsSettings },
    { path: "/recipients", component: Recipients },
    { path: "/reset-password", component: ResetPassword },
    { path: "/account", component: Account },
    { path: "/2fa", component: import('../views/TwoFactor.vue') }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem("token") !== null;
//     if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
//         next({ path: "/login" });
//     } else {
//         next();
//     }
// });

export default router;
