jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    createEnrollment: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
    downloadTrainingPackage: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
  }
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getErrorMessage: jest.fn(() => 'mock-error'),
  scrollToComponent: jest.fn()
}))

import SendTrainingModal from '@/components/AwarenessEducator/SendTraining/SendTrainingModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('SendTrainingModal.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getSaveButtonText returns SAVE & DOWNLOAD when step=3 and isProxy=true', () => {
    const value = SendTrainingModal.computed.getSaveButtonText.call({
      step: 3,
      $refs: { refSendTrainingSettings: { formData: { isProxy: true } } }
    })
    expect(value).toBe('SAVE & DOWNLOAD')
  })

  it('getSaveButtonText returns LAUNCH for non-proxy flow', () => {
    const value = SendTrainingModal.computed.getSaveButtonText.call({
      step: 2,
      $refs: { refSendTrainingSettings: { formData: { isProxy: false } } }
    })
    expect(value).toBe('LAUNCH')
  })

  it('getTrainingSummaryFormData returns empty object before step 3', () => {
    const value = SendTrainingModal.computed.getTrainingSummaryFormData.call({
      step: 1
    })
    expect(value).toEqual({})
  })

  it('getTrainingSummaryFormData removes sms fields when sms notification is off', () => {
    const ctx = {
      step: 3,
      selectedRow: { type: 'Training' },
      userCountDetailResponse: {},
      certificateData: null,
      reminderData: null,
      enrollmentData: null,
      trainingPreviewData: {},
      $refs: {
        refSendTrainingSelectUsers: {
          totalTargetUserCount: 10,
          selectedTargetGroups: []
        },
        refSendTrainingSettings: {
          isAutoEnroll: true,
          sendReminderEvery: false,
          formData: {
            isProxy: false,
            isSendSMSNotification: false,
            markedAsTest: false,
            scheduleTypeId: '1',
            awardCertificate: false,
            languageIds: ['en']
          },
          $refs: {
            refInputContentLanguage: { contentLanguageItems: [{ value: 'en', text: 'English' }] },
            refSendTrainingSMSSettings: {
              formData: { phoneNumber: '+1', smsTextTemplate: 'hello' }
            }
          }
        }
      }
    }
    const value = SendTrainingModal.computed.getTrainingSummaryFormData.call(ctx)
    expect(value.settings['Sender Phone Number']).toBeUndefined()
    expect(value.settings['SMS Text']).toBeUndefined()
  })

  it('getTrainingSummaryFormData removes auto-enroll and schedule in proxy mode', () => {
    const ctx = {
      step: 3,
      selectedRow: { type: 'Training' },
      userCountDetailResponse: {},
      certificateData: null,
      reminderData: null,
      enrollmentData: null,
      trainingPreviewData: {},
      $refs: {
        refSendTrainingSelectUsers: {
          totalTargetUserCount: 10,
          selectedTargetGroups: []
        },
        refSendTrainingSettings: {
          isAutoEnroll: true,
          sendReminderEvery: false,
          formData: {
            isProxy: true,
            isSendSMSNotification: true,
            markedAsTest: false,
            scheduleTypeId: '1',
            awardCertificate: false,
            languageIds: ['en']
          },
          $refs: {
            refInputContentLanguage: { contentLanguageItems: [{ value: 'en', text: 'English' }] },
            refSendTrainingSMSSettings: {
              formData: { phoneNumber: '+1', smsTextTemplate: 'hello {TRAININGURL}' }
            }
          }
        }
      }
    }
    const value = SendTrainingModal.computed.getTrainingSummaryFormData.call(ctx)
    expect(value.settings['Auto-enroll']).toBeUndefined()
    expect(value.settings.Schedule).toBeUndefined()
  })

  it('changeStep increments directly for non-step1/2 branches', async () => {
    const ctx = { step: 3 }
    await SendTrainingModal.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(2)
  })

  it('handleSubmit returns download flow for proxy setting', () => {
    const handleDownloadPackage = jest.fn()
    const ctx = {
      selectedRow: { trainingId: 't1' },
      handleDownloadPackage,
      $refs: { refSendTrainingSettings: { formData: { isProxy: true } } }
    }
    SendTrainingModal.methods.handleSubmit.call(ctx)
    expect(handleDownloadPackage).toHaveBeenCalledWith({ trainingId: 't1' })
  })

  it('handleSubmit sets createErrorMessage on createEnrollment failure', async () => {
    AwarenessEducatorService.createEnrollment.mockImplementationOnce(() =>
      Promise.reject(new Error('failed'))
    )
    const ctx = {
      selectedRow: { trainingId: 'training-1' },
      createErrorMessage: '',
      isActionButtonDisabled: false,
      handleSetPhishingCampaignConditionTypes: SendTrainingModal.methods.handleSetPhishingCampaignConditionTypes,
      showSuccessSnackbarAndRouteToEnrollments: jest.fn(),
      $refs: {
        refSendTrainingSelectUsers: {
          selectedRadioGroupIndex: 0,
          formData: { targetGroupResourceIds: [{ value: 'group-1' }] }
        },
        refSendTrainingSettings: {
          sendReminderEvery: false,
          isAutoEnroll: false,
          formData: {
            isProxy: false,
            scheduleTypeId: '1',
            markedAsTest: false,
            awardCertificate: false,
            languageIds: ['en', 'All'],
            name: 'Enrollment Name',
            enrollmentScheduler: {},
            enrollmentAutoEnroll: {},
            enrollmentReminder: {},
            isSendSMSNotification: false
          }
        }
      },
      $store: { dispatch: jest.fn() }
    }

    SendTrainingModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.createErrorMessage).toBe('mock-error')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
