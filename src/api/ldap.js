import testRequest from '../utils/testRequest'

export function getLDAPSettingDetailForMyCompany() {
  return testRequest.get('/ldap-setting/detail/for-my-company')
}
export function testLDAPConnection(payload) {
  return testRequest.post('/ldap-setting/detail/for-my-company', payload)
}
