<template>
  <div class="max-w-3xl mx-auto">

    <!-- ── Header ── -->
    <div class="mb-5">
      <!-- Top brand bar -->
      <div class="rounded-2xl px-6 py-4 mb-3 flex items-center justify-between shadow-card" style="background:#7c3aed;">
        <div>
          <h1 class="text-white text-xl font-black tracking-tight">PROTECTEEN TOOL</h1>
          <p class="text-white/70 text-xs mt-0.5">Profiling &amp; Adolescent Mother Vulnerability Assessment Tool</p>
        </div>
        <div class="flex gap-2">
          <button @click="activeTab = 'form'"
            :class="activeTab === 'form' ? 'bg-white text-primary' : 'bg-white/20 text-white'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-white hover:text-primary">
            <span class="material-icons-round" style="font-size:16px;vertical-align:-3px;margin-right:4px">edit_note</span>Data Entry
          </button>
          <button @click="activeTab = 'dashboard'"
            :class="activeTab === 'dashboard' ? 'bg-white text-primary' : 'bg-white/20 text-white'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-white hover:text-primary">
            <span class="material-icons-round" style="font-size:16px;vertical-align:-3px;margin-right:4px">bar_chart</span>Dashboard
          </button>
        </div>
      </div>

      <!-- Section progress (only on form tab) -->
      <div v-if="activeTab === 'form'" class="flex items-center bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
        <div class="flex items-center flex-1 gap-1">
          <div class="flex items-center gap-1.5"
               :class="store.section === 'profiling' ? 'opacity-100' : store.section !== 'profiling' && store.section !== 'amvat' ? 'opacity-40' : 'opacity-60'">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                 :class="store.section !== 'profiling' ? 'text-white bg-success' : 'bg-primary text-white'">
              {{ store.section !== 'profiling' ? '✓' : '1' }}
            </div>
            <span class="text-xs font-semibold" :class="store.section === 'profiling' ? 'text-primary' : 'text-gray-400'">Profiling</span>
          </div>
          <div class="flex-1 h-0.5 mx-2 rounded" :class="store.section !== 'profiling' ? 'bg-success' : 'bg-gray-200'"></div>
          <div class="flex items-center gap-1.5"
               :class="store.section === 'amvat' ? 'opacity-100' : store.section === 'results' ? 'opacity-60' : 'opacity-40'">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                 :class="store.section === 'results' ? 'text-white bg-success' : store.section === 'amvat' ? 'bg-amvat text-white' : 'bg-gray-200 text-gray-400'">
              {{ store.section === 'results' ? '✓' : '2' }}
            </div>
            <span class="text-xs font-semibold" :class="store.section === 'amvat' ? 'text-amvat' : 'text-gray-400'">AMVAT</span>
          </div>
          <div class="flex-1 h-0.5 mx-2 rounded" :class="store.section === 'results' ? 'bg-success' : 'bg-gray-200'"></div>
          <div class="flex items-center gap-1.5" :class="store.section === 'results' ? 'opacity-100' : 'opacity-40'">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                 :class="store.section === 'results' ? 'text-white bg-success' : 'bg-gray-200 text-gray-400'">
              {{ store.section === 'results' ? '✓' : '3' }}
            </div>
            <span class="text-xs font-semibold" :class="store.section === 'results' ? 'text-success' : 'text-gray-400'">Results</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── FORM TAB ── -->
    <template v-if="activeTab === 'form'">
      <template v-if="store.section === 'profiling'">
        <ProfilingStep1   v-if="store.profilingStep === 1" />
        <EligibilityCheck v-else-if="store.profilingStep === 6" />
        <ProfilingStep2   v-else-if="store.profilingStep === 2" />
        <ProfilingStep3   v-else-if="store.profilingStep === 3" />
        <ProfilingStep4   v-else-if="store.profilingStep === 4" />
        <ProfilingStep5   v-else-if="store.profilingStep === 5" />
      </template>
      <AmvatForm   v-else-if="store.section === 'amvat'" />
      <ResultsView v-else-if="store.section === 'results'" />
    </template>

    <!-- ── DASHBOARD TAB ── -->
    <DashboardView v-else-if="activeTab === 'dashboard'" />

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
import { ref, onMounted } from 'vue'
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
import DashboardView    from '@/components/DashboardView.vue'

const store     = useFormStore()
const api       = useApi()
const activeTab = ref('form')

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
