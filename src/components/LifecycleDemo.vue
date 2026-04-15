<script setup>
import {
  ref,
  onBeforeMount, onMounted,
  onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted,
  onActivated, onDeactivated,
  onErrorCaptured,
  onRenderTracked, onRenderTriggered
} from 'vue'
import BuggyChild from './BuggyChild.vue'

// ── Hook log ───────────────────────────────────────────────────────────────────
// Each hook appends a short entry here so we can see the firing order.
const log = ref([])
function add(hook, desc) {
  log.value.push({ hook, desc })
}

// ── Counter to trigger update hooks ───────────────────────────────────────────
const counter = ref(0)

// ── Error capture ──────────────────────────────────────────────────────────────
const caughtError = ref(null)

// ── 1. onBeforeMount ──────────────────────────────────────────────────────────
// Fires just before Vue inserts the component into the real DOM.
// The DOM elements don't exist yet — you can't read them here.
onBeforeMount(() =>
  add('onBeforeMount', 'Before DOM insertion — template not in the page yet')
)

// ── 2. onMounted ──────────────────────────────────────────────────────────────
// DOM is ready. Safe to access elements, start timers, fetch data.
onMounted(() =>
  add('onMounted', 'DOM ready — start timers, fetch data, read DOM nodes')
)

// ── 3. onBeforeUpdate ─────────────────────────────────────────────────────────
// Fires every time reactive state changes, just BEFORE Vue patches the DOM.
// The DOM still shows the OLD value here.
// ⚠ Do NOT write to reactive state here — it would trigger another update → loop.
// We use console.log to avoid that.
onBeforeUpdate(() =>
  console.log('[onBeforeUpdate] about to patch DOM — counter in DOM is still old')
)

// ── 4. onUpdated ──────────────────────────────────────────────────────────────
// Fires after Vue has patched the DOM with the new reactive values.
// ⚠ Same rule — no reactive writes here.
onUpdated(() =>
  console.log('[onUpdated] DOM is now in sync with reactive state')
)

// ── 5. onBeforeUnmount ────────────────────────────────────────────────────────
// Fires just before Vue starts tearing the component down.
// The component is still fully functional at this point.
onBeforeUnmount(() =>
  add('onBeforeUnmount', 'Teardown starting — component still functional')
)

// ── 6. onUnmounted ────────────────────────────────────────────────────────────
// Component is fully removed from the DOM.
// Clean up any side-effects started in onMounted: timers, listeners, subscriptions.
onUnmounted(() =>
  add('onUnmounted', 'Removed from DOM — timers and listeners must be cleaned up here')
)

// ── 7. onActivated ────────────────────────────────────────────────────────────
// Fires when a <KeepAlive>-cached component is shown again.
// onMounted does NOT re-fire — the component was never destroyed.
onActivated(() =>
  add('onActivated', 'Restored from <KeepAlive> cache — skip re-fetching already loaded data')
)

// ── 8. onDeactivated ──────────────────────────────────────────────────────────
// Fires when a <KeepAlive>-cached component is hidden.
// onUnmounted does NOT fire — the component stays alive in memory.
onDeactivated(() =>
  add('onDeactivated', 'Hidden but kept in memory by <KeepAlive> — no cleanup needed')
)

// ── 9. onErrorCaptured ────────────────────────────────────────────────────────
// Catches errors thrown by any child component.
// Return false to stop the error propagating further up the tree.
onErrorCaptured((err) => {
  caughtError.value = err.message
  return false
})

// ── 10 & 11. onRenderTracked / onRenderTriggered (dev builds only) ────────────
// onRenderTracked  — fires once per dependency when Vue first registers it.
// onRenderTriggered — fires each time a dependency causes a re-render.
// Both are for debugging only; no-ops in production builds.
onRenderTracked(({ key }) =>
  console.log('[onRenderTracked] dependency registered:', key)
)
onRenderTriggered(({ key }) =>
  console.log('[onRenderTriggered] re-render triggered by:', key)
)
</script>

<template>
  <div style="font-size: 0.95em;">

    <!-- onBeforeUpdate / onUpdated -->
    <section style="margin-bottom: 16px;">
      <strong>onBeforeUpdate / onUpdated</strong>
      <p style="color: gray; font-size: 0.9em; margin: 4px 0 8px;">
        Fire on every re-render — before and after Vue patches the DOM.<br />
        Writing reactive state inside them loops forever, so they log to the
        console instead. Click the button and open DevTools to see them fire.
      </p>
      <button @click="counter++">Counter: {{ counter }}</button>
      <span style="color: gray; font-size: 0.9em; margin-left: 10px;">← check console</span>
    </section>

    <hr style="border-style: dashed;" />

    <!-- onErrorCaptured -->
    <section style="margin-bottom: 16px;">
      <strong>onErrorCaptured</strong>
      <p style="color: gray; font-size: 0.9em; margin: 4px 0 8px;">
        Catches errors thrown by any descendant. Returning <code>false</code>
        stops propagation so the app doesn't crash.
      </p>
      <BuggyChild />
      <p v-if="caughtError" style="color: red; margin: 6px 0 0;">
        Caught: <strong>{{ caughtError }}</strong>
      </p>
    </section>

    <hr style="border-style: dashed;" />

    <!-- onRenderTracked / onRenderTriggered -->
    <section style="margin-bottom: 16px;">
      <strong>onRenderTracked / onRenderTriggered</strong>
      <p style="color: gray; font-size: 0.9em; margin: 4px 0;">
        Dev builds only — see console. <code>onRenderTracked</code> logs each
        reactive dependency Vue registers; <code>onRenderTriggered</code> logs
        which dependency caused the latest re-render.
      </p>
    </section>

    <hr style="border-style: dashed;" />

    <!-- Hook log -->
    <section>
      <strong>Hook log</strong>
      <p style="color: gray; font-size: 0.9em; margin: 4px 0 8px;">
        Toggle this component in section 9 above to see mount/unmount or
        activate/deactivate entries appear here.
      </p>
      <ol style="margin: 0; padding-left: 20px; font-size: 0.9em;">
        <li v-for="(entry, i) in log" :key="i" style="margin-bottom: 4px;">
          <code>{{ entry.hook }}</code> — {{ entry.desc }}
        </li>
      </ol>
      <p v-if="!log.length" style="color: gray; font-size: 0.9em;">No entries yet.</p>
    </section>

  </div>
</template>
