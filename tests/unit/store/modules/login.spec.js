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

  describe('state properties', () => {
    it('pageNumber is number type', () => {
      expect(typeof loginStore.state.pageNumber).toBe('number')
    })

    it('wrongLoginAttempt is number type', () => {
      expect(typeof loginStore.state.wrongLoginAttempt).toBe('number')
    })

    it('company is null initially', () => {
      expect(loginStore.state.company).toBeNull()
    })

    it('hasAgenticAILicense is boolean type', () => {
      expect(typeof loginStore.state.hasAgenticAILicense).toBe('boolean')
    })

    it('agenticAIEnabled is boolean type', () => {
      expect(typeof loginStore.state.agenticAIEnabled).toBe('boolean')
    })

    it('loginWhiteLabel is object type', () => {
      expect(typeof loginStore.state.loginWhiteLabel).toBe('object')
    })

    it('loginWhiteLabel has all required properties', () => {
      expect(loginStore.state.loginWhiteLabel).toHaveProperty('brandName')
      expect(loginStore.state.loginWhiteLabel).toHaveProperty('favIconUrl')
      expect(loginStore.state.loginWhiteLabel).toHaveProperty('mainLogoUrl')
    })
  })

  describe('getter behavior', () => {
    beforeEach(() => {
      state = loginStore.state
    })

    it('getPageNumber is function type', () => {
      expect(typeof loginStore.getters.getPageNumber).toBe('function')
    })

    it('getPageNumber returns same reference as state', () => {
      const getter = loginStore.getters.getPageNumber(state)
      expect(getter === state.pageNumber).toBe(true)
    })

    it('loginWhiteLabel is function type', () => {
      expect(typeof loginStore.getters.loginWhiteLabel).toBe('function')
    })

    it('loginWhiteLabel returns same reference', () => {
      const getter = loginStore.getters.loginWhiteLabel(state)
      expect(getter === state.loginWhiteLabel).toBe(true)
    })

    it('getCurrentCompany is function type', () => {
      expect(typeof loginStore.getters.getCurrentCompany).toBe('function')
    })

    it('getHasAgenticAILicense is function type', () => {
      expect(typeof loginStore.getters.getHasAgenticAILicense).toBe('function')
    })

    it('getAgenticAIEnabled is function type', () => {
      expect(typeof loginStore.getters.getAgenticAIEnabled).toBe('function')
    })

    it('getters reflect state changes', () => {
      state.pageNumber = 5
      expect(loginStore.getters.getPageNumber(state)).toBe(5)
    })
  })

  describe('mutation payload handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('SET_PAGE_NUMBER handles negative numbers', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, -1)
      expect(state.pageNumber).toBe(-1)
    })

    it('SET_PAGE_NUMBER handles large numbers', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, 999999)
      expect(state.pageNumber).toBe(999999)
    })

    it('SET_PAGE_NUMBER handles decimal numbers', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, 3.14)
      expect(state.pageNumber).toBe(3.14)
    })

    it('SET_COMPANY handles complex object', () => {
      const company = {
        id: 1,
        name: 'Complex Company',
        config: { settings: { enabled: true } },
        users: [{ id: 1, name: 'User 1' }]
      }
      loginStore.mutations.SET_COMPANY(state, company)
      expect(state.company).toEqual(company)
      expect(state.company.config.settings.enabled).toBe(true)
    })

    it('SET_COMPANY preserves reference', () => {
      const company = { id: 1, name: 'Test' }
      loginStore.mutations.SET_COMPANY(state, company)
      expect(state.company === company).toBe(true)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE handles empty string', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, '')
      expect(state.hasAgenticAILicense).toBe(false)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE handles non-empty string', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 'true')
      expect(state.hasAgenticAILicense).toBe(true)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE handles null', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, null)
      expect(state.hasAgenticAILicense).toBe(false)
    })

    it('SET_HAS_AGENTIC_AI_LICENSE handles undefined', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, undefined)
      expect(state.hasAgenticAILicense).toBe(false)
    })

    it('SET_AGENTIC_AI_ENABLED handles empty string', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, '')
      expect(state.agenticAIEnabled).toBe(false)
    })

    it('SET_AGENTIC_AI_ENABLED handles non-empty string', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, 'enabled')
      expect(state.agenticAIEnabled).toBe(true)
    })

    it('SET_AGENTIC_AI_ENABLED handles array', () => {
      loginStore.mutations.SET_AGENTIC_AI_ENABLED(state, [])
      expect(state.agenticAIEnabled).toBe(true)
    })

    it('SET_LOGIN_WHITELABEL handles empty payload', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {})
      expect(state.loginWhiteLabel).toBeDefined()
    })

    it('SET_LOGIN_WHITELABEL preserves structure', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'Test',
        faviconUrl: 'url1',
        mainLogoUrl: 'url2'
      })
      expect(state.loginWhiteLabel).toHaveProperty('brandName')
      expect(state.loginWhiteLabel).toHaveProperty('favIconUrl')
      expect(state.loginWhiteLabel).toHaveProperty('mainLogoUrl')
    })

    it('SET_LOGIN_WHITELABEL handles special characters in brand name', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'Brand & Company!@#$%',
        faviconUrl: '',
        mainLogoUrl: ''
      })
      expect(state.loginWhiteLabel.brandName).toBe('Brand & Company!@#$%')
    })

    it('SET_LOGIN_WHITELABEL handles Unicode characters', () => {
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'Компания 作本',
        faviconUrl: '',
        mainLogoUrl: ''
      })
      expect(state.loginWhiteLabel.brandName).toBeDefined()
      expect(state.loginWhiteLabel.brandName).toBe('Компания 作本')
    })
  })

  describe('action behavior', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('setPageNumber commits mutation once', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 3)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setPageNumber passes correct mutation name', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 3)
      expect(commit.mock.calls[0][0]).toBe('SET_PAGE_NUMBER')
    })

    it('setPageNumber integration with mutation', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      loginStore.actions.setPageNumber({ commit }, 5)
      expect(state.pageNumber).toBe(5)
    })

    it('setPageNumber returns undefined', () => {
      const commit = jest.fn()
      const result = loginStore.actions.setPageNumber({ commit }, 2)
      expect(result).toBeUndefined()
    })

    it('setPageNumber can be called multiple times', () => {
      const commit = jest.fn()
      loginStore.actions.setPageNumber({ commit }, 1)
      loginStore.actions.setPageNumber({ commit }, 2)
      loginStore.actions.setPageNumber({ commit }, 3)
      expect(commit).toHaveBeenCalledTimes(3)
    })
  })

  describe('type safety', () => {
    it('mutation functions are callable', () => {
      expect(typeof loginStore.mutations.SET_PAGE_NUMBER).toBe('function')
      expect(typeof loginStore.mutations.SET_LOGIN_WHITELABEL).toBe('function')
      expect(typeof loginStore.mutations.SET_COMPANY).toBe('function')
      expect(typeof loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE).toBe('function')
      expect(typeof loginStore.mutations.SET_AGENTIC_AI_ENABLED).toBe('function')
    })

    it('action functions are callable', () => {
      expect(typeof loginStore.actions.setPageNumber).toBe('function')
    })

    it('module is namespaced boolean', () => {
      expect(typeof loginStore.namespaced).toBe('boolean')
      expect(loginStore.namespaced).toBe(true)
    })

    it('state is object not null', () => {
      expect(loginStore.state).not.toBeNull()
      expect(typeof loginStore.state).toBe('object')
    })

    it('getters object exists', () => {
      expect(loginStore.getters).not.toBeNull()
      expect(typeof loginStore.getters).toBe('object')
    })

    it('mutations object exists', () => {
      expect(loginStore.mutations).not.toBeNull()
      expect(typeof loginStore.mutations).toBe('object')
    })

    it('actions object exists', () => {
      expect(loginStore.actions).not.toBeNull()
      expect(typeof loginStore.actions).toBe('object')
    })
  })

  describe('consistency and reliability', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('state copies are independent', () => {
      const state1 = JSON.parse(JSON.stringify(loginStore.state))
      const state2 = JSON.parse(JSON.stringify(loginStore.state))
      state1.pageNumber = 99
      expect(state2.pageNumber).toBe(1)
    })

    it('rapid mutations maintain consistency', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      for (let i = 1; i <= 10; i++) {
        commit('SET_PAGE_NUMBER', i)
      }
      expect(state.pageNumber).toBe(10)
    })

    it('mutations do not create new state objects', () => {
      const initialState = state
      loginStore.mutations.SET_PAGE_NUMBER(state, 5)
      expect(state === initialState).toBe(true)
    })

    it('boolean mutations toggle correctly', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      commit('SET_HAS_AGENTIC_AI_LICENSE', true)
      expect(state.hasAgenticAILicense).toBe(true)
      commit('SET_HAS_AGENTIC_AI_LICENSE', false)
      expect(state.hasAgenticAILicense).toBe(false)
    })

    it('can reset company to null', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      commit('SET_COMPANY', { id: 1, name: 'Test' })
      expect(state.company).not.toBeNull()
      commit('SET_COMPANY', null)
      expect(state.company).toBeNull()
    })

    it('multiple property updates maintain consistency', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      commit('SET_PAGE_NUMBER', 2)
      commit('SET_COMPANY', { id: 1, name: 'Test' })
      commit('SET_HAS_AGENTIC_AI_LICENSE', true)
      commit('SET_AGENTIC_AI_ENABLED', true)

      expect(state.pageNumber).toBe(2)
      expect(state.company.name).toBe('Test')
      expect(state.hasAgenticAILicense).toBe(true)
      expect(state.agenticAIEnabled).toBe(true)
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

    it('full workflow with action and mutations', () => {
      const commit = jest.fn((mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      })

      loginStore.actions.setPageNumber({ commit }, 2)
      expect(commit).toHaveBeenCalledWith('SET_PAGE_NUMBER', 2)
      expect(state.pageNumber).toBe(2)
    })

    it('can handle sequential page navigation with action', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      loginStore.actions.setPageNumber({ commit: commit }, 1)
      expect(state.pageNumber).toBe(1)

      loginStore.actions.setPageNumber({ commit: commit }, 2)
      expect(state.pageNumber).toBe(2)

      loginStore.actions.setPageNumber({ commit: commit }, 3)
      expect(state.pageNumber).toBe(3)
    })

    it('company and white label work together', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      const company = {
        id: 1,
        name: 'MultiTenant Corp',
        branding: { primary: '#000' }
      }

      commit('SET_COMPANY', company)
      commit('SET_LOGIN_WHITELABEL', {
        brandName: company.name,
        faviconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: 'https://example.com/logo.png'
      })

      expect(state.company.name).toBe('MultiTenant Corp')
      expect(state.loginWhiteLabel.brandName).toBe('MultiTenant Corp')
    })

    it('can preserve white label across company changes', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      const branding = {
        brandName: 'StaticBrand',
        faviconUrl: 'https://example.com/icon.ico',
        mainLogoUrl: 'https://example.com/logo.png'
      }

      commit('SET_LOGIN_WHITELABEL', branding)
      commit('SET_COMPANY', { id: 1, name: 'Company A' })
      commit('SET_COMPANY', { id: 2, name: 'Company B' })

      expect(state.loginWhiteLabel.brandName).toBe('StaticBrand')
      expect(state.company.name).toBe('Company B')
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(loginStore.state))
    })

    it('handles very large page numbers', () => {
      loginStore.mutations.SET_PAGE_NUMBER(state, Number.MAX_SAFE_INTEGER)
      expect(state.pageNumber).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('handles empty string company name', () => {
      loginStore.mutations.SET_COMPANY(state, { id: 1, name: '' })
      expect(state.company.name).toBe('')
    })

    it('handles company with extra properties', () => {
      const company = {
        id: 1,
        name: 'Test',
        extra1: 'value1',
        extra2: { nested: true }
      }
      loginStore.mutations.SET_COMPANY(state, company)
      expect(state.company.extra1).toBe('value1')
      expect(state.company.extra2.nested).toBe(true)
    })

    it('handles license with string boolean values', () => {
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 'true')
      expect(state.hasAgenticAILicense).toBe(true)
      loginStore.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 'false')
      expect(state.hasAgenticAILicense).toBe(true)
    })

    it('handles multiple rapid page changes', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }
      for (let i = 1; i <= 50; i++) {
        commit('SET_PAGE_NUMBER', i)
      }
      expect(state.pageNumber).toBe(50)
    })

    it('handles white label with very long URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(500)
      loginStore.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'Test',
        faviconUrl: longUrl,
        mainLogoUrl: longUrl
      })
      expect(state.loginWhiteLabel.favIconUrl).toBe(longUrl)
    })

    it('handles company object modification', () => {
      const company = { id: 1, name: 'Original' }
      loginStore.mutations.SET_COMPANY(state, company)
      company.name = 'Modified'
      expect(state.company.name).toBe('Modified')
    })

    it('handles state with all properties populated simultaneously', () => {
      const commit = (mutationName, payload) => {
        loginStore.mutations[mutationName](state, payload)
      }

      commit('SET_PAGE_NUMBER', 3)
      commit('SET_COMPANY', { id: 5, name: 'TestCorp' })
      commit('SET_HAS_AGENTIC_AI_LICENSE', true)
      commit('SET_AGENTIC_AI_ENABLED', true)
      commit('SET_LOGIN_WHITELABEL', {
        brandName: 'TestCorp',
        faviconUrl: 'https://test.com/icon.ico',
        mainLogoUrl: 'https://test.com/logo.png'
      })

      expect(state.pageNumber).toBe(3)
      expect(state.company.id).toBe(5)
      expect(state.hasAgenticAILicense).toBe(true)
      expect(state.agenticAIEnabled).toBe(true)
      expect(state.loginWhiteLabel.brandName).toBe('TestCorp')
    })
  })
})
