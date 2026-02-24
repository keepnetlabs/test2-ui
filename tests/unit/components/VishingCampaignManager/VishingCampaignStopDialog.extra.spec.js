jest.mock('@/api/vishing', () => ({
  stopVishingCampaign: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import VishingCampaignStopDialog from '@/components/VishingCampaignManager/VishingCampaignStopDialog.vue'
import { stopVishingCampaign } from '@/api/vishing'

describe('VishingCampaignStopDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(VishingCampaignStopDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'c1' },
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

  it('handleStop calls stopVishingCampaign and emits on-cancel', async () => {
    const wrapper = createWrapper({ selectedRow: { resourceId: 'r1' } })
    wrapper.vm.handleStop()
    await new Promise((r) => setTimeout(r, 0))

    expect(stopVishingCampaign).toHaveBeenCalledWith('r1')
    expect(wrapper.emitted('on-cancel')).toEqual([[true]])
  })
})
