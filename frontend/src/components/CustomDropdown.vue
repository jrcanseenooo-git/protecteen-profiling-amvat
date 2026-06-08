<template>
  <div class="custom-dropdown" ref="dropdownRef">
    <!-- Selected display / trigger -->
    <div class="dropdown-selected" :class="{ active: isOpen, filled: modelValue }" @click="toggle">
      <span class="dropdown-text" :class="{ placeholder: !modelValue }">
        <template v-if="selectedOpt">
          {{ selectedOpt.icon }} {{ selectedOpt.main }}
        </template>
        <template v-else>{{ placeholder }}</template>
      </span>
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <!-- Dropdown list -->
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-list">
        <div v-for="opt in options" :key="opt.value"
             class="dropdown-item" :class="{ selected: modelValue === opt.value }"
             @click="select(opt.value)">
          <div class="item-main">{{ opt.icon }} {{ opt.main }}</div>
          <div v-if="opt.sub" class="item-sub">{{ opt.sub }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Select an option' },
  options: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const isOpen      = ref(false)
const dropdownRef = ref(null)

const selectedOpt = computed(() => props.options.find(o => o.value === props.modelValue))

function toggle() { isOpen.value = !isOpen.value }

function select(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleOutsideClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(()  => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.custom-dropdown { position: relative; width: 100%; user-select: none; }

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.2s ease;
  min-height: 52px;
}
.dropdown-selected:hover   { border-color: #a78bfa; background: #f5f7ff; }
.dropdown-selected.active  { border-color: #7c3aed; background: #fff; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
.dropdown-selected.filled  { background: #fff; }

.dropdown-text     { font-size: 14px; color: #333; flex: 1; }
.dropdown-text.placeholder { color: #aaa; }

.arrow {
  font-size: 11px;
  color: #999;
  transition: transform 0.25s;
  margin-left: 8px;
  flex-shrink: 0;
}
.arrow.open { transform: rotate(180deg); color: #7c3aed; }

.dropdown-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 100;
  max-height: 320px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover      { background: #f5f7ff; }
.dropdown-item.selected   { background: #f5f3ff; }

.item-main { font-size: 14px; font-weight: 500; color: #333; }
.item-sub  { font-size: 12px; color: #888; margin-top: 2px; }

/* Transition */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-6px); }
.dropdown-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
