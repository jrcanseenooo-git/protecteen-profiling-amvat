<template>
  <div class="card fade-in">
    <div class="breadcrumb">
      <span class="breadcrumb-item done">✓ Profile</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Housing</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Health</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item active">🌍 Social</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item">👨‍👩‍👧 Family</span>
    </div>
    <h3 class="font-semibold text-gray-700 mb-4">🌍 SOCIAL &amp; ENVIRONMENTAL</h3>

    <!-- Natural Disasters -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3"><span class="q-number">1</span> Natural disasters experienced (last 5 years)</p>
      <div class="check-group">
        <label v-for="opt in disasterOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.natural_disasters" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
    </div>

    <!-- Human Hazards -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3"><span class="q-number">2</span> Human-induced hazards experienced</p>
      <div class="check-group">
        <label v-for="opt in hazardOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.human_hazards" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
    </div>

    <!-- Forced Displacement -->
    <div class="field">
      <select v-model="f.forced_displacement">
        <option value="" disabled hidden></option>
        <option>Yes</option><option>No</option>
      </select>
      <label class="floating-label">Experienced forced displacement?</label>
    </div>

    <!-- Violence -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3"><span class="q-number">4</span> Forms of violence experienced</p>
      <div class="check-group">
        <label v-for="opt in violenceOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.violence" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
    </div>

    <!-- Vices -->
    <div class="q-card">
      <p class="font-medium text-sm mb-3"><span class="q-number">5</span> Vices present in household</p>
      <div class="check-group">
        <label v-for="opt in viceOpts" :key="opt" class="check-item">
          <input type="checkbox" :value="opt" v-model="f.vices" />
          <span class="text-sm">{{ opt }}</span>
        </label>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(3)">← Back</button>
      <button class="btn-primary" @click="handleNext">Family Members →</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store = useFormStore()
const f = reactive({
  natural_disasters:   [...(store.profilingData.natural_disasters || [])],
  human_hazards:       [...(store.profilingData.human_hazards || [])],
  forced_displacement: store.profilingData.forced_displacement || '',
  violence:            [...(store.profilingData.violence || [])],
  vices:               [...(store.profilingData.vices || [])],
})

const disasterOpts = ['None','Drought','Flooding','Earthquake','Volcanic eruptions','Typhoon/Storm','Landslide','Tsunami','Others']
const hazardOpts   = ['None','Fire','Chemical spill','Industrial accident','Oil spill','Armed conflict','Others']
const violenceOpts = ['None','Physical violence','Sexual violence','Psychological/Emotional abuse','Economic abuse','Others']
const viceOpts     = ['None','Alcohol','Illegal drugs','Gambling','Tobacco','Others']

function handleNext() {
  store.patchProfiling({ ...f })
  store.setProfilingStep(5)
}
</script>
