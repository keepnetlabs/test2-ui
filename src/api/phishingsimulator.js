import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function updatePhishingEmailTemplate(payload, id) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('categoryResourceId', payload.categoryResourceId)
  for (let i = 0; i < payload?.tags?.length; i++) {
    formData.append(`tags[${[i]}]`, payload.tags)
  }

  formData.append('difficultyResourceId', payload.difficultyResourceId)
  for (let i = 0; i < payload.availableForRequests.length; i++) {
    formData.append(`availableForRequests[${[i]}].Type`, payload.availableForRequests[i].type)
    formData.append(`availableForRequests[${[i]}].ResourceId`, payload.availableForRequests[i].id)
  }
  formData.append('fromAddress', payload.fromAddress)
  formData.append('fromName', payload.fromName)
  formData.append('subject', payload.subject)
  formData.append('template', payload.template)
  formData.append('attachmentFiles', payload.attachmentFiles[0])
  return testRequest.put(`phishing-simulator/email-templates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}
export function createPhishingEmailTemplate(payload) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('categoryResourceId', payload.categoryResourceId)
  for (let i = 0; i < payload?.tags?.length; i++) {
    formData.append(`tags[${[i]}]`, payload.tags)
  }

  formData.append('difficultyResourceId', payload.difficultyResourceId)
  for (let i = 0; i < payload.availableForRequests.length; i++) {
    formData.append(`availableForRequests[${[i]}].Type`, payload.availableForRequests[i].type)
    formData.append(`availableForRequests[${[i]}].ResourceId`, payload.availableForRequests[i].id)
  }
  formData.append('fromAddress', payload.fromAddress)
  formData.append('fromName', payload.fromName)
  formData.append('subject', payload.subject)
  formData.append('template', payload.template)
  formData.append('attachmentFiles', payload.attachmentFiles)
  return testRequest.post(`phishing-simulator/email-templates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}

export function getEmailTemplatesList(payload) {
  return testRequest.post(`phishing-simulator/email-templates/search`, payload, { loading: true })
}

export function exportEmailTemplates(payload) {
  return testRequest.post(`phishing-simulator/email-templates/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getEmailTemplatePreviewContent(id) {
  return testRequest.get(`phishing-simulator/email-templates/${id}`, { loading: true })
}

export function deleteEmailTemplate(id) {
  return testRequest.delete(`phishing-simulator/email-templates/${id}`, { loading: true })
}

export function getLookups(name) {
  const payload = {
    typeName: name,
    typeidlist: []
  }
  return testRequest.post(`/lookups`, payload)
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

export function exportCampaignManager(payload = {}) {
  return testRequest.post('phishing-simulator/phishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
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

export function getPhishingScenarioLandingPageAndEmailTemplate(
  emailTemplateId = '',
  landingPageId = ''
) {
  return testRequest.get(
    `/phishing-simulator/phishing-scenario/preview/${emailTemplateId}/${landingPageId}`
  )
}

export function getCampaignManagerPreview(resourceId = '') {
  return testRequest.get(`/phishing-simulator/phishing-campaign/preview/${resourceId}`)
}

export function getDefaultCompanySmtpSetting() {
  return testRequest.get(
    '/phishing-simulator/phishing-campaign/root-company-shared-smtp-resource-id'
  )
}

export function searchCampaignJobUsers(payload = {}, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/${id}`,
    payload
  )
}

export function searchCampaignJobUserEmailClicked(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/clicked/search/${id}`,
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

export function searchCampaignJobUserEmailOpened(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/opened/search/${id}`,
    payload
  )
}

export function exportCampaignJobUserEmailOpened(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/opened/search/export/${id}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function exportCampaignJobUserEmailClicked(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/clicked/search/export/${id}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserNoResponse(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/noresponse/search/${id}`,
    payload
  )
}

export function exportCampaignJobUserNoResponse(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/noresponse/search/export/${id}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserEmailSubmitted(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/submitteddata/search/${id}`,
    payload
  )
}

export function searchCampaignJobUserEmailSubmittedDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/search-email-submitted/${id}`,
    payload
  )
}

export function searchCampaignJobUserSendingReport(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/${id}`,
    payload
  )
}

export function searchCampaignPhishingJob(payload, id) {
  return testRequest.post(`/phishing-simulator/phishing-campaign-job-report/${id}/search`, payload)
}

export function stopPhishingCampaignJob(id) {
  return testRequest.patch(`/phishing-simulator/phishing-campaign-job/stop/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deletePhishingCampaignJob(id) {
  return testRequest.delete(`/phishing-simulator/phishing-campaign-job/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function exportCampaignJobUserSendingReport(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/export/${id}`,
    payload,
    {
      responseType: 'blob'
    }
  )
}

export function searchCampaignJobUserSendingReportDetails(payload, id) {
  return testRequest.post(
    `/phishing-simulator/phishing-campaign-job-report/all/search/${id}`,
    payload
  )
}

export function getCampaignManagerJobFormDetails() {
  return testRequest.get('/phishing-simulator/phishing-campaign-job/form-details')
}

export function getCampaignJobSummary(id) {
  return testRequest.get(`/phishing-simulator/phishing-campaign-job-report/summary/${id}`)
}

export function getCampaignJobSummaryTargetGroups(id) {
  return testRequest.get(
    `/phishing-simulator/phishing-campaign-job-report/summary/target-groups/${id}`
  )
}
