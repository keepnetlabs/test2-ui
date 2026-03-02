import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import { shallowMount } from '@vue/test-utils'

describe('ConfigureCompanyStepHeader.vue (extra branch coverage)', () => {
  it('renders title and subtitle when provided', () => {
    const wrapper = shallowMount(ConfigureCompanyStepHeader, {
      propsData: {
        title: 'Step Title',
        subtitle: 'Step description text'
      },
      stubs: {
        'v-list-item': true,
        'v-list-item-content': true,
        'v-list-item-title': true,
        'v-list-item-subtitle': true
      }
    })
    expect(wrapper.vm.title).toBe('Step Title')
    expect(wrapper.vm.subtitle).toBe('Step description text')
  })

  it('handles undefined title and subtitle', () => {
    const wrapper = shallowMount(ConfigureCompanyStepHeader, {
      stubs: {
        'v-list-item': true,
        'v-list-item-content': true,
        'v-list-item-title': true,
        'v-list-item-subtitle': true
      }
    })
    expect(wrapper.vm.title).toBeUndefined()
    expect(wrapper.vm.subtitle).toBeUndefined()
  })
})
