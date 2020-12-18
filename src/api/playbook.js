import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function searchPlaybook(payload) {
  return testRequest.post(`/playbooks/search`, payload)
}

export function exportPlaybookRules(payload) {
  return testRequest.post(`playbooks/search/export`, payload, {
    responseType: 'blob'
  })
}

export function createPlaybook(payload) {
  return testRequest.post('/playbooks', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getPlaybook(id) {
  return testRequest.get(`/playbooks/${id}`)
}

export function updatePlaybook(payload) {
  return testRequest.put(`/playbooks/${payload.resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deletePlaybookRule(id) {
  return testRequest.delete(`playbooks/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getAnalysisEngine(payload) {
  return testRequest.post('analysis-engines/search', payload)
}

export function getTargetUsers(payload) {
  return testRequest.post('target-users/search', payload)
}
