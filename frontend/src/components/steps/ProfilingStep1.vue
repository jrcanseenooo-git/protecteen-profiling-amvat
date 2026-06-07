<template>
  <div class="card fade-in">
    <h2 class="text-center mb-1">ProtecTEEN Profiling</h2>
    <h3 class="text-center text-gray-500 mb-6 text-sm">RESPONDENT'S PROFILE</h3>

    <!-- Program Participation -->
    <div class="section-title">🎯 Program Participation</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
      <div class="field">
        <select v-model="f.fourPs" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Pantawid (4Ps) Member?</label>
      </div>
      <div class="field">
        <select v-model="f.slp" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>SLP Beneficiary?</label>
      </div>
      <div class="field">
        <select v-model="f.ip_membership" required>
          <option value="" disabled hidden></option>
          <option value="None">None</option>
          <option value="Aeta">Aeta</option>
          <option value="Igorot">Igorot</option>
          <option value="Lumad">Lumad</option>
          <option value="Mangyan">Mangyan</option>
          <option value="Moro">Moro</option>
          <option value="Others">Others</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>IP Membership</label>
      </div>
      <div v-if="f.ip_membership === 'Others'" class="field sm:col-span-3">
        <input v-model="f.ip_membership_other" type="text" placeholder=" " />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Specify IP Group</label>
      </div>
      <div class="field">
        <input v-model="f.household_number" type="number" placeholder=" " />
        <label class="floating-label">Household Number</label>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="section-title">👤 Personal Information</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
      <div class="field">
        <input v-model="f.first_name" type="text" placeholder=" " required />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>First Name</label>
      </div>
      <div class="field">
        <input v-model="f.middle_name" type="text" placeholder=" " />
        <label class="floating-label">Middle Name</label>
      </div>
      <div class="field">
        <input v-model="f.last_name" type="text" placeholder=" " required />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Last Name</label>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div class="field">
        <input v-model="f.birth_date" type="date" placeholder=" " required />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Date of Birth</label>
      </div>
      <div class="field">
        <select v-model="f.sex" required>
          <option value="" disabled hidden></option>
          <option>Female</option><option>Male</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Sex</label>
      </div>
      <div class="field">
        <select v-model="f.civil_status" required>
          <option value="" disabled hidden></option>
          <option>Single</option>
          <option>Married</option>
          <option>Live-in/Common-Law</option>
          <option>Separated</option>
          <option>Widowed</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Civil Status</label>
      </div>
      <div class="field">
        <select v-model="f.religion" required>
          <option value="" disabled hidden></option>
          <option>None</option>
          <option>Roman Catholic</option>
          <option>Islam</option>
          <option>Iglesia ni Cristo</option>
          <option>Aglipay</option>
          <option>Seventh Day Adventist</option>
          <option>Bible Baptist Church</option>
          <option>Jehovah's Witness</option>
          <option>United Methodists Church</option>
          <option>Tribal Religion</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Religion</label>
      </div>
      <div v-if="f.religion === 'Other'" class="field sm:col-span-2">
        <input v-model="f.religion_other" type="text" placeholder=" " />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Specify Religion</label>
      </div>
      <div class="field">
        <input v-model="f.contact" type="tel" placeholder=" " required />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Contact Number</label>
      </div>
    </div>

    <!-- Location -->
    <div class="section-title">📍 Address</div>
    <LocationDropdowns
      :modelRegion="f.region" :modelProvince="f.province"
      :modelMunicipality="f.municipality_city" :modelBarangay="f.barangay"
      @update:modelRegion="f.region = $event"
      @update:modelProvince="f.province = $event"
      @update:modelMunicipality="f.municipality_city = $event"
      @update:modelBarangay="f.barangay = $event"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div class="field">
        <input v-model="f.street_address" type="text" placeholder=" " />
        <label class="floating-label">Street Address</label>
      </div>
      <div class="field">
        <input v-model="f.sitio_purok" type="text" placeholder=" " />
        <label class="floating-label">Sitio / Purok</label>
      </div>
    </div>

    <!-- Socio-demographic -->
    <div class="section-title">📊 Socio-Demographic</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div class="field">
        <select v-model="f.family_head" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Family Head?</label>
      </div>
      <div class="field">
        <select v-model="f.has_child" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Has a child?</label>
      </div>
      <div class="field">
        <input v-model="f.number_children" type="number" min="0" placeholder=" "
               :disabled="f.has_child === 'No'" required />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Number of Children</label>
      </div>
      <div class="field">
        <select v-model="f.with_partner" required>
          <option value="" disabled hidden></option>
          <option>Yes</option><option>No</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Living with Partner?</label>
      </div>
      <div class="field">
        <select v-model="f.education" required>
          <option value="" disabled hidden></option>
          <option>No Grade Completed</option>
          <option>Elementary Level</option>
          <option>Elementary Graduate</option>
          <option>High School Level</option>
          <option>High School Graduate</option>
          <option>Junior High School Level</option>
          <option>Junior High School Graduate</option>
          <option>Senior High School Level</option>
          <option>Senior High School Graduate</option>
          <option>College Level</option>
          <option>College Graduate</option>
          <option>Vocational/Technical</option>
          <option>Post Graduate</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Highest Education</label>
      </div>
      <div class="field">
        <select v-model="f.occupation" required>
          <option value="" disabled hidden></option>
          <option>Farmer</option><option>Fisher</option>
          <option>Laborer/Unskilled Worker</option>
          <option>Vendor/Trader</option>
          <option>Skilled Worker / Craftsman</option>
          <option>Housewife</option>
          <option>Student</option>
          <option>Unemployed</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Occupation</label>
      </div>
      <div v-if="f.occupation === 'Other'" class="field sm:col-span-2">
        <input v-model="f.occupation_other" type="text" placeholder=" " />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Specify Occupation</label>
      </div>
      <div class="field">
        <select v-model="f.occupation_class" required>
          <option value="" disabled hidden></option>
          <option>Private Wage Worker</option>
          <option>Government Worker</option>
          <option>Self-employed</option>
          <option>Unpaid Family Worker</option>
          <option>Not Applicable</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Class of Worker</label>
      </div>
      <div class="field">
        <select v-model="f.disability_special" required>
          <option value="" disabled hidden></option>
          <option>None</option>
          <option>Visual Impairment</option>
          <option>Hearing Impairment</option>
          <option>Physical Disability</option>
          <option>Intellectual Disability</option>
          <option>Psychosocial Disability</option>
          <option>Learning Disability</option>
          <option>Speech/Language Impairment</option>
          <option>Multiple Disability</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Disability / Special Needs</label>
      </div>
      <div class="field">
        <select v-model="f.critical_illness" required>
          <option value="" disabled hidden></option>
          <option>None</option>
          <option>Cancer</option>
          <option>Heart Disease</option>
          <option>Diabetes</option>
          <option>Tuberculosis</option>
          <option>HIV/AIDS</option>
          <option>Kidney Disease</option>
          <option>Stroke</option>
          <option>Mental Illness</option>
          <option>Other</option>
        </select>
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Critical Illness</label>
      </div>
      <div v-if="f.critical_illness === 'Other'" class="field sm:col-span-2">
        <input v-model="f.critical_illness_other" type="text" placeholder=" " />
        <label class="floating-label"><span class="text-red-500 mr-0.5">*</span>Specify Illness</label>
      </div>
    </div>

    <!-- Alert -->
    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800
                                  rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <!-- Next button -->
    <div class="flex justify-end mt-6">
      <button class="btn-primary" @click="handleNext">
        Next: Eligibility Check →
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useFormStore } from '@/stores/formStore'
import LocationDropdowns from '@/components/LocationDropdowns.vue'

const store    = useFormStore()
const alertMsg = ref('')
const f        = reactive({ ...store.profilingData })

const REQUIRED = [
  'fourPs','slp','ip_membership','first_name','last_name',
  'region','province','municipality_city','barangay',
  'contact','civil_status','religion','family_head',
  'has_child','number_children','with_partner','birth_date',
  'sex','education','occupation','occupation_class',
  'disability_special','critical_illness',
]

function handleNext() {
  alertMsg.value = ''

  // Resolve "Other" fields
  if (f.ip_membership === 'Others' && f.ip_membership_other?.trim())
    f.ip_membership = f.ip_membership_other.trim()
  if (f.religion === 'Other' && f.religion_other?.trim())
    f.religion = f.religion_other.trim()
  if (f.occupation === 'Other' && f.occupation_other?.trim())
    f.occupation = f.occupation_other.trim()
  if (f.critical_illness === 'Other' && f.critical_illness_other?.trim())
    f.critical_illness = f.critical_illness_other.trim()

  // Validate required
  const missing = REQUIRED.filter(k => !f[k]?.toString().trim())
  if (missing.length) {
    alertMsg.value = 'Please complete all required fields before proceeding.'
    return
  }

  store.patchProfiling({ ...f })
  store.setProfilingStep(6) // go to eligibility check
}
</script>
