/**
 * `CampaignManagerReportHumanActivityDialog`: onay → gerçek `updateSandboxActivity` çağrısı
 * ve başarıda `on-close` (ikinci argüman `forceUpdate`).
 */
jest.mock('@/api/phishingsimulator', () => ({
  updateSandboxActivity: jest.fn(() => Promise.resolve())
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportHumanActivityDialog from '@/components/CampaignManagerReport/CampaignManagerReportHumanActivityDialog.vue'
import AppDialog from '@/components/AppDialog.vue'
import { updateSandboxActivity } from '@/api/phishingsimulator'

const localVue = createLocalVue()

const shellStubs = {
  AppDialogFooter: { template: '<div class="footer-stub" />' },
  VDialog: {
    props: ['value'],
    template: '<div class="v-dialog-stub" v-show="value"><slot /></div>'
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

describe('CampaignManagerReportHumanActivityDialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
  })

  it('calls updateSandboxActivity on confirm then emits on-close with forceUpdate', async () => {
    const wrapper = mount(CampaignManagerReportHumanActivityDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'row-human-1' },
        searchType: 'clicked'
      },
      stubs: shellStubs
    })

    expect(wrapper.findComponent(AppDialog).exists()).toBe(true)
    expect(wrapper.text()).toContain('Mark User as Human Activity')

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(updateSandboxActivity).toHaveBeenCalledWith('row-human-1', {
      searchType: 'clicked',
      activityType: 0
    })
    expect(wrapper.emitted('on-close')).toBeTruthy()
    const lastClose = wrapper.emitted('on-close').pop()
    expect(lastClose[0]).toBeNull()
    expect(lastClose[1]).toBe(true)
  })

  it('emits on-close without forceUpdate when closing from dialog status', () => {
    const wrapper = mount(CampaignManagerReportHumanActivityDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'r2' },
        searchType: 'opened'
      },
      stubs: shellStubs
    })

    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toEqual([[null, false]])
  })
})
