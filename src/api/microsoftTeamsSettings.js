import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const companyResourceId =
  localStorage.getItem('companyRequestId') || localStorage.getItem('companyId')
export function getMicrosoftTeamsSettings() {
  return testRequest.post('/companies/teams-app/check', {
    companyResourceId
  })
}
export function getMicrosoftTeamsOboIntegrationLink() {
  return testRequest.post('/companies/teams-obo/authorize-link', {
    companyResourceId
  })
}
export function callMicrosoftTeamsOboCallback(code, state) {
  return testRequest.get(`/companies/teams-obo/callback?code=${code}&state=${state}`)
}
export function getMicrosoftTeamsAppAuthorizeLink() {
  return testRequest.post(`/companies/teams-app/authorize-link`, {
    companyResourceId
  })
}
export function callMicrosoftTeamsAppCallback(admin_consent, tenant, scope) {
  return testRequest.get(
    `/companies/teams-app/callback?admin_consent=${admin_consent}&tenant=${tenant}&scope=${scope}`
  )
}
export function disableMicrosoftTeamsIntegration() {
  return testRequest.delete(
    '/companies/teams-app/remove',
    {
      data:{
        companyResourceId
      },
      snackbar: COMMON_SNACKBAR
    }
  )
}
export function uploadMicrosoftTeamsSettings() {
  return testRequest.post(
    '/companies/teams-app/upload',
    {
      companyResourceId
    },
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
export function installMicrosoftTeamsAppToUsers () {
  return testRequest.post('/companies/teams-app/install-to-users', {
    companyResourceId
  },    
  {
    snackbar: COMMON_SNACKBAR
  })
}

export default {
  getMicrosoftTeamsSettings,
  getMicrosoftTeamsOboIntegrationLink,
  callMicrosoftTeamsOboCallback,
  callMicrosoftTeamsAppCallback,
  disableMicrosoftTeamsIntegration,
  uploadMicrosoftTeamsSettings,
  getMicrosoftTeamsAppAuthorizeLink,
  installMicrosoftTeamsAppToUsers
}
