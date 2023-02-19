
<script lang="ts">
import QrcodeVue from 'qrcode.vue'
export default {
    data() {
        return {

        }
    },
    methods: {

    },
    components: {
        QrcodeVue,
    },
}
</script>
<template>
    <h5>Receive funds</h5>
    <p>
        Use the address bellow to send funds to this wallet.
    </p>
    <p>
        Remember, Bitcoin transactions are irreversible, so it's important to double-check your Bitcoin address before sharing it with others. Also, keep in mind that Bitcoin transaction fees may apply, which can affect the amount of Bitcoin you receive.
    </p>
    <section class="grid">
        <div>
            <textarea style="width: 100%;height: 100%; resize: none;" readonly>1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2</textarea>
            <div>
            </div>
        </div>
        <div>
            <div style="text-align: center;">
                <qrcode-vue value="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" :margin="1" :size="300" level="H" />
            </div>
        </div>
    </section>
    <hr />
    <section>
        <button role="button" href="#">Generate new address</button>
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