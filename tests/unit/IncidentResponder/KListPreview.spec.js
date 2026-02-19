import KListPreview from '@/components/IncidentResponder/KListPreview.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('KListPreview.vue', () => {
  const { computed, methods, watch } = KListPreview

  it('getOptions returns searched options when search exists', () => {
    const ctx = {
      search: 'abc',
      searchedOptions: [{ resourceId: '1' }],
      options: [{ resourceId: '2' }]
    }

    expect(computed.getOptions.call(ctx)).toEqual([{ resourceId: '1' }])
    expect(computed.getOptions.call({ ...ctx, search: '' })).toEqual([{ resourceId: '2' }])
  })

  it('search watcher filters options by any field value', () => {
    const ctx = {
      options: [
        { resourceId: '1', name: 'Alpha Mail', subject: 'Welcome' },
        { resourceId: '2', name: 'Beta', subject: 'Reminder' }
      ],
      searchedOptions: []
    }

    watch.search.call(ctx, 'Alpha')

    expect(ctx.searchedOptions).toEqual([{ resourceId: '1', name: 'Alpha Mail', subject: 'Welcome' }])
  })

  it('handleItemClick emits selected value and requests preview', () => {
    const emit = jest.fn()
    const callForSelectedItemData = jest.fn()
    const item = { customId: 'x-1', resourceId: 'res-1' }
    const ctx = {
      valueKey: 'customId',
      $emit: emit,
      callForSelectedItemData
    }

    methods.handleItemClick.call(ctx, item)

    expect(emit).toHaveBeenCalledWith('input', 'x-1')
    expect(callForSelectedItemData).toHaveBeenCalledWith(item)
  })

  it('callForSelectedItemData uses cached template when exists', () => {
    const ctx = {
      itemTemplates: { 'res-1': '<p>cached</p>' },
      selectedItemTemplate: null
    }

    methods.callForSelectedItemData.call(ctx, { resourceId: 'res-1' })

    expect(ctx.selectedItemTemplate).toBe('<p>cached</p>')
  })

  it('callForSelectedItemData fetches and caches template when missing', async () => {
    const itemPreviewFunc = jest.fn().mockResolvedValue({
      data: {
        data: {
          template: '<p>fetched</p>'
        }
      }
    })
    const ctx = {
      itemTemplates: {},
      selectedItemTemplate: null,
      itemPreviewFunc
    }

    methods.callForSelectedItemData.call(ctx, { resourceId: 'res-2' })
    await flushPromises()

    expect(itemPreviewFunc).toHaveBeenCalledWith('res-2')
    expect(ctx.selectedItemTemplate).toBe('<p>fetched</p>')
    expect(ctx.itemTemplates['res-2']).toBe('<p>fetched</p>')
  })

  it('created loads selected item preview when value exists', () => {
    const callForSelectedItemData = jest.fn()
    const ctx = {
      value: 'initial-id',
      callForSelectedItemData
    }

    KListPreview.created.call(ctx)

    expect(callForSelectedItemData).toHaveBeenCalledWith({ resourceId: 'initial-id' })
  })
})
