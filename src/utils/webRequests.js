import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const service = axios.create({
  baseURL: APP_CONFIG.VUE_APP_WEB_API,
  timeout: 50000,
  rejectUnauthorized: false
})

service.interceptors.request.use(
  (config) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      ;(config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`),
        (config.headers.companyId = localStorage.getItem('companyId')),
        (config.headers.CacheControl = 'no-cache')
    }
    return config
  },
  (err) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

service.interceptors.response.use(
  (response) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    return response
  },
  (error) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (!error.response) {
      return Promise.reject(error)
    }
    if (
      AuthenticationService.getToken() == null ||
      error.response.status === 401 ||
      error.response.Code === '401_UNAUTHORIZED' ||
      error.response.status === 306
    ) {
      //AuthenticationService.removeToken()
      store.dispatch('common/changeSessionExpiredStatus', true)
      //router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
