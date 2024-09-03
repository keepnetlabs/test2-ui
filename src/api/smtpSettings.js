import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const URL = '/companies/smtp-settings'
export function searchSmtpSettings(payload = {}) {
  return testRequest.post(`${URL}/search`, payload)
}

export function deleteSmtpSettings(id) {
  return testRequest.delete(`${URL}/${id}`, { loading: true, snackbar: COMMON_SNACKBAR })
}

export function createSMTPSettings(payload) {
  return testRequest.post(`/companies/smtp-settings`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function getSmtpSettings(resourceId) {
  return testRequest.get(`/companies/smtp-settings/${resourceId}`)
}

export function updateSmtpSettings(payload) {
  return testRequest.put(`${URL}/${payload.resourceId}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function exportSmtpSettings(payload) {
  return testRequest.post(`${URL}/search/export`, payload, { responseType: 'blob' })
}

export function searchAvailableFor(payload = {}) {
  return testRequest.post('/available-for/search', payload)
}

export function testSmtpConnection(payload = {}, resourceId = '') {
  return testRequest.post(`/companies/smtp-settings/${resourceId}/test`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function testConnectionWhenSmtpCreated(payload = {}) {
  return testRequest.post(`/companies/smtp-settings/test`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
