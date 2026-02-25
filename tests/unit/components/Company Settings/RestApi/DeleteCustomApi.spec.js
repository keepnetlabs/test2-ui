import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi.vue'

describe('DeleteCustomApi.vue', () => {
  it('has correct component name', () => {
    expect(DeleteCustomApi.name).toBe('DeleteCustomApi')
  })

  it('computed title/subtitle are derived from selected row', () => {
    expect(DeleteCustomApi.computed.getTitle.call({})).toBe('Delete Rest API')
    expect(
      DeleteCustomApi.computed.getSubtitle.call({ selectedRow: { clientName: 'Client A' } })
    ).toBe('Client A')
  })

  it('closeModal emits closeDialog', () => {
    const $emit = jest.fn()
    DeleteCustomApi.methods.closeModal.call({ $emit })
    expect($emit).toHaveBeenCalledWith('closeDialog')
  })

  it('handleDelete emits resource id', () => {
    const $emit = jest.fn()
    DeleteCustomApi.methods.handleDelete.call({
      $emit,
      selectedRow: { resourceId: 'r1' }
    })
    expect($emit).toHaveBeenCalledWith('handleDelete', 'r1')
  })
})
