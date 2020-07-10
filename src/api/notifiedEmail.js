import testRequest from '../utils/testRequest'
const API_URL = 'notified-emails'
export function getNotifiedEmail(id) {
  return testRequest.get(`${API_URL}/${id}`)
}
export function downloadAttachment(attachmentId) {
  return testRequest.get(`/notified-emails/attachments/${attachmentId}`, {
    type: 'blob'
  })
}

export function getAnalysisEngineTypes() {
  return testRequest.get(`analysis-engines/types`)
}

export function exportNotifiedEmails(payload) {
  return testRequest.post(`/notified-emails/search/export`, payload, {
    responseType: 'blob'
  })
}

export function downloadMsgFiles(id, zipPassword) {
  return testRequest.get(`/notified-emails/msg-files/${id}?zipPassword=${zipPassword}`, {
    responseType: 'blob'
  })
}
