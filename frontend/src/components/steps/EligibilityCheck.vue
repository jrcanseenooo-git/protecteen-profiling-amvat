<template>
  <div class="card fade-in">
    <h2 class="text-center mb-1">Eligibility Check</h2>
    <h3 class="text-center text-gray-500 mb-6 text-sm">Checking respondent criteria</h3>

    <!-- Respondent Summary -->
    <div class="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-200">
      <h4 class="font-semibold text-primary mb-3">👤 Respondent Summary</h4>
      <div class="grid grid-cols-2 gap-y-2 text-sm">
        <div class="text-gray-500">Name</div>
        <div class="font-medium">{{ fullName }}</div>
        <div class="text-gray-500">Date of Birth</div>
        <div class="font-medium">{{ d.birth_date || '—' }}</div>
        <div class="text-gray-500">Age</div>
        <div class="font-medium" :class="el.age > 0 && el.age <= 19 ? 'text-success' : 'text-danger'">
          {{ el.age > 0 ? el.age + ' years old' : '❌ Cannot be calculated — check Date of Birth' }}
        </div>
        <div class="text-gray-500">Region</div>
        <div class="font-medium">{{ d.region }}</div>
        <div class="text-gray-500">Province</div>
        <div class="font-medium">{{ d.province }}</div>
        <div class="text-gray-500">Municipality</div>
        <div class="font-medium">{{ d.municipality_city }}</div>
        <div class="text-gray-500">Barangay</div>
        <div class="font-medium">{{ d.barangay }}</div>
      </div>

      <!-- Criteria Table -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Eligibility Criteria</p>
        <div class="space-y-2.5">

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">4Ps Member <span class="text-xs text-gray-400">(must be NO)</span></span>
            <span :class="d.fourPs === 'No' ? 'text-success font-semibold' : 'text-danger font-semibold'">
              {{ d.fourPs === 'No' ? '✅ No' : '❌ Yes' }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Has a Child <span class="text-xs text-gray-400">(must be YES)</span></span>
            <span :class="d.has_child === 'Yes' && parseInt(d.number_children) >= 1 ? 'text-success font-semibold' : 'text-danger font-semibold'">
              {{ d.has_child === 'Yes' && parseInt(d.number_children) >= 1
                ? `✅ Yes`
                : `❌ ${d.has_child === 'No' ? 'No' : 'No children recorded'}` }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Age <span class="text-xs text-gray-400">(must be 19 years old or below)</span></span>
            <span :class="el.age > 0 && el.age <= 19 ? 'text-success font-semibold' : 'text-danger font-semibold'">
              {{ el.age > 0
                ? (el.age <= 19 ? `✅ ${el.age} yrs old` : `❌ ${el.age} yrs old (over 19)`)
                : '❌ Invalid / Not set' }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Living with Partner
              <span class="text-xs text-gray-400">(if YES, must be 18–19 yrs old)</span>
            </span>
            <span :class="partnerCriteriaOk ? 'text-success font-semibold' : 'text-danger font-semibold'">
              {{ partnerCriteriaText }}
            </span>
          </div>

        </div>
      </div>
    </div>

    <!-- Qualification Result -->
    <div v-if="el.qualified" class="alert-qualified mb-6">
      <div class="flex items-start gap-3">
        <span class="text-3xl">✅</span>
        <div>
          <h3 class="font-bold text-lg text-green-800 mb-1">QUALIFIED</h3>
          <p class="text-sm text-green-700">This respondent meets all criteria. You may proceed to the full survey.</p>
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

    <!-- Buttons -->
    <div class="flex flex-wrap gap-3 justify-between">
      <button class="btn-secondary" @click="store.setProfilingStep(1)">Back</button>
      <div class="flex gap-3">
        <button v-if="!el.qualified" class="btn-warning" @click="showNotQualifiedConfirm = true">
          Save Response
        </button>
        <button v-if="el.qualified" class="btn-success" @click="store.setProfilingStep(2)">
          Proceed to Survey
        </button>
      </div>
    </div>

    <p v-if="msg" class="mt-4 text-sm text-center"
       :class="msgType === 'success' ? 'text-success' : 'text-danger'">
      {{ msg }}
    </p>

    <!-- ══════════ NOT QUALIFIED CONFIRMATION MODAL ══════════ -->
    <teleport to="body">
      <div v-if="showNotQualifiedConfirm" class="modal-overlay">
        <div class="modal-box" style="max-width:420px;">
          <div class="modal-header" style="background:#ff9800">
            <h2 class="text-base font-bold text-white">Confirm: Save as Not Qualified</h2>
            <button @click="showNotQualifiedConfirm = false"
              class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">&times;</button>
          </div>
          <div class="p-6 text-center">
            <div class="mb-4"><span class="material-icons-round text-warning" style="font-size:52px">warning</span></div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">Save this response as Not Qualified?</h3>
            <p class="text-sm text-gray-500 mb-1">Respondent: <strong>{{ fullName }}</strong></p>
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-700 mb-5 text-left mt-3">
              <p class="font-semibold mb-1">Reason(s):</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li v-for="r in el.reasons" :key="r">{{ r }}</li>
              </ul>
            </div>
            <p class="text-xs text-gray-400 mb-5">This will be saved to the "Not Qualified" sheet and the form will reset.</p>
            <div class="flex gap-3">
              <button class="btn-secondary flex-1" @click="showNotQualifiedConfirm = false">Cancel</button>
              <button class="btn-warning flex-1" :disabled="saving" @click="handleSaveNotQualified">
                <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'

const store   = useFormStore()
const api     = useApi()
const saving  = ref(false)
const msg     = ref('')
const msgType = ref('')
const showNotQualifiedConfirm = ref(false)

const d  = computed(() => store.profilingData)
const el = computed(() => store.eligibility)

const fullName = computed(() =>
  [d.value.first_name, d.value.middle_name, d.value.last_name].filter(Boolean).join(' ')
)

const partnerCriteriaOk = computed(() => {
  if (d.value.with_partner === 'No') return true
  return el.value.age >= 18 && el.value.age <= 19
})
const partnerCriteriaText = computed(() => {
  if (d.value.with_partner === 'No') return '✅ Not living with partner'
  if (el.value.age >= 18 && el.value.age <= 19) return `✅ Yes (age ${el.value.age}, qualified)`
  return `❌ Yes (age ${el.value.age}, must be 18–19)`
})

async function handleSaveNotQualified() {
  saving.value = true
  showNotQualifiedConfirm.value = false
  msg.value = ''
  try {
    const res = await api.submitNotQualified(d.value)
    if (res.success) {
      msg.value = '✅ Response saved as Not Qualified.'
      msgType.value = 'success'
      setTimeout(() => store.resetAll(), 2000)
    } else {
      msg.value = '❌ ' + (res.error || 'Submission failed.')
      msgType.value = 'danger'
    }
  } catch (e) {
    msg.value = '❌ Network error: ' + e.message
    msgType.value = 'danger'
  } finally {
    saving.value = false
  }
}
</script>
