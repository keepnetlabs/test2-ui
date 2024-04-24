import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getScenariosList(payload) {
  return testRequest.post(`phishing-simulator/phishing-scenario/search`, payload)
}

export function createScenario(payload) {
  return testRequest.post(`phishing-simulator/phishing-scenario`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateScenario(payload, id) {
  return testRequest.put(`phishing-simulator/phishing-scenario/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getScenario(id) {
  return testRequest.get(`phishing-simulator/phishing-scenario/${id}`)
}

export function exportScenarios(payload) {
  return testRequest.post(`phishing-simulator/phishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getScenarioDataDetails() {
  return testRequest.get(`phishing-simulator/phishing-scenario/form-details`)
}

export function deleteScenario(id) {
  return testRequest.delete(`phishing-simulator/phishing-scenario/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
export function bulkDeleteScenarios(payload) {
  return testRequest.delete(`phishing-simulator/phishing-scenario/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}
export function getSummaryOfScenario(templateId, landingPageId) {
  return testRequest.get(
    `phishing-simulator/phishing-scenario/preview/${templateId}/${landingPageId}`
  )
}

export function minifyHTML(htmlContent = '') {
  return testRequest.post(
    'file/compress-html',
    { htmlContent },
    {
      snackbar: {
        hideError: true
      }
    }
  )
}
