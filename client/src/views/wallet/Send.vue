
<script lang="ts">
import type { PropType } from "vue";
import Ordpicker from "./Ordpicker.vue"
import { userState, reloadState } from "@/client"
import OrdDetails from "./OrdDetails.vue"
import LoadAsync from "@/components/LoadAsync.vue"
import router from "@/router";

export default {
    data() {
        return {
            userState: userState as UserState,
            transferring: false,
            success: undefined,
            feeRate: undefined as number | undefined,
            inscription: undefined as string | undefined,
            destAddress: undefined as string | undefined,
            sendInscription: undefined as undefined | (() => Promise<Response>),
        }
    },
    components: {
        LoadAsync,
        Ordpicker,
        OrdDetails
    },
    methods: {
        onSelected(ordId: string) {
            this.inscription = ordId;
        },
        async onSuccess() {
            router.push("/wallet")
        },
        async send() {
            //@ts-ignore
            this.sendInscription = async () => {
                const response = await userState.walletClient?.send(
                    //@ts-ignore    
                    this.userState.wallets?.at(0)?.id,
                    this.inscription!,
                    this.feeRate!,
                    this.destAddress!
                )
                await reloadState();
                return response;
            }
        }
    }
}
</script>
<style scoped>
.no-bottom-margin {
    margin-bottom: 0;
}

.muted {
    color: #C8C8C8
}

.disabled {
    text-decoration: line-through;
}
</style>
<template>
    <LoadAsync :call="sendInscription" loading-message="Transferring" v-on:success="onSuccess" />
    <div dir="rtl">
        <a href="#">Send Ordinals</a> | <a data-tooltip="Coming soon" data-placement="bottom" disabled class="disabled secondary" href="#">Send BTC</a>
    </div>
    <hr />
    <summary>
        <h3 class="no-bottom-margin">Send an Ordinal</h3>
    </summary>
    <article>
        <h4>1: Pick an ordinal from your collection</h4>
        <Ordpicker :available="userState.wallets?.at(0)?.inscriptions!" :onPicked="onSelected" />
        <hr />
        <h4>2: Input destination address</h4>
        <input type="text" v-model="destAddress" placeholder="Example: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq">
        <hr />
        <h4>3: Select your fee</h4>
        <input type="number" v-model="feeRate" placeholder="ex. 8">
        <hr />
        <h4>4. Read this.</h4>
        <ul>
            <li>Check the recipient's Bitcoin address carefully, as transactions are irreversible and if sent to the wrong
                address cannot be recovered.</li>
            <li>Double-check the inscription you are sending to ensure it is correct.</li>
            <li>Confirm that you have enough Bitcoin in your wallet to cover the transaction and any associated fees.</li>
            <li>Be aware that Bitcoin transactions are not anonymous and can be traced on the blockchain.</li>
        </ul>
        <hr />
        <h4>4. Say goodbye ordinal</h4>
        <button @click="send">Bye Bye ord! 🫡</button>
    </article>
</template>