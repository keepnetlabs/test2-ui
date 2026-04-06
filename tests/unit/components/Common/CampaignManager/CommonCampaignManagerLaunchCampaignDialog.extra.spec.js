import CommonCampaignManagerLaunchCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerLaunchCampaignDialog.vue'

describe('CommonCampaignManagerLaunchCampaignDialog.vue (extra branching)', () => {
  it('handleConfirm emits on-confirm with item even when item is undefined', () => {
    const $emit = jest.fn()
    CommonCampaignManagerLaunchCampaignDialog.methods.handleConfirm.call({
      $emit,
      item: undefined
    })
    expect($emit).toHaveBeenCalledWith('on-confirm', undefined)
  })

  it('CONSTANTS include mdi-send and launch copy', () => {
    const { CONSTANTS } = CommonCampaignManagerLaunchCampaignDialog.data()
    expect(CONSTANTS.icon).toBe('mdi-send')
    expect(CONSTANTS.content).toMatch(/launch this campaign/i)
  })
})
