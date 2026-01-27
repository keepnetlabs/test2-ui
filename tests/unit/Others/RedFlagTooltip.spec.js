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
})
