import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function investigationList(obj) {
  return testRequest.post(`investigations/search`, obj)
  //`CompanyInner/GetBusinessCategories?companyId=${localStorage.getItem('companyId')}`
}

export function getTargetUsers() {
  return testRequest.get(`target-groups`)
}

export function saveNewInvestigation(obj) {
  //create new investigation function... obj matches with back end acceptance parameters
  //for more details look at the newInvestigation.vue component.
  //xxx nme
  return testRequest.post(`investigations`, obj, {
    snackbar: COMMON_SNACKBAR
  })
}

export function cancelInvestigation(id) {
  return testRequest.put(
    `investigations/${id}/cancel`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function sendInvestigationWarningMessage(obj, id) {
  return testRequest.post(`investigations/${id}/actions-warning`, obj, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteInvestigationDetailsItem(obj, id) {
  return testRequest.post(`investigations/${id}/actions-delete`, obj, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteAndMessageInvestigationDetailsItem(obj, id) {
  return testRequest.post(`investigations/${id}/actions-delete-and-notify`, obj, {
    snackbar: COMMON_SNACKBAR
  })
}

export function investigationDetails(id, userId) {
  return webRequest.get(`CommunityInner/NotificationSettings?userId=${userId}&communityId=${id}`)
}

export function InvestigationGroups() {
  return webRequest.get(
    `CompanyInner/GetBusinessCategories?companyId=${localStorage.getItem('companyId')}`
  )
}

export function getStatsAndMenuDataFunction(id) {
  return testRequest.get(`investigations/${id}/summary`)
}

export function getInvestigationDetailsDataFunction(id) {
  return testRequest.get(`investigations/${id}`)
}

export function investigationDetailsListFunction(obj, id) {
  return testRequest.post(`investigations/${id}/search-email`, obj)
}

export function investigationDetailsTargetUsersListFunction(obj, id) {
  return testRequest.post(`investigations/${id}/search-user`, obj)
}

export function irSummary() {
  return testRequest.get(`ir/dashboard/summary`)
}

export function getInvestigationScanTypes() {
  return testRequest.get('/investigations/scan-types')
}
