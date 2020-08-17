import testRequest from '../utils/testRequest'

export function getTimezones() {
  return testRequest.get('/timezone/timezones')
}
export function getLookupListByTypeId(id) {
  return testRequest.get(`lookups/${id}`)
}
