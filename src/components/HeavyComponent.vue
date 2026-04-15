<script setup>
// Top-level await makes this an async component.
// Vue suspends rendering until the await resolves,
// and <Suspense> in the parent shows the fallback slot meanwhile.
const data = await new Promise((resolve) => {
  setTimeout(() => resolve('Loaded after 2 s!'), 2000)
})
</script>

<template>
  <div style="padding: 10px; border: 1px solid #4caf50; border-radius: 6px; color: #2e7d32;">
    <strong>HeavyComponent</strong>
    <p style="margin: 4px 0;">{{ data }}</p>
  </div>
</template>
