jest.mock('@/api/vishing', () => ({
  launchVishingCampaign: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import VishingCampaignLaunchDialog from '@/components/VishingCampaignManager/VishingCampaignLaunchDialog.vue'
import { launchVishingCampaign } from '@/api/vishing'

describe('VishingCampaignLaunchDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(VishingCampaignLaunchDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'c1', name: 'Campaign' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits on-cancel with forceUpdate', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted('on-cancel')).toEqual([[true]])
  })

  it('handleStop calls launchVishingCampaign and emits on-cancel', async () => {
    const wrapper = createWrapper({
      selectedRow: { resourceId: 'r1' }
    })
    wrapper.vm.handleStop()
    await new Promise((r) => setTimeout(r, 0))

    expect(launchVishingCampaign).toHaveBeenCalledWith('r1')
    expect(wrapper.emitted('on-cancel')).toEqual([[true]])
  })
})
