import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '@/utils/functions'
import CookieKeys from '@/model/constants/cookieKeys'

const auth = {
  namespaced: true,
  state: {
    permissions: [],
    user: {},
    companyName: '',
    userRoleName: '',
    logoUrl: '',
    selectedCompanyName: '',
    selectedCompanyId: '',
    dateFormat: null,
    timeFormat: null,
    companyUpdateRequired: false
  },
  getters: {
    getUserRole: (state) => state.userRoleName,
    userGetter: (state) => state.user,
    getTimezoneFormat: (state) => {
      return {
        timeFormat: state.timeFormat,
        dateFormat: state.dateFormat
      }
    },
    companyUpdateRequired: (state) => state.companyUpdateRequired
  },
  mutations: {
    SET_CURRENTUSER(state, payload) {
      if (payload.isSelectCompany) {
        let data = payload.currentUserData
        if (!data) return
        state.user = data
        state.companyName = data.userCompany.name
        state.selectedCompanyId = data.userCompany.id
        state.selectedCompanyName =
          localStorage.getItem('selectedCompanyName') ||
          localStorage.getItem('companyName') ||
          data.userCompany.name
        state.userRoleName = data?.role?.name || ''
        state.logoUrl = data.userCompany.logoPath
        state.firstName = data.firstName
        state.permissions = payload.permissions
      } else {
        state.user = payload.currentUserData
        state.companyName = payload.currentUserData.userCompany.name
        state.userRoleName = payload?.currentUserData?.role?.name || ''
        state.selectedCompanyName = payload.currentUserData.userCompany.name
        state.logoUrl = payload.currentUserData.userCompany.logoPath
        state.firstName = payload.currentUserData.firstName
        state.permissions = payload.permissions
      }
    },
    SET_FORMATS(state, payload) {
      if (payload.dateFormat) {
        state.dateFormat = payload.dateFormat
      }

      if (payload.timeFormat) {
        state.timeFormat = payload.timeFormat
      }
    },
    SET_COMPANY_NAME(state, payload) {
      state.selectedCompanyName = payload
      state.companyName = payload
      localStorage.setItem('selectedCompanyName', payload)
      localStorage.setItem('companyName', payload)
    },
    SET_COMPANY_UPDATE_REQUIRED(state, payload) {
      state.companyUpdateRequired = payload
    }
  },
  actions: {
    getCurrentUser({ commit, dispatch }) {
      let token = JSON.parse(localStorage.getItem(CookieKeys.AUTH_KEY)).token
      let tokenData = jwt_decode(token)
      if (localStorage.getItem('isSelectCompany')) {
        let payload = {
          currentUserData: JSON.parse(localStorage.getItem('userData')),
          isSelectCompany: true,
          permissions: tokenData.Permission
        }
        commit('SET_CURRENTUSER', payload)
        if (payload.currentUserData?.role?.name !== 'CompanyAdmin') {
          dispatch('dashboard/selectCompany', payload.currentUserData, {
            root: true
          })
        }
      } else {
        let currentUserData = setGlobalUserData(tokenData)
        localStorage.setItem('userData', JSON.stringify(currentUserData))
        localStorage.setItem('selectedCompanyName', currentUserData.name)
        localStorage.setItem('selectedCompanyRequestId', currentUserData.id)
        if (currentUserData?.role?.name !== 'CompanyAdmin') {
          dispatch('dashboard/selectCompany', currentUserData, { root: true })
        }

        commit('SET_CURRENTUSER', {
          currentUserData: currentUserData,
          isSelectCompany: false,
          permissions: tokenData.Permission
        })
      }
    },
    setCompanyName({ commit }, payload) {
      commit('SET_COMPANY_NAME', payload)
    },
    setCompanyUpdateRequired({ commit }, payload) {
      commit('SET_COMPANY_UPDATE_REQUIRED', payload)
    }
  }
}

export default auth
