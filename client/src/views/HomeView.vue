
<script setup lang="ts">
import DeleteAndType from '../components/deleteAndType.vue';
import { userState } from "../client";

</script>
<script lang="ts">
;
export default {
    data() {
        return {
            userState,
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
<style scoped></style>
<template>
    <div class="container">
        <h1>>
            <DeleteAndType :messages="messages" :show-for="2000" /> Inscriptions
        </h1>
        <div class="grid" v-if="!userState.token">
            <section>
                <RouterLink to="/register"><button class="secondary">Register</button></RouterLink>
            </section>
            <section>
                <!-- <button class="secondary">Register</button> -->
                <RouterLink class="contrast" to="/login"><button class="contrast">Login</button></RouterLink>
            </section>
        </div>
        <article>
            Your all-in-one wallet for inscribing, storing, viewing, and trading inscriptions. View your balances,
            transactions, and inscriptions in the dashboard, or easily send/receive inscriptions to any wallet that supports coin management.
            <span v-if="!userState.token">To get started, register above.</span>
        </article>
    </div>
</template>
