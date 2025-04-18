import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getErrorMessage } from '@/utils/functions'

const service = axios.create({
  baseURL: APP_CONFIG.VUE_APP_VISHING_URL,
  timeout: 100000,
  rejectUnauthorized: false
})

service.interceptors.request.use(
  (config) => {
    config &&
      config.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
      config.headers['X-IR-COMPANY-ID'] = localStorage.getItem('companyRequestId')
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
    } else if (error.response && error.response.status !== 404) {
      store.dispatch('common/createSnackBar', {
        message: getErrorMessage(error),
        icon: 'mdi-alert',
        color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
      })
    }
    return Promise.reject(error)
  }
)

export default service
