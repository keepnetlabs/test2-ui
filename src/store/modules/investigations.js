import {
  cancelInvestigation,
  deleteInvestigationDetailsItem,
  getInvestigationDetailsDataFunction,
  getStatsAndMenuDataFunction,
  getTargetUsers,
  investigationDetailsListFunction,
  investigationDetailsTargetUsersListFunction,
  investigationList,
  irSummary,
  saveNewInvestigation,
  sendInvestigationWarningMessage
} from '@/api/investigations'

const investigations = {
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
    // create global getters for the target users list and investigaiton list
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
      console.log('SET_INVESTIGATIONDETAILSLISTDATA', payload)
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
    async deleteInvestigationDetailsItem({ commit, dispatch }, obj) {
      await deleteInvestigationDetailsItem(obj.data, obj.id)
    },
    async sendInvestigationWarningMessage({ commit, dispatch }, obj) {
      await sendInvestigationWarningMessage(obj.data, obj.id)
    },
    async cancelInvestigation({ commit, dispatch }, id) {
      await cancelInvestigation(id)
    },
    async getInvestigationDetailsTargetUsersListData({ commit, dispatch }, obj) {
      return await investigationDetailsTargetUsersListFunction(obj.data, obj.id).then(
        (response) => {
          commit('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA', response.data)
          return response
        }
      )
    },
    async getInvestigationDetailsListData({ commit, dispatch }, obj) {
      if (obj.id) {
        return await investigationDetailsListFunction(obj.data, obj.id)
          .then((response) => {
            commit('SET_INVESTIGATIONDETAILSLISTDATA', response.data)
            return response
          })
          .catch(() => {
            const payload = {
              data: {
                pageNumber: 1,
                pageSize: 1,
                results: [],
                totalNumberOfPages: 1,
                totalNumberOfRecords: 1
              }
            }
            commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)
          })
      }
    },
    async getInvestigationDetailsData({ commit, dispatch }, id) {
      if (id) {
        await getInvestigationDetailsDataFunction(id).then((response) => {
          commit('SET_INVESTIGATIONDETAILSDATA', response?.data)
        })
      }
    },
    async getStatsAndMenuData({ commit, dispatch }, id) {
      await getStatsAndMenuDataFunction(id).then((response) => {
        commit('SET_STATSANDMENUDATA', response?.data)
      })
    },
    async getInvestigationList({ commit, dispatch }, obj) {
      return await investigationList(obj).then((response) => {
        const result = response.data
        commit('SET_INVESTIGATIONLIST', result)
        return response
      })
    },
    async getIrSummary({ commit, dispatch }, obj) {
      dispatch('setWidgetsLoading', true)
      return await irSummary(obj).then((response) => {
        commit('SET_IRSUMMARY', response?.data || {})
        dispatch('setWidgetsLoading', false)
      })
    },

    async getTargetUsersList({ commit }) {
      await getTargetUsers().then((response) => {
        const result = response.data
        commit('SET_TARGETUSERSLIST', result)
      })
    },
    async createInvestigation({ commit, dispatch }, obj) {
      return await saveNewInvestigation(obj).then((resp) => {
        return Promise.resolve(resp)
      })
    }
  }
}

export default investigations
