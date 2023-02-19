<script lang="ts">
import OrdDetails from "./OrdDetails.vue"
import { userState } from "../../client";
import type { PropType } from "vue";

export default {
    components: {
        OrdDetails
    },
    data() {
        return {
            modal: false,
            selected: null as string | null,
        }
    },
    emits: ['picked'],
    props: {
        available: Object as PropType<string[]>
    },
    methods: {
        onSelected(ordId: string) {
            this.selected = ordId;
            this.modal = false;
            this.$emit("picked", ordId);
        }
    }
}
</script>
<style>
.no-bottom-margin {
    margin-bottom: 0;
    position: relative;
    z-index: 1;
}

.ord-viewer {
    overflow: hidden;
    position: relative;
    background-color: var(--contrast);
}

.sliding-background {
    top: 0;
    left: 0;
    position: absolute;
    /* background-color: rgba(0, 0, 0, 100); */
    height: 100%;
    width: 5076px;
    z-index: 0;
    background-image:
        url("https://ordinals.com/content/83a81ce5b7bda53792abbb73ed2b28a62addd9a459618dab2fbd6d07fd6abf4fi0"),
        url("https://ordinals.com/content/83a81ce5b7bda53792abbb73ed2b28a62addd9a459618dab2fbd6d07fd6abf4fi0")
        /* url("https://ordinals.com/content/83a81ce5b7bda53792abbb73ed2b28a62addd9a459618dab2fbd6d07fd6abf4fi0"), */
        /* url("https://ordinals.com/content/83a81ce5b7bda53792abbb73ed2b28a62addd9a459618dab2fbd6d07fd6abf4fi0"), */
    ;
    background-position-x: 0, 40px;
    background-position-y: 10px;
    background-repeat: none;
    background-size: auto calc(100% - 20px);
    opacity: 0.3;
    animation: slide 60s linear infinite;
}

@keyframes slide {
    0% {
        transform: translate3d(0, 0, 0);
    }

    100% {
        transform: translate3d(-1692px, 0, 0);
    }
}

.clearfix {
    margin: 0 0;
    padding-top: 5%;
    padding-bottom: 5%;
}

.height-max {
    max-height: 90%;
    min-width: 75%;
    position: relative;
}

.top-margin {
    padding-top: calc(var(--font-size) + var(--typography-spacing-vertical))
}

.fixed-dialog-header {
    /* position: fixed; */
    /* width: 100%; */
}
</style>
<template>
    <dialog :open="modal">
        <article class="height-max">
            <header class="fixed-dialog-header">
                <span>
                    <a href="#close" aria-label="Close" class="close" @click="modal = false"></a>
                    Who are you getting rid of?
                </span>
            </header>
            <div v-for="ordId in available">
                <OrdDetails :ordId="ordId" action-text="Select" @action-activated="onSelected" />
                <hr />
            </div>
        </article>
    </dialog>
    <article :class="{ clearfix: selected }">
        <button v-if="!selected" class="no-bottom-margin" @click="modal = true">Pick an ordinal</button>
        <OrdDetails v-if="selected" :ordId="selected" action-text="Change" @action-activated="() => { modal = true }" />
    </article>
</template>