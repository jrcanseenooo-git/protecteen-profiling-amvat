<template>
  <div class="card fade-in">
    <div class="breadcrumb">
      <span class="breadcrumb-item done">✓ Profile</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Housing</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Health</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item done">✓ Social</span><span class="breadcrumb-sep">→</span>
      <span class="breadcrumb-item active">👨‍👩‍👧 Family</span>
    </div>
    <h3 class="font-semibold text-gray-700 mb-4">👨‍👩‍👧 FAMILY MEMBERS</h3>

    <button class="btn-primary mb-4 w-full sm:w-auto" @click="openModal">
      ➕ Add Family Member
    </button>

    <!-- Members table -->
    <div v-if="members.length" class="overflow-x-auto rounded-xl border border-gray-200 mb-6">
      <table class="w-full text-sm">
        <thead class="bg-primary text-white">
          <tr>
            <th class="py-3 px-4 text-left">#</th>
            <th class="py-3 px-4 text-left">Name</th>
            <th class="py-3 px-4 text-left">Birthday</th>
            <th class="py-3 px-4 text-left">Relationship</th>
            <th class="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in members" :key="i"
              class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4 text-gray-500">{{ i + 1 }}</td>
            <td class="py-3 px-4 font-medium">{{ m.first_name }} {{ m.last_name }}</td>
            <td class="py-3 px-4 text-gray-600">{{ m.birth_month }} {{ m.birth_day }}, {{ m.birth_year }}</td>
            <td class="py-3 px-4 text-gray-600">{{ m.relationship }}</td>
            <td class="py-3 px-4 text-center">
              <button @click="removeMember(i)"
                class="text-danger text-xs hover:underline font-medium">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="bg-gray-50 rounded-xl p-6 text-center text-gray-400 text-sm mb-6">
      No family members added yet. Click "Add Family Member" to begin.
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <!-- Save & Proceed -->
    <div class="flex justify-between mt-2">
      <button class="btn-secondary" @click="store.setProfilingStep(4)">← Back</button>
      <button class="btn-amvat" :disabled="saving" @click="handleSaveAndProceed">
        <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        💾 Save &amp; Proceed to AMVAT →
      </button>
    </div>

    <!-- ── MEMBER MODAL ── -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <h2 class="text-lg font-semibold text-white">Family Member Profile</h2>
            <p class="text-xs text-white/80 mt-0.5">Step {{ modalPart }} of 2</p>
          </div>
          <button @click="closeModal" class="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div class="p-6">
          <!-- Part 1: Basic Info -->
          <div v-show="modalPart === 1">
            <div class="section-title text-sm">Personal Information</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <div class="field"><input v-model="m.first_name" type="text" placeholder=" " /><label class="floating-label">First Name</label></div>
              <div class="field"><input v-model="m.middle_name" type="text" placeholder=" " /><label class="floating-label">Middle Name</label></div>
              <div class="field"><input v-model="m.last_name" type="text" placeholder=" " /><label class="floating-label">Last Name</label></div>
              <div class="field"><input v-model="m.ext_name" type="text" placeholder=" " /><label class="floating-label">Ext Name (Jr./Sr.)</label></div>
            </div>
            <div class="grid grid-cols-3 gap-x-4">
              <div class="field">
                <select v-model="m.birth_month">
                  <option value="" disabled hidden></option>
                  <option v-for="mo in months" :key="mo" :value="mo">{{ mo }}</option>
                </select>
                <label class="floating-label">Month</label>
              </div>
              <div class="field">
                <input v-model="m.birth_day" type="number" min="1" max="31" placeholder=" " />
                <label class="floating-label">Day</label>
              </div>
              <div class="field">
                <input v-model="m.birth_year" type="number" min="1900" max="2030" placeholder=" " />
                <label class="floating-label">Year</label>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div class="field">
                <select v-model="m.sex">
                  <option value="" disabled hidden></option>
                  <option>Female</option><option>Male</option>
                </select>
                <label class="floating-label">Sex</label>
              </div>
              <div class="field">
                <select v-model="m.relationship">
                  <option value="" disabled hidden></option>
                  <option>Spouse/Partner</option><option>Child</option><option>Parent</option>
                  <option>Sibling</option><option>Grandparent</option><option>In-law</option>
                  <option>Other Relative</option><option>Non-relative</option>
                </select>
                <label class="floating-label">Relationship to Head</label>
              </div>
              <div class="field">
                <select v-model="m.civil_status">
                  <option value="" disabled hidden></option>
                  <option>Single</option><option>Married</option><option>Live-in</option>
                  <option>Separated</option><option>Widowed</option>
                </select>
                <label class="floating-label">Civil Status</label>
              </div>
              <div class="field">
                <select v-model="m.pregnant_status">
                  <option value="" disabled hidden></option>
                  <option>Not applicable</option><option>Pregnant</option><option>Not pregnant</option>
                </select>
                <label class="floating-label">Pregnant Status</label>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button class="btn-primary" @click="modalPart = 2">Next →</button>
            </div>
          </div>

          <!-- Part 2: Education / Employment -->
          <div v-show="modalPart === 2">
            <div class="section-title text-sm">Education &amp; Employment</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div class="field">
                <select v-model="m.attending_school">
                  <option value="" disabled hidden></option>
                  <option>Yes</option><option>No</option><option>Not applicable</option>
                </select>
                <label class="floating-label">Attending school?</label>
              </div>
              <div class="field">
                <select v-model="m.education">
                  <option value="" disabled hidden></option>
                  <option>No Grade Completed</option><option>Elementary Level</option>
                  <option>Elementary Graduate</option><option>High School Level</option>
                  <option>High School Graduate</option><option>College Level</option>
                  <option>College Graduate</option><option>Vocational</option>
                </select>
                <label class="floating-label">Highest Education</label>
              </div>
              <div class="field">
                <select v-model="m.employed">
                  <option value="" disabled hidden></option>
                  <option>Yes</option><option>No</option>
                </select>
                <label class="floating-label">Currently employed?</label>
              </div>
              <div class="field">
                <select v-model="m.ofw">
                  <option value="" disabled hidden></option>
                  <option>Yes</option><option>No</option>
                </select>
                <label class="floating-label">OFW?</label>
              </div>
              <div class="field">
                <input v-model="m.occupation" type="text" placeholder=" " />
                <label class="floating-label">Occupation</label>
              </div>
              <div class="field">
                <select v-model="m.solo_parent">
                  <option value="" disabled hidden></option>
                  <option>Yes</option><option>No</option>
                </select>
                <label class="floating-label">Solo parent?</label>
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <button class="btn-secondary" @click="modalPart = 1">← Back</button>
              <button class="btn-success" @click="saveMember">✓ Save Member</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'

const store   = useFormStore()
const api     = useApi()
const saving  = ref(false)
const alertMsg= ref('')
const showModal = ref(false)
const modalPart = ref(1)

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const members = ref([...(store.profilingData.family_members || [])])

const blankMember = () => ({
  first_name:'', middle_name:'', last_name:'', ext_name:'',
  birth_month:'', birth_day:'', birth_year:'',
  sex:'', pregnant_status:'', relationship:'', civil_status:'',
  marriage_planning:'', religion:'', indigenous:'No', ip_group:'',
  disability:[], critical_illness:[],
  attending_school:'', education:'', employed:'', ofw:'',
  occupation:'', class_worker:'', nature_employment:'',
  basis_payment:'', unemployment_status:'', solo_parent:'',
})

const m = reactive(blankMember())

function openModal() { Object.assign(m, blankMember()); modalPart.value = 1; showModal.value = true }
function closeModal() { showModal.value = false }
function removeMember(i) { members.value.splice(i, 1) }

function saveMember() {
  members.value.push({ ...m })
  closeModal()
}

async function handleSaveAndProceed() {
  alertMsg.value = ''
  saving.value = true

  store.patchProfiling({ family_members: members.value })

  try {
    const res = await api.submitProfiling(store.profilingData)
    if (!res.success) throw new Error(res.error || 'Submission failed')

    // Pre-fill AMVAT profile from profiling data
    store.prefillAmvatFromProfiling()

    // Switch to AMVAT
    store.setSection('amvat')
  } catch (e) {
    alertMsg.value = '❌ ' + e.message
  } finally {
    saving.value = false
  }
}
</script>
