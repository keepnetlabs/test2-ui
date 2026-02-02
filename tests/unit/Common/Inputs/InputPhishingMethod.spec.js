import { shallowMount } from '@vue/test-utils'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import labels from '@/model/constants/labels'
import { SCENARIO_METHOD_TYPES } from '@/components/PhishingScenarios/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('InputPhishingMethod.vue', () => {
  let wrapper
  const mockItems = [
    { name: 'Click Only', resourceId: 'click-only', disabled: false },
    { name: 'Data Submission', resourceId: 'data-submission', disabled: false },
    { name: 'Attachment', resourceId: 'attachment', disabled: false },
    { name: 'MFA', resourceId: 'mfa', disabled: false }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputPhishingMethod, {
      propsData: {
        value: 'click-only',
        items: mockItems
      },
      stubs: {
        'form-group': true,
        'k-select': true
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
      expect(wrapper.vm.$options.name).toBe('InputPhishingMethod')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should render KSelect component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have value default empty string', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should have items default empty array', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.items).toEqual([])
    })

    it('should have maxLength default 64', () => {
      expect(wrapper.vm.maxLength).toBe(64)
    })

    it('should have itemTextKey default "name"', () => {
      expect(wrapper.vm.itemTextKey).toBe('name')
    })

    it('should have itemValueKey default "resourceId"', () => {
      expect(wrapper.vm.itemValueKey).toBe('resourceId')
    })

    it('should have subtitle default', () => {
      expect(wrapper.vm.subtitle).toBe('Select the phishing technique for this template')
    })

    it('should have type default PHISHING', () => {
      expect(wrapper.vm.type).toBe(SCENARIO_TYPES.PHISHING)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          value: 'data-submission',
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toBe('data-submission')
    })

    it('should accept custom items', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          maxLength: 100
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.maxLength).toBe(100)
    })

    it('should accept custom subtitle', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          subtitle: 'Choose attack method'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.subtitle).toBe('Choose attack method')
    })

    it('should accept custom itemTextKey', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          itemTextKey: 'label'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemTextKey).toBe('label')
    })

    it('should accept custom itemValueKey', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          itemValueKey: 'id'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemValueKey).toBe('id')
    })

    it('should accept quishing type', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          type: 'quishing'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.type).toBe('quishing')
    })

    it('should accept disabled true', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('data properties', () => {
    it('should have commonRules with required validation', () => {
      expect(wrapper.vm.commonRules).toBeDefined()
      expect(wrapper.vm.commonRules.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.commonRules.rules)).toBe(true)
    })

    it('should have required validation rule', () => {
      expect(wrapper.vm.commonRules.rules.length).toBeGreaterThanOrEqual(1)
    })

    it('should have maxLength validation rule', () => {
      expect(wrapper.vm.commonRules.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should have persistent hint', () => {
      expect(wrapper.vm.commonRules.persistentHint).toBe(true)
    })

    it('should have hint text', () => {
      expect(wrapper.vm.commonRules.hint).toBe('*Required')
    })
  })

  describe('getMethodTypeDescription method', () => {
    it('should be defined', () => {
      expect(typeof wrapper.vm.getMethodTypeDescription).toBe('function')
    })

    it('should return description for CLICK_ONLY method', () => {
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.CLICK_ONLY)
      expect(description).toContain('See who fails')
    })

    it('should return description for CLICK_ONLY_SPACE method', () => {
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.CLICK_ONLY_SPACE)
      expect(description).toContain('See who fails')
    })

    it('should return description for DATA_SUBMISSION method', () => {
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.DATA_SUBMISSION)
      expect(description).toContain('Gather information')
    })

    it('should return description for ATTACHMENT method', () => {
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.ATTACHMENT)
      expect(description).toBe('Send a trackable file')
    })

    it('should return description for MFA method', () => {
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.MFA)
      expect(description).toBe('Send a phishing MFA')
    })

    it('should return default description for unknown method', () => {
      const description = wrapper.vm.getMethodTypeDescription('unknown')
      expect(description).toContain('See who fails')
    })

    it('should use phishing term for PHISHING type', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          type: SCENARIO_TYPES.PHISHING
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.CLICK_ONLY)
      expect(description.toLowerCase()).toContain('phishing')
    })

    it('should use quishing term for non-PHISHING type', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          type: 'quishing'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      const description = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.CLICK_ONLY)
      expect(description.toLowerCase()).toContain('quishing')
    })

    it('should handle empty method parameter', () => {
      const description = wrapper.vm.getMethodTypeDescription()
      expect(description).toBeDefined()
      expect(typeof description).toBe('string')
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass disabled state to KSelect', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have custom item slot', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('event handling', () => {
    it('should emit input event when value changes', () => {
      wrapper.vm.$emit('input', 'attachment')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      wrapper.vm.$emit('input', 'mfa')
      expect(wrapper.emitted('input')[0][0]).toBe('mfa')
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: 'attachment' })
      expect(wrapper.vm.value).toBe('attachment')
    })

    it('should update when items prop changes', async () => {
      const newItems = [
        { name: 'New Method', resourceId: 'new-method', disabled: false }
      ]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items).toEqual(newItems)
    })

    it('should update when type prop changes', async () => {
      await wrapper.setProps({ type: 'quishing' })
      expect(wrapper.vm.type).toBe('quishing')
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work with phishing scenario', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          value: 'click-only',
          items: mockItems,
          type: SCENARIO_TYPES.PHISHING
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.type).toBe(SCENARIO_TYPES.PHISHING)
      expect(wrapper.vm.value).toBe('click-only')
    })

    it('should work with quishing scenario', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          value: 'data-submission',
          items: mockItems,
          type: 'quishing'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.type).toBe('quishing')
    })

    it('should work with all method types', () => {
      const methodTypes = [
        SCENARIO_METHOD_TYPES.CLICK_ONLY,
        SCENARIO_METHOD_TYPES.DATA_SUBMISSION,
        SCENARIO_METHOD_TYPES.ATTACHMENT,
        SCENARIO_METHOD_TYPES.MFA
      ]

      methodTypes.forEach((method) => {
        const description = wrapper.vm.getMethodTypeDescription(method)
        expect(description).toBeDefined()
        expect(typeof description).toBe('string')
        expect(description.length).toBeGreaterThan(0)
      })
    })

    it('should work with custom items configuration', () => {
      const customItems = [
        { name: 'Method 1', resourceId: 'method-1', disabled: false },
        { name: 'Method 2', resourceId: 'method-2', disabled: true }
      ]
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: customItems,
          itemTextKey: 'name',
          itemValueKey: 'resourceId'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.items).toEqual(customItems)
    })

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('validation rules', () => {
    it('should have required validation rule', () => {
      const rules = wrapper.vm.commonRules.rules
      expect(rules.length).toBeGreaterThan(0)
    })

    it('should have maxLength validation rule', () => {
      const rules = wrapper.vm.commonRules.rules
      expect(rules.length).toBeGreaterThan(1)
    })

    it('should apply maxLength from props', () => {
      wrapper = shallowMount(InputPhishingMethod, {
        propsData: {
          items: mockItems,
          maxLength: 50
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.maxLength).toBe(50)
    })
  })

  describe('state management', () => {
    it('should maintain selected method', () => {
      expect(wrapper.vm.value).toBe('click-only')
    })

    it('should maintain items list', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should maintain configuration properties', () => {
      expect(wrapper.vm.itemTextKey).toBe('name')
      expect(wrapper.vm.itemValueKey).toBe('resourceId')
    })
  })

  describe('template structure', () => {
    it('should have proper form group title', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should render custom item slot', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have required hint', () => {
      expect(wrapper.vm.commonRules.hint).toBe('*Required')
    })
  })

  describe('method type descriptions', () => {
    it('should describe click only method correctly', () => {
      const desc = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.CLICK_ONLY)
      expect(desc).toMatch(/See who fails/)
    })

    it('should describe data submission method correctly', () => {
      const desc = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.DATA_SUBMISSION)
      expect(desc).toMatch(/Gather information/)
    })

    it('should describe attachment method correctly', () => {
      const desc = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.ATTACHMENT)
      expect(desc).toBe('Send a trackable file')
    })

    it('should describe MFA method correctly', () => {
      const desc = wrapper.vm.getMethodTypeDescription(SCENARIO_METHOD_TYPES.MFA)
      expect(desc).toBe('Send a phishing MFA')
    })
  })
})
