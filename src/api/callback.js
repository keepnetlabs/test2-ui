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
  updateEmailTemplate,
  deleteEmailTemplate,
  getCallbackCampaignManagerFormDetails
}
