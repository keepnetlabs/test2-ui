jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingTypeCount: jest.fn(),
    createEnrollment: jest.fn(),
    getPhoneNumbers: jest.fn(),
    getTrainingUrlForPreview: jest.fn(),
    downloadTrainingPackage: jest.fn()
  }
}))

import TrainingLibraryTrainingSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryTrainingSendModal/TrainingLibraryTrainingSendModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

describe('TrainingLibraryTrainingSendModal.vue', () => {
  it('getTitle returns selected training name', () => {
    const title = TrainingLibraryTrainingSendModal.computed.getTitle.call({
      selectedRow: { trainingName: 'Security 101' }
    })
    expect(title).toBe('Send Training - Security 101')
  })

  it('getTimeZoneText returns display name by id', () => {
    const value = TrainingLibraryTrainingSendModal.methods.getTimeZoneText.call(
      {
        getTimezones: { timeZoneList: [{ id: 'tz1', displayName: 'UTC+3' }] }
      },
      'tz1'
    )
    expect(value).toBe('UTC+3')
  })

  it('handleSetPhishingCampaignConditionTypes maps selected flags', () => {
    const result = TrainingLibraryTrainingSendModal.methods.handleSetPhishingCampaignConditionTypes(
      {
        userWhoOpenedEmail: true,
        userWhoSubmittedMFACode: true,
        userWhoReportedAsSuspicious: true
      }
    )
    expect(result).toEqual(['EmailOpened', 'MfaDataSubmitted', 'ReportedAsSuspicious'])
  })

  it('handleSetPhishingCampaignConditionTypes returns empty array when no flags selected', () => {
    const result = TrainingLibraryTrainingSendModal.methods.handleSetPhishingCampaignConditionTypes({})
    expect(result).toEqual([])
  })

  it('isSmsNotification and isTrainingProxy computeds only read settings on steps 2/3', () => {
    const stepOneSms = TrainingLibraryTrainingSendModal.computed.isSmsNotification.call({
      step: 1,
      $refs: {}
    })
    const stepTwoSms = TrainingLibraryTrainingSendModal.computed.isSmsNotification.call({
      step: 2,
      $refs: { refSendTrainingSettings: { formData: { isSendSMSNotification: true } } }
    })
    const stepOneProxy = TrainingLibraryTrainingSendModal.computed.isTrainingProxy.call({
      step: 1,
      $refs: {}
    })
    const stepThreeProxy = TrainingLibraryTrainingSendModal.computed.isTrainingProxy.call({
      step: 3,
      $refs: { refSendTrainingSettings: { formData: { isProxy: true } } }
    })

    expect(stepOneSms).toBe(false)
    expect(stepTwoSms).toBe(true)
    expect(stepOneProxy).toBe(false)
    expect(stepThreeProxy).toBe(true)
  })

  it('getSaveButtonText returns proxy/save, launch and schedule branches', () => {
    const proxyText = TrainingLibraryTrainingSendModal.computed.getSaveButtonText.call({
      step: 3,
      $refs: { refSendTrainingSettings: { formData: { isProxy: true, scheduleTypeId: '1' } } }
    })
    const launchText = TrainingLibraryTrainingSendModal.computed.getSaveButtonText.call({
      step: 3,
      $refs: { refSendTrainingSettings: { formData: { isProxy: false, scheduleTypeId: '1' } } }
    })
    const scheduleText = TrainingLibraryTrainingSendModal.computed.getSaveButtonText.call({
      step: 3,
      $refs: { refSendTrainingSettings: { formData: { isProxy: false, scheduleTypeId: '2' } } }
    })

    expect(proxyText).toBe('SAVE & DOWNLOAD')
    expect(launchText).toBe('LAUNCH')
    expect(scheduleText).toBe('SCHEDULE')
  })

  it('routeToEnrollments pushes route and emits close event', () => {
    const push = jest.fn()
    const emit = jest.fn()
    TrainingLibraryTrainingSendModal.methods.routeToEnrollments.call({
      $router: { push },
      $emit: emit
    })

    expect(push).toHaveBeenCalledWith({ name: 'Enrollments' })
    expect(emit).toHaveBeenCalledWith('on-close', true)
  })

  it('showSuccessSnackbarAndRouteToEnrollments dispatches success snackbar then closes/routes', () => {
    const dispatch = jest.fn()
    const handleClose = jest.fn()
    const routeToEnrollments = jest.fn()
    TrainingLibraryTrainingSendModal.methods.showSuccessSnackbarAndRouteToEnrollments.call(
      {
        $store: { dispatch },
        handleClose,
        routeToEnrollments
      },
      { data: { message: 'Enrollment created' } }
    )

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Enrollment created' })
    )
    expect(handleClose).toHaveBeenCalled()
    expect(routeToEnrollments).toHaveBeenCalled()
  })

  it('handleDownloadPackage downloads one file per language and routes after completion', async () => {
    AwarenessEducatorService.downloadTrainingPackage.mockResolvedValue({ data: new Blob(['zip']) })
    const click = jest.fn()
    const createdLinks = []
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const link = { href: '', download: '', click }
        createdLinks.push(link)
        return link
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    }
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test')

    const routeToEnrollments = jest.fn()
    const ctx = {
      selectedRow: { trainingId: 'training-id' },
      isActionButtonDisabled: false,
      routeToEnrollments,
      $refs: {
        refSendTrainingSettings: {
          formData: {
            languageIds: ['en', 'tr', 'All'],
            name: 'Enrollment Name'
          },
          $refs: {
            refInputContentLanguage: {
              contentLanguageItems: [
                { value: 'en', text: 'English' },
                { value: 'tr', text: 'Turkish' }
              ]
            }
          }
        }
      }
    }

    TrainingLibraryTrainingSendModal.methods.handleDownloadPackage.call(ctx, {
      trainingId: 'training-id'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.downloadTrainingPackage).toHaveBeenCalledTimes(2)
    expect(routeToEnrollments).toHaveBeenCalled()
    expect(createdLinks[0].download).toBe('training-id-English_Scorm.zip')
    expect(createdLinks[1].download).toBe('training-id-Turkish_Scorm.zip')
    expect(click).toHaveBeenCalledTimes(2)
    expect(ctx.isActionButtonDisabled).toBe(false)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('handleSubmit delegates to package download when proxy mode is enabled', () => {
    const handleDownloadPackage = jest.fn()
    const ctx = {
      selectedRow: { trainingId: 't1' },
      handleDownloadPackage,
      $refs: {
        refSendTrainingSettings: { formData: { isProxy: true } }
      }
    }

    TrainingLibraryTrainingSendModal.methods.handleSubmit.call(ctx)
    expect(handleDownloadPackage).toHaveBeenCalledWith({ trainingId: 't1' })
  })

  it('handleSubmit sets Teams notification when delivery method is Microsoft Teams', () => {
    const createEnrollment = jest.spyOn(AwarenessEducatorService, 'createEnrollment').mockResolvedValue({
      data: { message: 'ok' }
    })
    const showSuccessSnackbarAndRouteToEnrollments = jest.fn()
    const ctx = {
      selectedRow: { trainingId: 'training-1' },
      $refs: {
        refSendTrainingSettings: {
          sendReminderEvery: false,
          isAutoEnroll: false,
          formData: {
            isProxy: false,
            enrollmentScheduler: { scheduledTimeZoneId: '', useOwnTimeZone: true },
            enrollmentAutoEnroll: {},
            enrollmentReminder: {},
            scheduleTypeId: '1',
            markedAsTest: false,
            awardCertificate: false,
            certificateConfigSendType: 'SendOnFirstAttempt',
            languageIds: ['en'],
            name: 'Enrollment',
            deliveryMethod: DELIVERY_METHODS.MICROSOFT_TEAMS,
            sendTemplatesInPreferredLanguage: false
          },
          $refs: {}
        },
        refSendTrainingSelectUsers: {
          selectedRadioGroupIndex: 0,
          formData: { targetGroupResourceIds: [{ value: 'g1' }], campaignResourceId: '' }
        }
      },
      isActionButtonDisabled: false,
      handleSetPhishingCampaignConditionTypes: jest.fn(() => []),
      showSuccessSnackbarAndRouteToEnrollments,
      createErrorMessage: ''
    }

    TrainingLibraryTrainingSendModal.methods.handleSubmit.call(ctx)
    expect(createEnrollment).toHaveBeenCalledWith(
      expect.objectContaining({
        sendTeamsNotification: true
      })
    )

    createEnrollment.mockRestore()
  })
})
