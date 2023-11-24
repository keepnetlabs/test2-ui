import testRequest from '@/utils/testRequest'
import vishingRequest from '@/utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

const searchCallbackTemplates = (payload) => {
  return vishingRequest.post('/callback-simulator/callback-template/search', payload)
}

const exportCallbackTemplates = (payload = {}) => {
  return vishingRequest.post(`/callback-simulator/callback-template/search/export`, payload, {
    responseType: 'blob'
  })
}

const getCallbackTemplate = (resourceId) => {
  return vishingRequest.get(`/callback-simulator/callback-template/${resourceId}`)
}

const updateCallbackTemplate = (resourceId, payload) => {
  return vishingRequest.put(`/callback-simulator/callback-template/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const deleteCallbackTemplate = (resourceId) => {
  return vishingRequest.delete(`/callback-simulator/callback-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const getCallbackTemplateLanguages = () => {
  return vishingRequest.get(`/callback-simulator/callback-template/language`)
}

const getCallbackTemplatePreview = (resourceId = '') => {
  return vishingRequest.get(`/callback-simulator/callback-template/preview/${resourceId}`)
}

const createCallbackTemplate = (payload = {}) => {
  return vishingRequest.post(`/callback-simulator/callback-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getVoiceUrl = (payload = {}) => {
  return vishingRequest.post('/callback-simulator/callback-template/get-voice-url', payload)
}

const searchEmailTemplates = (payload) => {
  return testRequest.post('/callback-simulator/email-template/search', payload)
}

const exportEmailTemplates = (payload = {}) => {
  return testRequest.post(`/callback-simulator/email-template/search/export`, payload, {
    responseType: 'blob'
  })
}

const getEmailTemplate = (resourceId) => {
  return testRequest.get(`/callback-simulator/email-template/${resourceId}`)
}

const getMergeTags = () => {
  return testRequest.get(`/callback-simulator/email-template/merge-tags`)
}

const updateEmailTemplate = (resourceId, payload) => {
  return testRequest.put(`/callback-simulator/email-template/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const deleteEmailTemplate = (resourceId) => {
  return testRequest.delete(`/callback-simulator/email-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const createEmailTemplate = (payload = {}) => {
  return testRequest.post(`/callback-simulator/email-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const searchCallbackScenarios = (payload) => {
  return testRequest.post('/callback-simulator/scenario/search', payload)
}

const exportCallbackScenarios = (payload = {}) => {
  return testRequest.post(`/callback-simulator/scenario/export`, payload, {
    responseType: 'blob'
  })
}

const getCallbackScenario = (resourceId) => {
  return testRequest.get(`/callback-simulator/scenario/${resourceId}`)
}

const getCallbackScenarioPreview = (resourceId = '') => {
  return testRequest.get(`/callback-simulator/scenario/preview/${resourceId}`)
}

const updateCallbackScenario = (resourceId, payload) => {
  return testRequest.put(`/callback-simulator/scenario/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const deleteCallbackScenario = (resourceId) => {
  return testRequest.delete(`/callback-simulator/scenario/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const createCallbackScenario = (payload = {}) => {
  return testRequest.post(`/callback-simulator/scenario`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getUsedCallbackNumbers = () => {
  return testRequest.get(`/callback-simulator/settings/usage`)
}

const exportCallbackSettings = (payload = {}) => {
  return testRequest.post(`/callback-simulator/settings/search/export`, payload, {
    responseType: 'blob'
  })
}

const searchCallbackSettings = (payload) => {
  return testRequest.post('/callback-simulator/settings/search', payload)
}

const mapCallbackNumbers = (payload) => {
  return testRequest.post('/callback-simulator/settings/map-numbers', payload)
}

const exchangeCallbackNumbers = (oldProviderNumberId, newProviderNumberId) => {
  return testRequest.post(
    `/callback-simulator/settings/exchange-number/${oldProviderNumberId}/${newProviderNumberId}`,
    payload
  )
}

const getAvailableCallbackNumbers = () => {
  return testRequest.get(`/callback-simulator/settings/available-numbers`)
}

const getCallbackCampaignManagerFormDetails = () => {
  return testRequest.get('/callback-simulator/campaign/form-details')
}

export default {
  searchCallbackTemplates,
  exportCallbackTemplates,
  getCallbackTemplate,
  updateCallbackTemplate,
  deleteCallbackTemplate,
  getCallbackTemplateLanguages,
  getCallbackTemplatePreview,
  createCallbackTemplate,
  getVoiceUrl,
  searchEmailTemplates,
  exportEmailTemplates,
  getEmailTemplate,
  getMergeTags,
  updateEmailTemplate,
  deleteEmailTemplate,
  createEmailTemplate,
  searchCallbackScenarios,
  exportCallbackScenarios,
  getCallbackScenario,
  getCallbackScenarioPreview,
  updateCallbackScenario,
  deleteCallbackScenario,
  createCallbackScenario,
  getUsedCallbackNumbers,
  exportCallbackSettings,
  searchCallbackSettings,
  mapCallbackNumbers,
  exchangeCallbackNumbers,
  getAvailableCallbackNumbers,
  getCallbackCampaignManagerFormDetails
}
