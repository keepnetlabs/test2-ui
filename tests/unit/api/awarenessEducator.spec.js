jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import awarenessApi from '@/api/awarenessEducator'

describe('awarenessEducator API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('training operations', () => {
    it('should call searchTraining with payload and options', async () => {
      const payload = { page: 1 }
      const options = { timeout: 5000 }
      await awarenessApi.searchTraining(payload, options)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search', payload, options)
    })

    it('should call searchTraining with default empty options', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchTraining(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search', payload, {})
    })

    it('should call getTraining', async () => {
      const id = 'training-123'
      await awarenessApi.getTraining(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/trainings/${id}`)
    })

    it('should call createTraining', async () => {
      const payload = { name: 'New Training' }
      await awarenessApi.createTraining(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call updateTraining', async () => {
      const payload = { name: 'Updated Training' }
      const id = 'training-123'
      await awarenessApi.updateTraining(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(`/trainings/${id}`, payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call deleteTraining', async () => {
      const id = 'training-123'
      await awarenessApi.deleteTraining(id)
      expect(testRequest.delete).toHaveBeenCalledWith(`/trainings/${id}`, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call createDraftTraining', async () => {
      const payload = { name: 'Draft Training' }
      await awarenessApi.createDraftTraining(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/draft', payload)
    })

    it('should call exportTrainingList', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportTrainingList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should call uploadTrainingContent', async () => {
      const payload = new FormData()
      const id = 'training-123'
      const signal = new AbortController().signal
      const callback = jest.fn()
      await awarenessApi.uploadTrainingContent(payload, id, signal, callback)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/trainings/${id}/upload-content`,
        payload,
        expect.objectContaining({
          snackbar: COMMON_SNACKBAR,
          onUploadProgress: callback,
          signal: signal,
          timeout: Infinity
        })
      )
    })

    it('should call uploadPosterContent', async () => {
      const payload = new FormData()
      const id = 'training-123'
      const signal = new AbortController().signal
      const callback = jest.fn()
      await awarenessApi.uploadPosterContent(payload, id, signal, callback)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/trainings/${id}/upload-file-content`,
        payload,
        expect.objectContaining({
          snackbar: COMMON_SNACKBAR,
          onUploadProgress: callback,
          signal: signal,
          timeout: Infinity
        })
      )
    })

    it('should call getTrainingUrl', async () => {
      const targetId = 'user-123'
      const contentId = 'content-456'
      await awarenessApi.getTrainingUrl(targetId, contentId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/trainings/scorm?enrollmentContentId=${contentId}&targetUserResourceId=${targetId}`
      )
    })

    it('should call getTrainingUrlForPreview', async () => {
      const trainingId = 'training-123'
      const languageId = 'lang-en'
      await awarenessApi.getTrainingUrlForPreview(trainingId, languageId)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/scorm/preview', {
        trainingId,
        languageId
      })
    })

    it('should call getScormTypes', async () => {
      await awarenessApi.getScormTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/types')
    })

    it('should call getCategories', async () => {
      await awarenessApi.getCategories()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/categories')
    })

    it('should call getTargetAudiences', async () => {
      await awarenessApi.getTargetAudiences()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/target-audiences')
    })

    it('should call getLanguages', async () => {
      await awarenessApi.getLanguages()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/languages')
    })
  })

  describe('certificate operations', () => {
    it('should call searchCertificate', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchCertificate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/certificates/search', payload)
    })

    it('should call getCertificate', async () => {
      const id = 'cert-123'
      await awarenessApi.getCertificate(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/certificates/${id}`)
    })

    it('should call createCertificate', async () => {
      const payload = { name: 'New Certificate' }
      await awarenessApi.createCertificate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/certificates', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call updateCertificate', async () => {
      const payload = { name: 'Updated Certificate' }
      const id = 'cert-123'
      await awarenessApi.updateCertificate(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(`/certificates/${id}`, payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call deleteCertificate', async () => {
      const id = 'cert-123'
      await awarenessApi.deleteCertificate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(`/certificates/${id}`, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call makeDefaultCertificate', async () => {
      const id = 'cert-123'
      await awarenessApi.makeDefaultCertificate(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/certificates/${id}/default`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportCertificates', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportCertificates(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/certificates/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should call getDefaultCertificateTemplate', async () => {
      await awarenessApi.getDefaultCertificateTemplate()
      expect(testRequest.get).toHaveBeenCalledWith('/certificates/default-template')
    })
  })

  describe('enrollment operations', () => {
    it('should call searchEnrollments', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchEnrollments(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/enrollments/search', payload)
    })

    it('should call getEnrollment', async () => {
      const id = 'enroll-123'
      await awarenessApi.getEnrollment(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/enrollments/${id}`)
    })

    it('should call createEnrollment with custom snackbar', async () => {
      const payload = { trainingId: 'training-123' }
      await awarenessApi.createEnrollment(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/enrollments', payload, {
        snackbar: { hideError: true }
      })
    })

    it('should call updateEnrollment', async () => {
      const payload = { status: 'active' }
      const id = 'enroll-123'
      await awarenessApi.updateEnrollment(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(`/enrollments/${id}`, payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call sendEnrollment', async () => {
      const id = 'enroll-123'
      await awarenessApi.sendEnrollment(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/enrollments/${id}/send`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopEnrollment', async () => {
      const id = 'enroll-123'
      await awarenessApi.stopEnrollment(id)
      expect(testRequest.post).toHaveBeenCalledWith(`/enrollments/${id}/stop`, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should call stopReminder', async () => {
      const id = 'enroll-123'
      await awarenessApi.stopReminder(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/enrollments/${id}/stop-reminder`,
        undefined,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopAutoEnroll', async () => {
      const id = 'enroll-123'
      await awarenessApi.stopAutoEnroll(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/enrollments/${id}/stop-autoenroll`,
        undefined,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportEnrollments', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportEnrollments(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/enrollments/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should call getEnrollmentFormDetails', async () => {
      await awarenessApi.getEnrollmentFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('/enrollments/form-details')
    })

    it('should call getEnrollmentsContentLanguages', async () => {
      const id = 'enroll-123'
      await awarenessApi.getEnrollmentsContentLanguages(id)
      expect(testRequest.post).toHaveBeenCalledWith(`/enrollments/${id}/languages`)
    })

    it('should call getContentLanguageItems', async () => {
      const id = 'enroll-123'
      await awarenessApi.getContentLanguageItems(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/enrollments/${id}/languages`)
    })
  })

  describe('SCORM operations', () => {
    it('should call lmsInitialize', async () => {
      const payload = { cmi: {} }
      await awarenessApi.lmsInitialize(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/scorm/LMSInitialize', payload)
    })

    it('should call lmsGetValue', async () => {
      const payload = { element: 'cmi.core.student_name' }
      await awarenessApi.lmsGetValue(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/scorm/LMSGetValue', payload)
    })

    it('should call lmsSetValue', async () => {
      const payload = { element: 'cmi.core.score.raw', value: '90' }
      await awarenessApi.lmsSetValue(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/scorm/LMSSetValue', payload)
    })

    it('should call lmsFinish', async () => {
      const payload = { cmi: {} }
      await awarenessApi.lmsFinish(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('training report operations', () => {
    it('should call getTrainingReportSummary with default trainingType', async () => {
      const id = 'enroll-123'
      await awarenessApi.getTrainingReportSummary(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/${id}/summary?trainingType=0`
      )
    })

    it('should call getTrainingReportSummary with trainingType override', async () => {
      const id = 'enroll-123'
      await awarenessApi.getTrainingReportSummary(id, 2)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/${id}/summary?trainingType=2`
      )
    })

    it('should call searchTrainingReportUsers and inject trainingType into payload', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchTrainingReportUsers(payload, 'enroll-123', 3)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/training-reports/enroll-123/users/search`,
        expect.objectContaining({ trainingType: 3 })
      )
    })

    it('should call searchTrainingReportUsers without trainingType (falsy branch)', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchTrainingReportUsers(payload, 'enroll-123', null)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/training-reports/enroll-123/users/search`,
        payload
      )
    })

    it('should call getTrainingReportInteractions with interactionType and trainingType', async () => {
      await awarenessApi.getTrainingReportInteractions('enroll-1', 'res-1', 4, 2)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/interactions/res-1?emailEventType=4&trainingType=2`
      )
    })

    it('should call getTrainingReportInteractions with only trainingType', async () => {
      await awarenessApi.getTrainingReportInteractions('enroll-1', 'res-1', null, 1)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/interactions/res-1?trainingType=1`
      )
    })

    it('should call getTrainingReportInteractions with only interactionType (no trainingType)', async () => {
      await awarenessApi.getTrainingReportInteractions('enroll-1', 'res-1', 5, null)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/interactions/res-1?emailEventType=5`
      )
    })

    it('should call getTrainingReportInteractions with neither interactionType nor trainingType', async () => {
      await awarenessApi.getTrainingReportInteractions('enroll-1', 'res-1', null, null)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/interactions/res-1`
      )
    })

    it('should call getTrainingReportNonTargetUserInteractions', async () => {
      const payload = { page: 1 }
      await awarenessApi.getTrainingReportNonTargetUserInteractions(
        'enroll-1',
        'user-1',
        3,
        payload
      )
      expect(testRequest.post).toHaveBeenCalledWith(
        `/training-reports/anonymous/enroll-1/user-detail/user-1?emailEventType=3`,
        payload
      )
    })

    it('should call getTrainingReportNonTargetUserInteractions without interactionType', async () => {
      const payload = { page: 1 }
      await awarenessApi.getTrainingReportNonTargetUserInteractions(
        'enroll-1',
        'user-1',
        null,
        payload
      )
      expect(testRequest.post).toHaveBeenCalledWith(
        `/training-reports/anonymous/enroll-1/user-detail/user-1`,
        payload
      )
    })

    it('should call exportTrainingReport', async () => {
      await awarenessApi.exportTrainingReport('enroll-1')
      expect(testRequest.post).toHaveBeenCalledWith(
        `/training-reports/enroll-1/export`,
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('report details and downloads', () => {
    it('should call getTrainingReportCertificateEmailDetails', async () => {
      await awarenessApi.getTrainingReportCertificateEmailDetails('enroll-1', 'mail-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/email-event/mail-1/reminder`
      )
    })

    it('should call getTrainingReportExamResultSessions', async () => {
      await awarenessApi.getTrainingReportExamResultSessions('enroll-1', 'user-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        `/training-reports/enroll-1/exam-result-sessions/user-1`
      )
    })

    it('should call downloadTrainingPackage', async () => {
      const payload = { enrollmentId: 'enroll-1' }
      await awarenessApi.downloadTrainingPackage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/enrollments/scorm-proxy',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call downloadEnrollmentPackage', async () => {
      await awarenessApi.downloadEnrollmentPackage('enroll-1')
      expect(testRequest.post).toHaveBeenCalledWith(
        '/enrollments/downloadscormproxy/enroll-1',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('misc training operations', () => {
    it('should call downloadPoster', async () => {
      const payload = { trainingId: 'training-1', languageId: 'en' }
      await awarenessApi.downloadPoster(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/download', payload, {
        responseType: 'blob'
      })
    })

    it('should call getTrainingItems', async () => {
      const payload = { page: 1 }
      await awarenessApi.getTrainingItems(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search-summary', payload)
    })

    it('should call getPhishedLandingPage', async () => {
      await awarenessApi.getPhishedLandingPage('enroll-1')
      expect(testRequest.get).toHaveBeenCalledWith('/enrollments/enroll-1/content')
    })

    it('should call getTrainingTypeCount with options', async () => {
      const payload = { filters: {} }
      const options = { timeout: 5000 }
      await awarenessApi.getTrainingTypeCount(payload, options)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/trainings/get-training-type-count',
        payload,
        options
      )
    })

    it('should call getTrainingTypeCount with default options', async () => {
      const payload = { filters: {} }
      await awarenessApi.getTrainingTypeCount(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/trainings/get-training-type-count',
        payload,
        {}
      )
    })
  })

  describe('default parameter branch coverage', () => {
    it('should call restoreEnrollment with default resourceId', async () => {
      await awarenessApi.restoreEnrollment()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/enrollments/archive//restore',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call downloadEnrollmentPackage with default resourceId', async () => {
      await awarenessApi.downloadEnrollmentPackage()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/enrollments/downloadscormproxy/',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportTrainingReport with default id', async () => {
      await awarenessApi.exportTrainingReport()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call getPhishedLandingPage with default resourceId', async () => {
      await awarenessApi.getPhishedLandingPage()
      expect(testRequest.get).toHaveBeenCalledWith('/enrollments//content')
    })

    it('should call resendTrainingToUsers with default payload and id', async () => {
      await awarenessApi.resendTrainingToUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendCertificateToUserList with default payload', async () => {
      await awarenessApi.resendCertificateToUserList()
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        {},
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should call resendTrainingToUserList with default payload and id', async () => {
      await awarenessApi.resendTrainingToUserList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//users/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingToOpenedEmailList with default params', async () => {
      await awarenessApi.resendTrainingToOpenedEmailList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//opened-emails/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingToClickedLinkList with default params', async () => {
      await awarenessApi.resendTrainingToClickedLinkList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//clicked-emails/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingToProgressList with default params', async () => {
      await awarenessApi.resendTrainingToProgressList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//progress/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingToExamResultList with default params', async () => {
      await awarenessApi.resendTrainingToExamResultList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//exam-results/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingNoResponseList with default params', async () => {
      await awarenessApi.resendTrainingNoResponseList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//no-response/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call resendTrainingSendingReportList with default params', async () => {
      await awarenessApi.resendTrainingSendingReportList()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports//sending-report/resend',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('catalog lookups and favorites', () => {
    it('should call getVendors', async () => {
      await awarenessApi.getVendors()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/vendors')
    })

    it('should call getBehaviours', async () => {
      await awarenessApi.getBehaviours()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/behaviours')
    })

    it('should call getCompliances', async () => {
      await awarenessApi.getCompliances()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/compliances')
    })

    it('should call getTrainingTypes', async () => {
      await awarenessApi.getTrainingTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/types')
    })

    it('should call getTrainingLevels', async () => {
      await awarenessApi.getTrainingLevels()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/levels')
    })

    it('should call getTrainingDurations', async () => {
      await awarenessApi.getTrainingDurations()
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/durations')
    })

    it('should call addToFavorite', async () => {
      await awarenessApi.addToFavorite('training-1')
      expect(testRequest.post).toHaveBeenCalledWith(
        '/trainings/training-1/favourite',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeFromFavorite', async () => {
      await awarenessApi.removeFromFavorite('training-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/trainings/training-1/favourite',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('proxy and notifications', () => {
    it('should call searchProxyTargetUsers', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchProxyTargetUsers(payload, 'enroll-1')
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports/anonymous/enroll-1',
        payload
      )
    })

    it('should call getProxyTargetUserById', async () => {
      await awarenessApi.getProxyTargetUserById('user-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/training-reports/anonymous/{enrollmentId}/detail/user-1'
      )
    })

    it('should call searchMicrosoftTeamsSendingReportEmails', async () => {
      const payload = { page: 1 }
      await awarenessApi.searchMicrosoftTeamsSendingReportEmails(payload, 'enroll-1')
      expect(testRequest.post).toHaveBeenCalledWith('/notifications/enroll-1/search', payload)
    })

    it('should call resendMicrosoftTeamsSendingReportEmails', async () => {
      const payload = { ids: ['msg-1'] }
      await awarenessApi.resendMicrosoftTeamsSendingReportEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/enrollments/resend-teams', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await awarenessApi.getTraining('id')
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search operations', async () => {
      await awarenessApi.searchTraining({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      await awarenessApi.updateTraining({}, 'id')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await awarenessApi.deleteTraining('id')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for training export', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportTrainingList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for certificate export', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportCertificates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for enrollment export', async () => {
      const payload = { filters: {} }
      await awarenessApi.exportEnrollments(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for training mutations', async () => {
      await awarenessApi.createTraining({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for certificate mutations', async () => {
      await awarenessApi.createCertificate({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use custom snackbar for enrollment creation', async () => {
      await awarenessApi.createEnrollment({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: { hideError: true } })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty training search payload', async () => {
      await awarenessApi.searchTraining({})
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search', {}, {})
    })

    it('should handle special characters in ids', async () => {
      const specialId = 'training-123!@#$'
      await awarenessApi.getTraining(specialId)
      expect(testRequest.get).toHaveBeenCalledWith(`/trainings/${specialId}`)
    })

    it('should construct query params correctly', async () => {
      const targetId = 'user-456'
      const contentId = 'content-789'
      await awarenessApi.getTrainingUrl(targetId, contentId)
      const expectedUrl = `/trainings/scorm?enrollmentContentId=${contentId}&targetUserResourceId=${targetId}`
      expect(testRequest.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('should handle upload with all parameters', async () => {
      const payload = new FormData()
      const id = 'training-123'
      const signal = new AbortController().signal
      const callback = jest.fn()
      await awarenessApi.uploadTrainingContent(payload, id, signal, callback)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/trainings/${id}/upload-content`,
        expect.any(FormData),
        expect.any(Object)
      )
    })
  })
})
