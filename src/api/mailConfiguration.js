import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function getMailConfigurationList(payload) {
  return testRequest.post(`/mail-configurations/search`, payload)
}

export function deleteO365(url) {
  return testRequest.delete(`mail-configurations/o365/${url}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function exportMailConfiguration(payload) {
  return testRequest.post(`/mail-configurations/search/export`, payload, {
    responseType: 'blob'
  })
}

export function createO365(payload) {
  return testRequest.post('mail-configurations/o365', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function updateO365(payload, url) {
  return testRequest.put(`mail-configurations/o365/${url}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function createEWS(payload) {
  return testRequest.post('mail-configurations/ews', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function updateEWS(payload, url) {
  return testRequest.put(`mail-configurations/ews/${url}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function checkApiConnectivity(payload) {
  return testRequest.post(`mail-configurations/o365/check-api-connectivity`, payload)
}

export function checkPrivileges(payload) {
  return testRequest.post(`mail-configurations/o365/check-privileges-access`, payload)
}

export function checkAllUsersAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-all-users-access`, payload)
}

export function checkEmailAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-email-access`, payload)
}

export function checkCreateNewCategory(payload) {
  return testRequest.post(`mail-configurations/o365/check-create-new-category`, payload)
}

export function checkUpdateCategory(payload) {
  return testRequest.post(`mail-configurations/o365/check-update-category`, payload)
}

export function checkDeleteEmail(payload) {
  return testRequest.post(`mail-configurations/o365/check-delete-email`, payload)
}

export function checkInboxAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-inbox-access`, payload)
}
export function checkApiConnectivityEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-api-connectivity`, payload)
}

export function checkPrivilegesEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-privileges-access`, payload)
}

export function checkInboxAccessEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-inbox-access`, payload)
}
export function checkEmailBodyAccessEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-email-body-access`, payload)
}
export function checkEmailHeaderAccessEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-email-header-access`, payload)
}
export function checkEmailMailFilterEWS(payload) {
  return testRequest.post(`mail-configurations/ews/check-mail-filter`, payload)
}

export function getExchangeVersions(payload = { typeName: 'Exchange Versions', typeidlist: [] }) {
  return testRequest.post(`lookups`, payload)
}

export function getO365MailData(id) {
  return testRequest.get(`mail-configurations/o365/${id}`, { loading: true })
}

export function getEWSMailData(id) {
  return testRequest.get(`mail-configurations/exchange/${id}`, { loading: true })
}

export function deleteEWS(url) {
  return testRequest.delete(`mail-configurations/ews/${url}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
