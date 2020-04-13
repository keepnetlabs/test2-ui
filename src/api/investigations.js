import testRequest from '../utils/testRequest'
export function investigationList(obj) {
  return testRequest.post(`investigation/search`, obj)
  //`CompanyInner/GetBusinessCategories?companyId=${localStorage.getItem('companyId')}`
}
export function cancelInvestigation(id) {
  return webRequest.get(`CommunityInner/ListByCompanyId?pageNumber=1&pageSize=100&companyId=${id}`)
}
export function investigationDetails(id, userId) {
  return webRequest.get(`CommunityInner/NotificationSettings?userId=${userId}&communityId=${id}`)
}
export function createInvestigation(obj) {
  return webRequest.post(`CommunityInner/NotificationSettings`, obj)
}
export function InvestigationGroups() {
  return webRequest.get(
    `CompanyInner/GetBusinessCategories?companyId=${localStorage.getItem('companyId')}`
  )
}
