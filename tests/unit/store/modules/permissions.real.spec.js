const loadPermissionsStore = () => {
  let store
  jest.isolateModules(() => {
    store = require('@/store/modules/permissions').default
  })
  return store
}

describe('permissions store module (real)', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.resetModules()
  })

  it('initializes with default state when localStorage is empty', () => {
    const store = loadPermissionsStore()

    expect(Array.isArray(store.state.permissions)).toBe(true)
    expect(store.state.permissions).toEqual([])
    expect(store.state).toHaveProperty('dashboardPermissions')
    expect(store.state).toHaveProperty('phishingScenariosPermissions')
  })

  it('SET_ALL_PERMISSIONS marks matching permissions and writes to localStorage', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))

    const dashboardWidgets = state.dashboardPermissions.WIDGETS
    const createCommunity = state.threatSharingPermissions.CREATE_COMMUNITY

    state.permissions = [
      `${dashboardWidgets.url}|${dashboardWidgets.method}`,
      `${createCommunity.url}|${createCommunity.method}`
    ]

    store.mutations.SET_ALL_PERMISSIONS(state)

    expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(true)
    expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(true)
    expect(state.threatSharingPermissions.CREATE_COMMUNITY.hasPermission).toBe(true)
    expect(state.threatSharingPermissions.isOneOfThemPermitted).toBe(true)

    const stored = JSON.parse(localStorage.getItem('permissions'))
    expect(stored.permissions).toEqual(state.permissions)
  })

  it('getLDAPFieldMappingPermissions requires both field mapping permissions', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))

    state.ldapPermissions.FIELD_MAPPING_USERS.hasPermission = true
    state.ldapPermissions.LDAP_FIELDS.hasPermission = true

    expect(store.getters.getLDAPFieldMappingPermissions(state)).toBe(true)

    state.ldapPermissions.LDAP_FIELDS.hasPermission = false
    expect(store.getters.getLDAPFieldMappingPermissions(state)).toBe(false)
  })

  it('getEtsAttackVectorPermissionEnableDisable checks for both entries', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))

    expect(store.getters.getEtsAttackVectorPermissionEnableDisable(state)).toBe(true)

    delete state.etsAttackVectorPermissions.ENABLE
    expect(store.getters.getEtsAttackVectorPermissionEnableDisable(state)).toBe(false)
  })

  it('getWidgetsPermissions composes values from getters', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))
    const mockGetters = {
      getIncidentResponderRunningInvestigationsPermission: true,
      getIncidentResponderSummaryPermission: false,
      getThreatSharingCommunityPostsPermission: true,
      getIncidentResponderTopRulesPermission: true,
      getThreatSharingTopPostsPermission: false,
      getDashboardReportersPermission: true,
      getDashboardReportedEmailTrendsPermission: false,
      getIncidentResponderNotifiedEmailPermission: true,
      getDashboardWidgetsPermission: true,
      getPhishingReporterLeftMenuPermissions: false,
      getIncidentResponderLeftMenuPermissions: true,
      getPhishingSimulatorLeftMenuPermissions: true
    }

    expect(store.getters.getWidgetsPermissions(state, mockGetters)).toEqual({
      runningInvestigation: true,
      irSummary: false,
      communityPosts: true,
      topRules: true,
      topPosts: false,
      reporters: true,
      reportedEmailTrends: false,
      notifiedEmail: true,
      widgets: true,
      phishingReporterCard: false,
      roiSettingCard: true,
      recentCampaignsCard: true,
      mostPhishedUsersCard: true,
      phishingCampaignTrendsCard: true,
      mostEngagedCampaignsCard: true,
      topPhishingSimulationReportersCard: true
    })
  })

  it('actions dispatch and commit expected mutations', () => {
    const store = loadPermissionsStore()
    const commit = jest.fn()
    const dispatch = jest.fn()

    store.actions.setPermissionsList({ commit, dispatch }, ['test|GET'])

    expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS_LIST', ['test|GET'])
    expect(dispatch).toHaveBeenCalledWith('setAllPermissions')
  })

  it('RESET_STATE restores defaults', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))

    state.permissions = ['changed']
    state.dashboardPermissions.WIDGETS.hasPermission = true

    store.mutations.RESET_STATE(state)

    expect(state.permissions).toEqual([])
    expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(false)
  })

  it('all getters can be called safely', () => {
    const store = loadPermissionsStore()
    const state = JSON.parse(JSON.stringify(store.state))

    Object.keys(store.getters).forEach((name) => {
      if (
        name !== 'getWidgetsPermissions' &&
        name !== 'getCompanySettingsLeftMenuPermissions' &&
        name !== 'getSIEMIntegrationPermissions'
      ) {
        store.getters[name](state)
      }
    })
  })
})
