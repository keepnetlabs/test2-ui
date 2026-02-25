import CommonCampaignManagerCancelCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCancelCampaignDialog.vue'

describe('CommonCampaignManagerCancelCampaignDialog.vue', () => {
  it('has correct component name', () => {
    expect(CommonCampaignManagerCancelCampaignDialog.name).toBe(
      'CommonCampaignManagerCancelCampaignDialog'
    )
  })

  it('defines expected static constants', () => {
    const data = CommonCampaignManagerCancelCampaignDialog.data()
    expect(data.CONSTANTS.icon).toBe('mdi-close')
    expect(data.CONSTANTS.title).toBe('Cancel The Campaign')
    expect(data.CONSTANTS.content).toContain('cancel this campaign')
  })

  it('handleClose emits on-close', () => {
    const $emit = jest.fn()
    CommonCampaignManagerCancelCampaignDialog.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits on-confirm with current item', () => {
    const $emit = jest.fn()
    const item = { resourceId: 'c1' }
    CommonCampaignManagerCancelCampaignDialog.methods.handleConfirm.call({ $emit, item })
    expect($emit).toHaveBeenCalledWith('on-confirm', item)
  })
})
