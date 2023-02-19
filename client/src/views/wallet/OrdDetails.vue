

<script lang="ts">
import { loadOrdinalData } from '@/client';

export default {
    async mounted() {
        this.ordData = await loadOrdinalData(this.ordId!);
    },
    data() {
        return {
            ordData: {
                number: null as string | null,
                contentLength: null as string | null,
                contentType: null as string | null,
                timestamp: null as string | null,
                SAT: null as string | null,
                rarity: "unknown"
            }
        }
    },
    emits: ['actionActivated'],
    props: {
        actionText: String,
        ordId: String
    },
    methods: {}
}
</script>
<style>
.no-bottom-margin {
    margin-bottom: 0;
    position: relative;
    z-index: 1;
}

.top-margin {
    padding-top: 0;
}

@media (min-width:992px) {
    .top-margin {
        padding-top: calc(var(--font-size) + var(--typography-spacing-vertical))
    }
}

#wrap {
    width: 100%;
    margin: 0 auto;
    overflow: hidden !important;
}

#frame {
    /* border: 1px solid var(--contrast); */
    flex: 0 100%;
    aspect-ratio: 1 / 1;
    height: 100%;
    width: 100%;
    /* border-radius: 5%; */
    overflow: hidden;

}
</style>
<template>
    <div class="grid" style="margin: 0 auto ;">
        <section class="no-bottom-margin">
            <h2 class="no-bottom-margin"> Inscription #{{ ordData.number}}:</h2>
            <blockquote>
                <p>
                    <b>Content length:</b>
                    <br />
                    {{ ordData.contentLength }}
                    <br />
                    <b>Content type:</b>
                    <br />
                    {{ ordData.contentType }}
                    <br />
                    <b>Timestamp:</b>
                    <br />
                    {{ ordData.timestamp }}
                    <br />
                    <b>SAT:</b>
                    <br />
                    {{ ordData.SAT }}
                    <br />
                    <b>Rarity:</b>
                    <br />
                    {{ ordData.rarity }}
                </p>
            </blockquote>
        </section>
        <section class="">
            <div id="wrap">
                <!-- <iframe sandbox="allow-scripts" id="frame" scrolling="no" loading="lazy" :src="`https://ordinals.com/preview/${ordId}`"></iframe> -->
                <object id="frame" :data="`https://ordinals.com/preview/${ordId}`" type="text/html">
                    Alternative Content
                </object>
            </div>
            <hr v-if="actionText" />
            <button v-if="actionText" class="secondary no-bottom-margin" @click="$emit('actionActivated', ordId)">{{ actionText }}</button>
        </section>
    </div>
</template>