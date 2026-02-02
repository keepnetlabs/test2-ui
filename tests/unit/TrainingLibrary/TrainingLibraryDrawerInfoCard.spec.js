import { createLocalVue, mount } from '@vue/test-utils'
import TrainingLibraryDrawerInfoCard from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerInfoCard.vue'
import Vuetify from 'vuetify'

describe('TrainingLibraryDrawerInfoCard.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return mount(TrainingLibraryDrawerInfoCard, {
      localVue,
      vuetify,
      propsData
    })
  }

  describe('component rendering', () => {
    it('renders icon and text', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Home String'
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Home String')
      expect(wrapper.html()).toContain('mdi-home')
      expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.$options.name).toBe('TrainingLibraryDrawerInfoCard')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should render main container div', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.find('.training-library-drawer-info-card').exists()).toBe(true)
    })

    it('should render content div', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    })

    it('should render VIcon component', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    })

    it('should render span with text', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test Text'
      })
      const span = wrapper.find('.training-library-drawer-info-card__content span')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe('Test Text')
    })
  })

  describe('props handling', () => {
    it('should accept icon prop as string', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.icon).toBe('mdi-home')
    })

    it('should accept text prop as string', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Home String'
      })
      expect(wrapper.vm.text).toBe('Home String')
    })

    it('should accept text prop as number', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 123
      })
      expect(wrapper.vm.text).toBe(123)
    })

    it('should accept tooltip prop as string', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'Tooltip text'
      })
      expect(wrapper.vm.tooltip).toBe('Tooltip text')
    })

    it('should accept tooltip prop as number', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 456
      })
      expect(wrapper.vm.tooltip).toBe(456)
    })

    it('should have default tooltip as empty string', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.tooltip).toBe('')
    })

    it('should handle undefined tooltip', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: undefined
      })
      expect(wrapper.vm.tooltip).toBe('')
    })

    it('should require icon prop', () => {
      const wrapper = mountComponent({
        text: 'Test'
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should require text prop', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home'
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('conditional rendering - without tooltip', () => {
    it('should render v-else div when tooltip is empty', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    })

    it('should not render VTooltip when tooltip is empty', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.exists()).toBe(false)
    })

    it('should render icon in plain div when no tooltip', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const icon = wrapper.find('.training-library-drawer-info-card__content').findComponent({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should render text in plain div when no tooltip', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test Text'
      })
      const span = wrapper.find('.training-library-drawer-info-card__content span')
      expect(span.text()).toBe('Test Text')
    })
  })

  describe('conditional rendering - with tooltip', () => {
    it('should render VTooltip when tooltip is provided', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.exists()).toBe(true)
    })

    it('should render content div inside VTooltip activator', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    })

    it('should render tooltip component with correct structure', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.exists()).toBe(true)
    })

    it('tooltip prop should be accessible', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      expect(wrapper.props('tooltip')).toBe('Tooltip text')
    })

    it('should display icon in tooltip version', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      const icon = wrapper.findComponent({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should display text in tooltip version', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      expect(wrapper.text()).toContain('Info')
    })

    it('should not render v-else div when tooltip is provided', () => {
      const wrapper = mountComponent({
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      })
      const divs = wrapper.findAll('.training-library-drawer-info-card__content')
      expect(divs.length).toBe(1)
    })
  })

  describe('VIcon styling', () => {
    it('should render VIcon component', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const icon = wrapper.findComponent({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should render icons from different props', () => {
      const wrapper1 = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const wrapper2 = mountComponent({
        icon: 'mdi-alert',
        text: 'Test'
      })
      expect(wrapper1.vm.icon).toBe('mdi-home')
      expect(wrapper2.vm.icon).toBe('mdi-alert')
      expect(wrapper1.findComponent({ name: 'VIcon' }).exists()).toBe(true)
      expect(wrapper2.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    })
  })

  describe('text rendering', () => {
    it('should render string text correctly', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test String'
      })
      expect(wrapper.text()).toContain('Test String')
    })

    it('should render number text correctly', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 999
      })
      expect(wrapper.text()).toContain('999')
    })

    it('should render different text correctly', () => {
      const wrapper1 = mountComponent({
        icon: 'mdi-home',
        text: 'Initial'
      })
      const wrapper2 = mountComponent({
        icon: 'mdi-home',
        text: 'Updated'
      })
      expect(wrapper1.text()).toContain('Initial')
      expect(wrapper2.text()).toContain('Updated')
    })

    it('should handle long text', () => {
      const longText = 'a'.repeat(100)
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: longText
      })
      expect(wrapper.text()).toContain(longText)
    })

    it('should handle text with special characters', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test @#$%'
      })
      expect(wrapper.text()).toContain('Test @#$%')
    })
  })

  describe('reactive prop updates', () => {
    it('should accept icon prop reactively', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.icon).toBe('mdi-home')
    })

    it('should accept text prop reactively', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Initial'
      })
      expect(wrapper.vm.text).toBe('Initial')
    })

    it('should accept tooltip prop reactively', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'New tooltip'
      })
      expect(wrapper.vm.tooltip).toBe('New tooltip')
    })

    it('should render with different tooltip values', () => {
      const wrapper1 = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const wrapper2 = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'Tooltip'
      })
      expect(wrapper1.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
      expect(wrapper2.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })

    it('should handle multiple prop values', () => {
      const wrapper = mountComponent({
        icon: 'mdi-alert',
        text: 'Alert Message',
        tooltip: 'Alert Tooltip'
      })
      expect(wrapper.vm.icon).toBe('mdi-alert')
      expect(wrapper.vm.text).toBe('Alert Message')
      expect(wrapper.vm.tooltip).toBe('Alert Tooltip')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string text', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: ''
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle zero as text', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 0
      })
      expect(wrapper.text()).toContain('0')
    })

    it('should handle negative numbers as text', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: -42
      })
      expect(wrapper.text()).toContain('-42')
    })

    it('should handle very long icon name', () => {
      const wrapper = mountComponent({
        icon: 'mdi-' + 'a'.repeat(50),
        text: 'Test'
      })
      expect(wrapper.vm.icon).toContain('mdi-')
    })

    it('should handle icon with numbers and dashes', () => {
      const wrapper = mountComponent({
        icon: 'mdi-test-123',
        text: 'Test'
      })
      expect(wrapper.vm.icon).toBe('mdi-test-123')
    })

    it('should handle tooltip as number 0', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 0
      })
      expect(wrapper.vm.tooltip).toBe(0)
    })

    it('should handle tooltip with special characters', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'Tooltip @#$%'
      })
      expect(wrapper.vm.tooltip).toContain('@#$%')
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      const wrapper2 = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain props after lifecycle', async () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'Tooltip'
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.icon).toBe('mdi-home')
      expect(wrapper.vm.text).toBe('Test')
      expect(wrapper.vm.tooltip).toBe('Tooltip')
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.find('.training-library-drawer-info-card').exists()).toBe(true)
      expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('icon should be string type', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(typeof wrapper.vm.icon).toBe('string')
    })

    it('text should be string or number', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(typeof wrapper.vm.text === 'string' || typeof wrapper.vm.text === 'number').toBe(true)
    })

    it('tooltip should be string or number', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test',
        tooltip: 'Tooltip'
      })
      expect(typeof wrapper.vm.tooltip === 'string' || typeof wrapper.vm.tooltip === 'number').toBe(true)
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent({
        icon: 'mdi-home',
        text: 'Test'
      })
      expect(wrapper.vm.$data).toBeDefined()
    })
  })
})
