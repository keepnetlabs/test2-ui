import { shallowMount } from '@vue/test-utils'
import CampaignReportsDeleteDialog from '@/components/CampaignReports/CampaignReportsDeleteDialog.vue'

describe('CampaignReportsDeleteDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignReportsDeleteDialog, {
      propsData: {
        status: true,
        item: { id: 1, name: 'Report Run' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('closeModal emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleDelete emits on-delete with item', () => {
    const item = { id: 2, name: 'Run 2' }
    const wrapper = createWrapper({ item })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('on-delete')).toEqual([[item]])
  })
})
