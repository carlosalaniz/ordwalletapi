
<script lang="ts">
import type { PropType } from 'vue';
import cursor from './Cursor.vue';
export default {
    mounted() {
        this.message = this.messages![this.currentIndx]
        setTimeout(() => {
            this.loop()
        }, this.showFor ?? 2000)
    },
    data() {
        return {
            counter: 1,
            currentIndx: 0,
            message: ""
        }
    },
    components: {
        cursor
    },
    props: {
        messages: Object as PropType<string[]>,
        typingSpeed: Number,
        showFor: Number,
    },
    methods: {
        async loop() {
            while (true) {
                const newMessage = this.messages![this.counter++ % (this.messages!.length)];
                await this.replace(newMessage);
                await new Promise((r) => { setTimeout(() => r(1), this.showFor ?? 2000) });
            }
        },
        async replace(msg: string) {
            const originalLength = this.message.length;
            for (let i = 0; i < originalLength; i++) {
                this.message = this.message.slice(0, -1);
                await new Promise((r) => { setTimeout(() => r(1), this.typingSpeed ?? 100) });
            }
            const message = msg.split("")
            for (let i = 0; i < message.length; i++) {
                this.message += message[i];
                await new Promise((r) => { setTimeout(() => r(1), this.typingSpeed ?? 100) });
            }
        }
    }
}
</script>
<template>
    {{ message }}<cursor />
</template>