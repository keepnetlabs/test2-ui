import testRequest from '@/utils/testRequest'

export function getAllowListList(payload) {
  return testRequest.post(`/allow-list/search`, payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function createAllowListList(payload) {
  return testRequest.post(`/allow-list`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function createTxtRecord() {
  return testRequest.post(`/allow-list/txt-record`, {
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}

export function getAllowListListVerify(resourceId) {
  return testRequest.post(`/allow-list/verify/${resourceId}`, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function deleteAllowListItems(resourceIds) {
  return testRequest.delete('/allow-list', {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    },
    data: {
      resourceIds
    }
  })
}

export function exportAllowList(payload) {
  return testRequest.post(`/allow-list/search/export`, payload, {
    responseType: 'blob',
    'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
    'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
  })
}
