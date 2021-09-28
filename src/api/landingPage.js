import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import { getMergedTags } from '@/api/company'

export function updateLandingPage(payload, id) {
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
  return testRequest.put(`phishing-simulator/landing-page-template/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}

export function createLandingPage(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    snackbar: COMMON_SNACKBAR
  })
}

export function getLandingPageTemplatePreviewContent(id) {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`, { loading: true })
}

export function getLandingPageFormDetails() {
  return testRequest.get(`phishing-simulator/landing-page-template/form-details`, { loading: true })
}

export function getLandingPageList(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template/search`, payload)
}

export function exportLandingPage(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template/search/export`, payload, {
    responseType: 'blob'
  })
}

export function deleteLandingPage(id) {
  return testRequest.delete(`phishing-simulator/landing-page-template/${id}`, { loading: true })
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
  return testRequest.get(`phishing-simulator/landing-page-template/merge-tags`, payload)
}

export function getLandingPageTemplate(id) {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`, { loading: true })
}
