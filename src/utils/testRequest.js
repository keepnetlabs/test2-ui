import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const testService = axios.create({
  baseURL: APP_CONFIG.VUE_APP_APP_API_TEST || 'https://test-api.keepnetlabs.com/api',
  timeout: 30000, //@note timeout changed from 50000 to 10000
  rejectUnauthorized: false
})

testService.interceptors.request.use(
  (config) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
      config.headers['X-IR-COMPANY-ID'] = localStorage.getItem('companyId')
    }
    return config
  },
  (error) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

testService.interceptors.response.use(
  (response) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (response.data.code === 'FAILED') {
      store.dispatch(
        'common/createSnackBar',
        {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: response.data.message || response.data.Message,
          icon: 'mdi-alert'
        },
        { root: true }
      )
      return response
    } else {
      return response
    }
  },
  (error) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (!error.response) {
      return Promise.reject(error)
    } else if (error.response && error.response.status !== 404) {
      store.dispatch(
        'common/createSnackBar',
        {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message:
            error.response.data.validationMessages[0] ||
            error.response.data.message ||
            error.response.data.Message
        },
        { root: true }
      )
    }
    if (
      AuthenticationService.getToken() == null ||
      error.response.status === 401 ||
      error.response.status === 306
    ) {
      AuthenticationService.removeToken()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default testService
