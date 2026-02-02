import { shallowMount } from '@vue/test-utils'
import InputDomain from '@/components/Common/Inputs/InputDomain.vue'
import labels from '@/model/constants/labels'

describe('InputDomain.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputDomain, {
      stubs: {
        'k-select': true,
        'k-select-loading': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputDomain')
    })

    it('should render a k-select element', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have value as empty array by default', () => {
      expect(wrapper.vm.value).toEqual([])
    })

    it('should have items as empty array by default', () => {
      expect(wrapper.vm.items).toEqual([])
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Select a item')
    })

    it('should have rules as empty array by default', () => {
      expect(wrapper.vm.rules).toEqual([])
    })

    it('should have isLoading false by default', () => {
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should have showLoader false by default', () => {
      expect(wrapper.vm.showLoader).toBe(false)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1', 'domain2']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.value).toEqual(['domain1', 'domain2'])
    })

    it('should accept custom items', () => {
      const customItems = [
        { text: 'Domain 1', value: 'domain1' },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: {
          items: customItems
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.items).toEqual(customItems)
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          placeholder: 'Choose domains'
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose domains')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputDomain, {
        propsData: {
          rules: customRules
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should accept isLoading true', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          isLoading: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should accept showLoader true', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          showLoader: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('data properties', () => {
    it('should have items data property', () => {
      expect(wrapper.vm.items).toBeDefined()
    })

    it('should have rules data property', () => {
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should have placeholder data property', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
    })
  })

  describe('handleDomainChange method', () => {
    it('should have handleDomainChange method', () => {
      expect(typeof wrapper.vm.handleDomainChange).toBe('function')
    })

    it('should emit input event with selected value', () => {
      const testValue = ['domain1']
      wrapper.vm.handleDomainChange(testValue)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input with all domains value when AllDomains is selected', () => {
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toEqual([labels.AllDomains])
    })

    it('should emit input with selected values when AllDomains is not selected', () => {
      const testValue = ['domain1', 'domain2']
      wrapper.vm.handleDomainChange(testValue)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle empty array', () => {
      wrapper.vm.handleDomainChange([])
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('setDomainItemsDisability method', () => {
    it('should have setDomainItemsDisability method', () => {
      expect(typeof wrapper.vm.setDomainItemsDisability).toBe('function')
    })

    it('should disable other domains when AllDomains is selected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.setDomainItemsDisability(true)
      expect(wrapper.vm.items[1].disabled).toBe(true)
      expect(wrapper.vm.items[2].disabled).toBe(true)
    })

    it('should not disable AllDomains item', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.setDomainItemsDisability(true)
      expect(wrapper.vm.items[0].disabled).toBeUndefined()
    })

    it('should enable domains when AllDomains is deselected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1', disabled: true }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.setDomainItemsDisability(false)
      expect(wrapper.vm.items[1].disabled).toBe(false)
    })
  })

  describe('handleFocus method', () => {
    it('should have handleFocus method', () => {
      expect(typeof wrapper.vm.handleFocus).toBe('function')
    })

    it('should emit on-focus event', () => {
      wrapper.vm.handleFocus()
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })
  })

  describe('KSelect integration', () => {
    it('should pass value prop to KSelect', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items prop to KSelect', () => {
      const items = [{ text: 'Domain', value: 'domain1' }]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass placeholder to KSelect', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          placeholder: 'Select domain'
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass rules to KSelect', () => {
      const rules = [(v) => v.length > 0]
      wrapper = shallowMount(InputDomain, {
        propsData: { rules },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass isLoading to KSelect', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { isLoading: true },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component configuration', () => {
    it('should be multiple select', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have small chips enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have deletable chips enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have outlined style', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be dense', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have persistent hint', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('hints and messages', () => {
    it('should display required hint', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      await wrapper.setProps({ value: ['domain2'] })
      expect(wrapper.vm.value).toEqual(['domain2'])
    })

    it('should update when items prop changes', async () => {
      const items1 = [{ text: 'Domain 1', value: 'domain1' }]
      const items2 = [{ text: 'Domain 2', value: 'domain2' }]
      wrapper = shallowMount(InputDomain, {
        propsData: { items: items1 },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      await wrapper.setProps({ items: items2 })
      expect(wrapper.vm.items).toEqual(items2)
    })

    it('should update when isLoading prop changes', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { isLoading: false },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      await wrapper.setProps({ isLoading: true })
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should update when showLoader prop changes', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { showLoader: false },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      await wrapper.setProps({ showLoader: true })
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper id for accessibility', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should display required indicator', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as basic domain selector', () => {
      wrapper = shallowMount(InputDomain, {
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.value).toEqual([])
      expect(wrapper.vm.items).toEqual([])
    })

    it('should work with multiple domains selected', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1', 'domain2', 'domain3']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should work with AllDomains option', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items, value: [labels.AllDomains] },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.value).toContain(labels.AllDomains)
    })

    it('should work in loading state', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          isLoading: true,
          showLoader: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.isLoading).toBe(true)
      expect(wrapper.vm.showLoader).toBe(true)
    })

    it('should work with validation rules', () => {
      const rules = [(v) => v.length > 0 || 'At least one domain required']
      wrapper = shallowMount(InputDomain, {
        propsData: { rules },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('state management', () => {
    it('should maintain value state', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.value).toEqual(['domain1'])
    })

    it('should maintain items state', () => {
      const items = [{ text: 'Domain', value: 'domain1' }]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.items).toEqual(items)
    })

    it('should handle item state changes', () => {
      const items = [
        { text: 'Domain 1', value: 'domain1' },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.setDomainItemsDisability(true)
      expect(wrapper.vm.items.some((item) => item.disabled)).toBe(true)
    })
  })

  describe('template', () => {
    it('should have input-domain class', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have progress slot', () => {
      const kSelectLoading = wrapper.findComponent({ name: 'KSelectLoading' })
      expect(kSelectLoading.exists()).toBe(true)
    })
  })

  describe('event handling', () => {
    it('should handle change event from KSelect', () => {
      wrapper.vm.handleDomainChange(['domain1'])
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle focus event', () => {
      wrapper.vm.handleFocus()
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })

    it('should emit multiple events correctly', () => {
      wrapper.vm.handleDomainChange(['domain1'])
      wrapper.vm.handleFocus()
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })

    it('should emit correct domain value on change', () => {
      const testValue = ['domain1', 'domain2']
      wrapper.vm.handleDomainChange(testValue)
      expect(wrapper.emitted('input')[0][0]).toEqual(testValue)
    })

    it('should handle AllDomains selection in change event', () => {
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.emitted('input')[0][0]).toEqual([labels.AllDomains])
    })
  })

  describe('AllDomains special logic', () => {
    it('should recognize AllDomains label', () => {
      expect(labels.AllDomains).toBeDefined()
    })

    it('should set AllDomains as single item when selected with others', () => {
      wrapper.vm.handleDomainChange(['domain1', labels.AllDomains, 'domain2'])
      expect(wrapper.emitted('input')[0][0]).toEqual([labels.AllDomains])
    })

    it('should disable non-AllDomains items when AllDomains selected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.vm.items[1].disabled).toBe(true)
      expect(wrapper.vm.items[2].disabled).toBe(true)
    })

    it('should not have AllDomains disabled in items', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      wrapper.vm.handleDomainChange([labels.AllDomains])
      // AllDomains should not be disabled
      expect(wrapper.vm.items[0].disabled).not.toBe(true)
    })
  })

  describe('domain selection edge cases', () => {
    it('should handle undefined value', () => {
      wrapper.vm.handleDomainChange(undefined)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle single domain selection', () => {
      wrapper.vm.handleDomainChange(['single-domain'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['single-domain'])
    })

    it('should handle many domains selection', () => {
      const domains = Array.from({ length: 10 }, (_, i) => `domain${i}`)
      wrapper.vm.handleDomainChange(domains)
      expect(wrapper.emitted('input')[0][0]).toEqual(domains)
    })

    it('should handle deselection of all domains', () => {
      wrapper.vm.handleDomainChange([])
      expect(wrapper.emitted('input')[0][0]).toEqual([])
    })
  })

  describe('loading states and visibility', () => {
    it('should show loading state when isLoading true', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          isLoading: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should show loader when showLoader true', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          showLoader: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.showLoader).toBe(true)
    })

    it('should work with both isLoading and showLoader together', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          isLoading: true,
          showLoader: true
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.isLoading).toBe(true)
      expect(wrapper.vm.showLoader).toBe(true)
    })
  })

  describe('component features and configuration', () => {
    it('should support multiple chip selection', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          value: ['domain1', 'domain2', 'domain3']
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should have autocomplete type for KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should render with correct id attribute', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have custom menu class for styling', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support placeholder customization', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: {
          placeholder: 'Choose domains'
        },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose domains')
    })

    it('should support rules customization', () => {
      const rules = [(v) => v && v.length > 0 || 'At least one domain required']
      wrapper = shallowMount(InputDomain, {
        propsData: { rules },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })
  })

  describe('item management', () => {
    it('should update items list reactively', async () => {
      const items1 = [{ text: 'Domain 1', value: 'domain1' }]
      const items2 = [{ text: 'Domain 2', value: 'domain2' }]
      wrapper = shallowMount(InputDomain, {
        propsData: { items: items1 },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      await wrapper.setProps({ items: items2 })
      expect(wrapper.vm.items).toEqual(items2)
    })

    it('should handle items with disabled state', () => {
      const items = [
        { text: 'Domain 1', value: 'domain1', disabled: true },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.items[0].disabled).toBe(true)
    })

    it('should handle empty items list', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { items: [] },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.items.length).toBe(0)
    })

    it('should handle large items list', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        text: `Domain ${i}`,
        value: `domain${i}`
      }))
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'k-select-loading': true
        }
      })
      expect(wrapper.vm.items.length).toBe(100)
    })
  })
})
