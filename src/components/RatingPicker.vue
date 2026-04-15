<script setup>
// defineEmits declares the events this component can fire
const emit = defineEmits(['rate'])

function pick(star) {
  // emit(eventName, payload) — sends the value up to the parent
  emit('rate', star)
}
</script>

<template>
  <div>
    <button v-for="star in 5" :key="star" @click="pick(star)" style="font-size: 1.4rem; cursor: pointer; background: none; border: none;">
      ⭐
    </button>
  </div>
</template>
