import request from '../utils/request'
import AuthenticationService from '../services/authentication'

export function loginAction(payload) {
  return request.post('account/token', {
    email: payload.email,
    password: payload.password
  })
}

export function getCurrentUser() {
  return request.get('account/myself')
}

export function resetPassword(payload) {
  return request.post('account/reset', { UserName: payload })
}

export function profile() {
  return request.get('/users/me')
}

export function twoStepLogin(payload) {
  return request.post('account/twostep/verify', {
    Code: payload.code,
    Token: AuthenticationService.getToken()
  })
}
