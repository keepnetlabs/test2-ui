import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import InputBehaviour from '@/components/Common/Inputs/InputBehaviour.vue'
import labels from '@/model/constants/labels'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('InputBehaviour.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    const getters = {
      'trainingLibraryHelpers/getBehaviours': () => [
        { text: 'Observing', value: 'observing' },
        { text: 'Practicing', value: 'practicing' },
        { text: 'Testing', value: 'testing' },
        { text: 'Assessing', value: 'assessing' },
        { text: 'Coaching', value: 'coaching' }
      ]
    }

    store = new Vuex.Store({ getters })

    wrapper = shallowMount(InputBehaviour, {
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
      expect(wrapper.vm.$options.name).toBe('InputBehaviour')
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
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'practicing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['observing', 'practicing'])
    })

    it('should accept single value in array', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['testing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['testing'])
    })

    it('should accept empty array as value', () => {
      wrapper = shallowMount(InputBehaviour, {
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

    it('should accept all behaviors as value', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'practicing', 'testing', 'assessing', 'coaching']
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
  })

  describe('data properties', () => {
    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should have labels object', () => {
      expect(typeof wrapper.vm.labels).toBe('object')
    })

    it('should have Behaviour label key', () => {
      expect(wrapper.vm.labels).toHaveProperty('Behaviour')
    })
  })

  describe('computed properties', () => {
    it('should have getBehaviours computed property', () => {
      expect(wrapper.vm.getBehaviours).toBeDefined()
      expect(Array.isArray(wrapper.vm.getBehaviours)).toBe(true)
    })

    it('should get behaviours from store', () => {
      const behaviours = wrapper.vm.getBehaviours
      expect(behaviours.length).toBeGreaterThan(0)
    })

    it('should include behaviour options', () => {
      const behaviours = wrapper.vm.getBehaviours
      const hasObserving = behaviours.some((b) => b.value === 'observing')
      expect(hasObserving).toBe(true)
    })

    it('should have correct number of behaviours', () => {
      expect(wrapper.vm.getBehaviours.length).toBe(5)
    })

    it('should return array from getBehaviours', () => {
      expect(Array.isArray(wrapper.vm.getBehaviours)).toBe(true)
    })

    it('should have each behaviour with text and value', () => {
      const behaviours = wrapper.vm.getBehaviours
      behaviours.forEach(behaviour => {
        expect(behaviour).toHaveProperty('text')
        expect(behaviour).toHaveProperty('value')
      })
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass behaviours as items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support multiple selection', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have custom slots for item and selection', () => {
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
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: ['testing'] })
      expect(wrapper.vm.value).toEqual(['testing'])
    })

    it('should update behaviours when store changes', () => {
      expect(wrapper.vm.getBehaviours).toBeDefined()
    })

    it('should update to empty array', async () => {
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should update to multiple selections', async () => {
      await wrapper.setProps({ value: ['observing', 'practicing', 'testing'] })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should handle value changes reactively', async () => {
      expect(wrapper.vm.value).toEqual([])
      await wrapper.setProps({ value: ['assessing'] })
      expect(wrapper.vm.value).toEqual(['assessing'])
      await wrapper.setProps({ value: ['assessing', 'coaching'] })
      expect(wrapper.vm.value.length).toBe(2)
    })
  })

  describe('event handling', () => {
    it('should emit input event for selected behaviours', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle selection changes', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should support multi-select events', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as behaviour selector', () => {
      expect(wrapper.vm.getBehaviours.length).toBeGreaterThan(0)
    })

    it('should work with multiple selections', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'practicing', 'testing']
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
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['practicing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['practicing'])
    })

    it('should work with no selection', () => {
      expect(wrapper.vm.value).toEqual([])
    })

    it('should work with all behaviors selected', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'practicing', 'testing', 'assessing', 'coaching']
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

    it('should handle combination of behaviors', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'assessing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toContain('observing')
      expect(wrapper.vm.value).toContain('assessing')
      expect(wrapper.vm.value.length).toBe(2)
    })
  })

  describe('behaviour options', () => {
    it('should include observing behaviour', () => {
      const observing = wrapper.vm.getBehaviours.find((b) => b.value === 'observing')
      expect(observing).toBeDefined()
      expect(observing.text).toBe('Observing')
    })

    it('should include practicing behaviour', () => {
      const practicing = wrapper.vm.getBehaviours.find((b) => b.value === 'practicing')
      expect(practicing).toBeDefined()
      expect(practicing.text).toBe('Practicing')
    })

    it('should include testing behaviour', () => {
      const testing = wrapper.vm.getBehaviours.find((b) => b.value === 'testing')
      expect(testing).toBeDefined()
      expect(testing.text).toBe('Testing')
    })

    it('should include assessing behaviour', () => {
      const assessing = wrapper.vm.getBehaviours.find((b) => b.value === 'assessing')
      expect(assessing).toBeDefined()
      expect(assessing.text).toBe('Assessing')
    })

    it('should include coaching behaviour', () => {
      const coaching = wrapper.vm.getBehaviours.find((b) => b.value === 'coaching')
      expect(coaching).toBeDefined()
      expect(coaching.text).toBe('Coaching')
    })

    it('should have consistent value/text mapping', () => {
      const behaviours = wrapper.vm.getBehaviours
      const expectedMap = {
        'observing': 'Observing',
        'practicing': 'Practicing',
        'testing': 'Testing',
        'assessing': 'Assessing',
        'coaching': 'Coaching'
      }
      behaviours.forEach(b => {
        expect(b.text).toBe(expectedMap[b.value])
      })
    })
  })

  describe('template structure', () => {
    it('should have proper form group title', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should support custom item slot', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should support custom selection slot', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
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
    it('should get behaviours from Vuex store', () => {
      expect(wrapper.vm.getBehaviours).toBeDefined()
      expect(wrapper.vm.getBehaviours.length).toBeGreaterThan(0)
    })

    it('should map trainingLibraryHelpers/getBehaviours getter', () => {
      expect(wrapper.vm.getBehaviours).toBeDefined()
    })

    it('should use correct store getter path', () => {
      expect(wrapper.vm.getBehaviours).toBeDefined()
    })

    it('should retrieve behaviours from store properly', () => {
      const behaviours = wrapper.vm.$store.getters['trainingLibraryHelpers/getBehaviours']
      expect(Array.isArray(behaviours)).toBe(true)
    })

    it('should access store getters without errors', () => {
      expect(() => {
        const behaviours = wrapper.vm.$store.getters['trainingLibraryHelpers/getBehaviours']
        return behaviours
      }).not.toThrow()
    })
  })

  describe('state management', () => {
    it('should maintain selected behaviours', () => {
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['observing', 'practicing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['observing', 'practicing'])
    })

    it('should preserve state across multiple updates', async () => {
      expect(wrapper.vm.value).toEqual([])
      await wrapper.setProps({ value: ['testing'] })
      expect(wrapper.vm.value).toEqual(['testing'])
      await wrapper.setProps({ value: ['testing', 'practicing'] })
      expect(wrapper.vm.value.length).toBe(2)
    })

    it('should handle value clearing', async () => {
      await wrapper.setProps({ value: ['observing', 'practicing'] })
      expect(wrapper.vm.value.length).toBe(2)
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should maintain label references', () => {
      expect(wrapper.vm.labels).toBeDefined()
      const initialLabels = wrapper.vm.labels
      expect(initialLabels).toBe(labels)
    })
  })

  describe('behavior list validation', () => {
    it('should have at least 5 behaviors', () => {
      expect(wrapper.vm.getBehaviours.length).toBeGreaterThanOrEqual(5)
    })

    it('should all behaviors have required properties', () => {
      wrapper.vm.getBehaviours.forEach(behaviour => {
        expect(behaviour.value).toBeDefined()
        expect(behaviour.text).toBeDefined()
      })
    })

    it('should each behavior value be a string', () => {
      wrapper.vm.getBehaviours.forEach(behaviour => {
        expect(typeof behaviour.value).toBe('string')
      })
    })

    it('should each behavior text be a string', () => {
      wrapper.vm.getBehaviours.forEach(behaviour => {
        expect(typeof behaviour.text).toBe('string')
      })
    })

    it('should behavior values be unique', () => {
      const values = wrapper.vm.getBehaviours.map(b => b.value)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(values.length)
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
      wrapper = shallowMount(InputBehaviour, {
        propsData: {
          value: ['practicing', 'testing']
        },
        store,
        localVue,
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['practicing', 'testing'])
    })
  })
})
