import threatIntelligence from '@/utils/threatIntelligenceRequest'

export function getThreatIntelligenceList(payload) {
  return threatIntelligence.post(`/leak/search`, payload, {
    loading: false,
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function exportThreatIntelligence(payload) {
  return threatIntelligence.post(`/leak/search/export`, payload, {
    responseType: 'blob',
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}
