// src/composables/useApi.js
const GAS_URL = import.meta.env.VITE_GAS_URL

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
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, data })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useApi() {
  const getLocationDB    = ()           => get('getLocationDB')
  const getDashboard     = ()           => get('getDashboard')
  const submitProfiling  = (formData)   => post('submitProfiling', formData)
  const submitNotQualified=(formData)   => post('submitNotQualified', formData)
  const submitAMVAT      = (data)       => post('submitAMVAT', data)
  const searchProfiling  = (searchTerm) => post('searchProfiling', searchTerm)
  const searchAMVAT      = (q) => {
    const url = new URL(GAS_URL)
    url.searchParams.set('action', 'searchAMVAT')
    url.searchParams.set('q', q)
    return fetch(url.toString(), { redirect: 'follow' }).then(r => r.json())
  }
  return { getLocationDB, getDashboard, submitProfiling, submitNotQualified, submitAMVAT, searchProfiling, searchAMVAT }
}
