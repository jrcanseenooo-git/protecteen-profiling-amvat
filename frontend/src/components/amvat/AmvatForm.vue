<template>
  <div class="card fade-in">

    <!-- Header -->
    <div class="text-center mb-2">
      <div class="inline-block bg-amvat text-white text-xs font-bold px-3 py-1 rounded-full mb-2">AMVAT</div>
      <h2 class="text-amvat">Adolescent Mother Vulnerability Assessment Tool</h2>
      <p class="text-xs text-gray-400 mt-1">Patnubay: Walang tama o maling sagot. Sumagot nang tapat.</p>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div class="bg-amvat h-2 rounded-full transition-all duration-500"
           :style="{ width: progressPct + '%' }"></div>
    </div>
    <p class="text-xs text-center text-gray-400 mb-6">Page {{ page }} of {{ TOTAL_PAGES }}</p>

    <!-- PAGE 1: Respondent Profile (pre-filled from profiling) -->
    <div v-if="page === 1" class="fade-in">
      <div class="section-title">📋 Respondent Profile</div>
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-700">
        ✓ Information pre-filled from profiling data. You may edit if needed.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div class="field sm:col-span-2">
          <input v-model="p.name" type="text" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Full Name</label>
        </div>
      </div>

      <LocationDropdowns
        :modelRegion="p.region" :modelProvince="p.province"
        :modelMunicipality="p.municipality_city" :modelBarangay="p.barangay"
        @update:modelRegion="p.region = $event"
        @update:modelProvince="p.province = $event"
        @update:modelMunicipality="p.municipality_city = $event"
        @update:modelBarangay="p.barangay = $event"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div class="field">
          <input v-model="p.street_sitio" type="text" placeholder=" " />
          <label class="floating-label">Street / Sitio / Purok</label>
        </div>
        <div class="field">
          <input v-model="p.contact" type="tel" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Contact Number</label>
        </div>
        <div class="field">
          <select v-model="p.civilStatus" required>
            <option value="" disabled hidden></option>
            <option>Single</option><option>Married</option><option>Live-in/Common-Law</option>
            <option>Separated</option><option>Widowed</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Civil Status</label>
        </div>
        <div class="field">
          <select v-model="p.hasChild" @change="onHasChildChange" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo</option><option value="Hindi">Hindi</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>May anak?</label>
        </div>
        <div class="field">
          <input v-model="p.numChildren" type="number" min="1" :disabled="p.hasChild !== 'Oo'" placeholder=" " />
          <label class="floating-label">Ilang anak?</label>
        </div>
        <div class="field">
          <select v-model="p.livingWithPartner" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo</option><option value="Hindi">Hindi</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Kasama ang partner?</label>
        </div>
        <div class="field">
          <select v-model="p.religion" required>
            <option value="" disabled hidden></option>
            <option>None</option><option>Roman Catholic</option><option>Islam</option>
            <option>Iglesia ni Cristo</option><option>Aglipay</option>
            <option>Seventh Day Adventist</option><option>Bible Baptist Church</option>
            <option>Jehovah's Witness</option><option>Others</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Relihiyon</label>
        </div>
        <div class="field">
          <input v-model="p.dateOfBirth" type="date" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Petsa ng Kapanganakan</label>
        </div>
        <div class="field">
          <select v-model="p.education" required>
            <option value="" disabled hidden></option>
            <option>No Grade Completed</option><option>Elementary Level</option>
            <option>Elementary Graduate</option><option>High School Level</option>
            <option>High School Graduate</option><option>Junior High School Level</option>
            <option>Junior High School Graduate</option><option>Senior High School Level</option>
            <option>Senior High School Graduate</option><option>College Level</option>
            <option>College Graduate</option><option>Vocational/Technical</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Pinakamataas na Edukasyon</label>
        </div>
        <div class="field">
          <select v-model="p.occupation" required>
            <option value="" disabled hidden></option>
            <option>Farmer</option><option>Fisher</option><option>Laborer/Unskilled Worker</option>
            <option>Vendor/Trader</option><option>Skilled Worker</option>
            <option>Housewife</option><option>Student</option><option>Unemployed</option>
            <option>Others</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Trabaho</label>
        </div>
      </div>
    </div>

    <!-- PAGES 2–8: Q1–Q25 Likert questions -->
    <div v-for="pg in questionPages" :key="pg.page" v-show="page === pg.page" class="fade-in">
      <div class="section-title">{{ pg.domain }}</div>
      <div v-for="q in pg.questions" :key="q.id" class="q-card">
        <p class="font-medium text-sm leading-snug mb-3">
          <span class="q-number">{{ q.id }}</span>
          {{ q.fil }}
          <span class="block text-gray-400 text-xs italic mt-1 ml-9">{{ q.eng }}</span>
        </p>
        <div class="rating-group">
          <label v-for="opt in likertOpts" :key="opt.val" class="rating-option">
            <input type="radio" :name="'q' + q.id" :value="String(opt.val)"
                   v-model="responses['q' + q.id]" />
            <span class="rating-label">
              <span class="rating-value">{{ opt.val }}</span>
              <span class="rating-text">{{ opt.label }}</span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- PAGE 9: Part II – Risk/Vulnerability Factors -->
    <div v-if="page === 9" class="fade-in">
      <div class="section-title">📊 Part II — Vulnerability Risk Factors</div>
      <p class="text-xs text-gray-500 mb-4">
        Ang bahaging ito ay naglalayong matukoy ang mga karagdagang salik na maaaring makaapekto sa kalagayan ng adolescent mother.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div class="field">
          <select v-model="p.child_disability" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo (May kapansanan/sakit ang anak)</option>
            <option value="Hindi">Hindi</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>May kapansanan/sakit ang anak?</label>
        </div>
        <div class="field">
          <select v-model="p.mother_disability" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo (May kapansanan/sakit ang ina)</option>
            <option value="Hindi">Hindi</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>May kapansanan/sakit ang ina?</label>
        </div>
        <div class="field sm:col-span-2">
          <select v-model="p.living_parents" required>
            <option value="" disabled hidden></option>
            <option value="Both parents are alive and living with them">Both parents alive and living with them</option>
            <option value="Both parents alive but not living with them">Both parents alive but not living with them</option>
            <option value="Solo parent or living with guardian only">Solo parent or living with guardian only</option>
            <option value="Both parents are deceased">Both parents are deceased</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Sitwasyon ng mga magulang</label>
        </div>
        <div class="field">
          <select v-model="p.violence" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo (Nakaranas ng abuse/violence)</option>
            <option value="Hindi">Hindi</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Nakaranas ng abuse/violence?</label>
        </div>
        <div class="field">
          <select v-model="p.age" required>
            <option value="" disabled hidden></option>
            <option value="9-12 yrs old">9–12 taong gulang</option>
            <option value="13-14 yrs old">13–14 taong gulang</option>
            <option value="15-17 yrs old">15–17 taong gulang</option>
            <option value="18-19 yrs old">18–19 taong gulang</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Edad nang unang manganak</label>
        </div>
        <div class="field">
          <select v-model="p.income_source" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo (May sariling kita / matatag na suporta)</option>
            <option value="Hindi">Hindi (Walang kita / walang suporta)</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>May pinagkukunan ng kita?</label>
        </div>
        <div class="field">
          <select v-model="p.education_skills" required>
            <option value="" disabled hidden></option>
            <option value="Oo">Oo (Nag-aaral / may skills training)</option>
            <option value="Hindi">Hindi (Hindi nag-aaral / walang skills)</option>
          </select>
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Kasalukuyang nag-aaral / may training?</label>
        </div>
      </div>
    </div>

    <!-- Alert -->
    <transition name="fade">
      <div v-if="alertMsg"
        class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 my-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <!-- Navigation -->
    <div class="flex justify-between mt-6">
      <button class="btn-secondary" @click="prevPage">← Back</button>
      <button v-if="page < TOTAL_PAGES" class="btn-amvat" @click="nextPage">Next →</button>
      <button v-else class="btn-success" :disabled="submitting" @click="handleSubmit">
        <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ✅ Submit Assessment
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'
import { useAmvatScoring } from '@/composables/useAmvatScoring'
import { LIKERT_OPTS, QUESTION_PAGES } from '@/composables/useAmvatQuestions'
import LocationDropdowns from '@/components/LocationDropdowns.vue'

const store      = useFormStore()
const api        = useApi()
const scoring    = useAmvatScoring()

function onHasChildChange() {
  if (p.hasChild === 'Hindi') p.numChildren = ''
}

const TOTAL_PAGES  = 9
const page         = ref(1)
const alertMsg     = ref('')
const submitting   = ref(false)
const likertOpts   = LIKERT_OPTS
const questionPages= QUESTION_PAGES

const progressPct = computed(() => Math.round((page.value / TOTAL_PAGES) * 100))

// Profile (pre-filled from store)
const p = reactive({ ...store.amvatProfile })

// Responses object { q1: '', q2: '', ... }
const responses = reactive({ ...store.amvatResponses })

// Validation per page
function validateCurrentPage() {
  alertMsg.value = ''

  if (page.value === 1) {
    const required = ['name','region','province','municipality_city','barangay','contact','civilStatus','hasChild','livingWithPartner','religion','dateOfBirth','education','occupation']
    const missing = required.filter(k => !p[k]?.toString().trim())
    if (missing.length) { alertMsg.value = 'Please complete all required profile fields.'; return false }
  }

  // Likert pages 2–8
  if (page.value >= 2 && page.value <= 8) {
    const pg = questionPages.find(q => q.page === page.value)
    if (pg) {
      const unanswered = pg.questions.filter(q => !responses['q' + q.id])
      if (unanswered.length) {
        alertMsg.value = `Please answer all ${unanswered.length} question(s) on this page.`
        return false
      }
    }
  }

  if (page.value === 9) {
    const required = ['child_disability','mother_disability','living_parents','violence','age','income_source','education_skills']
    const missing = required.filter(k => !p[k])
    if (missing.length) { alertMsg.value = 'Please complete all vulnerability factor fields.'; return false }
  }

  return true
}

function nextPage() {
  if (!validateCurrentPage()) return
  // Sync profile updates to store as we go
  store.patchAmvatProfile({ ...p })
  Object.entries(responses).forEach(([k, v]) => store.setAmvatResponse(k, v))
  page.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prevPage() {
  alertMsg.value = ''
  if (page.value === 1) {
    store.setSection('profiling')
    store.setProfilingStep(5)
    return
  }
  page.value--
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  if (!validateCurrentPage()) return

  submitting.value = true
  store.patchAmvatProfile({ ...p })
  Object.entries(responses).forEach(([k, v]) => store.setAmvatResponse(k, v))

  // Calculate scores
  const scores = scoring.calculate(store.amvatResponses, store.amvatProfile)
  store.setAmvatScores(scores)

  try {
    const res = await api.submitAMVAT({
      profile:   store.amvatProfile,
      responses: store.amvatResponses,
      scores,
    })
    if (!res.success) throw new Error(res.error || 'Submission failed')
    store.setSection('results')
  } catch (e) {
    alertMsg.value = '❌ ' + e.message
  } finally {
    submitting.value = false
  }
}
</script>
