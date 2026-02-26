jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    resendTrainingToUsers: jest.fn(() => Promise.resolve()),
    exportTrainingReport: jest.fn()
  }
}))

import TrainingReportSummaryHeader from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryHeader.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportSummaryHeader.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles download statuses 201 and 202 with snackbar dispatch', async () => {
    const dispatch = jest.fn()
    const ctx = {
      id: 'tr-99',
      isSurvey: false,
      isDownloadReportDisabled: false,
      $store: { dispatch }
    }

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 201, data: 'x' })
    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 202, data: 'x' })
    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[0][0]).toBe('common/createSnackBar')
    expect(dispatch.mock.calls[0][1].message).toBe('Training report will be generated')
    expect(dispatch.mock.calls[1][1].message).toBe('Training report is being generated')
    expect(ctx.isDownloadReportDisabled).toBe(false)
  })

  it('resend confirm toggles loading and closes dialog', async () => {
    const ctx = {
      id: 'tr-100',
      isActionButtonDisabled: false,
      isShowResendDialog: true,
      toggleShowResendDialog: TrainingReportSummaryHeader.methods.toggleShowResendDialog
    }

    TrainingReportSummaryHeader.methods.handleOnConfirmResend.call(ctx, [1, 4])
    expect(ctx.isActionButtonDisabled).toBe(true)
    expect(AwarenessEducatorService.resendTrainingToUsers).toHaveBeenCalledWith(
      { resendTypes: [1, 4] },
      'tr-100'
    )

    await flushPromises()
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('resend confirm closes dialog and resets loading via finally callback', async () => {
    AwarenessEducatorService.resendTrainingToUsers.mockImplementationOnce(() => ({
      finally: (cb) => {
        cb()
        return Promise.resolve()
      }
    }))
    const ctx = {
      id: 'tr-101',
      isActionButtonDisabled: false,
      isShowResendDialog: true,
      toggleShowResendDialog: TrainingReportSummaryHeader.methods.toggleShowResendDialog
    }

    TrainingReportSummaryHeader.methods.handleOnConfirmResend.call(ctx, [2])
    expect(AwarenessEducatorService.resendTrainingToUsers).toHaveBeenCalledWith(
      { resendTypes: [2] },
      'tr-101'
    )
    await flushPromises()
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('getTitle and getSubtitle return correct values for all training types', () => {
    const { computed } = TrainingReportSummaryHeader
    expect(computed.getTitle.call({ isSurvey: true })).toContain('Survey')
    expect(computed.getTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER })).toContain('Poster')
    expect(computed.getTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC })).toContain('Infographic')
    expect(computed.getTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH })).toContain('Learning')
    expect(computed.getTitle.call({ isSurvey: false, trainingType: 'other' })).toContain('Training')

    expect(computed.getSubtitle.call({ isSurvey: true })).toBeDefined()
    expect(computed.getSubtitle.call({ isSurvey: false, trainingType: 'other' })).toBeDefined()
  })

  it('getResendButtonText returns correct label for each type', () => {
    const { computed } = TrainingReportSummaryHeader
    expect(computed.getResendButtonText.call({ isSurvey: true })).toBeDefined()
    expect(
      computed.getResendButtonText.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBeDefined()
    expect(
      computed.getResendButtonText.call({
        isSurvey: false,
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toBeDefined()
    expect(computed.getResendButtonText.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH })).toBeDefined()
    expect(computed.getResendButtonText.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH })).toBeDefined()
    expect(computed.getResendButtonText.call({ isSurvey: false, trainingType: 'other' })).toBeDefined()
  })

  it('handleDownloadReport status 200 triggers blob download', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: '',
      click: jest.fn()
    }))

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({
      status: 200,
      data: Buffer.from('xlsx')
    })

    const ctx = {
      id: 'tr-1',
      isSurvey: false,
      isDownloadReportDisabled: false
    }

    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    expect(createElementSpy).toHaveBeenCalledWith('a')
    createElementSpy.mockRestore()
  })

  it('handleDownloadReport uses Survey file name when isSurvey is true', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const anchor = { href: '', download: '', click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => anchor)

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({
      status: 200,
      data: Buffer.from('xlsx')
    })

    const ctx = {
      id: 'tr-survey',
      isSurvey: true,
      isDownloadReportDisabled: false
    }

    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()
    expect(anchor.download).toBe('Survey-Material.xlsx')
    createElementSpy.mockRestore()
  })

  it('handleDownloadReport for unknown status does not dispatch snackbar', async () => {
    const dispatch = jest.fn()
    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({
      status: 204,
      data: null
    })
    const ctx = {
      id: 'tr-204',
      isSurvey: false,
      isDownloadReportDisabled: false,
      $store: { dispatch }
    }

    TrainingReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()
    expect(dispatch).not.toHaveBeenCalled()
    expect(ctx.isDownloadReportDisabled).toBe(false)
  })

  it('isLearningPath computed is true for learning path types', () => {
    expect(
      TrainingReportSummaryHeader.computed.isLearningPath.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
  })

  it('isLearningPath computed is false for non-learning path types', () => {
    expect(
      TrainingReportSummaryHeader.computed.isLearningPath.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBe(false)
  })

  it('toggleShowResendDialog toggles both directions', () => {
    const ctx = { isShowResendDialog: false }
    TrainingReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
  })
})
