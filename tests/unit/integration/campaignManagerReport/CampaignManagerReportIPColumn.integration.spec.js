/**
 * `CampaignManagerReportIPColumn`: `sandBoxType` bit maskesi → honeypot/IP için bilgi ikonu
 * (gerçek `UNUSUAL_TYPES` ile).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn.vue'

const localVue = createLocalVue()

describe('CampaignManagerReportIPColumn (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountCol(row) {
    return mount(CampaignManagerReportIPColumn, {
      localVue,
      vuetify,
      propsData: { scope: { row } },
      stubs: {
        'v-tooltip': {
          template: '<div class="tooltip-stub"><slot name="activator" :on="{}" /><slot /></div>'
        },
        VIcon: { template: '<span class="v-icon-stub" />' }
      }
    })
  }

  it('hides honeypot tooltip when sandBoxType is missing or zero', () => {
    expect(mountCol({ userIpAddressList: '10.0.0.1' }).vm.isRenderTooltip).toBe(false)
    expect(mountCol({ userIpAddressList: '10.0.0.1', sandBoxType: 0 }).vm.isRenderTooltip).toBe(false)
  })

  it('shows tooltip when IP bit is set in sandBoxType (e.g. 2)', () => {
    const wrapper = mountCol({ userIpAddressList: '192.168.1.5', sandBoxType: 2 })

    expect(wrapper.vm.isRenderTooltip).toBe(true)
    expect(wrapper.text()).toContain('192.168.1.5')
    expect(wrapper.find('.tooltip-stub').text()).toContain('Honeypot')
  })
})
