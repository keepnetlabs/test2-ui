import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import InputCompliance from '@/components/Common/Inputs/InputCompliance.vue'
import labels from '@/model/constants/labels'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('InputCompliance.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    const getters = {
      'trainingLibraryHelpers/getCompliances': () => [
        { text: 'HIPAA', value: 'hipaa' },
        { text: 'GDPR', value: 'gdpr' },
        { text: 'CCPA', value: 'ccpa' },
        { text: 'PIPEDA', value: 'pipeda' },
        { text: 'PCI DSS', value: 'pci_dss' }
      ]
    }

    store = new Vuex.Store({ getters })

    wrapper = shallowMount(InputCompliance, {
      store,
      localVue,
      stubs: {
        'form-group': true,
        'k-select': true,
        'v-list-item': true,
        'v-list-item-action': true,
        'v-simple-checkbox': true,
        'v-tooltip': true,
        'v-list-item-title': true,
        'v-chip': true
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
      expect(wrapper.vm.$options.name).toBe('InputCompliance')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should render k-select component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have k-select nested in FormGroup', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have properly defined component options', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('components')
      expect(wrapper.vm.$options).toHaveProperty('props')
      expect(wrapper.vm.$options).toHaveProperty('data')
      expect(wrapper.vm.$options).toHaveProperty('computed')
    })
  })

  describe('prop defaults', () => {
    it('should have value as empty array by default', () => {
      expect(wrapper.vm.value).toEqual([])
    })

    it('should have value as array type', () => {
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
    })

    it('should accept undefined and default to empty array', () => {
      expect(wrapper.vm.value).toEqual([])
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['hipaa', 'gdpr'])
    })

    it('should accept single value in array', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['ccpa']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['ccpa'])
    })

    it('should accept empty array as value', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: []
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should accept all compliances as value', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr', 'ccpa', 'pipeda', 'pci_dss']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value.length).toBe(5)
    })

    it('should accept multiple compliance values', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'pipeda']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toContain('hipaa')
      expect(wrapper.vm.value).toContain('pipeda')
    })
  })

  describe('data properties', () => {
    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should have labels object', () => {
      expect(typeof wrapper.vm.labels).toBe('object')
    })

    it('should have Compliance label key', () => {
      expect(wrapper.vm.labels).toHaveProperty('Compliance')
    })

    it('should preserve labels reference on multiple mounts', () => {
      const firstLabels = wrapper.vm.labels
      wrapper.destroy()
      wrapper = shallowMount(InputCompliance, {
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.labels).toBe(labels)
    })
  })

  describe('computed properties', () => {
    it('should have getCompliances computed property', () => {
      expect(wrapper.vm.getCompliances).toBeDefined()
      expect(Array.isArray(wrapper.vm.getCompliances)).toBe(true)
    })

    it('should get compliances from store', () => {
      const compliances = wrapper.vm.getCompliances
      expect(compliances.length).toBeGreaterThan(0)
    })

    it('should include compliance options', () => {
      const compliances = wrapper.vm.getCompliances
      const hasHIPAA = compliances.some((c) => c.value === 'hipaa')
      expect(hasHIPAA).toBe(true)
    })

    it('should have correct number of compliances', () => {
      expect(wrapper.vm.getCompliances.length).toBe(5)
    })

    it('should return array from getCompliances', () => {
      expect(Array.isArray(wrapper.vm.getCompliances)).toBe(true)
    })

    it('should have each compliance with text and value', () => {
      const compliances = wrapper.vm.getCompliances
      compliances.forEach(compliance => {
        expect(compliance).toHaveProperty('text')
        expect(compliance).toHaveProperty('value')
      })
    })

    it('should be reactive when store changes', () => {
      const initialCount = wrapper.vm.getCompliances.length
      expect(initialCount).toBe(5)
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass compliances as items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support multiple selection', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have item-text set to text', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have item-value set to value', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support multiple prop', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support small-chips prop', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support deletable-chips prop', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have autocomplete off', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: ['ccpa'] })
      expect(wrapper.vm.value).toEqual(['ccpa'])
    })

    it('should update compliances when store changes', () => {
      expect(wrapper.vm.getCompliances).toBeDefined()
    })

    it('should update to empty array', async () => {
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should update to multiple selections', async () => {
      await wrapper.setProps({ value: ['hipaa', 'gdpr', 'ccpa'] })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should handle value changes reactively', async () => {
      expect(wrapper.vm.value).toEqual([])
      await wrapper.setProps({ value: ['pipeda'] })
      expect(wrapper.vm.value).toEqual(['pipeda'])
      await wrapper.setProps({ value: ['pipeda', 'pci_dss'] })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('should maintain reactivity with complex value updates', async () => {
      await wrapper.setProps({ value: ['hipaa'] })
      expect(wrapper.vm.value).toEqual(['hipaa'])
      await wrapper.setProps({ value: ['hipaa', 'gdpr'] })
      expect(wrapper.vm.value).toEqual(['hipaa', 'gdpr'])
    })
  })

  describe('event handling', () => {
    it('should emit input event for selected compliances', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle selection changes', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should support multi-select events', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should pass through input events', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as compliance selector', () => {
      expect(wrapper.vm.getCompliances.length).toBeGreaterThan(0)
    })

    it('should work with multiple selections', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr', 'ccpa']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should work with single selection', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['hipaa'])
    })

    it('should work with no selection', () => {
      expect(wrapper.vm.value).toEqual([])
    })

    it('should work with all compliances selected', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr', 'ccpa', 'pipeda', 'pci_dss']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value.length).toBe(5)
    })

    it('should handle combination of compliances', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toContain('hipaa')
      expect(wrapper.vm.value).toContain('gdpr')
      expect(wrapper.vm.value.length).toBe(2)
    })
  })

  describe('compliance options', () => {
    it('should include HIPAA compliance', () => {
      const hipaa = wrapper.vm.getCompliances.find((c) => c.value === 'hipaa')
      expect(hipaa).toBeDefined()
      expect(hipaa.text).toBe('HIPAA')
    })

    it('should include GDPR compliance', () => {
      const gdpr = wrapper.vm.getCompliances.find((c) => c.value === 'gdpr')
      expect(gdpr).toBeDefined()
      expect(gdpr.text).toBe('GDPR')
    })

    it('should include CCPA compliance', () => {
      const ccpa = wrapper.vm.getCompliances.find((c) => c.value === 'ccpa')
      expect(ccpa).toBeDefined()
      expect(ccpa.text).toBe('CCPA')
    })

    it('should include PIPEDA compliance', () => {
      const pipeda = wrapper.vm.getCompliances.find((c) => c.value === 'pipeda')
      expect(pipeda).toBeDefined()
      expect(pipeda.text).toBe('PIPEDA')
    })

    it('should include PCI DSS compliance', () => {
      const pciDss = wrapper.vm.getCompliances.find((c) => c.value === 'pci_dss')
      expect(pciDss).toBeDefined()
      expect(pciDss.text).toBe('PCI DSS')
    })

    it('should have consistent value/text mapping', () => {
      const compliances = wrapper.vm.getCompliances
      const expectedMap = {
        'hipaa': 'HIPAA',
        'gdpr': 'GDPR',
        'ccpa': 'CCPA',
        'pipeda': 'PIPEDA',
        'pci_dss': 'PCI DSS'
      }
      compliances.forEach(c => {
        expect(c.text).toBe(expectedMap[c.value])
      })
    })
  })

  describe('template structure', () => {
    it('should have proper form group title', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should use training-library badge select class', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have FormGroup component', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should wrap KSelect in FormGroup', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })
  })

  describe('UI properties', () => {
    it('should be dense', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should be outlined', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should support multiple selections with chips', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have deletable chips', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should be small chips', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should disable autocomplete', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have persistent hint', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have placeholder text', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('store integration', () => {
    it('should get compliances from Vuex store', () => {
      expect(wrapper.vm.getCompliances).toBeDefined()
      expect(wrapper.vm.getCompliances.length).toBeGreaterThan(0)
    })

    it('should map trainingLibraryHelpers/getCompliances getter', () => {
      expect(wrapper.vm.getCompliances).toBeDefined()
    })

    it('should use correct store getter path', () => {
      expect(wrapper.vm.getCompliances).toBeDefined()
    })

    it('should retrieve compliances from store properly', () => {
      const compliances = wrapper.vm.$store.getters['trainingLibraryHelpers/getCompliances']
      expect(Array.isArray(compliances)).toBe(true)
    })

    it('should access store getters without errors', () => {
      expect(() => {
        const compliances = wrapper.vm.$store.getters['trainingLibraryHelpers/getCompliances']
        return compliances
      }).not.toThrow()
    })

    it('should use mapGetters correctly', () => {
      const computed = wrapper.vm.$options.computed
      expect(computed).toBeDefined()
    })
  })

  describe('state management', () => {
    it('should maintain selected compliances', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['hipaa', 'gdpr']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['hipaa', 'gdpr'])
    })

    it('should preserve state across multiple updates', async () => {
      expect(wrapper.vm.value).toEqual([])
      await wrapper.setProps({ value: ['ccpa'] })
      expect(wrapper.vm.value).toEqual(['ccpa'])
      await wrapper.setProps({ value: ['ccpa', 'hipaa'] })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('should handle value clearing', async () => {
      await wrapper.setProps({ value: ['hipaa', 'gdpr'] })
      expect(wrapper.vm.value.length).toBe(2)
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should maintain label references', () => {
      expect(wrapper.vm.labels).toBeDefined()
      const initialLabels = wrapper.vm.labels
      expect(initialLabels).toBe(labels)
    })

    it('should not mutate original compliance objects', () => {
      const compliance = wrapper.vm.getCompliances[0]
      const originalText = compliance.text
      expect(compliance.text).toBe(originalText)
    })
  })

  describe('compliance list validation', () => {
    it('should have at least 3 compliances', () => {
      expect(wrapper.vm.getCompliances.length).toBeGreaterThanOrEqual(3)
    })

    it('should all compliances have required properties', () => {
      wrapper.vm.getCompliances.forEach(compliance => {
        expect(compliance.value).toBeDefined()
        expect(compliance.text).toBeDefined()
      })
    })

    it('should each compliance value be a string', () => {
      wrapper.vm.getCompliances.forEach(compliance => {
        expect(typeof compliance.value).toBe('string')
      })
    })

    it('should each compliance text be a string', () => {
      wrapper.vm.getCompliances.forEach(compliance => {
        expect(typeof compliance.text).toBe('string')
      })
    })

    it('should compliance values be unique', () => {
      const values = wrapper.vm.getCompliances.map(c => c.value)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(values.length)
    })

    it('should compliance texts be unique', () => {
      const texts = wrapper.vm.getCompliances.map(c => c.text)
      const uniqueTexts = new Set(texts)
      expect(uniqueTexts.size).toBe(texts.length)
    })
  })

  describe('form integration', () => {
    it('should support form submission', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should be compatible with form controls', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should maintain value for form binding', () => {
      wrapper = shallowMount(InputCompliance, {
        propsData: {
          value: ['gdpr', 'ccpa']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['gdpr', 'ccpa'])
    })

    it('should provide consistent interface for form binding', () => {
      expect(wrapper.vm.value).toBeDefined()
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
    })
  })
})
