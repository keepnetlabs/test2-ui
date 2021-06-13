import Vuex from 'vuex'

export function getDefaultPropsData(propsData = {}) {
  return {
    propsData: {
      options: true,
      empty: {
        message: ''
      },
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'text',
          width: 150
        },
        {
          property: 'surname',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: false,
          type: 'text',
          width: 150
        }
      ],
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ],
      refName: 'table-refresh-button-case'
    },
    ...propsData
  }
}

export function getDefaultVuex(store) {
  const getters = {
    getDownloadModalStatus: (state) => state.downloadModalStatus
  }

  const mutations = {
    SET_DOWNLOAD_MODAL_STATUS: (state, status) => {
      state.downloadModalStatus = status
    }
  }
  const actions = {
    changeDownloadModalStatus({ commit }, payload) {
      commit('SET_DOWNLOAD_MODAL_STATUS', payload)
    }
  }

  return new Vuex.Store({
    modules: {
      common: {
        namespaced: true,
        state: {
          downloadModalStatus: false
        },
        getters,
        actions,
        mutations
      }
    }
  })
}
