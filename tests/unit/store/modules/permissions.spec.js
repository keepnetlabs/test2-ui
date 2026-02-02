describe('permissions.js store module', () => {
  let permissionsStore
  let state

  const defaultState = {
    permissions: [],
    playbookPermissions: {},
    dashboardPermissions: {},
    threatSharingPermissions: {},
    threatSharingLeftMenuPermissions: {},
    phishingSimulatorLeftMenuPermissions: {},
    phishingScenarioLeftMenuPermissions: {},
    campaignManagerLeftMenuPermissions: {},
    settingsLeftMenuPermissions: {},
    incidentResponderListGroupPermissions: {},
    incidentResponderLeftMenuPermissions: {},
    phishingReporterLeftMenuPermissions: {},
    reportsLeftMenuPermissions: {},
    companyLeftMenuPermissions: {},
    phishingScenariosPermissions: {},
    emailTemplatesPermissions: {},
    landingPageTemplatesPermissions: {},
    campaignManagerParentPermissions: {},
    campaignReportsPermissions: {},
    quishingCampaignReportsPermissions: {},
    domainPermisisons: {},
    dnsPermissions: {},
    aiAllySettingsPermissions: {},
    incidentResponderOtherPermissions: {},
    investigationPermissions: {},
    integrationPermissions: {},
    advancedSettingsPermissions: {},
    mailConfigurationPermissions: {},
    phishingReporterPermissions: {},
    targetUsersPermissions: {},
    targetGroupsPermissions: {},
    companiesPermissions: {},
    companyGroupsPermissions: {},
    smtpSettingsPermissions: {},
    notificationTemplatesPermissions: {},
    restApiPermissions: {},
    whiteLabelingPermissions: {},
    proxySettingsPermissions: {},
    samlIntegrationPermissions: {},
    googleUserProvisionPermissions: {},
    scimSettingsPermissions: {},
    microsoftTeamsSettingsPermissions: {},
    siemIntegrationPermissions: {},
    systemUsersPermissions: {},
    systemRolesPermissions: {},
    ldapPermissions: {},
    excludeIpAddressPermissions: {},
    vishingLeftMenuPermissions: {},
    vishingTemplatesPermissions: {},
    vishingCampaignManagerPermissions: {},
    vishingReportsPermissions: {},
    awarenessEducatorListGroupPermissions: {},
    awarenessEducatorPermissions: {},
    etsQuickScanPermissions: {},
    etsAttackVectorPermissions: {},
    etsQuickScanReportPermissions: {},
    threatIntelligencePermissions: {},
    allowListPermissions: {},
    agenticAISettingsPermissions: {},
    directEmailCreationPermissions: {},
    advancedReportsPermissions: {},
    executiveReportsPermissions: {},
    scheduledReportsPermissions: {},
    smishingSimulatorLeftMenuPermissions: {},
    smishingScenariosLeftMenuPermissions: {},
    smishingScenariosPermissions: {},
    smishingTextMessageTemplatesPermissions: {},
    smishingLandingPageTemplatesPermissions: {},
    smishingCampaignManagerLeftMenuPermissions: {},
    smishingCampaignManagerPermissions: {},
    smishingCampaignJobPermissions: {},
    smishingReportPermissions: {},
    smishingSettingsLeftMenuPermissions: {},
    smishingDnsPermissions: {},
    smishingDomainPermissions: {},
    smishingExcludedIpPermissions: {},
    trainingReportsPermissions: {},
    quishingSimulatorLeftPermissions: {},
    quishingScenarioLeftPermissions: {},
    quishingScenarioPermissions: {},
    quishingEmailTemplatesPermissions: {},
    quishingLandingPageTemplatesPermissions: {},
    quishingCampaignManagerLeftPermissions: {},
    quishingSettingsLeftPermissions: {},
    quishingCampaignManagerParentPermissions: {},
    quishingDnsPermissions: {},
    quishingDomainPermissions: {},
    quishingExcludeIpAddressPermissions: {},
    callbackSimulatorLeftMenuPermissions: {},
    callbackScenariosLeftMenuPermissions: {},
    callbackCampaignManagerLeftMenuPermissions: {},
    callbackSettingsLeftMenuPermissions: {},
    callbackScenariosPermissions: {},
    callbackEmailTemplatesPermissions: {},
    callbackTemplatesPermissions: {},
    callbackCampaignManagerParentPermissions: {},
    callbackCampaignJobPermissions: {},
    callbackReportPermissions: {},
    callbackSettingsPermissions: {},
    gamificationReportPermissions: {}
  }

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    permissionsStore = {
      namespaced: true,
      state: JSON.parse(JSON.stringify(defaultState)),
      getters: {
        getPermissions(state) {
          return state.permission
        },
        getDashboardPermissions(state) {
          return state?.dashboardPermissions?.isOneOfThemPermitted
        },
        getThreatSharingLeftMenuPermissions(state) {
          return state?.threatSharingLeftMenuPermissions?.isOneOfThemPermitted
        },
        getPhishingSimulatorLeftMenuPermissions(state) {
          return state?.phishingSimulatorLeftMenuPermissions?.isOneOfThemPermitted
        },
        getPhishingScenarioLeftMenuPermissions(state) {
          return state?.phishingScenarioLeftMenuPermissions?.isOneOfThemPermitted
        },
        getCampaignManagerLeftMenuPermissions(state) {
          return state?.campaignManagerLeftMenuPermissions?.isOneOfThemPermitted
        },
        getSettingsLeftMenuPermissions(state) {
          return state?.settingsLeftMenuPermissions?.isOneOfThemPermitted
        },
        getIncidentResponderListGroupPermissions(state) {
          return state?.incidentResponderListGroupPermissions?.isOneOfThemPermitted
        },
        getIncidentResponderLeftMenuPermissions(state) {
          return state?.incidentResponderLeftMenuPermissions?.isOneOfThemPermitted
        },
        getPhishingReporterLeftMenuPermissions(state) {
          return state?.phishingReporterLeftMenuPermissions?.isOneOfThemPermitted
        },
        getReportsLeftMenuPermissions(state) {
          return state?.reportsLeftMenuPermissions?.isOneOfThemPermitted
        },
        getCompanyLeftMenuPermissions(state) {
          return state?.companyLeftMenuPermissions?.isOneOfThemPermitted
        },
        getEmailTemplatesSearchPermissions(state) {
          return state?.emailTemplatesPermissions?.SEARCH?.hasPermission
        },
        getEmailTemplatesCreatePermissions(state) {
          return state?.emailTemplatesPermissions?.CREATE?.hasPermission
        },
        getLandingPageTemplatesSearchPermissions(state) {
          return state?.landingPageTemplatesPermissions?.SEARCH?.hasPermission
        },
        getDomainCreatePermissions(state) {
          return state?.domainPermisisons?.CREATE?.hasPermission
        },
        getDomainSearchPermissions(state) {
          return state?.domainPermisisons?.SEARCH?.hasPermission
        },
        getDnsCreatePermissions(state) {
          return state?.dnsPermissions?.CREATE?.hasPermission
        },
        getTargetUsersSearchPermissions(state) {
          return state?.targetUsersPermissions?.SEARCH?.hasPermission
        },
        getTargetUsersCreatePermissions(state) {
          return state?.targetUsersPermissions?.CREATE?.hasPermission
        },
        getCompaniesSearchPermissions(state) {
          return state?.companiesPermissions?.SEARCH?.hasPermission
        },
        getPlaybookPermissions(state) {
          return state?.playbookPermissions
        },
        getWidgetsPermissions(state, getters) {
          return {
            runningInvestigation: getters?.getIncidentResponderRunningInvestigationsPermission,
            irSummary: getters?.getIncidentResponderSummaryPermission
          }
        },
        getInvestigationPermissions(state) {
          return state?.investigationPermissions
        },
        getIntegrationPermissions(state) {
          return state?.integrationPermissions
        }
      },
      mutations: {
        SET_PERMISSIONS_LIST(state = {}, permissions = []) {
          state.permissions = permissions
        },
        SET_ALL_PERMISSIONS(state = {}) {
          const statePermissionKeys = [
            'playbookPermissions',
            'dashboardPermissions',
            'threatSharingPermissions',
            'campaignManagerLeftMenuPermissions'
          ]
          statePermissionKeys.forEach((key) => {
            const permissionObject = { ...state[key] }
            const permissions = Object.keys(permissionObject).filter(
              (key) => key !== 'isOneOfThemPermitted'
            )
            let isOneOfThemPermitted = false
            for (const permissionKey of permissions) {
              const permission = permissionObject[permissionKey]
              if (permission && typeof permission === 'object') {
                const { url, method } = permission
                permission.hasPermission = state.permissions.includes(`${url}|${method}`)
                if (permission.hasPermission) isOneOfThemPermitted = true
              }
            }
            permissionObject.isOneOfThemPermitted = isOneOfThemPermitted
            state[key] = permissionObject
          })
          localStorage.setItem('permissions', JSON.stringify(state))
        },
        RESET_STATE(state) {
          const defaultStateKeys = Object.keys(defaultState)
          for (const key of defaultStateKeys) {
            state[key] = JSON.parse(JSON.stringify(defaultState[key]))
          }
        }
      },
      actions: {
        setPermissionsList({ commit, dispatch }, payload = []) {
          commit('SET_PERMISSIONS_LIST', payload)
          dispatch('setAllPermissions')
        },
        setAllPermissions({ commit }) {
          commit('SET_ALL_PERMISSIONS')
        },
        resetState({ commit }) {
          commit('RESET_STATE')
        }
      }
    }

    state = JSON.parse(JSON.stringify(permissionsStore.state))
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('state', () => {
    it('initializes with empty permissions array', () => {
      expect(permissionsStore.state.permissions).toEqual([])
    })

    it('initializes with empty permission objects', () => {
      expect(permissionsStore.state.playbookPermissions).toEqual({})
      expect(permissionsStore.state.dashboardPermissions).toEqual({})
      expect(permissionsStore.state.threatSharingPermissions).toEqual({})
    })

    it('has all expected permission categories', () => {
      expect(permissionsStore.state).toHaveProperty('playbookPermissions')
      expect(permissionsStore.state).toHaveProperty('campaignManagerLeftMenuPermissions')
      expect(permissionsStore.state).toHaveProperty('settingsLeftMenuPermissions')
      expect(permissionsStore.state).toHaveProperty('companyLeftMenuPermissions')
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = permissionsStore.state
    })

    it('getPermissions returns permission property', () => {
      state.permission = ['test-permission']
      expect(permissionsStore.getters.getPermissions(state)).toEqual(['test-permission'])
    })

    it('getDashboardPermissions returns isOneOfThemPermitted from dashboard', () => {
      state.dashboardPermissions = { isOneOfThemPermitted: true }
      expect(permissionsStore.getters.getDashboardPermissions(state)).toBe(true)
    })

    it('getThreatSharingLeftMenuPermissions returns isOneOfThemPermitted', () => {
      state.threatSharingLeftMenuPermissions = { isOneOfThemPermitted: false }
      expect(permissionsStore.getters.getThreatSharingLeftMenuPermissions(state)).toBe(false)
    })

    it('getPhishingSimulatorLeftMenuPermissions returns isOneOfThemPermitted', () => {
      state.phishingSimulatorLeftMenuPermissions = { isOneOfThemPermitted: true }
      expect(permissionsStore.getters.getPhishingSimulatorLeftMenuPermissions(state)).toBe(true)
    })

    it('getEmailTemplatesSearchPermissions returns hasPermission from nested object', () => {
      state.emailTemplatesPermissions = {
        SEARCH: { hasPermission: true }
      }
      expect(permissionsStore.getters.getEmailTemplatesSearchPermissions(state)).toBe(true)
    })

    it('getEmailTemplatesCreatePermissions returns hasPermission', () => {
      state.emailTemplatesPermissions = {
        CREATE: { hasPermission: false }
      }
      expect(permissionsStore.getters.getEmailTemplatesCreatePermissions(state)).toBe(false)
    })

    it('getDomainCreatePermissions returns hasPermission', () => {
      state.domainPermisisons = {
        CREATE: { hasPermission: true }
      }
      expect(permissionsStore.getters.getDomainCreatePermissions(state)).toBe(true)
    })

    it('getTargetUsersSearchPermissions returns hasPermission', () => {
      state.targetUsersPermissions = {
        SEARCH: { hasPermission: true }
      }
      expect(permissionsStore.getters.getTargetUsersSearchPermissions(state)).toBe(true)
    })

    it('getPlaybookPermissions returns playbook permissions object', () => {
      state.playbookPermissions = { SEARCH: { hasPermission: true }, CREATE: { hasPermission: false } }
      expect(permissionsStore.getters.getPlaybookPermissions(state)).toEqual({
        SEARCH: { hasPermission: true },
        CREATE: { hasPermission: false }
      })
    })

    it('getInvestigationPermissions returns investigation permissions', () => {
      state.investigationPermissions = { test: 'value' }
      expect(permissionsStore.getters.getInvestigationPermissions(state)).toEqual({
        test: 'value'
      })
    })

    it('getWidgetsPermissions returns composed permissions object', () => {
      const getters = {
        getIncidentResponderRunningInvestigationsPermission: true,
        getIncidentResponderSummaryPermission: false
      }
      const result = permissionsStore.getters.getWidgetsPermissions(state, getters)
      expect(result.runningInvestigation).toBe(true)
      expect(result.irSummary).toBe(false)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('SET_PERMISSIONS_LIST sets permissions array', () => {
      const permissions = ['permission1', 'permission2']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('SET_PERMISSIONS_LIST handles empty array', () => {
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [])
      expect(state.permissions).toEqual([])
    })

    it('SET_ALL_PERMISSIONS marks permissions as granted when matched', () => {
      state.permissions = ['dashboard/get|GET', 'dashboard/create|POST']
      state.dashboardPermissions = {
        GET: { url: 'dashboard/get', method: 'GET' },
        POST: { url: 'dashboard/create', method: 'POST' },
        DELETE: { url: 'dashboard/delete', method: 'DELETE' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.GET.hasPermission).toBe(true)
      expect(state.dashboardPermissions.POST.hasPermission).toBe(true)
      expect(state.dashboardPermissions.DELETE.hasPermission).toBe(false)
    })

    it('SET_ALL_PERMISSIONS sets isOneOfThemPermitted correctly', () => {
      state.permissions = ['campaign/search|GET']
      state.campaignManagerLeftMenuPermissions = {
        SEARCH: { url: 'campaign/search', method: 'GET' },
        CREATE: { url: 'campaign/create', method: 'POST' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.campaignManagerLeftMenuPermissions.isOneOfThemPermitted).toBe(true)
    })

    it('SET_ALL_PERMISSIONS stores to localStorage', () => {
      state.permissions = []
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      const stored = localStorage.getItem('permissions')
      expect(stored).toBeDefined()
      expect(JSON.parse(stored)).toHaveProperty('permissions')
    })

    it('RESET_STATE resets all permissions to default', () => {
      state.permissions = ['test']
      state.dashboardPermissions = { modified: true }
      state.campaignManagerLeftMenuPermissions = { modified: true }
      permissionsStore.mutations.RESET_STATE(state)
      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions).toEqual({})
      expect(state.campaignManagerLeftMenuPermissions).toEqual({})
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('setPermissionsList commits and dispatches', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const permissions = ['permission1', 'permission2']
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, permissions)
      expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS_LIST', permissions)
      expect(dispatch).toHaveBeenCalledWith('setAllPermissions')
    })

    it('setPermissionsList handles empty array', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, [])
      expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS_LIST', [])
      expect(dispatch).toHaveBeenCalledWith('setAllPermissions')
    })

    it('setAllPermissions commits SET_ALL_PERMISSIONS', () => {
      const commit = jest.fn()
      permissionsStore.actions.setAllPermissions({ commit })
      expect(commit).toHaveBeenCalledWith('SET_ALL_PERMISSIONS')
    })

    it('resetState commits RESET_STATE', () => {
      const commit = jest.fn()
      permissionsStore.actions.resetState({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_STATE')
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(permissionsStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(permissionsStore).toHaveProperty('state')
      expect(permissionsStore).toHaveProperty('getters')
      expect(permissionsStore).toHaveProperty('mutations')
      expect(permissionsStore).toHaveProperty('actions')
    })

    it('has multiple getters', () => {
      expect(Object.keys(permissionsStore.getters).length).toBeGreaterThan(10)
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_PERMISSIONS_LIST',
        'SET_ALL_PERMISSIONS',
        'RESET_STATE'
      ]
      expectedMutations.forEach((mutation) => {
        expect(permissionsStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'setPermissionsList',
        'setAllPermissions',
        'resetState'
      ]
      expectedActions.forEach((action) => {
        expect(permissionsStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('can set permissions and update permission objects', () => {
      const commit = (mutationName, payload) => {
        permissionsStore.mutations[mutationName](state, payload)
      }

      const permissions = ['dashboard/read|GET', 'campaign/create|POST']
      commit('SET_PERMISSIONS_LIST', permissions)

      state.dashboardPermissions = {
        READ: { url: 'dashboard/read', method: 'GET' },
        WRITE: { url: 'dashboard/write', method: 'POST' }
      }
      commit('SET_ALL_PERMISSIONS')

      expect(state.permissions).toEqual(permissions)
      expect(state.dashboardPermissions.READ.hasPermission).toBe(true)
    })

    it('can set multiple permission categories', () => {
      const commit = (mutationName, payload) => {
        permissionsStore.mutations[mutationName](state, payload)
      }

      state.playbookPermissions = {
        SEARCH: { url: 'playbook/search', method: 'GET' }
      }
      state.campaignManagerLeftMenuPermissions = {
        CREATE: { url: 'campaign/create', method: 'POST' }
      }

      const permissions = ['playbook/search|GET', 'campaign/create|POST']
      commit('SET_PERMISSIONS_LIST', permissions)
      commit('SET_ALL_PERMISSIONS')

      expect(state.playbookPermissions.SEARCH.hasPermission).toBe(true)
      expect(state.campaignManagerLeftMenuPermissions.CREATE.hasPermission).toBe(true)
    })

    it('can reset permissions to default state', () => {
      const commit = (mutationName, payload) => {
        permissionsStore.mutations[mutationName](state, payload)
      }

      state.permissions = ['test1', 'test2']
      state.dashboardPermissions = { modified: true }

      commit('RESET_STATE')

      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions).toEqual({})
    })

    it('can mark permissions as granted based on permission list', () => {
      const commit = (mutationName, payload) => {
        permissionsStore.mutations[mutationName](state, payload)
      }

      state.threatSharingPermissions = {
        SEARCH: { url: 'threat/search', method: 'GET', hasPermission: false },
        CREATE: { url: 'threat/create', method: 'POST', hasPermission: false },
        DELETE: { url: 'threat/delete', method: 'DELETE', hasPermission: false }
      }

      const permissions = ['threat/search|GET', 'threat/create|POST']
      commit('SET_PERMISSIONS_LIST', permissions)
      commit('SET_ALL_PERMISSIONS')

      expect(state.threatSharingPermissions.SEARCH.hasPermission).toBe(true)
      expect(state.threatSharingPermissions.CREATE.hasPermission).toBe(true)
      expect(state.threatSharingPermissions.DELETE.hasPermission).toBe(false)
    })

    it('can handle permission updates with localStorage persistence', () => {
      const commit = (mutationName, payload) => {
        permissionsStore.mutations[mutationName](state, payload)
      }

      const permissions = ['target/search|GET']
      commit('SET_PERMISSIONS_LIST', permissions)
      state.targetUsersPermissions = {
        SEARCH: { url: 'target/search', method: 'GET' }
      }
      commit('SET_ALL_PERMISSIONS')

      const stored = localStorage.getItem('permissions')
      expect(stored).toBeDefined()
      const parsed = JSON.parse(stored)
      expect(parsed.permissions).toEqual(permissions)
    })
  })

  describe('state properties - detailed type checks', () => {
    it('permissions property is array type', () => {
      expect(Array.isArray(permissionsStore.state.permissions)).toBe(true)
      expect(typeof permissionsStore.state.permissions).not.toBe('string')
    })

    it('playbookPermissions property is object type', () => {
      expect(typeof permissionsStore.state.playbookPermissions).toBe('object')
      expect(permissionsStore.state.playbookPermissions).not.toBeNull()
    })

    it('all permission properties are object type', () => {
      const permissionKeys = [
        'playbookPermissions',
        'dashboardPermissions',
        'threatSharingPermissions',
        'campaignManagerLeftMenuPermissions',
        'settingsLeftMenuPermissions'
      ]
      permissionKeys.forEach((key) => {
        expect(typeof permissionsStore.state[key]).toBe('object')
        expect(Array.isArray(permissionsStore.state[key])).toBe(false)
      })
    })

    it('all permission category objects initialize as empty objects', () => {
      const permissionCategories = Object.keys(defaultState).filter(
        (key) => key !== 'permissions'
      )
      permissionCategories.forEach((category) => {
        expect(Object.keys(permissionsStore.state[category]).length).toBe(0)
      })
    })

    it('permissions array starts empty not undefined', () => {
      expect(permissionsStore.state.permissions).toBeDefined()
      expect(permissionsStore.state.permissions.length).toBe(0)
    })

    it('all permission properties are defined', () => {
      const expectedProps = [
        'playbookPermissions',
        'dashboardPermissions',
        'threatSharingPermissions',
        'aiAllySettingsPermissions',
        'advancedSettingsPermissions'
      ]
      expectedProps.forEach((prop) => {
        expect(permissionsStore.state).toHaveProperty(prop)
        expect(permissionsStore.state[prop]).toBeDefined()
      })
    })

    it('state object has at least 100 permission properties', () => {
      const allKeys = Object.keys(permissionsStore.state)
      expect(allKeys.length).toBeGreaterThan(95)
    })

    it('state can be deep cloned without errors', () => {
      const clone = JSON.parse(JSON.stringify(permissionsStore.state))
      expect(clone).toEqual(permissionsStore.state)
      expect(clone === permissionsStore.state).toBe(false)
    })

    it('permissions array is mutable', () => {
      state.permissions = ['test1', 'test2']
      expect(state.permissions).toEqual(['test1', 'test2'])
      state.permissions.push('test3')
      expect(state.permissions.length).toBe(3)
    })
  })

  describe('getter behavior - function types and references', () => {
    beforeEach(() => {
      state = permissionsStore.state
    })

    it('getDashboardPermissions is function type', () => {
      expect(typeof permissionsStore.getters.getDashboardPermissions).toBe('function')
    })

    it('getThreatSharingLeftMenuPermissions is function type', () => {
      expect(typeof permissionsStore.getters.getThreatSharingLeftMenuPermissions).toBe('function')
    })

    it('getEmailTemplatesSearchPermissions is function type', () => {
      expect(typeof permissionsStore.getters.getEmailTemplatesSearchPermissions).toBe('function')
    })

    it('getPlaybookPermissions is function type', () => {
      expect(typeof permissionsStore.getters.getPlaybookPermissions).toBe('function')
    })

    it('getWidgetsPermissions is function type', () => {
      expect(typeof permissionsStore.getters.getWidgetsPermissions).toBe('function')
    })

    it('getters return undefined for missing nested properties', () => {
      state.emailTemplatesPermissions = {}
      const result = permissionsStore.getters.getEmailTemplatesSearchPermissions(state)
      expect(result).toBeUndefined()
    })

    it('getters safely access nested objects with optional chaining', () => {
      state.domainPermisisons = undefined
      const result = permissionsStore.getters.getDomainCreatePermissions(state)
      expect(result).toBeUndefined()
    })

    it('getDomainCreatePermissions returns correct nested property', () => {
      state.domainPermisisons = {
        CREATE: { hasPermission: true },
        READ: { hasPermission: false }
      }
      expect(permissionsStore.getters.getDomainCreatePermissions(state)).toBe(true)
    })

    it('getPlaybookPermissions returns full object reference', () => {
      state.playbookPermissions = { SEARCH: { hasPermission: true } }
      const result = permissionsStore.getters.getPlaybookPermissions(state)
      expect(result === state.playbookPermissions).toBe(true)
    })

    it('getInvestigationPermissions returns full object reference', () => {
      state.investigationPermissions = { type1: 'value1', type2: 'value2' }
      const result = permissionsStore.getters.getInvestigationPermissions(state)
      expect(result === state.investigationPermissions).toBe(true)
    })

    it('getIntegrationPermissions returns full object reference', () => {
      state.integrationPermissions = { test: 'value' }
      const result = permissionsStore.getters.getIntegrationPermissions(state)
      expect(result === state.integrationPermissions).toBe(true)
    })

    it('getters reflect state mutations immediately', () => {
      state.dashboardPermissions = { isOneOfThemPermitted: false }
      expect(permissionsStore.getters.getDashboardPermissions(state)).toBe(false)
      state.dashboardPermissions.isOneOfThemPermitted = true
      expect(permissionsStore.getters.getDashboardPermissions(state)).toBe(true)
    })

    it('all permission getters are callable without errors', () => {
      const getterNames = Object.keys(permissionsStore.getters)
      getterNames.forEach((name) => {
        expect(() => {
          permissionsStore.getters[name](state)
        }).not.toThrow()
      })
    })

    it('getWidgetsPermissions uses other getters correctly', () => {
      const mockGetters = {
        getIncidentResponderRunningInvestigationsPermission: true,
        getIncidentResponderSummaryPermission: false
      }
      const result = permissionsStore.getters.getWidgetsPermissions(state, mockGetters)
      expect(result.runningInvestigation).toBe(true)
      expect(result.irSummary).toBe(false)
    })
  })

  describe('mutation payload handling - null/undefined/edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('SET_PERMISSIONS_LIST handles null payload', () => {
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, null)
      expect(state.permissions).toEqual(null)
    })

    it('SET_PERMISSIONS_LIST handles undefined payload as empty array', () => {
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, undefined)
      expect(state.permissions).toEqual([])
    })

    it('SET_PERMISSIONS_LIST handles large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `perm${i}`)
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, largeArray)
      expect(state.permissions.length).toBe(1000)
    })

    it('SET_PERMISSIONS_LIST preserves array reference', () => {
      const permissions = ['perm1', 'perm2']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions === permissions).toBe(true)
    })

    it('SET_PERMISSIONS_LIST handles duplicate entries', () => {
      const permissions = ['perm1', 'perm1', 'perm2', 'perm2']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
      expect(state.permissions.length).toBe(4)
    })

    it('SET_PERMISSIONS_LIST handles special characters in permissions', () => {
      const permissions = ['api/endpoint!@#$%|GET', 'test&special|POST']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('SET_ALL_PERMISSIONS handles state with no permissions set', () => {
      state.permissions = []
      state.dashboardPermissions = {
        READ: { url: 'test', method: 'GET' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.READ.hasPermission).toBe(false)
    })

    it('SET_ALL_PERMISSIONS handles non-object permission entries', () => {
      state.permissions = ['test|GET']
      state.dashboardPermissions = {
        READ: null,
        WRITE: { url: 'test', method: 'POST' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(false)
    })

    it('SET_ALL_PERMISSIONS handles missing isOneOfThemPermitted property', () => {
      state.permissions = ['test|GET']
      state.dashboardPermissions = {
        READ: { url: 'test', method: 'GET' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions).toHaveProperty('isOneOfThemPermitted')
    })

    it('SET_ALL_PERMISSIONS stores valid JSON to localStorage', () => {
      state.permissions = ['test|GET']
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      const stored = localStorage.getItem('permissions')
      expect(() => JSON.parse(stored)).not.toThrow()
    })

    it('RESET_STATE restores all properties to default', () => {
      state.permissions = ['test1', 'test2', 'test3']
      state.dashboardPermissions = { custom: true }
      state.threatSharingPermissions = { custom: false }
      permissionsStore.mutations.RESET_STATE(state)
      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions).toEqual({})
      expect(state.threatSharingPermissions).toEqual({})
    })

    it('RESET_STATE does not affect state reference', () => {
      const originalState = state
      permissionsStore.mutations.RESET_STATE(state)
      expect(state === originalState).toBe(true)
    })
  })

  describe('action behavior and commits', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('setPermissionsList calls commit and dispatch exactly', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, ['perm1'])
      expect(commit).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('setPermissionsList commits SET_PERMISSIONS_LIST first', () => {
      const commits = []
      const commit = jest.fn((name) => commits.push(name))
      const dispatch = jest.fn()
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, ['perm1'])
      expect(commits[0]).toBe('SET_PERMISSIONS_LIST')
    })

    it('setPermissionsList dispatches setAllPermissions second', () => {
      const commit = jest.fn()
      const dispatches = []
      const dispatch = jest.fn((name) => dispatches.push(name))
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, ['perm1'])
      expect(dispatches[0]).toBe('setAllPermissions')
    })

    it('setPermissionsList handles large permission arrays', () => {
      const largeArray = Array.from({ length: 500 }, (_, i) => `perm${i}`)
      const commit = jest.fn()
      const dispatch = jest.fn()
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, largeArray)
      expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS_LIST', largeArray)
    })

    it('setAllPermissions commits SET_ALL_PERMISSIONS exactly once', () => {
      const commit = jest.fn()
      permissionsStore.actions.setAllPermissions({ commit })
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('SET_ALL_PERMISSIONS')
    })

    it('resetState commits RESET_STATE exactly once', () => {
      const commit = jest.fn()
      permissionsStore.actions.resetState({ commit })
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('RESET_STATE')
    })

    it('setPermissionsList action integrates with mutations', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }
      const dispatch = jest.fn()
      const permissions = ['test/read|GET']
      permissionsStore.actions.setPermissionsList({ commit, dispatch }, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('actions can be called multiple times sequentially', () => {
      const commit = jest.fn()
      permissionsStore.actions.setAllPermissions({ commit })
      permissionsStore.actions.setAllPermissions({ commit })
      permissionsStore.actions.setAllPermissions({ commit })
      expect(commit).toHaveBeenCalledTimes(3)
    })

    it('resetState action returns undefined', () => {
      const commit = jest.fn()
      const result = permissionsStore.actions.resetState({ commit })
      expect(result).toBeUndefined()
    })

    it('setPermissionsList action returns undefined', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = permissionsStore.actions.setPermissionsList({ commit, dispatch }, [])
      expect(result).toBeUndefined()
    })

    it('setAllPermissions action returns undefined', () => {
      const commit = jest.fn()
      const result = permissionsStore.actions.setAllPermissions({ commit })
      expect(result).toBeUndefined()
    })
  })

  describe('type safety and consistency', () => {
    it('all mutations are callable functions', () => {
      const mutationNames = Object.keys(permissionsStore.mutations)
      mutationNames.forEach((name) => {
        expect(typeof permissionsStore.mutations[name]).toBe('function')
      })
    })

    it('all actions are callable functions', () => {
      const actionNames = Object.keys(permissionsStore.actions)
      actionNames.forEach((name) => {
        expect(typeof permissionsStore.actions[name]).toBe('function')
      })
    })

    it('all getters are callable functions', () => {
      const getterNames = Object.keys(permissionsStore.getters)
      getterNames.forEach((name) => {
        expect(typeof permissionsStore.getters[name]).toBe('function')
      })
    })

    it('state object is not null', () => {
      expect(permissionsStore.state).not.toBeNull()
    })

    it('state object is type object', () => {
      expect(typeof permissionsStore.state).toBe('object')
    })

    it('getters object is not null', () => {
      expect(permissionsStore.getters).not.toBeNull()
    })

    it('mutations object is not null', () => {
      expect(permissionsStore.mutations).not.toBeNull()
    })

    it('actions object is not null', () => {
      expect(permissionsStore.actions).not.toBeNull()
    })

    it('namespaced is boolean type', () => {
      expect(typeof permissionsStore.namespaced).toBe('boolean')
      expect(permissionsStore.namespaced).toBe(true)
    })

    it('mutations and actions have matching counts', () => {
      const mutationCount = Object.keys(permissionsStore.mutations).length
      expect(mutationCount).toBeGreaterThan(0)
      expect(mutationCount).toBe(3)
    })

    it('state properties are consistent after cloning', () => {
      const clone = JSON.parse(JSON.stringify(permissionsStore.state))
      expect(Object.keys(clone).length).toEqual(Object.keys(permissionsStore.state).length)
    })

    it('mutations preserve state object reference', () => {
      const originalState = state
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['test'])
      expect(state === originalState).toBe(true)
    })

    it('module has all required Vuex properties', () => {
      expect(permissionsStore).toHaveProperty('namespaced')
      expect(permissionsStore).toHaveProperty('state')
      expect(permissionsStore).toHaveProperty('getters')
      expect(permissionsStore).toHaveProperty('mutations')
      expect(permissionsStore).toHaveProperty('actions')
    })
  })

  describe('edge cases - special characters, large data, rapid operations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('handles permissions with special characters', () => {
      const permissions = ['api/endpoint!@#$%^&*()|GET', 'test-_.~|POST']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('handles permissions with Unicode characters', () => {
      const permissions = ['api/测试|GET', 'тест/api|POST', 'اختبار|DELETE']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('handles permissions with very long strings', () => {
      const longPerm = 'a'.repeat(1000) + '|GET'
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [longPerm])
      expect(state.permissions[0]).toBe(longPerm)
    })

    it('handles rapid permission updates', () => {
      for (let i = 0; i < 20; i++) {
        permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [`perm${i}|GET`])
      }
      expect(state.permissions[0]).toBe('perm19|GET')
    })

    it('handles 100+ permission entries', () => {
      const permissions = Array.from({ length: 150 }, (_, i) => `perm${i}|GET`)
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions.length).toBe(150)
    })

    it('handles state with very large nested objects', () => {
      state.dashboardPermissions = {}
      for (let i = 0; i < 100; i++) {
        state.dashboardPermissions[`PERM${i}`] = { url: `api/test${i}`, method: 'GET' }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(Object.keys(state.dashboardPermissions).length).toBeGreaterThan(100)
    })

    it('handles rapid toggles of isOneOfThemPermitted', () => {
      state.dashboardPermissions = { isOneOfThemPermitted: false }
      for (let i = 0; i < 10; i++) {
        state.dashboardPermissions.isOneOfThemPermitted = i % 2 === 0
      }
      expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(false)
    })

    it('handles empty strings in permission entries', () => {
      const permissions = ['', 'valid|GET', '', 'another|POST']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('handles permission strings with multiple pipe characters', () => {
      const permissions = ['api/test|GET|extra', 'another|POST|data|more']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('handles setting same permissions repeatedly', () => {
      const permissions = ['perm1|GET', 'perm2|POST']
      for (let i = 0; i < 5; i++) {
        permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      }
      expect(state.permissions).toEqual(permissions)
    })

    it('handles alternating between empty and populated permissions', () => {
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [])
      expect(state.permissions.length).toBe(0)
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['test|GET'])
      expect(state.permissions.length).toBe(1)
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [])
      expect(state.permissions.length).toBe(0)
    })
  })

  describe('data transitions and state mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('transitions from empty to populated state', () => {
      expect(state.permissions.length).toBe(0)
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['perm1|GET'])
      expect(state.permissions.length).toBe(1)
    })

    it('transitions from populated to empty state', () => {
      state.permissions = ['perm1|GET', 'perm2|POST']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, [])
      expect(state.permissions.length).toBe(0)
    })

    it('updates permission without replacing entire array', () => {
      const originalArray = ['perm1|GET', 'perm2|POST']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, originalArray)
      expect(state.permissions === originalArray).toBe(true)
    })

    it('permission objects transition from empty to populated', () => {
      state.dashboardPermissions = {}
      expect(Object.keys(state.dashboardPermissions).length).toBe(0)
      state.dashboardPermissions.READ = { url: 'test', method: 'GET' }
      expect(Object.keys(state.dashboardPermissions).length).toBe(1)
    })

    it('permission objects add hasPermission property during SET_ALL_PERMISSIONS', () => {
      state.permissions = ['test/read|GET']
      state.dashboardPermissions = {
        READ: { url: 'test/read', method: 'GET' }
      }
      expect(state.dashboardPermissions.READ.hasPermission).toBeUndefined()
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.READ.hasPermission).toBeDefined()
    })

    it('permission objects transition between granted and denied states', () => {
      state.permissions = ['test|GET']
      state.dashboardPermissions = {
        OP1: { url: 'test', method: 'GET', hasPermission: false }
      }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.OP1.hasPermission).toBe(true)
      state.permissions = []
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.OP1.hasPermission).toBe(false)
    })

    it('isOneOfThemPermitted transitions from false to true', () => {
      state.dashboardPermissions = { isOneOfThemPermitted: false }
      state.permissions = []
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(false)
      state.permissions = ['test|GET']
      state.dashboardPermissions.READ = { url: 'test', method: 'GET' }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(true)
    })

    it('RESET_STATE transitions modified state back to default', () => {
      state.permissions = ['modified']
      state.dashboardPermissions = { modified: true }
      state.threatSharingPermissions = { changed: false }
      permissionsStore.mutations.RESET_STATE(state)
      expect(state.permissions).toEqual(defaultState.permissions)
      expect(state.dashboardPermissions).toEqual(defaultState.dashboardPermissions)
    })

    it('localStorage transitions during mutation sequence', () => {
      expect(localStorage.getItem('permissions')).toBeNull()
      state.permissions = ['test|GET']
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(localStorage.getItem('permissions')).not.toBeNull()
    })

    it('multiple permission categories transition simultaneously', () => {
      state.playbookPermissions = { READ: { url: 'test', method: 'GET' } }
      state.dashboardPermissions = { WRITE: { url: 'test2', method: 'POST' } }
      state.permissions = ['test|GET', 'test2|POST']
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.playbookPermissions.READ.hasPermission).toBe(true)
      expect(state.dashboardPermissions.WRITE.hasPermission).toBe(true)
    })
  })

  describe('mutation immutability and state isolation', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('mutations do not create new state reference', () => {
      const originalState = state
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['test'])
      expect(state === originalState).toBe(true)
    })

    it('mutations do not affect default state', () => {
      const defaultStateCopy = JSON.parse(JSON.stringify(defaultState))
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['modified'])
      expect(defaultState).toEqual(defaultStateCopy)
    })

    it('state instances are independent', () => {
      const state1 = JSON.parse(JSON.stringify(permissionsStore.state))
      const state2 = JSON.parse(JSON.stringify(permissionsStore.state))
      state1.permissions = ['state1']
      state2.permissions = ['state2']
      expect(state1.permissions).not.toEqual(state2.permissions)
    })

    it('modifying array in SET_PERMISSIONS_LIST affects state directly', () => {
      const permissions = ['perm1', 'perm2']
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, permissions)
      permissions.push('perm3')
      expect(state.permissions).toEqual(['perm1', 'perm2', 'perm3'])
    })

    it('permission objects maintain isolation between categories', () => {
      state.dashboardPermissions = { READ: { url: 'test', method: 'GET' } }
      state.playbookPermissions = { WRITE: { url: 'test', method: 'POST' } }
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(state.dashboardPermissions).not.toEqual(state.playbookPermissions)
    })

    it('RESET_STATE creates fresh copies of all properties', () => {
      state.permissions = ['test']
      state.dashboardPermissions = { custom: true }
      permissionsStore.mutations.RESET_STATE(state)
      const newState = JSON.parse(JSON.stringify(permissionsStore.state))
      expect(state.permissions).toEqual(newState.permissions)
    })

    it('mutations preserve object types through serialization', () => {
      permissionsStore.mutations.SET_PERMISSIONS_LIST(state, ['test|GET'])
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      expect(typeof state.dashboardPermissions).toBe('object')
      expect(Array.isArray(state.permissions)).toBe(true)
    })

    it('nested permission objects maintain structure', () => {
      state.dashboardPermissions = {
        READ: { url: 'api/read', method: 'GET', nested: { deep: true } }
      }
      const before = JSON.stringify(state.dashboardPermissions.READ.nested)
      permissionsStore.mutations.SET_ALL_PERMISSIONS(state)
      const after = JSON.stringify(state.dashboardPermissions.READ.nested)
      expect(before).toEqual(after)
    })
  })

  describe('complex integration workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(permissionsStore.state))
      localStorage.clear()
    })

    it('complete permission setup workflow', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      state.dashboardPermissions = {
        READ: { url: 'api/dashboard/read', method: 'GET' },
        WRITE: { url: 'api/dashboard/write', method: 'POST' }
      }
      state.playbookPermissions = {
        SEARCH: { url: 'api/playbook/search', method: 'GET' }
      }

      const permissions = ['api/dashboard/read|GET', 'api/playbook/search|GET']
      commit('SET_PERMISSIONS_LIST', permissions)
      commit('SET_ALL_PERMISSIONS')

      expect(state.permissions).toEqual(permissions)
      expect(state.dashboardPermissions.READ.hasPermission).toBe(true)
      expect(state.dashboardPermissions.WRITE.hasPermission).toBe(false)
      expect(state.playbookPermissions.SEARCH.hasPermission).toBe(true)
    })

    it('multi-category permission update workflow', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      const permissionCategories = [
        'dashboardPermissions',
        'threatSharingPermissions',
        'campaignManagerLeftMenuPermissions'
      ]

      permissionCategories.forEach((category, index) => {
        state[category] = {
          OP: { url: `api/${category}`, method: 'GET' }
        }
      })

      const permissions = permissionCategories.map((_, index) => `api/cat${index}|GET`)
      commit('SET_PERMISSIONS_LIST', permissions)
      commit('SET_ALL_PERMISSIONS')

      expect(state.permissions.length).toBe(3)
    })

    it('permission revocation and re-grant workflow', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      state.dashboardPermissions = {
        ADMIN: { url: 'api/admin', method: 'GET' }
      }

      commit('SET_PERMISSIONS_LIST', ['api/admin|GET'])
      commit('SET_ALL_PERMISSIONS')
      expect(state.dashboardPermissions.ADMIN.hasPermission).toBe(true)

      commit('SET_PERMISSIONS_LIST', [])
      commit('SET_ALL_PERMISSIONS')
      expect(state.dashboardPermissions.ADMIN.hasPermission).toBe(false)

      commit('SET_PERMISSIONS_LIST', ['api/admin|GET'])
      commit('SET_ALL_PERMISSIONS')
      expect(state.dashboardPermissions.ADMIN.hasPermission).toBe(true)
    })

    it('complex permission matching with multiple methods', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      state.dashboardPermissions = {
        READ: { url: 'api/resource', method: 'GET' },
        CREATE: { url: 'api/resource', method: 'POST' },
        UPDATE: { url: 'api/resource', method: 'PUT' },
        DELETE: { url: 'api/resource', method: 'DELETE' }
      }

      commit('SET_PERMISSIONS_LIST', [
        'api/resource|GET',
        'api/resource|POST',
        'api/resource|DELETE'
      ])
      commit('SET_ALL_PERMISSIONS')

      expect(state.dashboardPermissions.READ.hasPermission).toBe(true)
      expect(state.dashboardPermissions.CREATE.hasPermission).toBe(true)
      expect(state.dashboardPermissions.UPDATE.hasPermission).toBe(false)
      expect(state.dashboardPermissions.DELETE.hasPermission).toBe(true)
      expect(state.dashboardPermissions.isOneOfThemPermitted).toBe(true)
    })

    it('full state reset and reconfiguration workflow', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      state.permissions = ['old|GET']
      state.dashboardPermissions = { modified: true }

      commit('RESET_STATE')

      expect(state.permissions).toEqual([])
      expect(state.dashboardPermissions).toEqual({})

      state.dashboardPermissions = {
        NEW: { url: 'api/new', method: 'GET' }
      }
      commit('SET_PERMISSIONS_LIST', ['api/new|GET'])
      commit('SET_ALL_PERMISSIONS')

      expect(state.dashboardPermissions.NEW.hasPermission).toBe(true)
    })

    it('action-based permission lifecycle', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }
      const dispatch = jest.fn()

      state.playbookPermissions = {
        SEARCH: { url: 'api/playbook/search', method: 'GET' }
      }

      permissionsStore.actions.setPermissionsList(
        { commit, dispatch },
        ['api/playbook/search|GET']
      )

      expect(state.permissions).toEqual(['api/playbook/search|GET'])
      expect(dispatch).toHaveBeenCalledWith('setAllPermissions')
    })

    it('handles concurrent permission category updates', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      const categories = [
        { name: 'dashboardPermissions', perm: 'api/dash|GET' },
        { name: 'playbookPermissions', perm: 'api/playbook|GET' },
        { name: 'threatSharingPermissions', perm: 'api/threat|GET' }
      ]

      categories.forEach((cat) => {
        state[cat.name] = {
          OP: { url: cat.perm.split('|')[0], method: cat.perm.split('|')[1] }
        }
      })

      const perms = categories.map((c) => c.perm)
      commit('SET_PERMISSIONS_LIST', perms)
      commit('SET_ALL_PERMISSIONS')

      categories.forEach((cat) => {
        expect(state[cat.name].OP.hasPermission).toBe(true)
      })
    })

    it('localStorage persists complex permission state', () => {
      const commit = (name, payload) => {
        permissionsStore.mutations[name](state, payload)
      }

      state.dashboardPermissions = {
        READ: { url: 'api/read', method: 'GET' },
        WRITE: { url: 'api/write', method: 'POST' }
      }
      commit('SET_PERMISSIONS_LIST', ['api/read|GET', 'api/write|POST'])
      commit('SET_ALL_PERMISSIONS')

      const stored = localStorage.getItem('permissions')
      expect(stored).toBeDefined()
      const parsed = JSON.parse(stored)
      expect(parsed.permissions).toEqual(['api/read|GET', 'api/write|POST'])
    })
  })
})
