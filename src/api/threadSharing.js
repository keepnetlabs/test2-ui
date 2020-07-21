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

export function updateCommunity(id, payload) {
  return testRequest.put(`communities/${id}`, payload)
}

export function updateCommunityPost(id, payload) {
  return testRequest.put(`}/community-posts/${id}`, payload, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
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
  return testRequest.post(`community-posts/search`, payload, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function getCOmmunityIncidentList(id, payload) {
  return testRequest.post(`community-posts/search/${id}`, payload, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function getComments(id) {
  return testRequest.get(`community-posts/${id}/comments`, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function createComments(id, payload) {
  return testRequest.post(`community-posts/${id}/comments`, payload, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function likePost(id) {
  return testRequest.post(
    `community-posts/${id}/like`,
    {},
    {
      headers: {
        //'X-IR-USER-ID': localStorage.getItem('userId')
        'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
      }
    }
  )
}

export function getCommunityPost(id) {
  return testRequest.get(`community-posts/${id}`, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function getMyLastPosts() {
  return testRequest.get(`community-posts/my-last-posts`, {
    headers: {
      //'X-IR-USER-ID': localStorage.getItem('userId')
      'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function getMyTopPosts() {
  return testRequest.get(`community-posts/top-posts`, {})
}

export function getsuggestedCommunities() {
  return testRequest.get(`/communities/suggested`, {
    headers: {
      'X-IR-COMPANY-ID': 'TEST-COMPANY-2'
    }
  })
}

export function createCommunityPost(payload) {
  return testRequest.post(`community-posts`, payload, {
    headers: {
      'X-IR-USER-ID': localStorage.getItem('userId')
      //'X-IR-USER-ID': 'D776CD92-74BD-4813-A4D8-4EBF90F1191B'
    }
  })
}

export function systemUser(systemUserData) {
  return testRequest.post('system-users', systemUserData)
}
