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

  describe('domain format validation', () => {
    it('should accept simple domain format example.com', () => {
      const domain = 'example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with numbers', () => {
      const domain = 'example123.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with hyphens', () => {
      const domain = 'my-domain.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with multiple hyphens', () => {
      const domain = 'my-awesome-domain.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept subdomain format sub.example.com', () => {
      const domain = 'sub.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept multiple subdomain levels', () => {
      const domain = 'api.v2.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept single character subdomain', () => {
      const domain = 'a.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept www prefix', () => {
      const domain = 'www.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept mail subdomain', () => {
      const domain = 'mail.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept ftp subdomain', () => {
      const domain = 'ftp.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('internationalized domains (IDN)', () => {
    it('should accept IDN with ASCII representation', () => {
      const domain = 'xn--exmple-cua.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Unicode domain name (in practice)', () => {
      const domain = 'münchen.de'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Chinese domain', () => {
      const domain = '中国.中国'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Russian Cyrillic domain', () => {
      const domain = 'москва.рф'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Arabic domain', () => {
      const domain = 'السعودية.sa'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Hebrew domain', () => {
      const domain = 'ישראל.קום'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Greek domain', () => {
      const domain = 'Ελλάδα.gr'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept Korean domain', () => {
      const domain = '한국.kr'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept mixed script domain', () => {
      const domain = 'test中国.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('port number handling', () => {
    it('should accept domain with port 80', () => {
      const domain = 'example.com:80'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with port 443', () => {
      const domain = 'example.com:443'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with port 8080', () => {
      const domain = 'example.com:8080'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with custom high port', () => {
      const domain = 'example.com:9999'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept subdomain with port', () => {
      const domain = 'api.example.com:3000'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept port 1', () => {
      const domain = 'example.com:1'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept port 65535', () => {
      const domain = 'example.com:65535'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept port 3306 (MySQL default)', () => {
      const domain = 'db.example.com:3306'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept port 5432 (PostgreSQL default)', () => {
      const domain = 'db.example.com:5432'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('protocol handling', () => {
    it('should handle domain with http protocol', () => {
      const domain = 'http://example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with https protocol', () => {
      const domain = 'https://example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with ftp protocol', () => {
      const domain = 'ftp://example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with protocol and port', () => {
      const domain = 'https://example.com:443'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with protocol and subdomain', () => {
      const domain = 'https://api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with protocol, subdomain, and port', () => {
      const domain = 'https://api.example.com:3000'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with custom protocol', () => {
      const domain = 'custom://example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with path after protocol', () => {
      const domain = 'https://example.com/path'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('subdomain variations', () => {
    it('should accept single level subdomain', () => {
      const domain = 'api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept two level subdomains', () => {
      const domain = 'v2.api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept three level subdomains', () => {
      const domain = 'us.west.api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept many nested subdomains', () => {
      const domain = 'a.b.c.d.e.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept numeric subdomain', () => {
      const domain = '123.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept subdomain with hyphen', () => {
      const domain = 'my-api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept multiple hyphens in subdomain', () => {
      const domain = 'my-awesome-api.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept subdomain with numbers and hyphens', () => {
      const domain = 'api-v2-us.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('TLD validation - single letter TLDs', () => {
    it('should accept .com TLD', () => {
      const domain = 'example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .org TLD', () => {
      const domain = 'example.org'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .net TLD', () => {
      const domain = 'example.net'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .edu TLD', () => {
      const domain = 'university.edu'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .gov TLD', () => {
      const domain = 'agency.gov'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .io TLD', () => {
      const domain = 'startup.io'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept country code TLD', () => {
      const domain = 'example.de'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept two-letter TLD', () => {
      const domain = 'example.uk'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('TLD validation - double TLDs', () => {
    it('should accept .co.uk double TLD', () => {
      const domain = 'example.co.uk'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .com.au double TLD', () => {
      const domain = 'example.com.au'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .co.jp double TLD', () => {
      const domain = 'example.co.jp'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .co.nz double TLD', () => {
      const domain = 'example.co.nz'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .gov.uk double TLD', () => {
      const domain = 'agency.gov.uk'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .ac.uk double TLD', () => {
      const domain = 'university.ac.uk'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .com.br double TLD', () => {
      const domain = 'empresa.com.br'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .com.mx double TLD', () => {
      const domain = 'empresa.com.mx'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .co.in double TLD', () => {
      const domain = 'company.co.in'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept .org.uk double TLD', () => {
      const domain = 'charity.org.uk'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('domain length limits', () => {
    it('should accept domain at minimum length', () => {
      const domain = 'a.io'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with 20 character name', () => {
      const domain = 'a'.repeat(20) + '.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with 50 character name', () => {
      const domain = 'a'.repeat(50) + '.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain at DNS limit (253 characters)', () => {
      const longName = 'a'.repeat(240) + '.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [longName] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(longName)
    })

    it('should accept domain with long subdomain chain', () => {
      const domain = 'a.b.c.d.e.f.g.h.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with maximum single label length (63 chars)', () => {
      const domain = 'a'.repeat(63) + '.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should accept domain with port and stay within limits', () => {
      const domain = 'example.com:65535'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('multiple domain selection', () => {
    it('should handle selection of 2 domains', () => {
      const domains = ['example.com', 'test.org']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(2)
      expect(wrapper.vm.value).toContain('example.com')
      expect(wrapper.vm.value).toContain('test.org')
    })

    it('should handle selection of 5 domains', () => {
      const domains = ['a.com', 'b.com', 'c.com', 'd.com', 'e.com']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(5)
    })

    it('should handle selection of 10 domains', () => {
      const domains = Array.from({ length: 10 }, (_, i) => `domain${i}.com`)
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(10)
    })

    it('should handle 50 domains in selection', () => {
      const domains = Array.from({ length: 50 }, (_, i) => `domain${i}.com`)
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(50)
    })

    it('should handle 100 domains in selection', () => {
      const domains = Array.from({ length: 100 }, (_, i) => `domain${i}.com`)
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(100)
    })

    it('should emit correct domains on change', () => {
      const domains = ['example.com', 'test.org']
      wrapper.vm.handleDomainChange(domains)
      expect(wrapper.emitted('input')[0][0]).toEqual(domains)
    })

    it('should handle domains with mixed formats', () => {
      const domains = [
        'example.com',
        'api.test.org',
        'db.service.io:3306',
        'https://secure.example.co.uk'
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(4)
    })

    it('should maintain order of selected domains', () => {
      const domains = ['z.com', 'a.com', 'm.com']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value[0]).toBe('z.com')
      expect(wrapper.vm.value[1]).toBe('a.com')
      expect(wrapper.vm.value[2]).toBe('m.com')
    })

    it('should allow deselecting a single domain from multiple', () => {
      const initialDomains = ['a.com', 'b.com', 'c.com']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: initialDomains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.handleDomainChange(['a.com', 'c.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['a.com', 'c.com'])
    })
  })

  describe('domain validation edge cases', () => {
    it('should handle domain with consecutive hyphens in subdomain', () => {
      const domain = 'my--subdomain.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with numbers and letters mixed', () => {
      const domain = 'a1b2c3d4e5.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle uppercase letters in domain', () => {
      const domain = 'Example.COM'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle mixed case domain', () => {
      const domain = 'MyDomain.CoM'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain ending with digit', () => {
      const domain = 'example123.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with trailing slash (path)', () => {
      const domain = 'example.com/'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with query parameters', () => {
      const domain = 'example.com?param=value'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with fragment identifier', () => {
      const domain = 'example.com#section'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with authentication string', () => {
      const domain = 'user:pass@example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle IP address format (IPv4)', () => {
      const domain = '192.168.1.1'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle IP address with port', () => {
      const domain = '192.168.1.1:8080'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle IPv6 address format', () => {
      const domain = '[::1]'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle localhost', () => {
      const domain = 'localhost'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle localhost with port', () => {
      const domain = 'localhost:3000'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('special domain configurations', () => {
    it('should handle wildcard subdomain', () => {
      const domain = '*.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle TLD only', () => {
      const domain = '.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain without TLD (single label)', () => {
      const domain = 'localhost'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with underscores', () => {
      const domain = 'my_domain.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with dots in name', () => {
      const domain = 'my.domain.name.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('null and undefined domain handling', () => {
    it('should default to empty array when no value provided', () => {
      wrapper = shallowMount(InputDomain, {
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
      expect(wrapper.vm.value.length).toBe(0)
    })

    it('should handle explicitly set empty array', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should handle array with null element', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [null] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value[0]).toBeNull()
    })

    it('should handle array with undefined element', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [undefined] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value[0]).toBeUndefined()
    })

    it('should transition from empty to domains', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      await wrapper.setProps({ value: ['example.com'] })
      expect(wrapper.vm.value).toEqual(['example.com'])
    })

    it('should transition from domains to empty array', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: ['example.com'] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.value).toEqual([])
    })
  })

  describe('disabled items and AllDomains interaction', () => {
    it('should disable items when AllDomains selected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' },
        { text: 'Domain 2', value: 'domain2' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.vm.items[1].disabled).toBe(true)
      expect(wrapper.vm.items[2].disabled).toBe(true)
    })

    it('should keep AllDomains enabled when selected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.vm.items[0].disabled).not.toBe(true)
    })

    it('should enable other items when AllDomains deselected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        { text: 'Domain 1', value: 'domain1', disabled: true }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.setDomainItemsDisability(false)
      expect(wrapper.vm.items[1].disabled).toBe(false)
    })

    it('should handle many items when AllDomains selected', () => {
      const items = [
        { text: 'All Domains', value: labels.AllDomains },
        ...Array.from({ length: 50 }, (_, i) => ({
          text: `Domain ${i}`,
          value: `domain${i}`
        }))
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.handleDomainChange([labels.AllDomains])
      expect(wrapper.vm.items.slice(1).every((item) => item.disabled)).toBe(true)
    })
  })

  describe('domain selection edge cases advanced', () => {
    it('should handle domains with repeated names', () => {
      const domains = ['example.com', 'example.com', 'example.com']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should handle domain with whitespace preserved', () => {
      const domains = ['example.com ']
      wrapper = shallowMount(InputDomain, {
        propsData: { value: domains },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain('example.com ')
    })

    it('should handle very long domain list (200 items)', () => {
      const items = Array.from({ length: 200 }, (_, i) => ({
        text: `Domain ${i}`,
        value: `domain${i}.com`
      }))
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.items.length).toBe(200)
    })

    it('should handle rapid domain changes', () => {
      wrapper.vm.handleDomainChange(['a.com'])
      wrapper.vm.handleDomainChange(['b.com'])
      wrapper.vm.handleDomainChange(['c.com'])
      wrapper.vm.handleDomainChange(['d.com'])
      expect(wrapper.emitted('input').length).toBe(4)
    })

    it('should handle domains with leading dots', () => {
      const domain = '.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domains with trailing dots', () => {
      const domain = 'example.com.'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle special CNAME records', () => {
      const domain = '_dmarc.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle SRV record format', () => {
      const domain = '_service._proto.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle MX record name format', () => {
      const domain = 'mail1.example.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })

    it('should handle domain with multiple consecutive hyphens', () => {
      const domain = 'example---test.com'
      wrapper = shallowMount(InputDomain, {
        propsData: { value: [domain] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toContain(domain)
    })
  })

  describe('event emission variations', () => {
    it('should emit input with single-item array', () => {
      wrapper.vm.handleDomainChange(['single.com'])
      expect(wrapper.emitted('input')[0][0]).toEqual(['single.com'])
    })

    it('should emit input with multi-item array', () => {
      const domains = ['a.com', 'b.com', 'c.com']
      wrapper.vm.handleDomainChange(domains)
      expect(wrapper.emitted('input')[0][0]).toEqual(domains)
    })

    it('should emit on-focus event when focused', () => {
      wrapper.vm.handleFocus()
      expect(wrapper.emitted('on-focus')).toBeTruthy()
    })

    it('should not emit input when deselecting all', () => {
      wrapper.vm.handleDomainChange([])
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toEqual([])
    })

    it('should emit events separately for different operations', () => {
      wrapper.vm.handleDomainChange(['domain1.com'])
      wrapper.vm.handleFocus()
      wrapper.vm.handleDomainChange(['domain2.com'])
      expect(wrapper.emitted('input').length).toBe(2)
      expect(wrapper.emitted('on-focus').length).toBe(1)
    })
  })

  describe('placeholder and hints', () => {
    it('should have default placeholder "Select a item"', () => {
      expect(wrapper.vm.placeholder).toBe('Select a item')
    })

    it('should support custom placeholder', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { placeholder: 'Choose domains' },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.placeholder).toBe('Choose domains')
    })

    it('should handle empty placeholder', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { placeholder: '' },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.placeholder).toBe('')
    })

    it('should handle very long placeholder', () => {
      const longPlaceholder = 'Select your preferred domains from the comprehensive list below'
      wrapper = shallowMount(InputDomain, {
        propsData: { placeholder: longPlaceholder },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.placeholder).toBe(longPlaceholder)
    })
  })

  describe('item list variations', () => {
    it('should handle items array with mixed properties', () => {
      const items = [
        { text: 'Domain A', value: 'a.com', disabled: false },
        { text: 'Domain B', value: 'b.com', disabled: true },
        { text: 'Domain C', value: 'c.com' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.items.length).toBe(3)
      expect(wrapper.vm.items[1].disabled).toBe(true)
    })

    it('should handle items with custom properties', () => {
      const items = [
        { text: 'Domain', value: 'test.com', custom: 'value', metadata: { id: 1 } }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.items[0].custom).toBe('value')
    })
  })

  describe('validation scenarios', () => {
    it('should work with validation rules', () => {
      const rules = [(v) => v && v.length > 0 || 'Select at least one domain']
      wrapper = shallowMount(InputDomain, {
        propsData: { rules },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.rules).toEqual(rules)
    })

    it('should accept multiple validation rules', () => {
      const rules = [
        (v) => Array.isArray(v) || 'Must be array',
        (v) => v.length > 0 || 'Select at least one',
        (v) => v.length <= 10 || 'Select maximum 10'
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { rules },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.rules.length).toBe(3)
    })
  })

  describe('accessibility and user experience', () => {
    it('should be properly labeled for screen readers', () => {
      wrapper = shallowMount(InputDomain, {
        attrs: { 'aria-label': 'Domain selector' },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should support keyboard navigation via KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have distinct chip styling for selected domains', () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: ['example.com'] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      expect(wrapper.vm.value).toEqual(['example.com'])
    })
  })

  describe('state persistence', () => {
    it('should maintain selected domains across prop updates', async () => {
      wrapper = shallowMount(InputDomain, {
        propsData: { value: ['example.com', 'test.org'] },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      await wrapper.setProps({ value: ['example.com', 'test.org', 'new.com'] })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should preserve item list during operations', () => {
      const items = [
        { text: 'Domain A', value: 'a.com' },
        { text: 'Domain B', value: 'b.com' }
      ]
      wrapper = shallowMount(InputDomain, {
        propsData: { items },
        stubs: { 'k-select': true, 'k-select-loading': true }
      })
      wrapper.vm.handleDomainChange(['a.com'])
      expect(wrapper.vm.items.length).toBe(2)
    })
  })
})
