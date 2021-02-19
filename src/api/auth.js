import request from '../utils/request'
import authTestRequest from '../utils/authTestRequest'
import testRequest from '../utils/testRequest'
import AuthenticationService from '../services/authentication'
import { COMMON_SNACKBAR } from '../model/constants/commonConstants'

export function loginAction(payload) {
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', payload.email)
  params.append('password', payload.password)
  params.append('scope', 'api1')
  params.append('client_id', 'ui_client')
  params.append('client_secret', 'secret')
  params.append('skip_mfa', 'true')
  params.append('mfa_code', '')
  return authTestRequest.post('connect/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getCurrentUser() {
  return request.get('account/myself')
}

export function resetPassword(payload) {
  return testRequest.post('system-users/send-reset-password-link', { Email: payload })
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

export function createPasswordByToken(payload) {
  return testRequest.post('/system-users/create-password', payload, { loading: true })
}

export function resetPasswordByToken(payload) {
  return testRequest.post('/system-users/reset-password', payload, { loading: true })
}

export function updatePassword(payload) {
  return testRequest.put('/system-users/change-password', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
