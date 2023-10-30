import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

const exportScenarios = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}
const searchScenarios = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-scenario/search`, payload)
}
const deleteScenario = (id) => {
  return testRequest.delete(`/quishing-simulator/quishing-scenario/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const createScenario = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-scenario`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const updateScenario = (payload, id) => {
  return testRequest.put(`/quishing-simulator/quishing-scenario/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const getScenario = (id) => {
  return testRequest.get(`/quishing-simulator/quishing-scenario/${id}`)
}
const getSummaryOfScenario = (templateId, landingPageId) => {
  return testRequest.get(
    `/quishing-simulator/quishing-scenario/preview/${templateId}/${landingPageId}`
  )
}
const getQuishingScenarioLandingPageAndEmailTemplate = (resourceId = '') => {
  return testRequest.get(`/quishing-simulator/quishing-scenario/preview/${resourceId}`)
}
const updateLandingPage = (payload, id) => {
  return testRequest.put(`/quishing-simulator/landing-page-template/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const createLandingPage = (payload) => {
  return testRequest.post(`/quishing-simulator/landing-page-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getEmailTemplatesList = (payload) => {
  return testRequest.post(`/quishing-simulator/email-templates/search`, payload)
}
const getLandingPageList = (payload) => {
  return testRequest.post(`/quishing-simulator/landing-page-template/search`, payload)
}
const getLandingPageTemplatePreviewContent = (id) => {
  return testRequest.get(`/quishing-simulator/landing-page-template/${id}`)
}
const searchQuishingEmailTemplates = (payload) => {
  return testRequest.post(`/quishing-simulator/email-templates/search`, payload)
}
const exportQuishingEmailTemplates = (payload) => {
  return testRequest.post(`/quishing-simulator/email-templates/search/export`, payload, {
    responseType: 'blob'
  })
}
const getScenarioDataDetails = () => {
  return testRequest.get(`quishing-simulator/quishing-scenario/form-details`)
}
const deleteEmailTemplate = (id) => {
  return testRequest.delete(`/quishing-simulator/email-templates/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const exportLandingPageTemplates = (payload) => {
  return testRequest.post(`/quishing-simulator/landing-page-template/search/export`, payload, {
    responseType: 'blob'
  })
}

const searchLandingPageList = (payload) => {
  return testRequest.post(`/quishing-simulator/landing-page-template/search`, payload)
}

const deleteLandingPageTemplate = (id) => {
  return testRequest.delete(`/quishing-simulator/landing-page-template/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getLandingPageFormDetails = () => {
  return testRequest.get(`quishing-simulator/landing-page-template/form-details`)
}

const getLandingPageTemplate = (id) => {
  return testRequest.get(`/quishing-simulator/landing-page-template/${id}`)
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
  return testRequest.get('/quishing-simulator/quishing-campaign/form-details')
}
const getCampaignManagerPreview = (resourceId = '') => {
  return testRequest.get(`/phishing-simulator/phishing-campaign/preview/${resourceId}`)
}
const getCampaignManager = (resourceId = '') => {
  return testRequest.get(`phishing-simulator/phishing-campaign/${resourceId}`)
}
const createCampaignManager = (payload = {}) => {
  return testRequest.post('/quishing-simulator/quishing-campaign', payload, {
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
  return testRequest.get(`phishing-simulator/domain-records/${resId}`)
}
const updateDomain = (payload, id) => {
  return testRequest.put(`phishing-simulator/domain-records/${id}`, payload)
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
const createCommonFormDataForQuishingTemplate = (payload) => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('categoryResourceId', payload.categoryResourceId)
  for (let i = 0; i < payload?.tags?.length; i++) {
    formData.append(`tags[${[i]}]`, payload.tags[i])
  }
  formData.append('difficultyResourceId', payload.difficultyResourceId)
  for (let i = 0; i < payload.availableForRequests.length; i++) {
    formData.append(`availableForRequests[${[i]}].Type`, payload.availableForRequests[i].type)
    formData.append(
      `availableForRequests[${[i]}].ResourceId`,
      payload.availableForRequests[i].resourceId
    )
  }
  formData.append('fromAddress', payload.fromAddress)
  formData.append('fromName', payload.fromName)
  formData.append('subject', payload.subject)
  formData.append('template', payload.template)
  formData.append('languageTypeResourceId', payload.languageTypeResourceId)
  if (payload.isAttachmentBasedTemplate) {
    const phishingFileType = getPhishingFileType(payload)
    formData.append('attachmentFiles', payload.importedEmailAttachments[0])
    formData.append(
      'phishingFile',
      payload.isAddedNewPhishingFile ? payload.attachmentFiles[0] : null
    )
    formData.append('phishingFileType', phishingFileType)
    formData.append('isPhishingFileModified', payload.isPhishingFileModified)
    formData.append('phishingFileName', payload.phishingFileName)
  }
  return formData
}

const createQuishingEmailTemplate = (payload = {}) => {
  const formData = createCommonFormDataForQuishingTemplate(payload)
  formData.append('isDuplicated', payload.isDuplicated)
  formData.append('duplicatedTemplateResourceId', payload.duplicatedTemplateResourceId)
  return testRequest.post(`quishing-simulator/email-templates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
export function updateQuishingEmailTemplate(payload = {}, id = '') {
  const formData = createCommonFormDataForQuishingTemplate(payload)
  return testRequest.put(`quishing-simulator/email-templates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
const getEmailTemplatePreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/email-templates/${id}`)
}
export function getMergedTextForQuishing() {
  return testRequest.get(`quishing-simulator/email-templates/merge-tags`)
}
const getDefaultCompanySmtpSetting = () => {
  return testRequest.get(
    '/quishing-simulator/quishing-campaign/root-company-shared-smtp-resource-id'
  )
}

export default {
  exportScenarios,
  searchScenarios,
  exportQuishingEmailTemplates,
  searchQuishingEmailTemplates,
  getSummaryOfScenario,
  getScenarioDataDetails,
  createScenario,
  updateScenario,
  getScenario,
  deleteScenario,
  deleteEmailTemplate,
  deleteLandingPageTemplate,
  exportLandingPageTemplates,
  getQuishingScenarioLandingPageAndEmailTemplate,
  getEmailTemplatesList,
  getLandingPageList,
  getLandingPageTemplatePreviewContent,
  searchLandingPageList,
  getLandingPageTemplate,
  getLandingPageFormDetails,
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
  postQuishingExcludedIPAddresses,
  updateLandingPage,
  createLandingPage,
  createQuishingEmailTemplate,
  getEmailTemplatePreviewContent,
  getMergedTextForQuishing,
  updateQuishingEmailTemplate,
  getDefaultCompanySmtpSetting
}
