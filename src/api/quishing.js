import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

const exportScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}
const searchScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search`, payload)
}
const deleteScenario = (id) => {
  return testRequest.delete(`phishing-simulator/phishing-scenario/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getQuishingScenarioLandingPageAndEmailTemplate = (resourceId = '') => {
  return testRequest.get(`/phishing-simulator/phishing-scenario/preview/${resourceId}`)
}

const searchQuishingEmailTemplates = (payload) => {
  return testRequest.post(`phishing-simulator/email-templates/search`, payload)
}
const exportQuishingEmailTemplates = (payload) => {
  return testRequest.post(`phishing-simulator/email-templates/search/export`, payload, {
    responseType: 'blob'
  })
}
const deleteEmailTemplate = (id) => {
  return testRequest.delete(`phishing-simulator/email-templates/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const exportLandingPageTemplates = (payload) => {
  return testRequest.post(`phishing-simulator/landing-page-template/search/export`, payload, {
    responseType: 'blob'
  })
}

const searchLandingPageList = (payload) => {
  return testRequest.post(`phishing-simulator/landing-page-template/search`, payload)
}

export default {
  exportScenarios,
  searchScenarios,
  exportQuishingEmailTemplates,
  searchQuishingEmailTemplates,
  deleteScenario,
  deleteEmailTemplate,
  exportLandingPageTemplates,
  getQuishingScenarioLandingPageAndEmailTemplate,
  searchLandingPageList
}
