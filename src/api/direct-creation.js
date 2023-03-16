import testRequest from '@/utils/testRequest'
const API_URL = '/companies/direct-email-settings'
const getClientId = () => {
  return Promise.resolve('ad19edeb-e902-49c6-8bb0-55bdd14b35d2')
}
const getDomains = () => {
  return Promise.resolve([
    { text: 'All', value: 'All', disabled: false },
    { divider: true },
    {
      text: 'Kobe',
      value: 'Kobe',
      disabled: false
    },
    {
      text: 'Lebron',
      value: 'Lebron',
      disabled: false
    },
    {
      text: 'George',
      value: 'George',
      disabled: false
    },
    {
      text: 'Carmelo',
      value: 'Carmelo',
      disabled: false
    }
  ])
}

const searchEmailCreations = (payload = {}) => {
  return testRequest.post(`${API_URL}/search`, payload)
}

const deleteEmailCreation = (resourceId = '') => {
  return Promise.resolve()
}

const getDirectEmailCreation = (resourceId = '') => {
  return Promise.resolve()
}

const exportDirectEmailCreation = (payload = {}) => {
  return testRequest.post(`${API_URL}/search/export`, payload, {
    responseType: 'blob'
  })
}
export default {
  getClientId,
  getDomains,
  searchEmailCreations,
  deleteEmailCreation,
  getDirectEmailCreation,
  exportDirectEmailCreation
}
