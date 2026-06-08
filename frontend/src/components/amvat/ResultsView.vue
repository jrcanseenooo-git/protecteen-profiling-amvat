<template>
  <div class="fade-in">

    <!-- Success header -->
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
        <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="text-success text-xl font-bold mb-1">Assessment Submitted!</h2>
      <p class="text-sm text-gray-500">{{ store.amvatProfile.name }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ store.amvatProfile.municipality_city }}, {{ store.amvatProfile.province }} - Region {{ store.amvatProfile.region }}</p>
    </div>

    <!-- Overall Score Card -->
    <div class="rounded-2xl p-6 mb-5 text-center relative overflow-hidden"
         :style="{ background: overallBg }">
      <div class="absolute inset-0 opacity-10"
           style="background: repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%) 0/10px 10px"></div>
      <p class="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">FINAL TOTAL SCORE</p>
      <p class="text-6xl font-black mb-2" :style="{ color: overallColor }">
        {{ scores.total?.score ?? '–' }}
      </p>
      <div class="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-3"
           :style="{ backgroundColor: overallColor }">
        {{ overallLabel }}
      </div>
      <p class="text-xs opacity-70">{{ scores.total?.interpretation }}</p>
      <div class="flex justify-center gap-6 mt-4 pt-4 border-t border-white/30 text-xs">
        <div>
          <p class="opacity-60">Part I Subtotal</p>
          <p class="font-bold text-lg">{{ scores.subtotal }}</p>
        </div>
        <div>
          <p class="opacity-60">Part II Subtotal</p>
          <p class="font-bold text-lg text-red-300">{{ scores.totalDeduction }}</p>
        </div>
      </div>
    </div>

    <!-- Deduction Breakdown -->
    <div v-if="hasDeductions" class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5">
      <h4 class="font-bold text-orange-600 text-sm mb-3 flex items-center gap-2">
        <span class="material-icons-round" style="font-size:18px;vertical-align:-4px;margin-right:6px;color:#ea8c00">trending_down</span>Part II: Breakdown
      </h4>
      <div class="space-y-1.5">
        <div v-for="(label, key) in deductionLabels" :key="key">
          <div v-if="scores.deductions?.[key] !== 0" class="flex justify-between items-center text-sm">
            <span class="text-gray-600">{{ label }}</span>
            <span class="font-bold text-danger">{{ scores.deductions?.[key] }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm pt-2 border-t border-orange-200 font-bold">
          <span class="text-gray-700">Total</span>
          <span class="text-danger text-base">{{ scores.totalDeduction }}</span>
        </div>
      </div>
    </div>
    <div v-else class="bg-green-50 border border-green-200 rounded-2xl p-3 mb-5 text-sm text-green-700 flex items-center gap-2">
      ✅ No deductions applied
    </div>

    <!-- Domain Scores -->
    <h4 class="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide"><span class="material-icons-round" style="font-size:18px;vertical-align:-4px;margin-right:6px">bar_chart</span>Domain Scores</h4>
    <div class="space-y-3 mb-6">
      <div v-for="d in domainList" :key="d.key"
           class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 pr-4">
            <p class="font-semibold text-sm text-gray-800">{{ d.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">
              {{ scores[d.key]?.interpretation }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-2xl font-black" :style="{ color: d.color }">
              {{ scores[d.key]?.score ?? scores[d.key] }}
            </span>
            <!-- <p class="text-xs text-gray-400">/ {{ d.max }}</p> -->
          </div>
        </div>
        <!-- Score bar -->
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700"
               :style="{ width: barWidth(d.key, d.max) + '%', backgroundColor: d.color }">
          </div>
        </div>
        <!-- Level badge -->
        <div class="mt-2">
          <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :style="{ backgroundColor: d.color + '20', color: d.color }">
            {{ getLevel(d.key) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
      <button class="btn-primary flex-1 py-3" @click="store.resetAll()">
        <span class="material-icons-round mi-btn">person_add</span>New Respondent
      </button>
      <!-- <button class="btn-secondary flex-1 py-3" onclick="window.print()">
        <span class="material-icons-round mi-btn">print</span>Print Results
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store  = useFormStore()
const scores = computed(() => store.amvatScores || {})

const total = computed(() => scores.value.total?.score ?? 0)

const overallBg = computed(() => {
  if (total.value >= 68) return '#e8f5e9'
  if (total.value >= 34) return '#fff8e1'
  return '#ffebee'
})
const overallColor = computed(() => {
  if (total.value >= 68) return '#2e7d32'
  if (total.value >= 34) return '#e65100'
  return '#c62828'
})
const overallLabel = computed(() => {
  if (total.value >= 68) return '✅ HIGH'
  if (total.value >= 34) return '⚠️ MODERATE'
  return '🔴 LOW'
})

const hasDeductions = computed(() =>
  scores.value.totalDeduction && scores.value.totalDeduction < 0
)

const deductionLabels = {
  childDisability:  'Child with disability/illness',
  motherDisability: 'Mother with disability/illness',
  livingParents:    'Living parents situation',
  violence:         'Abuse/violence experienced',
  age:              'Age at first birth',
  incomeSource:     'No income source',
  educationSkills:  'Education/skills incomplete',
}

const domainList = [
  { key: 'empowerment',  label: 'Individual Empowerment',            color: '#7c3aed', max: 16 },
  { key: 'pregnancy',    label: 'Reduced Repeated Pregnancies',      color: '#a78bfa', max: 16 },
  { key: 'health',       label: 'Health',                            color: '#7c3aed', max: 16 },
  { key: 'education',    label: 'Education and Livelihood',          color: '#2e7d32', max: 16 },
  { key: 'support',      label: 'Family and Community Support',      color: '#f57c00', max: 16 },
  { key: 'mentalhealth', label: 'Mental Health',                     color: '#7b1fa2', max: 20 },
]

function barWidth(key, max) {
  const s = scores.value[key]
  const score = typeof s === 'object' ? s?.score : s
  return Math.min(100, Math.round(((score ?? 0) / max) * 100))
}

function getLevel(key) {
  const s = scores.value[key]
  const score = typeof s === 'object' ? s?.score : (s ?? 0)
  const max = domainList.find(d => d.key === key)?.max ?? 16
  const pct = score / max
  if (pct >= 0.75) return 'High'
  if (pct >= 0.5)  return 'Moderate'
  return 'Low'
}
</script>

<style scoped>
@media print {
  .btn-primary, .btn-secondary { display: none; }
}
</style>
