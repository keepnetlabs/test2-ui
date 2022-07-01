import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
//trainings
const searchTraining = (payload) => {
  return testRequest.post('/trainings/search', payload)
}
const deleteTraining = (resourceId) => {
  return testRequest.delete(`/trainings/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const getTraining = (resourceId) => {}
const createTraining = (payload) => {}
const updateTraining = (payload) => {}

export default { searchTraining, deleteTraining, getTraining, createTraining, updateTraining }
