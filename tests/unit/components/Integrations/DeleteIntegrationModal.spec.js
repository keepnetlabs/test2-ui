import DeleteIntegrationModal from '@/components/Integrations/DeleteIntegrationModal.vue'

describe('DeleteIntegrationModal.vue', () => {
  it('getIntegrationName returns name for Object', () => {
    const ctx = { selectedIntegration: { name: 'Test Integration' } }
    expect(DeleteIntegrationModal.computed.getIntegrationName.call(ctx)).toBe('Test Integration')
  })

  it('getIntegrationName returns count for Array with multiple items', () => {
    const ctx = { selectedIntegration: [{ name: 'A' }, { name: 'B' }] }
    expect(DeleteIntegrationModal.computed.getIntegrationName.call(ctx)).toBe('2 integrations')
  })

  it('closeModal emits handleCloseModal', () => {
    const ctx = { $emit: jest.fn() }
    DeleteIntegrationModal.methods.closeModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleCloseModal')
  })

  it('getActionName returns handleDelete for Object', () => {
    const ctx = { selectedIntegration: { name: 'Test' } }
    expect(DeleteIntegrationModal.methods.getActionName.call(ctx)).toBe('handleDelete')
  })

  it('getActionData returns selectedIntegration for Object', () => {
    const item = { name: 'Test' }
    const ctx = { selectedIntegration: item }
    expect(DeleteIntegrationModal.methods.getActionData.call(ctx)).toBe(item)
  })
})
