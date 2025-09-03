import testRequest from '../utils/testRequest'

export function getMicrosoftTeamsSettings() {
  return testRequest.get('/microsoft-teams-settings')
}
export function getMicrosoftTeamsIntegrationLink() {
  return testRequest.get('/microsoft-teams-integration-link')
}
export function disableMicrosoftTeamsIntegration() {
  return testRequest.delete('/microsoft-teams-integration')
}
export function saveMicrosoftTeamsSettings(botName) {
  return testRequest.post('/microsoft-teams-settings', { botName })
}
export default {
  getMicrosoftTeamsSettings,
  getMicrosoftTeamsIntegrationLink,
  disableMicrosoftTeamsIntegration,
  saveMicrosoftTeamsSettings
}
