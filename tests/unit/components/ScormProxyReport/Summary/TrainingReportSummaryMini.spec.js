jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportTrainingReport: jest.fn()
  }
}))

import ScormHeader from '@/components/ScormProxyReport/Summary/TrainingReportSummaryHeader.vue'
import ScormTrainingMaterial from '@/components/ScormProxyReport/Summary/TrainingReportTrainingMaterial.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm summary additional coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ScormHeader handles export status 201 and 202 snackbar flow', async () => {
    const dispatch = jest.fn()
    const ctx = {
      id: 's1',
      isSurvey: true,
      isDownloadReportDisabled: false,
      $store: { dispatch }
    }

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 201, data: 'x' })
    ScormHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    AwarenessEducatorService.exportTrainingReport.mockResolvedValueOnce({ status: 202, data: 'x' })
    ScormHeader.methods.handleDownloadReport.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[0][0]).toBe('common/createSnackBar')
    expect(dispatch.mock.calls[0][1].message).toContain('Survey report will be generated')
    expect(dispatch.mock.calls[1][1].message).toContain('Survey report is being generated')
    expect(ctx.isDownloadReportDisabled).toBe(false)
  })

  it('ScormTrainingMaterial computes title/form state and commits preview dialog', () => {
    const commit = jest.fn()
    const surveyCtx = {
      isSurvey: true,
      formData: { name: 'Scorm Survey' },
      selectedRow: { id: 11 },
      $store: { commit }
    }
    const trainingCtx = {
      isSurvey: false,
      formData: { name: 'Scorm Training' },
      selectedRow: { id: 12 },
      $store: { commit }
    }

    expect(ScormTrainingMaterial.computed.getCardTitle.call(surveyCtx)).toBe('Survey: Scorm Survey')
    expect(ScormTrainingMaterial.computed.getCardTitle.call(trainingCtx)).toBe(
      'Training: Scorm Training'
    )
    expect(ScormTrainingMaterial.computed.isFormData.call({ formData: {} })).toBe(0)
    expect(ScormTrainingMaterial.computed.isFormData.call(trainingCtx)).toBe(1)

    ScormTrainingMaterial.methods.handlePreviewClick.call(surveyCtx)
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 11 }
    })

    ScormTrainingMaterial.methods.handlePreviewClick.call(trainingCtx)
    expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
      status: true,
      selectedRow: { id: 12 },
      showSendButton: true,
      type: TRAINING_LIBRARY_TYPES.TRAINING,
      onlyPreview: true
    })

    expect(ScormTrainingMaterial.methods.getBadgeColor('easy')).toBe('#217124')
    expect(ScormTrainingMaterial.methods.getBadgeColor('medium')).toBe('#2196f3')
    expect(ScormTrainingMaterial.methods.getBadgeColor('hard')).toBe('#f56c6c')
    expect(ScormTrainingMaterial.methods.getBadgeColor('other')).toBe('#2196f3')
    expect(ScormTrainingMaterial.methods.getBadgeText('Any')).toBe('Any')
  })
})
