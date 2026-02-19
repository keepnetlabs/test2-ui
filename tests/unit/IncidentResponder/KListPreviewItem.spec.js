import KListPreviewItem from '@/components/IncidentResponder/KListPreviewItem.vue'

describe('KListPreviewItem.vue', () => {
  it('emits selected item on handleItemClick', () => {
    const emit = jest.fn()
    const item = { name: 'Template A', subject: 'Subject' }
    const ctx = { item, $emit: emit }

    KListPreviewItem.methods.handleItemClick.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-item-click', item)
  })
})
