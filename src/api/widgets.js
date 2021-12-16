import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = 'dashboard/widgets'
export function postWidgets(payload) {
  return testRequest.post(API_URL, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function getWidgets() {
  return testRequest.get(API_URL, { loading: true })
}

export function getSummary(payload = {}) {
  return testRequest.get('/dashboard/summary', { loading: true })
}
