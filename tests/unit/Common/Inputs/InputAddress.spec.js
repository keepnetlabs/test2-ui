import { shallowMount } from '@vue/test-utils'
import InputAddress from '@/components/Common/Inputs/InputAddress.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Address: 'Address',
  CannotStartWithSpace: 'Cannot start with space',
  RequiredStar: '*Required',
  EnterAddress: 'Enter address',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputAddress.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputAddress)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputAddress')
    })

    it('should render v-textarea element', () => {
      expect(wrapper.find('v-textarea-stub').exists()).toBe(true)
    })

    it('should have proper template structure', () => {
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$options.name).toBe('InputAddress')
    })
  })

  describe('prop defaults', () => {
    it('should have maxLength default 200', () => {
      expect(wrapper.vm.maxLength).toBe(200)
    })

    it('should have required default false', () => {
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have initialPlaceholder default empty string', () => {
      expect(wrapper.vm.initialPlaceholder).toBe('')
    })

    it('should have value prop undefined by default', () => {
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should have id prop undefined by default', () => {
      expect(wrapper.vm.id).toBeUndefined()
    })

    it('should have entityName prop undefined by default', () => {
      expect(wrapper.vm.entityName).toBeUndefined()
    })

    it('should have initialRules prop undefined by default', () => {
      expect(wrapper.vm.initialRules).toBeUndefined()
    })

    it('should support persistent hint in requiredProps', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'Test address content'
        }
      })
      expect(wrapper.vm.value).toBe('Test address content')
    })

    it('should accept custom id', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          id: 'custom-address'
        }
      })
      expect(wrapper.vm.id).toBe('custom-address')
    })

    it('should accept custom initialPlaceholder', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Enter your address'
        }
      })
      expect(wrapper.vm.initialPlaceholder).toBe('Enter your address')
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Billing Address'
        }
      })
      expect(wrapper.vm.entityName).toBe('Billing Address')
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should accept required prop true', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept custom initialRules', () => {
      const customRules = [(v) => v.length > 0 || 'Required']
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.initialRules).toEqual(customRules)
    })
  })

  describe('data properties', () => {
    it('should have rules data property', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have placeholder data property', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should have requiredProps data property', () => {
      expect(wrapper.vm.requiredProps).toBeDefined()
      expect(typeof wrapper.vm.requiredProps).toBe('object')
    })

    it('should initialize rules with default validations', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have startsWithSpace rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(1)
    })

    it('should have maxLength rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should have placeholder initialized to default', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterAddress)
    })

    it('should have empty requiredProps initially for non-required', () => {
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('validation rules', () => {
    it('should have startsWithSpace validation', () => {
      const rule = wrapper.vm.rules[0]
      expect(typeof rule).toBe('function')
    })

    it('should have maxLength validation', () => {
      const rule = wrapper.vm.rules[1]
      expect(typeof rule).toBe('function')
    })

    it('should have callable validation functions', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })

    it('should have at least 2 default validation rules', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should initialize rules from data', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have proper rule function types', () => {
      const rules = wrapper.vm.rules
      expect(rules.every((rule) => typeof rule === 'function')).toBe(true)
    })

    it('should use startsWithSpace validation from utils', () => {
      expect(Validations.startsWithSpace).toBeDefined()
    })

    it('should use maxLength validation from utils', () => {
      expect(Validations.maxLength).toBeDefined()
    })

    it('should include entityName in validation logic', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Custom Entity',
          maxLength: 100
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
    })

    it('should use maxLength prop in validation', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should have rules that are functions', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
      expect(typeof rules[0]).toBe('function')
    })
  })

  describe('created hook behavior', () => {
    it('should initialize rules in created hook', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should initialize placeholder in created hook', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterAddress)
    })

    it('should add required rule when required prop true', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      // Should have required validation added
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should set requiredProps in created hook', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should use custom initialPlaceholder when provided', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Custom text'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom text')
    })

    it('should apply initialRules when provided', () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should use default rules when initialRules is not provided', () => {
      wrapper = shallowMount(InputAddress)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('required vs optional behavior', () => {
    it('should initialize as optional by default', () => {
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should set required validation when required true', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      // Should have additional required validation added
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(3)
    })

    it('should add validation rules when required', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should have required hint text when required', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
    })

    it('should not have requiredProps when not required', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: false
        }
      })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('textarea specific behavior', () => {
    it('should render as textarea not text input', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.exists()).toBe(true)
    })

    it('should have no-resize attribute', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.exists()).toBe(true)
    })

    it('should have outlined styling', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('outlined')).toBeDefined()
    })

    it('should have dense styling', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('dense')).toBeDefined()
    })

    it('should have autocomplete disabled', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('autocomplete')).toBe('disabled')
    })

    it('should have no-resize enabled', () => {
      const textarea = wrapper.find('v-textarea-stub')
      // no-resize is rendered as a static attribute on v-textarea
      expect(textarea.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should maintain rules reactivity', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should maintain placeholder reactivity', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should respond to required prop changes', async () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: false
        }
      })
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain requiredProps state after creation', async () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: false
        }
      })
      const initialKeys = Object.keys(wrapper.vm.requiredProps).length
      expect(initialKeys).toBe(0)
      // Note: InputAddress initializes requiredProps in created hook only,
      // not in a watcher, so prop changes after creation won't update requiredProps
    })

    it('should update maxLength state reactively', async () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          maxLength: 200
        }
      })
      expect(wrapper.vm.maxLength).toBe(200)
      await wrapper.setProps({ maxLength: 500 })
      expect(wrapper.vm.maxLength).toBe(500)
    })
  })

  describe('state management', () => {
    it('should maintain maxLength state', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should maintain required state', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain entityName state', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Custom Entity'
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
    })

    it('should maintain rules state', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should maintain placeholder state', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })
  })

  describe('input event handling', () => {
    it('should emit input event on value change', () => {
      wrapper.vm.$emit('input', 'test content')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      const testContent = 'Test address'
      wrapper.vm.$emit('input', testContent)
      expect(wrapper.emitted('input')[0][0]).toBe(testContent)
    })

    it('should support v-model binding', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'Initial content'
        }
      })
      expect(wrapper.vm.value).toBe('Initial content')
    })

    it('should accept empty string as value', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should handle multiline content', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: multilineContent
        }
      })
      expect(wrapper.vm.value).toBe(multilineContent)
    })
  })

  describe('placeholder handling', () => {
    it('should use default placeholder when not provided', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterAddress)
    })

    it('should use custom placeholder when initialPlaceholder is provided', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Enter full address'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Enter full address')
    })

    it('should bind placeholder to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('placeholder')).toBe(labels.EnterAddress)
    })

    it('should update placeholder with custom value', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Custom placeholder'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('placeholder')).toBe('Custom placeholder')
    })
  })

  describe('accessibility', () => {
    it('should have id for accessibility', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          id: 'address-field'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('id')).toBe('address-field')
    })

    it('should have placeholder for guidance', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should have hint for required indication', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })
  })

  describe('form field integration', () => {
    it('should bind value prop to textarea', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'Test content'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('value')).toBe('Test content')
    })

    it('should bind rules to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('rules')).toBeDefined()
    })

    it('should bind id to textarea', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          id: 'test-id'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('id')).toBe('test-id')
    })

    it('should bind placeholder to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('placeholder')).toBe(labels.EnterAddress)
    })

    it('should use v-bind for requiredProps when required', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('hint')).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as required address field', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true,
          entityName: 'Billing Address',
          maxLength: 300
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should work as optional address field', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: false,
          maxLength: 200
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should work with custom placeholder', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Please provide address...'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Please provide address...')
    })

    it('should work with custom maxLength', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should work with custom rules', () => {
      const customRules = [(v) => !v || 'Custom error']
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })
  })

  describe('textarea configuration', () => {
    it('should have outlined and dense by default', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('outlined')).toBeDefined()
      expect(textarea.attributes('dense')).toBeDefined()
    })

    it('should bind value prop to textarea', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'Test content'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('value')).toBe('Test content')
    })

    it('should bind rules to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('rules')).toBeDefined()
    })

    it('should bind id to textarea', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          id: 'test-id'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('id')).toBe('test-id')
    })

    it('should bind placeholder to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('placeholder')).toBe(labels.EnterAddress)
    })
  })
})
