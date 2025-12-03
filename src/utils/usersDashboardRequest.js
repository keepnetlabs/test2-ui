import axios from 'axios'
import router from '../router'
import store from '../store'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

const usersDashboardService = axios.create({
  baseURL: APP_CONFIG.VUE_APP_APP_API_TEST || 'https://test-api.keepnetlabs.com/api',
  timeout: 100000,
  rejectUnauthorized: false
})

usersDashboardService.interceptors.request.use(
  (config) => {
    config?.loading && store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER)
    // Get token from usersDashboard store instead of AuthenticationService
    const token = store.getters['usersDashboard/getToken']
    if (token) {
      config.headers.authorization = `Bearer ${token}`
      config.headers['X-IR-API-KEY'] = APP_CONFIG.VUE_APP_API_KEY
    }
    return config
  },
  () => {
    if (!config.loader) store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER)
  }
)

usersDashboardService.interceptors.response.use(
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

    if (error?.message && error?.message === 'canceled') {
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
      // Clear usersDashboard authentication
      store.dispatch('usersDashboard/logout')
      // Redirect to users-dashboard-login instead of login
      if (router?.history?.current?.name !== 'users-dashboard-login') {
        store.dispatch('common/resetSnackbars')
        router.push({ name: 'users-dashboard-login' }).catch(() => {})
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
    } else if (!store.getters['usersDashboard/getToken']) {
      // Redirect to users-dashboard-login if no token
      store.dispatch('common/resetSnackbars')
      router.push('/users-dashboard-login').catch(() => {})
    }
    return Promise.reject(error)
  }
)

export default usersDashboardService
