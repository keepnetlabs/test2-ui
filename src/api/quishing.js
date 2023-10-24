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
const getCampaignManager = (resourceId = '') => {
  return testRequest.get(`phishing-simulator/phishing-campaign/${resourceId}`)
}
const createCampaignManager = (payload = {}) => {
  return testRequest.post('/phishing-simulator/phishing-campaign', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const updateCampaignManager = (resourceId = '', payload = {}) => {
  return testRequest.put(`/phishing-simulator/phishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const calculateScheduleInfo = (payload) => {
  return testRequest.post(`/phishing-simulator/phishing-campaign/calculate-schedule-info`, payload)
}
const calculateSendingInfo = (payload) => {
  return testRequest.post(`/phishing-simulator/phishing-campaign/calculate-sending-info`, payload)
}
const launchPhishingCampaign = (id = '', payload = {}) => {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job/start/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getDnsServiceList = (payload) => {
  return testRequest.post(`phishing-simulator/dns-services/search`, payload)
}
const exportDnsService = (payload) => {
  return testRequest.post(`phishing-simulator/dns-services/search/export`, payload, {
    responseType: 'blob'
  })
}
const deleteDnsService = (id) => {
  return testRequest.delete(`phishing-simulator/dns-services/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
const createDnsService = (payload) => {
  return testRequest.post(`phishing-simulator/dns-services`, payload, { snackbar: COMMON_SNACKBAR })
}
const getDnsService = (id) => {
  return testRequest.get(`phishing-simulator/dns-services/${id}`, { loading: true })
}
const updateDnsService = (payload, id) => {
  return testRequest.put(`phishing-simulator/dns-services/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
const testDnsConnection = (payload, id) => {
  return testRequest.post(`phishing-simulator/dns-services/${id}/test`, payload)
}

const getDomainsList = (payload) => {
  return testRequest.post(`phishing-simulator/domain-records/search`, payload)
}
const exportDomainList = (payload) => {
  return testRequest.post(`phishing-simulator/domain-records/search/export`, payload, {
    responseType: 'blob'
  })
}
const deleteDomain = (id) => {
  return testRequest.delete(`phishing-simulator/domain-records/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
const getDomainData = () => {
  return testRequest.get(`phishing-simulator/domain-records/form-details`)
}
const createDomain = (payload) => {
  return testRequest.post(`phishing-simulator/domain-records`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const getDomainEditData = (resId) => {
  return testRequest.get(`phishing-simulator/domain-records/${resId}`, {
    loading: true
  })
}
const updateDomain = (payload, id) => {
  return testRequest.put(`phishing-simulator/domain-records/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
const testDomainConnection = (payload) => {
  return testRequest.post(`phishing-simulator/domain-records/test`, payload)
}
const getQuishingExcludedIPAddresses = () => {
  return testRequest.get(`/phishing-simulator/excluded-ip-list`)
}
const postQuishingExcludedIPAddresses = (payload = {}) => {
  return testRequest.post(`/phishing-simulator/excluded-ip`, payload, {
    snackbar: COMMON_SNACKBAR
  })
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
  getCampaignManagerPreview,
  getCampaignManager,
  createCampaignManager,
  updateCampaignManager,
  calculateScheduleInfo,
  calculateSendingInfo,
  launchPhishingCampaign,
  getDnsServiceList,
  exportDnsService,
  deleteDnsService,
  createDnsService,
  getDnsService,
  updateDnsService,
  testDnsConnection,
  getDomainsList,
  exportDomainList,
  deleteDomain,
  getDomainData,
  createDomain,
  getDomainEditData,
  updateDomain,
  testDomainConnection,
  getQuishingExcludedIPAddresses,
  postQuishingExcludedIPAddresses
}
