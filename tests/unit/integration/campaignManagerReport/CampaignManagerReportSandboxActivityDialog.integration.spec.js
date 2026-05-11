/**
 * `CampaignManagerReportSandboxActivityDialog`: onay → `updateSandboxActivity` (`activityType: 1`)
 * ve `on-close(null, true)` zinciri.
 */
jest.mock('@/api/phishingsimulator', () => ({
  updateSandboxActivity: jest.fn(() => Promise.resolve())
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSandboxActivityDialog from '@/components/CampaignManagerReport/CampaignManagerReportSandboxActivityDialog.vue'
import AppDialog from '@/components/AppDialog.vue'
import { updateSandboxActivity } from '@/api/phishingsimulator'

const localVue = createLocalVue()

const shellStubs = {
  AppDialogFooter: { template: '<div />' },
  VDialog: {
    props: ['value'],
    template: '<div v-show="value"><slot /></div>'
  },
  VCard: { template: '<div><slot /></div>' },
  VForm: { template: '<form><slot /></form>' },
  VListItem: { template: '<div><slot /></div>' },
  VListItemTitle: { template: '<div><slot /></div>' },
  VListItemSubtitle: { template: '<div><slot /></div>' },
  VCardActions: { template: '<div><slot /></div>' },
  VIcon: { template: '<span />' }
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSandboxActivityDialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
  })

  it('marks bot activity via API then emits on-close with forceUpdate', async () => {
    const wrapper = mount(CampaignManagerReportSandboxActivityDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'row-bot-1' },
        searchType: 'opened'
      },
      stubs: shellStubs
    })

    expect(wrapper.findComponent(AppDialog).exists()).toBe(true)
    expect(wrapper.text()).toContain('Mark User as Bot Activity')

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(updateSandboxActivity).toHaveBeenCalledWith('row-bot-1', {
      searchType: 'opened',
      activityType: 1
    })
    const last = wrapper.emitted('on-close').pop()
    expect(last[0]).toBeNull()
    expect(last[1]).toBe(true)
  })
})
