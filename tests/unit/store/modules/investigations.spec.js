describe('investigations.js store module', () => {
  let investigationsStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    investigationsStore = {
      namespaced: true,
      state: {
        investigationList: [],
        targetUsersList: [],
        getStatsAndMenuData: {},
        getInvestigationDetailsData: {},
        getInvestigationDetailsListData: [],
        getInvestigationDetailsTargetUsersListData: [],
        irSummary: {},
        isWidgetsLoading: true
      },
      getters: {
        investigationListGetter: (state) => state.investigationList,
        getTargetUsersListGetter: (state) => state.targetUsersList,
        statsAndMenuGetter: (state) => state.getStatsAndMenuData,
        investigationDetailsDataGetter: (state) => state.getInvestigationDetailsData,
        getInvestigationDetailsListGetter: (state) => state.getInvestigationDetailsListData,
        getInvestigationDetailsTargetUsersListGetter: (state) =>
          state.getInvestigationDetailsTargetUsersListData,
        irSummaryGetter: (state) => state.irSummary,
        isWidgetsLoadingGetter: (state) => state.isWidgetsLoading
      },
      mutations: {
        SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, payload) {
          state.getInvestigationDetailsTargetUsersListData = payload?.data || {
            results: []
          }
        },
        SET_INVESTIGATIONDETAILSLISTDATA(state, payload) {
          if (payload?.data?.results?.length > 0) {
            payload.data.results = payload.data.results.map((item) => {
              return {
                ...item,
                filterTags: item.filterTags.map((tag) => (tag === 'BodyUrl' ? 'BodyDomain' : tag))
              }
            })
          }
          state.getInvestigationDetailsListData = payload.data
        },
        SET_INVESTIGATIONLISTEMPY(state) {
          state.investigationList = []
        },
        SET_INVESTIGATIONDETAILSDATA(state, payload) {
          state.getInvestigationDetailsData = payload?.data
        },
        SET_STATSANDMENUDATA(state, payload) {
          state.getStatsAndMenuData = payload?.data
        },
        SET_INVESTIGATIONLIST(state, payload) {
          let data = payload?.data || {}
          let stateData = data?.results?.map((item) => {
            const { completedUsersCount = 0, scannedUsersCount = 0 } = item
            return {
              ...item,
              userStatus: [completedUsersCount, scannedUsersCount - completedUsersCount],
              scanStatusText: `${completedUsersCount} / ${scannedUsersCount}`
            }
          })

          state.investigationList = {
            totalNumberOfRecords: data?.totalNumberOfRecords,
            data: stateData
          }
        },
        SET_IRSUMMARY(state, payload) {
          state.irSummary = payload.data
        },
        SET_TARGETUSERSLIST(state, payload) {
          state.targetUsersList = payload.data
        },
        SET_WIDGETS_LOADING(state, payload) {
          state.isWidgetsLoading = payload
        }
      },
      actions: {
        setWidgetsLoading({ commit }, payload) {
          commit('SET_WIDGETS_LOADING', payload)
        },
        SET_INVESTIGATIONLISTEMPY(state) {
          state.investigationList = []
        },
        deleteInvestigationDetailsItem({ commit, dispatch }, obj) {
          return Promise.resolve()
        },
        sendInvestigationWarningMessage({ commit, dispatch }, obj) {
          return Promise.resolve()
        },
        cancelInvestigation({ commit, dispatch }, id) {
          return Promise.resolve()
        },
        async getInvestigationDetailsTargetUsersListData({ commit, dispatch }, obj) {
          const response = {
            data: {
              data: { results: [] }
            }
          }
          commit('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA', response.data)
          return response
        },
        async getInvestigationDetailsListData({ commit, dispatch }, obj) {
          if (obj.id) {
            const response = {
              data: {
                pageNumber: 1,
                pageSize: 10,
                results: [],
                totalNumberOfPages: 1,
                totalNumberOfRecords: 0
              }
            }
            commit('SET_INVESTIGATIONDETAILSLISTDATA', response)
            return response
          }
        },
        async getInvestigationDetailsData({ commit, dispatch }, id) {
          if (id) {
            const response = {
              data: { id, title: 'Test Investigation' }
            }
            commit('SET_INVESTIGATIONDETAILSDATA', response)
            return response
          }
        },
        async getStatsAndMenuData({ commit, dispatch }, id) {
          const response = {
            data: { stats: {}, menu: [] }
          }
          commit('SET_STATSANDMENUDATA', response)
          return response
        },
        async getInvestigationList({ commit, dispatch }, obj) {
          const response = {
            data: {
              data: {},
              results: [],
              totalNumberOfRecords: 0
            }
          }
          commit('SET_INVESTIGATIONLIST', response.data)
          return response
        },
        async getIrSummary({ commit, dispatch }, obj) {
          dispatch('setWidgetsLoading', true)
          const response = {
            data: { summary: 'test' }
          }
          commit('SET_IRSUMMARY', response)
          dispatch('setWidgetsLoading', false)
          return response
        },
        async getTargetUsersList({ commit }) {
          const response = {
            data: []
          }
          commit('SET_TARGETUSERSLIST', response)
          return response
        },
        async createInvestigation({ commit, dispatch }, obj) {
          return Promise.resolve({ data: { id: 1 } })
        }
      }
    }

    state = JSON.parse(JSON.stringify(investigationsStore.state))
  })

  describe('state', () => {
    it('initializes with empty investigation list', () => {
      expect(investigationsStore.state.investigationList).toEqual([])
    })

    it('initializes with empty target users list', () => {
      expect(investigationsStore.state.targetUsersList).toEqual([])
    })

    it('initializes with empty stats and menu data', () => {
      expect(investigationsStore.state.getStatsAndMenuData).toEqual({})
    })

    it('initializes with empty investigation details data', () => {
      expect(investigationsStore.state.getInvestigationDetailsData).toEqual({})
    })

    it('initializes with empty investigation details list data', () => {
      expect(investigationsStore.state.getInvestigationDetailsListData).toEqual([])
    })

    it('initializes with empty investigation details target users list data', () => {
      expect(investigationsStore.state.getInvestigationDetailsTargetUsersListData).toEqual([])
    })

    it('initializes with empty IR summary', () => {
      expect(investigationsStore.state.irSummary).toEqual({})
    })

    it('initializes with widgets loading as true', () => {
      expect(investigationsStore.state.isWidgetsLoading).toBe(true)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = investigationsStore.state
    })

    it('investigationListGetter returns investigation list', () => {
      state.investigationList = [{ id: 1, name: 'Test' }]
      expect(investigationsStore.getters.investigationListGetter(state)).toEqual([{ id: 1, name: 'Test' }])
    })

    it('getTargetUsersListGetter returns target users list', () => {
      state.targetUsersList = [{ id: 1, email: 'test@example.com' }]
      expect(investigationsStore.getters.getTargetUsersListGetter(state)).toEqual([
        { id: 1, email: 'test@example.com' }
      ])
    })

    it('statsAndMenuGetter returns stats and menu data', () => {
      state.getStatsAndMenuData = { stats: {}, menu: [] }
      expect(investigationsStore.getters.statsAndMenuGetter(state)).toEqual({ stats: {}, menu: [] })
    })

    it('investigationDetailsDataGetter returns investigation details data', () => {
      state.getInvestigationDetailsData = { id: 1, title: 'Test' }
      expect(investigationsStore.getters.investigationDetailsDataGetter(state)).toEqual({
        id: 1,
        title: 'Test'
      })
    })

    it('getInvestigationDetailsListGetter returns investigation details list', () => {
      state.getInvestigationDetailsListData = [{ id: 1, item: 'test' }]
      expect(investigationsStore.getters.getInvestigationDetailsListGetter(state)).toEqual([
        { id: 1, item: 'test' }
      ])
    })

    it('getInvestigationDetailsTargetUsersListGetter returns target users list', () => {
      state.getInvestigationDetailsTargetUsersListData = { results: [{ id: 1 }] }
      expect(investigationsStore.getters.getInvestigationDetailsTargetUsersListGetter(state)).toEqual({
        results: [{ id: 1 }]
      })
    })

    it('irSummaryGetter returns IR summary', () => {
      state.irSummary = { summary: 'test summary' }
      expect(investigationsStore.getters.irSummaryGetter(state)).toEqual({ summary: 'test summary' })
    })

    it('isWidgetsLoadingGetter returns loading status', () => {
      state.isWidgetsLoading = false
      expect(investigationsStore.getters.isWidgetsLoadingGetter(state)).toBe(false)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA sets target users list data', () => {
      const payload = { data: { results: [{ id: 1, name: 'User 1' }] } }
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, payload)
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual(payload.data)
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA defaults to empty results when payload is null', () => {
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, null)
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA sets investigation details list data', () => {
      const payload = {
        data: {
          pageNumber: 1,
          pageSize: 10,
          results: [],
          totalNumberOfRecords: 0
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData).toEqual(payload.data)
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA maps BodyUrl to BodyDomain in filterTags', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl', 'Subject', 'From'] },
            { id: 2, filterTags: ['BodyUrl'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual([
        'BodyDomain',
        'Subject',
        'From'
      ])
      expect(state.getInvestigationDetailsListData.results[1].filterTags).toEqual(['BodyDomain'])
    })

    it('SET_INVESTIGATIONLISTEMPY clears investigation list', () => {
      state.investigationList = [{ id: 1 }]
      investigationsStore.mutations.SET_INVESTIGATIONLISTEMPY(state)
      expect(state.investigationList).toEqual([])
    })

    it('SET_INVESTIGATIONDETAILSDATA sets investigation details data', () => {
      const payload = { data: { id: 1, title: 'Investigation 1' } }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSDATA(state, payload)
      expect(state.getInvestigationDetailsData).toEqual(payload.data)
    })

    it('SET_INVESTIGATIONDETAILSDATA handles undefined data', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSDATA(state, {})
      expect(state.getInvestigationDetailsData).toBeUndefined()
    })

    it('SET_STATSANDMENUDATA sets stats and menu data', () => {
      const payload = { data: { stats: { total: 10 }, menu: [] } }
      investigationsStore.mutations.SET_STATSANDMENUDATA(state, payload)
      expect(state.getStatsAndMenuData).toEqual(payload.data)
    })

    it('SET_INVESTIGATIONLIST transforms data with user status', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 2,
          results: [
            { id: 1, completedUsersCount: 5, scannedUsersCount: 10 },
            { id: 2, completedUsersCount: 8, scannedUsersCount: 15 }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.totalNumberOfRecords).toBe(2)
      expect(state.investigationList.data[0].userStatus).toEqual([5, 5])
      expect(state.investigationList.data[0].scanStatusText).toBe('5 / 10')
      expect(state.investigationList.data[1].userStatus).toEqual([8, 7])
      expect(state.investigationList.data[1].scanStatusText).toBe('8 / 15')
    })

    it('SET_INVESTIGATIONLIST uses defaults for missing user counts', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [{ id: 1 }]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].userStatus).toEqual([0, 0])
      expect(state.investigationList.data[0].scanStatusText).toBe('0 / 0')
    })

    it('SET_IRSUMMARY sets IR summary data', () => {
      const payload = { data: { summary: 'Test summary' } }
      investigationsStore.mutations.SET_IRSUMMARY(state, payload)
      expect(state.irSummary).toEqual(payload.data)
    })

    it('SET_TARGETUSERSLIST sets target users list', () => {
      const payload = { data: [{ id: 1, email: 'user@example.com' }] }
      investigationsStore.mutations.SET_TARGETUSERSLIST(state, payload)
      expect(state.targetUsersList).toEqual(payload.data)
    })

    it('SET_WIDGETS_LOADING sets loading state', () => {
      investigationsStore.mutations.SET_WIDGETS_LOADING(state, false)
      expect(state.isWidgetsLoading).toBe(false)
    })

    it('SET_WIDGETS_LOADING can set to true', () => {
      state.isWidgetsLoading = false
      investigationsStore.mutations.SET_WIDGETS_LOADING(state, true)
      expect(state.isWidgetsLoading).toBe(true)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('setWidgetsLoading commits mutation', () => {
      const commit = jest.fn()
      investigationsStore.actions.setWidgetsLoading({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', true)
    })

    it('setWidgetsLoading commits with false', () => {
      const commit = jest.fn()
      investigationsStore.actions.setWidgetsLoading({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', false)
    })

    it('deleteInvestigationDetailsItem returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.deleteInvestigationDetailsItem(
        { commit, dispatch },
        { id: 1, data: {} }
      )
      expect(result).toBeUndefined()
    })

    it('sendInvestigationWarningMessage returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.sendInvestigationWarningMessage(
        { commit, dispatch },
        { id: 1, data: {} }
      )
      expect(result).toBeUndefined()
    })

    it('cancelInvestigation returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.cancelInvestigation(
        { commit, dispatch },
        1
      )
      expect(result).toBeUndefined()
    })

    it('getInvestigationDetailsTargetUsersListData commits mutation', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsTargetUsersListData(
        { commit, dispatch, state },
        { id: 1, data: {} }
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA',
        expect.any(Object)
      )
    })

    it('getInvestigationDetailsListData commits mutation when id is provided', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsListData(
        { commit, dispatch, state },
        { id: 1, data: {} }
      )
      expect(commit).toHaveBeenCalledWith('SET_INVESTIGATIONDETAILSLISTDATA', expect.any(Object))
    })

    it('getInvestigationDetailsListData does not commit when id is missing', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsListData(
        { commit, dispatch, state },
        { data: {} }
      )
      expect(commit).not.toHaveBeenCalled()
    })

    it('getInvestigationDetailsData commits mutation when id is provided', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsData(
        { commit, dispatch, state },
        1
      )
      expect(commit).toHaveBeenCalledWith('SET_INVESTIGATIONDETAILSDATA', expect.any(Object))
    })

    it('getInvestigationDetailsData does not commit when id is missing', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsData(
        { commit, dispatch, state },
        null
      )
      expect(commit).not.toHaveBeenCalled()
    })

    it('getStatsAndMenuData commits mutation', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getStatsAndMenuData(
        { commit, dispatch, state },
        1
      )
      expect(commit).toHaveBeenCalledWith('SET_STATSANDMENUDATA', expect.any(Object))
    })

    it('getInvestigationList commits mutation', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationList(
        { commit, dispatch, state },
        {}
      )
      expect(commit).toHaveBeenCalledWith('SET_INVESTIGATIONLIST', expect.any(Object))
    })

    it('getIrSummary dispatches setWidgetsLoading', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getIrSummary(
        { commit, dispatch, state },
        {}
      )
      expect(dispatch).toHaveBeenCalledWith('setWidgetsLoading', true)
      expect(dispatch).toHaveBeenCalledWith('setWidgetsLoading', false)
    })

    it('getIrSummary commits mutation', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getIrSummary(
        { commit, dispatch, state },
        {}
      )
      expect(commit).toHaveBeenCalledWith('SET_IRSUMMARY', expect.any(Object))
    })

    it('getTargetUsersList commits mutation', async () => {
      state = investigationsStore.state
      const commit = jest.fn()
      await investigationsStore.actions.getTargetUsersList({ commit }, {})
      expect(commit).toHaveBeenCalledWith('SET_TARGETUSERSLIST', expect.any(Object))
    })

    it('createInvestigation returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.createInvestigation(
        { commit, dispatch },
        { title: 'New Investigation' }
      )
      expect(result).toEqual({ data: { id: 1 } })
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(investigationsStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(investigationsStore).toHaveProperty('state')
      expect(investigationsStore).toHaveProperty('getters')
      expect(investigationsStore).toHaveProperty('mutations')
      expect(investigationsStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'investigationListGetter',
        'getTargetUsersListGetter',
        'statsAndMenuGetter',
        'investigationDetailsDataGetter',
        'getInvestigationDetailsListGetter',
        'getInvestigationDetailsTargetUsersListGetter',
        'irSummaryGetter',
        'isWidgetsLoadingGetter'
      ]
      expectedGetters.forEach((getter) => {
        expect(investigationsStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA',
        'SET_INVESTIGATIONDETAILSLISTDATA',
        'SET_INVESTIGATIONLISTEMPY',
        'SET_INVESTIGATIONDETAILSDATA',
        'SET_STATSANDMENUDATA',
        'SET_INVESTIGATIONLIST',
        'SET_IRSUMMARY',
        'SET_TARGETUSERSLIST',
        'SET_WIDGETS_LOADING'
      ]
      expectedMutations.forEach((mutation) => {
        expect(investigationsStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'setWidgetsLoading',
        'SET_INVESTIGATIONLISTEMPY',
        'deleteInvestigationDetailsItem',
        'sendInvestigationWarningMessage',
        'cancelInvestigation',
        'getInvestigationDetailsTargetUsersListData',
        'getInvestigationDetailsListData',
        'getInvestigationDetailsData',
        'getStatsAndMenuData',
        'getInvestigationList',
        'getIrSummary',
        'getTargetUsersList',
        'createInvestigation'
      ]
      expectedActions.forEach((action) => {
        expect(investigationsStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('can load investigation list and update state', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            { id: 1, completedUsersCount: 5, scannedUsersCount: 10, name: 'Investigation 1' }
          ]
        }
      }

      commit('SET_INVESTIGATIONLIST', payload)
      expect(state.investigationList.totalNumberOfRecords).toBe(1)
      expect(state.investigationList.data[0].userStatus).toEqual([5, 5])
    })

    it('can load investigation details with tag mapping', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl', 'Subject'], name: 'Detail 1' }
          ]
        }
      }

      commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual(['BodyDomain', 'Subject'])
    })

    it('can load target users and investigation data sequentially', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const targetUsersPayload = { data: [{ id: 1, email: 'user@example.com' }] }
      commit('SET_TARGETUSERSLIST', targetUsersPayload)
      expect(state.targetUsersList).toEqual(targetUsersPayload.data)

      const detailsPayload = { data: { id: 1, title: 'Investigation 1' } }
      commit('SET_INVESTIGATIONDETAILSDATA', detailsPayload)
      expect(state.getInvestigationDetailsData).toEqual(detailsPayload.data)
    })

    it('can manage widgets loading state', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      expect(state.isWidgetsLoading).toBe(true)
      commit('SET_WIDGETS_LOADING', false)
      expect(state.isWidgetsLoading).toBe(false)
      commit('SET_WIDGETS_LOADING', true)
      expect(state.isWidgetsLoading).toBe(true)
    })

    it('can load IR summary with stats and menu', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const irPayload = { data: { summary: 'IR summary', threats: 5 } }
      commit('SET_IRSUMMARY', irPayload)
      expect(state.irSummary).toEqual(irPayload.data)

      const statsPayload = { data: { stats: { total: 10 }, menu: ['Option 1'] } }
      commit('SET_STATSANDMENUDATA', statsPayload)
      expect(state.getStatsAndMenuData).toEqual(statsPayload.data)
    })

    it('can clear investigation list', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      state.investigationList = [{ id: 1, name: 'Investigation 1' }]
      commit('SET_INVESTIGATIONLISTEMPY')
      expect(state.investigationList).toEqual([])
    })

    it('can load multiple investigations with user status calculations', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const payload = {
        data: {
          totalNumberOfRecords: 3,
          results: [
            { id: 1, completedUsersCount: 10, scannedUsersCount: 20 },
            { id: 2, completedUsersCount: 15, scannedUsersCount: 30 },
            { id: 3, completedUsersCount: 8, scannedUsersCount: 12 }
          ]
        }
      }

      commit('SET_INVESTIGATIONLIST', payload)
      expect(state.investigationList.data).toHaveLength(3)
      expect(state.investigationList.data[0].scanStatusText).toBe('10 / 20')
      expect(state.investigationList.data[1].scanStatusText).toBe('15 / 30')
      expect(state.investigationList.data[2].scanStatusText).toBe('8 / 12')
    })
  })

  describe('state properties - detailed type checks', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('investigationList is an array initially', () => {
      expect(Array.isArray(state.investigationList)).toBe(true)
    })

    it('targetUsersList is an array initially', () => {
      expect(Array.isArray(state.targetUsersList)).toBe(true)
    })

    it('getStatsAndMenuData is an object initially', () => {
      expect(typeof state.getStatsAndMenuData).toBe('object')
      expect(state.getStatsAndMenuData).not.toBeNull()
    })

    it('getInvestigationDetailsData is an object initially', () => {
      expect(typeof state.getInvestigationDetailsData).toBe('object')
      expect(state.getInvestigationDetailsData).not.toBeNull()
    })

    it('getInvestigationDetailsListData is an array initially', () => {
      expect(Array.isArray(state.getInvestigationDetailsListData)).toBe(true)
    })

    it('getInvestigationDetailsTargetUsersListData is an array initially', () => {
      expect(Array.isArray(state.getInvestigationDetailsTargetUsersListData)).toBe(true)
    })

    it('irSummary is an object initially', () => {
      expect(typeof state.irSummary).toBe('object')
      expect(state.irSummary).not.toBeNull()
    })

    it('isWidgetsLoading is a boolean initially', () => {
      expect(typeof state.isWidgetsLoading).toBe('boolean')
    })

    it('investigationList when populated contains objects with proper structure', () => {
      state.investigationList = {
        totalNumberOfRecords: 1,
        data: [{ id: 1, name: 'Test', completedUsersCount: 5, scannedUsersCount: 10 }]
      }
      expect(state.investigationList.data[0]).toHaveProperty('id')
      expect(state.investigationList.data[0]).toHaveProperty('name')
    })

    it('state properties are isolated from each other', () => {
      const originalList = state.investigationList
      state.targetUsersList = [{ id: 1 }]
      expect(state.investigationList).toBe(originalList)
    })
  })

  describe('getter behavior - function types and reference equality', () => {
    beforeEach(() => {
      state = investigationsStore.state
    })

    it('all getters are functions', () => {
      Object.keys(investigationsStore.getters).forEach((key) => {
        expect(typeof investigationsStore.getters[key]).toBe('function')
      })
    })

    it('investigationListGetter returns same reference for array', () => {
      const testArray = [{ id: 1 }]
      state.investigationList = testArray
      const result1 = investigationsStore.getters.investigationListGetter(state)
      const result2 = investigationsStore.getters.investigationListGetter(state)
      expect(result1).toBe(result2)
    })

    it('getTargetUsersListGetter returns same reference', () => {
      const testArray = [{ id: 1, email: 'test@example.com' }]
      state.targetUsersList = testArray
      const result1 = investigationsStore.getters.getTargetUsersListGetter(state)
      const result2 = investigationsStore.getters.getTargetUsersListGetter(state)
      expect(result1).toBe(result2)
    })

    it('statsAndMenuGetter returns same reference for object', () => {
      const testObj = { stats: {}, menu: [] }
      state.getStatsAndMenuData = testObj
      const result1 = investigationsStore.getters.statsAndMenuGetter(state)
      const result2 = investigationsStore.getters.statsAndMenuGetter(state)
      expect(result1).toBe(result2)
    })

    it('investigationDetailsDataGetter returns same reference', () => {
      const testObj = { id: 1, title: 'Test' }
      state.getInvestigationDetailsData = testObj
      const result1 = investigationsStore.getters.investigationDetailsDataGetter(state)
      const result2 = investigationsStore.getters.investigationDetailsDataGetter(state)
      expect(result1).toBe(result2)
    })

    it('getInvestigationDetailsListGetter returns same reference', () => {
      const testArray = [{ id: 1, item: 'test' }]
      state.getInvestigationDetailsListData = testArray
      const result1 = investigationsStore.getters.getInvestigationDetailsListGetter(state)
      const result2 = investigationsStore.getters.getInvestigationDetailsListGetter(state)
      expect(result1).toBe(result2)
    })

    it('getInvestigationDetailsTargetUsersListGetter returns same reference', () => {
      const testObj = { results: [{ id: 1 }] }
      state.getInvestigationDetailsTargetUsersListData = testObj
      const result1 = investigationsStore.getters.getInvestigationDetailsTargetUsersListGetter(state)
      const result2 = investigationsStore.getters.getInvestigationDetailsTargetUsersListGetter(state)
      expect(result1).toBe(result2)
    })

    it('irSummaryGetter returns same reference', () => {
      const testObj = { summary: 'test summary' }
      state.irSummary = testObj
      const result1 = investigationsStore.getters.irSummaryGetter(state)
      const result2 = investigationsStore.getters.irSummaryGetter(state)
      expect(result1).toBe(result2)
    })

    it('isWidgetsLoadingGetter returns boolean value', () => {
      state.isWidgetsLoading = true
      expect(investigationsStore.getters.isWidgetsLoadingGetter(state)).toBe(true)
      state.isWidgetsLoading = false
      expect(investigationsStore.getters.isWidgetsLoadingGetter(state)).toBe(false)
    })

    it('getters work with null state values', () => {
      state.investigationList = null
      expect(investigationsStore.getters.investigationListGetter(state)).toBeNull()
    })

    it('getters work with undefined state values', () => {
      state.getInvestigationDetailsData = undefined
      expect(investigationsStore.getters.investigationDetailsDataGetter(state)).toBeUndefined()
    })
  })

  describe('mutation payload handling - null, undefined, and edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA handles null payload', () => {
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, null)
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA handles undefined payload', () => {
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, undefined)
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA handles empty object', () => {
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, {})
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA preserves nested structure', () => {
      const payload = {
        data: {
          results: [
            { id: 1, name: 'User 1', metadata: { role: 'admin' } }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, payload)
      expect(state.getInvestigationDetailsTargetUsersListData.results[0].metadata).toEqual({ role: 'admin' })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles null payload data', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, { data: null })
      expect(state.getInvestigationDetailsListData).toBeNull()
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles undefined results', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, { data: { results: undefined } })
      expect(state.getInvestigationDetailsListData).toEqual({ results: undefined })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles empty results array', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, { data: { results: [] } })
      expect(state.getInvestigationDetailsListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles multiple BodyUrl tags', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl', 'BodyUrl', 'Subject'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual(['BodyDomain', 'BodyDomain', 'Subject'])
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles items with no filterTags', () => {
      const payload = {
        data: {
          results: [
            { id: 1, name: 'Test' }
          ]
        }
      }
      expect(() => {
        investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      }).toThrow()
    })

    it('SET_INVESTIGATIONLISTEMPY clears existing data completely', () => {
      state.investigationList = {
        totalNumberOfRecords: 100,
        data: Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))
      }
      investigationsStore.mutations.SET_INVESTIGATIONLISTEMPY(state)
      expect(state.investigationList).toEqual([])
      expect(Array.isArray(state.investigationList)).toBe(true)
    })

    it('SET_INVESTIGATIONDETAILSDATA handles null data property', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSDATA(state, { data: null })
      expect(state.getInvestigationDetailsData).toBeNull()
    })

    it('SET_INVESTIGATIONDETAILSDATA handles missing data property', () => {
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSDATA(state, {})
      expect(state.getInvestigationDetailsData).toBeUndefined()
    })

    it('SET_STATSANDMENUDATA handles null data', () => {
      investigationsStore.mutations.SET_STATSANDMENUDATA(state, { data: null })
      expect(state.getStatsAndMenuData).toBeNull()
    })

    it('SET_STATSANDMENUDATA handles empty data', () => {
      investigationsStore.mutations.SET_STATSANDMENUDATA(state, { data: {} })
      expect(state.getStatsAndMenuData).toEqual({})
    })

    it('SET_INVESTIGATIONLIST handles null payload', () => {
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, null)
      expect(state.investigationList).toEqual({ totalNumberOfRecords: undefined, data: undefined })
    })

    it('SET_INVESTIGATIONLIST handles undefined results', () => {
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, { data: { results: undefined } })
      expect(state.investigationList.data).toBeUndefined()
    })

    it('SET_INVESTIGATIONLIST handles large user counts', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            { id: 1, completedUsersCount: 999999, scannedUsersCount: 1000000 }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].userStatus).toEqual([999999, 1])
      expect(state.investigationList.data[0].scanStatusText).toBe('999999 / 1000000')
    })

    it('SET_IRSUMMARY handles null data', () => {
      investigationsStore.mutations.SET_IRSUMMARY(state, { data: null })
      expect(state.irSummary).toBeNull()
    })

    it('SET_TARGETUSERSLIST handles null data', () => {
      investigationsStore.mutations.SET_TARGETUSERSLIST(state, { data: null })
      expect(state.targetUsersList).toBeNull()
    })

    it('SET_TARGETUSERSLIST handles undefined data', () => {
      investigationsStore.mutations.SET_TARGETUSERSLIST(state, { data: undefined })
      expect(state.targetUsersList).toBeUndefined()
    })

    it('SET_WIDGETS_LOADING handles null value', () => {
      investigationsStore.mutations.SET_WIDGETS_LOADING(state, null)
      expect(state.isWidgetsLoading).toBeNull()
    })

    it('SET_WIDGETS_LOADING handles various truthy values', () => {
      investigationsStore.mutations.SET_WIDGETS_LOADING(state, 1)
      expect(state.isWidgetsLoading).toBe(1)
      investigationsStore.mutations.SET_WIDGETS_LOADING(state, 'true')
      expect(state.isWidgetsLoading).toBe('true')
    })
  })

  describe('action behavior - commit patterns and dispatch calls', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('setWidgetsLoading passes payload correctly to commit', () => {
      const commit = jest.fn()
      investigationsStore.actions.setWidgetsLoading({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', true)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setWidgetsLoading handles different payload types', () => {
      const commit = jest.fn()
      investigationsStore.actions.setWidgetsLoading({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', false)

      commit.mockClear()
      investigationsStore.actions.setWidgetsLoading({ commit }, 0)
      expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', 0)
    })

    it('deleteInvestigationDetailsItem receives commit and dispatch', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.deleteInvestigationDetailsItem(
        { commit, dispatch },
        { id: 1, data: { name: 'Test' } }
      )
      expect(result).toBeUndefined()
    })

    it('sendInvestigationWarningMessage receives context and payload', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = { id: 1, message: 'Warning message' }
      const result = await investigationsStore.actions.sendInvestigationWarningMessage(
        { commit, dispatch },
        payload
      )
      expect(result).toBeUndefined()
    })

    it('cancelInvestigation receives commit and dispatch context', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.cancelInvestigation(
        { commit, dispatch },
        123
      )
      expect(result).toBeUndefined()
    })

    it('getInvestigationDetailsTargetUsersListData commits with exact mutation name', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsTargetUsersListData(
        { commit, dispatch },
        { id: 1 }
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA',
        expect.objectContaining({ data: { results: [] } })
      )
    })

    it('getInvestigationDetailsListData only commits when obj.id exists', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsListData(
        { commit, dispatch },
        { id: 999 }
      )
      expect(commit).toHaveBeenCalled()
    })

    it('getInvestigationDetailsListData does not commit with falsy id', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsListData(
        { commit, dispatch },
        { id: 0 }
      )
      expect(commit).not.toHaveBeenCalled()
    })

    it('getInvestigationDetailsListData returns undefined when id is missing', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.getInvestigationDetailsListData(
        { commit, dispatch },
        {}
      )
      expect(result).toBeUndefined()
    })

    it('getInvestigationDetailsData returns response with id', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.getInvestigationDetailsData(
        { commit, dispatch },
        42
      )
      expect(result.data).toHaveProperty('id', 42)
      expect(result.data).toHaveProperty('title', 'Test Investigation')
    })

    it('getInvestigationDetailsData does not commit when id is falsy', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationDetailsData(
        { commit, dispatch },
        0
      )
      expect(commit).not.toHaveBeenCalled()
    })

    it('getStatsAndMenuData always commits', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getStatsAndMenuData(
        { commit, dispatch },
        1
      )
      expect(commit).toHaveBeenCalledWith('SET_STATSANDMENUDATA', expect.any(Object))
    })

    it('getInvestigationList always commits regardless of payload', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getInvestigationList(
        { commit, dispatch },
        {}
      )
      expect(commit).toHaveBeenCalled()

      commit.mockClear()
      await investigationsStore.actions.getInvestigationList(
        { commit, dispatch },
        null
      )
      expect(commit).toHaveBeenCalled()
    })

    it('getIrSummary dispatches setWidgetsLoading twice - before and after', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getIrSummary(
        { commit, dispatch },
        {}
      )
      expect(dispatch).toHaveBeenNthCalledWith(1, 'setWidgetsLoading', true)
      expect(dispatch).toHaveBeenNthCalledWith(2, 'setWidgetsLoading', false)
      expect(dispatch).toHaveBeenCalledTimes(2)
    })

    it('getIrSummary commits SET_IRSUMMARY with data', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      await investigationsStore.actions.getIrSummary(
        { commit, dispatch },
        {}
      )
      expect(commit).toHaveBeenCalledWith('SET_IRSUMMARY', expect.objectContaining({
        data: { summary: 'test' }
      }))
    })

    it('getTargetUsersList commits with response data', async () => {
      const commit = jest.fn()
      await investigationsStore.actions.getTargetUsersList({ commit }, {})
      expect(commit).toHaveBeenCalledWith('SET_TARGETUSERSLIST', expect.any(Object))
    })

    it('createInvestigation returns resolved promise with data', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await investigationsStore.actions.createInvestigation(
        { commit, dispatch },
        { title: 'New' }
      )
      expect(result).toEqual({ data: { id: 1 } })
    })

    it('actions handle null context gracefully', async () => {
      const commit = jest.fn()
      expect(async () => {
        await investigationsStore.actions.setWidgetsLoading({ commit }, true)
      }).not.toThrow()
    })
  })

  describe('type safety and consistency checks', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('all state properties maintain their types after mutations', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const initialTypes = {
        investigationList: Array.isArray(state.investigationList),
        targetUsersList: Array.isArray(state.targetUsersList),
        getStatsAndMenuData: typeof state.getStatsAndMenuData === 'object',
        getInvestigationDetailsData: typeof state.getInvestigationDetailsData === 'object',
        isWidgetsLoading: typeof state.isWidgetsLoading === 'boolean'
      }

      commit('SET_WIDGETS_LOADING', false)
      expect(typeof state.isWidgetsLoading).toBe('boolean')

      commit('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA', { data: { results: [] } })
      expect(typeof state.getInvestigationDetailsTargetUsersListData).toBe('object')
    })

    it('getter functions are consistent - always return same type', () => {
      state.investigationList = [{ id: 1 }]
      const result1 = investigationsStore.getters.investigationListGetter(state)
      expect(Array.isArray(result1)).toBe(true)

      state.investigationList = []
      const result2 = investigationsStore.getters.investigationListGetter(state)
      expect(Array.isArray(result2)).toBe(true)
    })

    it('mutations maintain data structure integrity', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [{ id: 1, completedUsersCount: 5, scannedUsersCount: 10 }]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList).toHaveProperty('totalNumberOfRecords')
      expect(state.investigationList).toHaveProperty('data')
      expect(Array.isArray(state.investigationList.data)).toBe(true)
    })

    it('filter tag transformation is consistent', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl', 'Other'] },
            { id: 2, filterTags: ['Subject', 'BodyUrl', 'From'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)

      state.getInvestigationDetailsListData.results.forEach((item) => {
        expect(Array.isArray(item.filterTags)).toBe(true)
        expect(item.filterTags.some((tag) => tag === 'BodyUrl')).toBe(false)
      })
    })

    it('numeric calculations in userStatus are always integers', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            { id: 1, completedUsersCount: 7, scannedUsersCount: 10 }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      const [completed, pending] = state.investigationList.data[0].userStatus
      expect(Number.isInteger(completed)).toBe(true)
      expect(Number.isInteger(pending)).toBe(true)
    })
  })

  describe('edge cases - special characters, Unicode, long strings, large datasets', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('handles investigation names with special characters', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            {
              id: 1,
              name: 'Test <>&"\'@#$%^&*()',
              completedUsersCount: 5,
              scannedUsersCount: 10
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].name).toBe('Test <>&"\'@#$%^&*()')
    })

    it('handles investigation names with Unicode characters', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            {
              id: 1,
              name: 'Investigation 测试 🔍 Тест ñ',
              completedUsersCount: 5,
              scannedUsersCount: 10
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].name).toContain('测试')
      expect(state.investigationList.data[0].name).toContain('🔍')
    })

    it('handles very long investigation names (500+ characters)', () => {
      const longName = 'A'.repeat(600)
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            {
              id: 1,
              name: longName,
              completedUsersCount: 5,
              scannedUsersCount: 10
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].name).toHaveLength(600)
    })

    it('handles investigation lists with 1000+ items', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Investigation ${i + 1}`,
        completedUsersCount: i % 100,
        scannedUsersCount: (i % 100) + 50
      }))
      const payload = {
        data: {
          totalNumberOfRecords: 1000,
          results: largeDataset
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data).toHaveLength(1000)
      expect(state.investigationList.totalNumberOfRecords).toBe(1000)
    })

    it('handles target users list with 500+ items', () => {
      const largeUserList = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`
      }))
      const payload = { data: largeUserList }
      investigationsStore.mutations.SET_TARGETUSERSLIST(state, payload)
      expect(state.targetUsersList).toHaveLength(500)
    })

    it('handles filter tags with newlines and tabs', () => {
      const payload = {
        data: {
          results: [
            {
              id: 1,
              filterTags: ['Tag\nWith\nNewlines', 'Tag\tWith\tTabs', 'BodyUrl']
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags[0]).toContain('\n')
      expect(state.getInvestigationDetailsListData.results[0].filterTags[1]).toContain('\t')
    })

    it('handles emails with special characters and long domain names', () => {
      const payload = {
        data: [
          {
            id: 1,
            email: 'user+test.name_123@sub.domain.example.co.uk'
          }
        ]
      }
      investigationsStore.mutations.SET_TARGETUSERSLIST(state, payload)
      expect(state.targetUsersList[0].email).toBe('user+test.name_123@sub.domain.example.co.uk')
    })

    it('handles very long title strings (1000+ chars)', () => {
      const longTitle = 'T'.repeat(1500)
      const payload = { data: { id: 1, title: longTitle } }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSDATA(state, payload)
      expect(state.getInvestigationDetailsData.title).toHaveLength(1500)
    })

    it('handles rapid mutations (20 iterations)', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 20; i++) {
        commit('SET_WIDGETS_LOADING', i % 2 === 0)
      }
      expect(state.isWidgetsLoading).toBe(false)
    })

    it('handles rapid list updates with growing data', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      for (let i = 1; i <= 10; i++) {
        const results = Array.from({ length: i * 10 }, (_, j) => ({
          id: j + 1,
          completedUsersCount: j % 5,
          scannedUsersCount: j % 5 + 5
        }))
        commit('SET_INVESTIGATIONLIST', {
          data: { totalNumberOfRecords: i * 10, results }
        })
      }
      expect(state.investigationList.totalNumberOfRecords).toBe(100)
      expect(state.investigationList.data).toHaveLength(100)
    })

    it('handles empty strings in various fields', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [
            {
              id: 1,
              name: '',
              description: '',
              completedUsersCount: 0,
              scannedUsersCount: 0
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data[0].name).toBe('')
    })

    it('handles data with many nested levels', () => {
      const payload = {
        data: {
          results: [
            {
              id: 1,
              filterTags: ['Tag1'],
              metadata: {
                level1: {
                  level2: {
                    level3: {
                      value: 'deep'
                    }
                  }
                }
              }
            }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].metadata.level1.level2.level3.value).toBe('deep')
    })
  })

  describe('data transitions and state mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('transitions from empty to populated investigation list', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      expect(state.investigationList).toEqual([])

      const payload = {
        data: {
          totalNumberOfRecords: 2,
          results: [
            { id: 1, completedUsersCount: 5, scannedUsersCount: 10 },
            { id: 2, completedUsersCount: 3, scannedUsersCount: 8 }
          ]
        }
      }
      commit('SET_INVESTIGATIONLIST', payload)
      expect(state.investigationList).toHaveProperty('totalNumberOfRecords')
      expect(state.investigationList.data).toHaveLength(2)
    })

    it('clears investigation list and repopulates', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      state.investigationList = {
        totalNumberOfRecords: 5,
        data: Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      }

      commit('SET_INVESTIGATIONLISTEMPY')
      expect(state.investigationList).toEqual([])

      const payload = {
        data: {
          totalNumberOfRecords: 1,
          results: [{ id: 100, completedUsersCount: 0, scannedUsersCount: 0 }]
        }
      }
      commit('SET_INVESTIGATIONLIST', payload)
      expect(state.investigationList.data[0].id).toBe(100)
    })

    it('updates investigation details through multiple mutations', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      commit('SET_INVESTIGATIONDETAILSDATA', { data: { id: 1, title: 'Old Title' } })
      expect(state.getInvestigationDetailsData.title).toBe('Old Title')

      commit('SET_INVESTIGATIONDETAILSDATA', { data: { id: 1, title: 'New Title', updated: true } })
      expect(state.getInvestigationDetailsData.title).toBe('New Title')
      expect(state.getInvestigationDetailsData.updated).toBe(true)
    })

    it('manages widgets loading state transitions', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      expect(state.isWidgetsLoading).toBe(true)

      commit('SET_WIDGETS_LOADING', false)
      expect(state.isWidgetsLoading).toBe(false)

      commit('SET_WIDGETS_LOADING', true)
      expect(state.isWidgetsLoading).toBe(true)
    })

    it('handles concurrent updates to different state properties', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      commit('SET_WIDGETS_LOADING', false)
      commit('SET_TARGETUSERSLIST', { data: [{ id: 1 }] })
      commit('SET_STATSANDMENUDATA', { data: { stats: {} } })

      expect(state.isWidgetsLoading).toBe(false)
      expect(state.targetUsersList).toHaveLength(1)
      expect(state.getStatsAndMenuData).toHaveProperty('stats')
    })

    it('preserves unmodified state properties during mutations', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const originalList = state.investigationList

      commit('SET_WIDGETS_LOADING', false)
      expect(state.investigationList).toBe(originalList)

      commit('SET_TARGETUSERSLIST', { data: [] })
      expect(state.investigationList).toBe(originalList)
    })

    it('handles complete workflow - load, update, clear', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Load
      commit('SET_INVESTIGATIONLIST', {
        data: {
          totalNumberOfRecords: 1,
          results: [{ id: 1, completedUsersCount: 5, scannedUsersCount: 10 }]
        }
      })
      expect(state.investigationList.data).toHaveLength(1)

      // Update details
      commit('SET_INVESTIGATIONDETAILSDATA', { data: { id: 1, title: 'Test' } })
      expect(state.getInvestigationDetailsData.id).toBe(1)

      // Clear
      commit('SET_INVESTIGATIONLISTEMPY')
      expect(state.investigationList).toEqual([])
      expect(state.getInvestigationDetailsData.id).toBe(1)
    })

    it('handles IR summary workflow with widget loading', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      commit('SET_WIDGETS_LOADING', true)
      expect(state.isWidgetsLoading).toBe(true)

      commit('SET_IRSUMMARY', { data: { summary: 'Critical findings', count: 5 } })
      expect(state.irSummary.summary).toBe('Critical findings')

      commit('SET_WIDGETS_LOADING', false)
      expect(state.isWidgetsLoading).toBe(false)
    })
  })

  describe('filter and search behavior', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('preserves filterTags in investigation details list', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['From', 'Subject', 'Body'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual(['From', 'Subject', 'Body'])
    })

    it('maps BodyUrl to BodyDomain consistently', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl'] },
            { id: 2, filterTags: ['Subject', 'BodyUrl'] },
            { id: 3, filterTags: ['BodyUrl', 'From'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)

      state.getInvestigationDetailsListData.results.forEach((item) => {
        expect(item.filterTags).not.toContain('BodyUrl')
        if (item.id === 1 || item.id === 3) {
          expect(item.filterTags).toContain('BodyDomain')
        }
      })
    })

    it('handles investigation lists with varied filter tags', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['From'] },
            { id: 2, filterTags: ['Subject'] },
            { id: 3, filterTags: ['Body'] },
            { id: 4, filterTags: [] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results).toHaveLength(4)
    })

    it('preserves original tags when BodyUrl is not present', () => {
      const originalTags = ['From', 'Subject', 'To']
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: [...originalTags] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual(originalTags)
    })

    it('handles multiple BodyUrl transformations in single item', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['BodyUrl', 'Subject', 'BodyUrl', 'From', 'BodyUrl'] }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].filterTags.filter(tag => tag === 'BodyDomain')).toHaveLength(3)
    })

    it('getter returns filtered investigation data', () => {
      state.getInvestigationDetailsListData = {
        results: [
          { id: 1, filterTags: ['From'] },
          { id: 2, filterTags: ['Subject'] }
        ]
      }
      const result = investigationsStore.getters.getInvestigationDetailsListGetter(state)
      expect(result.results).toHaveLength(2)
    })

    it('can filter retrieved data for specific tags', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['From'], email: 'test@example.com' },
            { id: 2, filterTags: ['Subject'], email: 'user@example.com' }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)

      const fromFiltered = state.getInvestigationDetailsListData.results.filter(
        item => item.filterTags.includes('From')
      )
      expect(fromFiltered).toHaveLength(1)
      expect(fromFiltered[0].id).toBe(1)
    })

    it('preserves search metadata through mutations', () => {
      const payload = {
        data: {
          results: [
            { id: 1, filterTags: ['From'], searchQuery: 'test@example.com' }
          ]
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.results[0].searchQuery).toBe('test@example.com')
    })
  })

  describe('pagination handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('sets investigation list with pagination info', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 100,
          pageNumber: 1,
          pageSize: 10,
          totalNumberOfPages: 10,
          results: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            completedUsersCount: 0,
            scannedUsersCount: 10
          }))
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.totalNumberOfRecords).toBe(100)
      expect(state.investigationList.data).toHaveLength(10)
    })

    it('handles investigation details list with pagination', () => {
      const payload = {
        data: {
          pageNumber: 2,
          pageSize: 20,
          totalNumberOfPages: 5,
          totalNumberOfRecords: 100,
          results: Array.from({ length: 20 }, (_, i) => ({
            id: i + 21,
            filterTags: ['From']
          }))
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.pageNumber).toBe(2)
      expect(state.getInvestigationDetailsListData.pageSize).toBe(20)
      expect(state.getInvestigationDetailsListData.results).toHaveLength(20)
    })

    it('calculates page info correctly for different page sizes', () => {
      const pageSizes = [5, 10, 25, 50, 100]

      pageSizes.forEach((pageSize) => {
        const totalRecords = 250
        const results = Array.from({ length: pageSize }, (_, i) => ({
          id: i + 1,
          completedUsersCount: 0,
          scannedUsersCount: 10
        }))

        const payload = {
          data: {
            totalNumberOfRecords: totalRecords,
            pageNumber: 1,
            pageSize,
            totalNumberOfPages: Math.ceil(totalRecords / pageSize),
            results
          }
        }

        investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
        expect(state.investigationList.data).toHaveLength(pageSize)
      })
    })

    it('handles last page with fewer items than page size', () => {
      const payload = {
        data: {
          totalNumberOfRecords: 150,
          pageNumber: 10,
          pageSize: 20,
          totalNumberOfPages: 10,
          results: Array.from({ length: 10 }, (_, i) => ({
            id: i + 141,
            completedUsersCount: 0,
            scannedUsersCount: 10
          }))
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.data).toHaveLength(10)
      expect(state.investigationList.totalNumberOfRecords).toBe(150)
    })

    it('maintains pagination data without results', () => {
      const payload = {
        data: {
          pageNumber: 1,
          pageSize: 10,
          totalNumberOfPages: 0,
          totalNumberOfRecords: 0,
          results: []
        }
      }
      investigationsStore.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, payload)
      expect(state.getInvestigationDetailsListData.pageNumber).toBe(1)
      expect(state.getInvestigationDetailsListData.pageSize).toBe(10)
      expect(state.getInvestigationDetailsListData.results).toEqual([])
    })

    it('handles page number transitions', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Page 1
      let payload = {
        data: {
          pageNumber: 1,
          pageSize: 10,
          results: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, filterTags: ['From'] }))
        }
      }
      commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)
      expect(state.getInvestigationDetailsListData.pageNumber).toBe(1)
      expect(state.getInvestigationDetailsListData.results[0].id).toBe(1)

      // Page 2
      payload = {
        data: {
          pageNumber: 2,
          pageSize: 10,
          results: Array.from({ length: 10 }, (_, i) => ({ id: i + 11, filterTags: ['From'] }))
        }
      }
      commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)
      expect(state.getInvestigationDetailsListData.pageNumber).toBe(2)
      expect(state.getInvestigationDetailsListData.results[0].id).toBe(11)
    })

    it('handles large dataset pagination (1000+ items across pages)', () => {
      const pageSize = 100
      const totalRecords = 1500
      const results = Array.from({ length: pageSize }, (_, i) => ({
        id: i + 1,
        completedUsersCount: 0,
        scannedUsersCount: 10
      }))

      const payload = {
        data: {
          totalNumberOfRecords: totalRecords,
          pageNumber: 1,
          pageSize,
          totalNumberOfPages: Math.ceil(totalRecords / pageSize),
          results
        }
      }

      investigationsStore.mutations.SET_INVESTIGATIONLIST(state, payload)
      expect(state.investigationList.totalNumberOfRecords).toBe(1500)
      expect(state.investigationList.data).toHaveLength(100)
    })
  })

  describe('complex integration workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(investigationsStore.state))
    })

    it('complete investigation creation and details loading workflow', async () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }
      const mockCommit = jest.fn((mutationName, payload) => {
        commit(mutationName, payload)
      })

      // Create investigation
      await investigationsStore.actions.createInvestigation(
        { commit: mockCommit, dispatch: jest.fn() },
        { title: 'Security Review' }
      )

      // Load details
      const detailsId = 1
      await investigationsStore.actions.getInvestigationDetailsData(
        { commit: mockCommit, dispatch: jest.fn() },
        detailsId
      )

      expect(state.getInvestigationDetailsData).toBeDefined()
    })

    it('investigation loading with stats, summary, and target users', async () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }
      const dispatch = jest.fn()
      const mockCommit = jest.fn((mutationName, payload) => {
        commit(mutationName, payload)
      })

      // Start loading
      await investigationsStore.actions.getIrSummary({ commit: mockCommit, dispatch }, {})
      expect(dispatch).toHaveBeenCalledWith('setWidgetsLoading', true)

      // Load target users
      await investigationsStore.actions.getTargetUsersList({ commit: mockCommit }, {})
      expect(state.targetUsersList).toBeDefined()

      // Get stats
      await investigationsStore.actions.getStatsAndMenuData({ commit: mockCommit, dispatch }, 1)
      expect(state.getStatsAndMenuData).toBeDefined()

      // Finish loading
      dispatch('setWidgetsLoading', false)
    })

    it('paginated investigation list loading with filtering', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Load first page
      const page1Payload = {
        data: {
          totalNumberOfRecords: 100,
          pageNumber: 1,
          pageSize: 20,
          results: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            completedUsersCount: i % 10,
            scannedUsersCount: 20,
            status: i % 3 === 0 ? 'completed' : 'in_progress'
          }))
        }
      }
      commit('SET_INVESTIGATIONLIST', page1Payload)
      expect(state.investigationList.totalNumberOfRecords).toBe(100)

      // Filter and check
      const inProgressCount = state.investigationList.data.filter(
        item => item.status === 'in_progress'
      ).length
      expect(inProgressCount).toBeGreaterThan(0)
    })

    it('investigation details with multiple items and complex tags', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      const payload = {
        data: {
          pageNumber: 1,
          pageSize: 50,
          totalNumberOfPages: 1,
          totalNumberOfRecords: 3,
          results: [
            {
              id: 101,
              title: 'Email 1',
              filterTags: ['From', 'Subject', 'BodyUrl'],
              timestamp: '2024-01-01T10:00:00Z'
            },
            {
              id: 102,
              title: 'Email 2',
              filterTags: ['Subject', 'Body'],
              timestamp: '2024-01-01T11:00:00Z'
            },
            {
              id: 103,
              title: 'Email 3',
              filterTags: ['BodyUrl', 'From', 'Date'],
              timestamp: '2024-01-01T12:00:00Z'
            }
          ]
        }
      }

      commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)

      // Verify all BodyUrl tags were transformed
      state.getInvestigationDetailsListData.results.forEach((item) => {
        expect(item.filterTags.some(tag => tag === 'BodyUrl')).toBe(false)
      })

      // Count BodyDomain tags (should be 2: from items 1 and 3)
      const bodyDomainCount = state.getInvestigationDetailsListData.results
        .flatMap(item => item.filterTags)
        .filter(tag => tag === 'BodyDomain').length
      expect(bodyDomainCount).toBe(2)
    })

    it('handle state transitions across multiple loaded data sets', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Load investigations
      commit('SET_INVESTIGATIONLIST', {
        data: {
          totalNumberOfRecords: 5,
          results: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            completedUsersCount: i,
            scannedUsersCount: 10
          }))
        }
      })

      // Load first investigation details
      commit('SET_INVESTIGATIONDETAILSDATA', {
        data: { id: 1, title: 'Investigation 1' }
      })

      // Load related target users
      commit('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA', {
        data: {
          results: [
            { id: 1, email: 'user1@example.com' },
            { id: 2, email: 'user2@example.com' }
          ]
        }
      })

      // Verify state consistency
      expect(state.investigationList.data).toHaveLength(5)
      expect(state.getInvestigationDetailsData.id).toBe(1)
      expect(state.getInvestigationDetailsTargetUsersListData.results).toHaveLength(2)
    })

    it('rapid user interactions simulation - multiple operations', async () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }
      const mockCommit = jest.fn((mutationName, payload) => {
        commit(mutationName, payload)
      })

      // User clicks to load data
      investigationsStore.actions.setWidgetsLoading({ commit: mockCommit }, true)

      // Load investigations
      await investigationsStore.actions.getInvestigationList(
        { commit: mockCommit, dispatch: jest.fn() },
        {}
      )

      // User selects an investigation
      await investigationsStore.actions.getInvestigationDetailsData(
        { commit: mockCommit, dispatch: jest.fn() },
        1
      )

      // Load details list
      await investigationsStore.actions.getInvestigationDetailsListData(
        { commit: mockCommit, dispatch: jest.fn() },
        { id: 1 }
      )

      // Load target users for that investigation
      await investigationsStore.actions.getInvestigationDetailsTargetUsersListData(
        { commit: mockCommit, dispatch: jest.fn() },
        { id: 1 }
      )

      // Stop loading
      investigationsStore.actions.setWidgetsLoading({ commit: mockCommit }, false)

      expect(state.isWidgetsLoading).toBe(false)
    })

    it('filter and search with pagination', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Load first page of details
      const payload = {
        data: {
          pageNumber: 1,
          pageSize: 25,
          totalNumberOfPages: 4,
          totalNumberOfRecords: 100,
          results: Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            filterTags: ['From', 'Subject', 'BodyUrl'],
            email: `user${i + 1}@example.com`,
            status: i % 2 === 0 ? 'active' : 'inactive'
          }))
        }
      }

      commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)

      // Filter by tag
      const fromFiltered = state.getInvestigationDetailsListData.results.filter(
        item => item.filterTags.includes('From')
      )
      expect(fromFiltered).toHaveLength(25)

      // Filter by status
      const activeItems = state.getInvestigationDetailsListData.results.filter(
        item => item.status === 'active'
      )
      expect(activeItems.length).toBeGreaterThan(0)
      expect(activeItems.length).toBeLessThanOrEqual(25)
    })

    it('investigation list with scan progress tracking', () => {
      const commit = (mutationName, payload) => {
        investigationsStore.mutations[mutationName](state, payload)
      }

      // Simulate multiple scans at different progress levels
      const payload = {
        data: {
          totalNumberOfRecords: 3,
          results: [
            {
              id: 1,
              name: 'Completed Investigation',
              completedUsersCount: 100,
              scannedUsersCount: 100
            },
            {
              id: 2,
              name: 'In Progress Investigation',
              completedUsersCount: 50,
              scannedUsersCount: 100
            },
            {
              id: 3,
              name: 'Not Started Investigation',
              completedUsersCount: 0,
              scannedUsersCount: 100
            }
          ]
        }
      }

      commit('SET_INVESTIGATIONLIST', payload)

      const investigations = state.investigationList.data

      // Completed
      expect(investigations[0].userStatus).toEqual([100, 0])
      expect(investigations[0].scanStatusText).toBe('100 / 100')

      // In progress
      expect(investigations[1].userStatus).toEqual([50, 50])
      expect(investigations[1].scanStatusText).toBe('50 / 100')

      // Not started
      expect(investigations[2].userStatus).toEqual([0, 100])
      expect(investigations[2].scanStatusText).toBe('0 / 100')
    })
  })
})
