import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

const exportScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search/export`, payload, {
    responseType: 'blob'
  })
}
const searchScenarios = (payload) => {
  return testRequest.post(`phishing-simulator/phishing-scenario/search`, payload)
}
const deleteScenario = (id) => {
  return testRequest.delete(`phishing-simulator/phishing-scenario/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
export default {
  exportScenarios,
  searchScenarios,
  deleteScenario
}
