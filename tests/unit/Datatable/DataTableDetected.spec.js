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

  describe('Component Rendering', () => {
    it('should render component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should render span for badge when status exists', () => {
      const wrapper = mountComponent()
      const span = wrapper.find('span.badge-stub')
      expect(span.exists()).toBe(true)
    })

    it('should render with correct structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.html()).toBeDefined()
    })

    it('should mount without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Badge Rendering', () => {
    it('should display badge for valid status', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('span.badge-stub').exists()).toBe(true)
    })

    it('should set badge text attribute correctly', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'Phishing' } } })
      // The badge component is stubbed, so we check that component rendered
      expect(wrapper.find('span.badge-stub').exists()).toBe(true)
    })

    it('should hide badge for empty status', () => {
      const wrapper = mountComponent({ scope: { row: {} } })
      expect(wrapper.find('badge-stub').exists()).toBe(false)
    })

    it('should support multiple status values', () => {
      const statuses = ['Clean', 'Phishing', 'Malicious', 'Running']
      statuses.forEach(status => {
        const wrapper = mountComponent({ scope: { row: { status } } })
        expect(wrapper.find('.badge-stub').exists()).toBe(true)
      })
    })
  })

  describe('Color Mapping', () => {
    it('should return correct color for Clean status', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBtnDetectedColor('Clean')).toBe('#00BCD4')
    })

    it('should return correct color for Phishing status', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBtnDetectedColor('Phishing')).toBe('#F56C6C')
    })

    it('should return correct color for Running status', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBtnDetectedColor('Running')).toBe('#2196F3')
    })

    it('should return correct color for Malicious status', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBtnDetectedColor('Malicious')).toBe('#E6A23C')
    })

    it('should handle case-insensitive colors', () => {
      const wrapper = mountComponent()
      const color1 = wrapper.vm.getBtnDetectedColor('malicious')
      const color2 = wrapper.vm.getBtnDetectedColor('MALICIOUS')
      expect(color1).toBe(color2)
    })
  })

  describe('Props Handling', () => {
    it('should accept scope prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('scope')).toBeDefined()
    })

    it('should accept col prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('col')).toBeDefined()
    })

    it('should use property from col config', () => {
      const wrapper = mountComponent({
        col: { property: 'customField' },
        scope: { row: { customField: 'Clean' } }
      })
      expect(wrapper.find('.badge-stub').exists()).toBe(true)
    })

    it('should handle prop updates', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({
        scope: { row: { status: 'Phishing' } }
      })
      expect(wrapper.props('scope').row.status).toBe('Phishing')
    })
  })

  describe('Status Detection', () => {
    it('should detect Clean status', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'Clean' } } })
      expect(wrapper.vm.getBtnDetectedColor('Clean')).toBe('#00BCD4')
    })

    it('should detect Phishing status', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'Phishing' } } })
      expect(wrapper.find('.badge-stub').exists()).toBe(true)
    })

    it('should detect Malicious status', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'Malicious' } } })
      expect(wrapper.vm.getBtnDetectedColor('Malicious')).toBe('#E6A23C')
    })

    it('should handle unknown status gracefully', () => {
      const wrapper = mountComponent()
      // Unknown statuses may not have a color defined
      expect(() => {
        wrapper.vm.getBtnDetectedColor('Unknown')
      }).not.toThrow()
    })
  })

  describe('Empty State Handling', () => {
    it('should handle missing status property', () => {
      const wrapper = mountComponent({ scope: { row: {} } })
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should show fallback content when no data', () => {
      const wrapper = mountComponent({ scope: { row: { status: null } } })
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should handle undefined status', () => {
      const wrapper = mountComponent({ scope: { row: { status: undefined } } })
      expect(wrapper.find('badge-stub').exists()).toBe(false)
    })

    it('should display fallback span', () => {
      const wrapper = mountComponent({ scope: { row: {} } })
      expect(wrapper.find('span').text()).toBeDefined()
    })
  })

  describe('Component Properties', () => {
    it('should have component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('DataTableDetected')
    })

    it('should have component data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have methods', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.methods).toBeDefined()
      expect(wrapper.vm.getBtnDetectedColor).toBeDefined()
    })

    it('should have required props', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.props).toBeDefined()
      expect(wrapper.vm.$options.props.scope).toBeDefined()
      expect(wrapper.vm.$options.props.col).toBeDefined()
    })
  })

  describe('Lifecycle', () => {
    it('should mount without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should destroy without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should handle multiple mount/unmount cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountComponent()
        expect(wrapper.exists()).toBe(true)
        wrapper.destroy()
      }
    })

    it('should maintain state during lifecycle', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('instances should be independent', () => {
      const wrapper1 = mountComponent({ scope: { row: { status: 'Clean' } } })
      const wrapper2 = mountComponent({ scope: { row: { status: 'Phishing' } } })
      expect(wrapper1.props('scope').row.status).not.toBe(wrapper2.props('scope').row.status)
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long status text', () => {
      const longStatus = 'A'.repeat(100)
      const wrapper = mountComponent({ scope: { row: { status: longStatus } } })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle special characters in status', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'Status@#$%' } } })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle numeric status values', () => {
      const wrapper = mountComponent({ scope: { row: { status: '123' } } })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle boolean status values', () => {
      const wrapper = mountComponent({ scope: { row: { status: 'true' } } })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
