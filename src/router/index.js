import { createRouter, createWebHistory } from 'vue-router'
import DemoView from '../views/DemoView.vue'

// Routes — each entry maps a URL pattern to a component.
// Lazy-loaded routes (using import()) are only fetched when the user first
// navigates to them, keeping the initial bundle small.
const routes = [
  {
    path: '/',
    name: 'home',
    component: DemoView,
  },
  {
    path: '/register',
    name: 'register',
    // Dynamic import = code-split chunk, loaded on demand
    component: () => import('../views/RegisterView.vue'),
  },
  {
    // :username is a dynamic segment — captured as route.params.username
    path: '/user/:username',
    name: 'user',
    component: () => import('../views/UserView.vue'),
  },
]

const router = createRouter({
  // createWebHistory uses the HTML5 History API (clean URLs, no #).
  // Use createWebHashHistory() if you can't configure server-side fallbacks.
  history: createWebHistory(),
  routes,
})

// ---------------------------------------------------------------------------
// Global navigation guard — runs before EVERY route change
// to: the route being navigated TO
// from: the route being navigated FROM
// Return nothing (or true) to allow. Return a route location to redirect.
// ---------------------------------------------------------------------------
router.beforeEach((to, from) => {
  // Guard: /user/:username is only accessible after the user has registered.
  // We store a simple flag in sessionStorage after a successful form submit.
  //
  // In a real app you'd check a Pinia auth store or a JWT in localStorage.
  if (to.name === 'user' && !sessionStorage.getItem('registered')) {
    // Redirect to /register and remember where the user was going (?next=...)
    // so RegisterView can send them back after a successful submit.
    return {
      name: 'register',
      query: { next: to.fullPath },
    }
  }
})

export default router
