import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import router from '../../router/index'
import { searchPlaybook } from '../../api/playbook'

const playbook = {
  namespaced: true,
  state: {
    playbookList: []
  },
  getters: {
    playbookListGetter: (state) => state.playbookList
  },
  mutations: {
    SET_PLAYBOOK_LIST(state, payload) {
      state.playbookList = payload.data
    }
  },
  actions: {
    async getPlaybookList({ commit }, obj) {
      await searchPlaybook(obj)
        .then((response) => {
          const result = response.data
          commit('SET_PLAYBOOK_LIST', result)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting playbook list', { root: true })
        })
    }
  }
}

export default playbook
