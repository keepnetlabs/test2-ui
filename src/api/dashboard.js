import request from '../utils/request'

export function getPhishingCampaigns(payload) {
  return request.get(`campaign/summary/${payload}`)
}

export function getCompanyInformation() {
  return request.get('company/current')
}

export function getLastFiveCompaignsStats() {
  return request.get('campaign/last')
}

export function getDropdownCompanies() {
  return request.get('user/companies')
}

export function selectCompany(payload) {
  return request.post(`user/company/${payload.companyId}`)
}

export function getMenus() {
  return request.get('user/menus')
}

export function logoutUser() {
  return request.post('account/logout')
}

export function getOverallStats(payload) {
  return request.get(`company/overallscore/${payload}`)
}

export function notificationSeen(payload) {
  return request.post(`user/notification/${payload}/read`)
}

export function sendFeedback(payload) {
  return request.post('user/feedback', { Message: payload })
}

export function getNotifications() {
  return request.get('user/notifications')
}

export function getPermissions() {
  /*
  const user = getTokenSub()
  const token = getToken()

  return request.get(`https://localhost:44313/api/Permissions?userNameOrEmail=${user}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  */
}
