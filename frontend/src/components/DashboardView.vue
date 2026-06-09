<template>
  <div class="fade-in">

    <!-- ── Header ── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-primary">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">Real-time profiling &amp; AMVAT tracking</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Region Filter Dropdown -->
        <div class="relative">
          <select v-model="selectedRegion"
            class="appearance-none pl-3 pr-8 py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold bg-white outline-none cursor-pointer hover:bg-primary/5 transition-all">
            <option value="All">All Regions</option>
            <option v-for="r in REGION_KEYS" :key="r" :value="r">{{ r }}</option>
          </select>
          <span class="material-icons-round pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-primary" style="font-size:16px">expand_more</span>
        </div>
        <!-- Refresh -->
        <button @click="loadData" :disabled="loading"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-all">
          <span class="material-icons-round" :class="loading ? 'animate-spin' : ''" style="font-size:18px">refresh</span>
          Refresh
        </button>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-danger flex items-center gap-2">
      <span class="material-icons-round">error</span> {{ error }}
      <button @click="loadData" class="ml-2 underline font-semibold">Retry</button>
    </div>

    <!-- ══════════════════════════════════════
         SEARCH PANEL — Duplicate Detection
    ══════════════════════════════════════ -->
    <div class="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h3 class="font-bold text-primary mb-1 flex items-center gap-2 text-sm">
        <span class="material-icons-round" style="font-size:18px">manage_search</span>
        Search Respondent &amp; Duplicate Detection
      </h3>
      <p class="text-xs text-gray-400 mb-3">Search by name to check if a respondent is already profiled or assessed.</p>

      <div class="flex gap-2 mb-3">
        <div class="flex-1 relative">
          <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size:18px">search</span>
          <input v-model="searchQuery" @input="onSearchInput" type="text"
            placeholder="Type a name to search (min. 2 characters)..."
            class="w-full pl-9 pr-4 py-2.5 border-2 rounded-xl text-sm outline-none transition-all"
            :class="searchQuery.length >= 2 ? 'border-primary' : 'border-gray-200'" />
        </div>
        <button v-if="searchQuery" @click="clearSearch"
          class="px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-danger hover:text-danger transition-all">
          <span class="material-icons-round" style="font-size:18px">close</span>
        </button>
      </div>

      <!-- Search Results -->
      <div v-if="searching" class="text-center py-4 text-sm text-gray-400">
        <span class="material-icons-round animate-spin" style="font-size:20px">refresh</span>
        <span class="ml-2">Searching...</span>
      </div>

      <div v-else-if="searchResults.length > 0">
        <p class="text-xs text-gray-500 mb-2 font-medium">
          {{ searchResults.length }} result(s) found — check for duplicates before profiling
        </p>
        <div class="space-y-2 max-h-72 overflow-y-auto">
          <div v-for="r in searchResults" :key="r.rowIndex + r.region"
               class="flex items-start justify-between p-3 rounded-xl border transition-all"
               :class="r.amvatAssessed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                   :class="r.amvatAssessed ? 'bg-success text-white' : 'bg-warning text-white'">
                <span class="material-icons-round" style="font-size:16px">{{ r.amvatAssessed ? 'check_circle' : 'person' }}</span>
              </div>
              <div>
                <p class="font-bold text-sm text-gray-800">{{ r.fullName }}</p>
                <p class="text-xs text-gray-500">{{ r.municipality }}, {{ r.province }} · {{ r.barangay }}</p>
                <p class="text-xs text-gray-400">DOB: {{ r.birthDate || '—' }} · Contact: {{ r.contact || '—' }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0 ml-3">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {{ r.region }}
              </span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    :class="r.amvatAssessed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'">
                {{ r.amvatAssessed ? '✓ Profiled + Assessed' : '⚠ Profiled Only' }}
              </span>
              <!-- Action button -->
              <button v-if="!r.amvatAssessed"
                @click="resumeAMVAT(r)"
                class="mt-1 text-[10px] font-bold px-2 py-1 rounded-lg text-white flex items-center gap-1"
                style="background:#6d28d9">
                <span class="material-icons-round" style="font-size:12px">assignment</span>
                Start AMVAT
              </button>
              <span v-else class="mt-1 text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <span class="material-icons-round" style="font-size:12px">check_circle</span>
                Complete
              </span>
            </div>
          </div>
        </div>
        <!-- Duplicate warning -->
        <div v-if="searchResults.length >= 1" class="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-danger flex items-start gap-2">
          <span class="material-icons-round shrink-0" style="font-size:16px;margin-top:1px">warning</span>
          <span><strong>Duplicate check:</strong> If the name above matches your respondent, <strong>do not profile again.</strong> Each respondent must be profiled only once.</span>
        </div>
      </div>

      <div v-else-if="searchQuery.length >= 2 && !searching" class="text-center py-4">
        <span class="material-icons-round text-success" style="font-size:32px">check_circle</span>
        <p class="text-sm text-success font-semibold mt-1">No existing record found</p>
        <p class="text-xs text-gray-400 mt-0.5">This respondent has not been profiled yet. Safe to proceed.</p>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         SUMMARY CARDS
    ══════════════════════════════════════ -->
    <div v-if="loading && !rawData.profiling" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl p-4 shadow-card animate-pulse h-24"></div>
    </div>
    <!-- <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow-card border-t-4 text-center" style="border-color:#7c3aed">
        <p class="text-3xl font-black" style="color:#7c3aed">{{ totals.profiled }}</p>
        <p class="text-xs text-gray-500 mt-1 font-medium">Total Profiled</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-card border-t-4 text-center" style="border-color:#6d28d9">
        <p class="text-3xl font-black" style="color:#6d28d9">{{ totals.assessed }}</p>
        <p class="text-xs text-gray-500 mt-1 font-medium">Total AMVAT</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-card border-t-4 text-center" style="border-color:#d97706">
        <p class="text-3xl font-black text-warning">{{ totals.notQualified }}</p>
        <p class="text-xs text-gray-500 mt-1 font-medium">Not Qualified</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-card border-t-4 text-center" style="border-color:#059669">
        <p class="text-3xl font-black text-success">{{ totals.eligible }}</p>
        <p class="text-xs text-gray-500 mt-1 font-medium">Total Eligible</p>
      </div>
    </div> -->

    <!-- ══════════════════════════════════════
         OVERVIEW CHART (All Regions only)
    ══════════════════════════════════════ -->
    <div v-if="selectedRegion === 'All'" class="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h3 class="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
        <span class="material-icons-round step-icon">pie_chart</span>
        Overall AMVAT Score Distribution — All Regions
      </h3>
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <!-- Donut chart -->
        <div class="relative shrink-0">
          <svg viewBox="0 0 160 160" class="w-44 h-44">
            <circle cx="80" cy="80" r="60" fill="#f3f4f6"/>
            <template v-for="(slice, i) in overallPieSlices" :key="i">
              <path :d="slice.d" :fill="slice.color"/>
            </template>
            <circle cx="80" cy="80" r="38" fill="white"/>
            <text x="80" y="77" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e1b4b">{{ totals.assessed }}</text>
            <text x="80" y="93" text-anchor="middle" font-size="9" fill="#6b7280">Total AMVAT</text>
          </svg>
        </div>
        <!-- Legend -->
        <div class="flex-1 space-y-3 w-full">
          <div v-for="band in scoreBands" :key="band.key" class="flex items-center gap-3">
            <div class="w-4 h-4 rounded shrink-0" :style="{ background: band.color }"></div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-xs font-semibold text-gray-700">{{ band.label }}</span>
                <span class="text-sm font-bold" :style="{ color: band.color }">{{ overallBandCounts[band.key] }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                     :style="{ width: pct(overallBandCounts[band.key], totals.assessed) + '%', background: band.color }"></div>
              </div>
              <p class="text-[10px] text-gray-400 mt-0.5">{{ pct(overallBandCounts[band.key], totals.assessed) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Target progress bar -->
      <!-- <div class="mt-5 pt-4 border-t border-gray-100">
        <div class="flex justify-between text-xs text-gray-500 mb-1.5">
          <span class="font-semibold text-gray-700">Target: {{ target }} respondents</span>
          <span class="font-bold" style="color:#7c3aed">{{ pct(totals.profiled, target) }}% reached</span>
        </div>
        <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700"
               :style="{ width: Math.min(100, pct(totals.profiled, target)) + '%', background: '#7c3aed' }"></div>
        </div>
        <p class="text-[10px] text-gray-400 mt-1">{{ totals.profiled }} profiled of {{ target }} target</p>
      </div> -->
    </div>

    <!-- ══════════════════════════════════════
         PER-REGION CARDS
         - All Regions: 2-column grid
         - Specific Region: single full-width card
    ══════════════════════════════════════ -->
    <div :class="selectedRegion === 'All' ? 'grid grid-cols-1 sm:grid-cols-2 gap-5' : 'grid grid-cols-1 gap-5'">
      <div v-for="region in filteredRegions" :key="region.name"
           class="bg-white rounded-2xl shadow-card overflow-hidden">

        <!-- Region header -->
        <div class="px-5 py-4 text-white flex items-center justify-between"
             style="background:#7c3aed">
          <div>
            <p class="font-black text-base">{{ region.label }}</p>
            <p class="text-xs opacity-75 mt-0.5">{{ region.location }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black">{{ region.profiled }}</p>
            <p class="text-xs opacity-75">Profiled</p>
          </div>
        </div>

        <div class="p-5">
          <!-- Score band tiles -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div v-for="band in scoreBands" :key="band.key"
                 class="rounded-xl p-2.5 text-center"
                 :style="{ background: band.bg }">
              <p class="text-xl font-black" :style="{ color: band.color }">{{ region[band.key] }}</p>
              <p class="text-[10px] text-gray-500 mt-0.5 leading-tight">{{ band.shortLabel }}</p>
            </div>
          </div>

          <!-- Donut chart + legend -->
          <div class="flex items-center gap-4">
            <div class="shrink-0">
              <svg viewBox="0 0 120 120" class="w-28 h-28" v-if="region.total > 0">
                <circle cx="60" cy="60" r="48" fill="#f3f4f6"/>
                <template v-for="(sl, i) in getRegionSlices(region)" :key="i">
                  <path :d="sl.d" :fill="sl.color"/>
                </template>
                <circle cx="60" cy="60" r="30" fill="white"/>
                <text x="60" y="57" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e1b4b">{{ region.total }}</text>
                <text x="60" y="70" text-anchor="middle" font-size="7" fill="#6b7280">AMVAT</text>
              </svg>
              <div v-else class="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center">
                <span class="text-xs text-gray-400 text-center">No AMVAT<br>data</span>
              </div>
            </div>
            <div class="flex-1 space-y-1.5 text-xs">
              <div v-for="band in scoreBands" :key="band.key" class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ background: band.color }"></div>
                <span class="text-gray-500 flex-1">{{ band.label }}</span>
                <span class="font-bold" :style="{ color: band.color }">{{ region[band.key] }}</span>
                <span class="text-gray-300">({{ pct(region[band.key], region.total) }}%)</span>
              </div>
            </div>
          </div>

          <!-- Stats footer -->
          <div class="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p class="font-black text-lg" style="color:#7c3aed">{{ region.profiled }}</p>
              <p class="text-gray-400">Profiled</p>
            </div>
            <div>
              <p class="font-black text-lg" style="color:#6d28d9">{{ region.total }}</p>
              <p class="text-gray-400">AMVAT</p>
            </div>
            <div>
              <p class="font-black text-lg text-success">{{ region.eligible }}</p>
              <p class="text-gray-400">Eligible</p>
            </div>
          </div>

          <!-- Target bar -->
          <!-- <div class="mt-3">
            <div class="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Target: {{ region.target }}</span>
              <span style="color:#7c3aed">{{ pct(region.profiled, region.target) }}%</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full"
                   :style="{ width: Math.min(100, pct(region.profiled, region.target)) + '%', background: '#7c3aed' }"></div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Last updated -->
    <p class="text-center text-xs text-gray-400 mt-6">
      Last updated: {{ lastUpdated || '—' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useFormStore } from '@/stores/formStore'

const api   = useApi()
const store = useFormStore()

const emit = defineEmits(['navigate'])
const loading    = ref(true)
const error      = ref('')
const rawData    = ref({ profiling: {}, amvat: {}, notQualified: 0 })
const lastUpdated = ref('')
const selectedRegion = ref('All')

// Search state
const searchQuery   = ref('')
const searchResults = ref([])
const searching     = ref(false)
let searchTimer     = null

// Target (editable in GAS backend config — passed from getDashboard)
const target = ref(1000)

const REGION_KEYS = ['III','VI','X','NCR','IV-A']

const REGIONS = [
  { name: 'NCR',  label: 'NCR',         location: 'National Capital Region',                   target: 200 },
  { name: 'III',  label: 'Region III',  location: 'City of San Jose Del Monte, Bulacan',      target: 200 },
  { name: 'IV-A', label: 'Region IV-A', location: 'CALABARZON',                               target: 200 },
  { name: 'VI',   label: 'Region VI',   location: 'City of Iloilo, Iloilo',                   target: 200 },
  { name: 'X',    label: 'Region X',    location: 'City of Cagayan De Oro, Misamis Oriental',  target: 200 },
]

const scoreBands = [
  { key: 'low',  label: '40 & below',  shortLabel: '≤ 40',   color: '#dc2626', bg: '#fee2e2' },
  { key: 'mid',  label: '41–60',        shortLabel: '41–60',  color: '#d97706', bg: '#fef3c7' },
  { key: 'high', label: '61 & above',   shortLabel: '≥ 61',   color: '#059669', bg: '#d1fae5' },
]

const regionData = computed(() =>
  REGIONS.map(r => {
    const a = rawData.value.amvat?.[r.name] || { low: 0, mid: 0, high: 0, total: 0 }
    const regionTarget = rawData.value.targets?.[r.name] || r.target
    return {
      ...r,
      target:   regionTarget,
      profiled: rawData.value.profiling?.[r.name] || 0,
      low:      a.low,
      mid:      a.mid,
      high:     a.high,
      total:    a.total,
      eligible: a.low + a.mid,
    }
  })
)

const filteredRegions = computed(() =>
  selectedRegion.value === 'All'
    ? regionData.value
    : regionData.value.filter(r => r.name === selectedRegion.value)
)

const totals = computed(() => ({
  profiled:     Object.values(rawData.value.profiling || {}).reduce((s, v) => s + v, 0),
  assessed:     regionData.value.reduce((s, r) => s + r.total, 0),
  notQualified: rawData.value.notQualified || 0,
  eligible:     regionData.value.reduce((s, r) => s + r.eligible, 0),
}))

const overallBandCounts = computed(() => ({
  low:  regionData.value.reduce((s, r) => s + r.low, 0),
  mid:  regionData.value.reduce((s, r) => s + r.mid, 0),
  high: regionData.value.reduce((s, r) => s + r.high, 0),
}))

// Pie slice generator (cx,cy,r)
function buildSlices(data, cx, cy, r) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (!total) return []
  let angle = -Math.PI / 2
  return data.filter(d => d.value > 0).map(d => {
    const sweep = (d.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle)
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`, color: d.color }
  })
}

const overallPieSlices = computed(() => buildSlices([
  { value: overallBandCounts.value.low,  color: '#dc2626' },
  { value: overallBandCounts.value.mid,  color: '#d97706' },
  { value: overallBandCounts.value.high, color: '#059669' },
], 80, 80, 60))

function getRegionSlices(region) {
  return buildSlices([
    { value: region.low,  color: '#dc2626' },
    { value: region.mid,  color: '#d97706' },
    { value: region.high, color: '#059669' },
  ], 60, 60, 48)
}

function pct(val, total) {
  if (!total || !val) return 0
  return Math.round((val / total) * 100)
}

// ── Data loading ──
async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.getDashboard()
    if (res?.profiling) {
      rawData.value = res
      if (res.target) target.value = res.target
    } else {
      error.value = 'No data returned. Check your GAS deployment.'
    }
    lastUpdated.value = new Date().toLocaleString('en-PH')
  } catch (e) {
    error.value = 'Could not load dashboard. Check GAS connection.'
  } finally {
    loading.value = false
  }
}

// ── Search with debounce ──
function onSearchInput() {
  clearTimeout(searchTimer)
  searchResults.value = []
  if (searchQuery.value.trim().length < 2) return
  searching.value = true
  searchTimer = setTimeout(doSearch, 500)
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  searching.value = false
}

async function doSearch() {
  try {
    const res = await api.searchProfiling(searchQuery.value.trim())
    if (res?.results) {
      // Also check AMVAT assessed status
      const amvatRes = await api.searchAMVAT(searchQuery.value.trim())
      const amvatNames = new Set((amvatRes?.results || []).map(r => r.fullName?.toLowerCase().trim()))
      searchResults.value = res.results.map(r => ({
        ...r,
        amvatAssessed: amvatNames.has(r.fullName?.toLowerCase().trim())
      }))
    }
  } catch (e) {
    searchResults.value = []
  } finally {
    searching.value = false
  }
}

// ── Resume AMVAT for a profiled-only respondent ──
function resumeAMVAT(respondent) {
  // Pre-fill the AMVAT profile with data from the search result
  store.patchAmvatProfile({
    name:             respondent.fullName,
    region:           respondent.region,
    province:         respondent.province,
    municipality_city:respondent.municipality,
    barangay:         respondent.barangay,
    contact:          respondent.contact,
    dateOfBirth:      respondent.birthDate,
  })
  store.setSection('amvat')
  // Switch to Data Entry tab by emitting navigate event
  emit('navigate', 'form')
}

onMounted(loadData)
</script>
