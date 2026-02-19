jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    resendTrainingToUsers: jest.fn(() => Promise.resolve()),
    exportTrainingReport: jest.fn(() => Promise.resolve({ status: 200, data: 'blob-data' }))
  }
}))

import TrainingReportSummaryHeader from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryHeader.vue'
import TrainingReportSummaryResendDialog from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryResendDialog.vue'
import TrainingReportSummaryTrainingInfo from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryTrainingInfo.vue'
import TrainingReportTrainingMaterial from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingMaterial.vue'
import TrainingReportSummaryCards from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCards.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReport summary advanced coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('SummaryHeader computed values map by type and survey', () => {
    expect(
      TrainingReportSummaryHeader.computed.getTitle.call({
        isSurvey: true,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
      })
    ).toContain('Survey')

    expect(
      TrainingReportSummaryHeader.computed.isLearningPath.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)

    expect(
      TrainingReportSummaryHeader.computed.getResendButtonText.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toContain('Infographic')

    expect(
      TrainingReportSummaryHeader.computed.getSubtitle.call({
        isSurvey: false,
        trainingType: 'unknown'
      })
    ).toContain('training')
  })

  it('SummaryHeader toggles resend dialog and handles resend confirm', async () => {
    const ctx = {
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      id: 'tr-1',
      toggleShowResendDialog: TrainingReportSummaryHeader.methods.toggleShowResendDialog
    }

    TrainingReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)

    TrainingReportSummaryHeader.methods.handleOnConfirmResend.call(ctx, [1, 2])
    expect(ctx.isActionButtonDisabled).toBe(true)
    expect(AwarenessEducatorService.resendTrainingToUsers).toHaveBeenCalledWith(
      { resendTypes: [1, 2] },
      'tr-1'
    )

    await flushPromises()
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('SummaryHeader handles download report for statuses 200/201/202', async () => {
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    if (!window.URL.createObjectURL) window.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:training')

    const dispatch = jest.fn()
    const ctx = {
      id: 't-1',
      isSurvey: true,
      isDownloadReportDisabled: false,
      $store: { dispatch }
    }

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 200, data: 'x' })
    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()
    expect(link.click).toHaveBeenCalledTimes(1)
    expect(link.download).toBe('Survey-Material.xlsx')

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 201, data: 'x' })
    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 202, data: 'x' })
    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(ctx.isDownloadReportDisabled).toBe(false)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('SummaryResendDialog computed helpers and emitters work', () => {
    expect(
      TrainingReportSummaryResendDialog.computed.getTypeText.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBe('poster')

    expect(
      TrainingReportSummaryResendDialog.computed.getOnlyOpenedLabel.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toBe('infographic')

    expect(
      TrainingReportSummaryResendDialog.computed.getActionButtonDisabled.call({
        isActionButtonDisabled: false,
        types: []
      })
    ).toBe(true)

    expect(
      TrainingReportSummaryResendDialog.computed.isTrainingTypeTraining.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
      })
    ).toBe(true)

    const emit = jest.fn()
    TrainingReportSummaryResendDialog.methods.closeModal.call({ $emit: emit })
    TrainingReportSummaryResendDialog.methods.handleConfirm.call({ $emit: emit, types: [1] })
    expect(emit).toHaveBeenCalledWith('on-close')
    expect(emit).toHaveBeenCalledWith('on-confirm', [1])
  })

  it('SummaryTrainingInfo computed and modal toggle methods work', () => {
    const items = {
      'Target Users': { show: true, value: 1 },
      'Target Groups': { show: true, value: [{ id: 1 }, { id: 2 }] },
      Hidden: { show: false, value: 'x' },
      targetGroupCount: { value: 3 }
    }

    expect(
      TrainingReportSummaryTrainingInfo.computed.getCardTitle.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toContain('Learning Path')

    expect(
      TrainingReportSummaryTrainingInfo.computed.getItems.call({ items })
    ).toEqual({
      'Target Users': 1,
      'Target Groups': [{ id: 1 }, { id: 2 }]
    })

    expect(
      TrainingReportSummaryTrainingInfo.computed.getBodyValue.call({ items })
    ).toBe('1 user')
    expect(
      TrainingReportSummaryTrainingInfo.computed.getAudienceText.call({
        type: 'phishingCampaign',
        isFromUserGroups: false,
        isFromPhishingCampaign: true,
        items
      })
    ).toContain('phishing campaign')

    const ctx = { isTargetGroupsModalVisible: false, $emit: jest.fn() }
    TrainingReportSummaryTrainingInfo.methods.handleViewTargetGroupsClick.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(true)
    TrainingReportSummaryTrainingInfo.methods.handleCloseTargetGroupsModal.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(false)
    TrainingReportSummaryTrainingInfo.methods.handleAudienceClick.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('audienceClick')
  })

  it('TrainingMaterial chooses card title, preview route and badge helpers', () => {
    const commit = jest.fn()
    const ctx = {
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
      selectedRow: { id: 1 },
      isSurvey: false,
      formData: { name: 'My Material' },
      $store: { commit },
      resetAllModals: jest.fn()
    }

    expect(TrainingReportTrainingMaterial.computed.getCardIcon.call(ctx)).toBe('mdi-book-education')
    expect(TrainingReportTrainingMaterial.computed.getCardTitle.call(ctx)).toBe('Poster: My Material')
    expect(TrainingReportTrainingMaterial.computed.isFormData.call(ctx)).toBe(1)

    TrainingReportTrainingMaterial.methods.handlePreviewClick.call(ctx)
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 1 },
      onlyPreview: true
    })

    expect(TrainingReportTrainingMaterial.methods.getBadgeColor('hard')).toBe('#f56c6c')
    expect(TrainingReportTrainingMaterial.methods.getBadgeText('Any')).toBe('Any')

    TrainingReportTrainingMaterial.beforeDestroy.call(ctx)
    expect(ctx.resetAllModals).toHaveBeenCalled()
  })

  it('SummaryCards computed flags and item accessors work', () => {
    const items = {
      openedEmail: { userCount: 10 },
      inProgress: { userCount: 5 },
      completedTraining: { userCount: 3 },
      noResponse: { userCount: 2 }
    }

    const ctx = {
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
      items
    }

    expect(TrainingReportSummaryCards.computed.isTrainingTypePosterOrInfographic.call(ctx)).toBe(true)
    expect(TrainingReportSummaryCards.computed.isTrainingTypeLearningPath.call(ctx)).toBe(false)
    expect(TrainingReportSummaryCards.computed.getOpenedData.call(ctx)).toEqual({ userCount: 10 })
    expect(TrainingReportSummaryCards.computed.getDownloadedData.call(ctx)).toEqual({ userCount: 3 })

    expect(
      TrainingReportSummaryCards.computed.isTrainingTypeLearningPath.call({
        trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH
      })
    ).toBe(true)
  })
})
