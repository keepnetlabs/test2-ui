jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    resendTrainingToUsers: jest.fn(() => Promise.resolve()),
    exportTrainingReport: jest.fn(() => Promise.resolve({ status: 200, data: 'blob-data' })),
    getCertificateHtml: jest.fn(() => Promise.resolve({ data: { data: '<html />' } })),
    getLanguages: jest.fn(() =>
      Promise.resolve({
        data: {
          data: [
            { code: 'EN', isoFriendlyName: 'English' },
            { shortCode: 'TR', name: 'Turkish' }
          ]
        }
      })
    )
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: { template: { id: 1 } } } }))
}))

import ScormSummary from '@/components/ScormProxyReport/Summary/TrainingReportSummary.vue'
import ScormHeader from '@/components/ScormProxyReport/Summary/TrainingReportSummaryHeader.vue'
import ScormCards from '@/components/ScormProxyReport/Summary/TrainingReportSummaryCards.vue'
import ScormResendDialog from '@/components/ScormProxyReport/Summary/TrainingReportSummaryResendDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ScormProxy report summary components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ScormCards computed returns fallback-safe data', () => {
    const ctx = {
      items: {
        inProgress: { userCount: 2 },
        completedTraining: { userCount: 3 }
      }
    }

    expect(ScormCards.computed.getInProgressData.call(ctx)).toEqual({ userCount: 2 })
    expect(ScormCards.computed.getCompletedTrainingData.call(ctx)).toEqual({ userCount: 3 })
    expect(ScormCards.computed.getInProgressData.call({ items: null })).toEqual({})
  })

  it('ScormResendDialog computed and emits work', () => {
    expect(
      ScormResendDialog.computed.getActionButtonDisabled.call({
        isActionButtonDisabled: false,
        types: []
      })
    ).toBe(true)

    const emit = jest.fn()
    ScormResendDialog.methods.closeModal.call({ $emit: emit })
    ScormResendDialog.methods.handleConfirm.call({ $emit: emit, types: [1, 4] })

    expect(emit).toHaveBeenCalledWith('on-close')
    expect(emit).toHaveBeenCalledWith('on-confirm', [1, 4])
  })

  it('ScormHeader resend flow and download(200) work', async () => {
    const ctx = {
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      id: 'scorm-1',
      isSurvey: false,
      isDownloadReportDisabled: false,
      toggleShowResendDialog: ScormHeader.methods.toggleShowResendDialog,
      $store: { dispatch: jest.fn() }
    }

    ScormHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)

    ScormHeader.methods.handleOnConfirmResend.call(ctx, [2])
    expect(AwarenessEducatorService.resendTrainingToUsers).toHaveBeenCalledWith(
      { resendTypes: [2] },
      'scorm-1'
    )
    await flushPromises()
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)

    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    if (!window.URL.createObjectURL) window.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:scorm')

    ScormHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    expect(link.click).toHaveBeenCalledTimes(1)
    expect(link.download).toBe('Training-Report.xlsx')
    expect(ctx.isDownloadReportDisabled).toBe(false)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('ScormSummary computed maps stats and language labels', () => {
    const ctx = {
      isSurvey: true,
      languages: [
        { code: 'EN', isoFriendlyName: 'English' },
        { shortCode: 'TR', name: 'Turkish' }
      ],
      trainingSummary: {
        isScormProxy: true,
        isFromPhishingCampaign: false,
        isFromUserGroups: true,
        phishingCampaign: { name: 'Phishing Campaign' },
        userGroups: { count: 2 },
        reportDetail: {
          totalUserOpenedCount: 1,
          totalUserClickedCount: 2,
          totalTargetUserCount: 5,
          emailDeliveredUserCount: 4,
          emailErrorUserCount: 1,
          didNotCompleteTrainingCount: 3,
          didNotCompleteExamCount: 0,
          failedExamCount: 1,
          noResponseCount: 1
        },
        trainingDetails: { id: 'tid', name: 'Scorm Name', companyName: 'Keepnet', category: 'A' },
        languages: ['EN', 'TR'],
        startDate: '2026-01-01',
        targetGroupCount: 4,
        isTest: true,
        trainingEmailNotificationTemplateTypeResourceId: 'tmpl-1',
        certificateAttachmentResourceId: 'cert-1'
      },
      scormTrainingSummary: {
        totalTargetUser: 10,
        totalNonTargetUser: 2,
        totalInProgress: 3,
        totalCompleteds: 9
      }
    }

    expect(ScormSummary.computed.isScormProxy.call(ctx)).toBe(true)
    expect(ScormSummary.computed.getAudienceDetailsType.call(ctx)).toBe('userGroups')
    expect(ScormSummary.computed.getCardsData.call(ctx)).toEqual({
      inProgress: { userCount: 3, userPercent: '25' },
      completedTraining: { userCount: 9, userPercent: '75' }
    })

    const trainingInfoData = ScormSummary.computed.getTrainingInfoData.call(ctx)
    expect(trainingInfoData.Languages.value).toBe('English, Turkish')
    expect(trainingInfoData['Survey Proxy Package Download Date'].value).toBe('2026-01-01')

    expect(ScormSummary.computed.getChartData.call(ctx)).toHaveLength(9)
    expect(ScormSummary.computed.getResendDialogItems.call({ ...ctx, getChartData: [1,2,3,4,5,6,7,8,9] })).toEqual({
      totalUserOpenedCount: 1,
      totalUserClickedCount: 2,
      totalTargetUserCount: 3,
      emailDeliveredUserCount: 4,
      emailErrorUserCount: 5,
      didNotCompleteTrainingCount: 6,
      didNotCompleteExamCount: 7,
      failedExamCount: 8,
      noResponseCount: 9
    })

    expect(ScormSummary.computed.isTestTraining.call(ctx)).toBe(true)
    expect(ScormSummary.computed.getTrainingMaterialRow.call(ctx)).toEqual({
      languages: ['EN', 'TR'],
      trainingId: 'tid',
      trainingName: 'Scorm Name'
    })
  })

  it('ScormSummary methods update modal visibility and fetch template/certificate/languages', async () => {
    const ctx = {
      isAudienceModalVisible: false,
      trainingSummary: {
        trainingEmailNotificationTemplateTypeResourceId: 'tmpl-1',
        certificateAttachmentResourceId: 'cert-1'
      },
      enrollmentEmailData: {},
      certificateEmailData: {},
      getTrainingEmailNotificationTemplateTypeResourceId: 'tmpl-1',
      getCertificateEmailNotificationTemplateTypeResourceId: 'cert-1'
    }

    ScormSummary.methods.showAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(true)
    ScormSummary.methods.hideAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(false)

    ScormSummary.methods.callForEnrollmentEmail.call(ctx)
    ScormSummary.methods.callForCertificate.call(ctx)
    ScormSummary.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(getDefaultEmailTemplate).toHaveBeenCalledWith('tmpl-1')
    expect(AwarenessEducatorService.getCertificateHtml).toHaveBeenCalledWith('cert-1')
    expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
    expect(ctx.enrollmentEmailData).toEqual({ id: 1 })
    expect(ctx.certificateEmailData).toBe('<html />')
  })

  it('ScormSummary getChartData returns empty array when all stats are zero', () => {
    const ctx = {
      trainingSummary: {
        reportDetail: {
          totalUserOpenedCount: 0,
          totalUserClickedCount: 0,
          totalTargetUserCount: 0,
          emailDeliveredUserCount: 0,
          emailErrorUserCount: 0,
          didNotCompleteTrainingCount: 0,
          didNotCompleteExamCount: 0,
          failedExamCount: 0,
          noResponseCount: 0
        }
      }
    }
    expect(ScormSummary.computed.getChartData.call(ctx)).toEqual([])
    expect(ScormSummary.computed.getResendDialogItems.call({ getChartData: [] })).toEqual({})
  })

  it('ScormSummary watchers and lifecycle hooks call expected handlers', () => {
    const callForCertificate = jest.fn()
    const callForEnrollmentEmail = jest.fn()
    const callForLanguages = jest.fn()

    ScormSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.call(
      { callForCertificate },
      'cert-id'
    )
    ScormSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.call(
      { callForEnrollmentEmail },
      'tmpl-id'
    )
    expect(callForCertificate).toHaveBeenCalledTimes(1)
    expect(callForEnrollmentEmail).toHaveBeenCalledTimes(1)

    ScormSummary.created.call({ callForLanguages })
    expect(callForLanguages).toHaveBeenCalledTimes(1)

    const clearSpy = jest.spyOn(global, 'clearInterval').mockImplementation(() => {})
    ScormSummary.beforeDestroy.call({ interval: 123 })
    expect(clearSpy).toHaveBeenCalledWith(123)
    clearSpy.mockRestore()
  })
})
