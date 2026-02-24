import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn'
import { UNUSUAL_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerReportUserAgentColumn.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportUserAgentColumn, {
      localVue,
      propsData: {
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: 0 } },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportUserAgentColumn')
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

    it('should contain userAgent in scope.row', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope.row.userAgent).toBeDefined()
    })
  })

  describe('User Agent Display', () => {
    it('should display user agent from scope.row', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Mozilla/5.0')
    })

    it('should display different user agents', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Chrome/91.0', sandBoxType: 0 } }
      })
      expect(wrapper.text()).toContain('Chrome/91.0')
    })

    it('should display bot user agent string', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Googlebot/2.1', sandBoxType: 0 } }
      })
      expect(wrapper.text()).toContain('Googlebot/2.1')
    })
  })

  describe('Tooltip Display', () => {
    it('should not render tooltip when no sandbox type', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: 0 } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should not render tooltip when sandBoxType is undefined', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0' } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should render tooltip for USER_AGENT detection', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should render tooltip for USER_AGENT_MATCHED detection', () => {
      const userAgentMatchedBit = 1 << UNUSUAL_TYPES.USER_AGENT_MATCHED
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentMatchedBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should display unusual user agent message', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.text()).toContain('Unusual User Agent')
    })

    it('should indicate no email interaction in tooltip', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.text()).toContain('no interaction with the email')
    })
  })

  describe('Computed Properties', () => {
    it('should have isRenderTooltip computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isRenderTooltip).toBe('boolean')
    })

    it('isRenderTooltip should be false for sandBoxType 0', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: 0 } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(false)
    })

    it('isRenderTooltip should be true for USER_AGENT bit set', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('isRenderTooltip should be true for USER_AGENT_MATCHED bit set', () => {
      const userAgentMatchedBit = 1 << UNUSUAL_TYPES.USER_AGENT_MATCHED
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentMatchedBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })
  })

  describe('Multiple Detection Flags', () => {
    it('should detect when both USER_AGENT and USER_AGENT_MATCHED are set', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const userAgentMatchedBit = 1 << UNUSUAL_TYPES.USER_AGENT_MATCHED
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit | userAgentMatchedBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should detect when one of two flags is set', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent column instances', () => {
      const wrapper1 = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: 0 } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { userAgent: 'Chrome/91.0', sandBoxType: 1 << UNUSUAL_TYPES.USER_AGENT } }
      })

      expect(wrapper1.text()).toContain('Mozilla/5.0')
      expect(wrapper2.text()).toContain('Chrome/91.0')
      expect(wrapper1.vm.isRenderTooltip).toBe(false)
      expect(wrapper2.vm.isRenderTooltip).toBe(true)
    })
  })

  describe('Binary Bit Manipulation', () => {
    it('should correctly parse binary representation', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should handle large sandBoxType values', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: 255 } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty user agent', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: '', sandBoxType: 0 } }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle null user agent', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: null, sandBoxType: 0 } }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle long user agent strings', () => {
      const longUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      const wrapper = mountComponent({
        scope: { row: { userAgent: longUA, sandBoxType: 0 } }
      })
      expect(wrapper.text()).toContain('Mozilla/5.0')
    })

    it('should handle undefined scope.row.sandBoxType', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0' } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(false)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: display user agent with unusual detection', () => {
      const userAgentBit = 1 << UNUSUAL_TYPES.USER_AGENT
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0', sandBoxType: userAgentBit } }
      })

      expect(wrapper.text()).toContain('Mozilla/5.0')
      expect(wrapper.vm.isRenderTooltip).toBe(true)
      expect(wrapper.text()).toContain('Unusual User Agent')
    })

    it('complete workflow: display normal user agent without tooltip', () => {
      const wrapper = mountComponent({
        scope: { row: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', sandBoxType: 0 } }
      })

      expect(wrapper.text()).toContain('Mozilla/5.0')
      expect(wrapper.vm.isRenderTooltip).toBe(false)
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
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
