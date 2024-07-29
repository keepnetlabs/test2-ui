import vishingRequest from '../utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function exportVishingTemplates(payload = {}) {
  return vishingRequest.post(`/vishing-template/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingTemplate(resourceId = '') {
  return vishingRequest.get(`/vishing-template/${resourceId}`)
}

export function getVishingTemplates(payload = {}) {
  return vishingRequest.post('/vishing-template/search', payload)
}

export function deleteVishingTemplate(resourceId = '') {
  return vishingRequest.delete(`/vishing-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function bulkDeleteVishingTemplates(payload) {
  return vishingRequest.delete(`/vishing-template/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

export function getVishingTemplatePreview(resourceId = '') {
  return vishingRequest.get(`/vishing-template/preview/${resourceId}`)
}

export function exportVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}

export function getVishingTemplateLanguages() {
  return vishingRequest.get(`/vishing-template/language`)
}

export function updateVishingTemplate(resourceId = '', payload = {}) {
  return vishingRequest.put(`/vishing-template/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createVishingTemplate(payload = {}) {
  return vishingRequest.post(`/vishing-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search', payload)
}

export function getVishingCampaign(resourceId = '') {
  return vishingRequest.get(`/vishing-campaign/${resourceId}`)
}

export function createVishingCampaign(payload = {}) {
  return vishingRequest.post('/vishing-campaign', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateVishingCampaign(payload = {}, resourceId = '') {
  return vishingRequest.put(`/vishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteVishingCampaign(resourceId = '') {
  return vishingRequest.delete(`vishing-campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function stopVishingCampaign(resourceId = '') {
  return vishingRequest.put(
    `/vishing-campaign/stop/${resourceId}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function getVishingCampaignPreview(resourceId = '') {
  return vishingRequest.get(`/vishing-campaign/preview/${resourceId}`)
}

export function launchVishingCampaign(resourceId = '') {
  return vishingRequest.put(
    `/vishing-campaign/launch/${resourceId}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

export function getVishingCampaignDistributionCalculation(payload = {}) {
  return vishingRequest.post(`/vishing-campaign/calculate-distribution`, payload)
}

export function getVishingReportSummary(resourceId = '') {
  return vishingRequest.get(`/vishing-report/${resourceId}`)
}

export function getVishingReportUsers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/users/search`, payload)
}

export function getVishingReportUsersInteractions(payload = {}) {
  return vishingRequest.post(`/vishing-report/user/answer-detail`, payload)
}

export function exportVishingUsers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/users/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingReportAnswered(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/answered/search`, payload)
}

export function exportVishingAnsweredUsers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/answered/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingReportDialedNumber(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/dialed-number/search`, payload)
}

export function exportVishingReportDialedNumbers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/dialed-number/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingReportNoResponse(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/no-response/search`, payload)
}

export function exportVishingReportNoResponse(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/no-response/search/export`, payload, {
    responseType: 'blob'
  })
}

export function exportVishingReportSummary(resourceId = '') {
  return vishingRequest.get(`/vishing-report/${resourceId}/export`, {
    responseType: 'blob'
  })
}

export function resendVishingReport(resourceId = '', payload = {}) {
  return vishingRequest.post(`/vishing-report/resend/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getPhoneNumbers() {
  return vishingRequest.get('/voice/phone-numbers')
}

export function playTextToSpeech(payload = {}) {
  return vishingRequest.post('/vishing-template/language/get-voice-url', payload)
}
