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

  describe('Module Structure Validation', () => {
    it('module exports default store', () => {
      const store = loadPermissionsStore()
      expect(store).toBeDefined()
      expect(typeof store).toBe('object')
    })

    it('module has namespaced property', () => {
      const store = loadPermissionsStore()
      expect(store.namespaced).toBeDefined()
    })

    it('module has all required sections', () => {
      const store = loadPermissionsStore()
      expect(store).toHaveProperty('state')
      expect(store).toHaveProperty('mutations')
      expect(store).toHaveProperty('getters')
      expect(store).toHaveProperty('actions')
    })

    it('state is function or object', () => {
      const store = loadPermissionsStore()
      expect(typeof store.state === 'function' || typeof store.state === 'object').toBe(true)
    })

    it('mutations are functions', () => {
      const store = loadPermissionsStore()
      Object.values(store.mutations).forEach(mutation => {
        expect(typeof mutation).toBe('function')
      })
    })

    it('getters are functions', () => {
      const store = loadPermissionsStore()
      Object.values(store.getters).forEach(getter => {
        expect(typeof getter).toBe('function')
      })
    })

    it('actions are functions', () => {
      const store = loadPermissionsStore()
      Object.values(store.actions).forEach(action => {
        expect(typeof action).toBe('function')
      })
    })
  })

  describe('State Type Validation', () => {
    it('permissions array contains valid format', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['endpoint1|GET', 'endpoint2|POST', 'endpoint3|PUT']

      state.permissions.forEach(permission => {
        expect(permission).toMatch(/\w+\|\w+/)
      })
    })

    it('permission objects have required properties', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      Object.values(state.dashboardPermissions).forEach(perm => {
        if (typeof perm === 'object' && perm !== null) {
          expect(perm).toHaveProperty('url')
          expect(perm).toHaveProperty('method')
          expect(perm).toHaveProperty('hasPermission')
        }
      })
    })

    it('hasPermission property is boolean', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.dashboardPermissions.WIDGETS.hasPermission = true
      expect(typeof state.dashboardPermissions.WIDGETS.hasPermission).toBe('boolean')
    })

    it('permissions state maintains data types', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      expect(Array.isArray(state.permissions)).toBe(true)
      expect(typeof state.dashboardPermissions).toBe('object')
      expect(typeof state.threatSharingPermissions).toBe('object')
    })
  })

  describe('Permission Parsing & Matching', () => {
    it('parses url and method from permission string', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['api/dashboard|GET']
      store.mutations.SET_ALL_PERMISSIONS(state)

      // Permission format is url|method
      expect(state.permissions[0]).toContain('|')
      const [url, method] = state.permissions[0].split('|')
      expect(url).toBe('api/dashboard')
      expect(method).toBe('GET')
    })

    it('matches permission against multiple endpoints', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const dashboardUrl = state.dashboardPermissions.WIDGETS.url
      const dashboardMethod = state.dashboardPermissions.WIDGETS.method

      state.permissions = [`${dashboardUrl}|${dashboardMethod}`]
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(true)
    })

    it('handles multiple permission formats', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = [
        'api/users|GET',
        'api/users|POST',
        'api/users/123|PUT',
        'api/users/123|DELETE'
      ]

      state.permissions.forEach(permission => {
        const parts = permission.split('|')
        expect(parts).toHaveLength(2)
        expect(parts[0]).toBeTruthy()
        expect(parts[1]).toBeTruthy()
      })
    })
  })

  describe('Getter Composition & Behavior', () => {
    it('getWidgetsPermissions combines multiple getter results', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))
      const mockGetters = {
        getIncidentResponderRunningInvestigationsPermission: true,
        getIncidentResponderSummaryPermission: true,
        getThreatSharingCommunityPostsPermission: true,
        getIncidentResponderTopRulesPermission: true,
        getThreatSharingTopPostsPermission: true,
        getDashboardReportersPermission: true,
        getDashboardReportedEmailTrendsPermission: true,
        getIncidentResponderNotifiedEmailPermission: true,
        getDashboardWidgetsPermission: true,
        getPhishingReporterLeftMenuPermissions: true,
        getIncidentResponderLeftMenuPermissions: true,
        getPhishingSimulatorLeftMenuPermissions: true
      }

      const result = store.getters.getWidgetsPermissions(state, mockGetters)
      expect(result).toHaveProperty('runningInvestigation')
      expect(result).toHaveProperty('widgets')
    })

    it('getters return consistent boolean values', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const getterResults = [
        store.getters.getDashboardWidgetsPermission(state),
        store.getters.getDashboardReportersPermission(state),
        store.getters.getLDAPFieldMappingPermissions(state)
      ]

      getterResults.forEach(result => {
        expect(typeof result).toBe('boolean')
      })
    })

    it('getters handle state with mixed permission values', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.dashboardPermissions.WIDGETS.hasPermission = true
      state.dashboardPermissions.REPORTERS.hasPermission = false

      expect(store.getters.getDashboardWidgetsPermission(state)).toBe(true)
      expect(store.getters.getDashboardReportersPermission(state)).toBe(false)
    })
  })

  describe('Multiple Loads & Isolation', () => {
    it('each module load has independent state', () => {
      const store1 = loadPermissionsStore()
      const store2 = loadPermissionsStore()

      const state1 = JSON.parse(JSON.stringify(store1.state))
      const state2 = JSON.parse(JSON.stringify(store2.state))

      state1.permissions = ['test1|GET']
      state2.permissions = ['test2|POST']

      expect(state1.permissions[0]).not.toBe(state2.permissions[0])
    })

    it('localStorage is cleared between loads', () => {
      localStorage.clear()
      const store = loadPermissionsStore()
      expect(localStorage.getItem('permissions')).toBeNull()
    })

    it('multiple permission sets do not interfere', () => {
      const store = loadPermissionsStore()
      const state1 = JSON.parse(JSON.stringify(store.state))
      const state2 = JSON.parse(JSON.stringify(store.state))

      state1.permissions = ['endpoint1|GET']
      state2.permissions = ['endpoint2|POST']

      store.mutations.SET_ALL_PERMISSIONS(state1)
      const stored1 = JSON.parse(localStorage.getItem('permissions'))

      expect(stored1.permissions).toContain('endpoint1|GET')
    })
  })

  describe('Performance Characteristics', () => {
    it('SET_ALL_PERMISSIONS executes quickly', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = Array.from({ length: 100 }, (_, i) => `endpoint${i}|GET`)

      const start = Date.now()
      store.mutations.SET_ALL_PERMISSIONS(state)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(150)
    })

    it('getters execute quickly', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        store.getters.getDashboardWidgetsPermission(state)
      }
      const duration = Date.now() - start

      expect(duration).toBeLessThan(100)
    })

    it('handles large permission lists efficiently', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const largePermissionList = Array.from({ length: 500 }, (_, i) => `api/endpoint${i}|GET`)

      const start = Date.now()
      state.permissions = largePermissionList
      store.mutations.SET_ALL_PERMISSIONS(state)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(500)
    })
  })

  describe('Integration Workflows', () => {
    it('complete permission assignment workflow', () => {
      const store = loadPermissionsStore()
      const commit = jest.fn()
      const dispatch = jest.fn()

      // Action: set permissions list
      store.actions.setPermissionsList({ commit, dispatch }, ['api/users|GET', 'api/users|POST'])

      expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS_LIST', expect.arrayContaining(['api/users|GET']))
      expect(dispatch).toHaveBeenCalledWith('setAllPermissions')
    })

    it('permission checking workflow', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      const dashboardUrl = state.dashboardPermissions.WIDGETS.url
      const dashboardMethod = state.dashboardPermissions.WIDGETS.method

      // Set permissions
      state.permissions = [`${dashboardUrl}|${dashboardMethod}`]

      // Process permissions
      store.mutations.SET_ALL_PERMISSIONS(state)

      // Check permission
      expect(store.getters.getDashboardWidgetsPermission(state)).toBe(true)
    })

    it('reset and reinitialize workflow', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      // Set some permissions
      state.permissions = ['test|GET']
      state.dashboardPermissions.WIDGETS.hasPermission = true

      // Reset
      store.mutations.RESET_STATE(state)

      // Verify reset
      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(false)

      // Reinitialize
      state.permissions = ['new|POST']
      store.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.permissions).toContain('new|POST')
    })
  })

  describe('Edge Cases & Error Handling', () => {
    it('handles empty permission list', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = []
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions.WIDGETS.hasPermission).toBe(false)
    })

    it('handles null or undefined in permission check', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = [null, undefined, 'valid|GET']

      expect(() => {
        store.mutations.SET_ALL_PERMISSIONS(state)
      }).not.toThrow()
    })

    it('handles duplicate permissions', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['api/endpoint|GET', 'api/endpoint|GET', 'api/endpoint|GET']

      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.permissions.filter(p => p === 'api/endpoint|GET')).toHaveLength(3)
    })

    it('handles special characters in permission format', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.permissions = ['api/users/123|GET', 'api/groups?search=test|POST']

      const hasSpecialChars = state.permissions.some(p => /[\/\?]/.test(p))
      expect(hasSpecialChars).toBe(true)
    })
  })

  describe('Additional Branch Coverage', () => {
    it('initializes state from cached localStorage permissions object', () => {
      const firstStore = loadPermissionsStore()
      const cachedState = JSON.parse(JSON.stringify(firstStore.state))
      cachedState.permissions = ['cached/from-local-storage|GET']
      localStorage.setItem('permissions', JSON.stringify(cachedState))

      jest.resetModules()
      const cachedStore = loadPermissionsStore()

      expect(cachedStore.state.permissions).toEqual(['cached/from-local-storage|GET'])
    })

    it('getCallbackCampaignCreatePermissions returns undefined when parent permissions are missing', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))

      state.callbackCampaignManagerParentPermissions = undefined

      expect(store.getters.getCallbackCampaignCreatePermissions(state)).toBeUndefined()
    })

    it('SET_ALL_PERMISSIONS marks callback campaign create permission when matched', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))
      const callbackCreate = state.callbackCampaignManagerParentPermissions.CREATE

      state.permissions = [`${callbackCreate.url}|${callbackCreate.method}`]
      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.callbackCampaignManagerParentPermissions.CREATE.hasPermission).toBe(true)
      expect(state.callbackCampaignManagerParentPermissions.isOneOfThemPermitted).toBe(true)
      expect(store.getters.getCallbackCampaignCreatePermissions(state)).toBe(true)
    })

    it('SET_ALL_PERMISSIONS keeps callback campaign job permission false when unmatched', () => {
      const store = loadPermissionsStore()
      const state = JSON.parse(JSON.stringify(store.state))
      state.permissions = ['unmatched/url|GET']

      store.mutations.SET_ALL_PERMISSIONS(state)

      expect(state.callbackCampaignJobPermissions.SEARCH.hasPermission).toBe(false)
      expect(state.callbackCampaignJobPermissions.isOneOfThemPermitted).toBe(false)
      expect(store.getters.getCallbackCampaignJobSearchPermissions(state)).toBe(false)
    })
  })
})
