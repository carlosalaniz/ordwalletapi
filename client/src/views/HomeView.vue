
<script setup lang="ts">
import DeleteAndType from '../components/deleteAndType.vue';
import { userState } from "../client";

</script>
<script lang="ts">
;
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
<style scoped>

</style>
<template>
    <div class="container">
        <h1>>
            <DeleteAndType :messages="messages" :show-for="2000" /> Inscriptions
        </h1>
        <div class="grid">
            <RouterLink role="button" class="secondary" to="/register">Register</RouterLink>
            <!-- <button class="secondary">Register</button> -->
            <RouterLink role="button" class="contrast" to="/login">Login</RouterLink>

        </div>
        <article>
            Your all-in-one wallet for inscribing, storing, viewing, and trading Ordinals. View your balances,
            transactions, and inscriptions in the dashboard, or easily send/receive inscriptions to any wallet that supports coin management.
            To get started, create your wallet here.
        </article>
    </div>
</template>
