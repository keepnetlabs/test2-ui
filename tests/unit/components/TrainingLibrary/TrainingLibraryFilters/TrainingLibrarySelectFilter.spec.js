import TrainingLibrarySelectFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySelectFilter.vue'

describe('TrainingLibrarySelectFilter.vue', () => {
  it('textFilterItems contains Contains, Equal, Not Equal', () => {
    const items = TrainingLibrarySelectFilter.data().textFilterItems
    expect(items.map((i) => i.text)).toEqual(['Contains', 'Equal', 'Not Equal'])
    expect(items[0].value).toBe('Contains')
    expect(items[1].value).toBe('=')
  })
})
