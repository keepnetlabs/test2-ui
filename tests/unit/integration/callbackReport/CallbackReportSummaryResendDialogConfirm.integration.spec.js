/**
 * Callback Summary yeniden gönder diyaloğu `handleConfirm`
 * → `on-confirm` olayı seçilen `REPORT_TABS` değerleriyle yayınlanır.
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CallbackReportSummaryResendDialog from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryResendDialog.vue'
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

const localVue = createLocalVue()

describe('Callback Report Summary resend dialog confirm (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('emits on-confirm with selected tab types', async () => {
    const wrapper = mount(CallbackReportSummaryResendDialog, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        phishingScenarioName: 'Test callback',
        items: {
          notDelivered: 1,
          openedEmail: 2,
          calledBack: 3,
          enteredDigits: 4,
          noResponseEmail: 5
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        },
        VCheckbox: {
          name: 'VCheckbox',
          props: ['value', 'disabled'],
          template: '<div class="v-checkbox-stub" />'
        }
      }
    })

    await wrapper.setData({ types: [REPORT_TABS.OPENED, REPORT_TABS.CALLBACK] })
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')[0][0]).toEqual([REPORT_TABS.OPENED, REPORT_TABS.CALLBACK])
  })
})
