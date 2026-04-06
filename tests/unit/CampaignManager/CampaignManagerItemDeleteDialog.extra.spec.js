import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog.vue'

describe('CampaignManagerItemDeleteDialog.vue (extra methods)', () => {
  it('closeModal emits on-close', () => {
    const emit = jest.fn()
    CampaignManagerItemDeleteDialog.methods.closeModal.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handleDelete emits on-delete with bound item', () => {
    const emit = jest.fn()
    const item = { instanceGroup: 'ig-1', resourceId: 'r1' }
    CampaignManagerItemDeleteDialog.methods.handleDelete.call({ item, $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-delete', item)
  })
})
