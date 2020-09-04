import request from '../utils/request'
import authTestRequest from '../utils/authTestRequest'
import AuthenticationService from '../services/authentication'

export function loginAction(payload) {
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', 'keepnetlabs@keepnetlabs.com')
  params.append('password', 'Test123!')
  params.append('scope', 'api1')
  params.append('client_id', 'ui_client')
  params.append('client_secret', 'secret')
  return authTestRequest.post('connect/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function loginAction2(payload) {
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
