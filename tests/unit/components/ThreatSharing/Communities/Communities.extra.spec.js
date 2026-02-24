import Communities from '@/components/ThreatSharing/Communities/Communities.vue'

describe('Communities.vue (branch coverage)', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  it('setNotificationModal assigns selected community and opens modal', () => {
    const ctx = {
      selectedCommunityResourceId: null,
      openNotificationModal: false
    }

    Communities.methods.setNotificationModal.call(ctx, 'community-1')

    expect(ctx.selectedCommunityResourceId).toBe('community-1')
    expect(ctx.openNotificationModal).toBe(true)
  })

  it('isOwnerOrMember returns true only for owner/member statuses', () => {
    expect(Communities.methods.isOwnerOrMember.call({}, { membershipStatusId: 1 })).toBe(true)
    expect(Communities.methods.isOwnerOrMember.call({}, { membershipStatusId: 2 })).toBe(true)
    expect(Communities.methods.isOwnerOrMember.call({}, { membershipStatusId: 3 })).toBe(false)
  })

  it('getCommunityPayload builds payload with search reset and selected filters', () => {
    const ctx = {
      page: 4,
      itemsPerPage: 10,
      filter: 'phishing',
      industryValue: [{ resourceId: 'ind-1' }, { resourceId: 'ind-2' }],
      privacyValue: [1, 3]
    }

    const searchPayload = Communities.methods.getCommunityPayload.call(ctx, true)
    const regularPayload = Communities.methods.getCommunityPayload.call(ctx, false)

    expect(searchPayload.pageNumber).toBe(1)
    expect(regularPayload.pageNumber).toBe(4)
    expect(regularPayload.pageSize).toBe(10)
    expect(regularPayload.orderBy).toBe('createTime')
    expect(regularPayload.ascending).toBe(false)
    expect(regularPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('phishing')
    expect(regularPayload.filter.FilterGroups[1].FilterItems[0].Value).toBe('ind-1,ind-2')
    expect(regularPayload.filter.FilterGroups[2].FilterItems[0].Value).toBe('1,3')
  })

  it('deleteCommunity stores dialog data and opens delete modal', () => {
    const ctx = {
      deleteCommunityName: null,
      deleteCommunityId: null,
      isWantToDelete: false
    }

    Communities.methods.deleteCommunity.call(ctx, {
      communityName: 'Blue Team',
      communityResourceId: 'comm-1'
    })

    expect(ctx.deleteCommunityName).toBe('Blue Team')
    expect(ctx.deleteCommunityId).toBe('comm-1')
    expect(ctx.isWantToDelete).toBe(true)
  })

  it('leaveFromCommunity stores target and opens leave modal', () => {
    const ctx = {
      leaveCommunityId: null,
      leaveCommunityName: null,
      isWantToToLeaveFromCommunity: false
    }

    Communities.methods.leaveFromCommunity.call(ctx, {
      communityResourceId: 'comm-2',
      communityName: 'Red Team'
    })

    expect(ctx.leaveCommunityId).toBe('comm-2')
    expect(ctx.leaveCommunityName).toBe('Red Team')
    expect(ctx.isWantToToLeaveFromCommunity).toBe(true)
  })

  it('setCommunitiesAndIncidentsToStore dispatches both store actions', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }
    const communitiesData = { tableData: [{ id: 1 }] }
    const incidentsData = { tableData: [{ id: 2 }] }

    Communities.methods.setCommunitiesAndIncidentsToStore.call(ctx, communitiesData, incidentsData)

    expect(dispatch).toHaveBeenNthCalledWith(1, 'communities/setCommunities', {
      key: 'communities',
      communitiesData
    })
    expect(dispatch).toHaveBeenNthCalledWith(2, 'incidents/setIncidents', {
      key: 'incidents',
      incidentsData
    })
  })

  it('updateCommunities routes calls based on selected tab', () => {
    const baseCtx = {
      isLoadState: false,
      $route: { params: { isCommunity: true } },
      getMyCommunitiesListData: jest.fn(),
      getAllCommunitiesListData: jest.fn(),
      getInvitions: jest.fn()
    }

    const tab0Ctx = { ...baseCtx, selectedTab: 'tab-0', $route: { params: { isCommunity: true } } }
    Communities.methods.updateCommunities.call(tab0Ctx)
    expect(tab0Ctx.$route.params.isCommunity).toBe(false)
    expect(tab0Ctx.getMyCommunitiesListData).toHaveBeenCalledWith(true)

    const tab1Ctx = { ...baseCtx, selectedTab: 'tab-1', $route: { params: { isCommunity: true } } }
    Communities.methods.updateCommunities.call(tab1Ctx)
    expect(tab1Ctx.$route.params.isCommunity).toBe(false)
    expect(tab1Ctx.getAllCommunitiesListData).toHaveBeenCalledWith(true)

    const tab2Ctx = {
      ...baseCtx,
      selectedTab: 'tab-2',
      $route: { params: { isCommunity: true } },
      getInvitions: jest.fn()
    }
    Communities.methods.updateCommunities.call(tab2Ctx)
    expect(tab2Ctx.getInvitions).toHaveBeenCalled()
  })

  it('subTabSelected switches tab and triggers corresponding data loaders', () => {
    const ctx = {
      isLoadState: false,
      selectedTab: 'tab-1',
      page: 5,
      filter: 'abc',
      industryValue: [{ resourceId: 'x' }],
      privacyValue: [2],
      $route: { params: { isCommunity: true } },
      getMyCommunitiesListData: jest.fn(),
      getAllCommunitiesListData: jest.fn(),
      getInvitions: jest.fn(),
      getInvitationCount: jest.fn()
    }

    Communities.methods.subTabSelected.call(ctx, 'Your Communities')
    expect(ctx.selectedTab).toBe('tab-0')
    expect(ctx.page).toBe(1)
    expect(ctx.getMyCommunitiesListData).toHaveBeenCalled()

    Communities.methods.subTabSelected.call(ctx, 'All')
    expect(ctx.selectedTab).toBe('tab-1')
    expect(ctx.page).toBe(1)
    expect(ctx.getAllCommunitiesListData).toHaveBeenCalled()

    Communities.methods.subTabSelected.call(ctx, 'Invitations')
    expect(ctx.selectedTab).toBe('tab-2')
    expect(ctx.page).toBe(1)
    expect(ctx.filter).toBe('')
    expect(ctx.industryValue).toEqual([])
    expect(ctx.privacyValue).toEqual([])
    expect(ctx.getInvitions).toHaveBeenCalled()
    expect(ctx.getInvitationCount).toHaveBeenCalled()
  })

  it('communityDetails navigates and stores data when user is owner/member', () => {
    const push = jest.fn()
    const setCommunitiesAndIncidentsToStore = jest.fn()
    const ctx = {
      selectedTab: 'tab-1',
      invitationData: [],
      listData: [{ id: 1 }],
      filter: 'x',
      industryValue: [],
      privacyValue: [],
      page: 1,
      totalNumberOfRecords: 5,
      totalNumberOfPages: 1,
      itemsPerPage: 5,
      setCommunitiesAndIncidentsToStore,
      $router: { push }
    }

    Communities.methods.communityDetails.call(ctx, {
      membershipStatusId: 1,
      communityName: 'Blue Team',
      communityResourceId: 'comm-99'
    })

    expect(setCommunitiesAndIncidentsToStore).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith({
      name: 'Community',
      params: {
        id: 'comm-99',
        item: {
          membershipStatusId: 1,
          communityName: 'Blue Team',
          communityResourceId: 'comm-99'
        },
        communityName: 'Blue Team'
      }
    })
    expect(localStorage.getItem('communityName')).toBe('Blue Team')
    expect(localStorage.getItem('communityResourceIdForRedirect')).toBe('comm-99')
  })

  it('communityDetails does not navigate when user is neither owner nor member', () => {
    const push = jest.fn()
    const setCommunitiesAndIncidentsToStore = jest.fn()
    const ctx = {
      selectedTab: 'tab-1',
      invitationData: [],
      listData: [],
      filter: '',
      industryValue: [],
      privacyValue: [],
      page: 1,
      totalNumberOfRecords: 0,
      totalNumberOfPages: 0,
      itemsPerPage: 5,
      setCommunitiesAndIncidentsToStore,
      $router: { push }
    }

    Communities.methods.communityDetails.call(ctx, {
      membershipStatusId: 3,
      communityName: 'External',
      communityResourceId: 'comm-11'
    })

    expect(setCommunitiesAndIncidentsToStore).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
    expect(localStorage.getItem('isCommunityOwner')).toBe('member')
  })
})
