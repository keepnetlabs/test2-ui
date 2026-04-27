import TrainingLibraryFilterBadge from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilterBadge.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibraryFilterBadge.vue (extra)', () => {
  it('computed flags detect which badge variants should render', () => {
    expect(
      TrainingLibraryFilterBadge.computed.isFilterTypeSelect.call({
        filter: { filterType: 'select', activeValue: 'Poster' }
      })
    ).toBe('Poster')
    expect(
      TrainingLibraryFilterBadge.computed.isFilterTypeSearch.call({
        filter: { filterType: 'search', activeValue: ['en'] }
      })
    ).toBe(1)
    expect(
      TrainingLibraryFilterBadge.computed.isFilterTypeLongTextSearch.call({
        filter: { filterType: 'longTextSearch', activeValue: ['abc'] }
      })
    ).toEqual(['abc'])
    expect(
      TrainingLibraryFilterBadge.computed.isFilterTypeDateSelect.call({
        filter: { filterType: 'date', activeValue: '2026-01-01' }
      })
    ).toBe('2026-01-01')
  })

  it('getOperatorLabel maps extra operators and falls back to the raw operator', () => {
    expect(TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, '!=')).toBe('Not Equal')
    expect(TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, '>=')).toBe('After')
    expect(TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, '<=')).toBe('Before')
    expect(TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, 'Custom')).toBe('Custom')
  })

  it('getFilterValue resolves language, compliance, level, and duration labels', () => {
    const ctx = {
      languages: [{ code: 'en', isoFriendlyName: 'English' }],
      compliances: [{ value: 'iso', text: 'ISO' }],
      categories: [],
      behaviours: [],
      types: [],
      targetAudiences: [],
      vendors: [],
      levels: [{ id: 2, text: 'Intermediate' }],
      getLanguageFilterValue: TrainingLibraryFilterBadge.methods.getLanguageFilterValue,
      getComplianceFilterValue: TrainingLibraryFilterBadge.methods.getComplianceFilterValue,
      getCategoryFilterValue: TrainingLibraryFilterBadge.methods.getCategoryFilterValue,
      getBehaviourFilterValue: TrainingLibraryFilterBadge.methods.getBehaviourFilterValue,
      getTrainingTypeFilterValue: TrainingLibraryFilterBadge.methods.getTrainingTypeFilterValue,
      getTargetAudienceFilterValue: TrainingLibraryFilterBadge.methods.getTargetAudienceFilterValue,
      getVendorFilterValue: TrainingLibraryFilterBadge.methods.getVendorFilterValue,
      getLevelFilterValue: TrainingLibraryFilterBadge.methods.getLevelFilterValue,
      getDurationFilterValue: TrainingLibraryFilterBadge.methods.getDurationFilterValue
    }

    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.LANGUAGES },
        'en'
      )
    ).toBe('English')
    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.COMPLIANCE },
        'iso'
      )
    ).toBe('ISO')
    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.LEVEL },
        2
      )
    ).toBe('Intermediate')
    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.TOTAL_DURATION },
        '1-5'
      )
    ).toBe('1 – 5 min')
    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.TOTAL_DURATION },
        '90+'
      )
    ).toBe('+90 min')
  })

  it('getFilterValue falls back to raw values when lookup items are missing', () => {
    const ctx = {
      languages: [],
      compliances: [],
      categories: [],
      behaviours: [],
      types: [],
      targetAudiences: [],
      vendors: [],
      levels: [],
      getLanguageFilterValue: TrainingLibraryFilterBadge.methods.getLanguageFilterValue,
      getComplianceFilterValue: TrainingLibraryFilterBadge.methods.getComplianceFilterValue,
      getCategoryFilterValue: TrainingLibraryFilterBadge.methods.getCategoryFilterValue,
      getBehaviourFilterValue: TrainingLibraryFilterBadge.methods.getBehaviourFilterValue,
      getTrainingTypeFilterValue: TrainingLibraryFilterBadge.methods.getTrainingTypeFilterValue,
      getTargetAudienceFilterValue: TrainingLibraryFilterBadge.methods.getTargetAudienceFilterValue,
      getVendorFilterValue: TrainingLibraryFilterBadge.methods.getVendorFilterValue,
      getLevelFilterValue: TrainingLibraryFilterBadge.methods.getLevelFilterValue,
      getDurationFilterValue: TrainingLibraryFilterBadge.methods.getDurationFilterValue
    }

    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(
        ctx,
        { key: PROPERTY_STORE.LANGUAGES },
        'xx'
      )
    ).toBe('xx')
    expect(TrainingLibraryFilterBadge.methods.getLevelFilterValue.call(ctx, 99)).toBe(99)
    expect(TrainingLibraryFilterBadge.methods.getDurationFilterValue.call(ctx, '999')).toBe('999')
  })

  it('removeSelectFilter uses learning path removal action when requested', () => {
    const removeLearningPathFilterFromPayload = jest.fn()
    const removeFilterFromPayload = jest.fn()
    const filter = { activeValue: 'Poster', value: 'Poster', isFilterActive: true }

    TrainingLibraryFilterBadge.methods.removeSelectFilter.call({
      filter,
      isLearningPathModal: true,
      removeLearningPathFilterFromPayload,
      removeFilterFromPayload
    })

    expect(filter.activeValue).toBe('')
    expect(filter.value).toBe('')
    expect(filter.isFilterActive).toBe(false)
    expect(removeLearningPathFilterFromPayload).toHaveBeenCalledWith(filter)
    expect(removeFilterFromPayload).not.toHaveBeenCalled()
  })

  it('removeSearchFilter updates active state and supports learning path removal', () => {
    const removeLearningPathFilterFromPayload = jest.fn()
    const filter = {
      activeValue: ['en'],
      value: ['en'],
      isFilterActive: true
    }

    TrainingLibraryFilterBadge.methods.removeSearchFilter.call(
      {
        filter,
        isLearningPathModal: true,
        removeLearningPathFilterFromPayload,
        removeFilterFromPayload: jest.fn()
      },
      'en',
      0
    )

    expect(filter.activeValue).toEqual([])
    expect(filter.value).toEqual([])
    expect(filter.isFilterActive).toBe(false)
    expect(removeLearningPathFilterFromPayload).toHaveBeenCalledWith(filter)
  })

  it('getDateFilterValue returns a scalar when operator is not between', () => {
    expect(
      TrainingLibraryFilterBadge.methods.getDateFilterValue.call({}, {
        activeOperator: '=',
        activeValue: '2026-01-01'
      })
    ).toBe('2026-01-01')
  })
})
