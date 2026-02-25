import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'

describe('CommonCampaignManagerCreateNewInstanceDialog.vue', () => {
  it('has correct component name', () => {
    expect(CommonCampaignManagerCreateNewInstanceDialog.name).toBe(
      'CommonCampaignManagerCreateNewInstanceDialog'
    )
  })

  it('initial data contains default action flags and constants', () => {
    const data = CommonCampaignManagerCreateNewInstanceDialog.data()
    expect(data.isActionButtonDisabled).toBe(false)
    expect(data.isMultipleDelete).toBe(false)
    expect(data.multipleDeletedUserCount).toBe(0)
    expect(data.CONSTANTS.title).toBe('Create New Run')
  })

  it('handleClose emits on-close', () => {
    const $emit = jest.fn()
    CommonCampaignManagerCreateNewInstanceDialog.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits on-confirm with resourceId', () => {
    const $emit = jest.fn()
    CommonCampaignManagerCreateNewInstanceDialog.methods.handleConfirm.call({
      $emit,
      resourceId: 'run-1'
    })
    expect($emit).toHaveBeenCalledWith('on-confirm', 'run-1')
  })
})
