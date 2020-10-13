import testRequest from '../utils/testRequest'
import webRequest from '../utils/webRequests'
import request from '../utils/request'
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
  return testRequest.post(`communities/${id}/join`, {})
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

export function updateCommunity(id, payload) {
  return testRequest.put(`communities/${id}`, payload)
}

export function updateCommunityPost(id, payload) {
  return testRequest.put(`community-posts/${id}`, payload)
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

export function listThreatCategories() {
  return testRequest.get(`lookups/9`)
}

export function getIncidentList(payload) {
  return testRequest.post(`community-posts/search`, payload)
}

export function getCOmmunityIncidentList(id, payload) {
  return testRequest.post(`community-posts/search/${id}`, payload)
}

export function getComments(id) {
  return testRequest.get(`community-posts/${id}/comments`)
}

export function createComments(id, payload) {
  return testRequest.post(`community-posts/${id}/comments`, payload)
}

export function likePost(id) {
  return testRequest.post(`community-posts/${id}/like`, {})
}

export function getCommunityPost(id) {
  return testRequest.get(`community-posts/${id}`)
}

export function getMyLastPosts() {
  return testRequest.get(`community-posts/my-last-posts`)
}

export function getMyTopPosts() {
  return testRequest.get(`community-posts/top-posts`, {})
}

export function getInvitations() {
  return testRequest.get(`communities/my-invitations`, {})
}

export function getsuggestedCommunities() {
  return testRequest.get(`/communities/suggested`, {
    headers: {
      'X-IR-COMPANY-ID': localStorage.getItem('companyRequestId')
    }
  })
}

export function createCommunityPost(payload) {
  return testRequest.post(`community-posts`, payload)
}

export function systemUser(systemUserData) {
  return testRequest.post('system-users', systemUserData)
}

export function deleteCommunityPost(id) {
  return testRequest.delete(`community-posts/${id}`)
}
export function updateComments(id, payload) {
  return testRequest.put(`community-posts/comments/${id}`, payload)
}
export function deleteComments(id) {
  return testRequest.delete(`community-posts/comments/${id}`)
}

export function removeFromCommunities(id) {
  return testRequest.post(`communities/${id}/leave`)
}

export function removeFromCommunity(id, value) {
  return testRequest.delete(`communities/${id}/remove-member`, {
    data: { RemovedCompanyResourceId: value }
  })
}

export function inviteToCommunity(id, payload) {
  return testRequest.post(`communities/${id}/invite`, payload)
}

export function appointNewOwner(id, payload) {
  return testRequest.post(`communities/${id}/appoint-owner`, payload)
}

export function acceptInvitation(id) {
  return testRequest.put(`/communities/invitations/${id}/accept`)
}

export function refuseInvitation(id) {
  return testRequest.put(`/communities/invitations/${id}/decline`)
}

export function getInvitationCount() {
  return testRequest.get(`communities/my-invitations-count`, {})
}

export function cancelRequest(id) {
  return testRequest.put(`/communities/membershiprequest/${id}/cancel`)
}

export function deleteCommunity(id) {
  return testRequest.delete(`communities/${id}`)
}

export function shareAPost(id, payload) {
  return testRequest.post(`community-posts/${id}/share`, payload)
}
