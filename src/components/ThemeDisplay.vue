<script setup>
import { inject } from 'vue'

// inject() reads what the ancestor provided — no prop needed
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <div :style="{ background: theme === 'dark' ? '#222' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#111', padding: '12px', borderRadius: '6px' }">
    <p>Current theme (from inject): <strong>{{ theme }}</strong></p>
    <button @click="toggleTheme">Toggle theme</button>
  </div>
</template>
