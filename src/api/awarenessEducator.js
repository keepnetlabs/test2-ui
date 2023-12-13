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

const uploadTrainingContent = (payload, resourceId, abortSignal, onUploadProgressCallback) => {
  return testRequest.post(`/trainings/${resourceId}/upload-content`, payload, {
    snackbar: COMMON_SNACKBAR,
    onUploadProgress: onUploadProgressCallback,
    signal: abortSignal,
    timeout: Infinity
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
  return testRequest.post(`/enrollments/${resourceId}/stop`, {
    snackbar: COMMON_SNACKBAR
  })
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
  return testRequest.post('/enrollments', payload, {
    snackbar: {
      hideError: true
    }
  })
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

const getScormProxyTrainingReportSummary = (resourceId) => {
  return testRequest.get(`/training-reports/anonymous/${resourceId}/summary`)
}

const getTrainingReportFormDetails = () => {
  return testRequest.get('/training-reports/form-details')
}

const searchTrainingReportUsers = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/users/search`, payload)
}

const exportTrainingReportUsers = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/users/search/export`, payload, {
    responseType: 'blob'
  })
}

const openedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/opened-emails/search`, payload)
}

const exportOpenedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/opened-emails/search/export`, payload, {
    responseType: 'blob'
  })
}

const clickedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/clicked-emails/search`, payload)
}

const exportClickedTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/clicked-emails/search/export`, payload, {
    responseType: 'blob'
  })
}

const progressTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/progress/search`, payload)
}

const exportProgressTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/progress/search/export`, payload, {
    responseType: 'blob'
  })
}
const progressNonTargetUsersTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/anonymous/${resourceId}/progress`, payload)
}
const progressNonTargetUsersTrainingReportEmailsDetails = (
  payload,
  resourceId,
  targetUserResultId
) => {
  return testRequest.post(
    `/training-reports/anonymous/${resourceId}/progress-detail/${targetUserResultId}`,
    payload
  )
}

const examTrainingReportResults = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/exam-results/search`, payload)
}

const exportExamTrainingReportResults = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/exam-results/search/export`, payload, {
    responseType: 'blob'
  })
}
const examTrainingNonTargetUserReportResults = (payload, resourceId) => {
  return testRequest.post(`/training-reports/anonymous/${resourceId}/result`, payload)
}
const examTrainingNonTargetUserTrainingDetails = (payload, resourceId, targetUserResultId) => {
  return testRequest.post(
    `/training-reports/anonymous/${resourceId}/result-detail/${targetUserResultId}`,
    payload
  )
}

const exportNoResponseReportResults = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/no-response/search/export`, payload, {
    responseType: 'blob'
  })
}
const exportSendingReport = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/sending-report/search/export`, payload, {
    responseType: 'blob'
  })
}

const noResponseTrainingReportEmails = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/no-response/search`, payload)
}

const sendingReportTrainingReport = (payload, resourceId) => {
  return testRequest.post(`/training-reports/${resourceId}/sending-report/search`, payload)
}

const getTrainingReportInteractions = (enrollmentId, resourceId, interactionType) => {
  let url = `/training-reports/${enrollmentId}/interactions/${resourceId}`
  if (interactionType) url += `?emailEventType=${interactionType}`
  return testRequest.get(url)
}
const getTrainingReportNonTargetUserInteractions = (
  enrollmentId,
  resourceId,
  interactionType,
  axiosPayload
) => {
  let url = `/training-reports/anonymous/${enrollmentId}/user-detail/${resourceId}`
  if (interactionType) url += `?emailEventType=${interactionType}`
  return testRequest.post(url, axiosPayload)
}

const getTrainingReportExamResultsDetails = (enrollmentId, resourceId) => {
  return testRequest.get(`/training-reports/${enrollmentId}/exam-result-details/${resourceId}`)
}

const getTrainingReportSendingReportDetails = (enrollmentId, resourceId) => {
  return testRequest.get(`/training-reports/${enrollmentId}/email-event/${resourceId}`)
}

const getProgressDetailsTable = (enrollmentId, resourceId) => {
  return testRequest.get(`/training-reports/${enrollmentId}/progress-details/${resourceId}`)
}

const duplicateTraining = (resourceId) => {
  return testRequest.post(
    `/trainings/${resourceId}/duplicate`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const deleteTrainingFile = (resourceId, languageId) => {
  return testRequest.delete(`/trainings/${resourceId}/content/${languageId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const deleteEnrollment = (resourceId) => {
  return testRequest.delete(`/enrollments/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const searchTrash = (payload) => {
  return testRequest.post(`/enrollments/archive/search`, payload)
}

const deletePermanentlyEnrollment = (resourceId) => {
  return testRequest.delete(`/enrollments/archive/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

const restoreEnrollment = (resourceId = '') => {
  return testRequest.post(
    `/enrollments/archive/${resourceId}/restore`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}

const getPhoneNumbers = () => {
  return testRequest.get('/enrollments/phone-number')
}

const getCertificateHtml = (resourceId) => {
  return testRequest.post(`/training-reports/certificate/${resourceId}`)
}

const downloadTrainingPackage = (payload) => {
  return testRequest.post('/enrollments/scorm-proxy', payload, {
    responseType: 'blob'
  })
}
const downloadEnrollmentPackage = (resourceId = '') => {
  return testRequest.post(
    `/enrollments/downloadscormproxy/${resourceId}`,
    {},
    {
      responseType: 'blob'
    }
  )
}

const resendTrainingToUsers = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingToUserList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/users/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingToOpenedEmailList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/opened-emails/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingToClickedLinkList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/clicked-emails/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingToProgressList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/progress/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingToExamResultList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/exam-results/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingNoResponseList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/no-response/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
const resendTrainingSendingReportList = (payload = {}, id = '') => {
  return testRequest.post(`/training-reports/${id}/sending-report/resend`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

const exportTrainingReport = (id = '') => {
  return testRequest.get(`/training-reports/export/${id}`, {
    responseType: 'blob'
  })
}

const getTrainingItems = (payload) => {
  return testRequest.post(`/trainings/search-summary`, payload)
}

const getPhishedLandingPage = (resourceId = '') => {
  return testRequest.get(`/enrollments/${resourceId}/content`)
}

const searchProxyTargetUsers = (payload, id) => {
  return testRequest.post(`/training-reports/anonymous/${id}`, payload)
}
const getProxyTargetUserById = (id) => {
  return testRequest.get(`/training-reports/anonymous/{enrollmentId}/detail/${id}`)
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
  deleteEnrollment,
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
  getTrainingReportExamResultsDetails,
  exportOpenedTrainingReportEmails,
  exportClickedTrainingReportEmails,
  exportProgressTrainingReportEmails,
  exportNoResponseReportResults,
  exportExamTrainingReportResults,
  exportSendingReport,
  getTrainingReportInteractions,
  getTrainingReportNonTargetUserInteractions,
  getProgressDetailsTable,
  duplicateTraining,
  deleteTrainingFile,
  getTrainingReportSendingReportDetails,
  searchTrash,
  deletePermanentlyEnrollment,
  restoreEnrollment,
  getCertificateHtml,
  downloadTrainingPackage,
  downloadEnrollmentPackage,
  getPhoneNumbers,
  resendTrainingToUsers,
  resendTrainingToOpenedEmailList,
  resendTrainingToClickedLinkList,
  resendTrainingToProgressList,
  resendTrainingToExamResultList,
  resendTrainingNoResponseList,
  resendTrainingSendingReportList,
  resendTrainingToUserList,
  exportTrainingReport,
  getTrainingItems,
  getPhishedLandingPage,
  searchProxyTargetUsers,
  getProxyTargetUserById,
  examTrainingNonTargetUserReportResults,
  examTrainingNonTargetUserTrainingDetails,
  progressNonTargetUsersTrainingReportEmails,
  progressNonTargetUsersTrainingReportEmailsDetails,
  getScormProxyTrainingReportSummary
}
