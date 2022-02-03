import testRequest from '../utils/testRequest'

export function getTimezones() {
  return testRequest.get('/timezone/timezones')
}
export function getLookupListByTypeId(id) {
  return testRequest.get(`lookups/${id}`)
}
export function getLookupListByTypeIdList(obj) {
  return testRequest.post(`lookups`, obj)
}

export function getLicences() {
  return testRequest.get('/lookups/licenses')
}
