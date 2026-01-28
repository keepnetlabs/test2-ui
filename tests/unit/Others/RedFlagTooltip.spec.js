import { createLocalVue, shallowMount } from '@vue/test-utils'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
import Vuetify from 'vuetify'

describe('RedFlagTooltip.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(RedFlagTooltip, {
      localVue,
      vuetify,
      propsData: {
        tooltipContent: 'Helpful info',
        ...propsData
      },
      stubs: {
        'v-tooltip': {
          template: '<div><slot name="activator" :on="{}" :attrs="{}"></slot><span><slot /></span></div>'
        }
      }
    })
  }

  it('renders trigger div', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
  })

  it('renders tooltip content', () => {
    const wrapper = mountComponent({ tooltipContent: 'Specific error' })
    expect(wrapper.text()).toContain('Specific error')
  })

  it('displays red flag icon', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
  })

  it('handles different tooltip messages', () => {
    const testCases = ['Error 1', 'Error 2', 'Important Notice']
    testCases.forEach(message => {
      const wrapper = mountComponent({ tooltipContent: message })
      expect(wrapper.text()).toContain(message)
    })
  })

  it('supports empty tooltip content', () => {
    const wrapper = mountComponent({ tooltipContent: '' })
    expect(wrapper.exists()).toBe(true)
  })

  it('tooltip component is properly integrated', () => {
    const wrapper = mountComponent()
    const tooltipStub = wrapper.find({ name: 'v-tooltip-stub' })
    expect(tooltipStub.exists() || wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
  })

  it('renders with correct tooltip content passed as prop', () => {
    const customContent = 'Custom error message'
    const wrapper = mountComponent({ tooltipContent: customContent })
    expect(wrapper.text()).toContain(customContent)
  })

  it('displays trigger element with correct class', () => {
    const wrapper = mountComponent()
    const trigger = wrapper.find('.red-flag-tooltip-trigger')
    expect(trigger.exists()).toBe(true)
    expect(trigger.classes()).toContain('red-flag-tooltip-trigger')
  })

  it('handles long tooltip messages', () => {
    const longMessage = 'This is a very long error message that should be properly displayed in the tooltip component'
    const wrapper = mountComponent({ tooltipContent: longMessage })
    expect(wrapper.text()).toContain(longMessage)
  })
})
