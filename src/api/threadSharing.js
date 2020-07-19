import testRequest from '../utils/testRequest'
import webRequest from '../utils/webRequests'
const API_URL = 'analysis-engines'

export function deleteIntegration(id) {
  return testRequest.delete(`${API_URL}/${id}`)
}

export function getAllCommunityList(payload) {
  return testRequest.post(`communities/search/all`, payload)
}

export function getMyCommunityList(payload) {
  return testRequest.post(`communities/search/my`, payload)
}

export function joinCommunity(id) {
  return testRequest.post(`communities/${id}/join/`, {})
}

export function acceptCommunityMembershipRequest(id, payload) {
  return testRequest.put(`communities/membershiprequest/${id}/accept`, payload)
}

export function refuseCommunityMembershipRequest(id, payload) {
  return testRequest.put(`communities/membershiprequest/${id}/refuse`, payload)
}

export function getCommunityDetails(id) {
  return testRequest.get(`communities/${id}`)
}

export function getCommunityMembersRequest(id, payload) {
  return testRequest.post(`communities/${id}/membershiprequest`, payload)
}

export function getCommunityMembers(id, payload) {
  return testRequest.post(`communities/${id}/member`, payload)
}

export function createCommunity(payload) {
  return testRequest.post(`communities`, payload)
}

export function listBusinessCategories() {
  return testRequest.get(`lookups/2`)
}

export function searchNotifiedMail(payload) {
  return testRequest.post(`notified-emails/search`, payload)
}

export function getSelectedEmailPreview(id) {
  return testRequest.get(`/community-posts/notified-email-preview/${id}`)
}

export function uploadEmlOrMsg(file) {
  const formData = new FormData()
  formData.append('File', file)
  return testRequest.post(`community-posts/message-file-preview`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
