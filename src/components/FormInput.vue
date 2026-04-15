<script setup>
// defineModel() is the Vue 3.4+ shorthand for the two-way binding pattern.
// Under the hood it creates a prop called "modelValue" and emits "update:modelValue".
// The old manual way would be:
//   const props = defineProps({ modelValue: String })
//   const emit = defineEmits(['update:modelValue'])
//   then bind :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)"
// defineModel() does all of that automatically in one line.
const model = defineModel({ default: '' })

defineProps({
  label: String,
  type: { type: String, default: 'text' },
  id: String,
  error: String,
  placeholder: String,
})
</script>

<template>
  <div style="margin-bottom: 16px;">
    <label
      v-if="label"
      :for="id"
      style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.9em;"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      style="
        width: 100%;
        padding: 7px 10px;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 0.95em;
      "
      :style="error
        ? { border: '1.5px solid #e53e3e', outline: 'none' }
        : { border: '1px solid #ccc' }"
    />
    <!-- Error message — only rendered when an error string is passed in -->
    <p v-if="error" style="color: #e53e3e; font-size: 0.82em; margin: 3px 0 0;">
      {{ error }}
    </p>
  </div>
</template>
