import request from '../utils/request'
import authTestRequest from '../utils/authTestRequest'
import testRequest from '../utils/testRequest'
import AuthenticationService from '../services/authentication'
import { COMMON_SNACKBAR } from '../model/constants/commonConstants'

export function loginAction(payload) {
  const params = new URLSearchParams()
  let skipMfa = false
  if (payload.mfa && payload.mfa.StatusName === 'Active') {
    skipMfa = false
  } else if (payload.mfa && payload.mfa.StatusName === 'Inactive') {
    skipMfa = payload.mfa.IsExpired ? false : true
  }
  params.append('grant_type', 'password')
  params.append('username', payload.email)
  params.append('password', payload.password)
  params.append('scope', 'api1')
  params.append('client_id', 'ui_client')
  params.append('client_secret', 'secret')
  params.append('skip_mfa', skipMfa)
  params.append('mfa_code', payload.code || '')
  params.append('remember_this_device', payload.rememberMeOnThisDevice || '')
  params.append('recovery_code', payload.recovery_code || '')
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

export function getMfaQRCode(payload) {
  return testRequest.post('/system-users/mfa', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function setMFA(payload) {
  return testRequest.put('/system-users/mfa', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function cantLogin(payload) {
  return testRequest.post('/system-users/mfa/send-recovery-sms', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function getMfaStatus(payload) {
  return testRequest.get('/system-users/mfa/status', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function disableMfaStatus(payload) {
  return testRequest.put('/system-users/mfa/disable', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
