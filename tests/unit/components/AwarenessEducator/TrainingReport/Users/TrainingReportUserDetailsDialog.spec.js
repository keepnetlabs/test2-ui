jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportExamResultSessions: jest.fn(),
    getTrainingReportInteractions: jest.fn()
  }
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingReportUserDetailsDialog from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserDetailsDialog.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportUserDetailsDialog methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('transformAnswerOptions returns [] for invalid input', () => {
    const result = TrainingReportUserDetailsDialog.methods.transformAnswerOptions.call({}, null)
    expect(result).toEqual([])
  })

  it('transformAnswerOptions maps fields and booleans', () => {
    const result = TrainingReportUserDetailsDialog.methods.transformAnswerOptions.call({}, [
      { option: 'A', isUserAnswer: 1, correctAnswer: 0 },
      { option: 'B', isUserAnswer: 0, correctAnswer: 1 }
    ])

    expect(result).toEqual([
      { optionId: 1, text: 'A', isUserAnswer: true, isCorrect: false },
      { optionId: 2, text: 'B', isUserAnswer: false, isCorrect: true }
    ])
  })

  it('transformSessionToQuestions filters only Qex interactions', () => {
    const ctx = {
      transformAnswerOptions: TrainingReportUserDetailsDialog.methods.transformAnswerOptions
    }

    const result = TrainingReportUserDetailsDialog.methods.transformSessionToQuestions.call(ctx, {
      enrollmentSessionCreatedAt: '2026-01-01',
      interactionsHumanReadable: [
        {
          source: 'Qex',
          index: 0,
          question: 'What is 2+2?',
          type: 'CHOICE-SINGLE',
          time: '10:00',
          answers: [{ option: '4', isUserAnswer: true, correctAnswer: true }]
        },
        {
          source: 'Other',
          index: 1,
          question: 'Ignored',
          type: 'fill-in',
          time: '10:01',
          answers: []
        }
      ]
    })

    expect(result).toHaveLength(1)
    expect(result[0].questionId).toBe(1)
    expect(result[0].questionType).toBe('choice-single')
    expect(result[0].responseDate).toBe('2026-01-01 10:00')
  })

  it('selectedSessionIndex watcher updates question list', () => {
    const ctx = {
      allSessions: [{ interactionsHumanReadable: [] }],
      responsesData: [],
      selectedQuestionIndex: 9,
      transformSessionToQuestions: jest.fn(() => [{ questionId: 1 }])
    }

    TrainingReportUserDetailsDialog.watch.selectedSessionIndex.call(ctx, 0)

    expect(ctx.transformSessionToQuestions).toHaveBeenCalledWith(ctx.allSessions[0])
    expect(ctx.responsesData).toEqual([{ questionId: 1 }])
    expect(ctx.selectedQuestionIndex).toBe(0)
  })

  it('callForResponsesData loads sessions and maps latest completion', async () => {
    const sessions = [
      {
        interactionsHumanReadable: [{ source: 'Qex', question: 'First', index: 0, answers: [] }]
      },
      {
        interactionsHumanReadable: [{ source: 'Qex', question: 'Second', index: 0, answers: [] }]
      }
    ]
    AwarenessEducatorService.getTrainingReportExamResultSessions.mockResolvedValue({
      data: { data: sessions }
    })

    const ctx = {
      item: { enrollmentId: 'enr-1', targetUserResourceId: 'user-1' },
      isSurvey: true,
      isResponsesLoading: false,
      allSessions: [],
      sessionSelectItems: [],
      selectedSessionIndex: null,
      responsesData: [],
      selectedQuestionIndex: 5,
      transformSessionToQuestions: jest.fn((session) => [{ questionText: session.interactionsHumanReadable[0].question }])
    }

    TrainingReportUserDetailsDialog.methods.callForResponsesData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportExamResultSessions).toHaveBeenCalledWith(
      'enr-1',
      'user-1'
    )
    expect(ctx.sessionSelectItems).toEqual([
      { text: 'Completion 1', value: 0 },
      { text: 'Completion 2', value: 1 }
    ])
    expect(ctx.selectedSessionIndex).toBe(1)
    expect(ctx.responsesData).toEqual([{ questionText: 'First' }])
    expect(ctx.selectedQuestionIndex).toBe(0)
    expect(ctx.isResponsesLoading).toBe(false)
  })

  it('callForInteractionsData sends expected type for learning path', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({
      data: {
        data: [
          {
            interaction: 'Viewed',
            eventTime: '2026-01-01',
            currentStep: 'Step 1',
            trackingInfo: { browserName: 'Chrome' }
          }
        ]
      }
    })

    const ctx = {
      item: { enrollmentId: 'enr-2', targetUserResourceId: 'user-2' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_TYPES.LEARNING_PATH },
      interactionsTableData: []
    }

    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'enr-2',
      'user-2',
      null,
      4
    )
    expect(ctx.interactionsTableData).toEqual([
      {
        interaction: 'Viewed',
        eventTime: '2026-01-01',
        currentStep: 'Step 1',
        browserName: 'Chrome'
      }
    ])
    expect(ctx.isInteractionsLoading).toBe(false)
  })

  it('callForInteractionsData maps poster type to 1', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({
      data: { data: [] }
    })

    const ctx = {
      item: { enrollmentId: 'enr-3', targetUserResourceId: 'user-3' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER },
      interactionsTableData: []
    }

    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'enr-3',
      'user-3',
      null,
      1
    )
  })
})
