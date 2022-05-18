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
    selectedCompanyId: ''
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
        state.selectedCompanyId = data.userCompany.id
        state.selectedCompanyName =
          localStorage.getItem('selectedCompanyName') ||
          localStorage.getItem('companyName') ||
          data.userCompany.name
        state.userRoleName = data.role.name
        state.logoUrl = data.userCompany.logoPath
        state.firstName = data.firstName
        state.permissions = payload.permissions
      } else {
        state.user = payload.currentUserData
        state.companyName = payload.currentUserData.userCompany.name
        state.userRoleName = payload.currentUserData.role.name
        state.selectedCompanyName = payload.currentUserData.userCompany.name
        state.logoUrl = payload.currentUserData.userCompany.logoPath
        state.firstName = payload.currentUserData.firstName
        state.permissions = payload.permissions
      }
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
        if (
          payload.currentUserData &&
          payload.currentUserData.role &&
          payload.currentUserData.role.name !== 'CompanyAdmin'
        ) {
          dispatch('dashboard/selectCompany', payload.currentUserData, { root: true })
        }
      } else {
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

        commit('SET_CURRENTUSER', {
          currentUserData: currentUserData,
          isSelectCompany: false,
          permissions: tokenData.Permission
        })
      }
    }
  }
}

export default auth
