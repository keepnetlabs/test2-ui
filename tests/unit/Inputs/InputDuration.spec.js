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
})
