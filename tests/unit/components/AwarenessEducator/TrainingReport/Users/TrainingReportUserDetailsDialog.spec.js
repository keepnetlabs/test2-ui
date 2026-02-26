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
import { getStatusBadgeProps as getStatusBadgePropsUtil } from '@/components/AwarenessEducator/TrainingReport/utils'

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

  it('transformApiResponseToComponentData returns [] for invalid input', () => {
    const result = TrainingReportUserDetailsDialog.methods.transformApiResponseToComponentData.call(
      {},
      null
    )
    expect(result).toEqual([])
  })

  it('transformApiResponseToComponentData uses latest session when api data is valid', () => {
    const ctx = {
      transformSessionToQuestions: jest.fn(() => [{ questionId: 2 }])
    }
    const apiData = [{ interactionsHumanReadable: [] }, { interactionsHumanReadable: [{ source: 'Qex' }] }]

    const result = TrainingReportUserDetailsDialog.methods.transformApiResponseToComponentData.call(
      ctx,
      apiData
    )

    expect(ctx.transformSessionToQuestions).toHaveBeenCalledWith(apiData[1])
    expect(result).toEqual([{ questionId: 2 }])
  })

  it('selectQuestion updates selectedQuestionIndex', () => {
    const ctx = { selectedQuestionIndex: 0 }
    TrainingReportUserDetailsDialog.methods.selectQuestion.call(ctx, 3)
    expect(ctx.selectedQuestionIndex).toBe(3)
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

  it('selectedSessionIndex watcher no-ops when index/session is invalid', () => {
    const ctx = {
      allSessions: [],
      responsesData: [{ questionId: 9 }],
      selectedQuestionIndex: 4,
      transformSessionToQuestions: jest.fn(() => [{ questionId: 1 }])
    }

    TrainingReportUserDetailsDialog.watch.selectedSessionIndex.call(ctx, 10)

    expect(ctx.transformSessionToQuestions).not.toHaveBeenCalled()
    expect(ctx.responsesData).toEqual([{ questionId: 9 }])
    expect(ctx.selectedQuestionIndex).toBe(4)
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

  it('callForResponsesData handles API error with safe fallback state', async () => {
    AwarenessEducatorService.getTrainingReportExamResultSessions.mockRejectedValueOnce(
      new Error('sessions failed')
    )
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const ctx = {
      item: { enrollmentId: 'enr-err', targetUserResourceId: 'user-err' },
      isSurvey: true,
      isResponsesLoading: false,
      allSessions: [{ interactionsHumanReadable: [] }],
      sessionSelectItems: [{ text: 'Completion 1', value: 0 }],
      selectedSessionIndex: 0,
      responsesData: [{ questionId: 1 }],
      selectedQuestionIndex: 2,
      transformSessionToQuestions: jest.fn(() => [])
    }

    TrainingReportUserDetailsDialog.methods.callForResponsesData.call(ctx)
    await flushPromises()

    expect(ctx.allSessions).toEqual([])
    expect(ctx.sessionSelectItems).toEqual([])
    expect(ctx.responsesData).toEqual([])
    expect(ctx.selectedSessionIndex).toBe(null)
    expect(ctx.isResponsesLoading).toBe(false)
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('transformSessionToQuestions returns [] for invalid session payload', () => {
    const ctx = {
      transformAnswerOptions: jest.fn(() => [])
    }
    expect(TrainingReportUserDetailsDialog.methods.transformSessionToQuestions.call(ctx, null)).toEqual([])
    expect(
      TrainingReportUserDetailsDialog.methods.transformSessionToQuestions.call(ctx, {
        enrollmentSessionCreatedAt: '2026-01-01'
      })
    ).toEqual([])
  })

  it('callForResponsesData returns early when item is missing', () => {
    const ctx = { item: null, isSurvey: true, isResponsesLoading: false }
    TrainingReportUserDetailsDialog.methods.callForResponsesData.call(ctx)
    expect(AwarenessEducatorService.getTrainingReportExamResultSessions).not.toHaveBeenCalled()
  })

  it('callForResponsesData returns early when survey mode is disabled', () => {
    const ctx = {
      item: { enrollmentId: 'enr', targetUserResourceId: 'user' },
      isSurvey: false,
      isResponsesLoading: false
    }
    TrainingReportUserDetailsDialog.methods.callForResponsesData.call(ctx)
    expect(AwarenessEducatorService.getTrainingReportExamResultSessions).not.toHaveBeenCalled()
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

  it('callForInteractionsData maps infographic and screensaver types', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({
      data: { data: [] }
    })

    const infoCtx = {
      item: { enrollmentId: 'enr-4', targetUserResourceId: 'user-4' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC },
      interactionsTableData: []
    }
    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(infoCtx)
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'enr-4',
      'user-4',
      null,
      2
    )

    const screensaverCtx = {
      item: { enrollmentId: 'enr-5', targetUserResourceId: 'user-5' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER },
      interactionsTableData: []
    }
    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(screensaverCtx)
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'enr-5',
      'user-5',
      null,
      3
    )
  })

  it('callForInteractionsData returns early when item is missing', () => {
    const ctx = {
      item: null,
      isInteractionsLoading: false
    }

    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(ctx)

    expect(AwarenessEducatorService.getTrainingReportInteractions).not.toHaveBeenCalled()
    expect(ctx.isInteractionsLoading).toBe(false)
  })

  it('callForInteractionsData handles missing response rows safely', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValueOnce({
      data: {}
    })
    const ctx = {
      item: { enrollmentId: 'enr-safe', targetUserResourceId: 'user-safe' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: false,
      trainingSummary: {},
      interactionsTableData: [{ interaction: 'old' }]
    }

    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(ctx)
    await flushPromises()

    expect(ctx.interactionsTableData).toEqual([])
    expect(ctx.isInteractionsLoading).toBe(false)
  })

  it('activeTab watcher triggers responses only when survey mode with item', () => {
    const ctx = {
      isSurvey: true,
      item: { id: 1 },
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.activeTab.handler.call(ctx, 'responses')

    expect(ctx.callForResponsesData).toHaveBeenCalled()
    expect(ctx.callForInteractionsData).not.toHaveBeenCalled()
  })

  it('activeTab watcher triggers interactions tab when item exists', () => {
    const ctx = {
      isSurvey: true,
      item: { id: 1 },
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.activeTab.handler.call(ctx, 'interactions')

    expect(ctx.callForInteractionsData).toHaveBeenCalled()
    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
  })

  it('activeTab watcher does nothing when conditions are not satisfied', () => {
    const ctx = {
      isSurvey: false,
      item: null,
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.activeTab.handler.call(ctx, 'responses')
    TrainingReportUserDetailsDialog.watch.activeTab.handler.call(ctx, 'interactions')

    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
    expect(ctx.callForInteractionsData).not.toHaveBeenCalled()
  })

  it('item watcher ignores updates when target user id did not change', () => {
    const ctx = {
      isSurvey: true,
      activeTab: 'responses',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }
    const sameUser = { targetUserResourceId: 'user-1' }

    TrainingReportUserDetailsDialog.watch.item.handler.call(ctx, sameUser, sameUser)

    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
    expect(ctx.callForInteractionsData).not.toHaveBeenCalled()
  })

  it('item watcher loads interactions in non-survey mode regardless of activeTab', () => {
    const ctx = {
      isSurvey: false,
      activeTab: 'responses',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.item.handler.call(
      ctx,
      { targetUserResourceId: 'user-new' },
      { targetUserResourceId: 'user-old' }
    )

    expect(ctx.callForInteractionsData).toHaveBeenCalled()
    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
  })

  it('item watcher loads responses when survey mode and active tab is responses', () => {
    const ctx = {
      isSurvey: true,
      activeTab: 'responses',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.item.handler.call(
      ctx,
      { targetUserResourceId: 'user-new' },
      { targetUserResourceId: 'user-old' }
    )

    expect(ctx.callForResponsesData).toHaveBeenCalled()
    expect(ctx.callForInteractionsData).not.toHaveBeenCalled()
  })

  it('item watcher loads interactions when survey mode and active tab is interactions', () => {
    const ctx = {
      isSurvey: true,
      activeTab: 'interactions',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.item.handler.call(
      ctx,
      { targetUserResourceId: 'user-new' },
      { targetUserResourceId: 'user-old' }
    )

    expect(ctx.callForInteractionsData).toHaveBeenCalled()
    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
  })

  it('item watcher triggers on first assignment when oldItem is undefined', () => {
    const ctx = {
      isSurvey: false,
      activeTab: 'responses',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.item.handler.call(
      ctx,
      { targetUserResourceId: 'user-first' },
      undefined
    )

    expect(ctx.callForInteractionsData).toHaveBeenCalled()
    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
  })

  it('getNavigationDrawerClass computed returns expected class map', () => {
    const result = TrainingReportUserDetailsDialog.computed.getNavigationDrawerClass.call({})
    expect(result).toEqual({
      'k-navigation-drawer k-navigation-drawer--training-report-user-details': true
    })
  })

  it('getSubtitle computed safely combines first and last names', () => {
    expect(
      TrainingReportUserDetailsDialog.computed.getSubtitle.call({
        item: { firstName: 'Jane', lastName: 'Doe' }
      })
    ).toBe('Jane Doe')

    expect(TrainingReportUserDetailsDialog.computed.getSubtitle.call({ item: null })).toBe(' ')
  })

  it('selectedQuestion computed returns null when index is out of bounds', () => {
    const result = TrainingReportUserDetailsDialog.computed.selectedQuestion.call({
      responsesData: [{ questionId: 1 }],
      selectedQuestionIndex: 5
    })
    expect(result).toBe(null)
  })

  it('selectedQuestion computed returns selected item when index is valid', () => {
    const selected = { questionId: 7 }
    const result = TrainingReportUserDetailsDialog.computed.selectedQuestion.call({
      responsesData: [{ questionId: 1 }, selected],
      selectedQuestionIndex: 1
    })
    expect(result).toBe(selected)
  })

  it('getStatusBadgeProps delegates to utility helper', () => {
    const spy = jest.spyOn(require('@/components/AwarenessEducator/TrainingReport/utils'), 'getStatusBadgeProps')
    const status = 'Viewed'
    const result = TrainingReportUserDetailsDialog.methods.getStatusBadgeProps.call({}, status)
    expect(spy).toHaveBeenCalledWith(status)
    expect(result).toEqual(getStatusBadgePropsUtil(status))
    spy.mockRestore()
  })

  it('handleOverlayClick and handleClose delegate to closeDrawer', () => {
    const closeDrawer = jest.fn()
    const ctx = { closeDrawer }

    TrainingReportUserDetailsDialog.methods.handleOverlayClick.call(ctx)
    TrainingReportUserDetailsDialog.methods.handleClose.call(ctx)

    expect(closeDrawer).toHaveBeenCalledTimes(2)
  })

  it('callForInteractionsData sends type 0 when training type key is disabled', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValueOnce({
      data: { data: [] }
    })
    const ctx = {
      item: { enrollmentId: 'enr-0', targetUserResourceId: 'user-0' },
      isInteractionsLoading: false,
      isAddTrainingTypeKeyToPayload: false,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER },
      interactionsTableData: []
    }

    TrainingReportUserDetailsDialog.methods.callForInteractionsData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'enr-0',
      'user-0',
      null,
      0
    )
    expect(ctx.isInteractionsLoading).toBe(false)
  })

  it('selectedSessionIndex watcher does nothing when new index is null', () => {
    const ctx = {
      allSessions: [{ interactionsHumanReadable: [] }],
      responsesData: [{ questionId: 99 }],
      selectedQuestionIndex: 6,
      transformSessionToQuestions: jest.fn(() => [{ questionId: 1 }])
    }

    TrainingReportUserDetailsDialog.watch.selectedSessionIndex.call(ctx, null)

    expect(ctx.transformSessionToQuestions).not.toHaveBeenCalled()
    expect(ctx.responsesData).toEqual([{ questionId: 99 }])
    expect(ctx.selectedQuestionIndex).toBe(6)
  })

  it('callForResponsesData handles non-array session response safely', async () => {
    AwarenessEducatorService.getTrainingReportExamResultSessions.mockResolvedValueOnce({
      data: { data: { invalid: true } }
    })
    const ctx = {
      item: { enrollmentId: 'enr-safe', targetUserResourceId: 'user-safe' },
      isSurvey: true,
      isResponsesLoading: false,
      allSessions: [{ interactionsHumanReadable: [] }],
      sessionSelectItems: [{ text: 'Completion 1', value: 0 }],
      selectedSessionIndex: 0,
      responsesData: [{ questionId: 1 }],
      selectedQuestionIndex: 4,
      transformSessionToQuestions: jest.fn(() => [{ questionId: 2 }])
    }

    TrainingReportUserDetailsDialog.methods.callForResponsesData.call(ctx)
    await flushPromises()

    expect(ctx.allSessions).toEqual([])
    expect(ctx.sessionSelectItems).toEqual([])
    expect(ctx.selectedSessionIndex).toBe(null)
    expect(ctx.responsesData).toEqual([])
    expect(ctx.selectedQuestionIndex).toBe(0)
    expect(ctx.isResponsesLoading).toBe(false)
  })

  it('item watcher does nothing when new item is null', () => {
    const ctx = {
      isSurvey: true,
      activeTab: 'responses',
      callForResponsesData: jest.fn(),
      callForInteractionsData: jest.fn()
    }

    TrainingReportUserDetailsDialog.watch.item.handler.call(
      ctx,
      null,
      { targetUserResourceId: 'user-old' }
    )

    expect(ctx.callForResponsesData).not.toHaveBeenCalled()
    expect(ctx.callForInteractionsData).not.toHaveBeenCalled()
  })

  it('data() prepends currentStep column for learning path summary', () => {
    const state = TrainingReportUserDetailsDialog.data.call({
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_TYPES.LEARNING_PATH }
    })

    expect(state.interactionsTableOptions.columns[0].property).toBe('currentStep')
    expect(state.interactionsTableOptions.columns[1].property).toBe('eventTime')
  })

  it('data() prepends currentStep column for payload learning path constant as well', () => {
    const state = TrainingReportUserDetailsDialog.data.call({
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
    })

    expect(state.interactionsTableOptions.columns[0].property).toBe('currentStep')
  })
})
