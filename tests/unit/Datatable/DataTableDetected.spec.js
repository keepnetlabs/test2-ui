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
        badge: {
          template: '<span class="badge-stub"><slot /></span>'
        },
        'v-btn': {
          template: '<button class="v-btn-stub"><slot /></button>'
        }
      }
    })
  }

  it('renders correctly when property exists', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.badge-stub').exists()).toBe(true)
    expect(wrapper.find('.badge-stub').attributes('text')).toBe('Clean')
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

  it('renders badge with correct text attribute', () => {
    const wrapper = mountComponent({ scope: { row: { status: 'Phishing' } } })
    const badge = wrapper.find('.badge-stub')

    expect(badge.exists()).toBe(true)
    expect(badge.attributes('text')).toBe('Phishing')
  })

  it('handles undefined status value', () => {
    const wrapper = mountComponent({ scope: { row: { status: undefined } } })
    expect(wrapper.find('badge-stub').exists()).toBe(false)
  })

  it('returns correct colors for all status types', () => {
    const wrapper = mountComponent()

    const statusColors = {
      'Clean': '#00BCD4',
      'Phishing': '#F56C6C',
      'Running': '#2196F3',
      'Malicious': '#E6A23C'
    }

    Object.entries(statusColors).forEach(([status, color]) => {
      expect(wrapper.vm.getBtnDetectedColor(status)).toBe(color)
    })
  })

  it('respects col property path', () => {
    const wrapper = mountComponent({
      col: { property: 'custom_status_field' },
      scope: { row: { custom_status_field: 'Clean' } }
    })

    expect(wrapper.find('.badge-stub').exists()).toBe(true)
  })

  it('renders fallback span when no badge needed', () => {
    const wrapper = mountComponent({ scope: { row: {} } })
    expect(wrapper.find('span').exists()).toBe(true)
  })
})
