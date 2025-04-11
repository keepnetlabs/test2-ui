import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getGoogleAuthorizeLink() {
  return testRequest.get('/googleoauth/authorize')
}
export function submitGoogleUserProvisioningInformation({ code, state }) {
  return testRequest.get(`/googleoauth/callback?Code=${code}&State=${state}`)
}
export function unlinkGoogleUserProvisioning() {
  return testRequest.delete(`/googleoauth/revoke`, {
    snackbar: COMMON_SNACKBAR
  })
}
export function getGoogleUserProvisioning() {
  return testRequest.get('/google-user-provisioning')
}
export function getGoogleUserProvisioningGroups() {
  return testRequest.get('/google-user-provisioning/group')
}
export function getGoogleUserProvisioningOrganizationUnits() {
  return testRequest.get('/google-user-provisioning/orgunit')
}
export function syncGoogleUserProvisioning(payload) {
  return testRequest.post(`/google-user-provisioning/sync`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function manuallySyncGoogleUserProvisioning(payload) {
  return testRequest.post(`/google-user-provisioning/sync-now`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function stopSyncGoogleUserProvisioning(payload) {
  return testRequest.post(`/google-user-provisioning/sync-stop`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
