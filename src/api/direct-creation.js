import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = '/companies/direct-email-settings'
const getDomains = () => {
  return Promise.resolve([
    { text: 'All', value: 'All', disabled: false },
    { divider: true },
    {
      text: 'Kobe',
      value: 'dRM96CUw9EY5',
      disabled: false
    },
    {
      text: 'Lebron',
      value: 'dRM96CUw9EY5',
      disabled: false
    },
    {
      text: 'George',
      value: 'dRM96CUw9EY5',
      disabled: false
    },
    {
      text: 'Carmelo',
      value: 'dRM96CUw9EY5',
      disabled: false
    }
  ])
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

const getApplicationId = () => {
  return testRequest.get(`${API_URL}/application-id`)
}

export default {
  getApplicationId,
  getDomains,
  searchEmailCreations,
  deleteEmailCreation,
  getDirectEmailCreation,
  exportDirectEmailCreation,
  createDirectEmailCreation,
  updateDirectEmailCreation
}
