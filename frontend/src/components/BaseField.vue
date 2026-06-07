<template>
  <div class="field">
    <slot />
    <label v-if="label" class="floating-label">
      <span v-if="required" class="text-danger-DEFAULT mr-0.5">*</span>{{ label }}
    </label>
  </div>
</template>

<script setup>
defineProps({ label: String, required: Boolean })
</script>
