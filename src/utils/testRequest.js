import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const testService = axios.create({
  baseURL: process.env.VUE_APP_WEB_API_TEST,
  timeout: 50000,
  rejectUnauthorized: false
})

testService.interceptors.request.use(
  config => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      config.headers['X-IR-API-KEY'] = '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX'
      config.headers['X-IR-COMPANY-ID'] = localStorage.getItem('companyId')
    }
    return config
  },
  error => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

testService.interceptors.response.use(
  response => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    return response
  },
  error => {
    store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (!error.response) {
      return Promise.reject(error)
    } else if (error.response && error.response.status !== 404) {
      store.dispatch(
        'common/createSnackBar',
        {
          errorState: true,
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

export default testService
