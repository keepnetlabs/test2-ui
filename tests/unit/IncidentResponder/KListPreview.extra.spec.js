import KListPreview from '@/components/IncidentResponder/KListPreview.vue'

describe('KListPreview.vue (extra branch coverage)', () => {
  const { methods, watch } = KListPreview

  it('search watcher ignores falsy values and matches trimmed numeric/string content', () => {
    const ctx = {
      options: [
        { resourceId: '1', name: null, score: 7 },
        { resourceId: '2', name: '  padded value  ' },
        { resourceId: '3', name: false, subject: 'ignore me' }
      ],
      searchedOptions: []
    }

    watch.search.call(ctx, ' 7 ')
    expect(ctx.searchedOptions).toEqual([{ resourceId: '1', name: null, score: 7 }])

    watch.search.call(ctx, ' padded ')
    expect(ctx.searchedOptions).toEqual([{ resourceId: '2', name: '  padded value  ' }])
  })

  it('handleItemClick safely emits undefined when called without an item', () => {
    const emit = jest.fn()
    const callForSelectedItemData = jest.fn()
    const ctx = {
      valueKey: 'resourceId',
      $emit: emit,
      callForSelectedItemData
    }

    methods.handleItemClick.call(ctx)

    expect(emit).toHaveBeenCalledWith('input', undefined)
    expect(callForSelectedItemData).toHaveBeenCalledWith({})
  })

  it('created does not request preview when initial value is missing', () => {
    const callForSelectedItemData = jest.fn()
    const ctx = {
      value: '',
      callForSelectedItemData
    }

    KListPreview.created.call(ctx)

    expect(callForSelectedItemData).not.toHaveBeenCalled()
  })
})
