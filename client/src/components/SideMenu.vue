<script setup lang="ts">
import IconMenu from './icons/IconMenu.vue';
</script>

<script lang="ts">
import type { _RouterLinkI } from 'vue-router';
import type { PropType } from '@vue/runtime-dom';
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
            location.pathname = this.address;
        }
    }

}
</script>
<style scoped>
aside li {
    text-transform: uppercase;
    padding: .5rem;
}

aside li a:active,
.router-link-exact-active {
    color: var(--contrast);
    border-bottom: solid 1px var(--contrast);

}

.close {
    float: right;
}
</style>
<template>
    <aside>
        <nav>
            Menu
            <hr>
            <ul>
                <li v-for="options in menu">
                    <summary>
                        <RouterLink :to="options.route">{{ options.text }}</RouterLink>
                    </summary>
                </li>
            </ul>
            <hr>
        </nav>
    </aside>
</template>
