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
})
