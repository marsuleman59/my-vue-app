<script setup>
import { ref, computed, provide } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import ThemeDisplay from './components/ThemeDisplay.vue'

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

    <!-- 5. provide / inject -->
    <section>
      <h2>5. provide / inject</h2>
      <p style="color: gray; font-size: 0.9em;">
        App.vue calls <code>provide('theme', ...)</code>. The child below reads it
        with <code>inject('theme')</code> — no prop was passed.
      </p>
      <ThemeDisplay />
    </section>
  </div>
</template>
