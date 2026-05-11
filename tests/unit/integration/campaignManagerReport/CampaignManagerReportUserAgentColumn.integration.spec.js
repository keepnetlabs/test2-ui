/**
 * `CampaignManagerReportUserAgentColumn`: `sandBoxType` bitleri (`UNUSUAL_TYPES`) ile
 * olağandışı user-agent ipucu (gerçek utils sabitleri).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'

const localVue = createLocalVue()

describe('CampaignManagerReportUserAgentColumn (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountCol(row) {
    return mount(CampaignManagerReportUserAgentColumn, {
      localVue,
      vuetify,
      propsData: { scope: { row } },
      stubs: {
        'v-tooltip': {
          template: '<div class="tooltip-stub"><slot name="activator" :on="{}" /><slot /></div>'
        },
        VIcon: { template: '<span />' }
      }
    })
  }

  it('does not render tooltip when sandBoxType is absent', () => {
    const wrapper = mountCol({ userAgent: 'Mozilla/5.0' })
    expect(wrapper.vm.isRenderTooltip).toBe(false)
    expect(wrapper.text()).toContain('Mozilla/5.0')
    expect(wrapper.find('.tooltip-stub').exists()).toBe(false)
  })

  it('shows unusual user-agent tooltip when USER_AGENT bit is set (sandBoxType 1)', () => {
    const wrapper = mountCol({ userAgent: 'BotUA/1.0', sandBoxType: 1 })
    expect(wrapper.vm.isRenderTooltip).toBe(true)
    expect(wrapper.find('.tooltip-stub').text()).toContain('Unusual User Agent')
  })
})
