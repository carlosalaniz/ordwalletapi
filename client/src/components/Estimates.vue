<script lang="ts">
import { userState } from "@/client"
import deepEqual from 'deep-equal';
export default {
    data() {
        return {
            userState,
            blink: false
        }
    },
    watch: {
        "userState.fees": {
            handler(newValue, oldValue) {
                if (!deepEqual(newValue, oldValue)) {
                    this.blink = true;
                    setTimeout(() => { this.blink = false }, 200)
                }
            },
            deep: true
        }

    }
}
</script>
<style>
.no-bottom-margin {
    margin-bottom: 0;
}

.blink {
    background-color: var(--card-background-color);
}

.animated {
    transition: background-color 200ms ease;
}

.lastupdate {
    text-align: right;
}

.rounded-bottom {
    padding-bottom: 2px;
    border-bottom: 1px var(--secondary) solid;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>
<template>
    <section class="rounded-bottom">
        <span>
            <span><b><abbr title="Provided by mempool.">Latest estimates.</abbr></b></span>
        </span>
        <table :class="{ blink: blink, animated: true }">
            <thead>
                <tr>
                    <th scope="col">No priority</th>
                    <th scope="col">Low priority</th>
                    <th scope="col">Medium priority</th>
                    <th scope="col">High priority</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ userState.fees?.economyFee }}</td>
                    <td>{{ userState.fees?.hourFee }}</td>
                    <td>{{ userState.fees?.halfHourFee }}</td>
                    <td>{{ userState.fees?.fastestFee }}</td>
                </tr>
            </tbody>
        </table>
        <div class="lastupdate">Last estimates update: {{ new Date().toLocaleTimeString() }}</div>
    </section>
</template>
