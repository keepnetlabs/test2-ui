import DeleteProxySettings from '@/components/Company Settings/ProxySettings/DeleteProxySettings.vue'

describe('DeleteProxySettings.vue', () => {
  it('has correct component name', () => {
    expect(DeleteProxySettings.name).toBe('DeleteProxySettings')
  })

  it('getSubtitle returns proxy name', () => {
    expect(DeleteProxySettings.computed.getSubtitle.call({ data: { name: 'Proxy A' } })).toBe(
      'Proxy A'
    )
  })

  it('handleCloseDialog emits closeOverlay', () => {
    const $emit = jest.fn()
    DeleteProxySettings.methods.handleCloseDialog.call({ $emit })
    expect($emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('handleDelete emits delete payload and closes dialog', () => {
    const $emit = jest.fn()
    const ctx = {
      $emit,
      data: { id: 1 },
      handleCloseDialog: DeleteProxySettings.methods.handleCloseDialog
    }
    DeleteProxySettings.methods.handleDelete.call(ctx)
    expect($emit).toHaveBeenCalledWith('handleDelete', { id: 1 })
    expect($emit).toHaveBeenCalledWith('closeOverlay')
  })
})
