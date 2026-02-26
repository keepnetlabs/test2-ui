jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificateHtml: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    resendCertificateToUserList: jest.fn(() => Promise.resolve({}))
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import TrainingReportSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingReportSummary.vue (more2 extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallback branches: isFromPhishingCampaign default true and userGroups fallback', () => {
    expect(
      TrainingReportSummary.computed.isFromPhishingCampaign.call({ trainingSummary: {} })
    ).toBe(true)
    expect(TrainingReportSummary.computed.getUserGroups.call({ trainingSummary: {} })).toEqual({})
  })

  it('getTrainingInfoData uses raw language code fallback and company language text', () => {
    const ctx = {
      languages: [{ code: 'EN', isoFriendlyName: 'English' }],
      trainingSummary: {
        languages: ['XX'],
        sendTemplatesInPreferredLanguage: false,
        reportDetail: { totalTargetUserCount: 3 },
        targetGroupNames: ['A'],
        targetGroupCount: 1
      }
    }
    const info = TrainingReportSummary.computed.getTrainingInfoData.call(ctx)
    expect(info.Languages.value).toBe('XX')
    expect(info['Preferred Language'].value).toBe('Company Language')
  })

  it('getCardsData uses zero percentages when totalTargetUserCount is zero', () => {
    const ctx = {
      trainingSummary: {
        reportDetail: { totalTargetUserCount: 0, totalUserOpenedCount: 0, noResponseCount: 0 },
        completedCount: 0,
        inProgressCount: 0
      }
    }
    const cards = TrainingReportSummary.computed.getCardsData.call(ctx)
    expect(cards.downloaded.userPercent).toBe('0')
    expect(cards.completedTraining.userPercent).toBe('0')
    expect(cards.noResponse.userPercent).toBe('0')
  })

  it('callForEnrollmentEmail and callForCertificate do nothing when ids are missing', () => {
    const ctx = {
      getTrainingEmailNotificationTemplateTypeResourceId: '',
      getCertificateEmailNotificationTemplateTypeResourceId: ''
    }
    TrainingReportSummary.methods.callForEnrollmentEmail.call(ctx)
    TrainingReportSummary.methods.callForCertificate.call(ctx)
    expect(getDefaultEmailTemplate).not.toHaveBeenCalled()
    expect(AwarenessEducatorService.getCertificateHtml).not.toHaveBeenCalled()
  })

  it('watch handlers call API methods only when value exists', () => {
    const callForCertificate = jest.fn()
    const callForEnrollmentEmail = jest.fn()
    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.handler.call(
      { callForCertificate },
      ''
    )
    expect(callForCertificate).not.toHaveBeenCalled()
    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.handler.call(
      { callForCertificate },
      'cert-id'
    )
    expect(callForCertificate).toHaveBeenCalled()

    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.handler.call(
      { callForEnrollmentEmail },
      ''
    )
    expect(callForEnrollmentEmail).not.toHaveBeenCalled()
    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.handler.call(
      { callForEnrollmentEmail },
      'tpl-id'
    )
    expect(callForEnrollmentEmail).toHaveBeenCalled()
  })

  it('beforeDestroy clears active interval', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval').mockImplementation(() => {})
    const ctx = { interval: 123 }
    TrainingReportSummary.beforeDestroy.call(ctx)
    expect(clearSpy).toHaveBeenCalledWith(123)
    clearSpy.mockRestore()
  })

  it('isTrainingTypeLearningPath supports legacy and payload enums', () => {
    expect(
      TrainingReportSummary.computed.isTrainingTypeLearningPath.call({
        getTrainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
    expect(
      TrainingReportSummary.computed.isTrainingTypeLearningPath.call({
        getTrainingType: 'SomethingElse'
      })
    ).toBe(false)
  })
})

