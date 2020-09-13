import testRequest from '../utils/testRequest'

export function getSystemUsers(payload){
  return testRequest.post(`/system-users/search`, payload)
}
