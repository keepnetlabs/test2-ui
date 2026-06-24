import testRequest from '../utils/testRequest'
const API_URL = 'notified-emails'
export function getNotifiedEmail(id, loading = false) {
  return testRequest.get(`${API_URL}/${id}`, { loading })
}
export function getNotifiedEmailForEdit(id, loading = false) {
  return testRequest.get(`${API_URL}/for-edit/${id}`, { loading })
}
export function getNotifiedEmailAiAnalysis(id, loading = false) {
  return testRequest.get(`${API_URL}/${id}/ai-analysis`, { loading })
}
export function reAnalyzeNotifiedEmailAiAnalysis(id, loading = false) {
  return testRequest.post(`${API_URL}/${id}/ai-analysis/re-analyze`, {}, { loading })
}
export function downloadAttachment(payload) {
  return testRequest.post(`/notified-emails/attachments`, payload, {
    responseType: 'blob'
  })
}

export function exportNotifiedEmails(payload) {
  return testRequest.post(`/notified-emails/search/export`, payload, {
    responseType: 'blob'
  })
}

export function downloadMsgFiles(payload) {
  return testRequest.post(`/notified-emails/msg-files`, payload, {
    responseType: 'blob'
  })
}
