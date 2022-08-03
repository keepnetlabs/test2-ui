import emailThreatSimlatorRequest from '@/utils/emailThreatSimulatorRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getQuickScanList(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/search`, payload)
}
export function deleteQuickScanItem(id) {
  return emailThreatSimlatorRequest.delete(`/quick-scan/${id}`)
}
export function getValidateContinuousScan(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan/validate-continuous-scan`, payload)
}
export function getQuickScanCreate(payload) {
  return emailThreatSimlatorRequest.post(`/quick-scan`, payload)
}
export function getQuickScanById(id) {
  return emailThreatSimlatorRequest.get(`/quick-scan/${id}`)
}
export function getAttackVectorList(payload) {
  return emailThreatSimlatorRequest.post(`/plugin/search`, payload)
}
export function deleteAttackVectorItem(id) {
  return emailThreatSimlatorRequest.delete(`/plugin/${id}`)
}
export function getAttackVectorCreate(payload) {
  return emailThreatSimlatorRequest.post(`/plugin`, payload)
}
export function getAttackVectorById(id) {
  return emailThreatSimlatorRequest.get(`/plugin/${id}`)
}
