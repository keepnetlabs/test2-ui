import ThreatSharing from '@/views/ThreatSharing.vue'

describe('ThreatSharing.vue', () => {
  const { methods } = ThreatSharing

  it('created sets tab to communities when incident permission is missing', () => {
    const ctx = {
      tab: 0,
      getCommunityPostsPermission: false
    }

    ThreatSharing.created.call(ctx)
    expect(ctx.tab).toBe(1)
  })

  it('created keeps current tab when incident permission exists', () => {
    const ctx = {
      tab: 0,
      getCommunityPostsPermission: true
    }

    ThreatSharing.created.call(ctx)
    expect(ctx.tab).toBe(0)
  })

  it('watch tab triggers getSelectedTabData', () => {
    const getSelectedTabData = jest.fn()
    const ctx = { getSelectedTabData }

    ThreatSharing.watch.tab.call(ctx)
    expect(getSelectedTabData).toHaveBeenCalledTimes(1)
  })

  it('beforeRouteEnter switches to communities for detailsId/isCommunity and redirects when no permissions', () => {
    const next = jest.fn()
    ThreatSharing.beforeRouteEnter(
      { query: { detailsId: 'd-1' }, params: {} },
      { name: 'Dashboard' },
      next
    )

    const vm = {
      $route: { query: { detailsId: 'd-1' }, params: {} },
      $router: { push: jest.fn() },
      getCommunityPostsPermission: false,
      getAllCommunitiesPermission: false,
      isLoadState: false,
      $store: { state: { incidents: { incidents: {} }, communities: { communities: {} }, tableReload: { tableReload: false } } }
    }
    const callback = next.mock.calls[0][0]
    callback(vm)

    expect(vm.tab).toBe(1)
    expect(vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('beforeRouteEnter handles showInvitation path and calls communities subtab selector', () => {
    jest.useFakeTimers()
    const next = jest.fn()
    ThreatSharing.beforeRouteEnter(
      { query: { showInvitation: true }, params: {} },
      { name: 'Dashboard' },
      next
    )

    const subTabSelected = jest.fn()
    const vm = {
      tab: 0,
      isLoadState: false,
      $route: { query: { showInvitation: true }, params: {} },
      $refs: { tsCommunities: { subTabSelected } },
      $router: { push: jest.fn() },
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: true,
      $store: { state: { incidents: { incidents: {} }, communities: { communities: {} }, tableReload: { tableReload: false } } }
    }
    const callback = next.mock.calls[0][0]
    callback(vm)
    jest.advanceTimersByTime(1250)

    expect(vm.tab).toBe(1)
    expect(subTabSelected).toHaveBeenCalledWith('tab-2')
    jest.useRealTimers()
  })

  it('beforeRouteEnter restores load state from store when returning from Community', () => {
    const next = jest.fn()
    ThreatSharing.beforeRouteEnter(
      { query: {}, params: {} },
      { name: 'Community' },
      next
    )

    const vm = {
      tab: 0,
      isLoadState: false,
      isTableReload: false,
      $route: { query: {}, params: {} },
      $router: { push: jest.fn() },
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: true,
      $store: {
        state: {
          incidents: { incidents: { incidentsData: null } },
          communities: { communities: { communitiesData: { rows: [1] } } },
          tableReload: { tableReload: true }
        }
      }
    }

    const callback = next.mock.calls[0][0]
    callback(vm)

    expect(vm.tab).toBe(1)
    expect(vm.isLoadState).toBe(true)
    expect(vm.isTableReload).toBe(true)
  })

  it('beforeRouteLeave blocks navigation for open modal states, otherwise allows', () => {
    const next = jest.fn()
    const onCancelClicked = jest.fn()
    const ctx1 = {
      isWantToAddNewCommunity: true,
      $refs: { refNewCommunity: { isSubmitted: false, onCancelClicked } }
    }
    ThreatSharing.beforeRouteLeave.call(ctx1, {}, {}, next)
    expect(onCancelClicked).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const checkIfCanCloseCommunityModal = jest.fn()
    const ctx2 = {
      isWantToAddNewCommunity: false,
      $refs: { tsCommunities: { isWantToAddNewCommunity: true, checkIfCanCloseCommunityModal } }
    }
    ThreatSharing.beforeRouteLeave.call(ctx2, {}, {}, next)
    expect(checkIfCanCloseCommunityModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const checkIfCanCloseIncidentModal = jest.fn()
    const ctx3 = {
      isWantToAddNewCommunity: false,
      $refs: { tsIncidents: { showPostIncident: true, checkIfCanCloseIncidentModal } }
    }
    ThreatSharing.beforeRouteLeave.call(ctx3, {}, {}, next)
    expect(checkIfCanCloseIncidentModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const ctx4 = { $refs: {} }
    ThreatSharing.beforeRouteLeave.call(ctx4, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('setThreatSharingStepLoading, setLoadState, openCreateCommunityModal, onAddClose work as expected', () => {
    const ctx = {
      isStepDisabled: false,
      isLoadState: true,
      isTableReload: true,
      isWantToAddNewCommunity: false,
      refreshMemberTable: false
    }

    methods.setThreatSharingStepLoading.call(ctx, true)
    expect(ctx.isStepDisabled).toBe(true)

    methods.setLoadState.call(ctx)
    expect(ctx.isLoadState).toBe(false)
    expect(ctx.isTableReload).toBe(false)

    methods.openCreateCommunityModal.call(ctx)
    expect(ctx.isWantToAddNewCommunity).toBe(true)

    methods.onAddClose.call(ctx)
    expect(ctx.isWantToAddNewCommunity).toBe(false)
    expect(ctx.refreshMemberTable).toBe(true)
  })

  it('joinRequestSuccess delegates to getSelectedTabData', () => {
    const getSelectedTabData = jest.fn()
    const ctx = { getSelectedTabData }

    methods.joinRequestSuccess.call(ctx)
    expect(getSelectedTabData).toHaveBeenCalledTimes(1)
  })

  it('getSelectedTabData loads incidents or communities and resets load state', () => {
    jest.useFakeTimers()
    const setLoadState = jest.fn()

    const incidentsCtx = {
      tab: 0,
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: true,
      isLoadState: false,
      $refs: {
        tsIncidents: { getIncidentList: jest.fn(), page: 0, itemsPerPage: 0 }
      },
      $store: { state: { communities: { communities: null } } },
      setLoadState
    }

    methods.getSelectedTabData.call(incidentsCtx)
    jest.advanceTimersByTime(100)
    expect(incidentsCtx.$refs.tsIncidents.getIncidentList).toHaveBeenCalledTimes(1)
    expect(incidentsCtx.$refs.tsIncidents.page).toBe(1)
    expect(incidentsCtx.$refs.tsIncidents.itemsPerPage).toBe(5)
    expect(setLoadState).toHaveBeenCalledTimes(1)

    setLoadState.mockClear()
    const communitiesCtx = {
      tab: 1,
      page: 0,
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: true,
      isLoadState: false,
      $refs: {
        tsCommunities: {
          getAllCommunitiesListData: jest.fn(),
          getInvitationCount: jest.fn(),
          setInitialCommunityValues: jest.fn(),
          isCommunity: true
        }
      },
      $store: {
        state: {
          communities: { communities: { communitiesData: { searchValues: { page: 3 } } } }
        }
      },
      setLoadState
    }

    methods.getSelectedTabData.call(communitiesCtx)
    jest.advanceTimersByTime(100)
    expect(communitiesCtx.page).toBe(3)
    expect(communitiesCtx.$refs.tsCommunities.getAllCommunitiesListData).toHaveBeenCalledTimes(1)
    expect(communitiesCtx.$refs.tsCommunities.getInvitationCount).toHaveBeenCalledTimes(1)
    expect(communitiesCtx.$refs.tsCommunities.setInitialCommunityValues).toHaveBeenCalledTimes(1)
    expect(communitiesCtx.$refs.tsCommunities.isCommunity).toBe(false)
    expect(setLoadState).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('getSelectedTabData early-return branches do not call loaders', () => {
    jest.useFakeTimers()
    const setLoadState = jest.fn()
    const incidentsCtx = {
      tab: 0,
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: true,
      isLoadState: true,
      $refs: {
        tsIncidents: { getIncidentList: jest.fn(), page: 0, itemsPerPage: 0 }
      },
      $store: { state: { communities: { communities: null } } },
      setLoadState
    }
    methods.getSelectedTabData.call(incidentsCtx)
    jest.advanceTimersByTime(100)
    expect(incidentsCtx.$refs.tsIncidents.getIncidentList).not.toHaveBeenCalled()

    const communitiesCtx = {
      tab: 1,
      page: 0,
      getCommunityPostsPermission: true,
      getAllCommunitiesPermission: false,
      isLoadState: false,
      $refs: {
        tsCommunities: {
          getAllCommunitiesListData: jest.fn(),
          getInvitationCount: jest.fn(),
          setInitialCommunityValues: jest.fn(),
          isCommunity: true
        }
      },
      $store: { state: { communities: { communities: {} } } },
      setLoadState
    }
    methods.getSelectedTabData.call(communitiesCtx)
    jest.advanceTimersByTime(100)
    expect(communitiesCtx.$refs.tsCommunities.getAllCommunitiesListData).not.toHaveBeenCalled()
    jest.useRealTimers()
  })
})
