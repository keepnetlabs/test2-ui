import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import router from '../../router/index'
import {
  listCommunities,
  listNotifications,
  saveNotifications,
  listCommunitiesByCompany,
  listBusinessCategories,
  saveNewCommunity,
  leaveFromCommun,
  deleteTheCommun,
  getCommunityMembers,
  inviteMembersToCommunity,
  updateTheCommunity,
  listSuggestedCommunities,
  fetchCommunityInfo,
  joinTheCommunity,
  listMemberRequests,
  acceptRequest,
  declineRequest,
  deleteCompanyFromCommunities,
  listRequestsCompany,
  listIncidents,
  fetchIncident,
  publishIncident,
  listCommunityPosts,
  fetchPostDetail,
  likeThePost,
  unlikeThePost,
  addTheComment,
  fetchTopPosts,
  fetchYourPosts,
  deletePost,
  checkCommunName,
  fetchInvitations,
  acceptInvitation,
  refuseInvitation,
  checkShareMail,
  shareIncidentsWithMails
} from '../../api/threadSharing'

const threadSharing = {
  namespaced: true,
  state: {
    communityList: [],
    myCommunities: [],
    selectedCommunity: {
      id: null,
      name: '',
      description: '',
      industry: '',
      privacy: false,
      communityCompanyId: null
    },
    fetchedCommunity: {
      status: false,
      BusinessCategory: [
        {
          ACount: null,
          Committed: false,
          IDESC: null,
          IKEY: null,
          INFOID: null,
          ITYPE: null
        }
      ],
      BusinessCategoryText: '',
      CommunityCompany: [
        {
          CommunityCompanyRelationId: '',
          CommunityId: '',
          CommunityName: null,
          CompanyId: '',
          CompanyName: '',
          CreateDate: '',
          CreateUserId: '',
          IsActive: false,
          LogoPath: null,
          ModifyDate: '',
          ModifyUserId: '',
          PostCount: 0,
          UserCount: 0
        }
      ],
      CommunityId: '',
      CreateDate: '',
      CreateUserId: '',
      Description: '',
      IncidentCount: null,
      IsActive: false,
      IsPrivate: false,
      MemberCount: null,
      ModifyDate: null,
      ModifyUserId: null,
      Name: ''
    },
    notifications: {
      IsDashboardEnabled: false,
      IsEmailEnabled: false,
      IsWhatsappEnabled: false,
      CommunityId: '',
      UserId: ''
    },
    businessCategories: [],
    suggestedCommunities: [],
    members: [],
    memberRequests: [],
    isWantToPostIncident: false,
    isWantToInvestigate: false,
    isWantToShareIncident: false,
    incident: {},
    requests: [],
    uploadResponse: {},
    listedIncidents: [],
    selectedIncident: {},
    communityPosts: [],
    postDetail: {},
    topPosts: [],
    yourPosts: [],
    postCollapses: [],
    invites: [],
    isMobileInfoVisible: false,
    communNameAvailable: false,
    invitations: [],
    communityLength: null,
    incidentEditMode: false,
    shareMails: [],
    postCreatorId: null
  },
  getters: {
    communityGetter: state => state.communityList,
    myCommunitiesGetter: state => state.myCommunities,
    communLengthGetter: state => state.communityLength,
    notificationGetter: state => state.notifications,
    businessCategoryGetter: state => state.businessCategories,
    selectedCommunityGetter: state => state.selectedCommunity,
    membersGetter: state => state.members,
    suggestedCommunGetter: state => state.suggestedCommunities,
    fetchedCommunGetter: state => state.fetchedCommunity,
    memberRequestsGetter: state => state.memberRequests,
    incidentGetter: state => state.incident,
    requestsGetter: state => state.requests,
    uploadResponseGetter: state => state.uploadResponse,
    listedIncidentGetter: state => state.listedIncidents,
    selectedIncidentGetter: state => state.selectedIncident,
    postsGetter: state => state.communityPosts,
    postDetailGetter: state => state.postDetail,
    topPostsGetter: state => state.topPosts,
    yourPostsGetter: state => state.yourPosts,
    collapsesGetter: state => state.postCollapses,
    invitesGetter: state => state.invites,
    sharesGetter: state => state.shareMails,
    mobileVisibilityGetter: state => state.isMobileInfoVisible,
    communNameAvailableGetter: state => state.communNameAvailable,
    invitationsGetter: state => state.invitations
  },
  mutations: {
    SET_COMMUNITIES(state, payload) {
      state.communityList = payload
      state.communityLength = payload.Results.length
    },
    SET_MY_COMMUNITIES(state, payload) {
      state.myCommunities = payload
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notifications = payload
    },
    SET_BUSINESS_CATEGORIES(state, payload) {
      state.businessCategories = payload
    },
    SET_SELECTED_COMMUNITY(
      state,
      { id, name, description, industry, privacy, communityCompanyId }
    ) {
      state.selectedCommunity.id = id
      state.selectedCommunity.name = name
      state.selectedCommunity.description = description
      state.selectedCommunity.industry = industry
      state.selectedCommunity.privacy = privacy
      if (communityCompanyId) state.selectedCommunity.communityCompanyId = communityCompanyId
    },
    SET_MEMBERS(state, payload) {
      state.members = payload
    },
    SET_MEMBER_REQUESTS(state, reqs) {
      state.memberRequests = reqs
    },
    SET_SUGGESTED_COMMUNITIES(state, payload) {
      state.suggestedCommunities = payload
    },
    SET_FETCHED_COMMUNITY(state, obj) {
      state.fetchedCommunity = obj
      state.fetchedCommunity.status = true
    },
    SET_POSTED_INCIDENT(state, incident) {
      state.incident = incident
    },
    SET_REQUESTED_COMPANIES(state, requests) {
      state.requests = requests
    },
    SET_INCIDENT_OBJECT(state, uploadResponse) {
      state.uploadResponse = uploadResponse
    },
    SET_LISTED_INCIDENTS(state, incidents) {
      state.listedIncidents = incidents
    },
    SET_SELECTED_INCIDENT(state, incident) {
      state.selectedIncident = incident
    },
    SET_COMMUNITY_POSTS(state, posts) {
      state.communityPosts = posts
    },
    SET_POST_DETAIL(state, details) {
      state.postDetail = details
    },
    SET_TOP_POSTS(state, topPosts) {
      state.topPosts = topPosts
    },
    SET_YOUR_POSTS(state, yourPosts) {
      state.yourPosts = yourPosts
    },
    SET_COLLAPSES(state, collapses) {
      state.postCollapses = collapses
    },
    SET_INVITE_RESULTS(state, invites) {
      state.invites = invites
    },
    SET_MOBILE_INFO(state, bool) {
      state.isMobileInfoVisible = bool
    },
    SET_COMMUN_NAME(state, available) {
      state.communNameAvailable = available
    },
    SET_INVITATIONS(state, invitations) {
      state.invitations = invitations
    },
    SET_COLLAPSE_TO_INCIDENTS(state) {
      if (state.postCollapses && state.postCollapses.length) {
        let newArr = []
        for (let el of state.postCollapses) {
          newArr.push(false)
        }
        state.postCollapses = newArr
      }
    },
    SET_INCIDENT_EDIT_STATUS(state, bool) {
      state.incidentEditMode = bool
    },
    SET_SHARE_RESULTS(state, share) {
      share === 'delete' ? (state.shareMails = []) : state.shareMails.push(share)
    },
    SET_ALL_COLLAPSED(state, collapse) {
      state.postCollapses = []
    },
  },
  actions: {
    async getCommunities({ commit }, compId) {

      await listCommunities()
        .then(response => {
          const result = response.data
          commit('SET_COMMUNITIES', result)

        })
        .catch(() => {

          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
        })
      if (!compId) compId = localStorage.getItem('companyId')
      await listCommunitiesByCompany(compId)
        .then(response => {
          const result = response.data
          commit('SET_MY_COMMUNITIES', result)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
        })
    },
    async getNotifications({ commit }, id) {
      await listNotifications(id, localStorage.getItem('companyId'))
        .then(response => {
          const res = response.data
          commit('SET_NOTIFICATIONS', res)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Notifications could not fetch', { root: true })
        })
    },
    async saveNotifications({ commit, dispatch }, obj) {
      await saveNotifications(obj)
        .then(() => {
          commit('SET_NOTIFICATIONS', obj)
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Saved Succesfully', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when saving the notifications, try again.', {
            root: true
          })
        })
    },
    async getBusinessCategories({ commit }) {
      await listBusinessCategories().then(resp => {
        commit('SET_BUSINESS_CATEGORIES', resp.data)
      })
    },
    setSelectedCommunity(
      { commit },
      { id, name, description, industry, privacy, communityCompanyId }
    ) {
      commit('SET_SELECTED_COMMUNITY', {
        id,
        name,
        description,
        industry,
        privacy,
        communityCompanyId
      })
      localStorage.setItem('communityId', id)
      localStorage.setItem('communityName', name)
      localStorage.setItem('communityDesc', description)
      localStorage.setItem('communityCat', industry)
      localStorage.setItem('communityPrivacy', privacy)
      localStorage.setItem('communityCompanyId', communityCompanyId)
    },
    async createCommunity({ commit, dispatch }, obj) {
      await saveNewCommunity(obj)
        .then(resp => {
          const id = resp.data.Data.CommunityId
          const name = resp.data.Data.Name
          const description = resp.data.Data.Description
          const industry = resp.data.Data.BusinessCategoryText
          const privacy = resp.data.Data.IsPrivate
          const communityCompanyId = resp.data.Data.CommunityCompany[0].CompanyId
          dispatch('setSelectedCommunity', {
            id,
            name,
            description,
            industry,
            privacy,
            communityCompanyId
          })
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', `You created a new community “${name}“`, {
            root: true
          })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          setTimeout(function() {
            router.push('/community/' + name)
          }, 500)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when creating the community, try again.', {
            root: true
          })
        })
    },
    async leaveCommunity({ commit, dispatch }, { communityId, creatorId }) {
      const exitObj = {
        CommunityId: communityId,
        ModifyUserId: creatorId,
        CommunityCompany: [
          {
            CompanyId: localStorage.getItem('companyId')
          }
        ]
      }
      await leaveFromCommun(exitObj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Succesfully leaved from Community', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when leaving the community, try again.', {
            root: true
          })
        })
    },
    async deleteCommunity({ commit, dispatch }, { communityId, userId }) {
      const deleteObj = {
        CommunityId: communityId,
        ModifyUserId: userId,
        CompanyId: localStorage.getItem('companyId')
      }
      await deleteTheCommun(deleteObj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Community succesfully deleted.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when deleting the community, try again.', {
            root: true
          })
        })
    },
    updateCommunity({ commit, dispatch }, obj) {
      const updateObj = {
        CommunityId: obj.communityId,
        Name: obj.name,
        Description: obj.description,
        IsPrivate: obj.privacy,
        ModifyUserId: obj.userId,
        BusinessCategory: [
          {
            IKEY: obj.ikey
          }
        ],
        CommunityCompany: [
          {
            CompanyId: obj.companyId
          }
        ]
      }
      updateTheCommunity(updateObj)
        .then(resp => {
          const id = updateObj.CommunityId
          const name = updateObj.Name
          const description = updateObj.Description
          const industry = obj.industry
          const privacy = updateObj.IsPrivate
          const communityCompanyId = resp.data.CommunityCompany[0].CompanyId
          dispatch('setSelectedCommunity', {
            id,
            name,
            description,
            industry,
            privacy,
            communityCompanyId
          })
          dispatch('getCommunities')
          dispatch('getCommunityInfo')
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Community succesfully updated.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Community could not updated.', { root: true })
        })
    },
    async getMembers({ commit, getters }) {
      await getCommunityMembers(getters.selectedCommunityGetter.id)
        .then(response => {
          commit('SET_MEMBERS', response.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not fetch.', { root: true })
        })
    },
    async getMemberRequests({ commit }, communityId) {
      await listMemberRequests(communityId)
        .then(resp => {
          commit('SET_MEMBER_REQUESTS', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not fetch from the server', {
            root: true
          })
        })
    },
    async inviteMembers({ commit }, emailsArr) {
      await inviteMembersToCommunity(emailsArr)
        .then(resp => {
          if (resp.data.IsSuccess === false) {
            commit('SET_INVITE_RESULTS', resp.data.Data)
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', 'Members could not invited.', { root: true })
          } else {
            commit('SET_INVITE_RESULTS', ['success'])
          }
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not invited.', { root: true })
        })
    },
    async shareWithMails({ commit }, emailsArr) {
      await shareIncidentsWithMails(emailsArr)
        .then(resp => {
          if (resp.data.IsSuccess === false) {
            commit('SET_SHARE_RESULTS', resp.data.Data)
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', 'Can not share with all emails.', { root: true })
          } else {
            commit('SET_SHARE_RESULTS', 'delete')
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit(
              'common/SET_ERROR_MESSAGE',
              `The post successfully shared with ${emailsArr.length} users.`,
              {
                root: true
              }
            )
          }
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Can not share with all emails.', { root: true })
        })
    },
    async getSharedMailStatus({ commit }, mail) {
      await checkShareMail(mail)
        .then(resp => {
          commit('SET_SHARE_RESULTS', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when checking the email', { root: true })
        })
    },
    async getCommunityInfo({ commit }, param) {
      let communityId = null
      let companyId = null
      if (param && param.communityId) {
        communityId = param.communityId
        companyId = param.companyId
      } else {
        communityId = localStorage.getItem('communityId')
        companyId = localStorage.getItem('companyId')
      }
      await fetchCommunityInfo(communityId, companyId)
        .then(resp => {
          commit('SET_FETCHED_COMMUNITY', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Community info could not fetch.', { root: true })
        })
    },
    async getSuggestedCommunities({ commit }) {
      const id = localStorage.getItem('businessCatId')
      const compId = localStorage.getItem('companyId')
      if (!id || id == 'null') {
        return
      } else {
        await listSuggestedCommunities(id, compId)
          .then(resp => {
            commit('SET_SUGGESTED_COMMUNITIES', resp.data)
          })
          .catch(() => {
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', 'Suggested Communities could not fetch.', {
              root: true
            })
          })
      }
    },
    async joinCommunity({ commit, dispatch }, obj) {
      obj.CompanyId = localStorage.getItem('companyId')
      const privacy = obj.IsPrivate
      delete obj.IsPrivate
      await joinTheCommunity(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          if (privacy) {
            dispatch(
              'common/setErrorMessage',
              `Join Request successfully sent to  ${obj.CommunityName}`,
              { root: true }
            )
          } else {
            dispatch('common/setErrorMessage', `You joined ${obj.CommunityName}`, { root: true })
          }
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
          dispatch('getCommunityInfo')
          dispatch('getSuggestedCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Could not joined the Community.', { root: true })
        })
    },
    async acceptMemberRequest({ commit, dispatch }, obj) {
      await acceptRequest(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'The request is accepted.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You are not authorized for this action.', {
            root: true
          })
        })
    },
    async declineMemberRequest({ commit, dispatch }, obj) {
      await declineRequest(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'The request is declined.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You are not authorized for this action.', {
            root: true
          })
        })
    },
    investigationStarted({ commit, dispatch }) {
      dispatch('common/setSnackStatus', true, { root: true })
      dispatch('common/setErrorMessage', 'The Investigation has started.', { root: true })
      commit('common/SET_SNACKBAR_COLOR', '#43a047', { root: true })
    },
    postIncident({ commit, dispatch }, incident) {
      dispatch('common/setSnackStatus', true, { root: true })
      dispatch('common/setErrorMessage', 'The Incident posted successfully.', { root: true })
      commit('common/SET_SNACKBAR_COLOR', '#43a047', { root: true })
      commit('SET_POSTED_INCIDENT', incident)
    },
    async deleteCompFromCommunity({ commit, dispatch }, obj) {
      await deleteCompanyFromCommunities(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch(
            'common/setErrorMessage',
            'The Company successfully removed from your community',
            { root: true }
          )
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'There was an error while removing the Company', {
            root: true
          })
        })
    },
    async getRequestsCompany({ commit }, id) {
      await listRequestsCompany(id)
        .then(resp => {
          commit('SET_REQUESTED_COMPANIES', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit(
            'common/SET_ERROR_MESSAGE',
            'There was an error while fetching the Requested Communities',
            {
              root: true
            }
          )
        })
    },
    async postAnIncident({ commit }, postObj) {
      if (!postObj) {
        commit('SET_INCIDENT_OBJECT', {})
      } else {
        var formData = new FormData()
        formData.append('Attachment', postObj.Attachment)
        formData.append('CommunityId', postObj.CommunityId)
        formData.append('CompanyId', postObj.CompanyId)
        formData.append('CreateUserId', postObj.CreateUserId)
        formData.append('CommunityPostId', postObj.CommunityPostId)
        // post incident id
        await axios
          .post(process.env.VUE_APP_WEB_API + '/CommunityPostInner/Add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${AuthenticationService.getToken()}`,
              companyId: localStorage.getItem('companyId'),
              CacheControl: 'no-cache'
            }
          })
          .then(resp => {
            commit('SET_INCIDENT_OBJECT', resp.data.Data)

          })
          .catch(error => {
            commit('SET_INCIDENT_OBJECT', error.response.data)
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            if (error.response.status === 400) {
              commit('common/SET_ERROR_MESSAGE', 'Unsupported file type!', {
                root: true
              })
            } else {
              commit('common/SET_ERROR_MESSAGE', 'Error occurred at file loading', {
                root: true
              })
            }
          })
      }
    },
    async fetchListedIncidents({ commit }, filter) {
      await listIncidents(localStorage.getItem('companyId'), filter || '')
        .then(resp => {
          commit('SET_LISTED_INCIDENTS', resp.data)
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async getIncident({ commit }, mailId) {

      await fetchIncident(
        localStorage.getItem('companyId'),
        localStorage.getItem('communityId'),
        mailId,
        localStorage.getItem('userId')
      )
        .then(resp => {
          commit('SET_SELECTED_INCIDENT', resp.data.Data)
          commit('SET_INCIDENT_OBJECT', resp.data.Data)
          if (!resp.data || resp.data == null) {
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_MESSAGE', "The incident's mail can not found", {
              root: true
            })

          }
        })
        .catch(error => {

          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', "The incident's mail can not found", {
            root: true
          })
        })
    },
    async publishPostIncident({ commit, dispatch, state }, obj) {

      await publishIncident(obj)
        .then(() => {

          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          if (state.incidentEditMode) {
            commit('common/SET_ERROR_MESSAGE', `Post “${obj.Title}” edited successfully`, {
              root: true
            })
          } else {
            commit('common/SET_ERROR_MESSAGE', `You posted “${obj.Title}” incident`, {
              root: true
            })
          }
          dispatch('fetchCommunityPosts', obj)
          commit('SET_INCIDENT_EDIT_STATUS', false)
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })

        })
    },
    async fetchCommunityPosts({ commit }, obj) {

      await listCommunityPosts(obj)
        .then(resp => {
          commit('SET_COMMUNITY_POSTS', resp.data)

        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })

        })
    },
    async getPostDetail({ commit }, obj) {

      await fetchPostDetail(obj)
        .then(resp => {
          commit('SET_POST_DETAIL', resp.data)

        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })

        })
    },
    async likePost({ commit, dispatch }, obj) {
      await likeThePost(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You liked the post', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async unlikePost({ dispatch, commit }, obj) {
      await unlikeThePost(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You unliked the post', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async addComment({ dispatch, commit }, obj) {
      await addTheComment(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Your comment successfully saved', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async getTopPosts({ commit }, obj) {
      await fetchTopPosts(obj).then(resp => {
        commit('SET_TOP_POSTS', resp.data)
      })
    },
    async getYourPosts({ commit }, obj) {
      await fetchYourPosts(obj).then(resp => {
        commit('SET_YOUR_POSTS', resp.data)
      })
    },
    async deleteTheIncident({ dispatch, commit }, obj) {
      await deletePost(obj)
        .then(() => {
          const fetchObj = {
            communId: '',
            companyId: obj.CompanyId
          }
          if (router.currentRoute && router.currentRoute.name === 'Community') {
            fetchObj.communId = localStorage.getItem('communityId')
          }
          dispatch('fetchCommunityPosts', fetchObj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', `You have deleted a post ”${obj.PostName}”`, {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async checkName({ commit }, name) {
      await checkCommunName(name).then(resp => {
        commit('SET_COMMUN_NAME', resp.data)
      })
    },
    async getInvitions({ commit, state }, compId) {
      if (!compId)
        compId =
          state.fetchedCommunity.CommunityCompany[0].CompanyId || localStorage.getItem('companyId')
      await fetchInvitations(name)
        .then(resp => {
          commit('SET_INVITATIONS', resp.data.Data)
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async setAcceptInvitation({ commit }, accObj) {
      await acceptInvitation(accObj)
        .then(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Invitation accepted', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async setRefuseInvitation({ commit }, refuseObj) {
      await refuseInvitation(refuseObj)
        .then(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Invitation refused', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    }
  }
}

export default threadSharing
