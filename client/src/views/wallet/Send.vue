
<script lang="ts">
import type { PropType } from "vue";
import Ordpicker from "./Ordpicker.vue"
import { clients, userState } from "@/client"
export default {
    data() {
        return {
            userState,
            feeRate: undefined as number | undefined,
            inscription: undefined as string | undefined,
            destAddress: undefined as string | undefined,
        }
    },
    components: {
        Ordpicker
    },
    props: {
        walletState: Object as PropType<WalletState>
    },
    methods: {
        onSelected(ordId: string) {
            this.inscription = ordId;
        },
        async send() {
            const response = await clients.walletClient(this.userState.token!).send(
                this.walletState!.id,
                this.inscription!,
                this.feeRate!,
                this.destAddress!
            )
        }
    }
}
</script>
<style>
.no-bottom-margin {
    margin-bottom: 0;
}

.muted {
    color: #C8C8C8
}
</style>
<template>
    <div dir="rtl">
        <a href="#">Send Ordinals</a> | <a disabled class="muted" href="#">Send BTC</a>
    </div>
    <hr />
    <summary>
        <h4 class="no-bottom-margin">Send an ordinal</h4>
    </summary>
    <blockquote>
        <!-- <h1></h1> -->
        <!-- <article style="margin-top: 0;"> -->
        <!-- <form> -->
        <h4>1: Pick an ordinal from your collection</h4>
        <Ordpicker :available="walletState!.inscriptions!" :onPicked="onSelected" />
        <hr />
        <h4>2: Input destination address</h4>
        <input type="text" v-model="destAddress" placeholder="Example: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq">
        <hr />
        <h4>3: Select your fee</h4>
        <input type="number" v-model="feeRate" placeholder="ex. 8">
        <hr />
        <h4>4. Read this.</h4>
        <ul>
            <li>Check the recipient's Bitcoin address carefully, as transactions are irreversible and if sent to the wrong address cannot be recovered.</li>
            <li>Double-check the inscription you are sending to ensure it is correct.</li>
            <li>Confirm that you have enough Bitcoin in your wallet to cover the transaction and any associated fees.</li>
            <li>Be aware that Bitcoin transactions are not anonymous and can be traced on the blockchain.</li>
        </ul>
        <hr />
        <h4>4. Say goodbye ordinal</h4>
        <button @click="send">Bye Bye ord! 🫡</button>
        <!-- </form> -->
        <!-- </article> -->
    </blockquote>
</template>