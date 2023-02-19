
<script lang="ts">
import cursor from '../../components/Cursor.vue';
import OrdDetails from "./OrdDetails.vue"
import type { PropType } from 'vue';
export default {
    mounted() {

    },
    props: {
        walletState: Object as PropType<WalletState>
    },
    data() {
        return {
            message: "Hey there!"
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
</style>
<template>
    <div class="grid no-margin-top">
        <article class="no-margin-top">
            <header class="header">Balances</header>
            <div>
                <b>Cardinal:</b><br />
                {{ walletState?.balance }}
                <hr />
                <b>Inscriptions:</b><br />
                {{ walletState?.inscriptions.length }}

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
                        <tr v-for="tx in walletState?.transactions">
                            <td>2</td>
                            <td><a target="_blank" :href="`https://mempool.space/tx/${tx}`">{{ tx }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </article>
    </div>
    <h1>Inscriptions:</h1>
    <hr />
    <div v-for="inscription in walletState?.inscriptions">
        <OrdDetails :ordId="inscription" />
        <hr />
    </div>
</template>