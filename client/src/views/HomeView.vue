
<script setup lang="ts">
import DeleteAndType from '../components/deleteAndType.vue';
import {userState} from "../client";

</script>
<script lang="ts">;
export default {
    data() {
        return {
            walletState: userState,
            messages: [
                "Create",
                "Store",
                "Send",
                "Receive",
                "Trade"
            ]
        }
    }
}
</script>
<style>
.top-margin {
    margin-top: 60px;
}
</style>
<template>
    <div class="top-margin container">
        <h1>>
            <DeleteAndType :messages="messages" :show-for="2000" /> Inscriptions
        </h1>
        <p>
            Your marketplace for inscribing, storing, viewing, and trading Ordinals. View your balances,
            transactions, and inscriptions in the dashboard, or easily send/receive inscriptions to any wallet that supports coin management.
            To get started, create your wallet here.
        </p>
    </div>
</template>