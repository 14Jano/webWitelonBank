import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth.ts";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import CloseAccount from "../views/CloseAccount.vue";
import Dashboard from "../views/Dashboard.vue";
import ExportTransactions from "../views/ExportTransactions.vue";
import NotificationsSettings from "../views/NotificationsSettings.vue";
import Recipients from "../views/Recipients.vue";
import Account from "../views/Account.vue";
import AppLayout from "../components/AppLayout.vue";



const routes = [
    { path: "/", component: Home },
    { path: "/about", component: About },
    { path: "/login", component: () => import('../views/LoginPage.vue') },
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
    { path: "/reset-password", component: import('../components/account/ResetPassword.vue') },
    { path: "/forgot-password", component: import('../components/account/ForgotPassword.vue') },
    {
        path: "/account",
        component: Account,
        meta: { requiresAuth: true }
    }, { path: "/", redirect: "/login" },
    { path: "/2fa", component: import('../components/TwoFactor.vue') }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = !!authStore.token && localStorage.getItem('userToken')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router;
