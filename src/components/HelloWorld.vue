<script setup>
// defineProps: receive data from the parent
const props = defineProps({
  greeting: {
    type: String,
    default: 'World'
  }
})
</script>

<template>
  <section>
    <h1>Hello, {{ props.greeting }}! 👋</h1>
    <p style="color: gray; font-size: 0.9em;">↑ This text comes from a <strong>prop</strong> passed by the parent.</p>
  </section>
</template>
