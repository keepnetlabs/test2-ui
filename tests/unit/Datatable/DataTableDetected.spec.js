import { createLocalVue, shallowMount } from '@vue/test-utils'
import DataTableDetected from '@/components/DataTableComponents/DataTableDetected.vue'

describe('DataTableDetected.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(DataTableDetected, {
      localVue,
      propsData: {
        scope: {
          row: { status: 'Clean' }
        },
        col: { property: 'status' },
        ...propsData
      },
      stubs: {
        badge: true,
        'v-btn': true
      }
    })
  }

  it('renders correctly when property exists', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('badge-stub').exists()).toBe(true)
    expect(wrapper.find('badge-stub').attributes('text')).toBe('Clean')
  })

  it('gets correct color for type', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getBtnDetectedColor('Clean')).toBe('#00BCD4')
    expect(wrapper.vm.getBtnDetectedColor('Phishing')).toBe('#F56C6C')
    expect(wrapper.vm.getBtnDetectedColor('Running')).toBe('#2196F3')
  })

  it('handles empty state', () => {
    const wrapper = mountComponent({
       scope: { row: {} }
    })
    expect(wrapper.find('badge-stub').exists()).toBe(false)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('handles case insensitive status', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getBtnDetectedColor('malicious')).toBe('#E6A23C')
    expect(wrapper.vm.getBtnDetectedColor('MALICIOUS')).toBe('#E6A23C')
  })
})
