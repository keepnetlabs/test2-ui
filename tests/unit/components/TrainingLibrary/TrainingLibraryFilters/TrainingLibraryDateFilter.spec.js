jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm')
}))

import TrainingLibraryDateFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryDateFilter.vue'

describe('TrainingLibraryDateFilter.vue', () => {
  it('dateFilterItems contains expected options', () => {
    const items = TrainingLibraryDateFilter.data().dateFilterItems
    expect(items.map((i) => i.text)).toContain('Exact date')
    expect(items.map((i) => i.text)).toContain('Between')
  })

  it('handleOperatorChange sets value to array for between', () => {
    const filter = { value: 'x' }
    const ctx = { filter, betweenPickerKey: 'old' }
    TrainingLibraryDateFilter.methods.handleOperatorChange.call(ctx, 'between')
    expect(filter.value).toEqual([])
  })

  it('handleOperatorChange sets value to empty string for other operators', () => {
    const filter = { value: 'x' }
    TrainingLibraryDateFilter.methods.handleOperatorChange.call({ filter }, '=')
    expect(filter.value).toBe('')
  })
})
