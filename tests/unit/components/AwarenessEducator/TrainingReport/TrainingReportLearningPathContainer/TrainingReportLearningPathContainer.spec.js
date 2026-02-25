jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportSummary: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            trainingDetails: { hasQuiz: false },
            deliveryMethod: 'Email'
          }
        }
      })
    )
  }
}))

import TrainingReportLearningPathContainer from '@/components/AwarenessEducator/TrainingReport/TrainingReportLearningPathContainer/TrainingReportLearningPathContainer.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportLearningPathContainer.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportLearningPathContainer.name).toBe('TrainingReportLearningPathContainer')
  })

  it('activeTrainingStep and id are derived from steps and activeStep', () => {
    const ctx = {
      trainingSummary: { steps: [{ enrollmentId: 'e1' }, { enrollmentId: 'e2' }] },
      activeStep: 1
    }
    const active = TrainingReportLearningPathContainer.computed.activeTrainingStep.call(ctx)
    expect(active.enrollmentId).toBe('e2')
    expect(
      TrainingReportLearningPathContainer.computed.id.call({
        activeTrainingStep: active
      })
    ).toBe('e2')
  })

  it('callForSummary returns early when id is missing', async () => {
    const ctx = {
      isLoading: false,
      id: null,
      activeTrainingStepType: null
    }
    TrainingReportLearningPathContainer.methods.callForSummary.call(ctx)
    expect(ctx.isLoading).toBe(false)
    expect(AwarenessEducatorService.getTrainingReportSummary).not.toHaveBeenCalled()
  })

  it('callForSummary sets selectedTrainingSummary and loading state', async () => {
    const ctx = {
      isLoading: false,
      id: 'e1',
      activeTrainingStepType: 'Training',
      selectedTrainingSummary: null,
      tabItems: [{ label: 'Summary' }, { label: 'Users' }, { label: 'Opened' }, { label: 'Clicked' }]
    }
    TrainingReportLearningPathContainer.methods.callForSummary.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.getTrainingReportSummary).toHaveBeenCalled()
    expect(ctx.selectedTrainingSummary).toBeTruthy()
    expect(ctx.isLoading).toBe(false)
  })

  it('handleTabClick fetches summary only for Summary tab', async () => {
    const ctx = {
      id: 'e1',
      $route: { query: {} },
      trainingSummary: {},
      tabItems: []
    }
    await TrainingReportLearningPathContainer.methods.handleTabClick.call(ctx, { name: 'Summary' })
    expect(AwarenessEducatorService.getTrainingReportSummary).toHaveBeenCalled()
  })
})
