import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const authTestService = axios.create({
  baseURL: APP_CONFIG.VUE_APP_APP_API_TEST || 'https://test-api.keepnetlabs.com',
  timeout: 50000,
  rejectUnauthorized: false
})

authTestService.interceptors.request.use(
  (config) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      //config.headers['X-IR-COMPANY-ID'] = 'TEST-COMPANY-2'
    }
    return config
  },
  (error) => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

authTestService.interceptors.response.use(
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
          message: error.response.data.message || error.response.data.Message
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

export default authTestService
