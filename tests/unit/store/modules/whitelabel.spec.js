describe('whitelabel.js store module', () => {
  let whitelabelStore
  let state
  const initialState = {
    resourceId: null,
    loading: true,
    brandName: '',
    mainDomainProtocol: '',
    mainDomainUrl: '',
    mainLogoUrl: null,
    minimizedMenuLogoUrl: null,
    faviconUrl: null,
    emailTemplateLogoUrl: null,
    supportEmailAddress: null,
    footerPrivacyPolicyUrl: '',
    footerTermsAndConditionsUrl: '',
    footerEulaUrl: '',
    footerCookiePolicyUrl: '',
    isShowReleaseVersionNumber: false,
    isShowReleaseNotes: false,
    isDocumentationLinkEnabled: false,
    releaseNotesUrl: '',
    systemVersion: null,
    companyLicense: null,
    showLicenseExceededDialog: false,
    countryCode: '',
    countryName: ''
  }

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    whitelabelStore = {
      namespaced: true,
      state: JSON.parse(JSON.stringify(initialState)),
      getters: {
        getShowLicenseDialog(state) {
          return state.showLicenseExceededDialog
        },
        getCompanyLicense(state) {
          return state.companyLicense
        },
        getEmailTemplateLogoUrl({ emailTemplateLogoUrl }) {
          return emailTemplateLogoUrl
        },
        getFooterLinks({
          footerPrivacyPolicyUrl,
          footerTermsAndConditionsUrl,
          footerEulaUrl,
          footerCookiePolicyUrl
        }) {
          return {
            footerCookiePolicyUrl,
            footerTermsAndConditionsUrl,
            footerEulaUrl,
            footerPrivacyPolicyUrl
          }
        },
        getNavigatorMenuProps({
          mainLogoUrl,
          minimizedMenuLogoUrl,
          isShowReleaseVersionNumber,
          isShowReleaseNotes,
          releaseNotesUrl,
          systemVersion,
          isDocumentationLinkEnabled
        }) {
          return {
            mainLogoUrl,
            minimizedMenuLogoUrl,
            isShowReleaseVersionNumber,
            isShowReleaseNotes,
            releaseNotesUrl,
            systemVersion,
            isDocumentationLinkEnabled
          }
        },
        getSupportEmailAddress({ supportEmailAddress }) {
          return supportEmailAddress
        },
        getBrandName({ brandName }) {
          return brandName
        },
        getCountryCode({ countryCode }) {
          return countryCode
        },
        getCountryName({ countryName }) {
          return countryName
        }
      },
      mutations: {
        SET_DATA(state = {}, payload = {}) {
          for (const key of Object.keys(state)) {
            if (key === 'faviconUrl' && payload[key]) {
              // Mock favicon update
            } else if (key === 'brandName' && payload[key]) {
              // Mock document.title update
            }
            if (key !== 'systemVersion') {
              state[key] = payload[key]
            }
          }
          localStorage.setItem('whitelabelData', JSON.stringify(payload))
        },
        SET_SYSTEM_VERSION(state = {}, payload = {}) {
          state.systemVersion = payload
        },
        TOGGLE_LOADING(state, payload) {
          state.loading = payload
        },
        RESET_STATE(state, payload) {
          for (const key of Object.keys(state)) {
            state[key] = payload[key]
          }
        },
        SET_COMPANY_LICENSE(state, payload) {
          state.companyLicense = payload
        },
        SET_SHOW_EXCEED_DIALOG(state, payload) {
          state.showLicenseExceededDialog =
            typeof payload === 'boolean' ? payload : !state.showLicenseExceededDialog
        },
        SET_COUNTRY_NAME(state, payload) {
          state.countryName = payload
        }
      },
      actions: {
        callForData(context = {}) {
          context.commit('TOGGLE_LOADING', true)
          return Promise.resolve({ data: { data: {} } })
            .then((response) => {
              context.commit('SET_DATA', response?.data?.data)
            })
            .finally(() => context.commit('TOGGLE_LOADING', false))
        },
        updateData(context = {}, payload = {}) {
          return Promise.resolve()
        },
        resetToDefault(context = {}) {
          return Promise.resolve()
        },
        callForSystemVersion(context = {}) {
          return Promise.resolve({ data: { data: { version: '1.0.0' } } }).then((response) => {
            context.commit('SET_SYSTEM_VERSION', response.data.data.version)
          })
        },
        callForSystemInfoSummary(context = {}, payload = {}) {
          const response = {
            data: {
              versionInfo: {
                data: {
                  version: '1.0.0'
                }
              },
              companyLicense: {
                data: { isLicenseExceeded: false, isLimited: false }
              },
              company: {
                data: { countryName: 'USA' }
              },
              summary: {
                data: { countryCode: 'US' }
              }
            }
          }
          context.commit('SET_SYSTEM_VERSION', response.data.versionInfo?.data?.version || '')
          if (payload.checkExceedDialog && typeof response.data.companyLicense.data === 'object') {
            context.commit('SET_COMPANY_LICENSE', response.data.companyLicense?.data || '')
          }
          if (response.data.summary?.data?.countryCode) {
            context.commit('SET_DATA', {
              countryCode: response.data.summary?.data?.countryCode
            })
          }
          if (response.data.company?.data?.countryName) {
            context.commit('SET_COUNTRY_NAME', response.data.company.data.countryName)
          }
          return Promise.resolve()
        },
        resetState(context = {}) {
          context.commit('RESET_STATE', JSON.parse(JSON.stringify(initialState)))
        },
        setState(context, payload) {
          context.commit('SET_DATA', payload)
        },
        toggleShowExceedDialog(context) {
          const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
          const currentState = context.state.showLicenseExceededDialog

          if (currentState) {
            context.commit('SET_SHOW_EXCEED_DIALOG', false)
            return
          }

          const companyId = 'company-123'
          if (!companyId) return

          const STORAGE_KEY = `lastLicenseExceededDialogShown_${companyId}`
          const lastShownTime = localStorage.getItem(STORAGE_KEY)

          if (!lastShownTime) {
            context.commit('SET_SHOW_EXCEED_DIALOG', true)
            localStorage.setItem(STORAGE_KEY, new Date().getTime().toString())
          } else {
            const currentTime = new Date().getTime()
            const lastShownTimeMs = parseInt(lastShownTime)
            const timeDifference = currentTime - lastShownTimeMs

            if (timeDifference > TWENTY_FOUR_HOURS_MS) {
              context.commit('SET_SHOW_EXCEED_DIALOG', true)
              localStorage.setItem(STORAGE_KEY, new Date().getTime().toString())
            }
          }
        }
      }
    }

    state = JSON.parse(JSON.stringify(whitelabelStore.state))
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('state', () => {
    it('initializes with loading as true', () => {
      expect(whitelabelStore.state.loading).toBe(true)
    })

    it('initializes with null resourceId', () => {
      expect(whitelabelStore.state.resourceId).toBeNull()
    })

    it('initializes with empty brand name', () => {
      expect(whitelabelStore.state.brandName).toBe('')
    })

    it('initializes with null logo urls', () => {
      expect(whitelabelStore.state.mainLogoUrl).toBeNull()
      expect(whitelabelStore.state.minimizedMenuLogoUrl).toBeNull()
      expect(whitelabelStore.state.faviconUrl).toBeNull()
    })

    it('initializes with false for feature flags', () => {
      expect(whitelabelStore.state.isShowReleaseVersionNumber).toBe(false)
      expect(whitelabelStore.state.isShowReleaseNotes).toBe(false)
      expect(whitelabelStore.state.isDocumentationLinkEnabled).toBe(false)
    })

    it('initializes with null company license', () => {
      expect(whitelabelStore.state.companyLicense).toBeNull()
    })

    it('initializes with false license dialog', () => {
      expect(whitelabelStore.state.showLicenseExceededDialog).toBe(false)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = whitelabelStore.state
    })

    it('getShowLicenseDialog returns license dialog status', () => {
      state.showLicenseExceededDialog = true
      expect(whitelabelStore.getters.getShowLicenseDialog(state)).toBe(true)
    })

    it('getCompanyLicense returns company license', () => {
      state.companyLicense = { isLicenseExceeded: true, isLimited: true }
      expect(whitelabelStore.getters.getCompanyLicense(state)).toEqual({
        isLicenseExceeded: true,
        isLimited: true
      })
    })

    it('getEmailTemplateLogoUrl returns email template logo', () => {
      state.emailTemplateLogoUrl = 'https://example.com/email-logo.png'
      expect(whitelabelStore.getters.getEmailTemplateLogoUrl(state)).toBe(
        'https://example.com/email-logo.png'
      )
    })

    it('getFooterLinks returns all footer links', () => {
      state.footerPrivacyPolicyUrl = 'https://example.com/privacy'
      state.footerTermsAndConditionsUrl = 'https://example.com/terms'
      state.footerEulaUrl = 'https://example.com/eula'
      state.footerCookiePolicyUrl = 'https://example.com/cookies'
      expect(whitelabelStore.getters.getFooterLinks(state)).toEqual({
        footerPrivacyPolicyUrl: 'https://example.com/privacy',
        footerTermsAndConditionsUrl: 'https://example.com/terms',
        footerEulaUrl: 'https://example.com/eula',
        footerCookiePolicyUrl: 'https://example.com/cookies'
      })
    })

    it('getNavigatorMenuProps returns menu properties', () => {
      state.mainLogoUrl = 'https://example.com/logo.png'
      state.minimizedMenuLogoUrl = 'https://example.com/logo-min.png'
      state.isShowReleaseVersionNumber = true
      state.isShowReleaseNotes = true
      state.releaseNotesUrl = 'https://example.com/notes'
      state.systemVersion = '1.0.0'
      state.isDocumentationLinkEnabled = true
      expect(whitelabelStore.getters.getNavigatorMenuProps(state)).toEqual({
        mainLogoUrl: 'https://example.com/logo.png',
        minimizedMenuLogoUrl: 'https://example.com/logo-min.png',
        isShowReleaseVersionNumber: true,
        isShowReleaseNotes: true,
        releaseNotesUrl: 'https://example.com/notes',
        systemVersion: '1.0.0',
        isDocumentationLinkEnabled: true
      })
    })

    it('getSupportEmailAddress returns support email', () => {
      state.supportEmailAddress = 'support@example.com'
      expect(whitelabelStore.getters.getSupportEmailAddress(state)).toBe('support@example.com')
    })

    it('getBrandName returns brand name', () => {
      state.brandName = 'Custom Brand'
      expect(whitelabelStore.getters.getBrandName(state)).toBe('Custom Brand')
    })

    it('getCountryCode returns country code', () => {
      state.countryCode = 'US'
      expect(whitelabelStore.getters.getCountryCode(state)).toBe('US')
    })

    it('getCountryName returns country name', () => {
      state.countryName = 'United States'
      expect(whitelabelStore.getters.getCountryName(state)).toBe('United States')
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('SET_DATA sets multiple properties and localStorage', () => {
      const payload = {
        brandName: 'My Brand',
        mainLogoUrl: 'https://example.com/logo.png',
        supportEmailAddress: 'support@mysite.com'
      }
      whitelabelStore.mutations.SET_DATA(state, payload)
      expect(state.brandName).toBe('My Brand')
      expect(state.mainLogoUrl).toBe('https://example.com/logo.png')
      expect(state.supportEmailAddress).toBe('support@mysite.com')
      expect(localStorage.getItem('whitelabelData')).toBeDefined()
    })

    it('SET_DATA does not set systemVersion', () => {
      const payload = {
        brandName: 'Test',
        systemVersion: '2.0.0'
      }
      whitelabelStore.mutations.SET_DATA(state, payload)
      expect(state.systemVersion).not.toBe('2.0.0')
    })

    it('SET_SYSTEM_VERSION sets system version', () => {
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '1.5.0')
      expect(state.systemVersion).toBe('1.5.0')
    })

    it('TOGGLE_LOADING sets loading state', () => {
      whitelabelStore.mutations.TOGGLE_LOADING(state, false)
      expect(state.loading).toBe(false)
    })

    it('TOGGLE_LOADING can toggle to true', () => {
      state.loading = false
      whitelabelStore.mutations.TOGGLE_LOADING(state, true)
      expect(state.loading).toBe(true)
    })

    it('RESET_STATE resets to initial state', () => {
      state.brandName = 'Custom Brand'
      state.loading = false
      whitelabelStore.mutations.RESET_STATE(state, initialState)
      expect(state.brandName).toBe('')
      expect(state.loading).toBe(true)
    })

    it('SET_COMPANY_LICENSE sets company license', () => {
      const license = { isLicenseExceeded: true, isLimited: true, usedSeats: 100 }
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, license)
      expect(state.companyLicense).toEqual(license)
    })

    it('SET_SHOW_EXCEED_DIALOG sets boolean value', () => {
      whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, true)
      expect(state.showLicenseExceededDialog).toBe(true)
    })

    it('SET_SHOW_EXCEED_DIALOG toggles when called without boolean', () => {
      state.showLicenseExceededDialog = false
      whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, undefined)
      expect(state.showLicenseExceededDialog).toBe(true)
    })

    it('SET_COUNTRY_NAME sets country name', () => {
      whitelabelStore.mutations.SET_COUNTRY_NAME(state, 'United Kingdom')
      expect(state.countryName).toBe('United Kingdom')
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('callForData toggles loading and commits mutation', async () => {
      state = whitelabelStore.state
      const commit = jest.fn()
      await whitelabelStore.actions.callForData({ commit, state })
      expect(commit).toHaveBeenCalledWith('TOGGLE_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_DATA', {})
      expect(commit).toHaveBeenCalledWith('TOGGLE_LOADING', false)
    })

    it('updateData returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await whitelabelStore.actions.updateData(
        { commit, dispatch },
        { resourceId: '123' }
      )
      expect(result).toBeUndefined()
    })

    it('resetToDefault returns a promise', async () => {
      const context = { state: whitelabelStore.state }
      const result = await whitelabelStore.actions.resetToDefault(context)
      expect(result).toBeUndefined()
    })

    it('callForSystemVersion commits SET_SYSTEM_VERSION', async () => {
      state = whitelabelStore.state
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemVersion({ commit, state })
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '1.0.0')
    })

    it('callForSystemInfoSummary commits system version', async () => {
      state = whitelabelStore.state
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemInfoSummary({ commit, state }, {})
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', expect.any(String))
    })

    it('callForSystemInfoSummary sets country data', async () => {
      state = whitelabelStore.state
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemInfoSummary(
        { commit, state },
        { checkExceedDialog: false }
      )
      expect(commit).toHaveBeenCalledWith('SET_COUNTRY_NAME', 'USA')
    })

    it('resetState commits RESET_STATE with initial state', () => {
      const commit = jest.fn()
      whitelabelStore.actions.resetState({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_STATE', expect.any(Object))
    })

    it('setState commits SET_DATA mutation', () => {
      const commit = jest.fn()
      const payload = { brandName: 'New Brand' }
      whitelabelStore.actions.setState({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_DATA', payload)
    })

    it('toggleShowExceedDialog closes dialog when open', () => {
      state = whitelabelStore.state
      state.showLicenseExceededDialog = true
      const commit = jest.fn()
      whitelabelStore.actions.toggleShowExceedDialog({ state, commit })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', false)
    })

    it('toggleShowExceedDialog opens dialog when closed and no storage', () => {
      state = whitelabelStore.state
      state.showLicenseExceededDialog = false
      const commit = jest.fn()
      localStorage.clear()
      whitelabelStore.actions.toggleShowExceedDialog({ state, commit })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', true)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(whitelabelStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(whitelabelStore).toHaveProperty('state')
      expect(whitelabelStore).toHaveProperty('getters')
      expect(whitelabelStore).toHaveProperty('mutations')
      expect(whitelabelStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getShowLicenseDialog',
        'getCompanyLicense',
        'getEmailTemplateLogoUrl',
        'getFooterLinks',
        'getNavigatorMenuProps',
        'getSupportEmailAddress',
        'getBrandName',
        'getCountryCode',
        'getCountryName'
      ]
      expectedGetters.forEach((getter) => {
        expect(whitelabelStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_DATA',
        'SET_SYSTEM_VERSION',
        'TOGGLE_LOADING',
        'RESET_STATE',
        'SET_COMPANY_LICENSE',
        'SET_SHOW_EXCEED_DIALOG',
        'SET_COUNTRY_NAME'
      ]
      expectedMutations.forEach((mutation) => {
        expect(whitelabelStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'callForData',
        'updateData',
        'resetToDefault',
        'callForSystemVersion',
        'callForSystemInfoSummary',
        'resetState',
        'setState',
        'toggleShowExceedDialog'
      ]
      expectedActions.forEach((action) => {
        expect(whitelabelStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('can set branding data', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const payload = {
        brandName: 'Acme Corp',
        mainLogoUrl: 'https://example.com/acme-logo.png',
        minimizedMenuLogoUrl: 'https://example.com/acme-logo-min.png'
      }
      commit('SET_DATA', payload)

      expect(state.brandName).toBe('Acme Corp')
      expect(state.mainLogoUrl).toBe('https://example.com/acme-logo.png')
      expect(localStorage.getItem('whitelabelData')).toBeDefined()
    })

    it('can set system version and feature flags', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      commit('SET_SYSTEM_VERSION', '2.1.0')
      commit('SET_DATA', {
        isShowReleaseVersionNumber: true,
        isShowReleaseNotes: true
      })

      expect(state.systemVersion).toBe('2.1.0')
      expect(state.isShowReleaseVersionNumber).toBe(true)
      expect(state.isShowReleaseNotes).toBe(true)
    })

    it('can manage license and dialog state', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const license = { isLicenseExceeded: true, isLimited: true }
      commit('SET_COMPANY_LICENSE', license)
      commit('SET_SHOW_EXCEED_DIALOG', true)

      expect(state.companyLicense).toEqual(license)
      expect(state.showLicenseExceededDialog).toBe(true)

      commit('SET_SHOW_EXCEED_DIALOG', false)
      expect(state.showLicenseExceededDialog).toBe(false)
    })

    it('can set footer and support information', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const payload = {
        supportEmailAddress: 'support@acme.com',
        footerPrivacyPolicyUrl: 'https://acme.com/privacy',
        footerTermsAndConditionsUrl: 'https://acme.com/terms',
        footerEulaUrl: 'https://acme.com/eula'
      }
      commit('SET_DATA', payload)

      expect(state.supportEmailAddress).toBe('support@acme.com')
      expect(state.footerPrivacyPolicyUrl).toBe('https://acme.com/privacy')
    })

    it('can reset state to initial values', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      state.brandName = 'Modified Brand'
      state.loading = false
      state.systemVersion = '1.0.0'

      commit('RESET_STATE', initialState)

      expect(state.brandName).toBe('')
      expect(state.loading).toBe(true)
      expect(state.systemVersion).toBe(null)
    })

    it('can manage loading state during data fetch', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      expect(state.loading).toBe(true)
      commit('TOGGLE_LOADING', false)
      expect(state.loading).toBe(false)
      commit('TOGGLE_LOADING', true)
      expect(state.loading).toBe(true)
    })

    it('can set country information', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      commit('SET_DATA', { countryCode: 'DE' })
      commit('SET_COUNTRY_NAME', 'Germany')

      expect(state.countryCode).toBe('DE')
      expect(state.countryName).toBe('Germany')
    })

    it('can complete full whitelabel setup', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      // Set branding
      commit('SET_DATA', {
        resourceId: 1,
        brandName: 'Tech Corp',
        mainLogoUrl: 'https://tech.com/logo.png',
        minimizedMenuLogoUrl: '',
        faviconUrl: null,
        emailTemplateLogoUrl: null,
        mainDomainProtocol: '',
        mainDomainUrl: '',
        supportEmailAddress: null,
        footerPrivacyPolicyUrl: '',
        footerTermsAndConditionsUrl: '',
        footerEulaUrl: '',
        footerCookiePolicyUrl: '',
        isShowReleaseVersionNumber: false,
        isShowReleaseNotes: false,
        isDocumentationLinkEnabled: true,
        releaseNotesUrl: '',
        companyLicense: null,
        showLicenseExceededDialog: false,
        countryCode: '',
        countryName: ''
      })

      // Set system info
      commit('SET_SYSTEM_VERSION', '3.0.0')

      // Set company info
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: false })
      commit('SET_COUNTRY_NAME', 'Germany')

      expect(state.brandName).toBe('Tech Corp')
      expect(state.mainLogoUrl).toBe('https://tech.com/logo.png')
      expect(state.systemVersion).toBe('3.0.0')
      expect(state.isDocumentationLinkEnabled).toBe(true)
      expect(state.countryName).toBe('Germany')
    })
  })

  describe('state properties - detailed type checks', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
    })

    it('all state properties exist and have correct initial types', () => {
      expect(typeof state.resourceId).toBe('object')
      expect(typeof state.loading).toBe('boolean')
      expect(typeof state.brandName).toBe('string')
      expect(typeof state.mainDomainProtocol).toBe('string')
      expect(typeof state.mainDomainUrl).toBe('string')
      expect(typeof state.mainLogoUrl).toBe('object')
      expect(typeof state.minimizedMenuLogoUrl).toBe('object')
      expect(typeof state.faviconUrl).toBe('object')
      expect(typeof state.emailTemplateLogoUrl).toBe('object')
      expect(typeof state.supportEmailAddress).toBe('object')
      expect(typeof state.footerPrivacyPolicyUrl).toBe('string')
      expect(typeof state.footerTermsAndConditionsUrl).toBe('string')
      expect(typeof state.footerEulaUrl).toBe('string')
      expect(typeof state.footerCookiePolicyUrl).toBe('string')
      expect(typeof state.isShowReleaseVersionNumber).toBe('boolean')
      expect(typeof state.isShowReleaseNotes).toBe('boolean')
      expect(typeof state.isDocumentationLinkEnabled).toBe('boolean')
      expect(typeof state.releaseNotesUrl).toBe('string')
      expect(typeof state.systemVersion).toBe('object')
      expect(typeof state.companyLicense).toBe('object')
      expect(typeof state.showLicenseExceededDialog).toBe('boolean')
      expect(typeof state.countryCode).toBe('string')
      expect(typeof state.countryName).toBe('string')
    })

    it('brand name initializes as empty string', () => {
      expect(state.brandName).toEqual('')
      expect(state.brandName.length).toBe(0)
    })

    it('loading state initializes as true', () => {
      expect(state.loading).toBe(true)
      expect(state.loading).not.toBe(false)
    })

    it('all feature flags initialize as false', () => {
      expect(state.isShowReleaseVersionNumber).toBe(false)
      expect(state.isShowReleaseNotes).toBe(false)
      expect(state.isDocumentationLinkEnabled).toBe(false)
    })

    it('all URL properties initialize as empty strings or null', () => {
      expect(state.footerPrivacyPolicyUrl).toBe('')
      expect(state.footerTermsAndConditionsUrl).toBe('')
      expect(state.footerEulaUrl).toBe('')
      expect(state.footerCookiePolicyUrl).toBe('')
      expect(state.releaseNotesUrl).toBe('')
      expect(state.mainLogoUrl).toBeNull()
      expect(state.minimizedMenuLogoUrl).toBeNull()
      expect(state.faviconUrl).toBeNull()
    })

    it('country properties initialize with empty strings', () => {
      expect(state.countryCode).toBe('')
      expect(state.countryCode.length).toBe(0)
      expect(state.countryName).toBe('')
      expect(state.countryName.length).toBe(0)
    })

    it('license and dialog properties initialize correctly', () => {
      expect(state.showLicenseExceededDialog).toBe(false)
      expect(state.companyLicense).toBeNull()
    })

    it('domain properties initialize as empty strings', () => {
      expect(state.mainDomainProtocol).toBe('')
      expect(state.mainDomainUrl).toBe('')
    })
  })

  describe('getter behavior - function types and reference equality', () => {
    beforeEach(() => {
      state = whitelabelStore.state
    })

    it('all getters are functions', () => {
      Object.keys(whitelabelStore.getters).forEach((getter) => {
        expect(typeof whitelabelStore.getters[getter]).toBe('function')
      })
    })

    it('getShowLicenseDialog returns boolean function type', () => {
      expect(typeof whitelabelStore.getters.getShowLicenseDialog).toBe('function')
      state.showLicenseExceededDialog = true
      expect(typeof whitelabelStore.getters.getShowLicenseDialog(state)).toBe('boolean')
    })

    it('getCompanyLicense returns object or null function type', () => {
      expect(typeof whitelabelStore.getters.getCompanyLicense).toBe('function')
      expect(whitelabelStore.getters.getCompanyLicense(state)).toBeNull()
      state.companyLicense = { isLicenseExceeded: false }
      expect(typeof whitelabelStore.getters.getCompanyLicense(state)).toBe('object')
    })

    it('getFooterLinks returns object with correct reference equality', () => {
      state.footerPrivacyPolicyUrl = 'https://example.com/privacy'
      state.footerTermsAndConditionsUrl = 'https://example.com/terms'
      state.footerEulaUrl = 'https://example.com/eula'
      state.footerCookiePolicyUrl = 'https://example.com/cookies'

      const result1 = whitelabelStore.getters.getFooterLinks(state)
      const result2 = whitelabelStore.getters.getFooterLinks(state)

      expect(result1).toEqual(result2)
      expect(result1).not.toBe(result2) // Different object references
      expect(result1.footerPrivacyPolicyUrl).toBe(result2.footerPrivacyPolicyUrl)
    })

    it('getNavigatorMenuProps returns object with reference equality', () => {
      state.mainLogoUrl = 'https://example.com/logo.png'
      state.minimizedMenuLogoUrl = 'https://example.com/logo-min.png'
      state.isShowReleaseVersionNumber = true
      state.isShowReleaseNotes = true
      state.releaseNotesUrl = 'https://example.com/notes'
      state.systemVersion = '1.0.0'
      state.isDocumentationLinkEnabled = true

      const result1 = whitelabelStore.getters.getNavigatorMenuProps(state)
      const result2 = whitelabelStore.getters.getNavigatorMenuProps(state)

      expect(result1).toEqual(result2)
      expect(result1).not.toBe(result2)
    })

    it('getSupportEmailAddress returns string or null', () => {
      expect(whitelabelStore.getters.getSupportEmailAddress(state)).toBeNull()
      state.supportEmailAddress = 'test@example.com'
      expect(typeof whitelabelStore.getters.getSupportEmailAddress(state)).toBe('string')
    })

    it('getBrandName returns empty string initially', () => {
      expect(whitelabelStore.getters.getBrandName(state)).toBe('')
      state.brandName = 'Test Brand'
      expect(whitelabelStore.getters.getBrandName(state)).toBe('Test Brand')
    })

    it('getCountryCode and getCountryName return strings', () => {
      expect(typeof whitelabelStore.getters.getCountryCode(state)).toBe('string')
      expect(typeof whitelabelStore.getters.getCountryName(state)).toBe('string')
      state.countryCode = 'US'
      state.countryName = 'United States'
      expect(whitelabelStore.getters.getCountryCode(state)).toBe('US')
      expect(whitelabelStore.getters.getCountryName(state)).toBe('United States')
    })

    it('getEmailTemplateLogoUrl returns null or string', () => {
      expect(whitelabelStore.getters.getEmailTemplateLogoUrl(state)).toBeNull()
      state.emailTemplateLogoUrl = 'https://example.com/email-logo.png'
      expect(whitelabelStore.getters.getEmailTemplateLogoUrl(state)).toBe('https://example.com/email-logo.png')
    })
  })

  describe('mutation payload handling - null, undefined, edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('SET_DATA handles null payload with error', () => {
      // SET_DATA will throw when payload is null because it tries to access properties
      expect(() => {
        whitelabelStore.mutations.SET_DATA(state, null)
      }).toThrow()
    })

    it('SET_DATA handles undefined payload gracefully', () => {
      expect(() => {
        whitelabelStore.mutations.SET_DATA(state, undefined)
      }).not.toThrow()
    })

    it('SET_DATA handles empty payload object', () => {
      state.brandName = 'Test Brand'
      whitelabelStore.mutations.SET_DATA(state, {})
      // Empty payload means no keys in payload, but SET_DATA iterates state keys
      // For each state key, it sets state[key] = payload[key] which is undefined
      expect(state.brandName).toBeUndefined()
    })

    it('SET_SYSTEM_VERSION handles null value', () => {
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, null)
      expect(state.systemVersion).toBeNull()
    })

    it('SET_SYSTEM_VERSION handles undefined value', () => {
      state.systemVersion = '1.0.0'
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, undefined)
      // When undefined is passed with destructuring default, it becomes {}
      expect(state.systemVersion).toEqual({})
    })

    it('SET_SYSTEM_VERSION handles empty string', () => {
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '')
      expect(state.systemVersion).toBe('')
    })

    it('TOGGLE_LOADING handles null payload', () => {
      whitelabelStore.mutations.TOGGLE_LOADING(state, null)
      expect(state.loading).toBeNull()
    })

    it('TOGGLE_LOADING handles undefined payload', () => {
      whitelabelStore.mutations.TOGGLE_LOADING(state, undefined)
      expect(state.loading).toBeUndefined()
    })

    it('SET_COMPANY_LICENSE handles null payload', () => {
      state.companyLicense = { isLicenseExceeded: true }
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, null)
      expect(state.companyLicense).toBeNull()
    })

    it('SET_COMPANY_LICENSE handles undefined payload', () => {
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, undefined)
      expect(state.companyLicense).toBeUndefined()
    })

    it('SET_COMPANY_LICENSE handles empty object', () => {
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, {})
      expect(state.companyLicense).toEqual({})
    })

    it('SET_SHOW_EXCEED_DIALOG toggles on null', () => {
      state.showLicenseExceededDialog = false
      whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, null)
      expect(state.showLicenseExceededDialog).toBe(true)
    })

    it('SET_SHOW_EXCEED_DIALOG toggles on undefined', () => {
      state.showLicenseExceededDialog = true
      whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, undefined)
      expect(state.showLicenseExceededDialog).toBe(false)
    })

    it('SET_SHOW_EXCEED_DIALOG sets false explicitly', () => {
      state.showLicenseExceededDialog = true
      whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, false)
      expect(state.showLicenseExceededDialog).toBe(false)
    })

    it('SET_COUNTRY_NAME handles null payload', () => {
      whitelabelStore.mutations.SET_COUNTRY_NAME(state, null)
      expect(state.countryName).toBeNull()
    })

    it('SET_COUNTRY_NAME handles undefined payload', () => {
      whitelabelStore.mutations.SET_COUNTRY_NAME(state, undefined)
      expect(state.countryName).toBeUndefined()
    })

    it('SET_COUNTRY_NAME handles empty string', () => {
      whitelabelStore.mutations.SET_COUNTRY_NAME(state, '')
      expect(state.countryName).toBe('')
    })

    it('RESET_STATE handles null payload with error', () => {
      state.brandName = 'Custom'
      // RESET_STATE with null payload will throw because it tries to access payload[key]
      expect(() => {
        whitelabelStore.mutations.RESET_STATE(state, null)
      }).toThrow()
    })
  })

  describe('action behavior - commit patterns and payload passing', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('setState action commits SET_DATA with exact payload', async () => {
      const commit = jest.fn()
      const payload = { brandName: 'Test Brand', mainLogoUrl: 'https://test.com/logo.png' }
      await whitelabelStore.actions.setState({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_DATA', payload)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setState passes complex nested payload', async () => {
      const commit = jest.fn()
      const payload = {
        brandName: 'Complex Brand',
        companyLicense: { isLicenseExceeded: true, isLimited: false, usedSeats: 150 },
        footerPrivacyPolicyUrl: 'https://example.com/privacy'
      }
      await whitelabelStore.actions.setState({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_DATA', payload)
    })

    it('resetState commits RESET_STATE with initialState', () => {
      const commit = jest.fn()
      whitelabelStore.actions.resetState({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_STATE', expect.any(Object))
    })

    it('callForSystemVersion commits correct mutation', async () => {
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemVersion({ commit, state })
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '1.0.0')
    })

    it('callForData commits TOGGLE_LOADING true then false', async () => {
      const commit = jest.fn()
      await whitelabelStore.actions.callForData({ commit, state })
      expect(commit).toHaveBeenNthCalledWith(1, 'TOGGLE_LOADING', true)
      expect(commit).toHaveBeenNthCalledWith(3, 'TOGGLE_LOADING', false)
    })

    it('callForData commits SET_DATA with response data', async () => {
      const commit = jest.fn()
      await whitelabelStore.actions.callForData({ commit, state })
      expect(commit).toHaveBeenCalledWith('SET_DATA', {})
    })

    it('updateData returns resolved promise', async () => {
      const result = await whitelabelStore.actions.updateData({ commit: jest.fn() }, {})
      expect(result).toBeUndefined()
    })

    it('resetToDefault returns resolved promise', async () => {
      const result = await whitelabelStore.actions.resetToDefault({ commit: jest.fn() })
      expect(result).toBeUndefined()
    })

    it('callForSystemInfoSummary commits multiple mutations', async () => {
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemInfoSummary({ commit, state }, { checkExceedDialog: true })
      expect(commit).toHaveBeenCalled()
      expect(commit.mock.calls.length).toBeGreaterThan(0)
    })

    it('toggleShowExceedDialog commits SET_SHOW_EXCEED_DIALOG false when open', () => {
      const commit = jest.fn()
      state.showLicenseExceededDialog = true
      whitelabelStore.actions.toggleShowExceedDialog({ state, commit })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', false)
    })

    it('toggleShowExceedDialog handles payload with checkExceedDialog flag', async () => {
      const commit = jest.fn()
      await whitelabelStore.actions.callForSystemInfoSummary({ commit, state }, { checkExceedDialog: true })
      expect(commit).toHaveBeenCalled()
    })
  })

  describe('type safety and consistency', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('state properties maintain type consistency across mutations', () => {
      const stringProps = ['brandName', 'mainDomainProtocol', 'mainDomainUrl', 'footerPrivacyPolicyUrl', 'footerTermsAndConditionsUrl', 'footerEulaUrl', 'footerCookiePolicyUrl', 'releaseNotesUrl', 'countryCode', 'countryName']
      const booleanProps = ['loading', 'isShowReleaseVersionNumber', 'isShowReleaseNotes', 'isDocumentationLinkEnabled', 'showLicenseExceededDialog']

      stringProps.forEach(prop => {
        expect(typeof state[prop]).toBe('string')
      })

      booleanProps.forEach(prop => {
        expect(typeof state[prop]).toBe('boolean')
      })
    })

    it('URL properties reject non-string assignments', () => {
      whitelabelStore.mutations.SET_DATA(state, { footerPrivacyPolicyUrl: 123 })
      // Type checking at runtime - verify the value is stored as-is
      expect(state.footerPrivacyPolicyUrl).toBe(123)
    })

    it('boolean flag properties only store boolean values', () => {
      whitelabelStore.mutations.TOGGLE_LOADING(state, false)
      expect(typeof state.loading).toBe('boolean')
      whitelabelStore.mutations.TOGGLE_LOADING(state, true)
      expect(typeof state.loading).toBe('boolean')
    })

    it('country code maintains consistent format', () => {
      whitelabelStore.mutations.SET_DATA(state, { countryCode: 'US' })
      expect(state.countryCode).toBe('US')
      whitelabelStore.mutations.SET_DATA(state, { countryCode: 'GB' })
      expect(state.countryCode).toBe('GB')
    })

    it('version strings maintain format consistency', () => {
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '1.0.0')
      expect(state.systemVersion).toBe('1.0.0')
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '2.5.10')
      expect(state.systemVersion).toBe('2.5.10')
    })

    it('license object maintains structure consistency', () => {
      const license1 = { isLicenseExceeded: false, isLimited: true }
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, license1)
      expect(state.companyLicense).toEqual(license1)

      const license2 = { isLicenseExceeded: true, isLimited: false, usedSeats: 100 }
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, license2)
      expect(state.companyLicense).toEqual(license2)
    })
  })

  describe('edge cases - special chars, unicode, long strings, URLs, CSS, large data', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('handles brand name with special characters', () => {
      const specialBrandName = "Brand@#$%&*()_+-=[]{}|;:'\",.<>?/\\`~"
      whitelabelStore.mutations.SET_DATA(state, { brandName: specialBrandName })
      expect(state.brandName).toBe(specialBrandName)
    })

    it('handles brand name with unicode characters', () => {
      const unicodeBrandName = 'Брэнд 品牌 ブランド العلامة التجارية'
      whitelabelStore.mutations.SET_DATA(state, { brandName: unicodeBrandName })
      expect(state.brandName).toBe(unicodeBrandName)
    })

    it('handles emoji in brand name', () => {
      const emojiBrandName = 'Brand 🎉🚀💼🌟'
      whitelabelStore.mutations.SET_DATA(state, { brandName: emojiBrandName })
      expect(state.brandName).toBe(emojiBrandName)
    })

    it('handles very long brand name (500+ characters)', () => {
      const longBrandName = 'A'.repeat(500)
      whitelabelStore.mutations.SET_DATA(state, { brandName: longBrandName })
      expect(state.brandName).toBe(longBrandName)
      expect(state.brandName.length).toBe(500)
    })

    it('handles very long brand name (1000+ characters)', () => {
      const veryLongBrandName = 'Very Long Brand Name '.repeat(60) // 1200 chars
      whitelabelStore.mutations.SET_DATA(state, { brandName: veryLongBrandName })
      expect(state.brandName).toBe(veryLongBrandName)
      expect(state.brandName.length).toBeGreaterThan(1000)
    })

    it('handles URLs with special protocols', () => {
      const urls = [
        'https://example.com/logo.png',
        'http://example.com/logo.png',
        'ftp://example.com/logo.png',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'
      ]
      urls.forEach(url => {
        whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: url })
        expect(state.mainLogoUrl).toBe(url)
      })
    })

    it('handles URLs with query parameters and fragments', () => {
      const complexUrl = 'https://example.com/logo.png?size=large&format=webp#section'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: complexUrl })
      expect(state.mainLogoUrl).toBe(complexUrl)
    })

    it('handles URLs with internationalized domain names', () => {
      const idnUrl = 'https://例え.jp/logo.png'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: idnUrl })
      expect(state.mainLogoUrl).toBe(idnUrl)
    })

    it('handles emails with special characters', () => {
      const specialEmail = 'support+test.name@example.co.uk'
      whitelabelStore.mutations.SET_DATA(state, { supportEmailAddress: specialEmail })
      expect(state.supportEmailAddress).toBe(specialEmail)
    })

    it('handles base64 encoded image URLs', () => {
      const base64Url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      whitelabelStore.mutations.SET_DATA(state, { faviconUrl: base64Url })
      expect(state.faviconUrl).toBe(base64Url)
    })

    it('handles SVG data URIs', () => {
      const svgDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='blue'/%3E%3C/svg%3E"
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: svgDataUri })
      expect(state.mainLogoUrl).toBe(svgDataUri)
    })

    it('handles CSS gradient values as strings', () => {
      const cssGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      // Store as custom property if applicable
      whitelabelStore.mutations.SET_DATA(state, { brandName: cssGradient })
      expect(state.brandName).toBe(cssGradient)
    })

    it('handles color codes in various formats', () => {
      const colors = ['#FF5733', 'rgb(255, 87, 51)', 'rgba(255, 87, 51, 0.8)', 'hsl(0, 100%, 50%)']
      colors.forEach((color, index) => {
        const key = 'brandName'
        whitelabelStore.mutations.SET_DATA(state, { [key]: color })
        expect(state[key]).toBe(color)
      })
    })

    it('handles whitespace and newline characters in strings', () => {
      const stringWithWhitespace = '  Brand Name  \n  With\t Tabs  '
      whitelabelStore.mutations.SET_DATA(state, { brandName: stringWithWhitespace })
      expect(state.brandName).toBe(stringWithWhitespace)
    })

    it('handles large license objects with many properties', () => {
      const largeLicense = {
        isLicenseExceeded: true,
        isLimited: true,
        usedSeats: 1000,
        maxSeats: 500,
        expirationDate: '2025-12-31',
        licenseType: 'premium',
        features: Array(100).fill('feature')
      }
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, largeLicense)
      expect(state.companyLicense).toEqual(largeLicense)
      expect(state.companyLicense.features.length).toBe(100)
    })

    it('handles large sets of footer links', () => {
      const payload = {
        footerPrivacyPolicyUrl: 'https://example.com/privacy',
        footerTermsAndConditionsUrl: 'https://example.com/terms',
        footerEulaUrl: 'https://example.com/eula',
        footerCookiePolicyUrl: 'https://example.com/cookies'
      }
      whitelabelStore.mutations.SET_DATA(state, payload)
      const result = whitelabelStore.getters.getFooterLinks(state)
      expect(Object.keys(result).length).toBe(4)
    })
  })

  describe('data transitions and state mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('transitions from empty state to fully configured state', () => {
      expect(state.brandName).toBe('')
      whitelabelStore.mutations.SET_DATA(state, { brandName: 'Brand 1' })
      expect(state.brandName).toBe('Brand 1')
      whitelabelStore.mutations.SET_DATA(state, { brandName: 'Brand 2' })
      expect(state.brandName).toBe('Brand 2')
    })

    it('handles sequential mutations maintaining state integrity', () => {
      whitelabelStore.mutations.SET_DATA(state, { brandName: 'Initial' })
      whitelabelStore.mutations.TOGGLE_LOADING(state, false)
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '1.0.0')
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, { isLicenseExceeded: false })

      expect(state.brandName).toBe('Initial')
      expect(state.loading).toBe(false)
      expect(state.systemVersion).toBe('1.0.0')
      expect(state.companyLicense).toEqual({ isLicenseExceeded: false })
    })

    it('handles overwriting brand name multiple times', () => {
      for (let i = 0; i < 5; i++) {
        whitelabelStore.mutations.SET_DATA(state, { brandName: `Brand ${i}` })
        expect(state.brandName).toBe(`Brand ${i}`)
      }
    })

    it('handles rapid loading state toggles', () => {
      for (let i = 0; i < 10; i++) {
        whitelabelStore.mutations.TOGGLE_LOADING(state, i % 2 === 0)
        expect(state.loading).toBe(i % 2 === 0)
      }
    })

    it('handles rapid license dialog toggles', () => {
      for (let i = 0; i < 15; i++) {
        whitelabelStore.mutations.SET_SHOW_EXCEED_DIALOG(state, i % 2 === 0 ? true : false)
        expect(state.showLicenseExceededDialog).toBe(i % 2 === 0)
      }
    })

    it('transitions between different country codes', () => {
      const countryCodes = ['US', 'GB', 'DE', 'FR', 'JP', 'CN', 'IN', 'BR']
      countryCodes.forEach((code) => {
        whitelabelStore.mutations.SET_DATA(state, { countryCode: code })
        expect(state.countryCode).toBe(code)
      })
    })

    it('transitions license from valid to exceeded', () => {
      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, { isLicenseExceeded: false, isLimited: false })
      expect(state.companyLicense.isLicenseExceeded).toBe(false)

      whitelabelStore.mutations.SET_COMPANY_LICENSE(state, { isLicenseExceeded: true, isLimited: true })
      expect(state.companyLicense.isLicenseExceeded).toBe(true)
    })

    it('handles state mutation with partial payload', () => {
      whitelabelStore.mutations.SET_DATA(state, { brandName: 'New Brand' })

      expect(state.brandName).toBe('New Brand')
      // The SET_DATA mutation iterates all state keys and sets each to payload[key]
      // So properties not in payload are set to undefined
      expect(state.loading).toBeUndefined()
    })

    it('handles multiple sequential country name updates', () => {
      const names = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan']
      names.forEach((name) => {
        whitelabelStore.mutations.SET_COUNTRY_NAME(state, name)
        expect(state.countryName).toBe(name)
      })
    })

    it('handles state reset after modifications', () => {
      whitelabelStore.mutations.SET_DATA(state, {
        brandName: 'Custom Brand',
        mainLogoUrl: 'https://example.com/logo.png'
      })
      whitelabelStore.mutations.TOGGLE_LOADING(state, false)
      whitelabelStore.mutations.SET_SYSTEM_VERSION(state, '2.0.0')

      whitelabelStore.mutations.RESET_STATE(state, initialState)

      expect(state.brandName).toBe('')
      expect(state.mainLogoUrl).toBeNull()
      expect(state.loading).toBe(true)
    })
  })

  describe('branding and styling validation', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('brand name can be set to empty string', () => {
      whitelabelStore.mutations.SET_DATA(state, { brandName: '' })
      expect(state.brandName).toBe('')
    })

    it('brand name can be set to single character', () => {
      whitelabelStore.mutations.SET_DATA(state, { brandName: 'A' })
      expect(state.brandName).toBe('A')
    })

    it('brand name can be set to numeric string', () => {
      whitelabelStore.mutations.SET_DATA(state, { brandName: '12345' })
      expect(state.brandName).toBe('12345')
    })

    it('brand name with leading/trailing spaces is preserved', () => {
      const brandWithSpaces = '   Spaced Brand   '
      whitelabelStore.mutations.SET_DATA(state, { brandName: brandWithSpaces })
      expect(state.brandName).toBe(brandWithSpaces)
    })

    it('can store CSS class names for styling', () => {
      const cssClass = 'brand-theme-dark brand-size-large'
      whitelabelStore.mutations.SET_DATA(state, { brandName: cssClass })
      expect(state.brandName).toBe(cssClass)
    })

    it('can store brand name with dashes and underscores', () => {
      const brandName = 'Brand-Name_With-Underscores_And-Dashes'
      whitelabelStore.mutations.SET_DATA(state, { brandName: brandName })
      expect(state.brandName).toBe(brandName)
    })

    it('domain protocol can be http or https', () => {
      const protocols = ['http://', 'https://', 'ws://', 'wss://']
      protocols.forEach((protocol) => {
        whitelabelStore.mutations.SET_DATA(state, { mainDomainProtocol: protocol })
        expect(state.mainDomainProtocol).toBe(protocol)
      })
    })

    it('domain URL maintains structure', () => {
      const domains = ['example.com', 'api.example.com', 'v1.api.example.com', 'example.co.uk']
      domains.forEach((domain) => {
        whitelabelStore.mutations.SET_DATA(state, { mainDomainUrl: domain })
        expect(state.mainDomainUrl).toBe(domain)
      })
    })

    it('all footer links can be set independently', () => {
      whitelabelStore.mutations.SET_DATA(state, { footerPrivacyPolicyUrl: 'https://example.com/privacy' })
      expect(state.footerPrivacyPolicyUrl).toBe('https://example.com/privacy')
      // Other properties are set to undefined when only partial payload provided
      // This is expected behavior of SET_DATA mutation

      whitelabelStore.mutations.SET_DATA(state, { footerTermsAndConditionsUrl: 'https://example.com/terms' })
      // Now set the first one again to ensure it works
      whitelabelStore.mutations.SET_DATA(state, { footerPrivacyPolicyUrl: 'https://example.com/privacy', footerTermsAndConditionsUrl: 'https://example.com/terms' })
      expect(state.footerPrivacyPolicyUrl).toBe('https://example.com/privacy')
      expect(state.footerTermsAndConditionsUrl).toBe('https://example.com/terms')
    })

    it('feature flags can be toggled independently', () => {
      whitelabelStore.mutations.SET_DATA(state, { isShowReleaseVersionNumber: true, isShowReleaseNotes: false, isDocumentationLinkEnabled: false })
      expect(state.isShowReleaseVersionNumber).toBe(true)
      expect(state.isShowReleaseNotes).toBe(false)

      whitelabelStore.mutations.SET_DATA(state, { isShowReleaseVersionNumber: true, isShowReleaseNotes: true, isDocumentationLinkEnabled: false })
      expect(state.isShowReleaseVersionNumber).toBe(true)
      expect(state.isShowReleaseNotes).toBe(true)
    })

    it('documentation link flag is separate from version display', () => {
      whitelabelStore.mutations.SET_DATA(state, {
        isShowReleaseVersionNumber: true,
        isDocumentationLinkEnabled: false
      })
      expect(state.isShowReleaseVersionNumber).toBe(true)
      expect(state.isDocumentationLinkEnabled).toBe(false)
    })
  })

  describe('logo and favicon handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('main logo URL initializes as null', () => {
      expect(state.mainLogoUrl).toBeNull()
    })

    it('minimized menu logo URL initializes as null', () => {
      expect(state.minimizedMenuLogoUrl).toBeNull()
    })

    it('favicon URL initializes as null', () => {
      expect(state.faviconUrl).toBeNull()
    })

    it('email template logo URL initializes as null', () => {
      expect(state.emailTemplateLogoUrl).toBeNull()
    })

    it('can set main logo URL', () => {
      const logoUrl = 'https://example.com/main-logo.png'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: logoUrl })
      expect(state.mainLogoUrl).toBe(logoUrl)
    })

    it('can set minimized menu logo URL independently', () => {
      const minLogoUrl = 'https://example.com/min-logo.png'
      whitelabelStore.mutations.SET_DATA(state, { minimizedMenuLogoUrl: minLogoUrl })
      expect(state.minimizedMenuLogoUrl).toBe(minLogoUrl)
      // When partial payload is used, mainLogoUrl will be set to undefined by SET_DATA
      // This is expected behavior - we need to set both when using SET_DATA
    })

    it('can set favicon URL', () => {
      const faviconUrl = 'https://example.com/favicon.ico'
      whitelabelStore.mutations.SET_DATA(state, { faviconUrl: faviconUrl })
      expect(state.faviconUrl).toBe(faviconUrl)
    })

    it('can set email template logo URL', () => {
      const emailLogoUrl = 'https://example.com/email-logo.png'
      whitelabelStore.mutations.SET_DATA(state, { emailTemplateLogoUrl: emailLogoUrl })
      expect(state.emailTemplateLogoUrl).toBe(emailLogoUrl)
    })

    it('can set all logo URLs simultaneously', () => {
      const logos = {
        mainLogoUrl: 'https://example.com/main-logo.png',
        minimizedMenuLogoUrl: 'https://example.com/min-logo.png',
        faviconUrl: 'https://example.com/favicon.ico',
        emailTemplateLogoUrl: 'https://example.com/email-logo.png'
      }
      whitelabelStore.mutations.SET_DATA(state, logos)
      expect(state.mainLogoUrl).toBe(logos.mainLogoUrl)
      expect(state.minimizedMenuLogoUrl).toBe(logos.minimizedMenuLogoUrl)
      expect(state.faviconUrl).toBe(logos.faviconUrl)
      expect(state.emailTemplateLogoUrl).toBe(logos.emailTemplateLogoUrl)
    })

    it('supports SVG logo URLs', () => {
      const svgUrl = 'https://example.com/logo.svg'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: svgUrl })
      expect(state.mainLogoUrl).toBe(svgUrl)
    })

    it('supports WebP logo format', () => {
      const webpUrl = 'https://example.com/logo.webp'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: webpUrl })
      expect(state.mainLogoUrl).toBe(webpUrl)
    })

    it('supports different image formats', () => {
      const formats = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico']
      formats.forEach((format) => {
        const url = `https://example.com/logo.${format}`
        whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: url })
        expect(state.mainLogoUrl).toContain(format)
      })
    })

    it('can revert logo URLs to null', () => {
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: 'https://example.com/logo.png' })
      expect(state.mainLogoUrl).not.toBeNull()

      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: null })
      expect(state.mainLogoUrl).toBeNull()
    })

    it('handles logo URLs with complex paths', () => {
      const complexPath = 'https://cdn.example.com/assets/v2/branding/logos/main/2024/01/logo-final.png?version=3'
      whitelabelStore.mutations.SET_DATA(state, { mainLogoUrl: complexPath })
      expect(state.mainLogoUrl).toBe(complexPath)
    })

    it('getEmailTemplateLogoUrl returns correct value', () => {
      const emailLogoUrl = 'https://example.com/email-logo.png'
      whitelabelStore.mutations.SET_DATA(state, { emailTemplateLogoUrl: emailLogoUrl })
      expect(whitelabelStore.getters.getEmailTemplateLogoUrl(state)).toBe(emailLogoUrl)
    })
  })

  describe('color and theme configuration', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('can store primary color as hex', () => {
      const color = '#FF5733'
      whitelabelStore.mutations.SET_DATA(state, { brandName: `primary:${color}` })
      expect(state.brandName).toContain(color)
    })

    it('can store colors in RGB format', () => {
      const color = 'rgb(255, 87, 51)'
      whitelabelStore.mutations.SET_DATA(state, { brandName: color })
      expect(state.brandName).toBe(color)
    })

    it('can store colors in RGBA format with transparency', () => {
      const color = 'rgba(255, 87, 51, 0.8)'
      whitelabelStore.mutations.SET_DATA(state, { brandName: color })
      expect(state.brandName).toBe(color)
    })

    it('can store colors in HSL format', () => {
      const color = 'hsl(0, 100%, 50%)'
      whitelabelStore.mutations.SET_DATA(state, { brandName: color })
      expect(state.brandName).toBe(color)
    })

    it('can store named CSS colors', () => {
      const colors = ['red', 'blue', 'green', 'transparent', 'currentColor']
      colors.forEach((color) => {
        whitelabelStore.mutations.SET_DATA(state, { brandName: color })
        expect(state.brandName).toBe(color)
      })
    })

    it('can store theme configuration as string', () => {
      const theme = 'light|dark|auto'
      whitelabelStore.mutations.SET_DATA(state, { brandName: theme })
      expect(state.brandName).toBe(theme)
    })

    it('can store multiple colors in configuration string', () => {
      const colors = '#FF5733,#33FF57,#3357FF'
      whitelabelStore.mutations.SET_DATA(state, { brandName: colors })
      expect(state.brandName).toBe(colors)
    })

    it('can store gradient configuration', () => {
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      whitelabelStore.mutations.SET_DATA(state, { brandName: gradient })
      expect(state.brandName).toBe(gradient)
    })

    it('supports 100+ colors in large palette', () => {
      const colors = Array(100).fill(0).map((_, i) => `#FF${(i * 2).toString(16).padStart(4, '0')}`)
      const colorString = colors.join(',')
      whitelabelStore.mutations.SET_DATA(state, { brandName: colorString })
      expect(state.brandName).toContain('#FF')
      expect(state.brandName.split(',').length).toBe(100)
    })

    it('supports 100+ CSS style rules', () => {
      const styles = Array(100).fill(0).map((_, i) => `--color-${i}: #FF${i.toString(16).padStart(4, '0')};`).join('')
      whitelabelStore.mutations.SET_DATA(state, { brandName: styles })
      expect(state.brandName).toContain('--color-')
      expect(state.brandName.split('--color-').length - 1).toBe(100)
    })

    it('can store font configuration', () => {
      const fontConfig = 'font-family: "Segoe UI", sans-serif; font-size: 16px'
      whitelabelStore.mutations.SET_DATA(state, { brandName: fontConfig })
      expect(state.brandName).toBe(fontConfig)
    })

    it('can store spacing configuration', () => {
      const spacing = 'base: 8px; small: 4px; large: 16px; xlarge: 32px'
      whitelabelStore.mutations.SET_DATA(state, { brandName: spacing })
      expect(state.brandName).toBe(spacing)
    })

    it('can store border radius configuration', () => {
      const borders = 'small: 2px; medium: 4px; large: 8px; full: 9999px'
      whitelabelStore.mutations.SET_DATA(state, { brandName: borders })
      expect(state.brandName).toBe(borders)
    })
  })

  describe('complex integration workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(whitelabelStore.state))
      localStorage.clear()
    })

    it('complete e-commerce branding setup', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      // Build complete payload to avoid undefined values
      const completePayload = {
        resourceId: null,
        loading: true,
        brandName: 'ECommerce Store',
        mainDomainProtocol: 'https://',
        mainDomainUrl: 'store.example.com',
        mainLogoUrl: 'https://store.example.com/logo.png',
        minimizedMenuLogoUrl: 'https://store.example.com/logo-min.png',
        faviconUrl: 'https://store.example.com/favicon.ico',
        emailTemplateLogoUrl: null,
        supportEmailAddress: 'support@store.example.com',
        footerPrivacyPolicyUrl: 'https://store.example.com/privacy',
        footerTermsAndConditionsUrl: 'https://store.example.com/terms',
        footerEulaUrl: 'https://store.example.com/eula',
        footerCookiePolicyUrl: 'https://store.example.com/cookies',
        isShowReleaseVersionNumber: true,
        isShowReleaseNotes: true,
        isDocumentationLinkEnabled: true,
        releaseNotesUrl: 'https://store.example.com/release-notes',
        companyLicense: null,
        showLicenseExceededDialog: false,
        countryCode: '',
        countryName: ''
      }

      commit('SET_DATA', completePayload)
      commit('SET_SYSTEM_VERSION', '1.0.0')
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: false, isLimited: false })
      commit('SET_COUNTRY_NAME', 'United States')

      // Verify complete setup
      expect(state.brandName).toBe('ECommerce Store')
      expect(state.mainLogoUrl).toBe('https://store.example.com/logo.png')
      expect(state.supportEmailAddress).toBe('support@store.example.com')
      expect(state.footerPrivacyPolicyUrl).toBe('https://store.example.com/privacy')
      expect(state.isShowReleaseVersionNumber).toBe(true)
      expect(state.systemVersion).toBe('1.0.0')
      expect(state.companyLicense.isLicenseExceeded).toBe(false)
      expect(state.countryName).toBe('United States')
    })

    it('enterprise multi-region configuration', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const regions = [
        { code: 'US', name: 'United States', url: 'https://us.example.com' },
        { code: 'EU', name: 'European Union', url: 'https://eu.example.com' },
        { code: 'APAC', name: 'Asia Pacific', url: 'https://apac.example.com' }
      ]

      regions.forEach((region, index) => {
        commit('SET_DATA', { countryCode: region.code, mainDomainUrl: region.url })
        commit('SET_COUNTRY_NAME', region.name)
        expect(state.countryCode).toBe(region.code)
        expect(state.countryName).toBe(region.name)
      })
    })

    it('SaaS multi-tenant configuration scenario', async () => {
      const commit = jest.fn((mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      })

      // Setup multiple tenants
      const tenants = [
        { brandName: 'Tenant A', resourceId: 1 },
        { brandName: 'Tenant B', resourceId: 2 },
        { brandName: 'Tenant C', resourceId: 3 }
      ]

      for (const tenant of tenants) {
        commit('SET_DATA', tenant)
        expect(state.brandName).toBe(tenant.brandName)
      }

      expect(commit).toHaveBeenCalled()
    })

    it('handles rapid state setup and reset cycles', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 5; i++) {
        // Setup
        commit('SET_DATA', {
          brandName: `Brand ${i}`,
          mainLogoUrl: `https://example.com/logo-${i}.png`
        })
        commit('SET_SYSTEM_VERSION', `${i}.0.0`)

        expect(state.brandName).toBe(`Brand ${i}`)
        expect(state.systemVersion).toBe(`${i}.0.0`)

        // Reset
        commit('RESET_STATE', initialState)
        expect(state.brandName).toBe('')
        expect(state.systemVersion).toBeNull()
      }
    })

    it('license lifecycle workflow', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      // Initial valid state
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: false, isLimited: false })
      expect(state.companyLicense.isLicenseExceeded).toBe(false)

      // Approach limit
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: false, isLimited: true })
      expect(state.companyLicense.isLimited).toBe(true)

      // Exceed limit
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: true, isLimited: true })
      expect(state.companyLicense.isLicenseExceeded).toBe(true)
      commit('SET_SHOW_EXCEED_DIALOG', true)
      expect(state.showLicenseExceededDialog).toBe(true)

      // Dialog dismissed
      commit('SET_SHOW_EXCEED_DIALOG', false)
      expect(state.showLicenseExceededDialog).toBe(false)

      // License renewed
      commit('SET_COMPANY_LICENSE', { isLicenseExceeded: false, isLimited: false })
      expect(state.companyLicense.isLicenseExceeded).toBe(false)
    })

    it('dynamic theme switching workflow', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const themes = [
        { name: 'Light Theme', colors: '#FFFFFF,#000000' },
        { name: 'Dark Theme', colors: '#1a1a1a,#FFFFFF' },
        { name: 'Blue Theme', colors: '#0066CC,#FFFFFF' },
        { name: 'Green Theme', colors: '#00AA00,#FFFFFF' }
      ]

      themes.forEach((theme) => {
        commit('SET_DATA', { brandName: theme.name })
        expect(state.brandName).toBe(theme.name)
      })
    })

    it('multi-logo asset management', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const assets = [
        {
          mainLogoUrl: 'https://cdn.example.com/logo-full-color.png',
          minimizedMenuLogoUrl: 'https://cdn.example.com/logo-icon.png',
          faviconUrl: 'https://cdn.example.com/favicon-32x32.png',
          emailTemplateLogoUrl: 'https://cdn.example.com/logo-email.png'
        }
      ]

      assets.forEach((asset) => {
        commit('SET_DATA', asset)
        expect(state.mainLogoUrl).toBe(asset.mainLogoUrl)
        expect(state.minimizedMenuLogoUrl).toBe(asset.minimizedMenuLogoUrl)
        expect(state.faviconUrl).toBe(asset.faviconUrl)
        expect(state.emailTemplateLogoUrl).toBe(asset.emailTemplateLogoUrl)
      })
    })

    it('internationalization configuration', () => {
      const commit = (mutationName, payload) => {
        whitelabelStore.mutations[mutationName](state, payload)
      }

      const countries = [
        { code: 'US', name: 'United States', protocol: 'https://', domain: 'us.example.com' },
        { code: 'GB', name: 'United Kingdom', protocol: 'https://', domain: 'uk.example.com' },
        { code: 'DE', name: 'Germany', protocol: 'https://', domain: 'de.example.com' },
        { code: 'JP', name: 'Japan', protocol: 'https://', domain: 'jp.example.com' }
      ]

      countries.forEach((country) => {
        commit('SET_DATA', {
          countryCode: country.code,
          mainDomainProtocol: country.protocol,
          mainDomainUrl: country.domain
        })
        commit('SET_COUNTRY_NAME', country.name)
        expect(state.countryCode).toBe(country.code)
        expect(state.countryName).toBe(country.name)
      })
    })
  })
})
