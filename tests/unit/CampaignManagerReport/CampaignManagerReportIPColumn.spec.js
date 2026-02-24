import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn'
import { UNUSUAL_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerReportIPColumn.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportIPColumn, {
      localVue,
      propsData: {
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: 0 } },
        ...propsData
      },
      stubs: { VIcon: true, VTooltip: true },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportIPColumn')
    })

    it('should render span element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept scope prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope).toBeDefined()
    })

    it('should contain userIpAddressList in scope.row', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope.row.userIpAddressList).toBeDefined()
    })
  })

  describe('IP Address Display', () => {
    it('should display IP address from scope.row', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('192.168.1.1')
    })

    it('should display multiple IP addresses', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1, 10.0.0.1', sandBoxType: 0 } }
      })
      expect(wrapper.text()).toContain('192.168.1.1, 10.0.0.1')
    })

    it('should handle IPv6 addresses', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', sandBoxType: 0 } }
      })
      expect(wrapper.text()).toContain('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
    })
  })

  describe('Tooltip Display', () => {
    it('should not render tooltip when no sandbox type', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: 0 } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should not render tooltip when sandBoxType is undefined', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1' } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should render tooltip for honeypot detection', () => {
      const honeypotBit = 1 << UNUSUAL_TYPES.HONEYPOT
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: honeypotBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should render tooltip for IP detection', () => {
      const ipBit = 1 << UNUSUAL_TYPES.IP
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: ipBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should display honeypot tooltip message', () => {
      const honeypotBit = 1 << UNUSUAL_TYPES.HONEYPOT
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: honeypotBit } }
      })
      expect(wrapper.text()).toContain('A bot has clicked the Honeypot link')
    })
  })

  describe('Computed Properties', () => {
    it('should have isRenderTooltip computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isRenderTooltip).toBe('boolean')
    })

    it('isRenderTooltip should be false for sandBoxType 0', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: 0 } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(false)
    })

    it('isRenderTooltip should be false for normal activity', () => {
      const normalActivityBit = 1 << 7
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: normalActivityBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(false)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent column instances', () => {
      const wrapper1 = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: 0 } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { userIpAddressList: '10.0.0.1', sandBoxType: 1 } }
      })

      expect(wrapper1.text()).toContain('192.168.1.1')
      expect(wrapper2.text()).toContain('10.0.0.1')
    })
  })

  describe('Binary Bit Manipulation', () => {
    it('should correctly parse binary representation', () => {
      const ipBit = 1 << UNUSUAL_TYPES.IP
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: ipBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should handle combined bit flags', () => {
      const ipBit = 1 << UNUSUAL_TYPES.IP
      const honeypotBit = 1 << UNUSUAL_TYPES.HONEYPOT
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: ipBit | honeypotBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should handle large sandBoxType values', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: 255 } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty IP address list', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '', sandBoxType: 0 } }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle null IP address', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: null, sandBoxType: 0 } }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle undefined scope.row.sandBoxType', () => {
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1' } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(false)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: display IP with bot detection', () => {
      const honeypotBit = 1 << UNUSUAL_TYPES.HONEYPOT
      const wrapper = mountComponent({
        scope: { row: { userIpAddressList: '192.168.1.1', sandBoxType: honeypotBit } }
      })

      expect(wrapper.text()).toContain('192.168.1.1')
      expect(wrapper.vm.isRenderTooltip).toBe(true)
      expect(wrapper.text()).toContain('A bot has clicked the Honeypot link')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
