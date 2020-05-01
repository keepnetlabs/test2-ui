import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'
import store from '../store'
const testService = axios.create({
  baseURL: process.env.VUE_APP_WEB_API_TEST,
  timeout: 50000,
  rejectUnauthorized: false
})

testService.interceptors.request.use(config => {
    store.commit('common/SET_IS_LOADING', 1, { root: true })
  if (config.url !== 'account/token') {
    config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
    config.headers['X-IR-API-KEY'] = '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX'
    config.headers['X-IR-COMPANY-ID'] = ' F4A5CD1B-6EB2-4BE8-80E1-F70F266F4DA5'
  }
  return config
}, error => (error) => {
  store.commit('common/SET_IS_LOADING', -1, { root: true })
})

testService.interceptors.response.use(
  response => {
    store.commit('common/SET_IS_LOADING', -1, { root: true })
   return  response
  },
  error => {
    console.log("error",error)
    store.commit('common/SET_IS_LOADING', -1, { root: true })
    if (!error.response) {
      return Promise.reject(error)
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
