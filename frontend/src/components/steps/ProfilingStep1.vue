<template>
  <div class="card fade-in">
    <h2 class="text-center mb-1">ProtecTEEN Profiling Tool</h2>
    <h3 class="text-center text-gray-600 mb-6 font-semibold text-base">RESPONDENT'S PROFILE</h3>

    <!-- Program Participation -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Program Participation</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
        <div class="field">
          <select v-model="f.fourPs" required>
            <option value="" disabled hidden></option>
            <option value="Yes">YES</option>
            <option value="No">NO</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Pantawid Member?</label>
        </div>
        <div class="field">
          <select v-model="f.slp" required>
            <option value="" disabled hidden></option>
            <option value="Yes">YES</option>
            <option value="No">NO</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> SLP Beneficiary?</label>
        </div>
        <div class="field">
          <!-- Household number: accepts leading zeros, stored as string -->
          <input v-model="f.household_number" type="text"
            pattern="[0-9]*" inputmode="numeric" placeholder=" "
            @input="f.household_number = f.household_number.replace(/[^0-9]/g,'')" />
          <label class="floating-label">Household Number (e.g. 00001)</label>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Personal Information</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
        <div class="field">
          <input v-model="f.first_name" type="text" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500">*</span> First Name</label>
        </div>
        <div class="field">
          <input v-model="f.middle_name" type="text" placeholder=" " />
          <label class="floating-label">Middle Name</label>
        </div>
        <div class="field">
          <input v-model="f.last_name" type="text" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500">*</span> Last Name</label>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 mt-4">
        <div class="field">
          <input v-model="f.birth_date" type="date" placeholder=" " required />
          <label class="floating-label"><span class="text-red-500">*</span> Date of Birth</label>
        </div>
        <!-- Sex is auto-set to Female since respondents are all female -->
        <div class="field">
          <input value="Female" type="text" disabled />
          <label class="floating-label" style="top:-14px;font-size:12px;color:#7c3aed;">Sex (Respondents are Female)</label>
        </div>
        <div class="field">
          <select v-model="f.ip_membership" @change="onIPChange" required>
            <option value="" disabled hidden></option>
            <option value="Non-IP">Non-IP</option>
            <option value="Aeta">Aeta</option>
            <option value="Ati">Ati</option>
            <option value="Badjao">Badjao</option>
            <option value="Bago">Bago</option>
            <option value="Batak">Batak</option>
            <option value="Bukidnon">Bukidnon</option>
            <option value="B'laan">B'laan</option>
            <option value="Cimaron">Cimaron</option>
            <option value="Cuyonen">Cuyonen</option>
            <option value="Dumagat">Dumagat</option>
            <option value="Ibaloi">Ibaloi</option>
            <option value="Ibanag">Ibanag</option>
            <option value="Itom">Itom</option>
            <option value="Kankanaey">Kankanaey</option>
            <option value="Mandaya">Mandaya</option>
            <option value="Mangyan">Mangyan</option>
            <option value="Manobo">Manobo</option>
            <option value="Palawano">Palawano</option>
            <option value="Pullon">Pullon</option>
            <option value="Subanen">Subanen</option>
            <option value="Others">Others (please specify)</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Indigenous Group</label>
        </div>
      </div>
      <div v-if="f.ip_membership === 'Others'" class="field mt-4">
        <input v-model="f.ip_other" type="text" placeholder=" "
          :class="otherErrors.ip ? 'border-b-2 border-b-danger' : ''"
          @input="otherErrors.ip = false" />
        <label class="floating-label"><span class="text-red-500">*</span> Please specify Indigenous Group</label>
        <p v-if="otherErrors.ip" class="text-danger text-xs mt-1">⚠️ Please specify the Indigenous Group.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mt-4">
        <div class="field">
          <!-- PH mobile: 11 digits starting with 09 -->
          <input v-model="f.contact" type="text" inputmode="numeric"
            maxlength="11" placeholder=" "
            @input="validateContact"
            :class="contactError ? 'border-b-danger' : ''" required />
          <label class="floating-label"><span class="text-red-500">*</span> Contact Number (09XXXXXXXXX)</label>
          <p v-if="contactError" class="text-xs text-danger mt-1">{{ contactError }}</p>
        </div>
        <div class="field">
          <select v-model="f.civil_status" required>
            <option value="" disabled hidden></option>
            <option value="Single">SINGLE</option>
            <option value="Married">MARRIED</option>
            <option value="Live-in/Common-Law">LIVE-IN/COMMON-LAW</option>
            <option value="Divorced">DIVORCED</option>
            <option value="Separated">SEPARATED</option>
            <option value="Widowed">WIDOWED</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Civil Status</label>
        </div>
      </div>
      <div class="field mt-4">
        <select v-model="f.religion" @change="onReligionChange" required>
          <option value="" disabled hidden></option>
          <option value="None">NONE</option>
          <option value="Roman Catholic">ROMAN CATHOLIC</option>
          <option value="Islam">ISLAM</option>
          <option value="Iglesia ni Cristo">IGLESIA NI CRISTO</option>
          <option value="Aglipay">AGLIPAY</option>
          <option value="Seventh Day Adventist">SEVENTH DAY ADVENTIST</option>
          <option value="Bible Baptist Church">BIBLE BAPTIST CHURCH</option>
          <option value="Jehovah's Witness">JEHOVAH'S WITNESS</option>
          <option value="United Methodists Church">UNITED METHODISTS CHURCH</option>
          <option value="Tribal Religion">TRIBAL RELIGION</option>
          <option value="Other">Others (Please specify)</option>
        </select>
        <label class="floating-label"><span class="text-red-500">*</span> Religion</label>
      </div>
      <div v-if="f.religion === 'Other'" class="field mt-4">
        <input v-model="f.religion_other" type="text" placeholder=" "
          :class="otherErrors.religion ? 'border-b-2 border-b-danger' : ''"
          @input="otherErrors.religion = false" />
        <label class="floating-label"><span class="text-red-500">*</span> Please specify Religion</label>
        <p v-if="otherErrors.religion" class="text-danger text-xs mt-1">⚠️ Please specify the Religion.</p>
      </div>
    </div>

    <!-- Address Information -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Address Information</h4>
      <LocationDropdowns
        :modelRegion="f.region" :modelProvince="f.province"
        :modelMunicipality="f.municipality_city" :modelBarangay="f.barangay"
        @update:modelRegion="f.region = $event"
        @update:modelProvince="f.province = $event"
        @update:modelMunicipality="f.municipality_city = $event"
        @update:modelBarangay="f.barangay = $event"
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mt-4">
        <div class="field">
          <input v-model="f.street_address" type="text" placeholder=" " />
          <label class="floating-label">Street Address</label>
        </div>
        <div class="field">
          <input v-model="f.sitio_purok" type="text" placeholder=" " />
          <label class="floating-label">Sitio/Purok</label>
        </div>
      </div>
    </div>

    <!-- Family Information -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Family Information</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div class="field">
          <select v-model="f.family_head" required>
            <option value="" disabled hidden></option>
            <option value="Yes">YES</option>
            <option value="No">NO</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Head of the Family?</label>
        </div>
        <div class="field">
          <select v-model="f.has_child" @change="onHasChildChange" required>
            <option value="" disabled hidden></option>
            <option value="Yes">YES</option>
            <option value="No">NO</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Has a Child?</label>
        </div>
        <div class="field mt-4">
          <!-- Number of children: min 1, no negatives, no zero -->
          <input v-model.number="f.number_children" type="number" min="1"
            placeholder=" " required
            :disabled="f.has_child === 'No'"
            @input="clampChildren" />
          <label class="floating-label"><span class="text-red-500">*</span> Number of Children (min. 1)</label>
        </div>
        <div class="field mt-4">
          <select v-model="f.with_partner" required>
            <option value="" disabled hidden></option>
            <option value="Yes">YES</option>
            <option value="No">NO</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Living with a Partner?</label>
        </div>
      </div>
    </div>

    <!-- Education & Employment -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Education &amp; Employment</h4>
      <div class="field">
        <select v-model="f.education" required>
          <option value="" disabled hidden></option>
          <option value="Without Formal Education">Without Formal Education</option>
          <option value="Elementary">Elementary</option>
          <option value="Elementary Graduate">Elementary Graduate</option>
          <option value="High School">High School</option>
          <option value="High School Graduate">High School Graduate</option>
          <option value="Senior High School">Senior High School</option>
          <option value="Senior High School Graduate">Senior High School Graduate</option>
          <option value="Vocational Course">Vocational Course</option>
          <option value="Vocational Course Graduate">Vocational Course Graduate</option>
          <option value="College">College</option>
          <option value="College Graduate">College Graduate</option>
          <option value="Post College Degree">Post College Degree</option>
        </select>
        <label class="floating-label"><span class="text-red-500">*</span> Highest Educational Attainment</label>
      </div>
      <div class="field mt-4">
        <select v-model="f.occupation" @change="onOccupationChange" required>
          <option value="" disabled hidden></option>
          <option value="None">None</option>
          <option value="Special Occupations">Special Occupations</option>
          <option value="Officials of government & special interest orgs, corp. executive, manager, managing proprietor/supervisor">Officials of government &amp; special interest orgs, corp. executive, manager, managing proprietor/supervisor</option>
          <option value="Professionals">Professionals</option>
          <option value="Technicians & Assoc. Professionals">Technicians &amp; Assoc. Professionals</option>
          <option value="Clerks">Clerks</option>
          <option value="Service worker/shop & market worker">Service worker/shop &amp; market worker</option>
          <option value="Farmers, forestry worker & fishermen">Farmers, forestry worker &amp; fishermen</option>
          <option value="Craft and related trade workers">Craft and related trade workers</option>
          <option value="Plant/machine operator & assembler">Plant/machine operator &amp; assembler</option>
          <option value="Laborers & unskilled workers">Laborers &amp; unskilled workers</option>
          <option value="Other">Others (Please specify)</option>
        </select>
        <label class="floating-label"><span class="text-red-500">*</span> Occupation</label>
      </div>
      <div v-if="f.occupation === 'Other'" class="field mt-4">
        <input v-model="f.occupation_other" type="text" placeholder=" "
          :class="otherErrors.occupation ? 'border-b-2 border-b-danger' : ''"
          @input="otherErrors.occupation = false" />
        <label class="floating-label"><span class="text-red-500">*</span> Please specify Occupation</label>
        <p v-if="otherErrors.occupation" class="text-danger text-xs mt-1">⚠️ Please specify the Occupation.</p>
      </div>
      <div class="field mt-4">
        <select v-model="f.occupation_class" required>
          <option value="" disabled hidden></option>
          <option value="Not employed but looking for work in the past 3 months">Not employed but looking for work in the past 3 months</option>
          <option value="Not employed and not looking for work in the past 3 months">Not employed and not looking for work in the past 3 months</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Private Company Employee">Private Company Employee</option>
          <option value="Government Employee">Government Employee</option>
          <option value="Pensioner">Pensioner</option>
          <option value="OFW">OFW</option>
          <option value="Student">Student</option>
        </select>
        <label class="floating-label"><span class="text-red-500">*</span> Occupation Class</label>
      </div>
    </div>

    <!-- Health Information -->
    <div class="section-card mb-6">
      <h4 class="section-card-title">Health Information</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div class="field">
          <select v-model="f.disability_special" required>
            <option value="" disabled hidden></option>
            <option value="None">None</option>
            <option value="Physical">Physical</option>
            <option value="Intellectual">Intellectual</option>
            <option value="Learning">Learning</option>
            <option value="Visual">Visual</option>
            <option value="Mental">Mental</option>
            <option value="Psychosocial">Psychosocial</option>
            <option value="Deaf/Hard of Hearing">Deaf/Hard of Hearing</option>
            <option value="Speech and Language Impairment">Speech and Language Impairment</option>
            <option value="Cancer">Cancer</option>
            <option value="Rare Disease">Rare Disease</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Disability/Special Needs</label>
        </div>
        <div class="field">
          <select v-model="f.critical_illness" @change="onCriticalIllnessChange" required>
            <option value="" disabled hidden></option>
            <option value="None">None</option>
            <option value="Cancer">Cancer</option>
            <option value="Cardiac Arrest">Cardiac Arrest</option>
            <option value="Coma">Coma</option>
            <option value="Paralysis">Paralysis</option>
            <option value="Organ Failure">Organ Failure</option>
            <option value="Other">Others (Please specify)</option>
          </select>
          <label class="floating-label"><span class="text-red-500">*</span> Critical Illness</label>
        </div>
      </div>
      <div v-if="f.critical_illness === 'Other'" class="field mt-4">
        <input v-model="f.critical_illness_other" type="text" placeholder=" "
          :class="otherErrors.illness ? 'border-b-2 border-b-danger' : ''"
          @input="otherErrors.illness = false" />
        <label class="floating-label"><span class="text-red-500">*</span> Please specify Critical Illness</label>
        <p v-if="otherErrors.illness" class="text-danger text-xs mt-1">⚠️ Please specify the Critical Illness.</p>
      </div>
    </div>

    <!-- Smart age preview -->
    <div v-if="agePreview > 0" class="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 mb-4 text-sm flex items-center gap-3">
      <span class="text-2xl">🎂</span>
      <div>
        <span class="font-semibold text-primary">Age: {{ agePreview }} years old</span>
        <span v-if="agePreview > 19" class="ml-2 text-danger text-xs font-medium">⚠️ Over 19 — may not qualify</span>
        <span v-else class="ml-2 text-success text-xs font-medium">✓ Within age range</span>
      </div>
    </div>

    <!-- Alert -->
    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <div class="flex justify-end mt-2">
      <button class="btn-primary px-8" @click="handleNext">
        NEXT <span class="ml-2">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import LocationDropdowns from '@/components/LocationDropdowns.vue'

const store    = useFormStore()
const alertMsg = ref('')
const contactError = ref('')
const otherErrors = reactive({
  ip: false,
  religion: false,
  occupation: false,
  illness: false,
})

const f = reactive({
  ...store.profilingData,
  sex: 'Female', // Always Female — respondents are all female
  ip_other: '',
  religion_other: '',
  occupation_other: '',
  critical_illness_other: '',
})

// Smart age preview
const agePreview = computed(() => {
  if (!f.birth_date) return 0
  const parts = f.birth_date.split('-')
  if (parts.length !== 3) return 0
  const byear = parseInt(parts[0]), bmonth = parseInt(parts[1]) - 1, bday = parseInt(parts[2])
  const today = new Date()
  let age = today.getFullYear() - byear
  if (today.getMonth() < bmonth || (today.getMonth() === bmonth && today.getDate() < bday)) age--
  return age > 0 ? age : 0
})

function onIPChange()              { if (f.ip_membership !== 'Others') f.ip_other = '' }
function onReligionChange()        { if (f.religion !== 'Other') f.religion_other = '' }
function onOccupationChange()      { if (f.occupation !== 'Other') f.occupation_other = '' }
function onCriticalIllnessChange() { if (f.critical_illness !== 'Other') f.critical_illness_other = '' }
function onHasChildChange()        { if (f.has_child === 'No') f.number_children = '' }
function clampChildren()           { if (f.number_children < 1 && f.number_children !== '') f.number_children = 1 }

// PH mobile number validation: 11 digits, starts with 09
function validateContact() {
  const val = f.contact.replace(/[^0-9]/g, '')
  f.contact = val
  if (!val) { contactError.value = ''; return }
  if (val.length < 11) { contactError.value = 'Must be 11 digits (e.g. 09XXXXXXXXX)'; return }
  if (val.length === 11 && !val.startsWith('09')) { contactError.value = 'Must start with 09'; return }
  contactError.value = ''
}

const REQUIRED = [
  'fourPs','slp','ip_membership','first_name','last_name',
  'region','province','municipality_city','barangay',
  'contact','civil_status','religion','family_head',
  'has_child','number_children','with_partner','birth_date',
  'education','occupation','occupation_class',
  'disability_special','critical_illness',
]

function handleNext() {
  alertMsg.value = ''

  // Validate and resolve Others — mark errors inline
  otherErrors.ip         = f.ip_membership === 'Others' && !f.ip_other?.trim()
  otherErrors.religion   = f.religion === 'Other' && !f.religion_other?.trim()
  otherErrors.occupation = f.occupation === 'Other' && !f.occupation_other?.trim()
  otherErrors.illness    = f.critical_illness === 'Other' && !f.critical_illness_other?.trim()

  if (Object.values(otherErrors).some(v => v)) {
    alertMsg.value = 'Please fill in all "Others — Please specify" fields.'
    return
  }

  const resolved = { ...f }
  if (f.ip_membership === 'Others' && f.ip_other?.trim()) resolved.ip_membership = f.ip_other.trim()
  if (f.religion === 'Other' && f.religion_other?.trim()) resolved.religion = f.religion_other.trim()
  if (f.occupation === 'Other' && f.occupation_other?.trim()) resolved.occupation = f.occupation_other.trim()
  if (f.critical_illness === 'Other' && f.critical_illness_other?.trim()) resolved.critical_illness = f.critical_illness_other.trim()

  // Required field check
  const missing = REQUIRED.filter(k => !resolved[k]?.toString().trim())
  if (missing.length) {
    alertMsg.value = 'Please complete all required fields before proceeding.'
    return
  }

  // Smart validations
  if (contactError.value) { alertMsg.value = 'Please enter a valid Philippine mobile number (09XXXXXXXXX).'; return }
  if (resolved.contact.length !== 11 || !resolved.contact.startsWith('09')) {
    alertMsg.value = 'Contact number must be 11 digits and start with 09 (e.g. 09XXXXXXXXX).'
    return
  }
  if (resolved.has_child === 'Yes' && (parseInt(resolved.number_children) < 1 || !resolved.number_children)) {
    alertMsg.value = 'Number of children must be at least 1.'
    return
  }

  // Always Female
  resolved.sex = 'Female'

  store.patchProfiling(resolved)
  store.setProfilingStep(6)
}
</script>

<style scoped>
.section-card { background:#fff; border:1px solid #e8eaf6; border-radius:12px; padding:20px 24px; box-shadow:0 2px 8px rgba(63,81,181,.06); }
.section-card-title { font-size:15px; font-weight:600; color:#7c3aed; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid #e8eaf6; }
.border-b-danger { border-bottom-color: #dc3545 !important; }
</style>
