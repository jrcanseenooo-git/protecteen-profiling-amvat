<template>
  <div class="card fade-in">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span class="breadcrumb-item done">✓ Profile</span>
      <span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item active">🏠 Housing</span>
      <span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">💊 Health</span>
      <span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">🌍 Social</span>
      <span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">👨‍👩‍👧 Family</span>
    </div>

    <h3 class="font-semibold text-gray-700 mb-4">🏠 SOCIO ECONOMIC</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div class="field">
        <select v-model="f.house_type" required>
          <option value="" disabled hidden></option>
          <option>Single house</option>
          <option>Duplex</option>
          <option>Multi Residential (three units or more)</option>
          <option>Commercial/Industrial/Agricultural Building</option>
          <option>Institutional Living Quarters</option>
          <option>Other housing unit</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Type of Building</label>
      </div>
      <div class="field">
        <select v-model="f.roof_material" required>
          <option value="" disabled hidden></option>
          <option>Strong Materials</option>
          <option>Light Materials</option>
          <option>Mixed/Salvaged Materials</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Roof Material</label>
      </div>
      <div class="field">
        <select v-model="f.outer_wall" required>
          <option value="" disabled hidden></option>
          <option>Strong Materials</option>
          <option>Light Materials</option>
          <option>Mixed/Salvaged Materials</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Outer Wall Material</label>
      </div>
      <div class="field">
        <select v-model="f.tenure_status" required>
          <option value="" disabled hidden></option>
          <option>Owned / Amortized</option>
          <option>Rented</option>
          <option>Rent-free with consent</option>
          <option>Rent-free without consent (squatter)</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Tenure Status</label>
      </div>
      <div class="field">
        <select v-model="f.toilet_facility" required>
          <option value="" disabled hidden></option>
          <option>Water-sealed (own use)</option>
          <option>Water-sealed (shared)</option>
          <option>Closed pit</option>
          <option>Open pit</option>
          <option>None (open defecation)</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Toilet Facility</label>
      </div>
      <div class="field">
        <select v-model="f.water_supply" required>
          <option value="" disabled hidden></option>
          <option>Piped water (own)</option>
          <option>Piped water (shared)</option>
          <option>Tubed/Piped well</option>
          <option>Protected well</option>
          <option>Unprotected well</option>
          <option>Spring/River/Rain</option>
          <option>Bottled water</option>
          <option>Water refilling station</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Water Supply</label>
      </div>
      <div class="field">
        <select v-model="f.garbage_disposal" required>
          <option value="" disabled hidden></option>
          <option>Regular garbage collection</option>
          <option>Composting</option>
          <option>Burning</option>
          <option>Dumping in pit</option>
          <option>Dumping in bodies of water</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Garbage Disposal</label>
      </div>
      <div class="field">
        <select v-model="f.electricity" required>
          <option value="" disabled hidden></option>
          <option>Yes, connected to main grid</option>
          <option>Yes, solar/alternative</option>
          <option>No electricity</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Electricity</label>
      </div>
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(1)">← Back</button>
      <button class="btn-primary" @click="handleNext">Health →</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store    = useFormStore()
const alertMsg = ref('')
const f        = reactive({ ...store.profilingData })
const REQUIRED = ['house_type','roof_material','outer_wall','tenure_status',
                  'toilet_facility','water_supply','garbage_disposal','electricity']

function handleNext() {
  alertMsg.value = ''
  const missing = REQUIRED.filter(k => !f[k])
  if (missing.length) { alertMsg.value = 'Please complete all required fields.'; return }
  store.patchProfiling({ ...f })
  store.setProfilingStep(3)
}
</script>
