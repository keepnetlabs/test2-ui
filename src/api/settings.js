import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getTimezone() {
  return testRequest.get(`/timezone/timezones`)
}

export function getSystemUserSettings() {
  return testRequest.get(`/system-users/settings`)
}

export function setSystemUserSettings(payload) {
  return testRequest.put(`/system-users/settings`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}
