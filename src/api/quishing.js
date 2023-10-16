import testRequest from '@/utils/testRequest'

const exportScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}
const searchScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search`, payload)
}
export default {
  exportScenarios,
  searchScenarios
}
