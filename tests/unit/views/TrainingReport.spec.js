import TrainingReport from '@/views/TrainingReport.vue'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportSummary: jest.fn(),
    getTrainingReportFormDetails: jest.fn()
  }
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn()
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReport.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name and default tab', () => {
    expect(TrainingReport.name).toBe('TrainingReport')
    expect(TrainingReport.data().tab).toBe(labels.Summary)
  })

  it('computed values resolve id, training name fallback and flags', () => {
    expect(TrainingReport.computed.id.call({ $route: { params: { id: 'train-1' } } })).toBe('train-1')

    expect(
      TrainingReport.computed.getTrainingName.call({
        $store: { state: { common: { activePageRouterName: 'Training X' } } }
      })
    ).toBe('Training X')

    expect(TrainingReport.computed.getTrainingName.call({ $store: {} })).toBe('Training Name')

    expect(TrainingReport.computed.isScormProxy.call({ trainingSummary: null })).toBe(false)
    expect(TrainingReport.computed.isScormProxy.call({ trainingSummary: { isScormProxy: true } })).toBe(true)

    expect(TrainingReport.computed.isSurvey.call({ trainingSummary: null })).toBeUndefined()
    expect(
      TrainingReport.computed.isSurvey.call({ trainingSummary: { trainingDetails: { hasQuiz: true } } })
    ).toBe(true)
  })

  it('created triggers initial loaders', () => {
    const ctx = {
      callForCustomFields: jest.fn(),
      callForFormDetails: jest.fn(),
      callForSummary: jest.fn(),
      callForLanguages: jest.fn()
    }

    TrainingReport.created.call(ctx)

    expect(ctx.callForCustomFields).toHaveBeenCalledTimes(1)
    expect(ctx.callForFormDetails).toHaveBeenCalledTimes(1)
    expect(ctx.callForSummary).toHaveBeenCalledTimes(1)
    expect(ctx.callForLanguages).toHaveBeenCalledTimes(1)
  })

  it('callForCustomFields and callForFormDetails set response payloads', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({ data: { data: [{ field: 'f1' }] } })
    AwarenessEducatorService.getTrainingReportFormDetails.mockResolvedValueOnce({
      data: { data: { timezone: 'UTC' } }
    })

    const ctx = {
      customFields: [],
      formDetails: null
    }

    await TrainingReport.methods.callForCustomFields.call(ctx)
    await TrainingReport.methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(ctx.customFields).toEqual([{ field: 'f1' }])
    expect(ctx.formDetails).toEqual({ timezone: 'UTC' })
  })

  it('callForSummary maps survey flow and dispatches summary metadata', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Survey Training',
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY,
          deliveryMethod: ['Microsoft Teams'],
          trainingDetails: { hasQuiz: true }
        }
      }
    })

    const dispatch = jest.fn()
    const ctx = {
      ...TrainingReport.data(),
      id: 't-1',
      $route: { query: { trainingType: 7 } },
      $store: { dispatch }
    }

    await TrainingReport.methods.callForSummary.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportSummary).toHaveBeenCalledWith('t-1', 7)
    expect(ctx.tabItems[2].label).toBe(labels.OpenededSurvey)
    expect(ctx.tabItems[3].label).toBe(labels.ClickedSurveyLink)
    expect(ctx.tabItems.find((x) => x.name === labels.ExamResults)).toBeUndefined()
    expect(ctx.isMicrosoftTeams).toBe(true)
    expect(dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Survey Training')
    expect(dispatch).toHaveBeenCalledWith(
      'common/setActiveTrainingType',
      TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY
    )
    expect(ctx.isLoading).toBe(false)
  })

  it('callForSummary maps poster and infographic flows', async () => {
    const dispatch = jest.fn()
    const posterCtx = {
      ...TrainingReport.data(),
      id: 'poster-id',
      $route: { query: {} },
      $store: { dispatch }
    }

    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Poster Training',
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
          trainingDetails: { hasQuiz: false }
        }
      }
    })

    await TrainingReport.methods.callForSummary.call(posterCtx)
    await flushPromises()
    expect(posterCtx.tabItems[2].label).toBe(labels.OpenedPosterEmail)
    expect(posterCtx.tabItems[3].label).toBe(labels.DownloadedPoster)
    expect(posterCtx.tabItems.find((x) => x.name === labels.Progress)).toBeUndefined()

    const infographicCtx = {
      ...TrainingReport.data(),
      id: 'info-id',
      $route: { query: {} },
      $store: { dispatch }
    }

    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Info Training',
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
          trainingDetails: { hasQuiz: false }
        }
      }
    })

    await TrainingReport.methods.callForSummary.call(infographicCtx)
    await flushPromises()
    expect(infographicCtx.tabItems[2].label).toBe(labels.OpenedInfographicEmail)
    expect(infographicCtx.tabItems[3].label).toBe(labels.DownloadedInfographic)
  })

  it('callForSummary builds learning path tabs and tracks award certificate enrollment', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'LP Training',
          trainingTypeName: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
          trainingDetails: { hasQuiz: false },
          steps: [
            { trainingName: 'Step B', stepNumber: 2, awardCertificate: true, enrollmentId: 'e2' },
            { trainingName: 'Step A', stepNumber: 1, awardCertificate: false, enrollmentId: 'e1' }
          ]
        }
      }
    })

    const dispatch = jest.fn()
    const ctx = {
      ...TrainingReport.data(),
      id: 'lp-id',
      $route: { query: {} },
      $store: { dispatch }
    }

    await TrainingReport.methods.callForSummary.call(ctx)
    await flushPromises()

    expect(ctx.tabItems[0].label).toBe(labels.LearningPathSummary)
    expect(ctx.tabItems[1].label).toContain('Step 1: Step A')
    expect(ctx.tabItems[2].label).toContain('Step 2: Step B')
    expect(ctx.awardCertificateEnrollmentId).toBe('e2')
  })

  it('callForSummary handles learning path without steps and non-survey active type', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'LP Empty',
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
          trainingDetails: { hasQuiz: false },
          steps: null
        }
      }
    })

    const dispatch = jest.fn()
    const ctx = {
      ...TrainingReport.data(),
      id: 'lp-empty-id',
      $route: { query: {} },
      $store: { dispatch }
    }

    await TrainingReport.methods.callForSummary.call(ctx)
    await flushPromises()

    expect(ctx.tabItems).toHaveLength(1)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setActiveTrainingType',
      TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
    )
  })

  it('handleTabClick refreshes summary only on Summary tab', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValue({
      data: { data: { name: 'Reloaded' } }
    })

    const ctx = {
      id: 'tab-id',
      trainingSummary: null,
      $route: { query: { trainingType: 9 } }
    }

    await TrainingReport.methods.handleTabClick.call(ctx, { name: labels.Summary })
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportSummary).toHaveBeenCalledWith('tab-id', 9)
    expect(ctx.trainingSummary).toEqual({ name: 'Reloaded' })

    AwarenessEducatorService.getTrainingReportSummary.mockClear()
    await TrainingReport.methods.handleTabClick.call(ctx, { name: labels.Users })
    expect(AwarenessEducatorService.getTrainingReportSummary).not.toHaveBeenCalled()
  })
})
