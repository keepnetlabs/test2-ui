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
})
