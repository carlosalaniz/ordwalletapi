<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import "@picocss/pico/css/pico.min.css";
import "./assets/pico.theme.css";
import IconCoins from './components/icons/IconCoins.vue';
import IconDiscord from './components/icons/IconDiscord.vue';
import IconTwitter from './components/icons/IconTwitter.vue';
import cursor from './components/Cursor.vue';
import { useRoute } from "vue-router";
import { computed, inject } from 'vue';
const route = useRoute();
const currentRouteName = computed(() => {
  var name = route.name?.toString().replace(/\b\w/g, function (l) { return l.toUpperCase() })
  return name;
});

</script>
<style scoped>
.message {
  --nav-link-spacing-vertical: 1rem;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  z-index: 100;
  position: fixed;
  bottom: 50%;
  right: 0;
  left: 0;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--nav-background-color);
  box-shadow: 1px 0 var(--nav-border-color);
  height: 3rem;
  text-align: center;
  padding: 10px;

}

.message .message {
  font-weight: bolder;
  color: var(--contrast)
}



.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  padding: 0 10px;
}

.logo>span {
  color: var(--primary);
}

.logo>.icon>svg {
  height: 20px;
  width: 20px;
}

nav .router-link-active {
  /* --background-color: var(--primary-focus); */
  /* color: var(--contrast); */
  background-color: var(--primary-focus);
}

.navigator-title {
  display: none;
  margin-left: calc(var(--spacing) * 1.5);
  color: var(--h1-color)
}

.wide_only {
  display: none !important;
}

.hide_wide {
  display: flex !important;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  padding: 0 10px;
}

@media (min-width:992px) {
  .logo {
    height: 70px;
  }

  .navigator-title {
    display: inline
  }

  .wide_only {
    display: flex !important;
  }

  .small_only {
    display: none !important;
  }
}

.bitcoin-orange {
  color: #f2a900 !important;
}

.lean-right {
  text-align: right;
}

.top-margin {
  margin-top: calc(var(--block-spacing-vertical) + 3.5rem)
}
</style>
<style>
body {
  min-height: 900px;
}

body>main {
  padding-top: unset !important;
}
</style>
<template>
  <nav class="container">
    <ul>
      <li>
        <RouterLink to="/">
          <span class="logo small_only">x<span class="bitcoin-orange">
              Ord
            </span>
            <span>.net</span>
          </span>
          <span class="logo wide_only">Extra<span class="icon">
              <IconCoins />
            </span>rdinal<span>.net</span></span>
        </RouterLink>
      </li>
      <li class="navigator-title">>
        <cursor /> {{ currentRouteName }}
      </li>
    </ul>
    <ul>
      <li v-if="userState.token">
        <a href="#" @click="logout()">Logout</a>
      </li>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/wallet">Wallet</RouterLink>
      </li>
      <li>
        <a href="#" disabled data-tooltip="Coming soon" data-placement="bottom" class="secondary">Marketplace</a>
      </li>
      <li class="wide_only">|</li>
      <li class="wide_only">
        <a href="https://twitter.com/extra_ordinal" target="_blank" class="contrast">
          <IconTwitter />
        </a>
      </li>
      <li class="wide_only">
        <a href="https://discord.gg/CpjqQe4X" target="_blank" class="contrast">
          <IconDiscord />
        </a>
      </li>
    </ul>
  </nav>
  <div v-if="overlay_message" class="message container-fluid">
    <div class="container">
      <span class="message">{{ overlay_message }}</span>
    </div>
  </div>

  <RouterView class="top-margin" />
  <div class="container">
    <footer class="lean-right">

      <hr>

      <p>
        <small><a href="https://discord.gg/CpjqQe4X" target="_blank">Discord</a> / <a href="https://twitter.com/extra_ordinal" target="_blank">Twitter</a></small> [ Made with ❤️ in ATX ]
      </p>
    </footer>
  </div>
  <dialog :open="userState.reloading">
    <article>
      <span aria-busy="true">Loading your wallet data, please wait... </span>
    </article>
  </dialog>
</template>
<script lang="ts">
import { userState, resetState } from "./client";
import router from './router';
export default {
  name: "App",
  data() {
    return {
      overlay_message: undefined as undefined | string,
      userState
    }
  },
  mounted() {
    // this.updateCurrentPage()
  },
  watch: {
    'userState.token': function (newToken) {
      if (!newToken) {
        this.showMessageFor("Your session timed out, please login again.", 5000)
        router.push("/");
      }
    }
  },
  methods: {
    logout() {
      resetState()
    },
    showMessageFor(message: string, forMS: number) {
      this.overlay_message = message;
      setTimeout(() => {
        this.overlay_message = undefined;
      }, forMS)
    }
  }
}
</script>

