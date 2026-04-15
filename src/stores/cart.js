import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// defineStore('id', setup fn) — the id is unique across the app
export const useCartStore = defineStore('cart', () => {
  // Restore cart from localStorage on first load (empty array if nothing saved)
  const saved = localStorage.getItem('cart-items')
  const items = ref(saved ? JSON.parse(saved) : [])

  // computed (getter)
  const total = computed(() => items.value.length)

  // watch: runs whenever items changes
  // deep: true is required to detect changes inside the array (push/splice)
  // Every change syncs to localStorage so the cart survives a page refresh
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart-items', JSON.stringify(newItems))
    },
    { deep: true }
  )

  // actions
  function addItem(name) {
    items.value.push(name)
  }

  function removeItem(index) {
    items.value.splice(index, 1)
  }

  return { items, total, addItem, removeItem }
})
