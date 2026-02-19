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

  describe('Component Structure', () => {
    it('component name is AlertBox', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('AlertBox')
    })

    it('component is a Vue instance', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm._isVue).toBe(true)
    })

    it('component has required element structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box').exists()).toBe(true)
    })

    it('renders as div element', () => {
      const wrapper = mountComponent()
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('has proper component data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.text).toBeDefined()
      expect(wrapper.vm.iconName).toBeDefined()
      expect(wrapper.vm.iconColor).toBeDefined()
    })
  })

  describe('Prop Default Values', () => {
    it('text prop defaults correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.text).toBe('Alert Message')
    })

    it('iconName prop has default value', () => {
      const wrapper = mountComponent({ iconName: undefined })
      expect(wrapper.vm.iconName).toBeDefined()
    })

    it('iconColor prop has default value', () => {
      const wrapper = mountComponent({ iconColor: undefined })
      expect(wrapper.vm.iconColor).toBeDefined()
    })

    it('slots object initializes correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.slots).toBeDefined()
    })
  })

  describe('Dynamic Prop Updates', () => {
    it('responds to text prop changes', async () => {
      const wrapper = mountComponent({ text: 'Original' })
      expect(wrapper.text()).toContain('Original')

      await wrapper.setProps({ text: 'Updated' })
      expect(wrapper.text()).toContain('Updated')
    })

    it('responds to iconName prop changes', async () => {
      const wrapper = mountComponent({ iconName: 'mdi-alert' })
      expect(wrapper.vm.iconName).toBe('mdi-alert')

      await wrapper.setProps({ iconName: 'mdi-check' })
      expect(wrapper.vm.iconName).toBe('mdi-check')
    })

    it('responds to iconColor prop changes', async () => {
      const wrapper = mountComponent({ iconColor: 'red' })
      expect(wrapper.find('.v-icon-stub').attributes('data-color')).toBe('red')

      await wrapper.setProps({ iconColor: 'blue' })
      expect(wrapper.find('.v-icon-stub').attributes('data-color')).toBe('blue')
    })

    it('handles rapid prop updates', async () => {
      const wrapper = mountComponent({ text: 'Initial' })

      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ text: `Update ${i}` })
        expect(wrapper.text()).toContain(`Update ${i}`)
      }
    })

    it('maintains consistency during batch updates', async () => {
      const wrapper = mountComponent()

      await wrapper.setProps({
        text: 'New Alert',
        iconName: 'mdi-warning',
        iconColor: 'warning'
      })

      expect(wrapper.text()).toContain('New Alert')
      expect(wrapper.vm.iconName).toBe('mdi-warning')
      expect(wrapper.vm.iconColor).toBe('warning')
    })
  })

  describe('Styling and CSS Classes', () => {
    it('applies alert-box class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.alert-box').exists()).toBe(true)
    })

    it('renders icon with color attribute', () => {
      const wrapper = mountComponent({ iconColor: 'red' })
      const icon = wrapper.find('.v-icon-stub')
      expect(icon.exists()).toBe(true)
      expect(icon.attributes('data-color')).toBe('red')
    })

    it('has actions container when hasAction is true', () => {
      const wrapper = mountComponent({ slots: { primaryAction: true } })
      expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
    })

    it('applies correct classes based on props', () => {
      const wrapper = mountComponent({ iconColor: 'success' })
      expect(wrapper.vm.iconColor).toBe('success')
    })

    it('handles multiple CSS class scenarios', () => {
      const wrapper = mountComponent()
      expect(wrapper.classes()).toContain('alert-box')
    })
  })

  describe('Slot Management', () => {
    it('supports text slot override', () => {
      const wrapper = shallowMount(AlertBox, {
        localVue,
        vuetify,
        propsData: { text: 'Default' },
        stubs,
        slots: {
          text: '<span class="custom-text">Custom Text</span>'
        }
      })

      expect(wrapper.find('.custom-text').text()).toBe('Custom Text')
    })

    it('supports primaryAction slot', () => {
      const wrapper = shallowMount(AlertBox, {
        localVue,
        vuetify,
        propsData: { text: 'Alert', slots: { primaryAction: true } },
        stubs,
        slots: {
          primaryAction: '<button class="primary">OK</button>'
        }
      })

      expect(wrapper.find('.primary').text()).toBe('OK')
    })

    it('supports secondaryAction slot', () => {
      const wrapper = shallowMount(AlertBox, {
        localVue,
        vuetify,
        propsData: { text: 'Alert', slots: { secondaryAction: true } },
        stubs,
        slots: {
          secondaryAction: '<button class="secondary">Cancel</button>'
        }
      })

      expect(wrapper.find('.secondary').text()).toBe('Cancel')
    })

    it('hasAction computes correctly with multiple actions', () => {
      const wrapper = mountComponent({
        slots: { primaryAction: true, secondaryAction: true }
      })

      expect(wrapper.vm.hasAction).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('multiple instances maintain independent state', () => {
      const wrapper1 = mountComponent({ text: 'Alert 1', iconColor: 'red' })
      const wrapper2 = mountComponent({ text: 'Alert 2', iconColor: 'blue' })

      expect(wrapper1.vm.text).toBe('Alert 1')
      expect(wrapper2.vm.text).toBe('Alert 2')
      expect(wrapper1.vm.iconColor).toBe('red')
      expect(wrapper2.vm.iconColor).toBe('blue')
    })

    it('updating one instance does not affect others', async () => {
      const wrapper1 = mountComponent({ text: 'Alert 1' })
      const wrapper2 = mountComponent({ text: 'Alert 2' })

      await wrapper1.setProps({ text: 'Updated Alert 1' })

      expect(wrapper1.text()).toContain('Updated Alert 1')
      expect(wrapper2.text()).toContain('Alert 2')
    })

    it('can create many instances without errors', () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        wrappers.push(mountComponent({ text: `Alert ${i}` }))
      }

      expect(wrappers).toHaveLength(10)
      wrappers.forEach((w, i) => {
        expect(w.vm.text).toBe(`Alert ${i}`)
      })
    })

    it('each instance has independent icon colors', () => {
      const colors = ['red', 'blue', 'green', 'yellow']
      const wrappers = colors.map(color => mountComponent({ iconColor: color }))

      wrappers.forEach((w, i) => {
        expect(w.vm.iconColor).toBe(colors[i])
      })
    })
  })

  describe('Performance Characteristics', () => {
    it('component mounts quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('prop updates are fast', async () => {
      const wrapper = mountComponent()
      const start = Date.now()

      for (let i = 0; i < 100; i++) {
        await wrapper.setProps({ text: `Alert ${i}` })
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(1000)
    })

    it('multiple instances can be created efficiently', () => {
      const start = Date.now()
      const wrappers = []

      for (let i = 0; i < 50; i++) {
        wrappers.push(mountComponent({ text: `Alert ${i}` }))
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(3000)

      wrappers.forEach((wrapper) => wrapper.destroy())
    })

    it('handles lifecycle cycles without errors', () => {
      for (let i = 0; i < 10; i++) {
        const wrapper = mountComponent({ text: `Alert ${i}` })
        expect(wrapper.vm).toBeDefined()
        expect(() => wrapper.destroy()).not.toThrow()
      }
    })
  })

  describe('Integration Scenarios', () => {
    it('displays error alert workflow', () => {
      const wrapper = mountComponent({
        text: 'An error occurred',
        iconColor: 'error',
        iconName: 'mdi-alert'
      })

      expect(wrapper.text()).toContain('An error occurred')
      expect(wrapper.vm.iconColor).toBe('error')
    })

    it('displays success alert workflow', () => {
      const wrapper = mountComponent({
        text: 'Operation successful',
        iconColor: 'success',
        iconName: 'mdi-check'
      })

      expect(wrapper.text()).toContain('Operation successful')
      expect(wrapper.vm.iconColor).toBe('success')
    })

    it('handles alert with action button', () => {
      const wrapper = shallowMount(AlertBox, {
        localVue,
        vuetify,
        propsData: {
          text: 'Confirm action?',
          slots: { primaryAction: true }
        },
        stubs,
        slots: {
          primaryAction: '<button>Confirm</button>'
        }
      })

      expect(wrapper.text()).toContain('Confirm action?')
      expect(wrapper.find('button').text()).toBe('Confirm')
      expect(wrapper.vm.hasAction).toBe(true)
    })

    it('handles alert state transitions', async () => {
      const wrapper = mountComponent({
        text: 'Initial alert',
        iconColor: 'info'
      })

      // Transition to error state
      await wrapper.setProps({
        text: 'Error occurred',
        iconColor: 'error'
      })

      expect(wrapper.text()).toContain('Error occurred')
      expect(wrapper.vm.iconColor).toBe('error')

      // Transition back to success
      await wrapper.setProps({
        text: 'Resolved',
        iconColor: 'success'
      })

      expect(wrapper.text()).toContain('Resolved')
      expect(wrapper.vm.iconColor).toBe('success')
    })
  })
})
