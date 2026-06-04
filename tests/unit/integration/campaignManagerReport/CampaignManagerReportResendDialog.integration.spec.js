/**
 * `CampaignManagerReportResendDialog` + gerçek `AppDialog`: `getResendText` dalları,
 * `changeStatus(false)` → `on-close` (footer stub).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog.vue'
import AppDialog from '@/components/AppDialog.vue'

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

describe('CampaignManagerReportResendDialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountDialog(props = {}) {
    return mount(CampaignManagerReportResendDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        payload: { items: [] },
        resendItemCount: 0,
        ...props
      },
      stubs: shellStubs
    })
  }

  it('uses resendItemCount for body copy when set', () => {
    const wrapper = mountDialog({ resendItemCount: 4 })
    expect(wrapper.text()).toMatch(/4 users/)
  })

  it('falls back to payload.items length when resendItemCount is zero', () => {
    const wrapper = mountDialog({
      resendItemCount: 0,
      payload: { items: ['a', 'b'] }
    })
    expect(wrapper.text()).toMatch(/2 users/)
  })

  it('uses generic copy when no count and no items', () => {
    const wrapper = mountDialog({
      resendItemCount: 0,
      payload: { items: [] }
    })
    expect(wrapper.text()).toContain('the users you selected')
  })

  it('emits on-close when AppDialog signals close', () => {
    const wrapper = mountDialog({ resendItemCount: 1 })
    wrapper.findComponent(AppDialog).vm.changeStatus(false)
    expect(wrapper.emitted('on-close')).toEqual([[]])
  })
})
