import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const testService = axios.create({
  baseURL: APP_CONFIG.VUE_APP_APP_API_TEST || 'https://test-api.keepnetlabs.com/api',
  timeout: 100000, //@note timeout changed from 30000 to 100000
  rejectUnauthorized: false
})

testService.interceptors.request.use(
  (config) => {
    config?.loading && store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    if (config.url !== 'account/token') {
      config.headers.authorization = `Bearer ${
        config.overrideToken ? config.customToken : AuthenticationService.getToken()
      }`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
      config.headers['X-IR-COMPANY-ID'] = config.overrideCompanyId
        ? config.headers['X-IR-COMPANY-ID']
        : config.isCompanySelect
        ? localStorage.getItem('companyResourceId')
        : localStorage.getItem('companyRequestId')
    }
    return config
  },
  () => {
    if (!config.loader) store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

testService.interceptors.response.use(
  (response) => {
    //if there is global loader param
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
    //if there is global loader param
    error?.config?.loading &&
      store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)

    if (error?.message && error?.message === 'canceled') {
      return Promise.resolve({})
    }

    if (error?.response?.status === 403 && error?.response?.data?.status === 'PRIVACY_ERROR') {
      const mainCompanyId = localStorage.getItem('companyResourceId')
      const mainCompanyName = localStorage.getItem('companyName')
      localStorage.setItem('isSelectCompany', 'false')
      localStorage.setItem('companyId', mainCompanyId)
      localStorage.setItem('companyRequestId', mainCompanyId)
      localStorage.setItem('selectedCompanyRequestId', mainCompanyId)
      localStorage.setItem('selectedCompanyName', mainCompanyName)
      router.go(0)
      return Promise.resolve({})
    }

    if (error?.response?.status === 503) {
      return Promise.resolve({})
    }

    if (error?.config?.snackbar?.hideError) {
      return Promise.reject(error)
    }

    if (error.code === 'ECONNABORTED') {
      if (error?.message === 'timeout of 100000ms exceeded') {
        store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Your request took too long. Please check your connection and try again.',
          icon: 'mdi-alert'
        })
      }
      return Promise.reject(error)
    } else if (!error.response) {
      return Promise.reject(error)
    } else if (error.response.status === 401 || error.response.status === 306) {
      AuthenticationService.removeToken()
      //if router is in login dont need to push again
      if (router?.history?.current?.name !== 'login') {
        store.dispatch('common/resetSnackbars')
        router.push({ name: 'login', params: { isSessionExpired: 'true' } }).catch(() => {})
      }
    } else if (error.response && error.response.status !== 404) {
      if (
        error.request.responseType === 'blob' &&
        error.response.data instanceof Blob &&
        error.response.data.type &&
        error.response.data.type.toLowerCase().indexOf('json') != -1
      ) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onload = () => {
            error.response.data = JSON.parse(reader.result)
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
            resolve(Promise.reject(error))
          }

          reader.onerror = () => {
            reject(error)
          }

          reader.readAsText(error.response.data)
        })
      } else {
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
    } else if (!AuthenticationService.getToken()) {
      store.dispatch('common/resetSnackbars')
      router.push('/login').catch(() => {})
    }
    return Promise.reject(error)
  }
)

export default testService
