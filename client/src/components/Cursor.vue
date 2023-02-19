<script lang="ts">
export default {
    mounted() {
        setInterval(() => {
            this.show = !this.show;
        }, 400)
    },
    data() {
        return {
            show: true
        }
    },
}
</script>
<style scoped>
.hide {
    visibility: hidden;
}
</style>
<template>
    <span :class="{ hide: !show }">_</span>
</template>