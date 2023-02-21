
<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import type { PropType } from 'vue';
import { userState, reloadState } from '@/client';
import LoadAsync from '@/components/LoadAsync.vue';
export default {
    data() {
        return {
            userState,
            newAddressCall: null as null | (() => Promise<Response>),
            get addressLength() {
                return this.userState.wallets?.at(0)?.addresses?.length
            }
        }
    },
    methods: {
        getNewAddress() {
            // @ts-ignore
            this.newAddressCall = async () => {
                return await userState.walletClient?.receive(
                    // @ts-ignore    
                    this.userState.wallets?.at(0)?.id
                )
            }
        },
        async onSuccess(body: any) {
            this.userState.wallets?.at(0)?.addresses.unshift(body.address)
        }

    },
    components: {
        QrcodeVue,
        LoadAsync,
    },
}
</script>
<template>
    <h3>Receive Funds or Inscriptions</h3>

    <div v-if="addressLength && addressLength > 0">
        <p>
            Use the address below to receive funds or inscriptions in this wallet.
        </p>
        <p>
            Remember, Bitcoin transactions are irreversible, so it's important to double-check your Bitcoin address before sharing it with others. Also, keep in mind that Bitcoin transaction fees may apply, which can affect the amount of Bitcoin you receive.
        </p>
        <section class="grid">
            <div>
                <textarea style="width: 100%;height: 100%; resize: none;" readonly>{{ userState.wallets?.at(0)?.addresses?.at(0) }}</textarea>
                <div>
                </div>
            </div>
            <div>
                <div style="text-align: center;">
                    <qrcode-vue :value="userState.wallets?.at(0)?.addresses?.at(0)" :margin="1" :size="300" level="H" />
                </div>
            </div>
        </section>
    </div>
    <hr />
    <section>
        <button @click="getNewAddress()" role="button" href="#">Generate new address</button>
        <LoadAsync :call="newAddressCall!" @success="onSuccess" loading-message="Creating a new address" />

        <details>
            <summary>Why should I generate a new address for each transaction in Bitcoin?</summary>
            <p>Generating a new address for each transaction is considered a best practice for several reasons:</p>
            <ul>
                <li>Privacy: By using a new address for each transaction, you can help protect your privacy. Since Bitcoin transactions are publicly visible on the blockchain, reusing the same address can allow others to track your transactions and potentially link them to your identity. Generating a new address for each transaction makes it more difficult for others to trace your activity.</li>
                <li>Security: Generating a new address for each transaction can also help protect you from certain types of attacks. For example, if someone knows your Bitcoin address, they could try to send you a small amount of Bitcoin to your address and then monitor the blockchain to see when you move those funds. If you're reusing the same address, they could potentially use this information to guess your private key and steal your funds. By using a new address for each transaction, you make it more difficult for attackers to monitor your activity and steal your funds.</li>
                <li>Accounting: Finally, generating a new address for each transaction can make it easier to keep track of your transactions for accounting purposes. Since each address represents a separate transaction, it can be easier to keep track of your income and expenses if you use a separate address for each one.</li>
            </ul>
            <p>Overall, generating a new address for each transaction is a simple way to help protect your privacy and security when using Bitcoin.</p>
        </details>
    </section>
</template>