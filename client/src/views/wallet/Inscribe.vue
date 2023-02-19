
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
<style>
.no-bottom-margin {
    margin-bottom: 0;
}
</style>
<template>
    <section>
        <h1 class="no-bottom-margin">Inscribe your files</h1>
        <article style="margin-top: 0;">
            <form>
                <h4>1: Select your file</h4>
                <input type="file">
                <hr />
                <h4>2: Select your fee</h4>
                <input type="number" placeholder="ex. 8">
                <hr />
                <h4>3. Verify your estimate</h4>
                <p>Estimate: <mark>87435</mark> SATS</p>
                <hr />
                <h4>4. Go Brrrrr...</h4>
                <button>Inscribe!</button>
            </form>
        </article>
    </section>
</template>