import TrainingLibraryLongTextSearchFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryLongTextSearchFilter.vue'

describe('TrainingLibraryLongTextSearchFilter.vue', () => {
  it('getItems returns items when no search', () => {
    const items = [{ text: 'Item 1', value: 'v1' }]
    const result = TrainingLibraryLongTextSearchFilter.computed.getItems.call({
      search: '',
      items,
      getFilteredSearchItems: []
    })
    expect(result).toEqual(items)
  })

  it('getFilteredSearchItems filters by search text', () => {
    const items = [{ text: 'Description', value: 'd' }, { text: 'Title', value: 't' }]
    const result = TrainingLibraryLongTextSearchFilter.computed.getFilteredSearchItems.call({
      search: 'desc',
      items
    })
    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('Description')
  })
})
