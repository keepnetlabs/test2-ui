import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'

// Mock element-ui components if necessary
jest.mock('element-ui', () => ({
  DatePicker: {
     name: 'ElDatePicker',
     render: (h) => h('div')
  }
}))

describe('InputDate.vue', () => {
  const localVue = createLocalVue()

  it('sets defaultTime when type is datetimerange', () => {
    const wrapper = shallowMount(InputDate, {
      localVue,
      propsData: {
        type: 'datetimerange'
      }
    })
    expect(wrapper.vm.defaultTime).toEqual(['00:00:00', '23:59:00'])
  })

  it('uses default placeholder', () => {
    const wrapper = shallowMount(InputDate, {
      localVue
    })
    expect(wrapper.vm.placeholder).toBe('Select a date')
  })

  it('sets correct defaultTime for date type', () => {
    const wrapper = shallowMount(InputDate, {
      localVue,
      propsData: {
        type: 'date'
      }
    })
    expect(wrapper.vm.defaultTime).toEqual(['00:00:00', '23:59:00'])
  })

  it('sets correct defaultTime for daterange type', () => {
    const wrapper = shallowMount(InputDate, {
      localVue,
      propsData: {
        type: 'daterange'
      }
    })
    expect(wrapper.vm.defaultTime).toEqual(['00:00:00', '23:59:00'])
  })

  it('handles datetimerange type properly', () => {
    const wrapper = shallowMount(InputDate, {
      localVue,
      propsData: {
        type: 'datetimerange'
      }
    })
    expect(Array.isArray(wrapper.vm.defaultTime)).toBe(true)
    expect(wrapper.vm.defaultTime.length).toBe(2)
  })

  it('initializes with proper component structure', () => {
    const wrapper = shallowMount(InputDate, {
      localVue
    })
    expect(wrapper.vm.$options.name).toBe('InputDate')
  })
})
