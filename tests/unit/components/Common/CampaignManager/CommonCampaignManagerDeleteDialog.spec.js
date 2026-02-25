import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'

describe('CommonCampaignManagerDeleteDialog.vue', () => {
  it('has correct component name', () => {
    expect(CommonCampaignManagerDeleteDialog.name).toBe('CommonCampaignManagerDeleteDialog')
  })

  it('getContent returns single and multiple variants', () => {
    expect(
      CommonCampaignManagerDeleteDialog.computed.getContent.call({
        isMultiple: false,
        item: { name: 'Campaign A' }
      })
    ).toBe('Campaign A will be deleted.')
    expect(
      CommonCampaignManagerDeleteDialog.computed.getContent.call({
        isMultiple: true,
        userCount: 3
      })
    ).toBe('3 campaign(s) will be deleted')
  })

  it('getSubTitle reflects single and multiple delete subtitle', () => {
    expect(
      CommonCampaignManagerDeleteDialog.computed.getSubTitle.call({
        isMultiple: false,
        userCount: 2
      })
    ).toBe('Campaign will deleted permanently')
    expect(
      CommonCampaignManagerDeleteDialog.computed.getSubTitle.call({
        isMultiple: true,
        userCount: 2
      })
    ).toBe('2 campaign(s) will deleted permanently')
  })

  it('closeModal emits on-close', () => {
    const $emit = jest.fn()
    CommonCampaignManagerDeleteDialog.methods.closeModal.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })

  it('handleDelete emits multiple or single delete events', () => {
    const $emit = jest.fn()
    CommonCampaignManagerDeleteDialog.methods.handleDelete.call({ $emit, isMultiple: true })
    expect($emit).toHaveBeenCalledWith('on-multiple-delete')

    const item = { resourceId: 'c1' }
    CommonCampaignManagerDeleteDialog.methods.handleDelete.call({ $emit, isMultiple: false, item })
    expect($emit).toHaveBeenCalledWith('on-delete', item)
  })
})
