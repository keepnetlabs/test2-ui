import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const getPhishingFileType = (payload) => {
  if (payload.attachmentFiles[0]) {
    return payload.attachmentFiles[0]?.name
      ? payload.attachmentFiles[0]?.name?.split('.')[1]
      : payload.attachmentFiles[0]?.fileName?.split('.')[1]
  }
  return payload?.phishingFileName?.split('.')?.[1] || null
}
const createCommonFormDataForPhishingTemplate = (payload) => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('categoryResourceId', payload.categoryResourceId)
  formData.append('isAssistedByAI', payload.isAssistedByAI)
  formData.append('isPlainText', payload.isPlainText)
  formData.append('prompt', payload.prompt)
  formData.append('toneResourceId', payload.toneResourceId)
  formData.append('localizationResourceId', payload.localizationResourceId)
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
  if (payload?.ccAddresses?.length) {
    for (let i = 0; i < payload.ccAddresses.length; i++) {
      formData.append(`ccAddresses[${[i]}]`, payload.ccAddresses[i])
    }
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

export function updatePhishingEmailTemplate(payload = {}, id = '') {
  const formData = createCommonFormDataForPhishingTemplate(payload)
  return testRequest.put(`phishing-simulator/email-templates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
export function createPhishingEmailTemplate(payload = {}) {
  const formData = createCommonFormDataForPhishingTemplate(payload)
  formData.append('isDuplicated', payload.isDuplicated)
  formData.append('duplicatedTemplateResourceId', payload.duplicatedTemplateResourceId)
  return testRequest.post(`phishing-simulator/email-templates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}

export function getEmailTemplatesList(payload) {
  return testRequest.post(`phishing-simulator/email-templates/search`, payload)
}

export function exportEmailTemplates(payload) {
  return testRequest.post(`phishing-simulator/email-templates/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getEmailTemplatePreviewContent(id) {
  return testRequest.get(`phishing-simulator/email-templates/${id}`)
}

export function getCampaignManagerEmailTemplatePreviewContent(
  id = '',
  campaignResourceId = '',
  instanceGroup = ''
) {
  return testRequest.get(
    `phishing-simulator/phishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/email-templates/${id}`
  )
}

export function deleteEmailTemplate(id) {
  return testRequest.delete(`phishing-simulator/email-templates/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function bulkDeleteEmailTemplates(payload) {
  return testRequest.delete(`phishing-simulator/email-templates/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

export function getMergedTextForPhishing() {
  const payload = {
    reportAllPages: false,
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'Name',
    ascending: true,
    exportType: 'Pdf',
    filter: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'OR',
          FilterItems: [],
          FilterGroups: []
        },
        {
          Condition: 'OR',
          FilterItems: [],
          FilterGroups: []
        },
        {
          Condition: 'OR',
          FilterItems: [],
          FilterGroups: []
        }
      ]
    }
  }
  return testRequest.get(`phishing-simulator/email-templates/merge-tags`, payload)
}

export function searchCampaignManager(payload = {}) {
  return testRequest.post('/phishing-simulator/phishing-campaign/search', payload)
}

export function searchUnscheduledCampaigns(payload = {}) {
  return testRequest.post('phishing-simulator/phishing-campaign/search/unscheduled', payload)
}

export function exportCampaignManager(payload = {}) {
  return testRequest.post('phishing-simulator/phishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}

export function exportCampaignManagerItem(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/${id}/search/export`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function deleteCampaignManager(resourceId = '') {
  return testRequest.delete(`phishing-simulator/phishing-campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createCampaignManager(payload = {}) {
  return testRequest.post('/phishing-simulator/phishing-campaign', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateCampaignManager(resourceId = '', payload = {}) {
  return testRequest.put(`/phishing-simulator/phishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getCampaignManager(resourceId = '') {
  return testRequest.get(`phishing-simulator/phishing-campaign/${resourceId}`)
}

export function getCampaignManagerFormDetails() {
  return testRequest.get('/phishing-simulator/phishing-campaign/form-details')
}

export function getPhishingScenarioLandingPageAndEmailTemplate(resourceId = '') {
  return testRequest.get(`/phishing-simulator/phishing-scenario/preview/${resourceId}`)
}

export function getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId(id) {
  return testRequest.get(`/phishing-simulator/phishing-scenario/preview/${id}`)
}

export function getCampaignManagerPreview(resourceId = '') {
  return testRequest.get(`/phishing-simulator/phishing-campaign/preview/${resourceId}`)
}

export function getDefaultCompanySmtpSetting() {
  return testRequest.get(
    '/phishing-simulator/phishing-campaign/root-company-shared-smtp-resource-id'
  )
}

export function getDefaultEmailDeliverySetting() {
  return testRequest.get('/phishing-simulator/phishing-campaign/default-email-delivery-setting')
}

export function searchCampaignJobUserEmailClicked(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/clicked/search/${id}/${instanceGroup}`,
    payload
  )
}

export function searchCampaignJobUserEmailClickedDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-clicked/${id}`,
    payload
  )
}

export function searchCampaignJobUserEmailOpenedDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-opened/${id}`,
    payload
  )
}

export function searchCampaignJobUserEmailReportedDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-reported/${id}`,
    payload
  )
}

export function searchCampaignJobUserEmailOpened(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/opened/search/${id}/${instanceGroup}`,
    payload
  )
}

export function exportCampaignJobUserEmailOpened(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/opened/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserAttachmentOpened(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/attachmentopened/search/${id}/${instanceGroup}`,
    payload
  )
}

export function searchCampaignJobUserAttachmentOpenedDetaiils(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-opened-attachment/${id}`,
    payload
  )
}

export function exportCampaignJobUserAttachmentOpened(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/attachmentopened/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function exportCampaignJobUserEmailClicked(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/clicked/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function exportCampaignJobUserEmailSubmitted(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/submitteddata/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function exportCampaignJobUserEmailSubmittedMfa(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/mfa/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserNoResponse(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/noresponse/search/${id}/${instanceGroup}`,
    payload
  )
}

export function exportCampaignJobUserNoResponse(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/noresponse/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserEmailSubmitted(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/submitteddata/search/${id}/${instanceGroup}`,
    payload
  )
}

export function searchCampaignJobUserEmailSubmittedDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-submitted/${id}`,
    payload
  )
}
export function searchCampaignJobUserReplied(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/replied/search/${id}/${instanceGroup}`,
    payload
  )
}
export function searchCampaignJobUserRepliedDetails(payload = {}, id = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-replied/${id}`,
    payload
  )
}

export function exportCampaignJobUserReplied(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/replied/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserEmailSubmittedMfa(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/mfa/search/${id}/${instanceGroup}`,
    payload
  )
}
export function searchCampaignJobUserEmailSubmittedDetailsMfa(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-mfa-submitted/${id}`,
    payload
  )
}

export function searchCampaignJobUserSendingReport(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/${id}/${instanceGroup}`,
    payload
  )
}

export function searchCampaignJobUserPhishingReport(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/reported/search/${id}/${instanceGroup}`,
    payload
  )
}

export function exportCampaignJobUserPhishingReport(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/reported/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignPhishingJob(payload, id) {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job-report/${id}/search`, payload)
}

export function stopPhishingCampaignJob(id = '', instanceGroup = '') {
  return testRequest.patch(
    `/phishing-simulator/phishing-campaign-job/stop/${id}/${instanceGroup}`,
    null,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function launchPhishingCampaign(id = '', payload = {}) {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job/start/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function launchPhishingCampaignInstanceGroup(id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job/start/${id}/${instanceGroup}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function resendPhishingCampaignToUsers(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job/resend/${id}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function exportPhishingCampaignJob(id = '', instanceGroup = '') {
  return testRequest.get(
    `/phishing-simulator/phishing-campaign-job-report/export/${id}/${instanceGroup}`,
    {
      responseType: 'blob'
    }
  )
}

export function resendPhishingCampaignToUserList(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job/resend/list/${id}/${instanceGroup}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function deletePhishingCampaignJob(id = '', instanceGroup = '') {
  return testRequest.delete(`/phishing-simulator/phishing-campaign-job/${id}/${instanceGroup}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function exportCampaignJobUserSendingReport(payload = {}, id = '', instanceGroup = '') {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/export/${id}/${instanceGroup}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function getCampaignJobEmailActivity(resourceId = '') {
  return testRequest.get(`/phishing-simulator/phishing-campaign-job/email-activity/${resourceId}`)
}

export function getCampaignManagerJobFormDetails() {
  return testRequest.get('/phishing-simulator/phishing-campaign-job/form-details')
}

export function getCampaignJobSummary(id = '', instanceGroup = '') {
  return testRequest.get(
    `/phishing-simulator/phishing-campaign-job-report/summary/${id}/${instanceGroup}`
  )
}

export function getCampaignJobSummaryForTraining(id = '', instanceGroup = '') {
  return testRequest.get(
    `/phishing-simulator/phishing-campaign-job-report/summary/training/${id}/${instanceGroup}`
  )
}

export function getCampaignJobSummaryTargetGroups(id = '', instanceGroup = '') {
  return testRequest.get(
    `/phishing-simulator/phishing-campaign-job-report/summary/target-groups/${id}/${instanceGroup}`
  )
}

export function callForCampaignReports(payload) {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job-report/search`, payload)
}

export function exportCampaignReports(payload) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search/export`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function bulkDeleteCampaignReports(payload) {
  return testRequest.delete('/phishing-simulator/phishing-campaign/bulk-delete', {
    data: payload,
    snackbar: COMMON_SNACKBAR
  })
}

export function calculateSendingInfo(payload) {
  return testRequest.post(`/phishing-simulator/phishing-campaign/calculate-sending-info`, payload)
}

export function getExcludedIPAddresses() {
  return testRequest.get(`/phishing-simulator/excluded-ip-list`)
}

export function postExcludedIPAddresses(payload = {}) {
  return testRequest.post(`/phishing-simulator/excluded-ip`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getEmailDeliveries() {
  return testRequest.get(`/phishing-simulator/phishing-campaign/email-delivery-setting-list`)
}

export function getPhishingScenariosPhoneNumber() {
  return testRequest.get(`/phishing-simulator/phishing-scenario/mfa-phone-number`)
}

export function getCalculatedScheduleInfo(payload) {
  return testRequest.post(`/phishing-simulator/phishing-campaign/calculate-schedule-info`, payload)
}

export const updateSandboxActivity = (resourceId, payload) => {
  return testRequest.put(
    `/phishing-simulator/phishing-campaign-job-report/activity/${resourceId}`,
    payload,
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export const getCampaignScenarioStatistics = () => {
  return testRequest.get('/phishing-simulator/phishing-scenario/scenario-statistics')
}

export const searchScenarioInfo = (payload) => {
  return testRequest.post(`/phishing-simulator/phishing-scenario/search/category-info`, payload)
}

export const generateAIEmailTemplate = (payload) => {
  return testRequest.post(`/phishing-simulator/email-templates/generate`, payload)
}

export const generateAILandingPageTemplate = (payload) => {
  return testRequest.post(`/phishing-simulator/landing-page-template/generate`, payload)
}
export const getAIEmailTemplateLimit = () => {
  return testRequest.get(`/phishing-simulator/email-templates/ai-limit`)
}
export const getAILandingPageTemplateLimit = () => {
  return testRequest.get(`/phishing-simulator/landing-page-template/ai-limit`)
}
export const getGeneratedAIEmailTemplate = () => {
  return testRequest.get(`/phishing-simulator/email-templates`)
}
export const getAIGenerationOptions = () => {
  return testRequest.get(`/phishing-simulator/email-templates/ai-generation-options`)
}
export const getGeneratedAILandingPageTemplate = () => {
  return testRequest.get(`/phishing-simulator/landing-page-template`)
}
