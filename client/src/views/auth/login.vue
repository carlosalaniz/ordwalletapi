<script lang="ts" >
import { reloadState, userState } from '@/client';
import LoadAsync from '@/components/LoadAsync.vue';
import router from '@/router';
import type { PropType } from 'vue';
export default {
    data() {
        return {
            username: "",
            password: "",
            passwordRepeat: "",
            login: undefined as any
        }
    },
    components: {
        LoadAsync
    },
    props: {
        walletState: Object as PropType<WalletState>
    },
    methods: {
        async onSuccess(data: any) {
            await reloadState(data.token);
            router.push("/wallet")
        },
        doLogin() {
            this.login = async () => {
                //@ts-ignore
                return await userState.authClient?.login(
                    this.username,
                    this.password
                )
            }
        }
    }
}
</script>
<template>
    <div class="container">
        <h1>Login</h1>
        <LoadAsync :call="login" @success="onSuccess" loading-message="Authenticating" />
        <article>
            <form>
                <div>
                    Email
                    <input v-model="username" autocomplete="username" type="email" placeholder="Email" />
                </div>
                <div>
                    Password
                    <input v-model="password" autocomplete="current-password" type="password" placeholder="Password" />
                </div>
            </form>
            <hr />
            <button @click="doLogin()">Login</button>
        </article>
    </div>
</template>