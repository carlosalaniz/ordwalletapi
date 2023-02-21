import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WalletView from '../views/WalletView.vue'
import WalletHomeView from '../views/wallet/HomeWallet.vue'
import WalletInscribeView from '../views/wallet/Inscribe.vue'
import WalletReceiveView from '../views/wallet/Receive.vue'
import WalletSendView from '../views/wallet/Send.vue'
import RegisterView from "../views/auth/register.vue"
import LoginView from "../views/auth/login.vue"

import { userState } from "../client";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView,
      children: [
        {
          path: "",
          name: "dashboard",
          component: WalletHomeView,
          
        },
        {
          path: "inscribe",
          name: "Inscribe",
          component: WalletInscribeView,
          
        },
        {
          path: "send",
          name: "Send",
          component: WalletSendView,
          
        },
        {
          path: "receive",
          name: "receive",
          component: WalletReceiveView,
          
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})
const GuestRoutes = ['home', 'register', 'login']
router.beforeEach((to, from) => {
  const name = to.name?.toString()
  if (
    !userState.token
    && !GuestRoutes.includes(name!)) {
    router.push("/")
    return false;
  }
})
export default router
