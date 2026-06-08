<template>
  <div class="card fade-in">
    <StepProgress :currentStep="2" />
    <div class="step-header mb-6">
      <h3 class="font-bold text-gray-700 text-lg"><span class="material-icons-round step-icon">home</span> SOCIO ECONOMIC</h3>
      <p class="text-sm text-gray-500 mt-1">Information about housing conditions, utilities, and living environment</p>
    </div>

    <!-- Q1: House Type -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">1</span> In what type of building does the family reside? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.house_type" placeholder="Select house type" :options="houseTypeOpts" />
      <div v-if="f.house_type === 'Other housing unit'" class="mt-3">
        <input v-model="f.house_type_other" type="text"
          placeholder="Please specify (boat, cave, etc.)"
          :class="['other-input', otherErrors.house_type ? 'other-input-error' : '']"
          @input="otherErrors.house_type = false" />
        <p v-if="otherErrors.house_type" class="text-danger text-xs mt-1">⚠️ Please specify the house type.</p>
      </div>
    </div>

    <!-- Q2: Roof Material -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">2</span> What type of construction materials are the roofs made of? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.roof_material" placeholder="Select roof material" :options="roofOpts" />
    </div>

    <!-- Q3: Outer Wall -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">3</span> What type of construction materials are the outer walls made of? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.outer_wall" placeholder="Select wall material" :options="wallOpts" />
    </div>

    <!-- Q4: Tenure Status -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">4</span> What is the tenure status of the house and lot? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.tenure_status" placeholder="Select tenure status" :options="tenureOpts" />
    </div>

    <!-- Q5: Toilet Facility -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">5</span> What is the main type of toilet facility the family uses? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.toilet_facility" placeholder="Select toilet facility" :options="toiletOpts" />
      <div v-if="f.toilet_facility === 'Other toilet facility'" class="mt-3">
        <input v-model="f.toilet_other" type="text"
          placeholder="Please specify toilet facility"
          :class="['other-input', otherErrors.toilet_facility ? 'other-input-error' : '']"
          @input="otherErrors.toilet_facility = false" />
        <p v-if="otherErrors.toilet_facility" class="text-danger text-xs mt-1">⚠️ Please specify the toilet facility.</p>
      </div>
    </div>

    <!-- Q6: Water Supply -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">6</span> What is your family's main source of water supply? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.water_supply" placeholder="Select water source" :options="waterOpts" />
      <div v-if="f.water_supply === 'Other Water Supply'" class="mt-3">
        <input v-model="f.water_other" type="text"
          placeholder="Please specify water supply"
          :class="['other-input', otherErrors.water_supply ? 'other-input-error' : '']"
          @input="otherErrors.water_supply = false" />
        <p v-if="otherErrors.water_supply" class="text-danger text-xs mt-1">⚠️ Please specify the water supply.</p>
      </div>
    </div>

    <!-- Q7: Garbage Disposal -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">7</span> What is the main system of garbage disposal adopted by the family? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.garbage_disposal" placeholder="Select garbage disposal method" :options="garbageOpts" />
      <div v-if="f.garbage_disposal === 'Other Garbage Disposal'" class="mt-3">
        <input v-model="f.garbage_other" type="text"
          placeholder="Please specify garbage disposal method"
          :class="['other-input', otherErrors.garbage_disposal ? 'other-input-error' : '']"
          @input="otherErrors.garbage_disposal = false" />
        <p v-if="otherErrors.garbage_disposal" class="text-danger text-xs mt-1">⚠️ Please specify the garbage disposal method.</p>
      </div>
    </div>

    <!-- Q8: Electricity -->
    <div class="question-card mb-4">
      <p class="question-title"><span class="question-number-badge">8</span> Is there electricity in the building/house? <span class="text-red-500">*</span></p>
      <CustomDropdown v-model="f.electricity" placeholder="Select option" :options="electricityOpts" />
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="store.setProfilingStep(1)">← Back</button>
      <button class="btn-primary" @click="handleNext">Next →</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import StepProgress from '@/components/StepProgress.vue'
import { useFormStore } from '@/stores/formStore'
import CustomDropdown from '@/components/CustomDropdown.vue'

const store    = useFormStore()
const alertMsg = ref('')
const otherErrors = reactive({
  house_type: false,
  toilet_facility: false,
  water_supply: false,
  garbage_disposal: false,
})

const f = reactive({
  house_type:       store.profilingData.house_type       || '',
  house_type_other: '',
  roof_material:    store.profilingData.roof_material    || '',
  outer_wall:       store.profilingData.outer_wall       || '',
  tenure_status:    store.profilingData.tenure_status    || '',
  toilet_facility:  store.profilingData.toilet_facility  || '',
  toilet_other:     '',
  water_supply:     store.profilingData.water_supply     || '',
  water_other:      '',
  garbage_disposal: store.profilingData.garbage_disposal || '',
  garbage_other:    '',
  electricity:      store.profilingData.electricity      || '',
})

const houseTypeOpts = [
  { value: 'Single house',                               main: 'Single house',                    sub: 'A house on its own, not attached to any other building' },
  { value: 'Duplex',                                     main: 'Duplex',                          sub: 'A building with two separate living spaces side by side' },
  { value: 'Multi Residential (three units or more)',    main: 'Multi Residential (3+ units)',    sub: 'A building with several separate living spaces' },
  { value: 'Commercial/Industrial/Agricultural Building',main: 'Commercial/Industrial/Agricultural', sub: 'Building used for business, factories, or farm work' },
  { value: 'Institutional Living Quarters',              main: 'Institutional Living Quarters',   sub: 'Settings like schools, hospitals, or military bases' },
  { value: 'Other housing unit',                         main: 'Other housing unit',              sub: 'Please specify (boat, cave, etc.)' },
]
const roofOpts = [
  { value: 'Strong Materials',                              main: 'Strong Materials',              sub: 'Durable materials like metal or concrete' },
  { value: 'Light Materials',                               main: 'Light Materials',               sub: 'Lighter materials like tin, tiles, or plastic' },
  { value: 'Salvaged/Makeshift Materials',                  main: 'Salvaged/Makeshift Materials', sub: 'Recycled or temporary materials' },
  { value: 'Mixed but Predominantly Strong Materials',      main: 'Mixed (Mostly Strong)',         sub: 'Mostly strong, durable materials' },
  { value: 'Mixed but Predominantly Light Materials',       main: 'Mixed (Mostly Light)',          sub: 'Mostly light materials' },
  { value: 'Mixed but Predominantly Salvaged Materials',    main: 'Mixed (Mostly Salvaged)',       sub: 'Mostly salvaged materials' },
  { value: 'Not Applicable',                                main: 'Not Applicable',                sub: 'Not applicable for this structure' },
]
const wallOpts = [
  { value: 'Strong Materials',                              main: 'Strong Materials',              sub: 'Concrete, brick, or stone' },
  { value: 'Light Materials',                               main: 'Light Materials',               sub: 'Wood or bamboo' },
  { value: 'Salvaged/Makeshift Materials',                  main: 'Salvaged/Makeshift Materials', sub: 'Reused or improvised materials' },
  { value: 'Mixed but Predominantly Strong Materials',      main: 'Mixed (Mostly Strong)',         sub: 'Mostly concrete or brick' },
  { value: 'Mixed but Predominantly Light Materials',       main: 'Mixed (Mostly Light)',          sub: 'Mostly wood or bamboo' },
  { value: 'Mixed but Predominantly Salvaged Materials',    main: 'Mixed (Mostly Salvaged)',       sub: 'Primarily salvaged materials' },
  { value: 'Not Applicable',                                main: 'Not Applicable',                sub: 'Not relevant for this structure' },
]
const tenureOpts = [
  { value: 'Own house and lot, owner-like possession',                    main: 'Own house and lot',                         sub: 'Owns both house and land' },
  { value: 'Rented house/room, including lot',                            main: 'Rented house/room, including lot',           sub: 'Pays rent for dwelling and land' },
  { value: 'Own house, rented lot',                                       main: 'Own house, rented lot',                      sub: 'Owns house, rents land' },
  { value: 'Own house, rent-free lot with consent of owner',              main: 'Own house, rent-free lot (with consent)',     sub: 'Owns house, uses land free with permission' },
  { value: 'Own house, rent-free lot without consent of owner',           main: 'Own house, rent-free lot (no consent)',      sub: 'Owns house, occupies land without permission' },
  { value: 'Rent-free house and lot with consent of owner',               main: 'Rent-free house and lot (with consent)',     sub: "Lives rent-free with owner's permission" },
  { value: 'Rent-free house and lot without consent of owner',            main: 'Rent-free house and lot (no consent)',       sub: 'Occupies both without permission' },
  { value: 'Not Applicable',                                              main: 'Not Applicable',                             sub: 'Cannot be determined' },
]
const toiletOpts = [
  { value: 'Water-sealed, sewer septic tank, used exclusively by household', main: 'Water-sealed (exclusive use)', sub: 'Private flush toilet with septic tank' },
  { value: 'Water-sealed, sewer septic tank, shared with other households',  main: 'Water-sealed (shared)',         sub: 'Shared flush toilet with septic tank' },
  { value: 'Closed pit',          main: 'Closed pit',        sub: 'Covered pit latrine' },
  { value: 'Open pit',            main: 'Open pit',          sub: 'Waste in uncovered pit' },
  { value: 'Other toilet facility', main: 'Others',           sub: 'Please specify' },
]
const waterOpts = [
  { value: 'Own use, faucet, community water system',  main: 'Own faucet, community water',   sub: 'Exclusive faucet, public supply' },
  { value: 'Shared, faucet, community water system',   main: 'Shared faucet, community water', sub: 'Shared faucet, public supply' },
  { value: 'Own use, tubed / piped deep well',         main: 'Own deep well with pump',        sub: 'Exclusive deep well access' },
  { value: 'Shared, tubed / piped deep well',          main: 'Shared deep well with pump',     sub: 'Shared deep well access' },
  { value: 'Tubed / piped shallow well',               main: 'Shallow well with pump',         sub: 'Shallow groundwater source' },
  { value: 'Dug Well',                                 main: 'Dug Well',                      sub: 'Manually or mechanically dug' },
  { value: 'Protected Spring',                         main: 'Protected Spring',               sub: 'Enclosed natural spring' },
  { value: 'Unprotected Spring',                       main: 'Unprotected Spring',             sub: 'Natural spring without protection' },
  { value: 'Lake, river, rain',                        main: 'Lake, river, rain',              sub: 'Surface water or rainwater' },
  { value: 'Peddler',                                  main: 'Peddler',                        sub: 'Water delivered by vendors' },
  { value: 'Other Water Supply',                       main: 'Others',                         sub: 'Please specify' },
]
const garbageOpts = [
  { value: 'Garbage collection',                               main: 'Garbage collection',  sub: 'Regular collection by local government' },
  { value: 'Burning',                                          main: 'Burning',              sub: 'Household burns waste' },
  { value: 'Composting',                                       main: 'Composting',           sub: 'Biodegradable waste as fertilizer' },
  { value: 'Recycling',                                        main: 'Recycling',            sub: 'Non-biodegradable waste separated' },
  { value: 'Waste Segregation',                                main: 'Waste Segregation',   sub: 'Garbage sorted before disposal' },
  { value: 'Pit with cover',                                   main: 'Pit with cover',       sub: 'Waste buried in covered pit' },
  { value: 'Pit without cover',                                main: 'Pit without cover',   sub: 'Waste in open pit' },
  { value: 'Throwing of garbage in rivers, vacant lots, etc.', main: 'Improper disposal',  sub: 'Disposal in open spaces/waterways' },
  { value: 'Other Garbage Disposal',                           main: 'Others',               sub: 'Please specify another method' },
]
const electricityOpts = [
  { value: 'Yes', main: 'YES', sub: '' },
  { value: 'No',  main: 'NO',  sub: '' },
]

const REQUIRED = ['house_type','roof_material','outer_wall','tenure_status','toilet_facility','water_supply','garbage_disposal','electricity']

function handleNext() {
  alertMsg.value = ''

  // Validate "Other" specify fields
  otherErrors.house_type       = f.house_type === 'Other housing unit'    && !f.house_type_other?.trim()
  otherErrors.toilet_facility  = f.toilet_facility === 'Other toilet facility' && !f.toilet_other?.trim()
  otherErrors.water_supply     = f.water_supply === 'Other Water Supply'  && !f.water_other?.trim()
  otherErrors.garbage_disposal = f.garbage_disposal === 'Other Garbage Disposal' && !f.garbage_other?.trim()

  if (Object.values(otherErrors).some(v => v)) {
    alertMsg.value = 'Please specify the "Others" field before proceeding.'
    return
  }

  const missing = REQUIRED.filter(k => !f[k])
  if (missing.length) { alertMsg.value = 'Please answer all required questions before proceeding.'; return }

  // Resolve "Other" inputs
  const resolved = { ...f }
  if (f.house_type === 'Other housing unit' && f.house_type_other?.trim())
    resolved.house_type = `Other housing unit: ${f.house_type_other.trim()}`
  if (f.toilet_facility === 'Other toilet facility' && f.toilet_other?.trim())
    resolved.toilet_facility = `Other toilet facility: ${f.toilet_other.trim()}`
  if (f.water_supply === 'Other Water Supply' && f.water_other?.trim())
    resolved.water_supply = `Other Water Supply: ${f.water_other.trim()}`
  if (f.garbage_disposal === 'Other Garbage Disposal' && f.garbage_other?.trim())
    resolved.garbage_disposal = `Other Garbage Disposal: ${f.garbage_other.trim()}`

  store.patchProfiling(resolved)
  store.setProfilingStep(3)
}
</script>

<style scoped>
.question-card { @apply bg-white border border-gray-200 rounded-xl p-5 shadow-sm; }
.question-title { @apply font-semibold text-gray-800 text-sm mb-3 flex items-start gap-2; }
.question-number-badge { @apply inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shrink-0; }
.other-input {
  @apply w-full border-2 border-primary rounded-xl px-4 py-2.5 text-sm outline-none;
  font-family: inherit;
  transition: box-shadow 0.2s;
}
.other-input:focus { box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
.other-input-error { border-color: #dc3545 !important; box-shadow: 0 0 0 3px rgba(220,53,69,0.15) !important; }
</style>
