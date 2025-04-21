import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const uploadRequest = axios.create({
  baseURL: APP_CONFIG.VUE_APP_APP_API_TEST || 'https://test-api.keepnetlabs.com/api',
  timeout: 1000000000,
  rejectUnauthorized: false
})

uploadRequest.interceptors.request.use(
  (config) => {
    config &&
      config.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
      config.headers['X-IR-COMPANY-ID'] = config.isCompanySelect
        ? localStorage.getItem('companyResourceId')
        : localStorage.getItem('companyRequestId')
    }
    return config
  },
  () => {
    if (!config.loader) store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

uploadRequest.interceptors.response.use(
  (response) => {
    response.config.loading &&
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
    error.config.loading && store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(error)
    } else if (!error.response) {
      return Promise.reject(error)
    } else if (error.response.status === 401 || error.response.status === 306) {
      AuthenticationService.removeToken()
      router.push({ name: 'login', params: { isSessionExpired: 'true' } })
    } else if (error.response && error.response.status !== 404) {
      store.dispatch(
        'common/createSnackBar',
        {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message:
            error?.response?.data?.validationMessages?.[0] ||
            error?.response?.data?.message ||
            error?.response?.data?.Message ||
            error?.message ||
            'Something Went Wrong',
          icon: 'mdi-alert'
        },
        { root: true }
      )
    }
    if (
      AuthenticationService.getToken() == null ||
      error.response.status === 401 ||
      error.response.status === 306
    ) {
      if (error.response.status === 401 || error.response.status === '401_UNAUTHORIZED') {
        AuthenticationService.removeToken()
        router.push({ name: 'login', params: { isSessionExpired: 'true' } })
      } else {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default uploadRequest
