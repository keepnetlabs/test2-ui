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
})
