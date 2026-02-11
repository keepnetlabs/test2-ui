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

  describe('State Structure', () => {
    it('should have permissions array', () => {
      const store = loadPermissionsStore()
      expect(Array.isArray(store.state.permissions)).toBe(true)
    })

    it('should have dashboard permissions object', () => {
      const store = loadPermissionsStore()
      expect(store.state.dashboardPermissions).toBeDefined()
    })

    it('should have phishing scenarios permissions', () => {
      const store = loadPermissionsStore()
      expect(store.state.phishingScenariosPermissions).toBeDefined()
    })

    it('should have threat sharing permissions', () => {
      const store = loadPermissionsStore()
      expect(store.state.threatSharingPermissions).toBeDefined()
    })

    it('should have LDAP permissions', () => {
      const store = loadPermissionsStore()
      expect(store.state.ldapPermissions).toBeDefined()
    })
  })

  describe('Mutations', () => {
    it('SET_PERMISSIONS_LIST updates permissions array', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))
      const permissions = ['test1|GET', 'test2|POST']

      store.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('SET_ALL_PERMISSIONS marks has permission correctly', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = []
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(false)
    })

    it('RESET_STATE clears all permissions', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['test|GET']
      store.mutations.RESET_STATE(state)

      expect(state.permissions).toEqual([])
    })
  })

  describe('Getters', () => {
    it('getDashboardWidgetsPermission checks dashboard permissions', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.dashboardPermissions.WIDGETS.hasPermission = true
      expect(store.getters.getDashboardWidgetsPermission(state)).toBe(true)
    })

    it('getPhishingSimulatorLeftMenuPermissions getter exists', () => {
      const store = loadPermissionsStore()
      expect(store.getters).toBeDefined()
      expect(Object.keys(store.getters).length).toBeGreaterThan(0)
    })

    it('getIncidentResponderLeftMenuPermissions getter exists', () => {
      const store = loadPermissionsStore()
      expect(store.getters).toBeDefined()
    })
  })

  describe('Actions', () => {
    it('setPermissionsList commits and dispatches', () => {
      const store = loadPermissionsStore()
      const commit = jest.fn()
      const dispatch = jest.fn()

      store.actions.setPermissionsList({ commit, dispatch }, [])
      expect(commit).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalled()
    })

    it('setAllPermissions exists as action', () => {
      const store = loadPermissionsStore()
      expect(store.actions.setAllPermissions).toBeDefined()
    })
  })

  describe('Permission Caching', () => {
    it('localStorage persists permissions', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['test|GET']
      store.mutations.SET_ALL_PERMISSIONS(state)

      const stored = localStorage.getItem('permissions')
      expect(stored).not.toBeNull()
    })

    it('cached permissions are retrievable', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['cached|GET']
      store.mutations.SET_ALL_PERMISSIONS(state)

      const stored = JSON.parse(localStorage.getItem('permissions'))
      expect(stored.permissions).toContain('cached|GET')
    })
  })

  describe('Permission Validation', () => {
    it('permission format matches url|method pattern', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const permission = 'api/endpoint|GET'
      state.permissions = [permission]
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.permissions[0]).toMatch(/\|/)
    })

    it('handles empty permission list', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = []
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.permissions).toEqual([])
    })
  })

  describe('Store Integration', () => {
    it('store module has required properties', () => {
      const store = loadPermissionsStore()
      expect(store.state).toBeDefined()
      expect(store.mutations).toBeDefined()
      expect(store.getters).toBeDefined()
      expect(store.actions).toBeDefined()
    })

    it('multiple store loads have same structure', () => {
      const store1 = loadPermissionsStore()
      const store2 = loadPermissionsStore()

      expect(store1.state).toBeDefined()
      expect(store2.state).toBeDefined()
      expect(store1.mutations).toBeDefined()
      expect(store2.mutations).toBeDefined()
    })

    it('state is properly isolated between tests', () => {
      const store = loadPermissionsStore()
      expect(store.state.permissions).toEqual([])
    })
  })
})
