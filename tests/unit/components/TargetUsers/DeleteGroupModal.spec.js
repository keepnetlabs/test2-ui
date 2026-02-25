import DeleteGroupModal from '@/components/TargetUsers/DeleteGroupModal.vue'

describe('DeleteGroupModal.vue', () => {
  it('getGroupName returns name for Object selectedRow', () => {
    const ctx = { selectedRow: { name: 'Group A' } }
    expect(DeleteGroupModal.computed.getGroupName.call(ctx)).toBe('Group A')
  })

  it('getGroupName returns single name for Array with one item', () => {
    const ctx = { selectedRow: [{ name: 'Group B' }] }
    expect(DeleteGroupModal.computed.getGroupName.call(ctx)).toBe('Group B')
  })

  it('getGroupName returns count for Array with multiple items', () => {
    const ctx = { selectedRow: [{ name: 'A' }, { name: 'B' }] }
    expect(DeleteGroupModal.computed.getGroupName.call(ctx)).toBe('2 groups')
  })

  it('changeDeleteGroupStatus emits changeDeleteGroupModalStatus', () => {
    const ctx = { $emit: jest.fn() }
    DeleteGroupModal.methods.changeDeleteGroupStatus.call(ctx, false)
    expect(ctx.$emit).toHaveBeenCalledWith('changeDeleteGroupModalStatus', false)
  })
})
