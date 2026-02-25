import TargetUsersRequiredArea from '@/components/TargetUsers/TargetUsersRequiredArea.vue'

describe('TargetUsersRequiredArea.vue', () => {
  it('closeDialog emits close-overlay', () => {
    const ctx = { $emit: jest.fn() }
    TargetUsersRequiredArea.methods.closeDialog.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('close-overlay')
  })
})
