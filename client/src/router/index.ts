import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WalletView from '../views/WalletView.vue'
import WalletHomeView from '../views/wallet/HomeWallet.vue'
import WalletDepositView from '../views/wallet/Deposit.vue'
import WalletInscribeView from '../views/wallet/Inscribe.vue'
import WalletReceiveView from '../views/wallet/Receive.vue'
import WalletSendView from '../views/wallet/Send.vue'

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
      path: '/wallet',
      name: 'wallet',
      component: WalletView,
      props: {
        walletState: userState.wallets.at(0)
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: WalletHomeView,
          props: {
            walletState: userState.wallets.at(0)
          }
        },
        {
          path: "inscribe",
          name: "Inscribe",
          component: WalletInscribeView,
          props: {
            walletState: userState.wallets.at(0)
          }
        },
        {
          path: "deposit",
          name: "Deposit",
          component: WalletDepositView,
          props: {
            walletState: userState.wallets.at(0)
          }
        },
        {
          path: "send",
          name: "Send",
          component: WalletSendView,
          props: {
            walletState: userState.wallets.at(0)
          }
        },
        {
          path: "receive",
          name: "receive",
          component: WalletReceiveView,
          props: {
            walletState: userState.wallets.at(0)
          }
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
router.beforeEach((to, from) => {
  if (!userState.token && to.name !== 'home') {
    router.push("/")
    return false;
  }
})
export default router
