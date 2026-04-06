import CommonCampaignManagerCancelCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCancelCampaignDialog.vue'

describe('CommonCampaignManagerCancelCampaignDialog.vue (extra branching)', () => {
  it('handleConfirm emits on-confirm with item even when item is undefined', () => {
    const $emit = jest.fn()
    CommonCampaignManagerCancelCampaignDialog.methods.handleConfirm.call({
      $emit,
      item: undefined
    })
    expect($emit).toHaveBeenCalledWith('on-confirm', undefined)
  })

  it('CONSTANTS use cancel icon and copy', () => {
    const { CONSTANTS } = CommonCampaignManagerCancelCampaignDialog.data()
    expect(CONSTANTS.icon).toBe('mdi-close')
    expect(CONSTANTS.content).toMatch(/cancel this campaign/i)
  })
})
