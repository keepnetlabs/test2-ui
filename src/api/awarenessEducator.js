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
const updateTraining = (payload, resourceId) => {}
const searchCertificate = (payload) => {
  return testRequest.post('/certificates/search', payload)
}
const deleteCertificate = (resourceId) => {
  return testRequest.delete(`/certificates/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const createCertificate = (payload) => {
  return testRequest.post('/certificates', payload)
}

const updateCertificate = (payload, resourceId) => {
  return testRequest.put(`/certificates/${resourceId}`, payload)
}

const getCertificate = (resourceId) => {
  return testRequest.get(`/certificates/${resourceId}`)
}

const makeDefaultCertificate = (resourceId) => {
  return testRequest.post(`/certificates/${resourceId}/default`)
}

export default {
  searchTraining,
  deleteTraining,
  getTraining,
  createTraining,
  updateTraining,
  searchCertificate,
  deleteCertificate,
  createCertificate,
  updateCertificate,
  getCertificate,
  makeDefaultCertificate
}
