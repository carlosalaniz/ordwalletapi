<script lang="ts" >
import { reloadState, userState } from '@/client';
import LoadAsync from '@/components/LoadAsync.vue';
import router from '@/router';
import type { PropType } from 'vue';
export default {
    data() {
        return {
            mnemonic: [] as string[],
            username: "",
            password: "",
            passwordRepeat: "",
            resister: undefined as any
        }
    },
    components: {
        LoadAsync
    },
    props: {
        walletState: Object as PropType<WalletState>
    },
    methods: {
        async onSuccess(data: { mnemonic: string, token: string }) {
            debugger;
            await reloadState(data.token);
            this.mnemonic = data.mnemonic.split(" ");
        },
        confirmMnemonic() {
            router.push("/wallet")
        },
        doRegister() {
            this.resister = async () => {
                //@ts-ignore
                const response = await userState.authClient?.register(
                    {
                        username: this.username,
                        password: this.password
                    }
                )
                return response;
            }
        }
    }
}
</script>
<style scoped>
.mnemonic summary {
    text-align: right !important;
}

.mnemonic details p {
    text-align: left !important;
}


.mnemonic .word {
    text-transform: uppercase;
    background-color: var(--secondary);
    color: var(--primary-inverse);
    padding: .25rem;
}

.mnemonic .word-wrapper {
    padding: .5rem .5rem;
    display: inline-block;
    /* padding: .2rem 1.5rem; */
    margin: .5rem;
    border: 1px solid var(--secondary);
}

.mnemonic .mnemonic-box {
    text-align: center;
    border: 1px solid var(--secondary);

}
</style>
<template>
    <div class="container">
        <h1>Register an account.</h1>
        <LoadAsync :call="resister" @success="onSuccess" loading-message="Registering" />
        <dialog :open="mnemonic.length > 0">
            <article aria-readonly="true" class="mnemonic">
                <header>
                    Mnemonic
                </header>
                Write down and store your mnemonic somewhere safe!
                <div class="mnemonic-box">
                    <span class="word-wrapper" v-for="word, i in mnemonic">{{ i + 1 }}. <span class="word">{{ word }}</span></span>
                </div>
                <hr />
                <button @click="confirmMnemonic()">Understood.</button>
                <footer>
                    <details>
                        <summary>
                            More about Mnemonics
                        </summary>
                        <p>
                            A recovery phrase is a sequence of words that can be used to recover a Bitcoin wallet.
                            It is also commonly referred to as a seed phrase, backup phrase, or mnemonic phrase.
                        </p>

                        <p>

                            This phrase is used to recover your wallet in case you lose your wallet
                            password, your computer crashes, or your device is lost or stolen.
                        </p>

                        <p>

                            The recovery phrase is only once, and it's important to keep it safe and secure because anyone
                            with
                            access to the recovery phrase can gain access to your Bitcoin wallet. It's recommended to write
                            down
                            the recovery phrase on paper and keep it in a secure location that's only accessible to you.
                            Some
                            hardware wallets also provide an additional layer of security by requiring a physical button
                            press
                            to display the recovery phrase on the device's screen.
                        </p>

                    </details>
                </footer>

            </article>
        </dialog>
        <article>
            <div>
                Email
                <input v-model="username" type="email" placeholder="Email" />
            </div>
            <div>
                Password
                <input v-model="password" type="password" placeholder="Password" />
            </div>
            <div>
                Repeat Password
                <input v-model="passwordRepeat" type="password" placeholder="Repeat Password" />
            </div>
            <hr />
            <button @click="doRegister()">Register</button>
        </article>
    </div>
</template>