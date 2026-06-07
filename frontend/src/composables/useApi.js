// src/composables/useApi.js
// All communication with the Google Apps Script Web App backend

const GAS_URL = import.meta.env.VITE_GAS_URL

if (!GAS_URL) {
  console.warn('[API] VITE_GAS_URL is not set. Create a .env file with your GAS Web App URL.')
}

async function get(action, params = {}) {
  const url = new URL(GAS_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function post(action, data = {}) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' }, // GAS requires text/plain for doPost
    body: JSON.stringify({ action, data })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useApi() {
  /** Fetch cascading location DB */
  const getLocationDB = () => get('getLocationDB')

  /** Submit qualified profiling respondent */
  const submitProfiling = (formData) => post('submitProfiling', formData)

  /** Submit not-qualified respondent */
  const submitNotQualified = (formData) => post('submitNotQualified', formData)

  /** Submit AMVAT assessment */
  const submitAMVAT = (data) => post('submitAMVAT', data)

  /** Live search by name across all region sheets */
  const searchProfiling = (searchTerm) =>
    post('searchProfiling', searchTerm)

  return { getLocationDB, submitProfiling, submitNotQualified, submitAMVAT, searchProfiling }
}
