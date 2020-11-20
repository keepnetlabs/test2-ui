import { profile, getCurrentUser } from '../../api/auth'
import { systemUser } from '../../api/threadSharing'
import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '../../utils/functions'

const auth = {
  namespaced: true,
  state: {
    permissions: [],
    user: {},
    companyName: '',
    userRoleName: '',
    logoUrl: ''
  },
  getters: {
    userGetter: (state) => state.user
  },
  mutations: {
    SET_CURRENTUSER(state, payload) {
      if (payload.isSelectCompany) {
        let data = payload.currentUserData
        state.user = data
        state.companyName = data.userCompany.name
        state.selectedCompanyName =
          localStorage.getItem('selectedCompanyName') ||
          localStorage.getItem('companyName') ||
          data.userCompany.name
        state.userRoleName = data.role.name
        state.logoUrl = data.userCompany.logoPath
        state.firstName = data.firstName
      } else {
        state.user = payload.currentUserData
        state.companyName = payload.currentUserData.userCompany.name
        state.userRoleName = payload.currentUserData.role.name
        state.selectedCompanyName = payload.currentUserData.userCompany.name
        state.logoUrl = payload.currentUserData.userCompany.logoPath
        state.firstName = payload.currentUserData.firstName
      }
    }
  },
  methods: {
    setCurrentUserOnCompanySelect() {}
  },
  actions: {
    getCurrentUser({ commit, dispatch }) {
      if (localStorage.getItem('isSelectCompany')) {
        let payload = {
          currentUserData: JSON.parse(localStorage.getItem('userData')),
          isSelectCompany: true
        }
        //commit('SET_SELECTED_COMPANY', payload.currentUserData)
        commit('SET_CURRENTUSER', payload)
        if (
          payload.currentUserData &&
          payload.currentUserData.role &&
          payload.currentUserData.role.name !== 'CompanyAdmin'
        ) {
          dispatch('dashboard/selectCompany', payload.currentUserData, { root: true })
        }
      } else {
        let token = JSON.parse(localStorage.getItem('auth-token')).token
        let tokenData = jwt_decode(token)
        let currentUserData = setGlobalUserData(tokenData)
        localStorage.setItem('userData', JSON.stringify(currentUserData))
        localStorage.setItem('selectedCompanyName', currentUserData.name)
        localStorage.setItem('selectedCompanyRequestId', currentUserData.id)
        if (
          currentUserData &&
          currentUserData.role &&
          currentUserData.role.name !== 'CompanyAdmin'
        ) {
          dispatch('dashboard/selectCompany', currentUserData, { root: true })
        }
        let payload = {
          currentUserData: currentUserData,
          isSelectCompany: false
        }
        commit('SET_CURRENTUSER', payload)
      }
    },
    getUserProfile({ commit }, payload) { // eslint-disable-line
      profile(payload).then(() => {})
    }
  }
}

export default auth
