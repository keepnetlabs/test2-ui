import { profile, getCurrentUser } from '../../api/auth'
import { systemUser } from '../../api/threadSharing'

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
      getCurrentUser().then((response) => {
        const datas = {
          companyId: response.data.currentCompany.id,
          manager: response.data.currentCompany.name
        }
        localStorage.setItem('companyId', response.data.currentCompany.id)
        localStorage.setItem('companyResourceId', 'uB4jcFz9x1My')
        localStorage.setItem('companyName', response.data.currentCompany.name)
        localStorage.setItem('userId', response.data.id)
        localStorage.setItem('businessCatId', response.data.userCompany.businessCategoryId)
        localStorage.setItem('userName', response.data.fullName)
        dispatch('dashboard/selectCompany', datas, { root: true })
        commit('SET_CURRENTUSER', response.data)
        let systemUserData = {
          UserId: response.data.id,
          FirstName: response.data.name,
          LastName: response.data.surname,
          Email: response.data.email,
          CompanyId: response.data.userCompany.id,
          CompanyName: response.data.userCompany.name
        }
        systemUser(systemUserData).then()
        return response.data // Permission_Administrator
      })
    },
    getUserProfile({ commit }, payload) { // eslint-disable-line
      profile(payload).then(() => {})
    }
  }
}

export default auth
