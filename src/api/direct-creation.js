import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = '/companies/direct-email-settings'
const getDomains = (payload = {}) => {
  return testRequest.post(`${API_URL}/domain-list`, payload, {
    snackbar: {
      hideError: true
    }
  })
}

const searchEmailCreations = (payload = {}) => {
  return testRequest.post(`${API_URL}/search`, payload)
}

const deleteEmailCreation = (resourceId = '') => {
  return testRequest.delete(`${API_URL}/${resourceId}`, { snackbar: COMMON_SNACKBAR })
}

const getDirectEmailCreation = (resourceId = '') => {
  return testRequest.get(`${API_URL}/${resourceId}`)
}

const exportDirectEmailCreation = (payload = {}) => {
  return testRequest.post(`${API_URL}/search/export`, payload, {
    responseType: 'blob'
  })
}
const createDirectEmailCreation = (payload = {}) => {
  return testRequest.post(`${API_URL}`, payload, { snackbar: COMMON_SNACKBAR })
}
const updateDirectEmailCreation = (resourceId = '', payload = {}) => {
  return testRequest.put(`${API_URL}/${resourceId}`, payload, { snackbar: COMMON_SNACKBAR })
}

const testDirectEmailCreation = (payload) => {
  return testRequest.post(`${API_URL}/test`, payload, {
    snackbar: {
      ...COMMON_SNACKBAR,
      hideError: true
    }
  })
}

const getApplicationId = () => {
  return testRequest.get(`${API_URL}/application-id`)
}

const getDirectEmailSettings = () => {
  return testRequest.get(`${API_URL}/settings`)
}

const getGoogleWorkspaceClientId = () => {
  return testRequest.get(`${API_URL}/google-client`)
}

export default {
  getApplicationId,
  getDomains,
  searchEmailCreations,
  testDirectEmailCreation,
  deleteEmailCreation,
  getDirectEmailCreation,
  exportDirectEmailCreation,
  createDirectEmailCreation,
  updateDirectEmailCreation,
  getDirectEmailSettings,
  getGoogleWorkspaceClientId
}
