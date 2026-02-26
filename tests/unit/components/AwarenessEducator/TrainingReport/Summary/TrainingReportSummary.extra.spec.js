jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificateHtml: jest.fn(),
    resendCertificateToUserList: jest.fn(() => Promise.resolve()),
    getTrainingTypeCount: jest.fn()
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn()
}))

import TrainingReportSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummary.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'

describe('TrainingReportSummary.vue (extra branch coverage)', () => {
  it('getAudienceDetailsType returns phishingCampaign when isFromPhishingCampaign is true', () => {
    const ctx = { isFromPhishingCampaign: true }
    expect(TrainingReportSummary.computed.getAudienceDetailsType.call(ctx)).toBe('phishingCampaign')
  })

  it('getChartData handles null trainingSummary', () => {
    const ctx = { trainingSummary: null }
    expect(TrainingReportSummary.computed.getChartData.call(ctx)).toEqual([])
  })

  it('getCardsData handles undefined reportDetail and inProgressCount', () => {
    const ctx = {
      trainingSummary: {
        reportDetail: undefined,
        completedCount: 0,
        inProgressCount: undefined
      }
    }
    const data = TrainingReportSummary.computed.getCardsData.call(ctx)
    expect(data.downloaded.userPercent).toBe('0')
    expect(data.inProgress.userCount).toBeUndefined()
  })

  it('getTrainingInfoData uses fallback when trainingSummary is null', () => {
    const ctx = {
      trainingSummary: null,
      languages: []
    }
    const data = TrainingReportSummary.computed.getTrainingInfoData.call(ctx)
    expect(data['Auto-enroll'].value).toBe('Enroll new users the same day')
    expect(data.Languages.value).toBe('EN')
  })

  it('toggleIsShowResendDialog clears selectedRow when closing dialog', () => {
    const ctx = {
      isShowResendDialog: true,
      selectedRow: { id: 1 }
    }
    TrainingReportSummary.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('handleOnResend accepts single item', () => {
    const ctx = {
      resendPayload: null,
      isShowResendDialog: false,
      toggleIsShowResendDialog: jest.fn()
    }
    TrainingReportSummary.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload.selectedItems).toEqual(['u1'])
  })

  it('isTrainingTypeLearningPath true for both payload types', () => {
    expect(
      TrainingReportSummary.computed.isTrainingTypeLearningPath.call({
        getTrainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
    expect(
      TrainingReportSummary.computed.isTrainingTypeLearningPath.call({
        getTrainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH
      })
    ).toBe(true)
  })

  it('watch handlers call API methods only when ids are truthy', () => {
    const vm = {
      callForCertificate: jest.fn(),
      callForEnrollmentEmail: jest.fn()
    }

    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.handler.call(
      vm,
      'cert-id'
    )
    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.handler.call(
      vm,
      ''
    )
    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.handler.call(
      vm,
      'tmpl-id'
    )
    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.handler.call(
      vm,
      null
    )

    expect(vm.callForCertificate).toHaveBeenCalledTimes(1)
    expect(vm.callForEnrollmentEmail).toHaveBeenCalledTimes(1)
  })

  it('callForEnrollmentEmail returns early when template id is missing', () => {
    const ctx = {
      getTrainingEmailNotificationTemplateTypeResourceId: '',
      enrollmentEmailData: {}
    }

    TrainingReportSummary.methods.callForEnrollmentEmail.call(ctx)
    expect(getDefaultEmailTemplate).not.toHaveBeenCalled()
  })

  it('callForCertificate returns early when certificate id is missing', () => {
    const ctx = {
      getCertificateEmailNotificationTemplateTypeResourceId: '',
      certificateEmailData: {}
    }

    TrainingReportSummary.methods.callForCertificate.call(ctx)
    expect(AwarenessEducatorService.getCertificateHtml).not.toHaveBeenCalled()
  })

  it('resendItem safely finalizes when certificate table refs are missing', async () => {
    const ctx = {
      awardCertificateEnrollmentId: 'enroll-2',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      toggleIsShowResendDialog: jest.fn(),
      $refs: {}
    }

    TrainingReportSummary.methods.resendItem.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(AwarenessEducatorService.resendCertificateToUserList).toHaveBeenCalledWith([
      { targetUserResourceId: 'u1', enrollmentId: 'enroll-2' }
    ])
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })
})
