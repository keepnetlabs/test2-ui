import emailThreatSimlatorRequest from '@/utils/emailThreatSimulatorRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function testApi(payload) {
  return emailThreatSimlatorRequest.post(`/demo/posts`, payload)
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
