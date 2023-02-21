
<script lang="ts">
import { reloadState, userState } from '@/client';
import LoadAsync from '@/components/LoadAsync.vue';
import router from '@/router';
export default {
    data() {
        return {
            userState,
            objectURL: undefined as string | undefined,
            byteSize: 0 as number,
            file: null as File | null,
            fileName: null as string | null,
            estimateCal: null as null | number,
            fee: 0 as null | number,
            inscribe: null as null | (() => Promise<Response>)
        }
    },
    components: {
        LoadAsync,
    },
    methods: {
        onFileChange(e: any) {
            const file = e.target.files[0];
            this.estimateCal = null;
            if (file.size >= 400000) {
                confirm("File too large!");
                e.target.type = "text";
                e.target.type = "file";
                this.file = null;
                return;
            }
            this.file = file;
            this.objectURL = URL.createObjectURL(file);
            this.byteSize = file.size;
            this.fileName = file.name;
            this.estimate()
        },
        estimate() {
            this.estimateCal = Math.round(this.byteSize / 4 * this.fee! ?? 0)
        },
        doInscribe() {
            //@ts-ignore
            this.inscribe = async () => {
                //@ts-ignore
                return await userState.walletClient?.inscribe(
                    //@ts-ignore    
                    this.userState.wallets?.at(0)?.id,
                    this.file!,
                    this.fee!
                )
            }
        },
        async onSuccess(a: any) {
            await reloadState();
            router.push("/wallet");
        }
    }
}
</script>
<style scoped>
.no-bottom-margin {
    margin-bottom: 0;
}

.menu {
    text-align: right;
    margin-bottom: .5rem;
}

.disabled {
    text-decoration: line-through;
}

.preview div {
    text-align: right;
}

.preview img {
    border: 1px solid var(--secondary);
    width: 100%;
}
</style>
<template>
    <section>
        <h3 class="no-bottom-margin">Inscribe Your Files</h3>
        <div class="menu">
            <a href="#">Inscribe single file</a> | <a data-tooltip="Coming soon" data-placement="bottom" disabled class="disabled secondary" href="#">Bulk inscriptions</a>
        </div>
        <article style="margin-top: 0;">
            <h4>1: Select your file <small>(limit: 400,000 bytes)</small></h4>
            <input type="file" @change="onFileChange">
            <div v-if="file" class="preview">
                <hr />
                <img :src="objectURL" />
                <div>File Size: {{ byteSize }} Bytes</div>
            </div>
            <hr />
            <h4>2: Select your fee</h4>
            <details>
                <summary>About Bitcoin fees</summary>
                <p>Fees in Bitcoin are payments made to miners who verify and confirm transactions on the Bitcoin network. Whenever a Bitcoin transaction is sent, the sender has the option to include a transaction fee as an incentive for miners to prioritize their transaction and add it to the next block in the blockchain.
                    <br>
                    <br>
                    Transaction fees in Bitcoin vary depending on the congestion of the network and the size of the transaction in bytes. Transactions with larger byte size require more computational power and resources to confirm and therefore cost more in transaction fees.
                    <br>
                    <br>
                    The fees paid by the sender are collected by miners who successfully include the transaction in the blockchain, and these fees serve as an additional reward on top of the block reward that miners receive for adding a new block to the blockchain.
                    <br>
                    <br>
                    Fees in Bitcoin are a fundamental aspect of the network, as they provide an incentive for miners to validate transactions and maintain the security and integrity of the blockchain.
                </p>
                <p>Learn more about Bitcoin fees <a href="https://99bitcoins.com/bitcoin/fees/">here.</a></p>

            </details>
            <input type="number" v-model="fee" @change="estimate" placeholder="ex. 8" min="0">
            <hr />
            <h4>3. Verify your estimate</h4>
            <p>Estimate: <span v-if="estimateCal"><mark :data-tooltip='`~${(userState.SatToUSD * estimateCal).toFixed(2)} USD`' data-placement="top">{{ estimateCal }}</mark> SATS</span><span v-else>Set a fee to see an estimate.</span></p>
            <details>
                <summary>On estimates.</summary>
                <p>The estimate gives you an idea of how much the transaction will cost in SATS. We do our best
                    to provide accurate estimates; however, it is still an estimate and may not be 100% accurate
                    every time. Once you click 'Inscribe!' below, your transaction will go through as long as you have
                    enough funds. If you do not have enough funds, you will receive an error message.</p>
                We use the following formula to calculate our estimates:
                <kbd>((Size in KB * 1000) / 4 * fee_rate)</kbd>
            </details>

            <h4>4. Go Brrrrr...</h4>
            <button @click="doInscribe()">Inscribe!</button>
            <LoadAsync :call="inscribe!" @success="onSuccess" loading-message="Inscribing" />
        </article>
    </section>
</template>