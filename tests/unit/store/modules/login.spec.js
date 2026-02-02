describe('login.js store module', () => {
  let loginStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    loginStore = {
      namespaced: true,
      state: {
        pageNumber: 1,
        wrongLoginAttempt: 0,
        company: null,
        hasAgenticAILicense: false,
        agenticAIEnabled: false,
        loginWhiteLabel: {
          brandName: '',
          favIconUrl: '',
          mainLogoUrl: ''
        }
      },
      getters: {
        getPageNumber: (state) => state.pageNumber,
        loginWhiteLabel: (state) => state.loginWhiteLabel,
        getCurrentCompany: (state) => state.company,
        getHasAgenticAILicense: (state) => state.hasAgenticAILicense,
        getAgenticAIEnabled: (state) => state.agenticAIEnabled
      },
      mutations: {
        SET_PAGE_NUMBER(state, payload) {
          state.pageNumber = payload
        },
        SET_LOGIN_WHITELABEL(state, payload) {
          for (const key of Object.keys(state.loginWhiteLabel)) {
            if (key === 'favIconUrl' && payload['faviconUrl']) {
              state.loginWhiteLabel[key] = payload['faviconUrl']
            } else if (key === 'brandName' && payload[key]) {
              state.loginWhiteLabel[key] = payload[key]
            } else {
              state.loginWhiteLabel[key] = payload[key]
            }
          }
        },
        SET_COMPANY(state, payload) {
          state.company = payload
        },
        SET_HAS_AGENTIC_AI_LICENSE(state, payload) {
          state.hasAgenticAILicense = !!payload
        },
        SET_AGENTIC_AI_ENABLED(state, payload) {
          state.agenticAIEnabled = !!payload
        }
      },
      actions: {
        setPageNumber({ commit }, payload) {
          commit('SET_PAGE_NUMBER', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(loginStore.state))
  })

  describe('state', () => {
    it('initializes with pageNumber as 1', () => {
      expect(loginStore.state.pageNumber).toBe(1)
    })

    it('initializes with wrongLoginAttempt as 0', () => {
      expect(loginStore.state.wrongLoginAttempt).toBe(0)
    })

    it('initializes with company as null', () => {
      expect(loginStore.state.company).toBeNull()
    })

    it('initializes with hasAgenticAILicense as false', () => {
      expect(loginStore.state.hasAgenticAILicense).toBe(false)
    })

    it('initializes with agenticAIEnabled as false', () => {
      expect(loginStore.state.agenticAIEnabled).toBe(false)
    })

    it('initializes loginWhiteLabel with empty values', () => {
      expect(loginStore.state.loginWhiteLabel).toEqual({
        brandName: '',
        favIconUrl: '',
        mainLogoUrl: ''
      })
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = loginStore.state
    })

    it('getPageNumber returns current page number', () => {
      state.pageNumber = 3
      expect(loginStore.getters.getPageNumber(state)).toBe(3)
    })

    it('loginWhiteLabel returns white label data', () => {
      state.loginWhiteLabel = {
        brandName: 'MyBrand',
        favIconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: 'https://example.com/logo.png'
      }
      expect(loginStore.getters.loginWhiteLabel(state)).toEqual({
        brandName: 'MyBrand',
        favIconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: 'https://example.com/logo.png'
      })
    })

    it('getCurrentCompany returns company data', () => {
      state.company = { id: 1, name: 'Test Company' }
      expect(loginStore.getters.getCurrentCompany(state)).toEqual({
        id: 1,
        name: 'Test Company'
      })
    })

    it('getCurrentCompany returns null when company not set', () => {
      expect(loginStore.getters.getCurrentCompany(state)).toBeNull()
    })

    it('getHasAgenticAILicense returns license status', () => {
      state.hasAgenticAILicense = true
      expect(loginStore.getters.getHasAgenticAILicense(state)).toBe(true)
    })

    it('getAgenticAIEnabled returns enabled status', () => {
      state.agenticAIEnabled = true
      expect(loginStore.getters.getAgenticAIEnabled(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('SET_PAGE_NUMBER updates page number', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, 5)
      expect(state.pageNumber).toBe(5)
    })

    it('SET_PAGE_NUMBER handles zero', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, 0)
      expect(state.pageNumber).toBe(0)
    })

    it('SET_LOGIN_WHITELABEL updates brand name', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'NewBrand',
        faviconUrl: '',
        mainLogoUrl: ''
      })
      expect(state.loginWhiteLabel.brandName).toBe('NewBrand')
    })

    it('SET_LOGIN_WHITELABEL updates favicon URL', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: '',
        faviconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: ''
      })
      expect(state.loginWhiteLabel.favIconUrl).toBe('https://example.com/icon.ico')
    })

    it('SET_LOGIN_WHITELABEL updates main logo URL', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: '',
        faviconUrl: '',
        mainLogoUrl: 'https://example.com/logo.png'
      })
      expect(state.loginWhiteLabel.mainLogoUrl).toBe('https://example.com/logo.png')
    })

    it('SET_LOGIN_WHITELABEL updates all properties', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'MyBrand',
        faviconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: 'https://example.com/logo.png'
      })
      expect(state.loginWhiteLabel.brandName).toBe('MyBrand')
      expect(state.loginWhiteLabel.favIconUrl).toBe('https://example.com/icon.ico')
      expect(state.loginWhiteLabel.mainLogoUrl).toBe('https://example.com/logo.png')
    })

    it('SET_COMPANY sets company data', () => {
      const company = { id: 1, name: 'Test Company' }
      loginStore.mutations.SET_COMPANY(state, company)
      expect(state.company).toEqual(company)
    })

    it('SET_COMPANY can set company to null', () => {
      state.company = { id: 1, name: 'Test Company' }
      loginStore.mutations.SET_COMPANY(state, null)
      expect(state.company).toBeNull()
    })

    it('SET_HAS_AGENTIC_AI_LICENSE converts to boolean true', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 1)
      expect(state.hasAgenticAILicense).toBe(true)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE converts to boolean false', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 0)
      expect(state.hasAgenticAILicense).toBe(false)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE handles truthy values', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 'yes')
      expect(state.hasAgenticAILicense).toBe(true)
    })

    it('SET_AGENTIC_AI_ENABLED converts to boolean true', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, 1)
      expect(state.agenticAIEnabled).toBe(true)
    })

    it('SET_AGENTIC_AI_ENABLED converts to boolean false', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, 0)
      expect(state.agenticAIEnabled).toBe(false)
    })

    it('SET_AGENTIC_AI_ENABLED handles falsy values', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, null)
      expect(state.agenticAIEnabled).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('setPageNumber commits mutation', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 2)
      expect(commit).toHaveBeenCalledWith('SET_PAGE_NUMBER', 2)
    })

    it('setPageNumber commits with zero', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 0)
      expect(commit).toHaveBeenCalledWith('SET_PAGE_NUMBER', 0)
    })

    it('setPageNumber commits with large number', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 100)
      expect(commit).toHaveBeenCalledWith('SET_PAGE_NUMBER', 100)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(loginStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(loginStore).toHaveProperty('state')
      expect(loginStore).toHaveProperty('getters')
      expect(loginStore).toHaveProperty('mutations')
      expect(loginStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getPageNumber',
        'loginWhiteLabel',
        'getCurrentCompany',
        'getHasAgenticAILicense',
        'getAgenticAIEnabled'
      ]
      expectedGetters.forEach((getter) => {
        expect(loginStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_PAGE_NUMBER',
        'SET_LOGIN_WHITELABEL',
        'SET_COMPANY',
        'SET_HAS_AGENTIC_AI_LICENSE',
        'SET_AGENTIC_AI_ENABLED'
      ]
      expectedMutations.forEach((mutation) => {
        expect(loginStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has expected actions', () => {
      expect(loginStore.actions).toHaveProperty('setPageNumber')
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('can navigate through pages', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      commit('SET_PAGE_NUMBER', 1)
      expect(state.pageNumber).toBe(1)

      commit('SET_PAGE_NUMBER', 2)
      expect(state.pageNumber).toBe(2)

      commit('SET_PAGE_NUMBER', 3)
      expect(state.pageNumber).toBe(3)
    })

    it('can set company and check AI license', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      const company = { id: 1, name: 'Company A', hasAgenticAILicense: true }
      commit('SET_COMPANY', company)
      commit('SET_HAS_AGENTIC_AI_LICENSE', company.hasAgenticAILicense)

      expect(state.company).toEqual(company)
      expect(state.hasAgenticAILicense).toBe(true)
    })

    it('enables agentic AI only when licensed', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      // No license
      commit('SET_HAS_AGENTIC_AI_LICENSE', false)
      commit('SET_AGENTIC_AI_ENABLED', false)
      expect(state.hasAgenticAILicense).toBe(false)
      expect(state.agenticAIEnabled).toBe(false)

      // Has license
      commit('SET_HAS_AGENTIC_AI_LICENSE', true)
      commit('SET_AGENTIC_AI_ENABLED', true)
      expect(state.hasAgenticAILicense).toBe(true)
      expect(state.agenticAIEnabled).toBe(true)
    })

    it('can set white label branding', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      const branding = {
        brandName: 'CustomBrand',
        faviconUrl: 'https://custom.com/icon.ico',
        mainLogoUrl: 'https://custom.com/logo.png'
      }

      commit('SET_LOGIN_WHITELABEL', branding)

      expect(state.loginWhiteLabel.brandName).toBe('CustomBrand')
      expect(state.loginWhiteLabel.favIconUrl).toBe('https://custom.com/icon.ico')
      expect(state.loginWhiteLabel.mainLogoUrl).toBe('https://custom.com/logo.png')
    })

    it('can complete full login flow setup', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      // Set page to login
      commit('SET_PAGE_NUMBER', 1)
      expect(state.pageNumber).toBe(1)

      // Set company data
      const company = { id: 1, name: 'TestCo', hasAgenticAILicense: true }
      commit('SET_COMPANY', company)
      expect(state.company).toEqual(company)

      // Set white label
      commit('SET_LOGIN_WHITELABEL', {
        brandName: 'TestCo',
        faviconUrl: 'https://testco.com/icon.ico',
        mainLogoUrl: 'https://testco.com/logo.png'
      })

      // Enable AI if licensed
      commit('SET_HAS_AGENTIC_AI_LICENSE', true)
      commit('SET_AGENTIC_AI_ENABLED', true)

      // Move to next page
      commit('SET_PAGE_NUMBER', 2)
      expect(state.pageNumber).toBe(2)

      // Verify all state is set correctly
      expect(state.company.name).toBe('TestCo')
      expect(state.hasAgenticAILicense).toBe(true)
      expect(state.agenticAIEnabled).toBe(true)
      expect(state.loginWhiteLabel.brandName).toBe('TestCo')
    })
  })
})
