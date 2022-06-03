import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getLDAPSettingDetailForMyCompany() {
  return testRequest.get('/ldap-setting/detail')
}
export function testLDAPConnection(payload) {
  return testRequest.post('/ldap-setting/test-connection', payload)
}

export function createLDAPSetting(payload) {
  return testRequest.post('/ldap-setting', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateLDAPSetting(payload, resourceId) {
  return testRequest.put(`/ldap-setting/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function searchLDAPSchedule(payload) {
  return testRequest.post(`/ldap-schedule/search`, payload)
}

export function getLDAPFields() {
  return testRequest.get('/ldap-fields')
}

export function searchADUsers(payload) {
  return testRequest.post('/active-directory/users', payload)
}

export function searchADGroups(payload) {
  return testRequest.post('/active-directory/groups', payload)
}

export function getTargetGroupsForLDAP() {
  return testRequest.get('/ldap-setting/target-groups')
}

export function createLDAPMapping(payload) {
  return testRequest.post('/ldap-setting/mapping', payload)
}

export function checkLDAPMappingStatus(resourceId) {
  return testRequest.get(`/ldap-setting/status/${resourceId}`)
}
export function searchTmpTargetUsersForLdap(payload, transactionId) {
  return testRequest.post(`/target-users/${transactionId}/search`, payload)
}

export function createLDAPConfig(payload) {
  return testRequest.post('/ldap-config', payload)
}

export function getLDAPConfigJobs(id) {
  return testRequest.get(`ldap-schedule/jobs/${id}`)
}
export function updateLDAPSchedule(payload, resourceId) {
  return testRequest.put(`/ldap-schedule/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function getLDAPConfigDetail(resourceId) {
  return testRequest.get(`ldap-schedule/${resourceId}`)
}

export function deleteLDAPSchedule(resourceId) {
  return testRequest.delete(`/ldap-schedule/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export default {
  getLDAPSettingDetailForMyCompany,
  testLDAPConnection,
  createLDAPSetting,
  updateLDAPSetting,
  searchLDAPSchedule,
  getLDAPFields,
  searchADUsers,
  searchADGroups,
  getTargetGroupsForLDAP,
  createLDAPMapping,
  checkLDAPMappingStatus,
  searchTmpTargetUsersForLdap,
  createLDAPConfig,
  getLDAPConfigJobs,
  updateLDAPSchedule,
  deleteLDAPSchedule,
  getLDAPConfigDetail
}
