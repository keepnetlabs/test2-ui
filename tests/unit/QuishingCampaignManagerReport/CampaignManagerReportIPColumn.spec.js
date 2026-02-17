import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportIPColumn from '@/components/QuishingCampaignManagerReport/CampaignManagerReportIPColumn.vue'

describe('QuishingCampaignManagerReport/CampaignManagerReportIPColumn.vue', () => {
  const mountComponent = (scope = {}) =>
    shallowMount(CampaignManagerReportIPColumn, {
      propsData: {
        scope: {
          row: {
            userIpAddressList: '192.168.1.1',
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
    expect(wrapper.vm.$options.name).toBe('CampaignManagerReportIPColumn')
  })

  it('returns false when sandBoxType is missing or zero', () => {
    expect(mountComponent({ row: { sandBoxType: undefined } }).vm.isRenderTooltip).toBe(false)
    expect(mountComponent({ row: { sandBoxType: 0 } }).vm.isRenderTooltip).toBe(false)
  })

  it('returns true when IP or HONEYPOT bits are enabled', () => {
    expect(mountComponent({ row: { sandBoxType: 2 } }).vm.isRenderTooltip).toBe(true)
    expect(mountComponent({ row: { sandBoxType: 4 } }).vm.isRenderTooltip).toBe(true)
  })

  it('renders ip text from scope row', () => {
    const wrapper = mountComponent({ row: { userIpAddressList: '10.0.0.2', sandBoxType: 2 } })
    expect(wrapper.text()).toContain('10.0.0.2')
  })
})

