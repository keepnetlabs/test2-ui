jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificateHtml: jest.fn(),
    getLanguages: jest.fn()
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn()
}))

import TrainingReportSummary from '@/components/ScormProxyReport/Summary/TrainingReportSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportSummary.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed defaults handle missing summary safely', () => {
    expect(TrainingReportSummary.computed.isScormProxy.call({ trainingSummary: null })).toBe(false)
    expect(
      TrainingReportSummary.computed.isFromPhishingCampaign.call({ trainingSummary: null })
    ).toBe(true)
    expect(TrainingReportSummary.computed.isFromUserGroups.call({ trainingSummary: null })).toBe(
      false
    )
  })

  it('getTrainingInfoData maps languageShortCode and survey date key', () => {
    const info = TrainingReportSummary.computed.getTrainingInfoData.call({
      isSurvey: true,
      languages: [{ languageShortCode: 'DE', name: 'German' }],
      trainingSummary: { languages: ['DE'], startDate: '2026-02-01', targetGroupCount: 9 },
      scormTrainingSummary: { totalTargetUser: 3, totalNonTargetUser: 1 }
    })

    expect(info.Languages.value).toBe('German')
    expect(info['Survey Proxy Package Download Date'].value).toBe('2026-02-01')
    expect(info.targetGroupCount.value).toBe(9)
  })

  it('getCardsData returns zero percentages when denominator is zero', () => {
    const cards = TrainingReportSummary.computed.getCardsData.call({
      scormTrainingSummary: {
        totalTargetUser: 0,
        totalNonTargetUser: 0,
        totalInProgress: 2,
        totalCompleteds: 1
      }
    })

    expect(cards.inProgress.userPercent).toBe('0')
    expect(cards.completedTraining.userPercent).toBe('0')
  })

  it('watchers trigger only on truthy values', () => {
    const ctx = {
      callForCertificate: jest.fn(),
      callForEnrollmentEmail: jest.fn()
    }

    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.call(ctx, '')
    TrainingReportSummary.watch.getCertificateEmailNotificationTemplateTypeResourceId.call(
      ctx,
      'cert-id'
    )
    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.call(ctx, null)
    TrainingReportSummary.watch.getTrainingEmailNotificationTemplateTypeResourceId.call(
      ctx,
      'tmpl-id'
    )

    expect(ctx.callForCertificate).toHaveBeenCalledTimes(1)
    expect(ctx.callForEnrollmentEmail).toHaveBeenCalledTimes(1)
  })

  it('callForEnrollmentEmail and callForCertificate are no-op without ids', () => {
    TrainingReportSummary.methods.callForEnrollmentEmail.call({
      getTrainingEmailNotificationTemplateTypeResourceId: ''
    })
    TrainingReportSummary.methods.callForCertificate.call({
      getCertificateEmailNotificationTemplateTypeResourceId: ''
    })

    expect(getDefaultEmailTemplate).not.toHaveBeenCalled()
    expect(AwarenessEducatorService.getCertificateHtml).not.toHaveBeenCalled()
  })

  it('callForEnrollmentEmail and callForCertificate set fetched data', async () => {
    getDefaultEmailTemplate.mockResolvedValueOnce({
      data: { data: { template: { id: 'tmpl' } } }
    })
    AwarenessEducatorService.getCertificateHtml.mockResolvedValueOnce({
      data: { data: '<html>cert</html>' }
    })

    const ctx = {
      getTrainingEmailNotificationTemplateTypeResourceId: 'tmpl-id',
      getCertificateEmailNotificationTemplateTypeResourceId: 'cert-id',
      enrollmentEmailData: null,
      certificateEmailData: null
    }

    TrainingReportSummary.methods.callForEnrollmentEmail.call(ctx)
    TrainingReportSummary.methods.callForCertificate.call(ctx)
    await flushPromises()

    expect(getDefaultEmailTemplate).toHaveBeenCalledWith('tmpl-id')
    expect(AwarenessEducatorService.getCertificateHtml).toHaveBeenCalledWith('cert-id')
    expect(ctx.enrollmentEmailData).toEqual({ id: 'tmpl' })
    expect(ctx.certificateEmailData).toBe('<html>cert</html>')
  })

  it('callForLanguages writes language list and modal toggles work', async () => {
    AwarenessEducatorService.getLanguages.mockResolvedValueOnce({
      data: { data: [{ code: 'EN', name: 'English' }] }
    })
    const ctx = {
      languages: [],
      isAudienceModalVisible: false
    }

    TrainingReportSummary.methods.callForLanguages.call(ctx)
    TrainingReportSummary.methods.showAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(true)
    TrainingReportSummary.methods.hideAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(false)

    await flushPromises()
    expect(ctx.languages).toEqual([{ code: 'EN', name: 'English' }])
  })

  it('beforeDestroy clears active interval handle', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const handle = 99

    TrainingReportSummary.beforeDestroy.call({ interval: handle })
    expect(clearIntervalSpy).toHaveBeenCalledWith(handle)

    clearIntervalSpy.mockRestore()
  })
})
