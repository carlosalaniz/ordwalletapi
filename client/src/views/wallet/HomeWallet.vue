
<script lang="ts">
import cursor from '../../components/Cursor.vue';
import OrdDetails from "./OrdDetails.vue"
import { userState } from '@/client';

export default {
    mounted() {

    },
    data() {
        return {
            userState
        }
    },
    components: {
        cursor,
        OrdDetails
    },
    methods: {

    }
}
</script>
<style scoped>
.clearfix {
    margin: 0 0;
    padding-top: 5%;
    /* padding-bottom: 5%; */
}

.header {
    padding-top: 5%;
    padding-bottom: 5%;
    margin-bottom: 15px;
}

.no-margin-top {
    margin-top: 0;
}

article {
    min-height: 200px;
    max-height: 500px;
    padding-bottom: 0;
}

article>div {
    overflow-y: auto;
    width: 100%;
    text-overflow: ellipsis;
    height: 90%;
}

table {
    table-layout: fixed;
}

td,
th {
    /* display: block; */
    /* width: 60px; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.confirmations {
    width: 1rem;
}

.walletdata {
    min-height: 300px;
}
</style>
<template>
    <div class="grid no-margin-top">
        <article class="walletdata no-margin-top">
            <header class="header">Balances</header>
            <div>
                <b>Cardinal:</b><br />
                <span :data-tooltip='`~${(userState.SatToUSD * (userState.wallets?.at(0)?.balance || 0)).toFixed(2)} USD`' 
                        data-placement="right">{{ userState.wallets?.at(0)?.balance }}</span>
                <hr />
                <b>Inscriptions:</b><br />
                {{ userState.wallets?.at(0)?.inscriptions.length }}

            </div>
        </article>
        <article class="no-margin-top">
            <header class="header">Transactions</header>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th class="confirmations">
                                #
                            </th>
                            <th>Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tx in userState.wallets?.at(0)?.transactions">
                            <td>{{ tx.confirmations! }}</td>
                            <td><a target="_blank" :href="`https://mempool.space/tx/${tx.transaction}`">{{ tx.transaction }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </article>
    </div>
    <h3>Inscriptions:</h3>
    <hr />
    <div v-for="inscription in userState.wallets?.at(0)?.inscriptions">
        <OrdDetails :ordId="inscription" />
        <hr />
    </div>
    <div v-if="userState.wallets?.at(0)?.inscriptions.length === 0">
        <h5>You don't have any inscriptions yet! </h5>
        <a href="https://ordinals.com/inscription/7df55cc2a90027d50c1f117ef0f9b66dfa4d4afee9e81f96c61819603dc55d4ai0"> Look at Pepe Philippe II for inspiration.</a>
    </div>
</template>