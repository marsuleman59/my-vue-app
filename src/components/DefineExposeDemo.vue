<script setup>
import { ref } from 'vue'

// Internal state — NOT visible to the parent by default in <script setup>
const count = ref(0)
const message = ref('hello from child')

function increment() {
  count.value++
}

function reset() {
  count.value = 0
}

// defineExpose: explicitly opt-in to what the parent can access via template ref
// Without this, <script setup> keeps everything private
defineExpose({ count, message, increment, reset })
</script>

<template>
  <div style="padding: 10px; border: 1px dashed #aaa; border-radius: 6px;">
    <strong>Child component</strong>
    <p style="margin: 4px 0;">Internal count: <strong>{{ count }}</strong></p>
    <button @click="increment">+ (from inside child)</button>
  </div>
</template>
