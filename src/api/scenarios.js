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

export function getScenarioPreviewContent(id) {
  return testRequest.get(`phishing-simulator/phishing-scenario/preview/${id}`, {
    loading: true
  })
}

export function getScenarioDataDetails() {
  return testRequest.get(`phishing-simulator/phishing-scenario/form-details`, {
    loading: true
  })
}

export function deleteScenario(id) {
  return testRequest.delete(`phishing-simulator/phishing-scenario/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
export function getSummaryOfScenario(templateId, landingPageId) {
  return testRequest.get(
    `phishing-simulator/phishing-scenario/preview/${templateId}/${landingPageId}`,
    {
      loading: true
    }
  )
}
