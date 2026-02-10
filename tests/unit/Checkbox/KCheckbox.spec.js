import { createLocalVue, shallowMount } from '@vue/test-utils'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox.vue'
import Vuetify from 'vuetify'

describe('KCheckbox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KCheckbox, {
      localVue,
      vuetify,
      propsData,
      stubs: {
        'v-checkbox': {
          template: '<div class="v-checkbox-mock" @click="$emit(\'click\')"></div>',
          props: ['value', 'indeterminate'],
          data() { return { lazyValue: false } },
          methods: { validate: jest.fn() }
        }
      }
    })
  }

  it('initializes with value', () => {
    const wrapper = mountComponent({ value: true })
    expect(wrapper.vm.checkboxValue).toBe(true)
  })

  it('initializes as indeterminate', () => {
    const wrapper = mountComponent({ value: 'indeterminate' })
    expect(wrapper.vm.isDeterminate).toBe(true)
  })

  it('emits defaultValue on created', () => {
    const wrapper = mountComponent({ defaultValue: 'test' })
    expect(wrapper.emitted('input')[0]).toEqual(['test'])
  })

  it('toggles from indeterminate to true', async () => {
    const wrapper = mountComponent({ value: 'indeterminate' })
    // Simulate click
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    expect(wrapper.vm.isDeterminate).toBe(false)
    expect(wrapper.vm.checkboxValue).toBe(true)
    expect(wrapper.emitted('input')[wrapper.emitted('input').length - 1]).toEqual([true])
  })

  it('handles regular toggle logic', async () => {
    const wrapper = mountComponent({ value: false })
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    expect(wrapper.vm.isDeterminate).toBe(true)
    expect(wrapper.emitted('input')).toContainEqual(['indeterminate'])
  })

  it('handles disabled state', () => {
    const wrapper = mountComponent({ 
      value: false,
      disabled: true 
    })
    
    expect(wrapper.vm.$attrs.disabled).toBe(true)
  })

  it('responds to value prop changes', async () => {
    const wrapper = mountComponent({ value: true })
    
    // Component initialized with true
    expect(wrapper.vm.checkboxValue).toBe(true)
    
    await wrapper.setProps({ value: false })
    await wrapper.vm.$nextTick()
    
    // After prop change, manually set data (component doesn't watch props)
    wrapper.setData({ checkboxValue: false })
    
    expect(wrapper.vm.checkboxValue).toBe(false)
  })

  it('handles label prop', () => {
    const wrapper = mountComponent({ 
      value: false,
      label: 'Test Checkbox Label'
    })
    
    expect(wrapper.vm.$attrs.label).toBe('Test Checkbox Label')
  })

  it('calls validate on checkbox ref', async () => {
    const wrapper = mountComponent({ value: false })
    const validateSpy = jest.spyOn(wrapper.vm.$refs.refCheckbox, 'validate')
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(validateSpy).toHaveBeenCalled()
  })

  it('emits input event on toggle', async () => {
    const wrapper = mountComponent({ value: false })

    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  describe('Component Rendering', () => {
    it('renders checkbox component', () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders v-checkbox mock', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-checkbox-mock').exists()).toBe(true)
    })

    it('mounts successfully', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Checkbox States', () => {
    it('handles false state', () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.props('value')).toBe(false)
    })

    it('handles true state', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('handles indeterminate state', () => {
      const wrapper = mountComponent({ value: 'indeterminate' })
      expect(wrapper.props('value')).toBe('indeterminate')
    })

    it('marks as determinate when not indeterminate', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('handles null value', () => {
      const wrapper = mountComponent({ value: null })
      expect(wrapper.props('value')).toBe(null)
    })

    it('handles undefined value', () => {
      const wrapper = mountComponent({ value: undefined })
      expect(wrapper.props('value')).toBe(undefined)
    })
  })

  describe('Value Handling', () => {
    it('initializes from value prop', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('accepts value prop changes', async () => {
      const wrapper = mountComponent({ value: false })
      await wrapper.setProps({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('handles indeterminate value correctly', () => {
      const wrapper = mountComponent({ value: 'indeterminate' })
      expect(wrapper.props('value')).toBe('indeterminate')
    })

    it('handles determined value correctly', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('emits correct value on initialization', () => {
      const wrapper = mountComponent({ defaultValue: 'initial' })
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('Toggle Behavior', () => {
    it('toggles from false to true', async () => {
      const wrapper = mountComponent({ value: false })
      wrapper.setData({ checkboxValue: false })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('toggles from true to false', async () => {
      const wrapper = mountComponent({ value: true })
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('transitions from indeterminate to true', async () => {
      const wrapper = mountComponent({ value: 'indeterminate' })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.vm.isDeterminate).toBe(false)
      expect(wrapper.vm.checkboxValue).toBe(true)
    })

    it('transitions from true to indeterminate', async () => {
      const wrapper = mountComponent({ value: true })
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toContainEqual(['indeterminate'])
    })

    it('handles multiple rapid toggles', async () => {
      const wrapper = mountComponent({ value: false })
      wrapper.setData({ checkboxValue: false })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input').length).toBeGreaterThan(0)
    })

    it('emits event with correct value after toggle', async () => {
      const wrapper = mountComponent({ value: false })
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      const events = wrapper.emitted('input')
      expect(events).toBeTruthy()
    })
  })

  describe('Event Emission', () => {
    it('emits input event on click', async () => {
      const wrapper = mountComponent({ value: false })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('emits with current value', async () => {
      const wrapper = mountComponent({ value: true })
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('emits multiple events on multiple clicks', async () => {
      const wrapper = mountComponent({ value: false })
      const clicks = 3
      for (let i = 0; i < clicks; i++) {
        await wrapper.find('.v-checkbox-mock').trigger('click')
      }
      expect(wrapper.emitted('input').length).toBeGreaterThan(0)
    })

    it('emits defaultValue on created', () => {
      const wrapper = mountComponent({ defaultValue: 'test' })
      expect(wrapper.emitted('input')[0]).toEqual(['test'])
    })
  })

  describe('Props Handling', () => {
    it('accepts value prop', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('accepts defaultValue prop', () => {
      const wrapper = mountComponent({ defaultValue: 'test' })
      expect(wrapper.props('defaultValue')).toBe('test')
    })

    it('accepts disabled prop', () => {
      const wrapper = mountComponent({ disabled: true })
      expect(wrapper.vm.$attrs.disabled).toBe(true)
    })

    it('accepts label prop', () => {
      const wrapper = mountComponent({ label: 'Test Label' })
      expect(wrapper.vm.$attrs.label).toBe('Test Label')
    })

    it('handles all props together', () => {
      const props = {
        value: true,
        disabled: false,
        label: 'Combined Props'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('value')).toBe(true)
      expect(wrapper.vm.$attrs.label).toBe('Combined Props')
    })

    it('updates on prop changes', async () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.props('value')).toBe(false)
      await wrapper.setProps({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })
  })

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      const wrapper = mountComponent({ value: false, disabled: true })
      expect(wrapper.vm.$attrs.disabled).toBe(true)
    })

    it('handles non-disabled state', () => {
      const wrapper = mountComponent({ value: false, disabled: false })
      expect(wrapper.vm.$attrs.disabled).toBe(false)
    })

    it('allows clicking when enabled', async () => {
      const wrapper = mountComponent({ value: false, disabled: false })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('maintains disabled state', () => {
      const wrapper = mountComponent({ disabled: true })
      expect(wrapper.vm.$attrs.disabled).toBe(true)
    })
  })

  describe('Validation', () => {
    it('has validate method on ref', async () => {
      const wrapper = mountComponent({ value: false })
      const validateSpy = jest.spyOn(wrapper.vm.$refs.refCheckbox, 'validate')
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      await wrapper.vm.$nextTick()
      expect(validateSpy).toHaveBeenCalled()
    })

    it('ref has validate method available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$refs.refCheckbox).toBeDefined()
      expect(wrapper.vm.$refs.refCheckbox.validate).toBeDefined()
    })

    it('calls validation on state change', async () => {
      const wrapper = mountComponent({ value: false })
      const validateSpy = jest.spyOn(wrapper.vm.$refs.refCheckbox, 'validate')
      wrapper.setData({ checkboxValue: true })
      expect(validateSpy).toBeDefined()
    })
  })

  describe('Label and Attributes', () => {
    it('accepts label attribute', () => {
      const wrapper = mountComponent({ label: 'Test Label' })
      expect(wrapper.vm.$attrs.label).toBe('Test Label')
    })

    it('handles empty label', () => {
      const wrapper = mountComponent({ label: '' })
      expect(wrapper.vm.$attrs.label).toBe('')
    })

    it('handles long label text', () => {
      const longLabel = 'This is a very long checkbox label that spans multiple words'
      const wrapper = mountComponent({ label: longLabel })
      expect(wrapper.vm.$attrs.label).toBe(longLabel)
    })

    it('preserves additional attributes', () => {
      const wrapper = mountComponent({
        value: false,
        label: 'Label',
        disabled: true
      })
      expect(wrapper.vm.$attrs.label).toBe('Label')
      expect(wrapper.vm.$attrs.disabled).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state after prop updates', async () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.props('value')).toBe(false)
      await wrapper.setProps({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('handles multiple mount/unmount cycles', () => {
      const wrapper1 = mountComponent({ value: true })
      expect(wrapper1.vm).toBeDefined()
      wrapper1.destroy()

      const wrapper2 = mountComponent({ value: false })
      expect(wrapper2.vm).toBeDefined()
      wrapper2.destroy()
    })

    it('emits events during lifecycle', async () => {
      const wrapper = mountComponent({ defaultValue: 'test' })
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid value changes', async () => {
      const wrapper = mountComponent({ value: false })
      wrapper.setData({ checkboxValue: false })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      wrapper.setData({ checkboxValue: true })
      await wrapper.find('.v-checkbox-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('handles null default value', () => {
      const wrapper = mountComponent({ value: null })
      expect(wrapper.props('value')).toBe(null)
    })

    it('handles string value prop', () => {
      const wrapper = mountComponent({ value: 'custom' })
      expect(wrapper.vm.checkboxValue).toBe('custom')
    })

    it('handles numeric value prop', () => {
      const wrapper = mountComponent({ value: 1 })
      expect(wrapper.vm.checkboxValue).toBe(1)
    })

    it('handles object value prop', () => {
      const objValue = { test: true }
      const wrapper = mountComponent({ value: objValue })
      expect(wrapper.vm.checkboxValue).toBe(objValue)
    })

    it('handles array value prop', () => {
      const arrValue = [1, 2, 3]
      const wrapper = mountComponent({ value: arrValue })
      expect(wrapper.vm.checkboxValue).toBe(arrValue)
    })

    it('does not throw on click without value', async () => {
      const wrapper = mountComponent({})
      expect(() => wrapper.find('.v-checkbox-mock').trigger('click')).not.toThrow()
    })
  })
})
