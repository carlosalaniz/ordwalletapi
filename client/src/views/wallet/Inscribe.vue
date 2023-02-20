
<script lang="ts">
export default {
    data() {
        return {

        }
    },
    methods: {

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
.disabled{
    text-decoration: line-through;
}
</style>
<template>
    <section>
        <h3 class="no-bottom-margin">Inscribe Your Files</h3>
        <div class="menu">
            <a href="#">Inscribe single file</a> | <a data-tooltip="Coming soon" data-placement="bottom" disabled class="disabled secondary" href="#">Bulk inscriptions</a>
        </div>
        <article style="margin-top: 0;">
            <form>
                <h4>1: Select your file</h4>
                <input type="file">
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
                <input type="number" placeholder="ex. 8" min="0">
                <hr />
                <h4>3. Verify your estimate</h4>
                <details>
                    <summary>Additional information</summary>
                    <p>The estimate gives you an idea of how much the transaction will cost in SATS. We do our best
                        to provide accurate estimates; however, it is still an estimate and may not be 100% accurate
                        every time. Once you click 'Inscribe!' below, your transaction will go through as long as you have
                        enough funds. If you do not have enough funds, you will receive an error message.</p>
                </details>
                <p>Estimate: <mark>87435</mark> SATS</p>
                <hr />
                <h4>4. Go Brrrrr...</h4>
                <button>Inscribe!</button>
            </form>
        </article>
    </section>
</template>