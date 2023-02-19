<script setup lang="ts">
</script>

<script lang="ts">
import type { _RouterLinkI } from 'vue-router';
import type { PropType } from '@vue/runtime-dom';
import router from '@/router';
interface MenuItem {
    text: string, route: string
}
export default {
    mounted() {
    },
    props: {
        menu: {
            type: Object as PropType<MenuItem[]>
        }
    },
    data() {
        return {
            address: location.pathname,
            show: true
        }
    },
    methods: {
        onSelected() {
            router.push(this.address)
        },
        goTop(e: Event) {
            const st = (e.target as HTMLElement).scrollTo;
            st(0, 0)
        }
    }

}
</script>
<style scoped>
.action_button {
    height: 50px;
    width: 50px;
    border-radius: 25px;
    position: fixed;
    right: calc(var(--spacing)/ 2 + var(--scrollbar-width, 0px));
    bottom: var(--spacing);
    background-color: whitesmoke;
    color: var(--secondary);
    border-style: none;
    background-image: url("/topcircle.svg");
    background-size: cover;
    z-index: 99999;
 
}

.menu {
    width: 80%;
}

.menu ul>li {
    text-align: center;
    padding: 15px;
    border: 1px solid white;
}

.close {
    float: right;
}
</style>
<template>
    <select v-model="address" @change="onSelected">
        <option :value="options.route" v-for="options in menu">{{ options.text }}</option>
    </select>
    <a class="action_button" href="#" @click="goTop" role="button"></a>
</template>
