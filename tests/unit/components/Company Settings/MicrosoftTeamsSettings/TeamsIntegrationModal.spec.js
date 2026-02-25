import TeamsIntegrationModal from '@/components/Company Settings/MicrosoftTeamsSettings/TeamsIntegrationModal.vue'

describe('TeamsIntegrationModal.vue', () => {
  it('has correct component name', () => {
    expect(TeamsIntegrationModal.name).toBe('TeamsIntegrationModal')
  })

  it('emits close/cancel/copy/enable events', () => {
    const ctx = { $emit: jest.fn() }
    TeamsIntegrationModal.methods.handleClose.call(ctx)
    TeamsIntegrationModal.methods.handleCancel.call(ctx)
    TeamsIntegrationModal.methods.handleCopyLink.call(ctx)
    TeamsIntegrationModal.methods.handleEnableNow.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
    expect(ctx.$emit).toHaveBeenCalledWith('on-cancel')
    expect(ctx.$emit).toHaveBeenCalledWith('on-copy-link')
    expect(ctx.$emit).toHaveBeenCalledWith('on-enable')
  })
})
