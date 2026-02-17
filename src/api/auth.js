import request from '../utils/request'
import authTestRequest from '../utils/authTestRequest'
import testRequest from '../utils/testRequest'
import AuthenticationService from '../services/authentication'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
export function loginAction(payload) {
  const params = new URLSearchParams()
  let skipMfa = false
  if (payload.mfa?.StatusName === 'Inactive') {
    skipMfa = !payload.mfa.IsExpired
  }
  if (payload.skipMfa === 'forced') skipMfa = false
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
  params.append('captchaResponse', payload.captchaResponse || '')

  let uuidObj = localStorage.getItem('uuid')
  if (uuidObj) uuidObj = JSON.parse(uuidObj)
  if (uuidObj && uuidObj.email === payload.email) params.append('uuid', uuidObj.uuid)
  return authTestRequest.post('connect/token', params, {
    loading: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function loginWithSaml(payload) {
  const { username, authcode } = payload
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', username)
  params.append('scope', 'api1')
  params.append('client_secret', 'secret')
  params.append('client_id', 'ui_client')
  params.append('authcode', authcode)
  return authTestRequest.post('connect/token', params, {
    loading: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function resetPassword(payload) {
  return testRequest.post('system-users/send-reset-password-link', {
    loading: true,
    Email: payload
  })
}

export function loginWithUsername(payload = {}) {
  return testRequest.post('/account/login', payload, {
    loading: true
  })
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
    loading: true
  })
}

export function setMFA(payload) {
  return testRequest.put('/system-users/mfa', payload, {
    loading: true
  })
}

export function setMfaResync(payload) {
  return testRequest.put('/system-users/mfa/resync', payload, {
    loading: true
  })
}

export function cantLogin(payload) {
  return testRequest.post('/system-users/mfa/send-recovery-sms', payload, {
    loading: true
  })
}

export function getMfaStatus(payload) {
  return testRequest.get('/system-users/mfa/status', payload, {
    loading: true
  })
}

export function getMfaSetup(payload) {
  return testRequest.get('/system-users/mfa/setup', payload, {
    loading: true
  })
}

export function disableMfaStatus(payload) {
  return testRequest.put('/system-users/mfa/disable', payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function getAgentLoginUrl(payload) {
  return testRequest.post('/agent-auth/login-url', payload)
}
