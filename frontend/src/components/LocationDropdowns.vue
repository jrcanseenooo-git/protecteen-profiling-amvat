<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <!-- Region -->
      <div class="field">
        <select v-model="region" @change="onRegionChange" required>
          <option value="" disabled hidden></option>
          <option value="III">REGION III (Central Luzon)</option>
          <option value="VI">REGION VI (Western Visayas)</option>
          <option value="X">REGION X (Northern Mindanao)</option>
          <option value="NCR">NCR (National Capital Region)</option>
          <option value="IV-A">REGION IV-A (CALABARZON)</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Region</label>
      </div>

      <!-- Province -->
      <div class="field">
        <select v-model="province" @change="onProvinceChange" :disabled="!provinces.length" required>
          <option value="" disabled hidden></option>
          <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Province</label>
      </div>

      <!-- Municipality -->
      <div class="field">
        <select v-model="municipality" @change="onMuniChange" :disabled="!municipalities.length" required>
          <option value="" disabled hidden></option>
          <option v-for="m in municipalities" :key="m" :value="m">{{ m }}</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Municipality/City</label>
      </div>

      <!-- Barangay -->
      <div class="field">
        <select v-model="barangay" :disabled="!barangays.length" required>
          <option value="" disabled hidden></option>
          <option v-for="b in barangays" :key="b" :value="b">{{ b }}</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Barangay</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormStore } from '@/stores/formStore'

const props = defineProps({
  modelRegion:       String,
  modelProvince:     String,
  modelMunicipality: String,
  modelBarangay:     String,
})

const emit = defineEmits(['update:modelRegion','update:modelProvince','update:modelMunicipality','update:modelBarangay'])

const store = useFormStore()

const region       = ref(props.modelRegion       || '')
const province     = ref(props.modelProvince     || '')
const municipality = ref(props.modelMunicipality || '')
const barangay     = ref(props.modelBarangay     || '')

const db = computed(() => store.locationDB)

const provinces     = computed(() => region.value       ? Object.keys(db.value[region.value] || {})                            : [])
const municipalities= computed(() => province.value     ? Object.keys(db.value[region.value]?.[province.value] || {})          : [])
const barangays     = computed(() => municipality.value ? db.value[region.value]?.[province.value]?.[municipality.value] || [] : [])

function onRegionChange() {
  province.value = ''; municipality.value = ''; barangay.value = ''
  emit('update:modelRegion', region.value)
  emit('update:modelProvince', '')
  emit('update:modelMunicipality', '')
  emit('update:modelBarangay', '')
}
function onProvinceChange() {
  municipality.value = ''; barangay.value = ''
  emit('update:modelProvince', province.value)
  emit('update:modelMunicipality', '')
  emit('update:modelBarangay', '')
}
function onMuniChange() {
  barangay.value = ''
  emit('update:modelMunicipality', municipality.value)
  emit('update:modelBarangay', '')
}
watch(barangay, (v) => emit('update:modelBarangay', v))

// Sync if parent sets values (e.g. prefill)
watch(() => props.modelRegion,       (v) => { if (v !== region.value)       region.value = v })
watch(() => props.modelProvince,     (v) => { if (v !== province.value)     province.value = v })
watch(() => props.modelMunicipality, (v) => { if (v !== municipality.value) municipality.value = v })
watch(() => props.modelBarangay,     (v) => { if (v !== barangay.value)     barangay.value = v })
</script>
