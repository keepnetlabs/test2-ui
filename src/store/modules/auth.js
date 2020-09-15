import { profile, getCurrentUser } from '../../api/auth'
import { systemUser } from '../../api/threadSharing'
import jwt_decode from 'jwt-decode'

const auth = {
  namespaced: true,
  state: {
    permissions: [],
    user: {},
    companyName: '',
    userRoleName: ''
  },
  getters: {
    userGetter: (state) => state.user
  },
  mutations: {
    SET_CURRENTUSER(state, payload) {
      state.user = payload
      state.companyName = payload.userCompany.name
      state.userRoleName = payload.role.name
    }
  },
  actions: {
    getCurrentUser({ commit, dispatch }) {
      if (localStorage.getItem('isSelectCompany')) {
        let token = JSON.parse(localStorage.getItem('auth-token')).token
        let tokenData = jwt_decode(token)
        let currentUserData = {
          id: tokenData.user_company_resourceid,
          name: tokenData.user_company_name,
          surname: tokenData.family_name,
          email: tokenData.email,
          fullName: tokenData.given_name,
          countryCode: null,
          phone: tokenData.phone_number,
          status: null,
          currentCompany: {
            id: tokenData.user_company_resourceid,
            name: tokenData.user_company_name,
            logoPath: tokenData.user_company_logopath,
            businessCategoryId: tokenData.user_company_industry_resourceid,
            resellerId: tokenData.user_company_parentcompany_resourceid,
            timeZone: null,
            isDemo: false
          },
          userCompany: {
            id: tokenData.user_company_resourceid,
            name: tokenData.user_company_name,
            logoPath: tokenData.user_company_logopath,
            businessCategoryId: tokenData.user_company_industry_resourceid,
            resellerId: tokenData.user_company_parentcompany_resourceid,
            timeZone: null,
            isDemo: false
          },
          role: {
            name: tokenData.role.toString()
          }
        }
        localStorage.setItem('companyId', currentUserData.currentCompany.id)
        localStorage.setItem('companyResourceId', currentUserData.currentCompany.id)
        localStorage.setItem('companyName', currentUserData.currentCompany.name)
        localStorage.setItem('userId', currentUserData.id)
        localStorage.setItem('businessCatId', currentUserData.userCompany.businessCategoryId)
        localStorage.setItem('userName', currentUserData.fullName)
        dispatch('dashboard/selectCompany', currentUserData, { root: true })
        commit('SET_CURRENTUSER', currentUserData)
        let systemUserData = {
          UserId: currentUserData.id,
          FirstName: currentUserData.name,
          LastName: currentUserData.surname,
          Email: currentUserData.email,
          CompanyId: currentUserData.userCompany.id,
          CompanyName: currentUserData.userCompany.name
        }
        //systemUser(systemUserData).then()
        localStorage.removeItem('isSelectCompany')
      } else {
        let token = JSON.parse(localStorage.getItem('auth-token')).token
        let tokenData = jwt_decode(token)
        let currentUserData = {
          id: tokenData.user_company_resourceid,
          name: tokenData.user_company_name,
          surname: tokenData.family_name,
          email: tokenData.email,
          fullName: tokenData.given_name,
          countryCode: null,
          phone: tokenData.phone_number,
          status: null,
          currentCompany: {
            id: tokenData.user_company_resourceid,
            name: tokenData.user_company_name,
            logoPath: tokenData.user_company_logopath,
            businessCategoryId: tokenData.user_company_industry_resourceid,
            resellerId: tokenData.user_company_parentcompany_resourceid,
            timeZone: null,
            isDemo: false
          },
          userCompany: {
            id: tokenData.user_company_resourceid,
            name: tokenData.user_company_name,
            logoPath: tokenData.user_company_logopath,
            businessCategoryId: tokenData.user_company_industry_resourceid,
            resellerId: tokenData.user_company_parentcompany_resourceid,
            timeZone: null,
            isDemo: false
          },
          role: {
            name: tokenData.role.toString()
          }
        }
        localStorage.setItem('companyId', currentUserData.currentCompany.id)
        localStorage.setItem('companyResourceId', currentUserData.currentCompany.id)
        localStorage.setItem('companyName', currentUserData.currentCompany.name)
        localStorage.setItem('userId', currentUserData.id)
        localStorage.setItem('businessCatId', currentUserData.userCompany.businessCategoryId)
        localStorage.setItem('userName', currentUserData.fullName)
        dispatch('dashboard/selectCompany', currentUserData, { root: true })
        commit('SET_CURRENTUSER', currentUserData)
        let systemUserData = {
          UserId: currentUserData.id,
          FirstName: currentUserData.name,
          LastName: currentUserData.surname,
          Email: currentUserData.email,
          CompanyId: currentUserData.userCompany.id,
          CompanyName: currentUserData.userCompany.name
        }
        //systemUser(systemUserData).then()
        localStorage.removeItem('isSelectCompany')
      }
    },
    getUserProfile({ commit }, payload) { // eslint-disable-line
      profile(payload).then(() => {})
    }
  }
}

export default auth
