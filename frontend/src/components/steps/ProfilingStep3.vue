<template>
  <div class="card fade-in">
    <StepProgress :currentStep="3" />
    <div class="mb-6">
      <h3 class="font-bold text-gray-700 text-lg"><span class="material-icons-round step-icon">medication</span> HEALTH</h3>
      <p class="text-sm text-gray-500 mt-1">Information about health conditions, services, and maternal care</p>
    </div>

    <!-- Q1: Health Condition -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">1</span> What is the health condition of the family members in the past month? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.health_condition" placeholder="Select health condition" :options="healthConditionOpts" />
    </div>

    <!-- Q2: Health Services -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">2</span> Have the family members availed health services in the past 3 months? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.health_services" placeholder="Select option" :options="healthServicesOpts" />
    </div>

    <!-- Q3: Give Birth -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">3</span> In cases of pregnancies, where do women in the family give birth? <span class="text-red-500">*</span> <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in giveBirthOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.give_birth" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.give_birth.includes('Others, specify')" class="mt-2">
        <input v-model="giveBirthOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.giveBirth ? 'border-danger' : 'border-primary']"
          @input="otherErrors.giveBirth = false" />
        <p v-if="otherErrors.giveBirth" class="text-danger text-xs mt-1">⚠️ Please specify the birth location.</p>
      </div>
    </div>

    <!-- Q4: Pre/Post Natal Care -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">4</span> Where do the pregnant women in the family visit for pre and postnatal care? <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in prePostOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.pre_post_care" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.pre_post_care.includes('Others, specify')" class="mt-2">
        <input v-model="prePostOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.prePost ? 'border-danger' : 'border-primary']"
          @input="otherErrors.prePost = false" />
        <p v-if="otherErrors.prePost" class="text-danger text-xs mt-1">⚠️ Please specify the prenatal care location.</p>
      </div>
    </div>

    <!-- Q5: Died in Pregnancy -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">5</span> Has any woman in the family died due to pregnancy? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.died_pregnancy" placeholder="Select option" :options="yesNoOpts" />
    </div>

    <!-- Q6: Child Died -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">6</span> Has any child in the family below 5 years old died? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.child_died" placeholder="Select option" :options="yesNoOpts" />
    </div>

    <!-- Q7: ECCD -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">7</span> Have any of the family members availed early childhood care and development services in the past 6 months? <span class="text-red-500">*</span></p>
      <div class="flex gap-3 mb-3">
        <div class="option-item flex-1" :class="{ selected: eccdStatus === 'Yes' }" @click="eccdStatus = 'Yes'"><span class="opt-main">YES</span></div>
        <div class="option-item flex-1" :class="{ selected: eccdStatus === 'No' }" @click="eccdStatus = 'No'"><span class="opt-main">NO</span></div>
        <div class="option-item flex-1" :class="{ selected: eccdStatus === 'Not Applicable' }" @click="eccdStatus = 'Not Applicable'"><span class="opt-main">NOT APPLICABLE</span></div>
      </div>
      <!-- ECCD Services if Yes -->
      <div v-if="eccdStatus === 'Yes'" class="mt-3 border-t pt-3">
        <p class="text-sm font-medium text-gray-700 mb-2">7a. What are the early childhood care and development services availed? <span class="text-red-500">*</span> <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
        <div class="check-group">
          <label v-for="opt in eccdServiceOpts" :key="opt.value" class="check-item">
            <input type="checkbox" :value="opt.value" v-model="eccdServices" />
            <span class="text-sm">{{ opt.label }}</span>
          </label>
        </div>
        <input v-if="eccdServices.includes('Others')" v-model="eccdServicesOther" type="text" placeholder="Please specify..." class="mt-2 w-full border-2 border-primary rounded-xl px-4 py-2 text-sm outline-none" />
      </div>
      <!-- ECCD Reasons if No -->
      <div v-if="eccdStatus === 'No'" class="mt-3 border-t pt-3">
        <p class="text-sm font-medium text-gray-700 mb-2">7b. The family did not avail ECCD services in the past 6 months. Cite reasons: <span class="text-red-500">*</span> <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
        <div class="check-group">
          <label v-for="opt in eccdReasonOpts" :key="opt.value" class="check-item">
            <input type="checkbox" :value="opt.value" v-model="eccdReasons" />
            <span class="text-sm">{{ opt.label }}</span>
          </label>
        </div>
        <input v-if="eccdReasons.includes('Others')" v-model="eccdReasonsOther" type="text" placeholder="Please specify..." class="mt-2 w-full border-2 border-primary rounded-xl px-4 py-2 text-sm outline-none" />
      </div>
    </div>

    <!-- Q8: Family Planning -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">8</span> Do you practice any family planning methods? <span class="text-red-500">*</span></p>
      <div class="flex gap-3 mb-3">
        <div class="option-item flex-1" :class="{ selected: f.family_planning === 'Yes' }" @click="f.family_planning = 'Yes'"><span class="opt-main">YES (Proceed to question 9)</span></div>
        <div class="option-item flex-1" :class="{ selected: f.family_planning === 'No' }" @click="f.family_planning = 'No'"><span class="opt-main">NO (Proceed to question 10)</span></div>
      </div>
      <!-- FP Methods if Yes -->
      <div v-if="f.family_planning === 'Yes'" class="mt-3 border-t pt-3">
        <p class="text-sm font-medium text-gray-700 mb-2">9. What family planning methods do you use? <span class="text-red-500">*</span> <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
        <div class="check-group">
          <label v-for="opt in fpMethodOpts" :key="opt.value" class="check-item">
            <input type="checkbox" :value="opt.value" v-model="f.fam_plan_method" />
            <span class="text-sm">{{ opt.label }}</span>
          </label>
        </div>
        <input v-if="f.fam_plan_method.includes('Others, specify')" v-model="fpMethodOther" type="text" placeholder="Please specify..." class="mt-2 w-full border-2 border-primary rounded-xl px-4 py-2 text-sm outline-none" />
      </div>
      <!-- FP Reasons if No -->
      <div v-if="f.family_planning === 'No'" class="mt-3 border-t pt-3">
        <p class="text-sm font-medium text-gray-700 mb-2">10. What are the reasons for not using any family planning method? <span class="text-red-500">*</span> <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
        <div class="check-group">
          <label v-for="opt in fpReasonOpts" :key="opt.value" class="check-item">
            <input type="checkbox" :value="opt.value" v-model="f.fam_plan_reason" />
            <span class="text-sm">{{ opt.label }}</span>
          </label>
        </div>
        <input v-if="f.fam_plan_reason.includes('Others, specify')" v-model="fpReasonOther" type="text" placeholder="Please specify..." class="mt-2 w-full border-2 border-primary rounded-xl px-4 py-2 text-sm outline-none" />
      </div>
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">⚠️ {{ alertMsg }}</div>
    </transition>
    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(2)">Back</button>
      <button class="btn-primary" @click="handleNext">Next</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import StepProgress from '@/components/StepProgress.vue'
import { useFormStore } from '@/stores/formStore'
import CustomDropdown from '@/components/CustomDropdown.vue'

const store = useFormStore()
const alertMsg = ref('')
const otherErrors = reactive({
  giveBirth: false,
  prePost: false,
  fpMethod: false,
  fpReason: false,
  eccdServices: false,
  eccdReasons: false,
})
const giveBirthOther = ref('')
const prePostOther = ref('')
const eccdStatus = ref('')
const eccdServices = ref([])
const eccdServicesOther = ref('')
const eccdReasons = ref([])
const eccdReasonsOther = ref('')
const fpMethodOther = ref('')
const fpReasonOther = ref('')

const f = reactive({
  health_condition: store.profilingData.health_condition || '',
  health_services:  store.profilingData.health_services  || '',
  give_birth:       [...(store.profilingData.give_birth || [])],
  pre_post_care:    [...(store.profilingData.pre_post_care || [])],
  died_pregnancy:   store.profilingData.died_pregnancy   || '',
  child_died:       store.profilingData.child_died       || '',
  childhood_care:   store.profilingData.childhood_care   || '',
  family_planning:  store.profilingData.family_planning  || '',
  fam_plan_method:  [...(store.profilingData.fam_plan_method || [])],
  fam_plan_reason:  [...(store.profilingData.fam_plan_reason || [])],
})

const yesNoOpts = [
  { value: 'Yes', main: 'YES', sub: '' },
  { value: 'No',  main: 'NO',  sub: '' },
]
const healthConditionOpts = [
  { value: 'Two or more family members got sick of an illness needing hospital confinement', main: 'Two or more family members – hospital confinement', sub: 'Multiple family members needed hospital care' },
  { value: 'One family member got sick of an illness needing hospital confinement', main: 'One family member – hospital confinement', sub: 'Single family member needed hospital care' },
  { value: 'Two or more family members got sick of an illness needing medical attention but did not need hospital confinement (diarrhea, high fever, etc.)', main: 'Two or more family members – medical attention only', sub: 'Diarrhea, high fever, etc. but no hospitalization' },
  { value: 'One family member got sick of an illness needing medical attention but did not need hospital confinement (diarrhea, high fever, etc.)', main: 'One family member – medical attention only', sub: 'Diarrhea, high fever, etc. but no hospitalization' },
  { value: 'No family member got sick of an illness needing medical attention or confinement (other than ordinary headaches, colds, etc.)', main: 'No family member got sick', sub: 'Only ordinary headaches, colds, etc.' },
]
const healthServicesOpts = [
  { value: 'No family member availed the health services provided in the community or other health facilities', main: 'No family member availed', sub: 'No one used health services' },
  { value: 'At least one family member availed the health services provided in the community or other health facilities once.', main: 'At least one member – availed once', sub: 'One family member used services once' },
  { value: 'At least one family member has availed the health services provided in the community at least 3 times.', main: 'At least one member – availed 3+ times', sub: 'One family member used services multiple times' },
  { value: 'All family members have availed the health services provided in the community at least once.', main: 'All family members – availed at least once', sub: 'Everyone used services at least once' },
]
const giveBirthOpts = [
  { value: 'Not Applicable', label: 'Not Applicable' },
  { value: 'Own home', label: 'Own home' },
  { value: 'Other home', label: 'Other home' },
  { value: 'Government hospital', label: 'Government hospital' },
  { value: 'Rural/Urban health center/Public Lying Inn', label: 'Rural/Urban health center / Public Lying Inn' },
  { value: 'Barangay Health Station', label: 'Barangay Health Station' },
  { value: 'Private Hospital/Clinic/Lying Inn', label: 'Private Hospital/Clinic/Lying Inn' },
  { value: 'Industry-based Clinic', label: 'Industry-based Clinic' },
  { value: 'Others, specify', label: 'Others, specify' },
]
const prePostOpts = [
  { value: 'Own home', label: 'Own home' },
  { value: 'Government hospital', label: 'Government hospital' },
  { value: 'Rural/Urban health center/Public Lying Inn', label: 'Rural/Urban health center / Public Lying Inn' },
  { value: 'Barangay Health Station', label: 'Barangay Health Station' },
  { value: 'Private Hospital/Clinic/Lying Inn', label: 'Private Hospital/Clinic/Lying Inn' },
  { value: 'Traditional healers i.e. hilot ', label: 'Traditional healers i.e. hilot' },
  { value: 'Others, specify', label: 'Others, specify' },
]
const eccdServiceOpts = [
  { value: 'Child Minding Services', label: 'Child Minding Services' },
  { value: 'Day Care Services / ECCD', label: 'Day Care Services / ECCD' },
  { value: 'Supplementary Feeding', label: 'Supplementary Feeding' },
  { value: 'Home-based program', label: 'Home-based program (supervised neighborhood play, parent education, home visiting programs)' },
  { value: 'School supplies', label: 'School supplies' },
  { value: 'Health and nutrition services', label: 'Health and nutrition services (deworming, dental/health check-up, provision of vitamins, etc.)' },
  { value: 'Psychosocial intervention', label: 'Psychosocial intervention' },
  { value: 'Referral to health, education and social services', label: 'Referral to health, education and social services' },
  { value: 'Others', label: 'Others, specify' },
]
const eccdReasonOpts = [
  { value: 'Inadequate ECCD facilities', label: 'Inadequate ECCD facilities' },
  { value: 'Inaccessible ECCD facilities', label: 'Inaccessible ECCD facilities' },
  { value: 'Against cultural belief or customary practices', label: 'Against cultural belief or customary practices' },
  { value: 'Inadequate school supplies', label: 'Inadequate school supplies' },
  { value: 'Poor client services', label: 'Poor client services were being offered, e.g., long queues, discourteous personnel, etc.' },
  { value: 'Others', label: 'Others, specify' },
]
const fpMethodOpts = [
  { value: 'Female Sterilization', label: 'Female Sterilization' },
  { value: 'Male Sterilization', label: 'Male Sterilization' },
  { value: 'Oral contraceptive pills', label: 'Oral contraceptive pills' },
  { value: 'Implants', label: 'Implants' },
  { value: 'Injectables', label: 'Injectables' },
  { value: 'Vaginal rings', label: 'Vaginal rings' },
  { value: 'Intra- uterine devices', label: 'Intra-uterine devices' },
  { value: 'Condoms', label: 'Condoms' },
  { value: 'Withdrawal', label: 'Withdrawal' },
  { value: 'Calendar/Rhythm/Periodic Abstinence', label: 'Calendar/Rhythm/Periodic Abstinence' },
  { value: 'Basal Body Temperature', label: 'Basal Body Temperature' },
  { value: 'Others, specify', label: 'Other methods, specify' },
]
const fpReasonOpts = [
  { value: 'Planning to have a baby', label: 'Planning to have a baby' },
  { value: 'Lack of information', label: 'Lack of information' },
  { value: 'Opposition by partners or families', label: 'Opposition by partners or families' },
  { value: 'Opposition by community tribal leaders', label: 'Opposition by community tribal leaders' },
  { value: 'Against cultural belief or customary practices', label: 'Against cultural belief or customary practices' },
  { value: 'Discomfort in the use of barriers during sexual act', label: 'Discomfort in the use of barriers during sexual act' },
  { value: 'Risk of producing an unwanted pregnancy adds flavor to the sexual act', label: 'Risk of producing an unwanted pregnancy adds flavor to the sexual act' },
  { value: 'Others, specify', label: 'Others, specify' },
]

function buildChildhoodCare() {
  if (eccdStatus.value === 'Not Applicable') return 'Not Applicable'
  if (eccdStatus.value === 'Yes') {
    const services = eccdServices.value.map(s => s === 'Others' && eccdServicesOther.value ? `Others: ${eccdServicesOther.value}` : s)
    return `Yes - Services: ${services.join(', ')}`
  }
  if (eccdStatus.value === 'No') {
    const reasons = eccdReasons.value.map(r => r === 'Others' && eccdReasonsOther.value ? `Others: ${eccdReasonsOther.value}` : r)
    return `No - Reasons: ${reasons.join(', ')}`
  }
  return ''
}

function resolveCheckboxOther(arr, otherValue, otherText) {
  return arr.map(v => v === otherValue && otherText ? `${otherValue}: ${otherText}` : v)
}

function handleNext() {
  alertMsg.value = ''
  // Validate "Others, specify" text inputs
  otherErrors.giveBirth  = f.give_birth.includes('Others, specify') && !giveBirthOther.value?.trim()
  otherErrors.prePost    = f.pre_post_care.includes('Others, specify') && !prePostOther.value?.trim()
  otherErrors.fpMethod   = f.family_planning === 'Yes' && f.fam_plan_method.includes('Others, specify') && !fpMethodOther.value?.trim()
  otherErrors.fpReason   = f.family_planning === 'No' && f.fam_plan_reason.includes('Others, specify') && !fpReasonOther.value?.trim()

  if (Object.values(otherErrors).some(v => v)) {
    alertMsg.value = 'Please fill in all "Others — Please specify" fields.'
    return
  }

  if (!f.health_condition) { alertMsg.value = 'Please answer Question 1 (Health Condition).'; return }
  if (!f.health_services)  { alertMsg.value = 'Please answer Question 2 (Health Services).'; return }
  if (!f.give_birth.length){ alertMsg.value = 'Please answer Question 3 (Where do women give birth?).'; return }
  if (!f.died_pregnancy)   { alertMsg.value = 'Please answer Question 5 (Died during pregnancy?).'; return }
  if (!f.child_died)       { alertMsg.value = 'Please answer Question 6 (Child died?).'; return }
  if (!eccdStatus.value)   { alertMsg.value = 'Please answer Question 7 (ECCD Services).'; return }
  if (eccdStatus.value === 'Yes' && !eccdServices.value.length) { alertMsg.value = 'Please select at least one ECCD service (Question 7a).'; return }
  if (eccdStatus.value === 'No' && !eccdReasons.value.length)  { alertMsg.value = 'Please select at least one reason for not availing ECCD (Question 7b).'; return }
  if (!f.family_planning)  { alertMsg.value = 'Please answer Question 8 (Family Planning).'; return }
  if (f.family_planning === 'Yes' && !f.fam_plan_method.length) { alertMsg.value = 'Please select at least one family planning method (Question 9).'; return }
  if (f.family_planning === 'No' && !f.fam_plan_reason.length)  { alertMsg.value = 'Please select at least one reason (Question 10).'; return }

  f.childhood_care = buildChildhoodCare()
  f.give_birth   = resolveCheckboxOther(f.give_birth, 'Others, specify', giveBirthOther.value)
  f.pre_post_care= resolveCheckboxOther(f.pre_post_care, 'Others, specify', prePostOther.value)
  f.fam_plan_method = resolveCheckboxOther(f.fam_plan_method, 'Others, specify', fpMethodOther.value)
  f.fam_plan_reason = resolveCheckboxOther(f.fam_plan_reason, 'Others, specify', fpReasonOther.value)

  store.patchProfiling({ ...f })
  store.setProfilingStep(4)
}
</script>

<style scoped>
.question-card { @apply bg-white border border-gray-200 rounded-xl p-5 shadow-sm; }
.question-title { @apply font-semibold text-gray-800 text-sm mb-3 flex items-start gap-2 flex-wrap; }
.question-number-badge { @apply inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shrink-0; }
.option-grid { @apply grid grid-cols-1 sm:grid-cols-2 gap-2; }
.option-item { @apply border-2 border-gray-200 rounded-xl p-3 cursor-pointer transition-all hover:border-primary hover:bg-purple-50 flex flex-col; }
.option-item.selected { @apply border-primary bg-purple-50; }
.opt-main { @apply font-medium text-sm text-gray-800; }
.opt-sub  { @apply text-xs text-gray-400 mt-0.5; }
</style>
