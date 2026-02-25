jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(() => Promise.resolve({ data: { data: [{ id: 'en' }] } })),
    getTrainingItems: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            totalNumberOfPages: 1,
            results: [{ trainingId: 't1', trainingName: 'Training A' }]
          }
        }
      })
    )
  }
}))

import CampaignManagerPhishingScenariosTrainingTab from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingTab.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('CampaignManagerPhishingScenariosTrainingTab.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignManagerPhishingScenariosTrainingTab.name).toBe(
      'CampaignManagerPhishingScenariosTrainingTab'
    )
  })

  it('computed helpers work for input editability and subtitle', () => {
    expect(
      CampaignManagerPhishingScenariosTrainingTab.computed.isInputsEditable.call({
        value: { isCheckboxSelected: true },
        isCategory: false
      })
    ).toBe(true)
    expect(
      CampaignManagerPhishingScenariosTrainingTab.computed.isInputLanguageDisabled.call({
        isInputsEditable: true,
        value: { trainingId: '' }
      })
    ).toBe(true)
    expect(
      CampaignManagerPhishingScenariosTrainingTab.computed.getSubtitle.call({ type: 'Phishing' })
    ).toContain('phishing link')
  })

  it('setTrainings appends non-selected training items', () => {
    const ctx = { value: { trainingId: 't2' }, trainingItems: [{ text: 'X', value: 'tX' }] }
    CampaignManagerPhishingScenariosTrainingTab.methods.setTrainings.call(ctx, {
      data: { data: { results: [{ trainingId: 't1', trainingName: 'Training A' }] } }
    })
    expect(ctx.trainingItems).toEqual([
      { text: 'X', value: 'tX' },
      { text: 'Training A', value: 't1' }
    ])
  })

  it('callForTrainingItems loads paginated items', async () => {
    const ctx = {
      trainingPayload: { pageNumber: 1, pageSize: 10 },
      totalNumberOfPagesOfTrainings: 1,
      isTrainingLoading: false,
      setTrainings: jest.fn()
    }
    CampaignManagerPhishingScenariosTrainingTab.methods.callForTrainingItems.call(ctx, false)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.getTrainingItems).toHaveBeenCalled()
    expect(ctx.setTrainings).toHaveBeenCalled()
    expect(ctx.isTrainingLoading).toBe(false)
  })

  it('handleTrainingItemSelect updates model and clears language ids', () => {
    const ctx = {
      value: { trainingTypeId: 'Training', hasQuiz: false },
      $set: (obj, key, val) => {
        obj[key] = val
      },
      $nextTick: (cb) => cb(),
      $refs: {
        inputContentLanguage: {
          $refs: { refSelect: { $refs: { refComponent: { resetValidation: jest.fn() } } } }
        }
      }
    }
    CampaignManagerPhishingScenariosTrainingTab.methods.handleTrainingItemSelect.call(ctx, {
      value: 't1',
      text: 'Training A'
    })
    expect(ctx.value.trainingId).toBe('t1')
    expect(ctx.value.trainingName).toBe('Training A')
    expect(ctx.value.trainingLanguageIds).toEqual([])
  })
})
