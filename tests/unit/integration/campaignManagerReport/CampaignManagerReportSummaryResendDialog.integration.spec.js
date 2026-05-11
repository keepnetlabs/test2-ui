/**
 * Özet rapor `CampaignManagerReportSummaryResendDialog`: gerçek `AppDialog` + `labels` başlığı,
 * senaryo alt başlığı, seçenek metinleri ve `changeStatus(false)` → `on-close`.
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryResendDialog from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryResendDialog.vue'
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'

const localVue = createLocalVue()

const shellStubs = {
  'v-tooltip': {
    template: '<div><slot name="activator" :on="{}" /><slot /></div>'
  },
  'v-checkbox': {
    props: ['disabled'],
    template:
      '<div class="cb-stub" :data-disabled="disabled"><slot name="label" /></div>'
  },
  AppDialogFooter: {
    name: 'AppDialogFooter',
    template: '<div class="footer-stub" />'
  },
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

describe('CampaignManagerReportSummaryResendDialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountDialog(props = {}) {
    return mount(CampaignManagerReportSummaryResendDialog, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        phishingScenarioName: 'Password reset template',
        items: {
          notDelivered: 1,
          openedEmail: 2,
          clickedEmail: 3,
          submittedEmail: 0,
          mfa: 0,
          attachmentOpenedEmail: 0,
          noResponseEmail: 0
        },
        ...props
      },
      stubs: shellStubs
    })
  }

  it('shows resend title from labels, scenario subtitle, and audience counts in checkbox labels', () => {
    const wrapper = mountDialog()

    const text = wrapper.text()
    expect(text).toContain(labels.ResendCampaign)
    expect(text).toContain('Password reset template')
    expect(text).toMatch(/Clicked phishing link\s*\(\s*3\s*\)/)
    expect(text).toMatch(/Only opened email\s*\(\s*2\s*\)/)
  })

  it('disables confirm when no types selected (real computed)', () => {
    const wrapper = mountDialog()
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)

    wrapper.vm.types = [2]
    expect(wrapper.vm.getActionButtonDisabled).toBe(false)
  })

  it('forces confirm disabled when isActionButtonDisabled prop is true', () => {
    const wrapper = mountDialog({ isActionButtonDisabled: true })
    wrapper.vm.types = [1, 2]
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)
  })

  it('emits on-close when AppDialog closes', () => {
    const wrapper = mountDialog()
    const appDialog = wrapper.findComponent(AppDialog)
    appDialog.vm.changeStatus(false)
    expect(wrapper.emitted('on-close')).toEqual([[]])
  })
})
