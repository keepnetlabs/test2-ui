import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

const service = axios.create({
  baseURL: APP_CONFIG.VUE_APP_EMAIL_THREAT_SIMULATOR_API,
  timeout: 100000,
  rejectUnauthorized: false
})

service.interceptors.request.use(
  (config) => {
    config?.loading && store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
    }
    return config
  },
  (error) => {
    error?.config?.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

service.interceptors.response.use(
  (response) => {
    response?.config?.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    const { snackbar } = response.config
    if (snackbar?.show) {
      store.dispatch('common/createSnackBar', {
        message: response.data.message,
        icon: snackbar.icon,
        color: snackbar.color
      })
    }
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
      router.push({ name: 'login', params: { isSessionExpired: 'true' } }).catch(() => {})
    }
    return Promise.reject(error)
  }
)

export default service
