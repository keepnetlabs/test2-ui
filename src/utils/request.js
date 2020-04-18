import axios from 'axios'
import router from '../router'
import AuthenticationService from '../services/authentication'

const service = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: 50000,
  rejectUnauthorized: false
})

service.interceptors.request.use(config => {
  if (config.url !== 'account/token') {
    config.headers.authorization = `Bearer ${AuthenticationService.getToken()}`
  }
  return config
})

service.interceptors.response.use(
  response => response,
  error => {
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

export default service
