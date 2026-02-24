jest.mock('@/api/vishing', () => ({
  deleteVishingCampaign: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import DeleteVishingCampaignDialog from '@/components/VishingCampaignManager/DeleteVishingCampaignDialog.vue'
import { deleteVishingCampaign } from '@/api/vishing'

describe('DeleteVishingCampaignDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteVishingCampaignDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'c1', name: 'Campaign A' },
        selectedRowCount: 1,
        isMultiple: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTitle returns single delete text when not multiple', () => {
    const wrapper = createWrapper({ isMultiple: false })
    expect(wrapper.vm.getTitle).toBe('Delete Vishing Campaign?')
  })

  it('getTitle returns count when multiple', () => {
    const wrapper = createWrapper({ isMultiple: true, selectedRowCount: 3 })
    expect(wrapper.vm.getTitle).toBe('Delete 3 campaigns?')
  })

  it('campaignText returns campaign for count 1', () => {
    const wrapper = createWrapper({ selectedRowCount: 1 })
    expect(wrapper.vm.campaignText).toBe('campaign')
  })

  it('campaignText returns campaigns for count > 1', () => {
    const wrapper = createWrapper({ selectedRowCount: 2 })
    expect(wrapper.vm.campaignText).toBe('campaigns')
  })

  it('getContent returns single row text when not multiple', () => {
    const wrapper = createWrapper({ isMultiple: false, selectedRow: { name: 'My Campaign' } })
    expect(wrapper.vm.getContent).toBe('My Campaign will be deleted.')
  })

  it('getContent returns multiple count text when multiple', () => {
    const wrapper = createWrapper({ isMultiple: true, selectedRowCount: 2 })
    expect(wrapper.vm.getContent).toContain('2')
  })

  it('closeModal emits onCancel with forceUpdate', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal(true)
    expect(wrapper.emitted('onCancel')).toEqual([[true]])
  })

  it('handleDelete single calls deleteVishingCampaign and emits onCancel', async () => {
    const wrapper = createWrapper({
      isMultiple: false,
      selectedRow: { resourceId: 'r1', name: 'X' }
    })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(deleteVishingCampaign).toHaveBeenCalledWith('r1')
    expect(wrapper.emitted('onCancel')).toEqual([[true]])
  })
})
