import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// defineStore('id', setup fn) — the id is unique across the app
export const useCartStore = defineStore('cart', () => {
  // state
  const items = ref([])

  // computed (getter)
  const total = computed(() => items.value.length)

  // actions
  function addItem(name) {
    items.value.push(name)
  }

  function removeItem(index) {
    items.value.splice(index, 1)
  }

  return { items, total, addItem, removeItem }
})
