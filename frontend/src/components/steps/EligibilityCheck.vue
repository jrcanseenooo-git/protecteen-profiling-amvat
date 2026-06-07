<template>
  <div class="card fade-in">
    <h2 class="text-center mb-1">Eligibility Check</h2>
    <h3 class="text-center text-gray-500 mb-6 text-sm">Checking respondent criteria</h3>

    <!-- Summary -->
    <div class="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
      <h4 class="font-semibold text-primary mb-3">👤 Respondent Summary</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="text-gray-500">Name</div>
        <div class="font-medium">{{ fullName }}</div>
        <div class="text-gray-500">Age</div>
        <div class="font-medium">{{ el.age }} years old</div>
        <div class="text-gray-500">Region</div>
        <div class="font-medium">{{ d.region }}</div>
        <div class="text-gray-500">Province</div>
        <div class="font-medium">{{ d.province }}</div>
        <div class="text-gray-500">Municipality</div>
        <div class="font-medium">{{ d.municipality_city }}</div>
        <div class="text-gray-500">Barangay</div>
        <div class="font-medium">{{ d.barangay }}</div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
        <div class="text-gray-500">4Ps Member</div>
        <div :class="d.fourPs === 'Yes' ? 'text-danger font-semibold' : 'text-success font-semibold'">
          {{ d.fourPs }}
        </div>
        <div class="text-gray-500">Has Child</div>
        <div class="font-medium">{{ d.has_child }} ({{ d.number_children }} child/ren)</div>
        <div class="text-gray-500">Living with Partner</div>
        <div class="font-medium">{{ d.with_partner }}</div>
      </div>
    </div>

    <!-- Qualification Result -->
    <transition name="fade">
      <div v-if="el.qualified" class="alert-qualified mb-6">
        <div class="flex items-start gap-3">
          <span class="text-3xl">✅</span>
          <div>
            <h3 class="font-bold text-lg text-green-800 mb-1">QUALIFIED</h3>
            <p class="text-sm text-green-700">
              This respondent meets all criteria. You may proceed to the full survey.
            </p>
          </div>
        </div>
      </div>
      <div v-else class="alert-not-qualified mb-6">
        <div class="flex items-start gap-3">
          <span class="text-3xl">❌</span>
          <div>
            <h3 class="font-bold text-lg text-red-800 mb-2">NOT QUALIFIED</h3>
            <p class="text-sm text-red-700 mb-2">This respondent does not meet the following criteria:</p>
            <ul class="text-sm text-red-700 list-disc list-inside space-y-1">
              <li v-for="r in el.reasons" :key="r">{{ r }}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- Buttons -->
    <div class="flex flex-wrap gap-3 justify-between">
      <button class="btn-secondary" @click="store.setProfilingStep(1)">
        ← Edit Information
      </button>

      <div class="flex gap-3">
        <!-- Save Not Qualified -->
        <button v-if="!el.qualified"
          class="btn-warning" :disabled="saving" @click="handleSaveNotQualified">
          <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          💾 Save Not Qualified
        </button>

        <!-- Proceed to full survey -->
        <button v-if="el.qualified"
          class="btn-success" @click="store.setProfilingStep(2)">
          Proceed to Survey →
        </button>
      </div>
    </div>

    <p v-if="msg" class="mt-4 text-sm text-center"
       :class="msgType === 'success' ? 'text-success' : 'text-danger'">
      {{ msg }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'

const store  = useFormStore()
const api    = useApi()
const saving = ref(false)
const msg    = ref('')
const msgType= ref('')

const d = computed(() => store.profilingData)
const el= computed(() => store.eligibility)
const fullName = computed(() =>
  [d.value.first_name, d.value.middle_name, d.value.last_name].filter(Boolean).join(' ')
)

async function handleSaveNotQualified() {
  saving.value = true
  msg.value = ''
  try {
    const res = await api.submitNotQualified(d.value)
    if (res.success) {
      msg.value  = '✅ Response saved as Not Qualified.'
      msgType.value = 'success'
      setTimeout(() => store.resetAll(), 2000)
    } else {
      msg.value  = '❌ ' + (res.error || 'Submission failed.')
      msgType.value = 'danger'
    }
  } catch (e) {
    msg.value  = '❌ Network error: ' + e.message
    msgType.value = 'danger'
  } finally {
    saving.value = false
  }
}
</script>
