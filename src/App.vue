<script setup>
// App.vue is now the router shell — it owns the nav bar and the <RouterView />.
// All the Vue concept demos moved to src/views/DemoView.vue.
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <!-- Nav bar — RouterLink renders an <a> tag and handles client-side navigation -->
  <nav style="
    background: #1e1b4b; padding: 12px 24px;
    display: flex; gap: 20px; align-items: center;
    font-family: sans-serif;
  ">
    <RouterLink
      to="/"
      style="color: white; text-decoration: none; font-weight: 700; font-size: 1.05em;"
    >
      Vue Demos
    </RouterLink>
    <RouterLink to="/register" style="color: #a5b4fc; text-decoration: none; font-size: 0.95em;">
      Register (12)
    </RouterLink>
  </nav>

  <!-- RouterView renders whichever component matches the current URL -->
  <RouterView />
</template>

<style>
/* Vue Router automatically adds .router-link-exact-active when the href matches exactly */
nav a.router-link-exact-active {
  text-decoration: underline !important;
  color: white !important;
}
</style>

