// src/stores/formStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFormStore = defineStore('form', () => {

  // ── Current section: 'profiling' | 'amvat' | 'results'
  const section = ref('profiling')

  // ── Profiling step (1–5, plus 6=eligibility check)
  const profilingStep = ref(1)

  // ── Raw profiling data collected across all steps
  const profilingData = ref({
    // Step 1
    fourPs: '', slp: '', ip_membership: '', household_number: '',
    first_name: '', middle_name: '', last_name: '',
    region: '', province: '', municipality_city: '', barangay: '',
    street_address: '', sitio_purok: '', contact: '',
    civil_status: '', religion: '', family_head: '',
    has_child: '', number_children: '', with_partner: '',
    birth_date: '', sex: '', education: '',
    occupation: '', occupation_class: '',
    disability_special: '', critical_illness: '',
    // Step 2
    house_type: '', roof_material: '', outer_wall: '',
    tenure_status: '', toilet_facility: '', water_supply: '',
    garbage_disposal: '', electricity: '',
    // Step 3
    health_condition: '', health_services: '',
    give_birth: [], pre_post_care: [],
    died_pregnancy: '', child_died: '',
    childhood_care: '', family_planning: '',
    fam_plan_method: [], fam_plan_reason: [],
    // Step 4
    natural_disasters: [], human_hazards: [],
    forced_displacement: '', violence: [], vices: [],
    // Step 5
    family_members: [],
  })

  // ── AMVAT data
  const amvatProfile = ref({
    name: '', region: '', province: '', municipality_city: '',
    barangay: '', street_sitio: '', contact: '',
    civilStatus: '', hasChild: '', numChildren: '',
    livingWithPartner: '', religion: '', dateOfBirth: '',
    education: '', occupation: '',
    // Part II
    child_disability: '', mother_disability: '',
    living_parents: '', violence: '', age: '',
    income_source: '', education_skills: '',
  })

  const amvatResponses = ref({}) // { q1: '3', q2: '5', ... }

  const amvatScores = ref(null) // populated after scoring

  // ── Location DB
  const locationDB = ref({})

  // ── Loading / error
  const loading = ref(false)
  const error = ref('')

  // ── Computed: eligibility
  const eligibility = computed(() => {
    const d = profilingData.value
    const reasons = []

    let age = 0
    if (d.birth_date) {
      const bd = new Date(d.birth_date)
      if (!isNaN(bd)) {
        const today = new Date()
        age = today.getFullYear() - bd.getFullYear()
        const m = today.getMonth() - bd.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
      }
    }

    if (d.fourPs === 'Yes')                             reasons.push('Must NOT be a 4Ps member')
    if (d.has_child === 'No')                           reasons.push('Must have at least one child')
    if (parseInt(d.number_children || '0') < 1)        reasons.push('Must have 1 or more children')
    if (!age || age > 19)                               reasons.push(`Age must be 19 or below (currently ${age || '?'})`)
    if (d.with_partner === 'Yes' && age > 0 && age <= 17) {
      reasons.push(`Living with partner at age ${age} (must be 18–19)`)
    }

    return { qualified: reasons.length === 0, reasons, age }
  })

  // ── Actions
  function setSection(s) { section.value = s }
  function setProfilingStep(n) { profilingStep.value = n }

  function patchProfiling(data) {
    Object.assign(profilingData.value, data)
  }

  function patchAmvatProfile(data) {
    Object.assign(amvatProfile.value, data)
  }

  function setAmvatResponse(q, val) {
    amvatResponses.value[q] = val
  }

  function setAmvatScores(scores) {
    amvatScores.value = scores
  }

  function setLocationDB(db) {
    locationDB.value = db
  }

  function prefillAmvatFromProfiling() {
    const d = profilingData.value
    Object.assign(amvatProfile.value, {
      name: [d.first_name, d.middle_name, d.last_name].filter(Boolean).join(' '),
      region: d.region,
      province: d.province,
      municipality_city: d.municipality_city,
      barangay: d.barangay,
      street_sitio: [d.street_address, d.sitio_purok].filter(Boolean).join(', '),
      contact: d.contact,
      civilStatus: d.civil_status,
      hasChild: d.has_child === 'Yes' ? 'Oo' : d.has_child === 'No' ? 'Hindi' : '',
      numChildren: d.number_children,
      livingWithPartner: d.with_partner === 'Yes' ? 'Oo' : d.with_partner === 'No' ? 'Hindi' : '',
      religion: d.religion,
      dateOfBirth: d.birth_date,
      education: d.education,
      occupation: d.occupation,
    })
  }

  function resetAll() {
    section.value = 'profiling'
    profilingStep.value = 1
    amvatResponses.value = {}
    amvatScores.value = null
    error.value = ''
    // Deep reset profiling
    Object.assign(profilingData.value, {
      fourPs: '', slp: '', ip_membership: '', household_number: '',
      first_name: '', middle_name: '', last_name: '',
      region: '', province: '', municipality_city: '', barangay: '',
      street_address: '', sitio_purok: '', contact: '',
      civil_status: '', religion: '', family_head: '',
      has_child: '', number_children: '', with_partner: '',
      birth_date: '', sex: '', education: '',
      occupation: '', occupation_class: '',
      disability_special: '', critical_illness: '',
      house_type: '', roof_material: '', outer_wall: '',
      tenure_status: '', toilet_facility: '', water_supply: '',
      garbage_disposal: '', electricity: '',
      health_condition: '', health_services: '',
      give_birth: [], pre_post_care: [],
      died_pregnancy: '', child_died: '',
      childhood_care: '', family_planning: '',
      fam_plan_method: [], fam_plan_reason: [],
      natural_disasters: [], human_hazards: [],
      forced_displacement: '', violence: [], vices: [],
      family_members: [],
    })
    Object.assign(amvatProfile.value, {
      name: '', region: '', province: '', municipality_city: '',
      barangay: '', street_sitio: '', contact: '',
      civilStatus: '', hasChild: '', numChildren: '',
      livingWithPartner: '', religion: '', dateOfBirth: '',
      education: '', occupation: '',
      child_disability: '', mother_disability: '',
      living_parents: '', violence: '', age: '',
      income_source: '', education_skills: '',
    })
  }

  return {
    section, profilingStep,
    profilingData, amvatProfile, amvatResponses, amvatScores,
    locationDB, loading, error, eligibility,
    setSection, setProfilingStep,
    patchProfiling, patchAmvatProfile,
    setAmvatResponse, setAmvatScores,
    setLocationDB, prefillAmvatFromProfiling, resetAll,
  }
})
