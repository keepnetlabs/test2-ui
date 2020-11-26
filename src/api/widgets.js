import testRequest from '../utils/testRequest'
const API_URL = 'dashboard/widgets'
export function postWidgets(payload) {
  return testRequest.post(API_URL, payload)
}
export function getWidgets() {
  return testRequest.get(API_URL, { loading: true })
}
