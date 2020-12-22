import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = '/companies/clients'
//Search function for listing rest api.
/*@param {payload} --> object */

export function searchRestApi(payload = {}) {
  return testRequest.post(`${API_URL}/search`, payload)
}

//This function generate Client Credentials

export function generateClientCredentials() {
  return testRequest.get(`${API_URL}/generate-client-credentials`)
}

//This function creates new restApiClient

export function createRestApi(payload = {}) {
  return testRequest.post(`${API_URL}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getRestApi(resourceId = {}) {
  return testRequest.get(`${API_URL}/${resourceId}`)
}

export function updateRestApi(resourceId = {}, payload) {
  return testRequest.put(`${API_URL}/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
