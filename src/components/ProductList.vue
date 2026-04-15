<script setup>
import { useCartStore } from '../stores/cart'

// Any component can call useCartStore() and get the same shared state
const cart = useCartStore()

const products = ['Apples', 'Bread', 'Milk', 'Eggs', 'Cheese']
</script>

<template>
  <div>
    <p style="color: gray; font-size: 0.9em;">
      This is a <em>separate</em> component. It reads and writes the same
      Pinia store as App.vue — no props or emits needed.
    </p>

    <strong>Products:</strong>
    <ul>
      <li v-for="product in products" :key="product">
        {{ product }}
        <button @click="cart.addItem(product)" style="margin-left: 8px;">Add to cart</button>
      </li>
    </ul>
  </div>
</template>
