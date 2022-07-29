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

const createDraftTraining = (payload) => {
  return testRequest.post('/trainings/draft', payload)
}

const exportTrainingList = (payload) => {
  return testRequest.post('/trainings/search/export', payload, {
    responseType: 'blob'
  })
}

const uploadTrainingContent = (payload, resourceId) => {
  return testRequest.post(`/trainings/${resourceId}/upload-content`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getTraining = (resourceId) => {
  return testRequest.get(`/trainings/${resourceId}`)
}
const updateTraining = (payload, resourceId) => {
  return testRequest.put(`/trainings/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const searchCertificate = (payload) => {
  return testRequest.post('/certificates/search', payload)
}
const deleteCertificate = (resourceId) => {
  return testRequest.delete(`/certificates/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}
const createCertificate = (payload) => {
  return testRequest.post('/certificates', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const updateCertificate = (payload, resourceId) => {
  return testRequest.put(`/certificates/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getCertificate = (resourceId) => {
  return testRequest.get(`/certificates/${resourceId}`)
}

const makeDefaultCertificate = (resourceId) => {
  return testRequest.post(
    `/certificates/${resourceId}/default`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const searchEnrollments = (payload) => {
  return testRequest.post('/enrollments/search', payload)
}

const exportEnrollments = (payload) => {
  return testRequest.post('/enrollments/search/export', payload, {
    responseType: 'blob'
  })
}

const sendEnrollment = (resourceId) => {
  return testRequest.post(
    `/enrollments/${resourceId}/send`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const stopEnrollment = (resourceId) => {
  return testRequest.post(`/enrollments/${resourceId}/stop`)
}

const getEnrollmentsContentLanguages = (resourceId) => {
  return testRequest.post(`/enrollments/${resourceId}/languages`)
}

const getDefaultCertificateTemplate = () => {
  return testRequest.get('/certificates/default-template')
}

const getCategories = () => {
  return testRequest.get('/trainings/categories')
}
const getTargetAudiences = () => {
  return testRequest.get('/trainings/target-audiences')
}
const getLanguages = () => {
  return testRequest.get('/trainings/languages')
}

const exportCertificates = (payload) => {
  return testRequest.post('/certificates/search/export', payload, {
    responseType: 'blob'
  })
}

const createEnrollment = (payload) => {
  return testRequest.post('/enrollments', payload)
}

const getEnrollment = (resourceId) => {
  return testRequest.get(`/enrollments/${resourceId}`)
}

const updateEnrollment = (payload, resourceId) => {
  return testRequest.put(`/enrollments/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const getTrainingUrl = (targetResourceId, enrollmentContentId) => {
  return testRequest.get(
    `/trainings/scorm?enrollmentContentId=${enrollmentContentId}&targetUserResourceId=${targetResourceId}`
  )
}
const getTrainingUrlForPreview = (trainingId, languageId) => {
  return testRequest.post('/trainings/scorm/preview', { trainingId, languageId })
}

const getEnrollmentFormDetails = () => {
  return testRequest.get('/enrollments/form-details')
}

const getContentLanguageItems = (resourceId) => {
  return testRequest.get(`/enrollments/${resourceId}/languages`)
}

const getScormTypes = () => {
  return testRequest.get('/trainings/types')
}

const lmsInitialize = (payload) => {
  return testRequest.post('/scorm/LMSInitialize', payload)
}
const lmsGetValue = (payload) => {
  return testRequest.post('/scorm/LMSGetValue', payload)
}
const lmsSetValue = (payload) => {
  return testRequest.post('/scorm/LMSSetValue', payload)
}
const lmsFinish = (payload) => {
  return testRequest.post('/scorm/LMSFinish', payload)
}

const getTrainingReportSummary = (resourceId) => {
  return testRequest.get(`/training-reports/${resourceId}/summary`)
}

const getTrainingReportFormDetails = () => {
  return testRequest.get('/training-reports/form-details')
}

const searchTrainingReportUsers = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/users/search`, payload)
}

const exportTrainingReportUsers = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/users/search/export`, payload)
}

const openedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/opened-emails/search`, payload, {
    responseType: 'blob'
  })
}

const exportOpenedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/opened-emails/search/export`, payload, {
    responseType: 'blob'
  })
}

const clickedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/clicked-emails/search`, payload)
}

const progressTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/progress/search`, payload)
}

const examTrainingReportResults = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/exam-results/search`, payload)
}
const noResponseTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/no-response/search`, payload)
}

const sendingReportTrainingReport = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/sending-report/search`, payload)
}

const getTrainingReportInteractions = (enrollmentId, resourceId) => {
  return testRequest.get(`/training-reports/${enrollmentId}/interactions/${resourceId}`)
}

export default {
  searchTraining,
  deleteTraining,
  getTraining,
  createDraftTraining,
  updateTraining,
  searchCertificate,
  deleteCertificate,
  createCertificate,
  updateCertificate,
  getCertificate,
  makeDefaultCertificate,
  getCategories,
  getTargetAudiences,
  getLanguages,
  exportTrainingList,
  uploadTrainingContent,
  searchEnrollments,
  exportEnrollments,
  getEnrollmentsContentLanguages,
  lmsInitialize,
  lmsSetValue,
  lmsGetValue,
  lmsFinish,
  getScormTypes,
  exportCertificates,
  getDefaultCertificateTemplate,
  sendEnrollment,
  stopEnrollment,
  getEnrollment,
  updateEnrollment,
  createEnrollment,
  getContentLanguageItems,
  getTrainingUrl,
  getEnrollmentFormDetails,
  getTrainingUrlForPreview,
  getTrainingReportSummary,
  searchTrainingReportUsers,
  openedTrainingReportEmails,
  clickedTrainingReportEmails,
  progressTrainingReportEmails,
  examTrainingReportResults,
  noResponseTrainingReportEmails,
  sendingReportTrainingReport,
  exportTrainingReportUsers,
  getTrainingReportFormDetails,
  exportOpenedTrainingReportEmails,
  getTrainingReportInteractions
}
