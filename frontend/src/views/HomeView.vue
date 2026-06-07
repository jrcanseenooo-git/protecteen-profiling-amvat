<template>
  <div class="max-w-3xl mx-auto">

    <!-- ── Header ── -->
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-primary">ProtecTEEN</h1>
      <p class="text-sm text-gray-500 mt-1">Unified Profiling &amp; Assessment System</p>
      <!-- Section pill -->
      <div class="flex justify-center gap-2 mt-3">
        <span :class="store.section === 'profiling'
          ? 'bg-primary text-white'
          : 'bg-gray-200 text-gray-500'"
          class="px-4 py-1 rounded-full text-xs font-semibold transition-all">
          📋 Profiling
        </span>
        <span class="text-gray-400 text-xs self-center">→</span>
        <span :class="store.section === 'amvat'
          ? 'bg-amvat text-white'
          : 'bg-gray-200 text-gray-500'"
          class="px-4 py-1 rounded-full text-xs font-semibold transition-all">
          📊 AMVAT Assessment
        </span>
        <span class="text-gray-400 text-xs self-center">→</span>
        <span :class="store.section === 'results'
          ? 'bg-success text-white'
          : 'bg-gray-200 text-gray-500'"
          class="px-4 py-1 rounded-full text-xs font-semibold transition-all">
          ✅ Results
        </span>
      </div>
    </div>

    <!-- ── PROFILING SECTION ── -->
    <template v-if="store.section === 'profiling'">
      <ProfilingStep1 v-if="store.profilingStep === 1" />
      <EligibilityCheck v-else-if="store.profilingStep === 6" />
      <ProfilingStep2 v-else-if="store.profilingStep === 2" />
      <ProfilingStep3 v-else-if="store.profilingStep === 3" />
      <ProfilingStep4 v-else-if="store.profilingStep === 4" />
      <ProfilingStep5 v-else-if="store.profilingStep === 5" />
    </template>

    <!-- ── AMVAT SECTION ── -->
    <AmvatForm v-else-if="store.section === 'amvat'" />

    <!-- ── RESULTS SECTION ── -->
    <ResultsView v-else-if="store.section === 'results'" />

    <!-- ── Global Loading Overlay ── -->
    <div v-if="store.loading" class="loading-overlay">
      <div class="text-center text-white">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-sm font-medium">Saving your response...</p>
      </div>
    </div>

    <!-- ── Global Error Toast ── -->
    <transition name="slide-up">
      <div v-if="store.error"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-danger text-white
               px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium max-w-sm text-center">
        ⚠️ {{ store.error }}
        <button @click="store.error = ''" class="ml-3 underline opacity-80">Dismiss</button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { useApi } from '@/composables/useApi'

import ProfilingStep1   from '@/components/steps/ProfilingStep1.vue'
import EligibilityCheck from '@/components/steps/EligibilityCheck.vue'
import ProfilingStep2   from '@/components/steps/ProfilingStep2.vue'
import ProfilingStep3   from '@/components/steps/ProfilingStep3.vue'
import ProfilingStep4   from '@/components/steps/ProfilingStep4.vue'
import ProfilingStep5   from '@/components/steps/ProfilingStep5.vue'
import AmvatForm        from '@/components/amvat/AmvatForm.vue'
import ResultsView      from '@/components/amvat/ResultsView.vue'

const store = useFormStore()
const api   = useApi()

onMounted(async () => {
  try {
    const db = await api.getLocationDB()
    store.setLocationDB(db)
  } catch (e) {
    console.warn('Could not load LocationDB:', e)
  }
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px); }
.slide-up-leave-to   { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
