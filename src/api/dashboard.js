import request from '../utils/request'
import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

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
  let payload = {
    pageNumber: 1,
    pageSize: 1000,
    orderBy: 'LicenseTypeName',
    ascending: true,
    filter: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'OR',
          FilterItems: [
            {
              FieldName: 'CompanyName',
              Operator: 'Contains',
              Value: ''
            },
            {
              FieldName: 'IndustryName',
              Operator: 'Contains',
              Value: ''
            },
            {
              FieldName: 'LicenseTypeName',
              Operator: 'Contains',
              Value: ''
            }
          ],
          FilterGroups: []
        }
      ]
    }
  }
  return testRequest.post('companies/search', payload, {
    headers: {
      'X-IR-API-KEY': APP_CONFIG.VUE_APP_API_KEY,
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function selectCompany(payload) {
  return testRequest.get(`companies/${localStorage.getItem('companyId')}`, { loading: true })
}

export function getMenus() {
  return request.get('user/menus')
}

export function logoutUser() {
  return testRequest.get('account/logout')
}

export function getOverallStats(payload) {
  return request.get(`company/overallscore/${payload}`)
}

export function notificationSeen(payload) {
  return request.post(`user/notification/${payload}/read`)
}

export function sendFeedback(payload) {
  return testRequest.post('feedback', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getNotifications(payload) {
  return request.post('/system-users/notification-setting', payload)
}

export function getNotifiedEmailsTrend(payload) {
  return testRequest.post('/dashboard/reported-email-trends', payload)
}

export function getAuditLogs(payload) {
  return testRequest.post('/audit-logs/search', payload)
}

export function exportAuditLog(payload = {}) {
  return testRequest.post('/audit-logs/search/export', payload, {
    responseType: 'blob'
  })
}
