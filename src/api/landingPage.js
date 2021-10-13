import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import { getMergedTags } from '@/api/company'

export function updateLandingPage(payload, id) {
  return testRequest.put(`phishing-simulator/landing-page-template/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createLandingPage(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template`, payload, {
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
  return testRequest.post(`phishing-simulator/landing-page-template/search`, payload, {
    loading: true
  })
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
