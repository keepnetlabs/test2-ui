import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const companyId = 3673
export function getMicrosoftTeamsSettings() {
  return testRequest.post('/companies/teams-app/check', {
    companyId
  })
}
export function getMicrosoftTeamsOboIntegrationLink() {
  return testRequest.post('/companies/teams-obo/authorize-link', {
    companyId
  })
}
export function callMicrosoftTeamsOboCallback(code, state) {
  return testRequest.get(`/companies/teams-obo/callback?code=${code}&state=${state}`)
}
export function getMicrosoftTeamsAppAuthorizeLink() {
  return testRequest.post(`/companies/teams-app/authorize-link`, {
    companyId
  })
}
export function callMicrosoftTeamsAppCallback(code, state) {
  return testRequest.get(`/companies/teams-app/callback?code=${code}&state=${state}`)
}
export function disableMicrosoftTeamsIntegration() {
  return testRequest.delete('/companies/teams-app/disable', {
    companyId
  })
}
export function uploadMicrosoftTeamsSettings() {
  return testRequest.post(
    '/companies/teams-app/settings',
    {
      companyId
    },
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
export default {
  getMicrosoftTeamsSettings,
  getMicrosoftTeamsOboIntegrationLink,
  callMicrosoftTeamsOboCallback,
  callMicrosoftTeamsAppCallback,
  disableMicrosoftTeamsIntegration,
  uploadMicrosoftTeamsSettings,
  getMicrosoftTeamsAppAuthorizeLink
}
