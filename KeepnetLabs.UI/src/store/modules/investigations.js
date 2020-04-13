import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import router from '../../router/index'
import {
  investigationList,
  cancelInvestigation,
  investigationDetails,
  createInvestigation,
  InvestigationGroups
} from '../../api/investigations'

const investigations = {
  namespaced: true,
  state: {
    investigationList: []
  },
  getters: {
    investigationListGetter: state => state.investigationList
  },
  mutations: {
    SET_INVESTIGATIONLIST(state, payload) {
      state.investigationList = payload.data.results
    }
  },
  actions: {
    async getInvestigationList({ commit }, obj) {
      commit('common/SET_IS_LOADING', true, { root: true })
      await investigationList(obj)
        .then(response => {
          const result = response.data
          commit('SET_INVESTIGATIONLIST', result)
          commit('common/SET_IS_LOADING', false, { root: true })
        })
        .catch(() => {
          commit('common/SET_IS_LOADING', false, { root: true })
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
        })
    },
    async getNotifications({ commit }, id) {
      await listNotifications(id, localStorage.getItem('companyId'))
        .then(response => {
          const res = response.data
          commit('SET_NOTIFICATIONS', res)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Notifications could not fetch', { root: true })
        })
    },
    async saveNotifications({ commit, dispatch }, obj) {
      await saveNotifications(obj)
        .then(() => {
          commit('SET_NOTIFICATIONS', obj)
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Saved Succesfully', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when saving the notifications, try again.', {
            root: true
          })
        })
    }
  }
}

export default investigations
