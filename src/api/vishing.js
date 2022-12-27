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

export function deleteVishingCampaign(resourceId) {
  return vishingRequest.delete(`vishing-campaign/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateVishingCampaign(payload = {}, resourceId) {
  return vishingRequest.put(`/vishing-campaign/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createVishingCampaign(payload = {}) {
  return vishingRequest.post('/vishing-campaign', payload, {
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

export function getVishingCampaign(resourceId) {
  return vishingRequest.get(`/vishing-campaign/${resourceId}`)
}

export function getVishingReportSummary(resourceId = '') {
  return vishingRequest.get(`/vishing-report/${resourceId}`)
}

export function getVishingReportUsers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/users/search`, payload)
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
  return vishingRequest.post(`/vishing-report/${resourceId}/answered/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingReportDialedNumber(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/dialed-number/search`, payload)
}

export function exportVishingReportDialedNumbers(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/dialed-number/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingReportNoResponse(payload = {}, resourceId = '') {
  return vishingRequest.post(`/vishing-report/${resourceId}/no-response/search`, payload)
}

export function getPhoneNumbers() {
  return vishingRequest.get('/voice/phone-numbers')
}
