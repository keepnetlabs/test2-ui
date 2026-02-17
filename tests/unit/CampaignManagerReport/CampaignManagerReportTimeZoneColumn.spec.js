import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn'

describe('CampaignManagerReportTimeZoneColumn.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    scope: {
      row: {
        sendTime: '2025-02-17 10:00',
        localTime: '2025-02-17 14:00'
      }
    },
    isToBeSent: false,
    timeKey: 'sendTime',
    localTimeKey: 'localTime'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportTimeZoneColumn, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportTimeZoneColumn')
    })

    it('should render main container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept scope prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope).toBeDefined()
    })

    it('should accept isToBeSent prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isToBeSent).toBe(false)
    })

    it('should accept timeKey prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.timeKey).toBe('sendTime')
    })

    it('should accept localTimeKey prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.localTimeKey).toBe('localTime')
    })

    it('isToBeSent should default to false', () => {
      const wrapper = mountComponent({ isToBeSent: undefined })
      expect(wrapper.vm.isToBeSent).toBe(false)
    })
  })

  describe('Time Display', () => {
    it('should display time from scope.row using timeKey', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('2025-02-17 10:00')
    })

    it('should display local time from scope.row using localTimeKey', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('2025-02-17 14:00')
    })

    it('should fall back to timeKey when localTimeKey not present', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '10:00' } }
      })
      expect(wrapper.text()).toContain('10:00')
    })

    it('should use localTime when available', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '10:00', localTime: '14:00' } }
      })
      expect(wrapper.text()).toContain('14:00')
    })
  })

  describe('Tooltip Display', () => {
    it('should not render tooltip when isToBeSent is false', () => {
      const wrapper = mountComponent({ isToBeSent: false })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should render tooltip when isToBeSent is true', () => {
      const wrapper = mountComponent({ isToBeSent: true })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })

    it('should display "To be sent" tooltip text when isToBeSent', () => {
      const wrapper = mountComponent({ isToBeSent: true })
      expect(wrapper.text()).toContain('To be sent')
    })
  })

  describe('Icon Display', () => {
    it('should render tooltip containing icon when isToBeSent is true', () => {
      const wrapper = mountComponent({ isToBeSent: true })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })

    it('should not render tooltip when isToBeSent is false', () => {
      const wrapper = mountComponent({ isToBeSent: false })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })
  })

  describe('Layout Structure', () => {
    it('should have flex layout', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.d-flex').exists()).toBe(true)
    })

    it('should have flex column for time display', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.d-flex.flex-column').exists()).toBe(true)
    })
  })

  describe('Different Time Formats', () => {
    it('should handle time format: HH:MM', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '14:30' } }
      })
      expect(wrapper.text()).toContain('14:30')
    })

    it('should handle time format: YYYY-MM-DD HH:MM', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '2025-02-17 14:30' } }
      })
      expect(wrapper.text()).toContain('2025-02-17 14:30')
    })

    it('should handle ISO datetime format', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '2025-02-17T14:30:00Z' } }
      })
      expect(wrapper.text()).toContain('2025-02-17T14:30:00Z')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent column instances', () => {
      const wrapper1 = mountComponent({
        scope: { row: { sendTime: '10:00', localTime: '14:00' } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { sendTime: '15:00', localTime: '19:00' } }
      })

      expect(wrapper1.text()).toContain('10:00')
      expect(wrapper2.text()).toContain('15:00')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing scope row', () => {
      const wrapper = mountComponent({
        scope: { row: {} }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle undefined times', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: undefined } }
      })
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should handle empty string times', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '' } }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle null localTime', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '10:00', localTime: null } }
      })
      expect(wrapper.text()).toContain('10:00')
    })
  })

  describe('Tooltip Positioning', () => {
    it('tooltip should have right positioning', () => {
      const wrapper = mountComponent({ isToBeSent: true })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.attributes('right')).toBe('true')
    })

    it('tooltip should have correct opacity', () => {
      const wrapper = mountComponent({ isToBeSent: true })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.attributes('opacity')).toBe('1')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: display sent time with timezone', () => {
      const wrapper = mountComponent({
        scope: { row: { sendTime: '2025-02-17 10:00', localTime: '2025-02-17 14:00' } },
        timeKey: 'sendTime',
        localTimeKey: 'localTime'
      })

      expect(wrapper.text()).toContain('2025-02-17 10:00')
      expect(wrapper.text()).toContain('2025-02-17 14:00')
    })

    it('complete workflow: display pending send with tooltip', () => {
      const wrapper = mountComponent({
        isToBeSent: true,
        scope: { row: { sendTime: '2025-02-18 10:00' } }
      })

      expect(wrapper.text()).toContain('2025-02-18 10:00')
      expect(wrapper.text()).toContain('To be sent')
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
