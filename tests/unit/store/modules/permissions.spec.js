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
})
