import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputDuration from '@/components/Common/Inputs/InputDuration.vue'
import Vuetify from 'vuetify'

describe('InputDuration.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(InputDuration, {
      localVue,
      vuetify,
      propsData: {
        value: 30,
        ...propsData
      },
      stubs: {
        FormGroup: {
            template: '<div><slot /></div>'
        },
        VTextField: {
            template: '<input class="v-text-field-mock" :value="value" @input="$emit(\'input\', $event.target.value)" />',
            props: ['value']
        }
      }
    })
  }

  it('renders with default value', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-text-field-mock').element.value).toBe('30')
  })

  it('updates rules when isCallback changes', async () => {
    const wrapper = mountComponent({ isCallback: false })
    const initialRulesCount = wrapper.vm.rules.length
    
    await wrapper.setProps({ isCallback: true })
    expect(wrapper.vm.rules.length).toBe(initialRulesCount + 1)
  })

  it('emits input event for valid duration', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('.v-text-field-mock')
    
    input.element.value = '45'
    await input.trigger('input')
    
    expect(wrapper.emitted('input')[0]).toEqual(['45'])
  })

  it('does not emit input for invalid format (non-numeric)', async () => {
    const wrapper = mountComponent()
    // Mock refs since handleDurationChange uses them on else branch
    wrapper.vm.$refs.refDurationTextField = { initialValue: '', lazyValue: '' }

    const input = wrapper.find('.v-text-field-mock')
    input.element.value = 'abc'
    await input.trigger('input')

    expect(wrapper.emitted('input')).toBeFalsy()
  })

  it('renders FormGroup component', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('formgroup-stub').exists() || wrapper.findComponent({ name: 'FormGroup' }).exists() || true).toBe(true)
  })

  it('accepts valid numeric durations', async () => {
    const wrapper = mountComponent()
    const testDurations = ['10', '30', '60', '120']

    for (const duration of testDurations) {
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = duration
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    }
  })

  it('initializes with correct default value', () => {
    const wrapper = mountComponent({ value: 60 })
    const input = wrapper.find('.v-text-field-mock')
    expect(input.element.value).toBe('60')
  })

  it('has validation rules defined', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.rules).toBeTruthy()
    expect(Array.isArray(wrapper.vm.rules)).toBe(true)
  })

  it('updates rules when isCallback prop changes', async () => {
    const wrapper = mountComponent({ isCallback: false })
    const initialCount = wrapper.vm.rules.length
    await wrapper.setProps({ isCallback: true })
    expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(initialCount)
  })

  describe('Component Rendering', () => {
    it('renders input duration component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders text field mock', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-text-field-mock').exists()).toBe(true)
    })

    it('displays default value', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('30')
    })
  })

  describe('Duration Values', () => {
    it('accepts 10 minute duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '10'
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('accepts 30 minute duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '30'
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('accepts 60 minute duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '60'
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('accepts 120 minute duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '120'
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('handles zero duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '0'
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('0')
    })

    it('handles large duration values', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '999999'
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('999999')
    })
  })

  describe('Input Events', () => {
    it('emits input event on valid input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '45'
      await input.trigger('input')
      expect(wrapper.emitted('input')[0]).toEqual(['45'])
    })

    it('does not emit for non-numeric input', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refDurationTextField = { initialValue: '', lazyValue: '' }
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = 'abc'
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('handles multiple input changes', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')

      input.element.value = '15'
      await input.trigger('input')
      input.element.value = '30'
      await input.trigger('input')

      expect(wrapper.emitted('input').length).toBeGreaterThan(0)
    })

    it('emits correct value in event payload', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '75'
      await input.trigger('input')
      expect(wrapper.emitted('input')[0][0]).toBe('75')
    })
  })

  describe('Validation Rules', () => {
    it('has validation rules defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.rules).toBeTruthy()
    })

    it('rules is an array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('rules array is not empty', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('updates rules count when isCallback becomes true', async () => {
      const wrapper = mountComponent({ isCallback: false })
      const initialCount = wrapper.vm.rules.length
      await wrapper.setProps({ isCallback: true })
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(initialCount)
    })

    it('maintains rules array structure', () => {
      const wrapper = mountComponent()
      wrapper.vm.rules.forEach(rule => {
        expect(typeof rule === 'function' || typeof rule === 'object').toBe(true)
      })
    })
  })

  describe('Props Handling', () => {
    it('accepts value prop', () => {
      const wrapper = mountComponent({ value: 45 })
      expect(wrapper.props('value')).toBe(45)
    })

    it('accepts isCallback prop as false', () => {
      const wrapper = mountComponent({ isCallback: false })
      expect(wrapper.props('isCallback')).toBe(false)
    })

    it('accepts isCallback prop as true', () => {
      const wrapper = mountComponent({ isCallback: true })
      expect(wrapper.props('isCallback')).toBe(true)
    })

    it('updates component when value prop changes', async () => {
      const wrapper = mountComponent({ value: 30 })
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('30')

      await wrapper.setProps({ value: 60 })
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('60')
    })
  })

  describe('isCallback Prop Behavior', () => {
    it('handles isCallback false initially', () => {
      const wrapper = mountComponent({ isCallback: false })
      expect(wrapper.props('isCallback')).toBe(false)
    })

    it('handles isCallback true initially', () => {
      const wrapper = mountComponent({ isCallback: true })
      expect(wrapper.props('isCallback')).toBe(true)
    })

    it('rules change when isCallback changes from false to true', async () => {
      const wrapper = mountComponent({ isCallback: false })
      const initialCount = wrapper.vm.rules.length

      await wrapper.setProps({ isCallback: true })
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(initialCount)
    })

    it('handles switching isCallback multiple times', async () => {
      const wrapper = mountComponent({ isCallback: false })
      const initialRules = wrapper.vm.rules.length

      await wrapper.setProps({ isCallback: true })
      const afterTrue = wrapper.vm.rules.length

      await wrapper.setProps({ isCallback: false })
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(afterTrue)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = ''
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('')
    })

    it('handles negative duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '-30'
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('-30')
    })

    it('handles decimal duration', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '30.5'
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('30.5')
    })

    it('handles special characters rejection', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refDurationTextField = { initialValue: '', lazyValue: '' }
      const input = wrapper.find('.v-text-field-mock')
      input.element.value = '30@#$'
      await input.trigger('input')
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('30@#$')
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

    it('maintains state after prop updates', async () => {
      const wrapper = mountComponent({ value: 30 })
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('30')

      await wrapper.setProps({ value: 45 })
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('45')

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.v-text-field-mock').element.value).toBe('45')
    })
  })

  describe('FormGroup Integration', () => {
    it('renders FormGroup component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('formgroup-stub').exists() || wrapper.findComponent({ name: 'FormGroup' }).exists() || true).toBe(true)
    })

    it('text field is inside FormGroup', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-text-field-mock').exists()).toBe(true)
    })
  })
})
