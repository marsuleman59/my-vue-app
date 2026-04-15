<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import FormInput from '../components/FormInput.vue'

const router = useRouter()
const route = useRoute()

// ---------------------------------------------------------------------------
// Zod schema — every rule lives here, separate from UI code
// ---------------------------------------------------------------------------
const schema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .min(3, 'Min 3 characters')
        .max(20, 'Max 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),

      email: z.string().email('Must be a valid email address'),

      password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),

      confirmPassword: z.string().min(1, 'Please confirm your password'),

      age: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .int('Must be a whole number')
        .min(18, 'You must be at least 18')
        .max(120, 'Please enter a realistic age'),

      website: z
        .string()
        .url('Must be a valid URL (e.g. https://example.com)')
        .or(z.literal(''))
        .optional(),

      bio: z.string().max(200, 'Bio must be 200 characters or fewer').optional(),

      role: z.enum(['developer', 'designer', 'pm', 'other'], {
        errorMap: () => ({ message: 'Please select a role' }),
      }),

      terms: z.literal(true, {
        errorMap: () => ({ message: 'You must accept the terms to continue' }),
      }),
    })
    // .refine runs AFTER all field checks pass — use it for cross-field rules
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // attach the error to confirmPassword field
    })
)

// ---------------------------------------------------------------------------
// VeeValidate — useForm wires the schema to the form state
// ---------------------------------------------------------------------------
const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

// defineField returns [modelRef, inputAttrs]
// We only destructure the model ref; VeeValidate updates errors automatically
const [username] = defineField('username')
const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')
const [age] = defineField('age')
const [website] = defineField('website')
const [bio] = defineField('bio')
const [role] = defineField('role')
const [terms] = defineField('terms')

// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------
const serverError = ref(null)
const submitResult = ref(null)

// handleSubmit only calls the callback when ALL validations pass
const onSubmit = handleSubmit(async (values) => {
  serverError.value = null
  submitResult.value = null

  // axios: the most popular Vue HTTP client.
  // Alternatives worth knowing:
  //   • native fetch()  — built into browsers, no install needed, more verbose
  //   • ofetch          — Nuxt's fetch wrapper, auto JSON, interceptors, tiny
  //
  // httpbin.org/post echoes back whatever you POST — great for demos
  const { data } = await axios.post('https://httpbin.org/post', {
    username: values.username,
    email: values.email,
    age: values.age,
    website: values.website || null,
    bio: values.bio || null,
    role: values.role,
    // Never send plain passwords in a real app — hash server-side
    password: '[redacted for demo]',
  })

  // httpbin wraps your payload under { json: ... }
  submitResult.value = data.json

  // Mark as registered so the navigation guard lets us through
  sessionStorage.setItem('registered', '1')

  // Navigate to the user profile route — passes username as a route param
  // The 'next' query param would have been set by the beforeEach guard if the
  // user tried to visit /user/:username directly without registering first
  router.push(route.query.next || { name: 'user', params: { username: values.username } })
})
</script>

<template>
  <div style="font-family: sans-serif; max-width: 560px; margin: 40px auto; padding: 0 20px;">
    <h1 style="margin-bottom: 4px;">12. Vue Router + Forms + Validation</h1>

    <!-- ── Custom v-model ────────────────────────────────────────────────── -->
    <section style="background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 0.88em;">
      <strong>Custom v-model (defineModel)</strong><br />
      <code>FormInput</code> uses <code>defineModel()</code> internally — the Vue 3.4+
      macro that replaces the manual <code>modelValue</code> prop +
      <code>update:modelValue</code> emit pattern. The parent just writes
      <code>v-model="username"</code> and everything is wired automatically.
    </section>

    <!-- ── Router context ───────────────────────────────────────────────── -->
    <section style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 0.88em;">
      <strong>Navigation guard</strong><br />
      <code>/user/:username</code> is protected by a <code>beforeEach</code> guard in
      <code>router/index.js</code>. Trying to visit it directly redirects here first.
      After a successful submit the guard is satisfied and you're sent to
      <code>/user/&lt;your username&gt;</code>.
    </section>

    <!-- ── Form ─────────────────────────────────────────────────────────── -->
    <form @submit.prevent="onSubmit" novalidate>

      <!-- FormInput uses defineModel, so parent just uses v-model -->
      <FormInput
        id="username"
        label="Username *"
        v-model="username"
        placeholder="e.g. cool_coder"
        :error="errors.username"
      />

      <FormInput
        id="email"
        label="Email *"
        type="email"
        v-model="email"
        placeholder="you@example.com"
        :error="errors.email"
      />

      <FormInput
        id="password"
        label="Password *"
        type="password"
        v-model="password"
        placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
        :error="errors.password"
      />

      <FormInput
        id="confirmPassword"
        label="Confirm password *"
        type="password"
        v-model="confirmPassword"
        placeholder="Repeat your password"
        :error="errors.confirmPassword"
      />

      <FormInput
        id="age"
        label="Age *"
        type="number"
        v-model="age"
        placeholder="Must be 18+"
        :error="errors.age"
      />

      <FormInput
        id="website"
        label="Website (optional)"
        type="url"
        v-model="website"
        placeholder="https://yoursite.com"
        :error="errors.website"
      />

      <!-- Bio — not using FormInput so we can show a <textarea> -->
      <div style="margin-bottom: 16px;">
        <label for="bio" style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.9em;">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          v-model="bio"
          rows="3"
          maxlength="200"
          placeholder="Max 200 characters"
          style="
            width: 100%; padding: 7px 10px; border-radius: 4px;
            box-sizing: border-box; font-size: 0.95em; resize: vertical;
          "
          :style="errors.bio ? { border: '1.5px solid #e53e3e' } : { border: '1px solid #ccc' }"
        />
        <p v-if="errors.bio" style="color: #e53e3e; font-size: 0.82em; margin: 3px 0 0;">
          {{ errors.bio }}
        </p>
      </div>

      <!-- Role select -->
      <div style="margin-bottom: 16px;">
        <label for="role" style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.9em;">
          Role *
        </label>
        <select
          id="role"
          v-model="role"
          style="
            width: 100%; padding: 7px 10px; border-radius: 4px;
            box-sizing: border-box; font-size: 0.95em; background: white;
          "
          :style="errors.role ? { border: '1.5px solid #e53e3e' } : { border: '1px solid #ccc' }"
        >
          <option value="" disabled selected>Select a role…</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="pm">Product Manager</option>
          <option value="other">Other</option>
        </select>
        <p v-if="errors.role" style="color: #e53e3e; font-size: 0.82em; margin: 3px 0 0;">
          {{ errors.role }}
        </p>
      </div>

      <!-- Terms checkbox -->
      <div style="margin-bottom: 20px;">
        <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; font-size: 0.9em;">
          <input type="checkbox" v-model="terms" style="margin-top: 2px; flex-shrink: 0;" />
          I agree to the terms and conditions *
        </label>
        <p v-if="errors.terms" style="color: #e53e3e; font-size: 0.82em; margin: 3px 0 0;">
          {{ errors.terms }}
        </p>
      </div>

      <!-- Server error -->
      <p v-if="serverError" style="color: #e53e3e; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 4px; padding: 8px 12px; font-size: 0.9em;">
        {{ serverError }}
      </p>

      <button
        type="submit"
        :disabled="isSubmitting"
        style="
          padding: 9px 22px; background: #4f46e5; color: white;
          border: none; border-radius: 5px; font-size: 1em; cursor: pointer;
        "
        :style="isSubmitting ? { opacity: '0.6', cursor: 'not-allowed' } : {}"
      >
        {{ isSubmitting ? 'Submitting…' : 'Register' }}
      </button>
    </form>
  </div>
</template>
