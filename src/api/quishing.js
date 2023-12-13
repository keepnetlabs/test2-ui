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
const getSummaryOfScenario = (templateId, landingPageId, templateType) => {
  return testRequest.get(
    `/quishing-simulator/quishing-scenario/preview/${templateType}/${templateId}/${landingPageId}`
  )
}
const getQuishingScenarioLandingPageAndEmailTemplate = (
  resourceId = '',
  templateType = 'email'
) => {
  return testRequest.get(
    `/quishing-simulator/quishing-scenario/preview/${templateType}/${resourceId}`
  )
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
  return testRequest.post(`/quishing-simulator/quishing-templates/search`, payload)
}
const getLandingPageList = (payload) => {
  return testRequest.post(`/quishing-simulator/landing-page-template/search`, payload)
}
const getLandingPageTemplatePreviewContent = (id) => {
  return testRequest.get(`/quishing-simulator/landing-page-template/${id}`)
}
const searchQuishingEmailTemplates = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-templates/search`, payload)
}
const exportQuishingEmailTemplates = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-templates/search/export`, payload, {
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
const deleteIndividualPrintoutTemplate = (id) => {
  return testRequest.delete(`/quishing-simulator/quishing-templates/${id}`, {
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
  return testRequest.delete(`quishing-simulator/quishing-campaign/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const deleteBulkCampaigns = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-campaign/bulk-delete`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const searchCampaignManager = (payload = {}) => {
  return testRequest.post('/quishing-simulator/quishing-campaign/search', payload)
}
const exportCampaignManager = (payload = {}) => {
  return testRequest.post('quishing-simulator/quishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}
const searchCampaignQuishingJob = (payload = {}, id = '') => {
  return testRequest.post(`/quishing-simulator/quishing-campaign-job-report/${id}/search`, payload)
}
const stopQuishingCampaignJob = (id = '', instanceGroup = '') => {
  return testRequest.patch(
    `/quishing-simulator/quishing-campaign-job/stop/${id}/${instanceGroup}`,
    null,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
const launchQuishingCampaignInstanceGroup = (id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job/start/${id}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const exportCampaignManagerItem = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/${id}/search/export`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const deleteQuishingCampaignJob = (id = '', instanceGroup = '') => {
  return testRequest.delete(`/quishing-simulator/quishing-campaign-job/${id}/${instanceGroup}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getCampaignManagerFormDetails = () => {
  return testRequest.get('/quishing-simulator/quishing-campaign/form-details')
}
const getCampaignManagerPreview = (resourceId = '') => {
  return testRequest.get(`/quishing-simulator/quishing-campaign/preview/${resourceId}`)
}
const getCampaignManager = (resourceId = '') => {
  return testRequest.get(`quishing-simulator/quishing-campaign/${resourceId}`)
}
const createCampaignManager = (payload = {}) => {
  return testRequest.post('/quishing-simulator/quishing-campaign', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const updateCampaignManager = (resourceId = '', payload = {}) => {
  return testRequest.put(`/quishing-simulator/quishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const calculateScheduleInfo = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-campaign/calculate-schedule-info`, payload)
}
const calculateSendingInfo = (payload) => {
  return testRequest.post(`/quishing-simulator/quishing-campaign/calculate-sending-info`, payload)
}
const launchQuishingCampaign = (id = '', payload = {}) => {
  return testRequest.post(`/quishing-simulator/quishing-campaign-job/start/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getDnsServiceList = (payload) => {
  return testRequest.post(`quishing-simulator/dns-services/search`, payload)
}
const exportDnsService = (payload) => {
  return testRequest.post(`quishing-simulator/dns-services/search/export`, payload, {
    responseType: 'blob'
  })
}
const deleteDnsService = (id) => {
  return testRequest.delete(`quishing-simulator/dns-services/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const createDnsService = (payload) => {
  return testRequest.post(`quishing-simulator/dns-services`, payload, { snackbar: COMMON_SNACKBAR })
}
const getDnsService = (id) => {
  return testRequest.get(`quishing-simulator/dns-services/${id}`)
}
const updateDnsService = (payload, id) => {
  return testRequest.put(`quishing-simulator/dns-services/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const testDnsConnection = (payload, id) => {
  return testRequest.post(`quishing-simulator/dns-services/${id}/test`, payload)
}

const getDomainsList = (payload) => {
  return testRequest.post(`quishing-simulator/domain-records/search`, payload)
}
const exportDomainList = (payload) => {
  return testRequest.post(`quishing-simulator/domain-records/search/export`, payload, {
    responseType: 'blob'
  })
}
const deleteDomain = (id) => {
  return testRequest.delete(`quishing-simulator/domain-records/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getDomainData = () => {
  return testRequest.get(`quishing-simulator/domain-records/form-details`)
}
const createDomain = (payload) => {
  return testRequest.post(`quishing-simulator/domain-records`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const getDomainEditData = (resId) => {
  return testRequest.get(`quishing-simulator/domain-records/${resId}`)
}
const updateDomain = (payload, id) => {
  return testRequest.put(`quishing-simulator/domain-records/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const testDomainConnection = (payload) => {
  return testRequest.post(`quishing-simulator/domain-records/test`, payload)
}
const getQuishingExcludedIPAddresses = () => {
  return testRequest.get(`/quishing-simulator/excluded-ip-list`)
}
const postQuishingExcludedIPAddresses = (payload = {}) => {
  return testRequest.post(`/quishing-simulator/excluded-ip`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const getQuishingFileType = (payload) => {
  if (payload.attachmentFiles[0]) {
    return payload.attachmentFiles[0]?.name
      ? payload.attachmentFiles[0]?.name?.split('.')[1]
      : payload.attachmentFiles[0]?.fileName?.split('.')[1]
  }
  return payload?.phishingFileName?.split('.')?.[1] || null
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
  if (payload.type) formData.append('type', payload.type)
  if (payload.isAttachmentBasedTemplate) {
    const phishingFileType = getQuishingFileType(payload)
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
const createCommonFormDataForQuishingPrintoutTemplate = (payload) => {
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
  formData.append('template', payload.template)
  formData.append('languageTypeResourceId', payload.languageTypeResourceId)
  if (payload.type) formData.append('type', payload.type)
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
const createQuishingPrintoutTemplate = (payload = {}) => {
  const formData = createCommonFormDataForQuishingPrintoutTemplate(payload)
  formData.append('isDuplicated', payload.isDuplicated)
  formData.append('duplicatedTemplateResourceId', payload.duplicatedTemplateResourceId)
  return testRequest.post(`quishing-simulator/quishing-templates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
const updateQuishingPrintoutTemplate = (payload = {}, id = '') => {
  const formData = createCommonFormDataForQuishingPrintoutTemplate(payload)
  return testRequest.put(`quishing-simulator/quishing-templates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
const getEmailTemplatePreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/email-templates/${id}`)
}
const getQuishingTemplatePreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/quishing-templates/${id}`)
}
const getQuishingPdfPreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/quishing-templates/preview/${id}`, {
    responseType: 'blob'
  })
}
const getQuishingPdfScenarioPreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/quishing-scenario/print-preview/${id}`, {
    responseType: 'blob'
  })
}
const getQuishingPdfCampaignPreviewContent = (id) => {
  return testRequest.get(`quishing-simulator/quishing-campaign/print-preview/${id}`, {
    responseType: 'blob'
  })
}
export function getMergedTextForQuishing() {
  return testRequest.get(`quishing-simulator/email-templates/merge-tags`)
}
export function getMergedTextForQuishingPrintout() {
  return testRequest.get(`/quishing-simulator/quishing-templates/merge-tags/individual`)
}

const getDefaultCompanySmtpSetting = () => {
  return testRequest.get(
    '/quishing-simulator/quishing-campaign/root-company-shared-smtp-resource-id'
  )
}
const getEmailDeliveries = () => {
  return testRequest.get(`/quishing-simulator/quishing-campaign/email-delivery-setting-list`)
}
const getCampaignJobSummary = (id = '', instanceGroup = '') => {
  return testRequest.get(
    `/quishing-simulator/quishing-campaign-job-report/summary/${id}/${instanceGroup}`
  )
}
const getCampaignJobSummaryTargetGroups = (id = '', instanceGroup = '') => {
  return testRequest.get(
    `/quishing-simulator/quishing-campaign-job-report/summary/target-groups/${id}/${instanceGroup}`
  )
}
const getCampaignManagerEmailTemplatePreviewContent = (
  id = '',
  campaignResourceId = '',
  instanceGroup = ''
) => {
  return testRequest.get(
    `quishing-simulator/quishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/email-templates/${id}`
  )
}
const getCampaignManagerQuishingTemplatePreviewContent = (
  id = '',
  campaignResourceId = '',
  instanceGroup = ''
) => {
  return testRequest.get(
    `quishing-simulator/quishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/quishing-templates/${id}`
  )
}

const exportQuishingCampaignJob = (id = '', instanceGroup = '') => {
  return testRequest.get(
    `/quishing-simulator/quishing-campaign-job-report/export/${id}/${instanceGroup}`,
    {
      responseType: 'blob'
    }
  )
}
const resendQuishingCampaignToUsers = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job/resend/${id}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
const getCampaignManagerLandingPageTemplatePreviewContent = (
  id = '',
  campaignResourceId = '',
  instanceGroup = ''
) => {
  return testRequest.get(
    `quishing-simulator/quishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/landing-page-template/${id}`
  )
}
const getCampaignManagerJobFormDetails = () => {
  return testRequest.get('/quishing-simulator/quishing-campaign-job/form-details')
}
const searchCampaignJobUserEmailOpened = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/opened/search/${id}/${instanceGroup}`,
    payload
  )
}
const exportCampaignJobUserEmailOpened = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/opened/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const resendQuishingCampaignToUserList = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job/resend/list/${id}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const searchCampaignJobUserEmailClickedDetails = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-email-clicked/${id}`,
    payload
  )
}
const exportCampaignJobUserEmailClicked = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/clicked/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const searchCampaignJobUserEmailClicked = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/clicked/search/${id}/${instanceGroup}`,
    payload
  )
}

const searchCampaignJobUserNoResponse = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/noresponse/search/${id}/${instanceGroup}`,
    payload
  )
}

const exportCampaignJobUserNoResponse = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/noresponse/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const searchCampaignJobUserEmailOpenedDetails = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-email-opened/${id}`,
    payload
  )
}
const searchCampaignJobUserAttachmentOpenedDetails = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-email-opened-attachment/${id}`,
    payload
  )
}
const searchCampaignJobUserAttachmentOpened = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/attachmentopened/search/${id}/${instanceGroup}`,
    payload
  )
}
const exportCampaignJobUserAttachmentOpened = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/attachmentopened/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const searchCampaignJobUserEmailReportedDetails = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-email-reported/${id}`,
    payload
  )
}
const exportCampaignJobUserPhishingReport = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/reported/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const searchCampaignJobUserPhishingReport = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/reported/search/${id}/${instanceGroup}`,
    payload
  )
}
const exportCampaignJobUserSendingReport = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/all/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}
const searchCampaignJobUserSendingReport = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/all/search/${id}/${instanceGroup}`,
    payload
  )
}
const getCampaignJobEmailActivity = (resourceId = '') => {
  return testRequest.get(`/quishing-simulator/quishing-campaign-job/email-activity/${resourceId}`)
}
const exportCampaignJobUserEmailSubmitted = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/submitteddata/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const searchCampaignJobUserEmailSubmitted = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/submitteddata/search/${id}/${instanceGroup}`,
    payload
  )
}
const searchCampaignJobUserEmailSubmittedDetails = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-email-submitted/${id}`,
    payload
  )
}
const searchCampaignJobUserEmailSubmittedDetailsMfa = (payload, id) => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/search-mfa-submitted/${id}`,
    payload
  )
}
const exportCampaignJobUserEmailSubmittedMfa = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/mfa/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

const searchCampaignJobUserEmailSubmittedMfa = (payload = {}, id = '', instanceGroup = '') => {
  return testRequest.post(
    `/quishing-simulator/quishing-campaign-job-report/mfa/search/${id}/${instanceGroup}`,
    payload
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
  searchCampaignQuishingJob,
  stopQuishingCampaignJob,
  launchQuishingCampaignInstanceGroup,
  exportCampaignManagerItem,
  deleteQuishingCampaignJob,
  getCampaignManagerFormDetails,
  getCampaignManagerPreview,
  getCampaignManager,
  createCampaignManager,
  updateCampaignManager,
  calculateScheduleInfo,
  calculateSendingInfo,
  launchQuishingCampaign,
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
  createQuishingPrintoutTemplate,
  getEmailTemplatePreviewContent,
  getMergedTextForQuishing,
  getMergedTextForQuishingPrintout,
  updateQuishingEmailTemplate,
  updateQuishingPrintoutTemplate,
  getDefaultCompanySmtpSetting,
  getEmailDeliveries,
  getCampaignJobSummary,
  getCampaignJobSummaryTargetGroups,
  getCampaignManagerEmailTemplatePreviewContent,
  exportQuishingCampaignJob,
  resendQuishingCampaignToUsers,
  getCampaignManagerLandingPageTemplatePreviewContent,
  getCampaignManagerJobFormDetails,
  searchCampaignJobUserEmailOpened,
  exportCampaignJobUserEmailOpened,
  resendQuishingCampaignToUserList,
  searchCampaignJobUserEmailClickedDetails,
  exportCampaignJobUserEmailClicked,
  searchCampaignJobUserEmailClicked,
  searchCampaignJobUserNoResponse,
  exportCampaignJobUserNoResponse,
  searchCampaignJobUserEmailOpenedDetails,
  searchCampaignJobUserAttachmentOpenedDetails,
  searchCampaignJobUserAttachmentOpened,
  exportCampaignJobUserAttachmentOpened,
  searchCampaignJobUserEmailReportedDetails,
  exportCampaignJobUserPhishingReport,
  searchCampaignJobUserPhishingReport,
  exportCampaignJobUserSendingReport,
  searchCampaignJobUserSendingReport,
  getCampaignJobEmailActivity,
  exportCampaignJobUserEmailSubmitted,
  searchCampaignJobUserEmailSubmitted,
  searchCampaignJobUserEmailSubmittedDetails,
  searchCampaignJobUserEmailSubmittedDetailsMfa,
  exportCampaignJobUserEmailSubmittedMfa,
  searchCampaignJobUserEmailSubmittedMfa,
  getQuishingTemplatePreviewContent,
  getQuishingPdfPreviewContent,
  getQuishingPdfScenarioPreviewContent,
  deleteIndividualPrintoutTemplate,
  getQuishingPdfCampaignPreviewContent,
  getCampaignManagerQuishingTemplatePreviewContent
}
