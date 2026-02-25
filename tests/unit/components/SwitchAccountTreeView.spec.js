import SwitchAccountTreeView from '@/components/SwitchAccountTreeView.vue'

describe('SwitchAccountTreeView.vue', () => {
  it('handleTreeViewChange emits on-selected-account with payload', () => {
    const item = {
      name: 'Acme Corp',
      resourceId: 'r1',
      privacyDurationId: 'p1',
      licenceExpired: false
    }
    const ctx = { $emit: jest.fn() }
    SwitchAccountTreeView.methods.handleTreeViewChange.call(ctx, item)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selected-account', {
      label: 'Acme Corp',
      id: 'r1',
      privacyDurationId: 'p1',
      licenceExpired: false
    })
  })

  it('data returns menuMaxHeight', () => {
    const data = SwitchAccountTreeView.data()
    expect(data.menuMaxHeight).toBe('300px')
  })
})
