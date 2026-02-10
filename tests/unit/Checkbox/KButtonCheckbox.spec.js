import { createLocalVue, shallowMount } from '@vue/test-utils'
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox.vue'
import Vuetify from 'vuetify'

describe('KButtonCheckbox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KButtonCheckbox, {
      localVue,
      vuetify,
      propsData: {
        label: 'Test Label',
        value: false,
        ...propsData
      },
      stubs: {
        'v-btn': {
            template: '<button class="v-btn-mock" @click="$emit(\'click\')"><slot /></button>'
        },
        'v-icon': {
          template: '<i class="v-icon-stub"></i>'
        }
      }
    })
  }

  it('renders label', () => {
    const wrapper = mountComponent({ label: 'Check Me' })
    expect(wrapper.text()).toContain('Check Me')
  })

  it('emits toggled value on click', async () => {
    const wrapper = mountComponent({ value: false })
    await wrapper.find('.v-btn-mock').trigger('click')
    expect(wrapper.emitted('input')[0]).toEqual([true])
  })

  it('emits toggled value on click (from true to false)', async () => {
    const wrapper = mountComponent({ value: true })
    await wrapper.find('.v-btn-mock').trigger('click')
    expect(wrapper.emitted('input')[0]).toEqual([false])
  })

  it('applies custom styles', () => {
    const wrapper = mountComponent({ customStyle: 'color: red;' })
    expect(wrapper.find('.v-btn-mock').attributes('style')).toContain('color: red;')
  })

  it('renders icon when value is true', () => {
    const wrapper = mountComponent({ value: true })
    expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('displays correct state based on value prop', () => {
    const wrapper = mountComponent({ value: false })
    expect(wrapper.vm.$props.value).toBe(false)

    const wrapper2 = mountComponent({ value: true })
    expect(wrapper2.vm.$props.value).toBe(true)
  })

  it('emits input event with correct payload', async () => {
    const wrapper = mountComponent({ value: false })
    await wrapper.find('.v-btn-mock').trigger('click')

    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)
    expect(emitted[0][0]).toBe(true)
  })

  it('handles multiple consecutive clicks', async () => {
    const wrapper = mountComponent({ value: false })

    await wrapper.find('.v-btn-mock').trigger('click')
    expect(wrapper.emitted('input')[0][0]).toBe(true)

    // Note: real implementation would use v-model to update, but testing emitted event
    const emittedEvents = wrapper.emitted('input')
    expect(emittedEvents.length).toBe(1)
  })

  it('applies default label when provided', () => {
    const customLabel = 'Custom Checkbox Label'
    const wrapper = mountComponent({ label: customLabel })
    expect(wrapper.text()).toContain(customLabel)
  })

  describe('Component Rendering', () => {
    it('renders button element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
    })

    it('renders label text', () => {
      const wrapper = mountComponent({ label: 'Test' })
      expect(wrapper.text()).toContain('Test')
    })

    it('renders without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Label Handling', () => {
    it('displays provided label', () => {
      const wrapper = mountComponent({ label: 'Click Me' })
      expect(wrapper.text()).toContain('Click Me')
    })

    it('handles long labels', () => {
      const longLabel = 'This is a very long label for the checkbox button'
      const wrapper = mountComponent({ label: longLabel })
      expect(wrapper.text()).toContain(longLabel)
    })

    it('handles labels with special characters', () => {
      const wrapper = mountComponent({ label: 'Check @special #chars!' })
      expect(wrapper.text()).toContain('@special #chars!')
    })

    it('updates label when prop changes', async () => {
      const wrapper = mountComponent({ label: 'First' })
      expect(wrapper.text()).toContain('First')

      await wrapper.setProps({ label: 'Second' })
      expect(wrapper.text()).toContain('Second')
    })
  })

  describe('Value State', () => {
    it('accepts false as initial value', () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.props('value')).toBe(false)
    })

    it('accepts true as initial value', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('displays current value in props', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.vm.$props.value).toBe(true)
    })

    it('reflects value changes', async () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.props('value')).toBe(false)

      await wrapper.setProps({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })
  })

  describe('Icon Rendering', () => {
    it('renders icon component', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('button renders correctly with icon', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('button renders successfully regardless of value', () => {
      const wrapper = mountComponent({ value: false })
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
    })
  })

  describe('Event Emission', () => {
    it('emits input event on button click', async () => {
      const wrapper = mountComponent({ value: false })
      await wrapper.find('.v-btn-mock').trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('toggles value false to true', async () => {
      const wrapper = mountComponent({ value: false })
      await wrapper.find('.v-btn-mock').trigger('click')
      expect(wrapper.emitted('input')[0]).toEqual([true])
    })

    it('toggles value true to false', async () => {
      const wrapper = mountComponent({ value: true })
      await wrapper.find('.v-btn-mock').trigger('click')
      expect(wrapper.emitted('input')[0]).toEqual([false])
    })

    it('emits boolean payload', async () => {
      const wrapper = mountComponent({ value: false })
      await wrapper.find('.v-btn-mock').trigger('click')

      const emitted = wrapper.emitted('input')
      expect(typeof emitted[0][0]).toBe('boolean')
    })

    it('multiple clicks emit multiple events', async () => {
      const wrapper = mountComponent({ value: false })
      const btn = wrapper.find('.v-btn-mock')

      await btn.trigger('click')
      await btn.trigger('click')

      const emitted = wrapper.emitted('input')
      expect(emitted.length).toBe(2)
    })
  })

  describe('Styling', () => {
    it('accepts custom style prop', () => {
      const wrapper = mountComponent({ customStyle: 'color: blue;' })
      const btn = wrapper.find('.v-btn-mock')
      expect(btn.attributes('style')).toContain('color: blue;')
    })

    it('applies multiple style properties', () => {
      const style = 'color: red; background: yellow;'
      const wrapper = mountComponent({ customStyle: style })
      const btn = wrapper.find('.v-btn-mock')
      expect(btn.attributes('style')).toContain('color: red;')
      expect(btn.attributes('style')).toContain('background: yellow;')
    })

    it('handles empty custom style', () => {
      const wrapper = mountComponent({ customStyle: '' })
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts label prop', () => {
      const wrapper = mountComponent({ label: 'Test' })
      expect(wrapper.props('label')).toBe('Test')
    })

    it('accepts value prop', () => {
      const wrapper = mountComponent({ value: true })
      expect(wrapper.props('value')).toBe(true)
    })

    it('accepts customStyle prop', () => {
      const wrapper = mountComponent({ customStyle: 'color: red;' })
      expect(wrapper.props('customStyle')).toBe('color: red;')
    })

    it('handles all props together', () => {
      const props = {
        label: 'Full Props',
        value: true,
        customStyle: 'color: green;'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('label')).toBe('Full Props')
      expect(wrapper.props('value')).toBe(true)
      expect(wrapper.props('customStyle')).toBe('color: green;')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty label string', () => {
      const wrapper = mountComponent({ label: '' })
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
    })

    it('handles null label', () => {
      const wrapper = mountComponent({ label: null })
      expect(wrapper.find('.v-btn-mock').exists()).toBe(true)
    })

    it('handles unicode in label', () => {
      const wrapper = mountComponent({ label: 'Tëst with émojis 🎉' })
      expect(wrapper.text()).toContain('émojis')
    })

    it('handles rapid clicks', async () => {
      const wrapper = mountComponent({ value: false })
      const btn = wrapper.find('.v-btn-mock')

      for (let i = 0; i < 5; i++) {
        await btn.trigger('click')
      }

      const emitted = wrapper.emitted('input')
      expect(emitted.length).toBe(5)
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

    it('maintains state through lifecycle', async () => {
      const wrapper = mountComponent({ value: true, label: 'Test' })

      await wrapper.vm.$nextTick()

      expect(wrapper.props('value')).toBe(true)
      expect(wrapper.props('label')).toBe('Test')
    })

    it('responds to prop updates', async () => {
      const wrapper = mountComponent({ value: false })

      await wrapper.setProps({ value: true })
      expect(wrapper.props('value')).toBe(true)

      await wrapper.setProps({ value: false })
      expect(wrapper.props('value')).toBe(false)
    })
  })
})
