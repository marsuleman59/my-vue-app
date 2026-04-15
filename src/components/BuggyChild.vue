<script setup>
// Deliberately throws when the button is clicked.
// The error bubbles up to the parent's onErrorCaptured hook.
function crash() {
  throw new Error('BuggyChild crashed on purpose!')
}
</script>

<template>
  <button @click="crash" style="color: darkred;">
    Crash child → triggers onErrorCaptured in parent
  </button>
</template>
