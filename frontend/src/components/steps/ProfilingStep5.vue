<template>
  <div class="card fade-in">
    <!-- Breadcrumb -->
    <StepProgress :currentStep="5" />
    <h3 class="font-bold text-gray-700 text-lg mb-5"><span class="material-icons-round" style="font-size:20px;vertical-align:-4px;margin-right:6px;color:#7c3aed">group</span>FAMILY MEMBERS</h3>

    <button class="btn-primary mb-5 flex items-center gap-2" @click="openModal">
      <span class="text-lg">➕</span> Add Family Member
    </button>

    <!-- Members table -->
    <div v-if="members.length" class="overflow-x-auto rounded-xl border border-gray-200 mb-6 shadow-sm">
      <table class="w-full text-sm">
        <thead class="bg-primary text-white">
          <tr>
            <th class="py-3 px-4 text-left font-semibold">#</th>
            <th class="py-3 px-4 text-left font-semibold">NAME</th>
            <th class="py-3 px-4 text-left font-semibold">BIRTHDAY</th>
            <th class="py-3 px-4 text-left font-semibold">RELATIONSHIP</th>
            <th class="py-3 px-4 text-center font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mb, i) in members" :key="i"
              class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4 text-gray-400 font-medium">{{ i + 1 }}</td>
            <td class="py-3 px-4 font-semibold text-gray-800">
              {{ [mb.first_name, mb.middle_name, mb.last_name].filter(Boolean).join(' ') }}
            </td>
            <td class="py-3 px-4 text-gray-600">{{ mb.birth_month }} {{ mb.birth_day }}, {{ mb.birth_year }}</td>
            <td class="py-3 px-4 text-gray-600">{{ mb.relationship || '—' }}</td>
            <td class="py-3 px-4 text-center">
              <div class="flex justify-center gap-3">
                <button @click="editMember(i)" class="text-primary text-xs font-semibold hover:underline flex items-center gap-0.5">
                  <span class="material-icons-round" style="font-size:14px">edit</span> Edit
                </button>
                <button @click="confirmRemove(i)" class="text-danger text-xs font-semibold hover:underline flex items-center gap-0.5">
                  <span class="material-icons-round" style="font-size:14px">delete</span> Remove
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm mb-6 border-2 border-dashed border-gray-200">
      <!-- <p class="text-2xl mb-2">👨‍👩‍👧</p> -->
      No family members added yet. Click "Add Family Member" to begin.
    </div>

    <transition name="fade">
      <div v-if="alertMsg" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
        ⚠️ {{ alertMsg }}
      </div>
    </transition>

    <div class="flex justify-between mt-2">
      <button class="btn-secondary" @click="store.setProfilingStep(4)">Back</button>
      <button class="btn-amvat flex items-center gap-2" :disabled="saving" @click="showConfirm = true">
        <!-- <span class="text-base">💾</span>  -->
        Save &amp; Proceed to AMVAT
      </button>
    </div>

    <!-- ══════════ FAMILY MEMBER MODAL ══════════ -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box" style="max-width:800px;">

          <!-- Modal Header -->
          <div class="modal-header">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><span class="material-icons-round text-white" style="font-size:24px">person</span></div>
              <div>
                <h2 class="text-lg font-bold text-white">{{ editIndex !== null ? "Edit Family Member" : "Family Member Profile" }}</h2>
                <p class="text-xs text-white/70 mt-0.5">Step {{ modalPart }} of 2</p>
              </div>
            </div>
            <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center hover:bg-white/30 hover:rotate-90 transition-all">&times;</button>
          </div>

          <!-- Progress bar -->
          <div class="flex items-center justify-center gap-4 bg-gray-50 border-b border-gray-200 px-8 py-4">
            <div class="flex flex-col items-center gap-1">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                   :class="modalPart === 1 ? 'bg-primary text-white shadow-lg scale-110' : 'bg-success text-white'">
                {{ modalPart > 1 ? '✓' : '1' }}
              </div>
              <span class="text-xs font-medium" :class="modalPart === 1 ? 'text-primary' : 'text-success'">Basic Info</span>
            </div>
            <div class="w-20 h-0.5 rounded" :class="modalPart > 1 ? 'bg-success' : 'bg-gray-300'"></div>
            <div class="flex flex-col items-center gap-1">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                   :class="modalPart === 2 ? 'bg-primary text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'">
                2
              </div>
              <span class="text-xs font-medium" :class="modalPart === 2 ? 'text-primary' : 'text-gray-400'">Detailed Info</span>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="overflow-y-auto" style="max-height:65vh;">
            <div class="p-6">

              <!-- ── PART 1: Basic Info ── -->
              <div v-show="modalPart === 1">
                <!-- Personal Information -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">person</span> Personal Information</div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <div class="field">
                      <input v-model="m.first_name" type="text" placeholder=" " />
                      <label class="floating-label"><span class="text-red-500">*</span> First Name</label>
                    </div>
                    <div class="field">
                      <input v-model="m.middle_name" type="text" placeholder=" " />
                      <label class="floating-label">Middle Name <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                  <div class="grid grid-cols-3 gap-x-4">
                    <div class="field col-span-2">
                      <input v-model="m.last_name" type="text" placeholder=" " />
                      <label class="floating-label"><span class="text-red-500">*</span> Last Name</label>
                    </div>
                    <div class="field">
                      <select v-model="m.ext_name">
                        <option value=""></option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                      <label class="floating-label">Ext Name <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                </div>

                <!-- Birthday -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">cake</span> Birthday</div>
                  <div class="grid grid-cols-3 gap-x-4">
                    <div class="field col-span-1" style="grid-column:span 1">
                      <select v-model="m.birth_month">
                        <option value="" disabled hidden></option>
                        <option v-for="mo in months" :key="mo" :value="mo">{{ mo }}</option>
                      </select>
                      <label class="floating-label"><span class="text-red-500">*</span> Month</label>
                    </div>
                    <div class="field">
                      <input v-model="m.birth_day" type="number" min="1" max="31" placeholder=" " />
                      <label class="floating-label"><span class="text-red-500">*</span> Day</label>
                    </div>
                    <div class="field">
                      <input v-model="m.birth_year" type="number" min="1900" max="2025" placeholder=" " />
                      <label class="floating-label"><span class="text-red-500">*</span> Year</label>
                    </div>
                  </div>
                </div>

                <!-- Sex -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">wc</span> Sex</div>
                  <div class="field" style="max-width:200px">
                    <select v-model="m.sex" @change="onSexChange">
                      <option value="" disabled hidden></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <label class="floating-label"><span class="text-red-500">*</span> Sex</label>
                  </div>
                </div>

                <transition name="fade">
                  <div v-if="part1Error" class="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-3 text-sm mt-2">
                    ⚠️ {{ part1Error }}
                  </div>
                </transition>

                <div class="flex justify-between mt-6">
                  <button class="btn-secondary" @click="closeModal">Cancel</button>
                  <button class="btn-primary" @click="goToPart2">Next →</button>
                </div>
              </div>

              <!-- ── PART 2: Detailed Info ── -->
              <div v-show="modalPart === 2">
                <!-- Family Information -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">family_restroom</span> Family Information</div>
                  <!-- Pregnant Status: only show for Female -->
                  <div v-if="!isMale" class="field">
                    <select v-model="m.pregnant_status">
                      <option value="" disabled hidden></option>
                      <option value="Skipped">Skipped</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <label class="floating-label">Pregnant Status <span class="text-gray-400 text-xs">(Optional)</span></label>
                  </div>
                  <div class="field">
                    <select v-model="m.relationship">
                      <option value="" disabled hidden></option>
                      <option value="Family Head">Family Head</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Son-in-law">Son-in-law</option>
                      <option value="Daughter-in-law">Daughter-in-law</option>
                      <option value="Grandson">Grandson</option>
                      <option value="Granddaughter">Granddaughter</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other relative">Other relative</option>
                      <option value="Non-relative">Non-relative</option>
                    </select>
                    <label class="floating-label"><span class="text-red-500">*</span> Relationship to the Respondent</label>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <div class="field">
                      <select v-model="m.civil_status">
                        <option value="" disabled hidden></option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Live-in">Live-in</option>
                        <option value="Widow/Widower">Widow/Widower</option>
                        <option value="Separated">Separated</option>
                        <option value="Annulled">Annulled</option>
                      </select>
                      <label class="floating-label"><span class="text-red-500">*</span> Civil Status</label>
                    </div>
                    <div class="field">
                      <select v-model="m.marriage_planning">
                        <option value="" disabled hidden></option>
                        <option value="Not Applicable">Not Applicable</option>
                        <option value="Planning within a year">Planning within a year</option>
                        <option value="Planning within 2-3 years">Planning within 2-3 years</option>
                        <option value="No plans">No plans</option>
                      </select>
                      <label class="floating-label">Marriage Planning <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                </div>

                <!-- Religion & Indigenous -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">auto_stories</span> Religion &amp; Indigenous Group</div>
                  <div class="field">
                    <select v-model="m.religion">
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
                      <option value="Other">Other</option>
                    </select>
                    <label class="floating-label">Religion <span class="text-gray-400 text-xs">(Optional)</span></label>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <div class="field">
                      <select v-model="m.indigenous">
                        <option value="" disabled hidden></option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      <label class="floating-label">Indigenous Group? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.ip_group">
                        <option value="" disabled hidden></option>
                        <option value="N/A">N/A</option>
                        <option value="Aeta">Aeta</option>
                        <option value="Igorot">Igorot</option>
                        <option value="Lumad">Lumad</option>
                        <option value="Mangyan">Mangyan</option>
                        <option value="Moro">Moro</option>
                        <option value="Other">Other</option>
                      </select>
                      <label class="floating-label">IP Group <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                </div>

                <!-- Health Information -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">local_hospital</span> Health Information</div>
                  <p class="text-xs text-gray-500 mb-2">Disability/Special Needs <span class="text-gray-400">(Optional — check all that apply)</span></p>
                  <div class="checkbox-grid mb-4">
                    <label v-for="opt in disabilityOpts" :key="opt" class="checkbox-item">
                      <input type="checkbox" :value="opt" v-model="m.disability" />
                      <span>{{ opt }}</span>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mb-2">Critical Illness <span class="text-gray-400">(Optional — check all that apply)</span></p>
                  <div class="checkbox-grid">
                    <label v-for="opt in criticalIllnessOpts" :key="opt" class="checkbox-item">
                      <input type="checkbox" :value="opt" v-model="m.critical_illness" />
                      <span>{{ opt }}</span>
                    </label>
                  </div>
                  <div v-if="m.critical_illness.includes('Others')" class="mt-3">
                    <input v-model="criticalIllnessOther" type="text" placeholder="Please specify critical illness..."
                      :class="['other-specify-input', otherErr.criticalIllness ? 'err' : '']"
                      @input="otherErr.criticalIllness = false" />
                    <p v-if="otherErr.criticalIllness" class="text-danger text-xs mt-1">
                      <span class="material-icons-round" style="font-size:13px;vertical-align:-2px">error</span>
                      Please specify the critical illness.
                    </p>
                  </div>
                </div>

                <!-- Education & Employment -->
                <div class="modal-section">
                  <div class="modal-section-title"><span class="material-icons-round mi-section">school</span> Education &amp; Employment</div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <div class="field">
                      <select v-model="m.attending_school">
                        <option value="" disabled hidden></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <label class="floating-label">Attending School? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.education">
                        <option value="" disabled hidden></option>
                        <option value="No Grade Completed">No Grade Completed</option>
                        <option value="Pre-school">Pre-school</option>
                        <option value="Elementary">Elementary</option>
                        <option value="High School">High School</option>
                        <option value="Senior High School">Senior High School</option>
                        <option value="College">College</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </select>
                      <label class="floating-label">Highest Education <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.employed">
                        <option value="" disabled hidden></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <label class="floating-label">Currently Employed? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.ofw">
                        <option value="" disabled hidden></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <label class="floating-label">OFW? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                  <div class="field">
                    <input v-model="m.occupation" type="text" placeholder=" " />
                    <label class="floating-label">Primary Occupation <span class="text-gray-400 text-xs">(Optional)</span></label>
                  </div>
                  <div class="field">
                    <select v-model="m.class_worker">
                      <option value="" disabled hidden></option>
                      <option value="None">None</option>
                      <option value="Government/Government Corporation">Government/Government Corporation</option>
                      <option value="Private Establishment">Private Establishment</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Employer in Own Family-Operated Farm or Business">Employer in Own Family-Operated Farm or Business</option>
                      <option value="Worked without Pay in Own Family-Operated Farm or Business">Worked without Pay in Own Family-Operated Farm or Business</option>
                    </select>
                    <label class="floating-label">Where do you work? <span class="text-gray-400 text-xs">(Optional)</span></label>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <div class="field">
                      <select v-model="m.nature_employment">
                        <option value="" disabled hidden></option>
                        <option value="Not Applicable">Not Applicable</option>
                        <option value="Permanent/Regular">Permanent/Regular</option>
                        <option value="Temporary/Casual/Contractual">Temporary/Casual/Contractual</option>
                        <option value="Self-Employed">Self-Employed</option>
                      </select>
                      <label class="floating-label">Nature of Employment <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.basis_payment">
                        <option value="" disabled hidden></option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Output/Task/Commission">Output/Task/Commission</option>
                      </select>
                      <label class="floating-label">Basis of Payment <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.unemployment_status">
                        <option value="" disabled hidden></option>
                        <option value="Yes, seeking work">Yes, seeking work</option>
                        <option value="Yes, not seeking work">Yes, not seeking work</option>
                        <option value="No">No</option>
                      </select>
                      <label class="floating-label">Unemployed (past 3 months)? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                    <div class="field">
                      <select v-model="m.solo_parent">
                        <option value="" disabled hidden></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <label class="floating-label">Solo Parent? <span class="text-gray-400 text-xs">(Optional)</span></label>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between mt-6">
                  <button class="btn-secondary" @click="modalPart = 1">Previous</button>
                  <button class="btn-success flex items-center gap-2" @click="saveMember">
                    <span class="material-icons-round" style="font-size:16px">save</span>
                    {{ editIndex !== null ? "Update Member" : "Save Member" }}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ══════════ REMOVE CONFIRMATION MODAL ══════════ -->
    <teleport to="body">
      <div v-if="showRemoveConfirm" class="modal-overlay">
        <div class="modal-box" style="max-width:380px;">
          <div class="modal-header" style="background:#dc3545">
            <h2 class="text-base font-bold text-white">Remove Family Member</h2>
            <button @click="showRemoveConfirm = false"
              class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">&times;</button>
          </div>
          <div class="p-6 text-center">
            <span class="material-icons-round text-danger" style="font-size:52px">person_remove</span>
            <h3 class="font-bold text-gray-800 text-lg mt-3 mb-2">Remove this family member?</h3>
            <p class="text-sm text-gray-500 mb-5">
              <strong>{{ memberToRemove !== null ? displayName(members[memberToRemove]) : '' }}</strong>
              will be removed from the list. This cannot be undone.
            </p>
            <div class="flex gap-3">
              <button class="btn-secondary flex-1" @click="showRemoveConfirm = false">Cancel</button>
              <button class="btn-danger flex-1" @click="doRemove">Yes, Remove</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ══════════ DUPLICATE WARNING MODAL ══════════ -->
    <teleport to="body">
      <div v-if="showDuplicateWarn" class="modal-overlay">
        <div class="modal-box" style="max-width:420px;">
          <div class="modal-header" style="background:#dc2626">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="material-icons-round">warning</span> Duplicate Detected
            </h2>
            <button @click="showDuplicateWarn = false"
              class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">&times;</button>
          </div>
          <div class="p-6 text-center">
            <span class="material-icons-round text-danger" style="font-size:52px">person_off</span>
            <h3 class="font-bold text-gray-800 text-lg mt-3 mb-2">Respondent Already Profiled</h3>
            <p class="text-sm text-gray-600 mb-4">{{ duplicateMsg }}</p>
            <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-danger text-left mb-5">
              ⚠️ Each respondent can only be profiled <strong>once</strong>. Do not create duplicate entries.
              Check with your supervisor if you believe this is an error.
            </div>
            <button class="btn-primary w-full" @click="showDuplicateWarn = false; store.resetAll()">
              OK, Start New Respondent
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ══════════ SUBMIT CONFIRMATION MODAL ══════════ -->
    <teleport to="body">
      <div v-if="showConfirm" class="modal-overlay">
        <div class="modal-box" style="max-width:420px;">
          <div class="modal-header">
            <h2 class="text-base font-bold text-white">Confirm Submission</h2>
            <button @click="showConfirm = false" class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30">&times;</button>
          </div>
          <div class="p-6 text-center">
            <div class="mb-4"><span class="material-icons-round text-primary" style="font-size:52px">assignment</span></div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">Submit Profiling &amp; Proceed to AMVAT?</h3>
            <p class="text-sm text-gray-500 mb-1">
              Respondent: <strong>{{ respondentName }}</strong>
            </p>
            <p class="text-sm text-gray-500 mb-4">
              Family Members: <strong>{{ members.length }}</strong>
            </p>
            <div class="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700 mb-5 text-left">
              ℹ️ Profiling data will be saved and the system will proceed to the Adolescent Mother Vulnerability Assessment Tool.
            </div>
            <div class="flex gap-3">
              <button class="btn-secondary flex-1" @click="showConfirm = false">Wait, Go Back</button>
              <button class="btn-amvat flex-1" :disabled="saving" @click="handleSaveAndProceed">
                <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import StepProgress from '@/components/StepProgress.vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'

const store     = useFormStore()
const api       = useApi()
const saving    = ref(false)
const alertMsg  = ref('')
const showModal = ref(false)
const showConfirm = ref(false)
const modalPart = ref(1)
const part1Error= ref('')

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const disabilityOpts = ['None','Physical','Intellectual','Learning','Mental','Psychosocial','Deaf/Hard of Hearing','Speech and Language impairment','Cancer','Rare Disease']
const criticalIllnessOpts = ['None','Cancer','Cardiac Arrest','Comatosed','Paralysis','Organ Failure','Others']

const members = ref([...(store.profilingData.family_members || [])])
const editIndex        = ref(null)   // null = new member, number = editing index
const showRemoveConfirm = ref(false)
const memberToRemove   = ref(null)
const criticalIllnessOther = ref('')
const otherErr = reactive({ criticalIllness: false })

const respondentName = computed(() =>
  [store.profilingData.first_name, store.profilingData.middle_name, store.profilingData.last_name].filter(Boolean).join(' ')
)

const blankMember = () => ({
  first_name:'', middle_name:'', last_name:'', ext_name:'',
  birth_month:'', birth_day:'', birth_year:'',
  sex:'', pregnant_status:'', relationship:'', civil_status:'',
  marriage_planning:'', religion:'', indigenous:'', ip_group:'',
  disability:[], critical_illness:[],
  attending_school:'', education:'', employed:'', ofw:'',
  occupation:'', class_worker:'', nature_employment:'',
  basis_payment:'', unemployment_status:'', solo_parent:'',
})

const m = reactive(blankMember())

// Female-only fields are hidden/disabled when member is Male
const isMale = computed(() => m.sex === 'Male')

function openModal() {
  Object.assign(m, blankMember())
  modalPart.value = 1
  part1Error.value = ''
  editIndex.value = null
  showModal.value = true
}

function editMember(i) {
  Object.assign(m, blankMember(), members.value[i])
  // restore arrays
  m.disability       = [...(members.value[i].disability || [])]
  m.critical_illness = [...(members.value[i].critical_illness || [])]
  modalPart.value = 1
  part1Error.value = ''
  editIndex.value = i
  showModal.value = true
}

function confirmRemove(i) {
  memberToRemove.value = i
  showRemoveConfirm.value = true
}

function doRemove() {
  if (memberToRemove.value !== null) {
    members.value.splice(memberToRemove.value, 1)
  }
  showRemoveConfirm.value = false
  memberToRemove.value = null
}

function displayName(mb) {
  if (!mb) return ''
  return [mb.first_name, mb.middle_name, mb.last_name].filter(Boolean).join(' ')
}

function closeModal() { showModal.value = false }
function removeMember(i) { members.value.splice(i, 1) }

function onSexChange() {
  if (m.sex === 'Male') {
    m.pregnant_status = 'Skipped'
    m.marriage_planning = m.marriage_planning || ''
  }
}

function goToPart2() {
  part1Error.value = ''
  if (!m.first_name?.trim()) { part1Error.value = 'First Name is required.'; return }
  if (!m.last_name?.trim())  { part1Error.value = 'Last Name is required.'; return }
  if (!m.birth_month)        { part1Error.value = 'Birth Month is required.'; return }
  if (!m.birth_day)          { part1Error.value = 'Birth Day is required.'; return }
  if (!m.birth_year)         { part1Error.value = 'Birth Year is required.'; return }
  if (!m.sex)                { part1Error.value = 'Sex is required.'; return }
  modalPart.value = 2
}

function saveMember() {
  // Validate Others specify
  otherErr.criticalIllness = m.critical_illness.includes('Others') && !criticalIllnessOther.value?.trim()
  if (Object.values(otherErr).some(v => v)) return

  const saved = { ...m }
  if (m.critical_illness.includes('Others') && criticalIllnessOther.value?.trim()) {
    saved.critical_illness = m.critical_illness.map(v => v === 'Others' ? `Others: ${criticalIllnessOther.value.trim()}` : v)
  }

  if (editIndex.value !== null) {
    members.value.splice(editIndex.value, 1, saved)  // update existing
  } else {
    members.value.push(saved)  // add new
  }

  criticalIllnessOther.value = ''
  editIndex.value = null
  closeModal()
}

async function handleSaveAndProceed() {
  saving.value = true
  showConfirm.value = false
  alertMsg.value = ''

  store.patchProfiling({ family_members: members.value })

  try {
    const res = await api.submitProfiling(store.profilingData)
    if (!res.success) {
      if (res.duplicate) {
        // Show duplicate warning
        showDuplicateWarn.value = true
        duplicateMsg.value = res.error
      } else {
        throw new Error(res.error || 'Submission failed')
      }
      return
    }
    store.prefillAmvatFromProfiling()
    store.setSection('amvat')
  } catch (e) {
    alertMsg.value = '❌ ' + e.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Modal sections */
.modal-section { @apply mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0; }
.modal-section-title {
  @apply flex items-center gap-2 font-semibold text-primary text-sm mb-4
         bg-purple-50 rounded-lg px-3 py-2;
}
.mi-section { font-size: 18px !important; vertical-align: -4px; }
/* Checkbox grid for disability/illness */
.checkbox-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 gap-2;
}
.checkbox-item {
  @apply flex items-center gap-2 text-sm p-2 rounded-lg border border-gray-200
         cursor-pointer hover:bg-purple-50 hover:border-primary transition-all;
}
.checkbox-item input[type="checkbox"] { @apply accent-primary; }
/* Others specify input */
.other-specify-input {
  @apply w-full border-2 border-primary rounded-xl px-4 py-2.5 text-sm outline-none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.other-specify-input:focus { box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
.other-specify-input.err {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220,53,69,0.15) !important;
}
</style>
