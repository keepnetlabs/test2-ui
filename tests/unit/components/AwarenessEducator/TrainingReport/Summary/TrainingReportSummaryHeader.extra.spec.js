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

  it('isLearningPath computed is true for learning path types', () => {
    expect(
      TrainingReportSummaryHeader.computed.isLearningPath.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
  })
})
