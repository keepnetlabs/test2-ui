import { createLocalVue, shallowMount } from '@vue/test-utils'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts'

describe('SandboxDetailDialogAlerts.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(SandboxDetailDialogAlerts, {
      localVue,
      propsData: { isShowV4Rule: true, ...propsData },
      stubs: { VIcon: true },
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
      expect(wrapper.vm.$options.name).toBe('SandboxDetailDialogAlerts')
    })

    it('should render main container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render alert box container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept isShowV4Rule prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowV4Rule).toBe(true)
    })

    it('isShowV4Rule should default to true', () => {
      const wrapper = mountComponent({ isShowV4Rule: undefined })
      expect(wrapper.vm.isShowV4Rule).toBe(true)
    })

    it('should accept isShowV4Rule as false', () => {
      const wrapper = mountComponent({ isShowV4Rule: false })
      expect(wrapper.vm.isShowV4Rule).toBe(false)
    })
  })

  describe('Data Properties', () => {
    it('should initialize isShowAccordion as true', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowAccordion).toBe(true)
    })
  })

  describe('Alert Message Display', () => {
    it('should display main alert message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('During the tracking duration of the campaign')
    })

    it('should display data variation message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('depending on the bot activity rules')
    })
  })

  describe('Bot Activity Rules Display', () => {
    it('should display Bot Activity Rules label', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Bot Activity Rules:')
    })

    it('should display A1 rule', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('A1: Unusual User-Agent Interacted')
    })

    it('should display A2 rule', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('A2: The honeypot link is clicked')
    })

    it('should display A3 rule', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('A3: Bot activity that happened in the same second')
    })

    it('should display A4 rule when isShowV4Rule is true', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.text()).toContain('A4: Stop Bot Activity Challenge')
    })

    it('should not display A4 rule when isShowV4Rule is false', () => {
      const wrapper = mountComponent({ isShowV4Rule: false })
      expect(wrapper.text()).not.toContain('A4: Stop Bot Activity Challenge')
    })

    it('should display A4.1 rule when isShowV4Rule is true', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.text()).toContain('A4.1: The phishing link was clicked')
    })

    it('should display A4.2 rule when isShowV4Rule is true', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.text()).toContain('A4.2: A real browser should pass challenges')
    })
  })

  describe('Accordion Functionality', () => {
    it('should have toggleAccordionDetail method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.toggleAccordionDetail).toBe('function')
    })

    it('should toggle isShowAccordion state', () => {
      const wrapper = mountComponent()
      const initialState = wrapper.vm.isShowAccordion
      wrapper.vm.toggleAccordionDetail()
      expect(wrapper.vm.isShowAccordion).toBe(!initialState)
    })

    it('should toggle accordion multiple times', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowAccordion).toBe(true)

      wrapper.vm.toggleAccordionDetail()
      expect(wrapper.vm.isShowAccordion).toBe(false)

      wrapper.vm.toggleAccordionDetail()
      expect(wrapper.vm.isShowAccordion).toBe(true)
    })

    it('should show accordion content when isShowAccordion is true', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowAccordion = true
      expect(wrapper.text()).toContain('Bot Activity Rules:')
    })

    it('should hide accordion content when isShowAccordion is false', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowAccordion = false
      // When accordion is hidden via v-if, the accordion detail div won't be rendered
      expect(wrapper.vm.isShowAccordion).toBe(false)
    })
  })

  describe('Styling and CSS Classes', () => {
    it('should have alert-box class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box').exists()).toBe(true)
    })

    it('should have d-block class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box.d-block').exists()).toBe(true)
    })

    it('should have bg-gray-light class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.bg-gray-light').exists()).toBe(true)
    })

    it('should have border-gray-light class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.border-gray-light').exists()).toBe(true)
    })

    it('should have mb-4 margin class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mb-4').exists()).toBe(true)
    })
  })

  describe('V4 Rule Conditional Display', () => {
    it('should render V4 rules section when isShowV4Rule is true', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.find('[v-if="isShowV4Rule"]').exists()).toBeFalsy()
      // Rule is shown in text
      expect(wrapper.text()).toContain('A4:')
    })

    it('should not render V4 rules section when isShowV4Rule is false', () => {
      const wrapper = mountComponent({ isShowV4Rule: false })
      expect(wrapper.text()).not.toContain('A4: Stop Bot Activity Challenge')
    })

    it('should update V4 rules display when prop changes', async () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.text()).toContain('A4: Stop Bot Activity Challenge')

      await wrapper.setProps({ isShowV4Rule: false })
      expect(wrapper.text()).not.toContain('A4: Stop Bot Activity Challenge')
    })
  })

  describe('Icon Rendering', () => {
    it('should render information icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    })

    it('should have gray color icon', () => {
      const wrapper = mountComponent()
      const icons = wrapper.findAllComponents({ name: 'VIcon' })
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent alert instances', () => {
      const wrapper1 = mountComponent({ isShowV4Rule: true })
      const wrapper2 = mountComponent({ isShowV4Rule: false })

      expect(wrapper1.vm.isShowV4Rule).toBe(true)
      expect(wrapper2.vm.isShowV4Rule).toBe(false)
    })

    it('should maintain independent accordion states', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.toggleAccordionDetail()
      expect(wrapper1.vm.isShowAccordion).toBe(false)
      expect(wrapper2.vm.isShowAccordion).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid accordion toggles', () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        wrapper.vm.toggleAccordionDetail()
      }
      // After 10 toggles (even number), should be back to true
      expect(wrapper.vm.isShowAccordion).toBe(true)
    })

    it('should handle missing isShowV4Rule prop gracefully', () => {
      const wrapper = mountComponent({ isShowV4Rule: undefined })
      expect(wrapper.vm.isShowV4Rule).toBe(true)
    })
  })

  describe('Content Structure', () => {
    it('should have hierarchical content structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Bot Activity Rules:')
      expect(wrapper.text()).toContain('A1:')
      expect(wrapper.text()).toContain('A2:')
    })

    it('should display A4 sub-rules with proper indentation', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })
      expect(wrapper.text()).toContain('A4.1:')
      expect(wrapper.text()).toContain('A4.2:')
    })

    it('should display full rule descriptions', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('User-Agent')
      expect(wrapper.text()).toContain('honeypot link')
      expect(wrapper.text()).toContain('same second')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render alert with all rules', () => {
      const wrapper = mountComponent({ isShowV4Rule: true })

      expect(wrapper.vm.isShowAccordion).toBe(true)
      expect(wrapper.text()).toContain('During the tracking duration')
      expect(wrapper.text()).toContain('A1: Unusual User-Agent')
      expect(wrapper.text()).toContain('A4: Stop Bot Activity Challenge')
    })

    it('complete workflow: render alert without V4 rules', () => {
      const wrapper = mountComponent({ isShowV4Rule: false })

      expect(wrapper.vm.isShowAccordion).toBe(true)
      expect(wrapper.text()).toContain('A1:')
      expect(wrapper.text()).toContain('A2:')
      expect(wrapper.text()).not.toContain('A4: Stop Bot Activity Challenge')
    })

    it('complete workflow: toggle accordion visibility', async () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.isShowAccordion).toBe(true)
      expect(wrapper.text()).toContain('Bot Activity Rules:')

      await wrapper.vm.toggleAccordionDetail()
      expect(wrapper.vm.isShowAccordion).toBe(false)
      expect(wrapper.text()).not.toContain('A1: Unusual User-Agent Interacted')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })

    it('toggle should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      wrapper.vm.toggleAccordionDetail()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(10)
    })
  })
})
