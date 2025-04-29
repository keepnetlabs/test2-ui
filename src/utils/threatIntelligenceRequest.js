import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const service = axios.create({
  baseURL: APP_CONFIG.VUE_APP_THREATS_INTELLIGENCE_URL,
  timeout: 100000,
  rejectUnauthorized: false
})

service.interceptors.request.use(
  (config) => {
    config?.loading && store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
      let companyId
      if (config.overrideCompanyId) companyId = config.headers['X-IR-COMPANY-ID']
      else
        companyId = config.isCompanySelect
          ? localStorage.getItem('companyResourceId')
          : localStorage.getItem('companyRequestId')
      config.headers['X-IR-COMPANY-ID'] = companyId
    }
    return config
  },
  () => {
    if (!config.loader) store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

service.interceptors.response.use(
  (response) => {
    response?.config?.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    return response
  },
  (error) => {
    error?.config?.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (!error.response) {
      return Promise.reject(error)
    }
    if (
      AuthenticationService.getToken() == null ||
      error.response.status === 401 ||
      error.response.status === 306
    ) {
      AuthenticationService.removeToken()
      router.push({ name: 'login', params: { isSessionExpired: 'true' } })
    }
    return Promise.reject(error)
  }
)

export default service
