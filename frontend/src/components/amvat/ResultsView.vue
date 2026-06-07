<template>
  <div class="card fade-in">
    <div class="text-center mb-6">
      <div class="text-5xl mb-3">✅</div>
      <h2 class="text-success mb-1">Assessment Submitted!</h2>
      <p class="text-sm text-gray-500">{{ store.amvatProfile.name }}</p>
    </div>

    <!-- Overall Score -->
    <div class="rounded-2xl p-6 mb-6 text-center"
         :class="overallColor.bg">
      <p class="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Final Total Score</p>
      <p class="text-5xl font-bold mb-2" :class="overallColor.text">
        {{ scores.total?.score ?? '–' }}
      </p>
      <p class="text-sm font-medium" :class="overallColor.text">
        {{ scores.total?.interpretation }}
      </p>
      <div class="flex justify-center gap-4 mt-4 text-xs opacity-80">
        <span>Part I Subtotal: <strong>{{ scores.subtotal }}</strong></span>
        <span>Total Deduction: <strong>{{ scores.totalDeduction }}</strong></span>
      </div>
    </div>

    <!-- Deduction breakdown -->
    <div v-if="hasDeductions" class="bg-warning-light border border-yellow-300 rounded-xl p-4 mb-6">
      <h4 class="font-semibold text-warning text-sm mb-3">📉 Deduction Breakdown</h4>
      <div class="space-y-1 text-sm text-gray-700">
        <div v-for="(label, key) in deductionLabels" :key="key">
          <span v-if="scores.deductions?.[key] !== 0" class="flex justify-between">
            <span>{{ label }}</span>
            <span class="text-danger font-semibold">{{ scores.deductions?.[key] }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Domain scores -->
    <h4 class="font-semibold text-gray-700 mb-3">📊 Domain Scores</h4>
    <div class="space-y-3 mb-8">
      <div v-for="d in domainList" :key="d.key"
           class="score-card" :style="{ borderLeftColor: d.color }">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-sm text-gray-800">{{ d.label }}</p>
            <p class="text-xs text-gray-500 mt-1 leading-snug">
              {{ scores[d.key]?.interpretation }}
            </p>
          </div>
          <div class="text-2xl font-bold ml-4 shrink-0" :style="{ color: d.color }">
            {{ scores[d.key]?.score ?? scores[d.key] }}
          </div>
        </div>

        <!-- Score bar -->
        <div class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700"
               :style="{ width: domainBarWidth(d.key, d.max) + '%', backgroundColor: d.color }">
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3">
      <button class="btn-primary flex-1" @click="handleNewRespondent">
        ➕ New Respondent
      </button>
      <button class="btn-secondary flex-1" onclick="window.print()">
        🖨️ Print Results
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store  = useFormStore()
const scores = computed(() => store.amvatScores || {})

const overallColor = computed(() => {
  const s = scores.value.total?.score ?? 0
  if (s >= 68) return { bg: 'bg-green-50 border border-green-200', text: 'text-success' }
  if (s >= 34) return { bg: 'bg-yellow-50 border border-yellow-200', text: 'text-yellow-600' }
  return        { bg: 'bg-red-50   border border-red-200',   text: 'text-danger' }
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
  educationSkills:  'Incomplete education/skills',
}

const domainList = [
  { key: 'empowerment',  label: '💪 Individual Empowerment',           color: '#3f51b5', max: 16 },
  { key: 'pregnancy',    label: '🤰 Reduced Repeated Pregnancies',     color: '#667eea', max: 16 },
  { key: 'health',       label: '🏥 Health',                           color: '#764ba2', max: 16 },
  { key: 'education',    label: '📚 Education and Livelihood',         color: '#28a745', max: 16 },
  { key: 'support',      label: '🤝 Family and Community Support',     color: '#f57c00', max: 16 },
  { key: 'mentalhealth', label: '🧠 Mental Health',                    color: '#7b1fa2', max: 20 },
]

function domainBarWidth(key, max) {
  const s = scores.value[key]
  const score = typeof s === 'object' ? s?.score : s
  return Math.min(100, Math.round(((score ?? 0) / max) * 100))
}

function handleNewRespondent() {
  store.resetAll()
}
</script>

<style scoped>
@media print {
  .btn-primary, .btn-secondary { display: none; }
}
</style>
