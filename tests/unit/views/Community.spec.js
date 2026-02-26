import Community from '@/views/Community.vue'

describe('Community.vue', () => {
  it('mounted redirects when edit permission is missing and selects members/incidents by permissions', () => {
    const push = jest.fn()
    const getMembers = jest.fn()
    const getIncidents = jest.fn()

    const ctxMissingEdit = {
      $router: { push },
      getMembers,
      getIncidents,
      getThreatSharingEditCommunityPermission: false,
      getThreatSharingGetIncidentsPermission: true,
      getThreatSharingGetMembersPermission: true,
      tab: 0
    }
    Community.mounted.call(ctxMissingEdit)
    expect(push).toHaveBeenCalledWith('/threat-sharing')

    const ctxNoIncidents = {
      $router: { push: jest.fn() },
      getMembers,
      getIncidents,
      getThreatSharingEditCommunityPermission: true,
      getThreatSharingGetIncidentsPermission: false,
      getThreatSharingGetMembersPermission: true,
      tab: 0
    }
    Community.mounted.call(ctxNoIncidents)
    expect(ctxNoIncidents.tab).toBe(1)
    expect(getMembers).toHaveBeenCalled()

    const ctxNoMembers = {
      $router: { push: jest.fn() },
      getMembers,
      getIncidents,
      getThreatSharingEditCommunityPermission: true,
      getThreatSharingGetIncidentsPermission: true,
      getThreatSharingGetMembersPermission: false,
      tab: 1
    }
    Community.mounted.call(ctxNoMembers)
    expect(ctxNoMembers.tab).toBe(0)
    expect(getIncidents).toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks for post modal, incident modal and unsaved community modal', () => {
    const next = jest.fn()

    const postCtx = {
      showPostIncident: true,
      isWantToAddNewCommunity: false,
      $refs: {
        refPostIncident: { onCancelClicked: jest.fn() }
      }
    }
    Community.beforeRouteLeave.call(postCtx, {}, {}, next)
    expect(postCtx.$refs.refPostIncident.onCancelClicked).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const incidentCtx = {
      showPostIncident: false,
      isWantToAddNewCommunity: false,
      $refs: {
        refIncidents: { showPostIncident: true, checkIfCanCloseIncidentModal: jest.fn() }
      }
    }
    Community.beforeRouteLeave.call(incidentCtx, {}, {}, next)
    expect(incidentCtx.$refs.refIncidents.checkIfCanCloseIncidentModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const communityCtx = {
      showPostIncident: false,
      isWantToAddNewCommunity: true,
      $refs: {
        refNewCommunity: { isSubmitted: false }
      }
    }
    Community.beforeRouteLeave.call(communityCtx, {}, {}, next)
    expect(communityCtx.isWantToAddNewCommunity).toBe(false)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    Community.beforeRouteLeave.call({ showPostIncident: false, isWantToAddNewCommunity: false, $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('getIncidents and getMembers call refs only when permissions allow', () => {
    jest.useFakeTimers()

    const incidentsCtx = {
      getThreatSharingGetIncidentsPermission: true,
      $refs: { refIncidents: { getIncidentList: jest.fn() } }
    }
    Community.methods.getIncidents.call(incidentsCtx)
    jest.advanceTimersByTime(60)
    expect(incidentsCtx.$refs.refIncidents.getIncidentList).toHaveBeenCalled()

    const blockedIncidentsCtx = {
      getThreatSharingGetIncidentsPermission: false,
      $refs: { refIncidents: { getIncidentList: jest.fn() } }
    }
    Community.methods.getIncidents.call(blockedIncidentsCtx)
    jest.advanceTimersByTime(60)
    expect(blockedIncidentsCtx.$refs.refIncidents.getIncidentList).not.toHaveBeenCalled()

    const membersCtx = {
      getThreatSharingGetMembersPermission: true,
      $refs: { refMembers: { getCommunityDetails: jest.fn() } }
    }
    Community.methods.getMembers.call(membersCtx)
    jest.advanceTimersByTime(60)
    expect(membersCtx.$refs.refMembers.getCommunityDetails).toHaveBeenCalled()

    const blockedMembersCtx = {
      getThreatSharingGetMembersPermission: false,
      $refs: { refMembers: { getCommunityDetails: jest.fn() } }
    }
    Community.methods.getMembers.call(blockedMembersCtx)
    jest.advanceTimersByTime(60)
    expect(blockedMembersCtx.$refs.refMembers.getCommunityDetails).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('member selection and modal helper methods update state as expected', () => {
    jest.useFakeTimers()

    const selectedCtx = {
      tab: 1,
      $refs: { refIncidents: { getIncidentList: jest.fn() } }
    }
    Community.methods.selectedMemberPostFunc.call(selectedCtx, {
      communityResourceId: 'c-1',
      companyResourceId: 'co-1'
    })
    expect(selectedCtx.tab).toBe(0)
    jest.advanceTimersByTime(60)
    expect(selectedCtx.$refs.refIncidents.getIncidentList).toHaveBeenCalledWith('c-1', 'co-1')

    const modalCtx = {
      refreshIncidentsData: false,
      showPostIncident: true,
      isWantToAddNewCommunity: false,
      $refs: { refIncidents: { getIncidentList: jest.fn() } }
    }

    Community.methods.refreshDataFunc.call(modalCtx)
    expect(modalCtx.$refs.refIncidents.getIncidentList).toHaveBeenCalled()
    expect(modalCtx.refreshIncidentsData).toBe(true)

    Community.methods.closeIncidentModal.call(modalCtx)
    expect(modalCtx.showPostIncident).toBe(false)

    Community.methods.showPostIncidentFunc.call(modalCtx)
    expect(modalCtx.showPostIncident).toBe(true)

    Community.methods.openCreateCommunityModal.call(modalCtx)
    expect(modalCtx.isWantToAddNewCommunity).toBe(true)

    Community.methods.onAddClose.call(modalCtx)
    expect(modalCtx.isWantToAddNewCommunity).toBe(false)

    jest.useRealTimers()
  })

  it('route watcher handles postId and routerCount fallback branches', () => {
    jest.useFakeTimers()

    const push = jest.fn()
    const getMembers = jest.fn()
    const getIncidents = jest.fn()
    const getSharedPost = jest.fn()
    const ctxPost = {
      $nextTick: (cb) => cb(),
      $router: { push },
      $refs: { refIncidents: { incidentList: ['old'], getSharedPost } },
      getMembers,
      getIncidents,
      tab: 0,
      routerCount: 0,
      getThreatSharingEditCommunityPermission: true,
      getThreatSharingGetIncidentsPermission: true
    }

    Community.watch.$route.call(ctxPost, { name: 'Community', query: { postId: 'p1' } }, { name: 'Community' })
    expect(ctxPost.$refs.refIncidents.incidentList).toEqual([])
    expect(getSharedPost).toHaveBeenCalled()

    const ctxFallback = {
      $nextTick: (cb) => cb(),
      $router: { push },
      $refs: { refIncidents: { incidentList: [], getSharedPost: jest.fn() } },
      getMembers,
      getIncidents,
      tab: 1,
      routerCount: 1,
      getThreatSharingEditCommunityPermission: true,
      getThreatSharingGetIncidentsPermission: true
    }
    Community.watch.$route.call(ctxFallback, { name: 'Community', query: {} }, { name: 'Community' })
    expect(ctxFallback.tab).toBe(0)
    expect(getIncidents).toHaveBeenCalled()
    expect(ctxFallback.routerCount).toBe(2)
    jest.advanceTimersByTime(260)
    expect(ctxFallback.routerCount).toBe(0)

    jest.useRealTimers()
  })

  it('route watcher no-op and redirect/member branches execute correctly', () => {
    const push = jest.fn()
    const getMembers = jest.fn()
    const getIncidents = jest.fn()
    const ctxDifferentRoute = {
      $nextTick: (cb) => cb(),
      $router: { push },
      $refs: { refIncidents: { incidentList: [], getSharedPost: jest.fn() } },
      getMembers,
      getIncidents,
      tab: 0,
      routerCount: 0,
      getThreatSharingEditCommunityPermission: true,
      getThreatSharingGetIncidentsPermission: true
    }
    Community.watch.$route.call(
      ctxDifferentRoute,
      { name: 'Community', query: {} },
      { name: 'AnotherPage' }
    )
    expect(push).not.toHaveBeenCalled()
    expect(getMembers).not.toHaveBeenCalled()

    const ctxNoEditNoIncidents = {
      $nextTick: (cb) => cb(),
      $router: { push },
      $refs: { refIncidents: { incidentList: [], getSharedPost: jest.fn() } },
      getMembers,
      getIncidents,
      tab: 0,
      routerCount: 3,
      getThreatSharingEditCommunityPermission: false,
      getThreatSharingGetIncidentsPermission: false
    }
    Community.watch.$route.call(
      ctxNoEditNoIncidents,
      { name: 'Community', query: {} },
      { name: 'Community' }
    )
    expect(push).toHaveBeenCalledWith('/threat-sharing')
    expect(ctxNoEditNoIncidents.tab).toBe(1)
    expect(getMembers).toHaveBeenCalled()
  })

  it('beforeRouteLeave allows navigation when new community form was submitted', () => {
    const next = jest.fn()
    const ctx = {
      showPostIncident: false,
      isWantToAddNewCommunity: true,
      $refs: { refNewCommunity: { isSubmitted: true } }
    }

    Community.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(next).toHaveBeenCalledWith()
  })
})
