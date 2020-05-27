import testRequest from '../utils/testRequest'

export function getTimezones() {
  return testRequest.get('/timezone/timezones')
}
