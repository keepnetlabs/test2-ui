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
  return testRequest.post('/callback-simulator/settings/map-numbers', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const exchangeCallbackNumbers = (oldProviderNumberId, newProviderNumberId) => {
  return testRequest.post(
    `/callback-simulator/settings/exchange-number/${oldProviderNumberId}/${newProviderNumberId}`,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const getAvailableCallbackNumbers = () => {
  return testRequest.get(`/callback-simulator/settings/available-numbers`)
}

const deselectPhoneNumber = (resourceId) => {
  return testRequest.delete(`/callback-simulator/settings/number-delete/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const getCampaignManagerFormDetails = () => {
  return testRequest.get('/callback-simulator/campaign/form-details')
}

const createCallbackCampaign = (payload) => {
  return testRequest.post(`/callback-simulator/campaign`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const deleteCallbackCampaign = (resourceId) => {
  return testRequest.delete(`/callback-simulator/campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const getCallbackCampaign = (resourceId) => {
  return testRequest.get(`/callback-simulator/campaign/${resourceId}`)
}

const searchCallbackCampaigns = (payload) => {
  return testRequest.post('/callback-simulator/campaign/search', payload)
}

const exportCallbackCampaigns = (payload) => {
  return testRequest.post(`/callback-simulator/campaign/search/export`, payload, {
    responseType: 'blob'
  })
}

const getCallbackCampaignPreview = (resourceId) => {
  return testRequest.get(`/callback-simulator/campaign/preview/${resourceId}`)
}

const getDefaultCompanySmtpSetting = () => {
  return testRequest.get('/callback-simulator/campaign/root-company-shared-smtp-resource-id')
}

const bulkDeleteCallbackCampaign = (payload) => {
  return testRequest.delete(`/callback-simulator/campaign/bulk-delete`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const calculateSendingInfo = (payload) => {
  return testRequest.post(`/callback-simulator/campaign/calculate-sending-info`, payload)
}

const calculateScheduleInfo = (payload) => {
  return testRequest.post(`/callback-simulator/campaign/calculate-schedule-info`, payload)
}

const getEmailDeliverySettings = () => {
  return testRequest.get(`/callback-simulator/campaign/email-delivery-settings`)
}

const getCallbackCampaignJobFormDetails = () => {
  return testRequest.get('/callback-simulator/campaign-job/form-details')
}

const launchCallbackCampaignJob = (payload) => {
  return testRequest.post(`/callback-simulator/campaign-job/start`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const startCallbackCampaignJob = (resourceId, instanceGroup) => {
  return testRequest.post(
    `/phishing-simulator/campaign-job/start/${resourceId}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const stopCallbackCampaignJob = (resourceId, instanceGroup) => {
  return testRequest.patch(`/callback-simulator/campaign-job/stop/${resourceId}/${instanceGroup}`)
}

const deleteCallbackJob = (resourceId, instanceGroup) => {
  return testRequest.delete(`/callback-simulator/campaign-job/${resourceId}/${instanceGroup}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const searchCallbackJobs = (resourceId, payload) => {
  return testRequest.post(`/callback-simulator/campaign-job/search/${resourceId}`, payload)
}

const exportCallbackJobs = (resourceId, payload) => {
  return testRequest.post(`/callback-simulator/campaign-job/export/${resourceId}`, payload, {
    responseType: 'blob'
  })
}

const resendCampaignToUsersList = (resourceId, instanceGroup, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job/resend/${resourceId}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const resendCampaignToUsers = (resourceId, instanceGroup, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job/resend/users/${resourceId}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const getTargetGroupsForCurrentCompany = (payload) => {
  return testRequest.post(`/target-groups/search/current-company`, payload)
}

const getCampaignSummary = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/callback-simulator/campaign-job-report/summary/${resourceId}/${instanceGroup}`
  )
}

const getCampaignSummaryTargetGroups = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/callback-simulator/campaign-job-report/summary/target-groups/${resourceId}/${instanceGroup}`
  )
}

const exportCampaignReport = (resourceId, instanceGroup) => {
  return testRequest.get(
    `/callback-simulator/campaign-job-report/export/${resourceId}/${instanceGroup}`,
    {
      responseType: 'blob'
    }
  )
}

const getCampaignTabUsers = (searchType, resourceId, instanceGroup, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job-report/${searchType}/search/${resourceId}/${instanceGroup}`,
    payload
  )
}

const exportCampaignTabUsers = (searchType, resourceId, instanceGroup, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job-report/${searchType}/search/export/${resourceId}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const getEmailOpenedUserDetails = (resourceId, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job-report/search-email-opened/${resourceId}`,
    payload
  )
}

const getReportedUserDetails = (resourceId, payload) => {
  return testRequest.post(
    `/callback-simulator/campaign-job-report/search-email-reported/${resourceId}`,
    payload
  )
}

const getUserEmailActivity = (resourceId) => {
  return testRequest.get(
    `/callback-simulator/campaign-job-report/search-email-activity/${resourceId}`
  )
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
  deselectPhoneNumber,
  getAvailableCallbackNumbers,
  getCampaignManagerFormDetails,
  createCallbackCampaign,
  deleteCallbackCampaign,
  getCallbackCampaign,
  searchCallbackCampaigns,
  exportCallbackCampaigns,
  getCallbackCampaignPreview,
  getDefaultCompanySmtpSetting,
  bulkDeleteCallbackCampaign,
  calculateSendingInfo,
  calculateScheduleInfo,
  getEmailDeliverySettings,
  getCallbackCampaignJobFormDetails,
  launchCallbackCampaignJob,
  startCallbackCampaignJob,
  stopCallbackCampaignJob,
  deleteCallbackJob,
  searchCallbackJobs,
  exportCallbackJobs,
  resendCampaignToUsersList,
  resendCampaignToUsers,
  getTargetGroupsForCurrentCompany,
  getCampaignSummary,
  getCampaignSummaryTargetGroups,
  exportCampaignReport,
  getCampaignTabUsers,
  exportCampaignTabUsers,
  getEmailOpenedUserDetails,
  getReportedUserDetails,
  getUserEmailActivity
}
