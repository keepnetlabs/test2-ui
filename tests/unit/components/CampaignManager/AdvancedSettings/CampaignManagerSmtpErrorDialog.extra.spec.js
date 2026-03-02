import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog.vue'

describe('CampaignManagerSmtpErrorDialog.vue (extra emit branches)', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      $emit: jest.fn()
    }
  })

  it('handleClose emits on-close event', () => {
    CampaignManagerSmtpErrorDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits on-confirm event', () => {
    CampaignManagerSmtpErrorDialog.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-confirm')
  })
})
