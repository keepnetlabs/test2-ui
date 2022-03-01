import webRequest from '../utils/webRequests'

export function listCommunities() {
  return webRequest.get(`CommunityInner/List?pageNumber=1&pageSize=100`)
}
export function listCommunitiesByCompany(id) {
  return webRequest.get(`CommunityInner/ListByCompanyId?pageNumber=1&pageSize=100&companyId=${id}`)
}
export function listNotifications(id, userId) {
  return webRequest.get(`CommunityInner/NotificationSettings?userId=${userId}&communityId=${id}`)
}
export function saveNotifications(obj) {
  return webRequest.post(`CommunityInner/NotificationSettings`, obj)
}
export function listBusinessCategories() {
  return webRequest.get(
    `CompanyInner/GetBusinessCategories?companyId=${localStorage.getItem('companyId')}`
  )
}
export function saveNewCommunity(obj) {
  return webRequest.post('CommunityInner/Create', obj)
}
export function updateTheCommunity(obj) {
  return webRequest.put('CommunityInner/Update', obj)
}
export function leaveFromCommun(obj) {
  return webRequest.post('CommunityInner/Exit', obj)
}
export function deleteTheCommun(obj) {
  return webRequest.delete('CommunityInner/Delete', {
    data: obj
  })
}
export function getCommunityMembers(id) {
  if (!id) {
    id = localStorage.getItem('communityId')
  }
  return webRequest.get(`CommunityInner/ListMembers?communityId=${id}`)
}
export function inviteMembersToCommunity(arr) {
  const compId = localStorage.getItem('companyId')
  return webRequest.post(`CommunityInner/InviteMember?companyId=${compId}`, arr)
}
export function listSuggestedCommunities(id, compId) {
  return webRequest.get(`CommunityInner/Suggested?businessCategoryId=${id}&companyId=${compId}`)
}
export function fetchCommunityInfo(communityId, companyId) {
  return webRequest.get(`CommunityInner/Get?communityId=${communityId}&companyId=${companyId}`)
}
export function joinTheCommunity(obj) {
  return webRequest.post(`CommunityInner/Join`, obj)
}
export function listMemberRequests(id) {
  return webRequest.get(`CommunityInner/ListMemberRequests?communityId=${id}`)
}
export function acceptRequest(obj) {
  return webRequest.post(`CommunityInner/AcceptMemberRequest`, obj)
}
export function declineRequest(obj) {
  return webRequest.post(`CommunityInner/RejectMemberRequest`, obj)
}
export function deleteCompanyFromCommunities(obj) {
  return webRequest.post(`CommunityInner/DeleteCompany`, obj)
}
export function listRequestsCompany() {
  return webRequest.get(`CommunityInner/ListRequestsCompany`)
}
export function listIncidents(companyId, filter) {
  return webRequest.get(`CommunityPostInner/ListIncident?companyId=${companyId}&filter=${filter}`)
}
export function fetchIncident(companyId, communId, mailId, createUserId) {
  return webRequest.get(
    `CommunityPostInner/GetIncident?companyId=${companyId}&communityId=${communId}&mailId=${mailId}&CreateUserId=${createUserId}`
  )
}
export function publishIncident(obj) {
  return webRequest.post(`CommunityPostInner/Update`, obj)
}
export function listCommunityPosts(obj) {
  if (obj && !obj.communId) obj.communId = ''
  if (obj && obj.CommunityId) obj.communId = obj.CommunityId
  if (obj && !obj.companyId) obj.companyId = localStorage.getItem('companyId')
  if (obj && obj.CompanyId) obj.companyId = obj.CompanyId
  return webRequest.get(
    `CommunityPostInner/List?CompanyId=${obj.companyId}&CommunityId=${obj.communId}`
  )
}
export function fetchPostDetail(obj) {
  return webRequest.get(
    `CommunityPostInner/Get?CompanyId=${obj.companyId}&CommunityPostId=${obj.communPostId}`
  )
}
export function likeThePost(obj) {
  return webRequest.post(`CommunityPostInner/Like`, {
    CommunityPostId: obj.communPostId,
    CreateUserId: obj.createUserId,
    CompanyId: obj.companyId,
    CommunityId: obj.communId
  })
}
export function unlikeThePost(obj) {
  return webRequest.post(`CommunityPostInner/UndoLike`, {
    CommunityPostId: obj.communPostId,
    CreateUserId: obj.createUserId,
    CompanyId: obj.companyId,
    CommunityId: obj.communId
  })
}
export function addTheComment(obj) {
  return webRequest.post(`CommunityPostInner/AddComment`, {
    CommunityPostId: obj.communPostId,
    Comment: obj.comment,
    CreateUserId: obj.createUserId,
    CompanyId: obj.companyId,
    CommunityId: obj.communId
  })
}
export function fetchTopPosts(compId) {
  if (!compId) compId = localStorage.getItem('companyId')
  return webRequest.get(`CommunityPostInner/Top?CompanyId=${compId}`)
}
export function fetchYourPosts(obj) {
  return webRequest.get(`CommunityPostInner/Your?CompanyId=${obj.compId}&UserId=${obj.userId}`)
}
export function deletePost(obj) {
  return webRequest.post(`CommunityPostInner/Delete`, obj)
}
export function checkCommunName(name) {
  return webRequest.get(`CommunityInner/NameControl?Name=${name}`)
}
export function fetchInvitations(compId) {
  if (!compId) compId = localStorage.getItem('companyId')
  return webRequest.get(`CommunityInner/GetCommunityInviteListsByCompany?CompanyId=${compId}`)
}
export function acceptInvitation(accObj) {
  return webRequest.post(`CommunityInner/AcceptInviteRequest`, accObj)
}
export function refuseInvitation(refuseObj) {
  return webRequest.post(`CommunityInner/RejectInviteRequest`, refuseObj)
}
export function checkShareMail(email) {
  return webRequest.get(`CommunityInner/EmailValidation?Email=${email}`)
}
export function shareIncidentsWithMails(shareArr) {
  return webRequest.post(`CommunityPostInner/SharePost`, shareArr)
}
export function checkCommunNameForUpdate(obj) {
  return webRequest.get(
    `CommunityInner/NameControlUpdate?Name=${obj.name}&communityId=${obj.communId}`
  )
}
