<script lang="ts">
import { errorMessages } from '@/client';
import type { PropType } from 'vue';

export default {
    mounted() {
    },
    emits: ["success", "warning", "error"],
    props: {
        call: Object as PropType<() => Promise<Response>>,
        onSuccess: Object as PropType<undefined | (() => Promise<Response>)>,
        onError: Object as PropType<undefined | (() => Promise<Response>)>,
        loadingMessage: String,
        successMessage: String,
        warningMessage: String,
        errorMessage: String
    },
    data() {
        return {
            loading: false,
            state: undefined as "success" | "warning" | "error" | undefined,
            messages: {
                server: undefined as undefined | string,
                warningMessage: this.warningMessage ?? "Something went wrong. Make sure all data is correct and try again!",
                successMessage: this.successMessage ?? "Done!",
                errorMessage: this.errorMessage ?? "Something went wrong. Please reach out to us on twitter or discord!"
            },
            timeout: undefined as number | undefined,
            message() {
                if (this.messages.server) return this.messages.server;
                switch (this.state) {
                    case "error":
                        return this.messages.errorMessage;
                    case "success":
                        return this.messages.successMessage;
                    case "warning":
                        return this.messages.warningMessage;
                }
            }
        }
    },
    watch: {
        call(newCall, oldCall) {
            if (newCall) {
                this.doCall()
            }
        }
    },
    methods: {
        async doCall() {
            clearTimeout(this.timeout);
            this.state = undefined;
            this.loading = true;
            try {
                delete this.messages.server;
                const response = await this.call!()
                const status = response.status.toString();
                const body = await response.json();
                if (/^2\d\d$/.test(status)) {
                    this.state = "success";
                    this.$emit("success", body);
                } else if (/^4\d\d$/.test(status)) {
                    this.$emit("warning", body);
                    debugger;
                    if (body in errorMessages) {
                        this.messages.server = errorMessages[body];
                    }
                    this.state = "warning";
                } else {
                    this.$emit("error", body);
                    this.state = "error";
                }
            } catch (e) {
                console.error(e);
                this.state = "error";
            }
            this.loading = false;
            this.timeout = setTimeout(() => {
                this.state = undefined;
            }, 4000)
        }
    }

}
</script>
<style scoped>
.success {
    background-color: rgba(56, 142, 60);
    color: white;
}

.warning {
    background-color: rgb(238, 198, 31);
    color: black;
}

.error {
    background-color: rgb(169, 29, 54);
    color: black;
}

.float-top {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    padding: 1rem;
    z-index: 200;
}
</style>
<template>
    <div class="float-top" v-if="state" :class="{
        error: 'error' == state,
        warning: 'warning' == state,
        success: 'success' == state
    }">
        {{ message() }}
    </div>
    <dialog :open="loading">
        <article>
            {{ loadingMessage }}...
            <br />
            <progress></progress>
            Hang tight this might take a few.
        </article>
    </dialog>
</template>