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

const deleteLandingPageTemplate = (id) => {
  return testRequest.delete(`phishing-simulator/landing-page-template/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const getLandingPageTemplate = (id) => {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`)
}
const deleteCampaign = (id) => {
  return testRequest.delete(`phishing-simulator/campaign/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const deleteBulkCampaigns = (payload) => {
  return testRequest.post(`/phishing-simulator/phishing-campaign/bulk-delete`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const searchCampaignManager = (payload = {}) => {
  return testRequest.post('/phishing-simulator/phishing-campaign/search', payload)
}
const exportCampaignManager = (payload = {}) => {
  return testRequest.post('phishing-simulator/phishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}
const searchCampaignPhishingJob = (payload = {}, id = '') => {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job-report/${id}/search`, payload)
}
const stopPhishingCampaignJob = (id = '', instanceGroup = '') => {
  return testRequest.patch(
    `/phishing-simulator/phishing-campaign-job/stop/${id}/${instanceGroup}`,
    null,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
const launchPhishingCampaignInstanceGroup = (id = '', instanceGroup = '') => {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job/start/${id}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const exportCampaignManagerItem = (payload, id) => {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/${id}/search/export`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const deletePhishingCampaignJob = (id = '', instanceGroup = '') => {
  return testRequest.delete(`/phishing-simulator/phishing-campaign-job/${id}/${instanceGroup}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getCampaignManagerFormDetails = () => {
  return testRequest.get('/phishing-simulator/phishing-campaign/form-details')
}
const getCampaignManagerPreview = (resourceId = '') => {
  return testRequest.get(`/phishing-simulator/phishing-campaign/preview/${resourceId}`)
}
export default {
  exportScenarios,
  searchScenarios,
  exportQuishingEmailTemplates,
  searchQuishingEmailTemplates,
  deleteScenario,
  deleteEmailTemplate,
  deleteLandingPageTemplate,
  exportLandingPageTemplates,
  getQuishingScenarioLandingPageAndEmailTemplate,
  searchLandingPageList,
  getLandingPageTemplate,
  deleteCampaign,
  deleteBulkCampaigns,
  searchCampaignManager,
  exportCampaignManager,
  searchCampaignPhishingJob,
  stopPhishingCampaignJob,
  launchPhishingCampaignInstanceGroup,
  exportCampaignManagerItem,
  deletePhishingCampaignJob,
  getCampaignManagerFormDetails,
  getCampaignManagerPreview
}
