<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

// useRoute() gives you the current route object — params, query, meta, etc.
const route = useRoute()
const router = useRouter()

// route.params gives you the dynamic segments from the URL pattern /:username
// e.g. /user/alice → { username: 'alice' }
const username = computed(() => route.params.username)

// Example users you can navigate to — shows how RouterLink and router.push
// both work with named routes + params
const exampleUsers = ['alice', 'bob', 'carol']

function goToUser(name) {
  // Programmatic navigation — same as clicking a RouterLink
  router.push({ name: 'user', params: { username: name } })
}
</script>

<template>
  <div style="font-family: sans-serif; max-width: 560px; margin: 40px auto; padding: 0 20px;">

    <!-- Route param display -->
    <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px; font-size: 0.85em; color: #92400e;">
        Current URL: <code>{{ route.fullPath }}</code>
      </p>
      <h1 style="margin: 0;">Welcome, {{ username }}!</h1>
      <p style="margin: 8px 0 0; font-size: 0.9em; color: #555;">
        <code>route.params.username</code> = <strong>"{{ username }}"</strong><br />
        <code>route.name</code> = <strong>"{{ route.name }}"</strong><br />
        <code>route.query</code> = <strong>{{ JSON.stringify(route.query) }}</strong>
      </p>
    </div>

    <!-- RouterLink vs programmatic navigation -->
    <section style="margin-bottom: 24px;">
      <h2 style="margin-bottom: 8px;">RouterLink — declarative navigation</h2>
      <p style="color: gray; font-size: 0.88em; margin-bottom: 10px;">
        <code>&lt;RouterLink :to="..."&gt;</code> renders an <code>&lt;a&gt;</code> tag
        and handles history / hash routing automatically. Vue Router adds the
        <code>.router-link-active</code> class when the route matches.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <RouterLink
          v-for="name in exampleUsers"
          :key="name"
          :to="{ name: 'user', params: { username: name } }"
          style="
            padding: 6px 14px; border: 1px solid #4f46e5; border-radius: 4px;
            color: #4f46e5; text-decoration: none; font-size: 0.9em;
          "
        >
          /user/{{ name }}
        </RouterLink>
      </div>
    </section>

    <section style="margin-bottom: 24px;">
      <h2 style="margin-bottom: 8px;">router.push() — programmatic navigation</h2>
      <p style="color: gray; font-size: 0.88em; margin-bottom: 10px;">
        Call <code>router.push()</code> from inside a function — useful after
        form submissions, auth checks, or any async action.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button
          v-for="name in exampleUsers"
          :key="name"
          @click="goToUser(name)"
          style="
            padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px;
            background: white; cursor: pointer; font-size: 0.9em;
          "
        >
          Go to {{ name }}
        </button>
      </div>
    </section>

    <section>
      <h2 style="margin-bottom: 8px;">Navigation guard</h2>
      <p style="font-size: 0.88em; color: gray;">
        A global <code>router.beforeEach()</code> in <code>router/index.js</code>
        guards this route. If you open <code>/user/anything</code> directly in a
        fresh tab (no <code>sessionStorage.registered</code>), the guard redirects
        you to <code>/register</code> with a <code>?next=</code> query param so
        you end up back here after submitting the form.
      </p>
    </section>

  </div>
</template>
