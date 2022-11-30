import emailThreatSimlatorRequest from '@/utils/emailThreatSimulatorRequest'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getQuickScanList(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/search`, payload, {
    loading: false,
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function deleteQuickScanItem(resourceId) {
  return emailThreatSimlatorRequest.delete(`/quick-scan/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    },
    snackbar: COMMON_SNACKBAR
  })
}
export function getValidateContinuousScan(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/validate-continuous-scan`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getQuickScanCreate(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getQuickScanById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getQuickScanCount() {
  return emailThreatSimlatorRequest.get(`/quick-scan/continuous-scan-count`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function exportQuickScan(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/search/export`, payload, {
    responseType: 'blob',
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}
export function getAttackVectorList(payload) {
  return emailThreatSimlatorRequest.post(`/plugin/search`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function deleteAttackVectorItem(resourceId) {
  return emailThreatSimlatorRequest.delete(`/plugin/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    },
    snackbar: COMMON_SNACKBAR
  })
}
export function getAttackVectorCreate(payload) {
  return emailThreatSimlatorRequest.post(`/plugin`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getAttackVectorUpdate(payload, resourceId) {
  return emailThreatSimlatorRequest.put(`/plugin/${resourceId}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getAttackVectorById(resourceId) {
  return emailThreatSimlatorRequest.get(`/plugin/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function disableAttackVector(payload) {
  return emailThreatSimlatorRequest.put(`/plugin/passive`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    },
    snackbar: COMMON_SNACKBAR
  })
}
export function enableAttackVector(payload) {
  return emailThreatSimlatorRequest.put(`/plugin/active`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    },
    snackbar: COMMON_SNACKBAR
  })
}
export function exportAttacksVector(payload) {
  return emailThreatSimlatorRequest.post(`/plugin/search/export`, payload, {
    responseType: 'blob',
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}
export function getQuickScanReportCountById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan-report/counts-and-score/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function getQuickScanReportStatsById(resourceId) {
  return emailThreatSimlatorRequest.get(`/quick-scan-report/stats/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function getQuickScanReportList(payload, resourceId) {
  return emailThreatSimlatorRequest.post(`/quick-scan-item/${resourceId}/search`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}
export function exportQuickScanReportList(payload, resourceId) {
  return emailThreatSimlatorRequest.post(`/quick-scan-item/${resourceId}/search/export`, payload, {
    responseType: 'blob',
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}
export function getLookupNameList() {
  return testRequest.get(`/codetypes`)
}
