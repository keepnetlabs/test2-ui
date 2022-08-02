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


// export function exportPlaybookRules(payload) {
//   return emailThreatSimlatorRequest.post(`playbooks/search/export`, payload, {
//     responseType: 'blob'
//   })
// }
//
// export function createPlaybook(payload) {
//   return emailThreatSimlatorRequest.post('/playbooks', payload, {
//     snackbar: COMMON_SNACKBAR
//   })
// }
//
// export function getPlaybook(id) {
//   return emailThreatSimlatorRequest.get(`/playbooks/${id}`)
// }
//
// export function updatePlaybook(payload) {
//   return emailThreatSimlatorRequest.put(`/playbooks/${payload.resourceId}`, payload, {
//     snackbar: COMMON_SNACKBAR
//   })
// }
//
// export function deletePlaybookRule(id) {
//   return emailThreatSimlatorRequest.delete(`playbooks/${id}`, {
//     snackbar: COMMON_SNACKBAR
//   })
// }
//
// export function getAnalysisEngine(payload) {
//   return emailThreatSimlatorRequest.post('analysis-engines/search', payload)
// }
//
// export function getTargetUsers(payload) {
//   return emailThreatSimlatorRequest.post('target-users/search', payload)
// }
