import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = 'dashboard/widgets'
export function postWidgets(payload) {
  return testRequest.post(API_URL, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function getSummary(payload = {}, isLoading = true) {
  const config = isLoading ? { loading: isLoading } : {}
  return testRequest.get('/dashboard/summary', config)
}
