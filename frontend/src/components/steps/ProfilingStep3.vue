<template>
  <div class="card fade-in">
    <div class="breadcrumb">
      <span class="breadcrumb-item done">✓ Profile</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Housing</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item active">💊 Health</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">🌍 Social</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">👨‍👩‍👧 Family</span>
    </div>
    <h3 class="font-semibold text-gray-700 mb-4">💊 HEALTH</h3>

    <!-- Health condition -->
    <div class="field">
      <select v-model="f.health_condition" required>
        <option value="" disabled hidden></option>
        <option value="Two or more family members - hospital confinement">2+ members – hospital confinement</option>
        <option value="One family member - hospital confinement">1 member – hospital confinement</option>
        <option value="Two or more family members - medical attention only">2+ members – medical attention only</option>
        <option value="One family member - medical attention only">1 member – medical attention only</option>
        <option value="No family member got sick">No family member got sick</option>
      </select>
      <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Health condition past month</label>
    </div>

    <!-- Health services -->
    <div class="field">
      <select v-model="f.health_services" required>
        <option value="" disabled hidden></option>
        <option>Rural Health Unit (RHU)</option>
        <option>Barangay Health Center</option>
        <option>Government Hospital</option>
        <option>Private Hospital / Clinic</option>
        <option>Traditional / Herbal</option>
        <option>No health services availed</option>
      </select>
      <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Health services availed</label>
    </div>

    <!-- Where women give birth -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3">
        <span class="q-number">3</span>
        Where do women in the family give birth? <span class="text-red-500">*</span>
      </p>
      <div class="check-group">
        <label v-for="opt in giveBirthOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.give_birth" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
      <input v-if="f.give_birth.includes('Others, specify')"
             v-model="giveBirthOther" type="text" placeholder="Please specify..."
             class="mt-2 w-full border-b-2 border-primary text-sm py-1 bg-transparent outline-none" />
    </div>

    <!-- Pre/post natal care -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3">
        <span class="q-number">4</span>
        Where do pregnant women visit for pre and postnatal care? <span class="text-red-500">*</span>
      </p>
      <div class="check-group">
        <label v-for="opt in prePostOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.pre_post_care" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
    </div>

    <!-- Death in pregnancy / child died -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div class="field">
        <select v-model="f.died_pregnancy" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Death during/after pregnancy?</label>
      </div>
      <div class="field">
        <select v-model="f.child_died" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Child died before age 5?</label>
      </div>
    </div>

    <!-- ECCD -->
    <div class="field">
      <select v-model="eccdStatus" required>
        <option value="" disabled hidden></option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Not Applicable">Not Applicable</option>
      </select>
      <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Early Childhood Care &amp; Development (ECCD)</label>
    </div>
    <div v-if="eccdStatus === 'Yes'" class="q-card">
      <p class="font-medium text-sm mb-2">Which ECCD services?</p>
      <div class="check-group">
        <label v-for="s in eccdServiceOpts" :key="s" class="check-item">
          <input type="checkbox" :value="s" v-model="eccdServices" />
          <span class="text-sm">{{ s }}</span>
        </label>
      </div>
    </div>
    <div v-if="eccdStatus === 'No'" class="q-card">
      <p class="font-medium text-sm mb-2">Reason not availing ECCD?</p>
      <div class="check-group">
        <label v-for="r in eccdReasonOpts" :key="r" class="check-item">
          <input type="checkbox" :value="r" v-model="eccdReasons" />
          <span class="text-sm">{{ r }}</span>
        </label>
      </div>
    </div>

    <!-- Family planning -->
    <div class="field">
      <select v-model="f.family_planning" required>
        <option value="" disabled hidden></option>
        <option>Yes</option><option>No</option>
      </select>
      <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Using family planning method?</label>
    </div>
    <div v-if="f.family_planning === 'Yes'" class="q-card">
      <p class="font-medium text-sm mb-2">Which method(s)?</p>
      <div class="check-group">
        <label v-for="m in fpMethodOpts" :key="m" class="check-item">
          <input type="checkbox" :value="m" v-model="f.fam_plan_method" />
          <span class="text-sm">{{ m }}</span>
        </label>
      </div>
    </div>
    <div v-if="f.family_planning === 'No'" class="q-card">
      <p class="font-medium text-sm mb-2">Reason not using family planning?</p>
      <div class="check-group">
        <label v-for="r in fpReasonOpts" :key="r" class="check-item">
          <input type="checkbox" :value="r" v-model="f.fam_plan_reason" />
          <span class="text-sm">{{ r }}</span>
        </label>
      </div>
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(2)">← Back</button>
      <button class="btn-primary" @click="handleNext">Social →</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store    = useFormStore()
const alertMsg = ref('')
const giveBirthOther = ref('')

const f = reactive({
  health_condition: store.profilingData.health_condition,
  health_services:  store.profilingData.health_services,
  give_birth:       [...(store.profilingData.give_birth || [])],
  pre_post_care:    [...(store.profilingData.pre_post_care || [])],
  died_pregnancy:   store.profilingData.died_pregnancy,
  child_died:       store.profilingData.child_died,
  childhood_care:   store.profilingData.childhood_care,
  family_planning:  store.profilingData.family_planning,
  fam_plan_method:  [...(store.profilingData.fam_plan_method || [])],
  fam_plan_reason:  [...(store.profilingData.fam_plan_reason || [])],
})

const eccdStatus   = ref('')
const eccdServices = ref([])
const eccdReasons  = ref([])

const giveBirthOpts  = ['Home','Barangay Health Center','Rural Health Unit','Government Hospital','Private Hospital','Others, specify']
const prePostOpts    = ['Barangay Health Center','Rural Health Unit','Government Hospital','Private Clinic','Traditional Hilot','None']
const eccdServiceOpts= ['Day Care Center','Botika ng Bata','Kindergarten','Community-based ECCD','Others']
const eccdReasonOpts = ['No available service','Financial constraint','No time','Not aware of services','Others']
const fpMethodOpts   = ['Pills','Injectable','IUD','Implant','Condom','Ligation','Vasectomy','Natural Family Planning','Others, specify']
const fpReasonOpts   = ['Partner does not agree','Religious reasons','Wants more children','Side effects concern','No access','Others, specify']

function buildChildhoodCare() {
  if (eccdStatus.value === 'Not Applicable') return 'Not Applicable'
  if (eccdStatus.value === 'Yes')  return eccdServices.value.length ? `Yes - Services: ${eccdServices.value.join(', ')}` : 'Yes'
  if (eccdStatus.value === 'No')   return eccdReasons.value.length  ? `No - Reasons: ${eccdReasons.value.join(', ')}`   : 'No'
  return ''
}

function handleNext() {
  alertMsg.value = ''
  if (!f.health_condition || !f.health_services || !f.died_pregnancy || !f.child_died || !f.family_planning) {
    alertMsg.value = 'Please complete all required fields.'; return
  }
  if (!f.give_birth.length)    { alertMsg.value = 'Please select at least one birth location.'; return }
  if (!f.pre_post_care.length) { alertMsg.value = 'Please select pre/postnatal care location.'; return }
  if (!eccdStatus.value)       { alertMsg.value = 'Please answer the ECCD question.'; return }

  f.childhood_care = buildChildhoodCare()
  store.patchProfiling({ ...f })
  store.setProfilingStep(4)
}
</script>
