jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificateHtml: jest.fn(),
    resendCertificateToUserList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn()
}))

import TrainingReportSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportSummary.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes survey/type flags and summary card values', () => {
    const ctx = {
      isSurvey: false,
      trainingSummary: {
        trainingDetails: { hasQuiz: true, id: 't1', name: 'Awareness 1' },
        trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
        smsSummary: { sentCount: 3 },
        reportDetail: {
          totalTargetUserCount: 10,
          onlyOpenedCount: 2,
          totalUserClickedCount: 3,
          emailDeliveredUserCount: 8,
          emailErrorUserCount: 2,
          didNotCompleteTrainingCount: 4,
          didNotCompleteExamCount: 1,
          failedExamCount: 1,
          noResponseCount: 2,
          totalUserOpenedCount: 6
        },
        completedCount: 5,
        inProgressCount: 3,
        isScormProxy: true,
        isFromPhishingCampaign: false,
        isFromUserGroups: true,
        phishingCampaign: { name: 'Campaign A' },
        userGroups: { count: 2 },
        groupCount: 2,
        isTest: true,
        reminderDescription: 'Daily',
        startDate: '2026-01-01',
        deliveryMethod: 'Email',
        languages: ['EN', 'TR'],
        autoEnrollDescription: 'No',
        targetGroupNames: ['Sales', 'IT'],
        sendTemplatesInPreferredLanguage: true,
        targetGroupCount: 2,
        trainingEmailNotificationTemplateTypeResourceId: 'tmpl-1',
        certificateAttachmentResourceId: 'cert-1'
      },
      languages: [
        { code: 'EN', isoFriendlyName: 'English' },
        { shortCode: 'TR', name: 'Turkish' }
      ]
    }

    expect(TrainingReportSummary.computed.getIsSurvey.call(ctx)).toBe(true)
    expect(TrainingReportSummary.computed.isTrainingTypeLearningPath.call({ getTrainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH })).toBe(true)
    expect(TrainingReportSummary.computed.isSMSSummaryExist.call(ctx)).toBe(true)
    expect(TrainingReportSummary.computed.isScormProxy.call(ctx)).toBe(true)
    expect(TrainingReportSummary.computed.getAudienceDetailsType.call(ctx)).toBe('userGroups')
    expect(TrainingReportSummary.computed.getTrainingType.call(ctx)).toBe(TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
    expect(TrainingReportSummary.computed.getPhishingCampaign.call(ctx)).toEqual({ name: 'Campaign A' })
    expect(TrainingReportSummary.computed.getUserGroups.call(ctx)).toEqual({ count: 2 })

    expect(TrainingReportSummary.computed.getSMSSummaryData.call(ctx)).toEqual({
      'Sender Phone Number': { show: true, value: undefined },
      'SMS Text': { show: true, value: undefined },
      'Delivery Status': { show: true, value: '' }
    })
    expect(TrainingReportSummary.computed.getSMSSummaryHelperData.call(ctx)).toEqual({ sentCount: 3 })

    const trainingInfoData = TrainingReportSummary.computed.getTrainingInfoData.call(ctx)
    expect(trainingInfoData['Target Users'].value).toBe(10)
    expect(trainingInfoData.Languages.value).toBe('English, Turkish')
    expect(trainingInfoData['Preferred Language'].value).toBe("User's Preferred Language")

    expect(TrainingReportSummary.computed.getTrainingInfoHelperData.call(ctx)).toEqual({ groupCount: 2 })
    expect(TrainingReportSummary.computed.isTestTraining.call(ctx)).toBe(true)
    expect(TrainingReportSummary.computed.getTotalUsers.call(ctx)).toBe(10)

    const deliveryData = TrainingReportSummary.computed.getTrainingDeliveryData.call({
      ...ctx,
      isTrainingTypeLearningPath: true
    })
    expect(deliveryData['Delivery Method'].value).toBe('Email')
    expect(deliveryData['Delivery Start'].value).toBe('2026-01-01')
    expect(deliveryData['Delivery Status']).toBeUndefined()

    const deliveryData2 = TrainingReportSummary.computed.getTrainingDeliveryData.call({
      ...ctx,
      isTrainingTypeLearningPath: false
    })
    expect(deliveryData2['Start Date'].value).toBe('2026-01-01')
    expect(deliveryData2['Delivery Status'].show).toBe(true)

    expect(TrainingReportSummary.computed.getChartData.call(ctx)).toHaveLength(9)
    expect(TrainingReportSummary.computed.getResendDialogItems.call({ ...ctx, getChartData: [2,3,10,8,2,4,1,1,2] })).toEqual({
      onlyOpenedCount: 2,
      totalUserClickedCount: 3,
      totalTargetUserCount: 10,
      emailDeliveredUserCount: 8,
      emailErrorUserCount: 2,
      didNotCompleteTrainingCount: 4,
      didNotCompleteExamCount: 1,
      failedExamCount: 1,
      noResponseCount: 2
    })

    const cardsData = TrainingReportSummary.computed.getCardsData.call(ctx)
    expect(cardsData.openedEmail.userCount).toBe(6)
    expect(cardsData.completedTraining.userCount).toBe(5)
    expect(cardsData.noResponse.userCount).toBe(2)

    expect(TrainingReportSummary.computed.getTrainingEmailNotificationTemplateTypeResourceId.call(ctx)).toBe('tmpl-1')
    expect(TrainingReportSummary.computed.getCertificateEmailNotificationTemplateTypeResourceId.call(ctx)).toBe('cert-1')

    expect(TrainingReportSummary.computed.getTrainingMaterialRow.call(ctx)).toEqual({
      languages: ['EN', 'TR'],
      trainingId: 't1',
      trainingName: 'Awareness 1'
    })
  })

  it('returns empty chart/resend data when all report stats are zero', () => {
    const ctx = {
      trainingSummary: {
        reportDetail: {
          onlyOpenedCount: 0,
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

    expect(TrainingReportSummary.computed.getChartData.call(ctx)).toEqual([])
    expect(TrainingReportSummary.computed.getResendDialogItems.call({ getChartData: [] })).toEqual({})
  })

  it('enrollment template API response is normalized and logo placeholders replaced', async () => {
    getDefaultEmailTemplate.mockResolvedValueOnce({
      data: {
        data: {
          template: {
            template: '<img src="{COMPANYLOGO}" />',
            languageTypeResourceId: 'en',
            languageTypeName: 'English',
            languages: [{ languageTypeResourceId: 'tr', languageTypeName: 'Turkish', template: '<img src="{COMPANYLOGO}" /> TR' }],
            subject: 'Sub',
            fromName: 'From',
            fromAddress: 'from@x.com',
            ccAddresses: ['cc@x.com']
          }
        }
      }
    })

    const ctx = {
      getTrainingEmailNotificationTemplateTypeResourceId: 'tmpl-22',
      $store: { state: { whitelabel: { emailTemplateLogoUrl: 'https://logo.png' } } },
      enrollmentEmailData: {}
    }

    TrainingReportSummary.methods.callForEnrollmentEmail.call(ctx)
    await flushPromises()

    expect(getDefaultEmailTemplate).toHaveBeenCalledWith('tmpl-22')
    expect(ctx.enrollmentEmailData.template).toContain('https://logo.png')
    expect(ctx.enrollmentEmailData.languages[0].languageTypeResourceId).toBe('en')
    expect(ctx.enrollmentEmailData.selectedLanguageResourceId).toBe('en')
    expect(ctx.enrollmentEmailData.ccAddresses).toEqual(['cc@x.com'])
  })

  it('certificate template API response is normalized and logo placeholders replaced', async () => {
    AwarenessEducatorService.getCertificateHtml.mockResolvedValueOnce({
      data: {
        data: {
          template: '<img src="{COMPANYLOGO}" />',
          languageTypeResourceId: 'en',
          languageTypeName: 'English',
          languages: [{ languageTypeResourceId: 'tr', languageTypeName: 'Turkish', template: '<img src="{COMPANYLOGO}" /> TR' }],
          subject: 'Sub',
          fromName: 'From',
          fromAddress: 'from@x.com',
          ccAddresses: ['cc@x.com']
        }
      }
    })

    const ctx = {
      getCertificateEmailNotificationTemplateTypeResourceId: 'cert-22',
      $store: { state: { whitelabel: { emailTemplateLogoUrl: 'https://logo.png' } } },
      certificateEmailData: {}
    }

    TrainingReportSummary.methods.callForCertificate.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getCertificateHtml).toHaveBeenCalledWith('cert-22')
    expect(ctx.certificateEmailData.template).toContain('https://logo.png')
    expect(ctx.certificateEmailData.languages[0].languageTypeResourceId).toBe('en')
    expect(ctx.certificateEmailData.selectedLanguageResourceId).toBe('en')
    expect(ctx.certificateEmailData.ccAddresses).toEqual(['cc@x.com'])
  })

  it('modal/resend handlers update state and call API with normalized payload', async () => {
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      awardCertificateEnrollmentId: 'enroll-1',
      resendPayload: {
        selectedItems: ['u1', 'u2'],
        excludedItems: [],
        selectAll: false,
        filter: {}
      },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      selectedRow: { id: 1 },
      toggleIsShowResendDialog: TrainingReportSummary.methods.toggleIsShowResendDialog,
      $refs: {
        refCertificateTable: {
          $refs: { refTable: { resetSelectableParams } },
          callForData
        }
      }
    }

    TrainingReportSummary.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u11' }, { targetUserResourceId: 'u12' }],
      ['u99'],
      true,
      { x: 1 }
    )
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u11', 'u12'],
      excludedItems: ['u99'],
      selectAll: true,
      filter: { x: 1 }
    })
    expect(ctx.isShowResendDialog).toBe(false)

    TrainingReportSummary.methods.handleSelectionChange.call(ctx, 8)
    expect(ctx.resendItemCount).toBe(8)

    TrainingReportSummary.methods.showAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(true)
    TrainingReportSummary.methods.hideAudienceDetailsModal.call(ctx)
    expect(ctx.isAudienceModalVisible).toBe(false)

    AwarenessEducatorService.resendCertificateToUserList.mockResolvedValueOnce({})
    TrainingReportSummary.methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendCertificateToUserList).toHaveBeenCalledWith([
      { targetUserResourceId: 'u11', enrollmentId: 'enroll-1' },
      { targetUserResourceId: 'u12', enrollmentId: 'enroll-1' }
    ])
    expect(resetSelectableParams).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('computed enrollment/certificate/training material data is built from normalized state', () => {
    const ctx = {
      trainingSummary: {
        trainingDetails: {
          companyName: 'Keepnet',
          description: 'Training desc',
          name: 'Training X',
          category: 'Cat1'
        },
        languages: ['EN']
      },
      enrollmentEmailData: {
        name: 'Enrollment Tpl',
        description: 'Email desc',
        template: 'tpl',
        languages: ['EN'],
        selectedLanguageResourceId: 'en',
        selectedLanguageName: 'English',
        subject: 'Subj',
        fromName: 'From',
        fromAddress: 'from@x.com',
        ccAddresses: ['cc@x.com']
      },
      certificateEmailData: {
        name: 'Cert Tpl',
        companyName: 'Keepnet',
        description: 'Cert desc',
        template: 'certTpl',
        languages: ['EN'],
        selectedLanguageResourceId: 'en',
        selectedLanguageName: 'English',
        subject: 'Subj2',
        fromName: 'From2',
        fromAddress: 'from2@x.com',
        ccAddresses: ['cc2@x.com']
      }
    }

    expect(TrainingReportSummary.computed.getEnrollmentTemplateData.call(ctx)).toEqual({
      name: 'Enrollment Tpl',
      createdBy: 'Keepnet',
      description: 'Email desc',
      template: 'tpl',
      languages: ['EN'],
      selectedLanguageResourceId: 'en',
      selectedLanguageName: 'English',
      subject: 'Subj',
      fromName: 'From',
      fromAddress: 'from@x.com',
      ccAddresses: ['cc@x.com']
    })

    expect(TrainingReportSummary.computed.getCertificateData.call(ctx)).toEqual({
      name: 'Cert Tpl',
      createdBy: 'Keepnet',
      description: 'Cert desc',
      template: 'certTpl',
      languages: ['EN'],
      selectedLanguageResourceId: 'en',
      selectedLanguageName: 'English',
      subject: 'Subj2',
      fromName: 'From2',
      fromAddress: 'from2@x.com',
      ccAddresses: ['cc2@x.com']
    })

    expect(TrainingReportSummary.computed.getTrainingMaterialData.call(ctx)).toEqual({
      name: 'Training X',
      createdBy: 'Keepnet',
      category: 'Cat1',
      description: 'Training desc',
      languages: ['EN']
    })
  })
})
