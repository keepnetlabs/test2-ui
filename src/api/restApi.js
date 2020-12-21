import testRequest from '../utils/testRequest'
const API_URL = '/companies/clients'
//Search function for listing rest api.
/*@param {payload} --> object */

export function searchRestApi(payload = {}) {
  return testRequest.post(`${API_URL}/search`, payload)
}
