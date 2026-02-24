import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportBotActivityAlertBox from '@/components/CampaignManagerReport/CampaignManagerReportBotActivityAlertBox'

describe('CampaignManagerReportBotActivityAlertBox.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportBotActivityAlertBox, {
      localVue,
      propsData: { botActivityCount: 5, isShowSandbox: false, ...propsData },
      stubs: { AlertBox: true, VIcon: true },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportBotActivityAlertBox')
    })

    it('should render AlertBox component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AlertBox' }).exists()).toBe(true)
    })

    it('should render main container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept botActivityCount prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.botActivityCount).toBe(5)
    })

    it('should accept isShowSandbox prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowSandbox).toBe(false)
    })

    it('botActivityCount should have default value 0', () => {
      const wrapper = mountComponent({ botActivityCount: undefined })
      expect(wrapper.vm.botActivityCount).toBe(0)
    })

    it('isShowSandbox should have default value false', () => {
      const wrapper = mountComponent({ isShowSandbox: undefined })
      expect(wrapper.vm.isShowSandbox).toBe(false)
    })
  })

  describe('Content Display', () => {
    it('should display bot activity count', () => {
      const wrapper = mountComponent({ botActivityCount: 3 })
      expect(wrapper.text()).toContain('3')
    })

    it('should display "user" for single bot activity', () => {
      const wrapper = mountComponent({ botActivityCount: 1 })
      expect(wrapper.text()).toContain('1 user')
    })

    it('should display "users" for multiple bot activities', () => {
      const wrapper = mountComponent({ botActivityCount: 5 })
      expect(wrapper.text()).toContain('users')
    })

    it('should display "detected with bot activity" text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('detected with bot activity')
    })

    it('should display SHOW BOT ACTIVITY text when isShowSandbox is false', () => {
      const wrapper = mountComponent({ isShowSandbox: false })
      expect(wrapper.text()).toContain('SHOW BOT ACTIVITY')
    })

    it('should display HIDE BOT ACTIVITY text when isShowSandbox is true', () => {
      const wrapper = mountComponent({ isShowSandbox: true })
      expect(wrapper.text()).toContain('HIDE BOT ACTIVITY')
    })
  })

  describe('Methods', () => {
    it('should have handleShowBotActivity method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleShowBotActivity).toBe('function')
    })
  })

  describe('Event Emissions', () => {
    it('should emit on-activity-change when clicking show bot activity', async () => {
      const wrapper = mountComponent({ isShowSandbox: false })
      await wrapper.vm.handleShowBotActivity()
      expect(wrapper.emitted('on-activity-change')).toBeTruthy()
    })

    it('should emit on-activity-change when clicking hide bot activity', async () => {
      const wrapper = mountComponent({ isShowSandbox: true })
      await wrapper.vm.handleShowBotActivity()
      expect(wrapper.emitted('on-activity-change')).toBeTruthy()
    })

    it('should emit on-activity-change with correct count', async () => {
      const wrapper = mountComponent({ botActivityCount: 10 })
      await wrapper.vm.handleShowBotActivity()
      expect(wrapper.emitted('on-activity-change')).toHaveLength(1)
    })
  })

  describe('Toggle State', () => {
    it('should toggle between show and hide states', async () => {
      const wrapper = mountComponent({ isShowSandbox: false })
      expect(wrapper.text()).toContain('SHOW BOT ACTIVITY')

      await wrapper.setProps({ isShowSandbox: true })
      expect(wrapper.text()).toContain('HIDE BOT ACTIVITY')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent alert instances', () => {
      const wrapper1 = mountComponent({ botActivityCount: 5 })
      const wrapper2 = mountComponent({ botActivityCount: 10 })

      expect(wrapper1.vm.botActivityCount).toBe(5)
      expect(wrapper2.vm.botActivityCount).toBe(10)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero bot activity count', () => {
      const wrapper = mountComponent({ botActivityCount: 0 })
      expect(wrapper.text()).toContain('0 user')
    })

    it('should handle large bot activity count', () => {
      const wrapper = mountComponent({ botActivityCount: 1000 })
      expect(wrapper.text()).toContain('1000')
    })

    it('should handle negative bot activity count gracefully', () => {
      const wrapper = mountComponent({ botActivityCount: -1 })
      expect(wrapper.vm.botActivityCount).toBe(-1)
    })
  })

  describe('Alert Box Integration', () => {
    it('should render AlertBox component with props', () => {
      const wrapper = mountComponent()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.exists()).toBe(true)
    })

    it('should have correct styling on container', () => {
      const wrapper = mountComponent()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.attributes('style')).toBeDefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render alert with toggle functionality', async () => {
      const wrapper = mountComponent({ botActivityCount: 5, isShowSandbox: false })

      expect(wrapper.vm.botActivityCount).toBe(5)
      expect(wrapper.vm.isShowSandbox).toBe(false)
      expect(wrapper.text()).toContain('SHOW BOT ACTIVITY')

      await wrapper.vm.handleShowBotActivity()
      expect(wrapper.emitted('on-activity-change')).toBeTruthy()
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
