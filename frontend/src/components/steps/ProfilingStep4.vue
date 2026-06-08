<template>
  <div class="card fade-in">
    <StepProgress :currentStep="4" />
    <div class="mb-6">
      <h3 class="font-bold text-gray-700 text-lg"><span class="material-icons-round step-icon">public</span> SOCIAL AND ENVIRONMENTAL IMPACTS</h3>
      <p class="text-sm text-gray-500 mt-1">Information about disasters, hazards, and social factors</p>
    </div>

    <!-- Q1: Natural Disasters -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">1</span> Has the family experienced any natural disasters in the last 5 years? <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in disasterOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.natural_disasters" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.natural_disasters.includes('Others, specify')" class="mt-2">
        <input v-model="disasterOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.disaster ? 'border-danger' : 'border-primary']"
          @input="otherErrors.disaster = false" />
        <p v-if="otherErrors.disaster" class="text-danger text-xs mt-1">⚠️ Please specify this field.</p>
      </div>
    </div>

    <!-- Q2: Human Hazards -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">2</span> Has the family experienced any human-induced hazards in the last 5 years? <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in hazardOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.human_hazards" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.human_hazards.includes('Others, specify')" class="mt-2">
        <input v-model="hazardOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.hazard ? 'border-danger' : 'border-primary']"
          @input="otherErrors.hazard = false" />
        <p v-if="otherErrors.hazard" class="text-danger text-xs mt-1">⚠️ Please specify this field.</p>
      </div>
    </div>

    <!-- Q3: Forced Displacement -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">3</span> Has your family experienced forced displacement brought about by natural and human-induced disasters?</p>
      <div class="flex gap-3">
        <div class="option-item flex-1" :class="{ selected: f.forced_displacement === 'Yes' }" @click="f.forced_displacement = 'Yes'"><span class="opt-main">Yes</span></div>
        <div class="option-item flex-1" :class="{ selected: f.forced_displacement === 'No' }" @click="f.forced_displacement = 'No'"><span class="opt-main">No</span></div>
      </div>
    </div>

    <!-- Q4: Violence -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">4</span> Has any member of the family ever experienced any form of the following violence? <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in violenceOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.violence" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.violence.includes('Others, specify')" class="mt-2">
        <input v-model="violenceOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.violence ? 'border-danger' : 'border-primary']"
          @input="otherErrors.violence = false" />
        <p v-if="otherErrors.violence" class="text-danger text-xs mt-1">⚠️ Please specify this field.</p>
      </div>
    </div>

    <!-- Q5: Vices -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">5</span> Is there anyone in the family that has vices? <span class="text-xs text-gray-400 font-normal">(Check all that applies)</span></p>
      <div class="check-group">
        <label v-for="opt in viceOpts" :key="opt.value" class="check-item">
          <input type="checkbox" :value="opt.value" v-model="f.vices" />
          <span class="text-sm">{{ opt.label }}</span>
        </label>
      </div>
      <div v-if="f.vices.includes('Others, specify')" class="mt-2">
        <input v-model="vicesOther" type="text" placeholder="Please specify..."
          :class="['w-full border-2 rounded-xl px-4 py-2 text-sm outline-none', otherErrors.vices ? 'border-danger' : 'border-primary']"
          @input="otherErrors.vices = false" />
        <p v-if="otherErrors.vices" class="text-danger text-xs mt-1">⚠️ Please specify this field.</p>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(3)">← Back</button>
      <button class="btn-primary" @click="handleNext">Next →</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import StepProgress from '@/components/StepProgress.vue'
import { useFormStore } from '@/stores/formStore'

const store = useFormStore()
const otherErrors = reactive({
  disaster: false,
  hazard: false,
  violence: false,
  vices: false,
})
const disasterOther = ref('')
const hazardOther   = ref('')
const violenceOther = ref('')
const vicesOther    = ref('')

const f = reactive({
  natural_disasters:   [...(store.profilingData.natural_disasters || [])],
  human_hazards:       [...(store.profilingData.human_hazards || [])],
  forced_displacement: store.profilingData.forced_displacement || '',
  violence:            [...(store.profilingData.violence || [])],
  vices:               [...(store.profilingData.vices || [])],
})

const disasterOpts = [
  { value: 'None', label: 'None' },
  { value: 'Drought', label: 'Drought' },
  { value: 'Flooding', label: 'Flooding' },
  { value: 'Earthquake', label: 'Earthquake' },
  { value: 'Volcanic eruptions', label: 'Volcanic eruptions' },
  { value: 'Typhoon', label: 'Typhoon' },
  { value: 'Landslide', label: 'Landslide' },
  { value: 'Tsunami', label: 'Tsunami' },
  { value: 'Storm Surge', label: 'Storm Surge' },
  { value: 'Others, specify', label: 'Others, specify' },
]
const hazardOpts = [
  { value: 'None', label: 'None' },
  { value: 'Armed-conflict', label: 'Armed-conflict' },
  { value: 'Crime', label: 'Crime' },
  { value: 'Arson', label: 'Arson' },
  { value: 'Cyber-attacks', label: 'Cyber-attacks' },
  { value: 'Accidents', label: 'Accidents' },
  { value: 'Others, specify', label: 'Others, specify' },
]
const violenceOpts = [
  { value: 'No', label: 'No' },
  { value: 'Physical', label: 'Physical' },
  { value: 'Sexual', label: 'Sexual' },
  { value: 'Emotional', label: 'Emotional' },
  { value: 'Psychological', label: 'Psychological' },
  { value: 'Economic', label: 'Economic' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Others, specify', label: 'Others, specify' },
]
const viceOpts = [
  { value: 'No', label: 'No' },
  { value: 'Smoking', label: 'Smoking' },
  { value: 'Drugs', label: 'Drugs' },
  { value: 'Alcohol', label: 'Alcohol' },
  { value: 'Gambling', label: 'Gambling' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Others, specify', label: 'Others, specify' },
]

function resolveOther(arr, otherVal, otherText) {
  return arr.map(v => v === otherVal && otherText ? `${otherVal}: ${otherText}` : v)
}

function handleNext() {
  // Validate "Others, specify" text inputs
  otherErrors.disaster = f.natural_disasters.includes('Others, specify') && !disasterOther.value?.trim()
  otherErrors.hazard   = f.human_hazards.includes('Others, specify') && !hazardOther.value?.trim()
  otherErrors.violence = f.violence.includes('Others, specify') && !violenceOther.value?.trim()
  otherErrors.vices    = f.vices.includes('Others, specify') && !vicesOther.value?.trim()

  if (Object.values(otherErrors).some(v => v)) return

  f.natural_disasters = resolveOther(f.natural_disasters, 'Others, specify', disasterOther.value)
  f.human_hazards     = resolveOther(f.human_hazards, 'Others, specify', hazardOther.value)
  f.violence          = resolveOther(f.violence, 'Others, specify', violenceOther.value)
  f.vices             = resolveOther(f.vices, 'Others, specify', vicesOther.value)
  store.patchProfiling({ ...f })
  store.setProfilingStep(5)
}
</script>

<style scoped>
.question-card { @apply bg-white border border-gray-200 rounded-xl p-5 shadow-sm; }
.question-title { @apply font-semibold text-gray-800 text-sm mb-3 flex items-start gap-2 flex-wrap; }
.question-number-badge { @apply inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shrink-0; }
.option-item { @apply border-2 border-gray-200 rounded-xl p-3 cursor-pointer transition-all hover:border-primary hover:bg-purple-50 flex flex-col; }
.option-item.selected { @apply border-primary bg-purple-50; }
.opt-main { @apply font-medium text-sm text-gray-800; }
</style>
