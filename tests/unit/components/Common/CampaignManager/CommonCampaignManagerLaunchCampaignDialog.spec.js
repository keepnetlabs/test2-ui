import CommonCampaignManagerLaunchCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerLaunchCampaignDialog.vue'

describe('CommonCampaignManagerLaunchCampaignDialog.vue', () => {
  it('has correct component name', () => {
    expect(CommonCampaignManagerLaunchCampaignDialog.name).toBe(
      'CommonCampaignManagerLaunchCampaignDialog'
    )
  })

  it('defines expected static constants', () => {
    const data = CommonCampaignManagerLaunchCampaignDialog.data()
    expect(data.CONSTANTS.icon).toBe('mdi-send')
    expect(data.CONSTANTS.title).toBe('Launch The Campaign')
    expect(data.CONSTANTS.content).toContain('launch this campaign')
  })

  it('handleClose emits on-close', () => {
    const $emit = jest.fn()
    CommonCampaignManagerLaunchCampaignDialog.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits on-confirm with item', () => {
    const $emit = jest.fn()
    const item = { resourceId: 'c1' }
    CommonCampaignManagerLaunchCampaignDialog.methods.handleConfirm.call({ $emit, item })
    expect($emit).toHaveBeenCalledWith('on-confirm', item)
  })
})
