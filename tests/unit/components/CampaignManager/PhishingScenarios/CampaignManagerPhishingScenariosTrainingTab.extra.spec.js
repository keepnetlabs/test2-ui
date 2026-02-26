jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(() => Promise.resolve({ data: { data: [{ id: 'en' }] } })),
    getTrainingItems: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            totalNumberOfPages: 2,
            results: [{ trainingId: 't1', trainingName: 'Training A' }]
          }
        }
      })
    )
  }
}))

import CampaignManagerPhishingScenariosTrainingTab from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingTab.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('CampaignManagerPhishingScenariosTrainingTab.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getSubtitle covers callback branch', () => {
    const result = CampaignManagerPhishingScenariosTrainingTab.computed.getSubtitle.call({
      type: 'Callback'
    })
    expect(result).toContain('callback phone number')
  })

  it('computed getAlertBoxText switches by type and isEdit', () => {
    const editText = CampaignManagerPhishingScenariosTrainingTab.computed.getAlertBoxText.call({
      type: 'Smishing',
      isEdit: true
    })
    const normalText = CampaignManagerPhishingScenariosTrainingTab.computed.getAlertBoxText.call({
      type: 'Quishing',
      isEdit: false
    })
    expect(editText).toContain('smishing campaign has started')
    expect(normalText).toContain('quishing scenario should be selected')
  })

  it('computed getPeriodTypeItems falls back when enum is missing', () => {
    const periodTypeItems = [{ text: 'Day', value: 'Day' }]
    const result = CampaignManagerPhishingScenariosTrainingTab.computed.getPeriodTypeItems.call({
      enumTypes: {},
      periodTypeItems
    })
    expect(result).toEqual(periodTypeItems)
  })

  it('computed getTrainingInputClassName omits mt-6 when not editable', () => {
    const result = CampaignManagerPhishingScenariosTrainingTab.computed.getTrainingInputClassName.call(
      { isInputsEditable: false }
    )
    expect(result).toBe('ml-3')
  })

  it('computed getTrainingId returns empty string fallback', () => {
    const result = CampaignManagerPhishingScenariosTrainingTab.computed.getTrainingId.call({
      value: null
    })
    expect(result).toBe('')
  })

  it('callForTrainingItems returns early when addPage exceeds total pages', () => {
    const ctx = {
      trainingPayload: { pageNumber: 1 },
      totalNumberOfPagesOfTrainings: 1,
      isTrainingLoading: false
    }
    CampaignManagerPhishingScenariosTrainingTab.methods.callForTrainingItems.call(ctx, true)
    expect(AwarenessEducatorService.getTrainingItems).not.toHaveBeenCalled()
  })

  it('callForTrainingItemsSearch delegates to callForTrainingItems when search is empty', () => {
    const ctx = {
      callForTrainingItems: jest.fn()
    }
    CampaignManagerPhishingScenariosTrainingTab.methods.callForTrainingItemsSearch.call(ctx, '')
    expect(ctx.callForTrainingItems).toHaveBeenCalled()
  })

  it('handleTrainingItemSelect with Survey removes quiz-related end types', () => {
    const resetValidation = jest.fn()
    const ctx = {
      value: { trainingTypeId: 'Survey', hasQuiz: false },
      endTypeItems: [],
      $set: (obj, key, val) => {
        obj[key] = val
      },
      $nextTick: (cb) => cb(),
      $refs: {
        inputContentLanguage: {
          $refs: { refSelect: { $refs: { refComponent: { resetValidation } } } }
        }
      }
    }

    CampaignManagerPhishingScenariosTrainingTab.methods.handleTrainingItemSelect.call(ctx, {
      value: 's1',
      text: 'Survey A'
    })

    expect(ctx.value.trainingId).toBe('s1')
    expect(ctx.value.trainingName).toBe('Survey A')
    expect(ctx.endTypeItems.some((item) => item.value === 'QuizCompleted')).toBe(false)
    expect(ctx.endTypeItems.some((item) => item.value === 'QuizSuccessfullyCompleted')).toBe(false)
    expect(resetValidation).toHaveBeenCalled()
  })

  it('handleApiCallFinished sets default value only when no language selected', () => {
    const setDefaultValue = jest.fn()
    const ctx = {
      value: { trainingLanguageIds: [] },
      $refs: { inputContentLanguage: { setDefaultValue } }
    }
    CampaignManagerPhishingScenariosTrainingTab.methods.handleApiCallFinished.call(ctx)
    expect(setDefaultValue).toHaveBeenCalledTimes(1)

    setDefaultValue.mockClear()
    ctx.value.trainingLanguageIds = ['en']
    CampaignManagerPhishingScenariosTrainingTab.methods.handleApiCallFinished.call(ctx)
    expect(setDefaultValue).not.toHaveBeenCalled()
  })

  it('disabledEndDates returns true only for past dates', () => {
    const today = new Date()
    const future = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const past = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const isPastDisabled = CampaignManagerPhishingScenariosTrainingTab.methods.disabledEndDates.call(
      {},
      past
    )
    const isFutureDisabled = CampaignManagerPhishingScenariosTrainingTab.methods.disabledEndDates.call(
      {},
      future
    )

    expect(isPastDisabled).toBe(true)
    expect(isFutureDisabled).toBe(false)
  })
})
