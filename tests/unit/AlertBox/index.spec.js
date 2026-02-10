import { createLocalVue, shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'
import Vuetify from 'vuetify'

describe('AlertBox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Stubs
  const stubs = {
      'v-icon': {
          template: '<span class="v-icon-stub" :data-color="color"><slot/></span>',
          props: ['color']
      }
  }
  
  const mountComponent = (propsData = {}) => {
      return shallowMount(AlertBox, {
          localVue,
          vuetify,
          propsData: {
              text: 'Alert Message',
              ...propsData
          },
          stubs
      })
  }
  
  it('renders default text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Alert Message')
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('renders slots when provided', () => {
      const wrapper = shallowMount(AlertBox, {
          localVue,
          vuetify,
          propsData: {
              slots: { primaryAction: true } // trigger hasAction check
          },
          stubs,
          slots: {
              text: '<p>Custom Text</p>',
              primaryAction: '<button>Action</button>'
          }
      })
      
      expect(wrapper.find('p').text()).toBe('Custom Text')
      expect(wrapper.find('button').text()).toBe('Action')
  })

  it('computes hasAction correctly', () => {
      const wrapper = mountComponent({
          slots: { primaryAction: true, secondaryAction: false }
      })
      expect(wrapper.vm.hasAction).toBe(true)
      expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
  })

  it('renders correct icon color', () => {
      const wrapper = mountComponent({ iconColor: 'red' })
      expect(wrapper.find('.v-icon-stub').attributes('data-color')).toBe('red')
  })

  it('renders different icon types', () => {
      const wrapper = mountComponent({ iconName: 'mdi-check' })
      expect(wrapper.vm.iconName).toBe('mdi-check')
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('handles custom iconColor prop', () => {
      const wrapper = mountComponent({ iconColor: '#2196f3' })
      expect(wrapper.find('.v-icon-stub').attributes('data-color')).toBe('#2196f3')
  })

  it('renders secondary action slot when provided', () => {
      const wrapper = shallowMount(AlertBox, {
          localVue,
          vuetify,
          propsData: {
              slots: { secondaryAction: true }
          },
          stubs,
          slots: {
              secondaryAction: '<button class="secondary">Cancel</button>'
          }
      })
      
      expect(wrapper.find('.secondary').text()).toBe('Cancel')
      expect(wrapper.vm.hasAction).toBe(true)
  })

  it('renders with different text variations', () => {
      const variations = [
          'Short text',
          'This is a longer alert message that explains something important to the user',
          ''
      ]

      variations.forEach(text => {
          const wrapper = mountComponent({ text })
          if (text) {
              expect(wrapper.text()).toContain(text)
          }
      })
  })

  describe('Component Props', () => {
    it('accepts text prop', () => {
      const wrapper = mountComponent({ text: 'Test message' })
      expect(wrapper.vm.text).toBe('Test message')
    })

    it('accepts iconName prop', () => {
      const wrapper = mountComponent({ iconName: 'mdi-alert' })
      expect(wrapper.vm.iconName).toBe('mdi-alert')
    })

    it('accepts iconColor prop', () => {
      const wrapper = mountComponent({ iconColor: 'orange' })
      expect(wrapper.vm.iconColor).toBe('orange')
    })
  })

  describe('Alert Box Structure', () => {
    it('renders alert box container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box').exists()).toBe(true)
    })

    it('renders icon when provided', () => {
      const wrapper = mountComponent({ iconName: 'mdi-check' })
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('displays alert with all components', () => {
      const wrapper = mountComponent({ text: 'Alert', iconName: 'mdi-info' })
      expect(wrapper.vm.text).toBe('Alert')
      expect(wrapper.vm.iconName).toBe('mdi-info')
    })
  })

  describe('Text Content Handling', () => {
    it('displays text content correctly', () => {
      const wrapper = mountComponent({ text: 'Important Alert' })
      expect(wrapper.text()).toContain('Important Alert')
    })

    it('handles long text content', () => {
      const longText = 'a'.repeat(200)
      const wrapper = mountComponent({ text: longText })
      expect(wrapper.vm.text.length).toBe(200)
    })

    it('handles special characters in text', () => {
      const specialText = 'Alert: <Important> & Special!'
      const wrapper = mountComponent({ text: specialText })
      expect(wrapper.vm.text).toBe(specialText)
    })
  })

  describe('Icon Customization', () => {
    it('uses default icon when not specified', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('displays custom icon name', () => {
      const wrapper = mountComponent({ iconName: 'mdi-warning' })
      expect(wrapper.vm.iconName).toBe('mdi-warning')
    })

    it('applies icon color correctly', () => {
      const wrapper = mountComponent({ iconColor: 'error' })
      expect(wrapper.vm.iconColor).toBe('error')
    })

    it('handles different icon colors', () => {
      const colors = ['success', 'warning', 'error', 'info']
      colors.forEach(color => {
        const wrapper = mountComponent({ iconColor: color })
        expect(wrapper.vm.iconColor).toBe(color)
      })
    })
  })

  describe('Action Slots', () => {
    it('renders action buttons area when actions provided', () => {
      const wrapper = mountComponent({ slots: { primaryAction: true } })
      expect(wrapper.vm.hasAction).toBe(true)
    })

    it('does not show actions when none provided', () => {
      const wrapper = mountComponent({ slots: {} })
      expect(wrapper.vm.hasAction).toBe(false)
    })

    it('handles primary action slot', () => {
      const wrapper = shallowMount(AlertBox, {
        localVue,
        vuetify,
        propsData: { text: 'Alert', slots: { primaryAction: true } },
        stubs,
        slots: { primaryAction: '<button>Primary</button>' }
      })
      expect(wrapper.find('button').text()).toContain('Primary')
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('preserves props after mount', () => {
      const wrapper = mountComponent({ text: 'Test', iconColor: 'red' })
      expect(wrapper.vm.text).toBe('Test')
      expect(wrapper.vm.iconColor).toBe('red')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty text', () => {
      const wrapper = mountComponent({ text: '' })
      expect(wrapper.vm.text).toBe('')
    })

    it('handles numeric text content', () => {
      const wrapper = mountComponent({ text: '12345' })
      expect(wrapper.vm.text).toBe('12345')
    })

    it('renders without icon name', () => {
      const wrapper = mountComponent({ iconName: '' })
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })
  })
})
