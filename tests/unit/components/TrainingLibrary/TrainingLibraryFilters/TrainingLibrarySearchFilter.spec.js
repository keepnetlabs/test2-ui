import TrainingLibrarySearchFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySearchFilter.vue'

describe('TrainingLibrarySearchFilter.vue', () => {
  it('getItems returns items when no search', () => {
    const items = [{ text: 'A', value: 'a' }, { text: 'B', value: 'b' }]
    const result = TrainingLibrarySearchFilter.computed.getItems.call({
      search: '',
      items,
      getFilteredSearchItems: []
    })
    expect(result).toEqual(items)
  })

  it('getFilteredSearchItems filters by search text', () => {
    const items = [{ text: 'Apple', value: 'a' }, { text: 'Banana', value: 'b' }]
    const result = TrainingLibrarySearchFilter.computed.getFilteredSearchItems.call({
      search: 'app',
      items
    })
    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('Apple')
  })
})
