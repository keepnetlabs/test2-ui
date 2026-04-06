import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'

describe('CommonCampaignManagerCreateNewInstanceDialog.vue (extra branching)', () => {
  it('handleConfirm emits on-confirm with resourceId when undefined', () => {
    const $emit = jest.fn()
    CommonCampaignManagerCreateNewInstanceDialog.methods.handleConfirm.call({
      $emit,
      resourceId: undefined
    })
    expect($emit).toHaveBeenCalledWith('on-confirm', undefined)
  })

  it('CONSTANTS use custom icon token and create-run copy', () => {
    const { CONSTANTS } = CommonCampaignManagerCreateNewInstanceDialog.data()
    expect(CONSTANTS.icon).toBe('$custom-new-instance')
    expect(CONSTANTS.content).toMatch(/new run/i)
  })
})
