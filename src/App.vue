<script setup>
import { ref, computed, provide, watch, watchEffect } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import ThemeDisplay from './components/ThemeDisplay.vue'
import RatingPicker from './components/RatingPicker.vue'
import ProductList from './components/ProductList.vue'
import { useCartStore } from './stores/cart'

// 1. Reactive state with ref()
const count = ref(0)
const name = ref('')
const showSecret = ref(false)

// 2. Computed property — auto-updates when count changes
const doubled = computed(() => count.value * 2)

// 3. Array for v-for demo
const fruits = ref(['Apple', 'Banana', 'Cherry'])

function addFruit() {
  const options = ['Mango', 'Grape', 'Peach', 'Kiwi', 'Plum']
  fruits.value.push(options[Math.floor(Math.random() * options.length)])
}

// 5. provide / inject
// provide() makes values available to ALL descendants — no props needed
const theme = ref('light')
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
provide('theme', theme)
provide('toggleTheme', toggleTheme)

// 6. emits
// The child fires an event; the parent catches it here
const rating = ref(null)
function onRate(star) {
  rating.value = star
}

// 7. Pinia store — shared global state
// useCartStore() returns the same store instance everywhere it's called
const cart = useCartStore()

// 8. watch — explicit watcher, gives you old and new value
// Watches a single ref; only runs when count changes (not on mount)
const lastCountChange = ref(null)
watch(count, (newVal, oldVal) => {
  lastCountChange.value = `${oldVal} → ${newVal}`
})

// 8b. watchEffect — no explicit source; auto-tracks every reactive value read inside
// Runs immediately on mount, then re-runs whenever cart.total changes
watchEffect(() => {
  document.title = cart.total > 0 ? `Cart (${cart.total}) — My Vue App` : 'My Vue App'
})
</script>

<template>
  <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px;">
    <!-- Passing a prop to a child component -->
    <HelloWorld :greeting="name || 'World'" />


    <hr />

    <!-- 1. v-model: two-way binding -->
    <section>
      <h2>1. v-model (two-way binding)</h2>
      <input v-model="name" placeholder="Type your name" style="padding: 4px 8px;" />
      <p>Hello, <strong>{{ name || 'stranger' }}</strong>!</p>
    </section>

    <hr />

    <!-- 2. ref + computed -->
    <section>
      <h2>2. ref &amp; computed</h2>
      <button @click="count++">Count: {{ count }}</button>
      <button @click="count--" style="margin-left: 8px;">−</button>
      <p>Doubled (computed): <strong>{{ doubled }}</strong></p>
    </section>

    <hr />

    <!-- 3. v-if / v-else -->
    <section>
      <h2>3. v-if / v-else</h2>
      <button @click="showSecret = !showSecret">Toggle secret</button>
      <p v-if="showSecret">The secret is: <strong>42</strong></p>
      <p v-else>Secret hidden. Click to reveal.</p>
    </section>

    <hr />

    <!-- 4. v-for -->
    <section>
      <h2>4. v-for (list rendering)</h2>
      <ul>
        <li v-for="(fruit, i) in fruits">{{i + 1 + ' ' + fruit }}</li>
      </ul>
      <button @click="addFruit">Add random fruit</button>
    </section>

    <hr />

    <!-- 6. emits -->
    <section>
      <h2>6. emits (child → parent)</h2>
      <p style="color: gray; font-size: 0.9em;">
        The child calls <code>emit('rate', star)</code>. The parent listens with
        <code>@rate="onRate"</code> and receives the value.
      </p>
      <!-- @rate listens for the 'rate' event emitted by RatingPicker -->
      <RatingPicker @rate="onRate" />
      <p v-if="rating">You rated: <strong>{{ rating }} / 5</strong></p>
      <p v-else style="color: gray;">Pick a star above</p>
    </section>

    <hr />

    <!-- 5. provide / inject -->
    <section>
      <h2>5. provide / inject</h2>
      <p style="color: gray; font-size: 0.9em;">
        App.vue calls <code>provide('theme', ...)</code>. The child below reads it
        with <code>inject('theme')</code> — no prop was passed.
      </p>
      <ThemeDisplay />
    </section>

    <hr />

    <!-- 7. Pinia -->
    <section>
      <h2>7. Pinia (global store)</h2>
      <p style="color: gray; font-size: 0.9em;">
        <code>ProductList</code> and <code>App.vue</code> both call
        <code>useCartStore()</code> — they share the exact same state.
      </p>

      <!-- ProductList adds items to the store -->     
      <ProductList />

      <hr style="border-style: dashed;" />

      <!-- App.vue reads the same store directly -->
      <strong>Cart ({{ cart.total }} item{{ cart.total === 1 ? '' : 's' }}):</strong>
      <p v-if="cart.items.length === 0" style="color: gray;">Empty — add something above</p>
      <ul v-else>
        <li v-for="(item, i) in cart.items" :key="i">
          {{ item }}
          <button @click="cart.removeItem(i)" style="margin-left: 8px;">Remove</button>
        </li>
      </ul>
    </section>

    <hr />

    <!-- 8. watch & watchEffect -->
    <section>
      <h2>8. watch &amp; watchEffect</h2>
      <p style="color: gray; font-size: 0.9em;">
        <code>watch(source, callback)</code> — explicit, only runs when <em>source</em> changes, gives you old + new values.<br />
        <code>watchEffect(fn)</code> — auto-tracks every reactive value read inside <em>fn</em>, runs immediately on mount.
      </p>

      <!-- watch demo: uses the count from section 2 above -->
      <strong>watch — tracking count changes:</strong>
      <p style="color: gray; font-size: 0.9em;">
        Defined as <code>watch(count, (newVal, oldVal) => ...)</code>.<br />
        Increment/decrement the counter in section 2, then check back here.
      </p>
      <p>
        Last change:
        <span v-if="lastCountChange" style="font-family: monospace; background: #f4f4f4; padding: 2px 6px; border-radius: 4px;">{{ lastCountChange }}</span>
        <span v-else style="color: gray;">not changed yet</span>
      </p>

      <!-- watchEffect demo: document title -->
      <strong>watchEffect — browser tab title:</strong>
      <p style="color: gray; font-size: 0.9em;">
        Defined as <code>watchEffect(() => { document.title = cart.total > 0 ? \`Cart (${cart.total})...\` : '...' })</code>.<br />
        It reads <code>cart.total</code>, so Vue tracks that dependency automatically — no explicit source needed.<br />
        Add or remove cart items above and watch the browser tab title update.
      </p>
    </section>
  </div>
</template>
