import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import { getMergedTags } from '@/api/company'

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
