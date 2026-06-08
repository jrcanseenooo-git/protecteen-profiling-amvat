<template>
  <div class="card fade-in">

    <!-- ═══ PAGE 0: Patnubay / Introduction ═══ -->
    <div v-if="page === 0" class="fade-in text-center">
      <!-- <div class="inline-block bg-amvat text-white text-xs font-bold px-3 py-1 rounded-full mb-3">AMVAT</div> -->
      <h2 class="text-amvat text-xl font-bold mb-1">Adolescent Mother Vulnerability Assessment Tool</h2>
      <p class="text-xs text-gray-400 mb-6"></p>

      <div class="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <p class="text-sm font-semibold text-gray-700 mb-2">
          <strong>Target Respondent:</strong> Adolescent Mother
        </p>
        <p class="text-sm font-bold text-danger mb-3">Patnubay sa pagsagot:</p>
        <p class="text-sm text-gray-700 leading-relaxed text-justify">
          Ang tool na ito ay nilikha upang maunawaan ang iyong <em>knowledge, skills and attitude</em> bilang adolescent
          mother. Walang tama o maling sagot. Ang iyong mga kasagutan ay mahalaga sapagkat makatutulong ang mga ito
          upang higit pang mapabuti ang mga serbisyo at suportang ibinibigay sa iyo. Hinihiling namin na ikaw
          ay sumagot <strong>nang</strong> tapat at ayon sa iyong tunay na karanasan at nararamdaman.
        </p>
      </div>

      <button class="btn-primary w-full py-4 text-base font-bold" @click="page = 1; scrollTop()">
        Simulan ang Assessment
      </button>
    </div>

    <!-- ═══ PAGES 1–8 ═══ -->
    <template v-if="page >= 1">
      <!-- Header -->
      <div class="text-center mb-4">
        <!-- <div class="inline-block bg-amvat text-white text-xs font-bold px-3 py-1 rounded-full mb-2">AMVAT</div> -->
        <h2 class="text-amvat text-xl font-bold">Adolescent Mother Vulnerability Assessment Tool</h2>
        <p class="text-xs text-gray-400 mt-1 italic">Walang tama o maling sagot. Sumagot nang tapat at ayon sa iyong tunay na karanasan at nararamdaman.</p>
      </div>

      <!-- Progress bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div class="bg-amvat h-2 rounded-full transition-all duration-500" :style="{ width: progressPct + '%' }"></div>
      </div>
      <p class="text-xs text-center text-gray-400 mb-6">Page {{ page }} of {{ TOTAL_PAGES }}</p>

      <!-- ═══ PAGE 1: Respondent Profile ═══ -->
      <div v-if="page === 1" class="fade-in">
        <div class="section-title mb-8">Respondent's Profile</div>

        <div class="field">
          <input v-model="p.name" type="text" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Full Name (First, Middle, Last)</label>
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
          <div :class="['field', p.civilStatus ? 'has-value' : '']">
            <select v-model="p.civilStatus" required>
              <option value="" disabled hidden></option>
              <option>Single</option>
              <option>Married</option>
              <option>Live-in/Common-Law</option>
              <option>Divorced</option>
              <option>Separated</option>
              <option>Widowed</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Civil Status</label>
          </div>
          <div :class="['field', p.hasChild ? 'has-value' : '']">
            <select v-model="p.hasChild" @change="onHasChildChange" required>
              <option value="" disabled hidden></option>
              <option value="Oo">Oo</option><option value="Hindi">Hindi</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>May anak? (Has a child?)</label>
          </div>
          <div class="field">
            <input v-model.number="p.numChildren" type="number" min="1" :disabled="p.hasChild !== 'Oo'" placeholder=" " />
            <label class="floating-label">Ilang anak? (How many children?)</label>
          </div>
          <div :class="['field', p.livingWithPartner ? 'has-value' : '']">
            <select v-model="p.livingWithPartner" required>
              <option value="" disabled hidden></option>
              <option value="Oo">Oo</option><option value="Hindi">Hindi</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Kasama ang partner?</label>
          </div>
          <!-- Religion: show text input if Others -->
          <div :class="['field', p.religion ? 'has-value' : '']">
            <select v-model="p.religion" @change="onReligionChange" required>
              <option value="" disabled hidden></option>
              <option>None</option><option>Roman Catholic</option><option>Islam</option>
              <option>Iglesia ni Cristo</option><option>Aglipay</option>
              <option>Seventh Day Adventist</option><option>Bible Baptist Church</option>
              <option>Jehovah's Witness</option><option>United Methodists Church</option>
              <option>Tribal Religion</option><option>Others</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Religion</label>
          </div>
          <div class="field">
            <input v-model="p.dateOfBirth" type="date" placeholder=" " required />
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Date of Birth</label>
          </div>
          <div class="field" v-if="p.religion === 'Others'">
            <input v-model="p.religionOther" type="text" placeholder=" "
              :class="amvatOtherErr.religion ? 'border-b-danger' : ''"
              @input="amvatOtherErr.religion = false" />
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Please specify Religion</label>
            <p v-if="amvatOtherErr.religion" class="text-danger text-xs mt-1">⚠️ Please specify Religion.</p>
          </div>
          <div :class="['field', p.education ? 'has-value' : '']">
            <select v-model="p.education" required>
              <option value="" disabled hidden></option>
              <option value="Without Formal Education">Without Formal Education</option>
              <option value="Elementary">Elementary</option>
              <option value="Elementary Graduate">Elementary Graduate</option>
              <option value="High School">High School</option>
              <option value="High School Graduate">High School Graduate</option>
              <option value="Senior High School">Senior High School</option>
              <option value="Senior High School Graduate">Senior High School Graduate</option>
              <option value="College">College</option>
              <option value="College Graduate">College Graduate</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Highest Educational Attainment</label>
          </div>
          <!-- Occupation: show text input if Others -->
          <div :class="['field', p.occupation ? 'has-value' : '']">
            <select v-model="p.occupation" @change="onOccupationChange" required>
              <option value="" disabled hidden></option>
              <option value="None">None</option>
              <option value="Officials of government">Officials of government</option>
              <option value="Professionals">Professionals</option>
              <option value="Clerks">Clerks</option>
              <option value="Service worker/shop & market worker">Service worker/shop &amp; market worker</option>
              <option value="Farmers, forestry worker & fishermen">Farmers, forestry worker &amp; fishermen</option>
              <option value="Laborers & unskilled workers">Laborers &amp; unskilled workers</option>
              <option value="Special Occupations">Special Occupations</option>
              <option value="Technicians & Assoc. Professionals">Technicians &amp; Assoc. Professionals</option>
              <option value="Craft and related trade workers">Craft and related trade workers</option>
              <option value="Plant/machine operator & assembler">Plant/machine operator &amp; assembler</option>
              <option value="Others">Others (Please specify)</option>
            </select>
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Occupation</label>
          </div>
          <div class="field" v-if="p.occupation === 'Others'">
            <input v-model="p.occupationOther" type="text" placeholder=" "
              :class="amvatOtherErr.occupation ? 'border-b-danger' : ''"
              @input="amvatOtherErr.occupation = false" />
            <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Please specify Occupation</label>
            <p v-if="amvatOtherErr.occupation" class="text-danger text-xs mt-1">⚠️ Please specify Occupation.</p>
          </div>
        </div>
      </div>

      <!-- ═══ PAGES 2–7: Part I Questions ═══ -->
      <div v-for="pg in questionPages" :key="pg.page" v-show="page === pg.page" class="fade-in">
        <h3 class="text-black font-semibold text-sm mb-3">Part I. Child and Household Perceptive Vulnerabilities</h3>
        <div class="section-title">{{ pg.domain }}</div>
        <div v-for="q in pg.questions" :key="q.id" class="question-block mb-5 border border-gray-100 rounded-xl p-4 shadow-sm">
          <p class="font-medium text-sm leading-relaxed mb-1">
            <span class="font-bold mr-1">{{ q.id }}.</span>{{ q.fil }}
          </p>
          <ul v-if="q.bullets" class="list-disc ml-10 mb-2 text-xs text-gray-600 space-y-0.5">
            <li v-for="b in q.bullets" :key="b">{{ b }}</li>
          </ul>
          <p class="text-xs text-gray-400 italic mb-3 ml-4">{{ q.eng }}</p>
          <div class="rating-group">
            <label v-for="opt in likertOpts" :key="opt.val" class="rating-option">
              <input type="radio" :name="'q' + q.id" :value="String(opt.val)" v-model="responses['q' + q.id]" />
              <span class="rating-label">
                <span class="rating-value">{{ opt.val }}</span>
                <span class="rating-text">{{ opt.label }}</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- ═══ PAGE 8: Part II ═══ -->
      <div v-if="page === 8" class="fade-in">
        <h3 class="text-black font-semibold text-base mb-2">Part II: Objective Child and Household Vulnerabilities</h3>
        <p class="text-xs text-gray-500 mb-5">Ang bahaging ito ay naglalayong matukoy ang mga karagdagang salik na maaaring makaapekto sa kalagayan ng adolescent mother.</p>

        <div class="space-y-4">

          <!-- 1. Child disability -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">child_care</span> -->
              <span class="part2-icon">1</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">May anak ka ba na may kapansanan o malubhang karamdaman?</p>
                <p class="text-xs text-gray-400 mt-0.5">Does your child have a disability or serious illness?</p>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="yn-btn" :class="{ active: p.child_disability === 'Oo' }" @click="p.child_disability = 'Oo'">Oo</div>
              <div class="yn-btn" :class="{ active: p.child_disability === 'Hindi' }" @click="p.child_disability = 'Hindi'">Hindi</div>
            </div>
          </div>

          <!-- 2. Mother disability -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">person</span> -->
              <span class="part2-icon">2</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">Ikaw ba ay may kapansanan o may iniindang malubhang karamdaman?</p>
                <p class="text-xs text-gray-400 mt-0.5">Do you have a disability or serious illness?</p>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="yn-btn" :class="{ active: p.mother_disability === 'Oo' }" @click="p.mother_disability = 'Oo'">Oo</div>
              <div class="yn-btn" :class="{ active: p.mother_disability === 'Hindi' }" @click="p.mother_disability = 'Hindi'">Hindi</div>
            </div>
          </div>

          <!-- 3. Living parents → DROPDOWN -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">family_restroom</span> -->
              <span class="part2-icon">3</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">Sitwasyon ng mga magulang</p>
                <p class="text-xs text-gray-400 mt-0.5">Ang iyong mga magulang ba ay parehong buhay ngunit hindi ka na naninirahan kasama sila, o ikaw ba ay kasalukuyang tinataguyod ng isang solo parent, o wala nang nabubuhay sa iyong parehong magulang?</p>
              </div>
            </div>
            <div class="field mt-3 mb-0">
              <select v-model="p.living_parents" required>
                <option value="" disabled hidden></option>
                <option v-for="opt in livingParentsOpts" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Pumili ng sitwasyon</label>
            </div>
          </div>

          <!-- 4. Violence -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon" style="color:#dc3545">warning</span> -->
              <span class="part2-icon">4</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">Naranasan mo na ba ang anumang uri ng pang-aabuso o karahasan?</p>
                <p class="text-xs text-gray-400 mt-0.5">Have you experienced any form of abuse or violence?</p>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="yn-btn" :class="{ active: p.violence === 'Oo' }" @click="p.violence = 'Oo'">Oo</div>
              <div class="yn-btn" :class="{ active: p.violence === 'Hindi' }" @click="p.violence = 'Hindi'">Hindi</div>
            </div>
          </div>

          <!-- 5. Age at first birth → DROPDOWN -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">cake</span> -->
              <span class="part2-icon">5</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">Ilang taong gulang ka noong ikaw ay naging ina?</p>
                <p class="text-xs text-gray-400 mt-0.5">How old were you when you became a mother?</p>
              </div>
            </div>
            <div class="field mt-3 mb-0">
              <select v-model="p.age" required>
                <option value="" disabled hidden></option>
                <option v-for="opt in ageOpts" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Pumili ng edad</label>
            </div>
          </div>

          <!-- 6. Income source -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">payments</span> -->
              <span class="part2-icon">6</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">May pinagkukunan ka ba ng kita sa kasalukuyan?</p>
                <p class="text-xs text-gray-400 mt-0.5">Do you currently have a source of income?</p>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="yn-btn" :class="{ active: p.income_source === 'Oo' }" @click="p.income_source = 'Oo'">Oo</div>
              <div class="yn-btn" :class="{ active: p.income_source === 'Hindi' }" @click="p.income_source = 'Hindi'">Hindi</div>
            </div>
          </div>

          <!-- 7. Education/skills -->
          <div class="part2-card">
            <div class="part2-label">
              <!-- <span class="material-icons-round part2-icon">school</span> -->
              <span class="part2-icon">7</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">Natapos mo na ba ang iyong pag-aaral?</p>
                <p class="text-xs text-gray-400 mt-0.5">Have you completed your education / skills training?</p>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="yn-btn" :class="{ active: p.education_skills === 'Oo' }" @click="p.education_skills = 'Oo'">Oo</div>
              <div class="yn-btn" :class="{ active: p.education_skills === 'Hindi' }" @click="p.education_skills = 'Hindi'">Hindi</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Alert -->
      <transition name="fade">
        <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 my-4 text-sm flex items-start gap-2">
          <span class="material-icons-round text-warning" style="font-size:18px;margin-top:1px">warning</span>
          {{ alertMsg }}
        </div>
      </transition>

      <!-- Navigation -->
      <div class="flex justify-between mt-6">
        <button class="btn-secondary" @click="prevPage">Back</button>
        <button v-if="page < TOTAL_PAGES" class="btn-amvat" @click="nextPage">Next</button>
        <button v-else class="btn-success" :disabled="submitting" @click="validateAndConfirm">
          Submit Assessment
        </button>
      </div>
    </template>

  </div>

  <!-- ══════════ AMVAT SUBMIT CONFIRMATION MODAL ══════════ -->
  <teleport to="body">
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-box" style="max-width:420px;">
        <div class="modal-header">
          <h2 class="text-base font-bold text-white">Confirm AMVAT Submission</h2>
          <button @click="showConfirm = false"
            class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">&times;</button>
        </div>
        <div class="p-6 text-center">
          <div class="mb-4"><span class="material-icons-round text-amvat" style="font-size:52px">assessment</span></div>
          <h3 class="font-bold text-gray-800 text-lg mb-2">Submit AMVAT Assessment?</h3>
          <p class="text-sm text-gray-500 mb-1">Respondent: <strong>{{ p.name }}</strong></p>
          <p class="text-sm text-gray-500 mb-4">Region: <strong>{{ p.region }}</strong> — {{ p.municipality_city }}, {{ p.barangay }}</p>
          <div class="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700 mb-5 text-left">
            ℹ️ The assessment data and scores will be saved to the AMVAT database. This action cannot be undone.
          </div>
          <div class="flex gap-3">
            <button class="btn-secondary flex-1" @click="showConfirm = false">Wait, Go Back</button>
            <button class="btn-amvat flex-1" :disabled="submitting" @click="handleSubmit">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              Yes, Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'
import { useAmvatScoring } from '@/composables/useAmvatScoring'
import { LIKERT_OPTS, QUESTION_PAGES } from '@/composables/useAmvatQuestions'
import LocationDropdowns from '@/components/LocationDropdowns.vue'

const store    = useFormStore()
const api      = useApi()
const scoring  = useAmvatScoring()

const TOTAL_PAGES   = 8
const showConfirm   = ref(false)
const page          = ref(0)   // Start at 0 = Patnubay intro page
const alertMsg      = ref('')
const submitting    = ref(false)
const likertOpts    = LIKERT_OPTS
const questionPages = QUESTION_PAGES

const progressPct = computed(() => page.value === 0 ? 0 : Math.round((page.value / TOTAL_PAGES) * 100))

// Profile reactive — spread store first, then only default the Others fields if not already set
const p = reactive({
  religionOther:   '',   // default
  occupationOther: '',   // default
  ...store.amvatProfile, // spread last so prefilled values WIN over the defaults above
})

const responses = reactive({ ...store.amvatResponses })

// Track Others validation errors on profile page
const amvatOtherErr = reactive({ religion: false, occupation: false })

function onHasChildChange()  { if (p.hasChild === 'Hindi') p.numChildren = '' }
function onReligionChange()  { if (p.religion !== 'Others') p.religionOther = ''; amvatOtherErr.religion = false }
function onOccupationChange(){ if (p.occupation !== 'Others') p.occupationOther = ''; amvatOtherErr.occupation = false }

const livingParentsOpts = [
  { value: 'Both parents alive and living with them',                label: 'Both parents alive and living with them',               pts: 0  },
  { value: 'Living with one parent, other parent actively involved', label: 'Living with one parent, other parent actively involved', pts: 0  },
  { value: 'Both parents alive but not living with them',            label: 'Both parents alive but not living with them',            pts: -2 },
  { value: 'Solo parent or living with guardian only',               label: 'Solo parent or living with guardian only',               pts: -4 },
  { value: 'Both parents are deceased',                              label: 'Both parents are deceased',                             pts: -6 },
]

const ageOpts = [
  { value: '9-12 yrs old',  label: '9–12 taong gulang',  pts: '−5 pts'    },
  { value: '13-14 yrs old', label: '13–14 taong gulang', pts: '−3.75 pts' },
  { value: '15-17 yrs old', label: '15–17 taong gulang', pts: '−2.5 pts'  },
  { value: '18-19 yrs old', label: '18–19 taong gulang', pts: '−1.25 pts' },
]

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

function validateAndConfirm() {
  if (!validateCurrentPage()) return
  showConfirm.value = true
}

function validateCurrentPage() {
  alertMsg.value = ''

  if (page.value === 1) {
    // Validate Others specify fields first
    amvatOtherErr.religion   = p.religion === 'Others' && !p.religionOther?.trim()
    amvatOtherErr.occupation = p.occupation === 'Others' && !p.occupationOther?.trim()
    if (amvatOtherErr.religion || amvatOtherErr.occupation) {
      alertMsg.value = 'Please fill in all "Others — Please specify" fields.'
      return false
    }

    const required = ['name','region','province','municipality_city','barangay','contact',
                      'civilStatus','hasChild','livingWithPartner','religion','dateOfBirth','education','occupation']
    const missing = required.filter(k => !p[k]?.toString().trim())
    if (missing.length) { alertMsg.value = 'Please complete all required profile fields.'; return false }
  }

  if (page.value >= 2 && page.value <= 7) {
    const pg = questionPages.find(q => q.page === page.value)
    if (pg) {
      const unanswered = pg.questions.filter(q => !responses['q' + q.id])
      if (unanswered.length) { alertMsg.value = `Please answer all ${unanswered.length} question(s) on this page.`; return false }
    }
  }

  if (page.value === 8) {
    const required = ['child_disability','mother_disability','living_parents','violence','age','income_source','education_skills']
    const missing = required.filter(k => !p[k])
    if (missing.length) { alertMsg.value = 'Please complete all required fields in Part II.'; return false }
  }

  return true
}

function nextPage() {
  if (!validateCurrentPage()) return
  // Resolve Others before saving to store
  const toSave = { ...p }
  if (p.religion === 'Others' && p.religionOther?.trim()) toSave.religion = p.religionOther.trim()
  if (p.occupation === 'Others' && p.occupationOther?.trim()) toSave.occupation = p.occupationOther.trim()
  store.patchAmvatProfile(toSave)
  Object.entries(responses).forEach(([k, v]) => store.setAmvatResponse(k, v))
  page.value++
  scrollTop()
}

function prevPage() {
  alertMsg.value = ''
  if (page.value === 1) { page.value = 0; return }
  if (page.value === 0) { store.setSection('profiling'); store.setProfilingStep(5); return }
  page.value--
  scrollTop()
}

async function handleSubmit() {
  submitting.value = true
  const toSave = { ...p }
  if (p.religion === 'Others' && p.religionOther?.trim()) toSave.religion = p.religionOther.trim()
  if (p.occupation === 'Others' && p.occupationOther?.trim()) toSave.occupation = p.occupationOther.trim()
  store.patchAmvatProfile(toSave)
  Object.entries(responses).forEach(([k, v]) => store.setAmvatResponse(k, v))
  const scores = scoring.calculate(store.amvatResponses, store.amvatProfile)
  store.setAmvatScores(scores)
  try {
    const res = await api.submitAMVAT({ profile: store.amvatProfile, responses: store.amvatResponses, scores })
    if (!res.success) throw new Error(res.error || 'Submission failed')
    store.setSection('results')
  } catch (e) {
    alertMsg.value = 'Error: ' + e.message
  } finally {
    submitting.value = false
    showConfirm.value = false
  }
}
</script>

<style scoped>
.part2-card  { @apply bg-white border border-gray-200 rounded-2xl p-4 shadow-sm; }
.part2-label { @apply flex items-start gap-3; }
.part2-icon  { font-size: 22px !important; color: #7c3aed; margin-top: 2px; flex-shrink: 0; }
.deduction-badge     { @apply shrink-0 text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-1 rounded-lg; }
.deduction-high      { @apply bg-red-100 text-red-600; }
.yn-btn {
  @apply flex-1 text-center py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold
         cursor-pointer transition-all hover:border-primary;
}
.yn-btn.active { border-color:#7c3aed; background:#7c3aed; @apply text-white; }
.yn-opt {
  @apply flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-gray-200
         text-sm cursor-pointer transition-all hover:border-primary;
}
.yn-opt.active { @apply border-primary bg-primary/10; }
</style>