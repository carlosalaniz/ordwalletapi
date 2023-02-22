<script setup lang="ts">
import MobileMenu from '../components/MobileMenu.vue';
import SideMenu from '../components/SideMenu.vue';
import Estimates from '../components/Estimates.vue';
import type { PropType } from 'vue';
import { userState } from "@/client"

</script>
<script lang="ts">
export default {
    data() {
        return {
            userState: userState as UserState,
            menu: [
                { route: "/wallet", text: "Dashboard" },
                { route: "/wallet/inscribe", text: "Inscribe" },
                { route: "/wallet/send", text: "Send" },
                { route: "/wallet/receive", text: "Receive" }
            ]
        }
    }
}
</script>
<style scoped>
.show_wide {
    display: none;
}

.hide_wide {
    display: inline
}


.side_menu {
    position: fixed;
    width: 200px;
}

@media (min-width:992px) {
    .show_wide {
        display: inline
    }

    .hide_wide {
        display: none;
    }

    .no_decorate * {
        text-decoration: none !important;
    }
}

@media (max-height: 850px) {
    .hide-short {
        display: none;
    }
}
</style>
<template>
    <main class="container">
        <div>
            <span class="hide_wide">
                <MobileMenu :menu="menu" />
            </span>
            <div class="side_menu show_wide">
                <SideMenu :menu="menu" />
                <blockquote class="hide-short no_decorate">
                    <p>
                        Balance
                        <br />
                        <RouterLink to="/wallet#balance" :data-tooltip='`~${(userState.SatToUSD * (userState.wallets?.at(0)?.balance || 0)).toFixed(2)} USD`' data-placement="top">{{ userState.wallets?.at(0)?.balance }}</RouterLink>
                    </p>
                    <p>
                        Inscriptions in wallet
                        <br />
                        <RouterLink to="/wallet#ords">{{ userState.wallets?.at(0)?.inscriptions.length }}</RouterLink>
                    </p>
                    <p>
                        Pending transactions
                        <br />
                        <RouterLink to="/wallet#transactions">{{ userState.wallets?.at(0)?.transactions.filter(t => t.confirmations === 0).length }}</RouterLink>
                    </p>
                </blockquote>
            </div>
        </div>
        <div>
            <Estimates />
            <RouterView />
        </div>
    </main>
</template>