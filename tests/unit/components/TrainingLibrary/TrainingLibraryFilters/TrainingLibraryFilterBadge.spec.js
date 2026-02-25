import TrainingLibraryFilterBadge from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilterBadge.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibraryFilterBadge.vue', () => {
  it('getOperatorLabel maps operator to label', () => {
    expect(
      TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, 'Include')
    ).toBe('Equal')
    expect(
      TrainingLibraryFilterBadge.methods.getOperatorLabel.call({}, 'between')
    ).toBe('Between')
  })

  it('getDateFilterValue returns range for between', () => {
    const filter = { activeOperator: 'between', activeValue: ['2024-01-01', '2024-01-31'] }
    expect(
      TrainingLibraryFilterBadge.methods.getDateFilterValue.call({}, filter)
    ).toBe('2024-01-01 - 2024-01-31')
  })

  it('getFilterValue returns filterVal for unknown key', () => {
    const ctx = { languages: [], categories: [] }
    expect(
      TrainingLibraryFilterBadge.methods.getFilterValue.call(ctx, { key: 'unknown' }, 'value')
    ).toBe('value')
  })

  it('removeSelectFilter clears filter', () => {
    const removeFilterFromPayload = jest.fn()
    const filter = { activeValue: 'x', value: 'x', isFilterActive: true }
    const ctx = { filter, removeFilterFromPayload, isLearningPathModal: false }
    TrainingLibraryFilterBadge.methods.removeSelectFilter.call(ctx)
    expect(filter.activeValue).toBe('')
    expect(filter.isFilterActive).toBe(false)
    expect(removeFilterFromPayload).toHaveBeenCalledWith(filter)
  })
})
