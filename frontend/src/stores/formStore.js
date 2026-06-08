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
      // Parse date parts directly to avoid UTC timezone offset (PH = UTC+8)
      const parts = d.birth_date.split('-')
      if (parts.length === 3) {
        const byear  = parseInt(parts[0])
        const bmonth = parseInt(parts[1]) - 1 // 0-indexed
        const bday   = parseInt(parts[2])
        const today  = new Date()
        age = today.getFullYear() - byear
        if (today.getMonth() < bmonth || (today.getMonth() === bmonth && today.getDate() < bday)) age--
      }
    }

    if (d.fourPs === 'Yes')                             reasons.push('Must NOT be a 4Ps member')
    if (d.has_child === 'No')                           reasons.push('Must have at least one child')
    if (parseInt(d.number_children || '0') < 1)        reasons.push('Must have 1 or more children')
    if (!age || age <= 0 || age > 19)                  reasons.push(`Age must be 19 years old or below (currently ${age > 0 ? age : 'unknown'})`)
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

    // Map profiling occupation values to AMVAT occupation values
    const occupationMap = {
      'None': 'None',
      'Special Occupations': 'Special Occupations',
      'Professionals': 'Professionals',
      'Technicians & Assoc. Professionals': 'Technicians & Assoc. Professionals',
      'Clerks': 'Clerks',
      'Service worker/shop & market worker': 'Service worker/shop & market worker',
      'Farmers, forestry worker & fishermen': 'Farmers, forestry worker & fishermen',
      'Craft and related trade workers': 'Craft and related trade workers',
      'Plant/machine operator & assembler': 'Plant/machine operator & assembler',
      'Laborers & unskilled workers': 'Laborers & unskilled workers',
    }
    // If profiling occupation starts with "Other" or has custom text, map to Others
    const mappedOccupation = occupationMap[d.occupation] ||
      (d.occupation?.startsWith('Other') ? 'Others' : (d.occupation || ''))

    // Map education values  
    const eduMap = {
      'Without Formal Education': 'Without Formal Education',
      'Elementary': 'Elementary',
      'Elementary Graduate': 'Elementary Graduate',
      'High School': 'High School',
      'High School Graduate': 'High School Graduate',
      'Senior High School': 'Senior High School',
      'Senior High School Graduate': 'Senior High School Graduate',
      'Vocational Course': 'Senior High School', // closest match
      'Vocational Course Graduate': 'Senior High School Graduate',
      'College': 'College',
      'College Graduate': 'College Graduate',
      'Post College Degree': 'College Graduate',
    }
    const mappedEducation = eduMap[d.education] || d.education || ''

    // Determine if occupation/religion is a custom "Other" value (not in standard list)
    const standardOccupations = ['None','Special Occupations','Professionals','Technicians & Assoc. Professionals',
      'Clerks','Service worker/shop & market worker','Farmers, forestry worker & fishermen','Officials of government',
      'Craft and related trade workers','Plant/machine operator & assembler','Laborers & unskilled workers']
    const standardReligions = ['None','Roman Catholic','Islam','Iglesia ni Cristo','Aglipay',
      'Seventh Day Adventist','Bible Baptist Church',"Jehovah's Witness",'United Methodists Church','Tribal Religion']

    const isCustomOccupation = d.occupation && !standardOccupations.includes(d.occupation)
    const isCustomReligion   = d.religion && !standardReligions.includes(d.religion)

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
      religion:        isCustomReligion ? 'Others' : (d.religion || ''),
      religionOther:   isCustomReligion ? d.religion : '',
      dateOfBirth: d.birth_date,
      education: mappedEducation,
      occupation:      isCustomOccupation ? 'Others' : (mappedOccupation || ''),
      occupationOther: isCustomOccupation ? d.occupation : '',
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
    // Determine if occupation/religion is a custom "Other" value (not in standard list)
    const standardOccupations = ['None','Special Occupations','Professionals','Technicians & Assoc. Professionals',
      'Clerks','Service worker/shop & market worker','Farmers, forestry worker & fishermen','Officials of government',
      'Craft and related trade workers','Plant/machine operator & assembler','Laborers & unskilled workers']
    const standardReligions = ['None','Roman Catholic','Islam','Iglesia ni Cristo','Aglipay',
      'Seventh Day Adventist','Bible Baptist Church',"Jehovah's Witness",'United Methodists Church','Tribal Religion']

    const isCustomOccupation = d.occupation && !standardOccupations.includes(d.occupation)
    const isCustomReligion   = d.religion && !standardReligions.includes(d.religion)

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
