import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportUserAgentColumn from '@/components/SmishingReport/CampaignManagerReportUserAgentColumn.vue'

describe('SmishingReport/CampaignManagerReportUserAgentColumn.vue', () => {
  const mountComponent = (scope = {}) =>
    shallowMount(CampaignManagerReportUserAgentColumn, {
      propsData: {
        scope: {
          row: {
            userAgent: 'Mozilla/5.0',
            sandBoxType: 0,
            ...scope.row
          },
          ...scope
        }
      },
      stubs: {
        VTooltip: {
          name: 'VTooltip',
          template: '<div class="tooltip-stub"><slot name="activator" :on="{}" /><slot /></div>'
        },
        VIcon: true
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('CampaignManagerReportUserAgentColumn')
  })

  it('returns false when sandBoxType is missing or zero', () => {
    expect(mountComponent({ row: { sandBoxType: undefined } }).vm.isRenderTooltip).toBe(false)
    expect(mountComponent({ row: { sandBoxType: 0 } }).vm.isRenderTooltip).toBe(false)
  })

  it('returns true when USER_AGENT bit is enabled', () => {
    const wrapper = mountComponent({ row: { sandBoxType: 1 } })
    expect(wrapper.vm.isRenderTooltip).toBe(true)
  })

  it('renders user agent text from scope row', () => {
    const wrapper = mountComponent({ row: { userAgent: 'Agent-X', sandBoxType: 1 } })
    expect(wrapper.text()).toContain('Agent-X')
  })
})

