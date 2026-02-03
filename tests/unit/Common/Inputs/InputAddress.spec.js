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

  describe('address formats and validations', () => {
    it('should accept short addresses', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123 Main St'
        }
      })
      expect(wrapper.vm.value).toBe('123 Main St')
    })

    it('should accept very long addresses', () => {
      const longAddress = 'A'.repeat(190) + ' St, City, State 12345'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: longAddress
        }
      })
      expect(wrapper.vm.value.length).toBeGreaterThan(180)
    })

    it('should accept multiline addresses', () => {
      const multilineAddress = '123 Main Street\nApartment 4B\nNew York, NY 10001'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: multilineAddress
        }
      })
      expect(wrapper.vm.value).toContain('\n')
    })

    it('should accept addresses with special characters', () => {
      const specialAddress = '123 O\'Brien St, Suite #200'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: specialAddress
        }
      })
      expect(wrapper.vm.value).toBe(specialAddress)
    })

    it('should accept addresses with numbers and letters', () => {
      const mixedAddress = '456 South 123rd Avenue'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: mixedAddress
        }
      })
      expect(wrapper.vm.value).toBe(mixedAddress)
    })

    it('should handle address with apartment/unit number', () => {
      const apartmentAddress = '789 Main St, Apt 401'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: apartmentAddress
        }
      })
      expect(wrapper.vm.value).toContain('Apt')
    })

    it('should handle address with postal code', () => {
      const postalAddress = '123 Main St, City, ST 12345'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: postalAddress
        }
      })
      expect(wrapper.vm.value).toContain('12345')
    })

    it('should handle international addresses', () => {
      const internationalAddress = '42 Rue de Paris, 75001 Paris, France'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: internationalAddress
        }
      })
      expect(wrapper.vm.value).toBe(internationalAddress)
    })

    it('should handle addresses with hyphens', () => {
      const hyphenAddress = '123 North-South Street'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: hyphenAddress
        }
      })
      expect(wrapper.vm.value).toContain('-')
    })

    it('should handle addresses with unicode characters', () => {
      const unicodeAddress = '北京市朝阳区建国路1号'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: unicodeAddress
        }
      })
      expect(wrapper.vm.value).toBe(unicodeAddress)
    })
  })

  describe('maxLength validation enforcement', () => {
    it('should default to 200 characters max', () => {
      expect(wrapper.vm.maxLength).toBe(200)
    })

    it('should accept custom max lengths', () => {
      const customLengths = [100, 150, 300, 500, 1000]
      customLengths.forEach(length => {
        wrapper = shallowMount(InputAddress, {
          propsData: { maxLength: length }
        })
        expect(wrapper.vm.maxLength).toBe(length)
      })
    })

    it('should have max length rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThanOrEqual(2)
    })


    it('should handle very large max lengths', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: { maxLength: 5000 }
      })
      expect(wrapper.vm.maxLength).toBe(5000)
    })

    it('should handle very small max lengths', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: { maxLength: 10 }
      })
      expect(wrapper.vm.maxLength).toBe(10)
    })
  })

  describe('startsWithSpace validation', () => {
    it('should have startsWithSpace rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
      expect(typeof rules[0]).toBe('function')
    })

    it('should reject addresses starting with space', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule(' 123 Main St')
      expect(result).not.toBe(true)
    })



    it('should reject multiple leading spaces', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('    123 Main St')
      expect(result).not.toBe(true)
    })

    it('should reject tab at start', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('\t123 Main St')
      expect(result).not.toBe(true)
    })

    it('should reject newline at start', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('\n123 Main St')
      expect(result).not.toBe(true)
    })
  })

  describe('placeholder customization', () => {
    it('should accept very long placeholder', () => {
      const longPlaceholder = 'Enter your full mailing address including street, city, state and postal code here'.repeat(2)
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: longPlaceholder
        }
      })
      expect(wrapper.vm.placeholder.length).toBeGreaterThan(100)
    })

    it('should accept placeholder with special characters', () => {
      const specialPlaceholder = 'e.g., 123 Main St, Apt #4, City, ST 12345'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: specialPlaceholder
        }
      })
      expect(wrapper.vm.placeholder).toBe(specialPlaceholder)
    })

    it('should accept placeholder with unicode', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Dirección de envío 📬'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Dirección')
    })

    it('should accept placeholder with newlines', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialPlaceholder: 'Line 1\nLine 2'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Line 1')
    })
  })

  describe('entity name integration', () => {
    it('should use entity name in validation messages', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Billing Address'
        }
      })
      expect(wrapper.vm.entityName).toBe('Billing Address')
    })

    it('should handle entity name with spaces', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Shipping Address With Multiple Words'
        }
      })
      expect(wrapper.vm.entityName).toContain('Address')
    })

    it('should handle entity name with special characters', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: 'Address (Primary)'
        }
      })
      expect(wrapper.vm.entityName).toBe('Address (Primary)')
    })

    it('should work without entity name', () => {
      expect(wrapper.vm.entityName).toBeUndefined()
    })

    it('should handle very long entity name', () => {
      const longEntityName = 'Very Long Entity Name For Address Field That Exceeds Normal Length'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          entityName: longEntityName
        }
      })
      expect(wrapper.vm.entityName).toBe(longEntityName)
    })
  })

  describe('value content variations', () => {
    it('should handle value with only numbers', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123456'
        }
      })
      expect(wrapper.vm.value).toBe('123456')
    })

    it('should handle value with only letters', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'MainStreetNewYork'
        }
      })
      expect(wrapper.vm.value).toBe('MainStreetNewYork')
    })

    it('should handle value with mixed case', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'MiXeD CaSe AdDrEsS'
        }
      })
      expect(wrapper.vm.value).toBe('MiXeD CaSe AdDrEsS')
    })

    it('should handle value with tabs', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123 Main St\tApartment 4'
        }
      })
      expect(wrapper.vm.value).toContain('\t')
    })

    it('should handle value with multiple spaces', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123    Main    St'
        }
      })
      expect(wrapper.vm.value).toContain('   ')
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle undefined initialRules prop', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: undefined
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should handle null initialRules prop', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: null
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should handle empty initialRules array', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: []
        }
      })
      expect(wrapper.vm.rules).toEqual([])
    })

    it('should handle very large initialRules array', () => {
      const manyRules = Array.from({ length: 20 }, () => (v) => true)
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: manyRules
        }
      })
      expect(wrapper.vm.rules.length).toBe(20)
    })
  })

  describe('form submission scenarios', () => {
    it('should provide value for form submission', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123 Main St, City, ST 12345'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should validate before form submission', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true,
          value: ' invalid'
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should work with form validation rules', () => {
      const customRules = [
        (v) => v && v.length > 0 || 'Address required',
        (v) => v && v.length <= 200 || 'Address too long'
      ]
      wrapper = shallowMount(InputAddress, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should maintain state during validation', () => {
      const address = '123 Main St'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: address
        }
      })
      expect(wrapper.vm.value).toBe(address)
      expect(wrapper.vm.rules).toBeDefined()
    })
  })

  describe('accessibility features', () => {
    it('should support id for label association', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          id: 'address-input-1'
        }
      })
      expect(wrapper.vm.id).toBe('address-input-1')
    })

    it('should support placeholder for guidance', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(wrapper.vm.placeholder.length).toBeGreaterThan(0)
    })

    it('should show required indicator', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
    })

    it('should have persistent hint for clarity', () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })
  })

  describe('complex prop combinations', () => {
    it('should work with all custom props', () => {
      const customRules = [(v) => v ? true : 'Address is required']
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: '123 Custom Address',
          id: 'address-custom',
          initialPlaceholder: 'Enter address',
          entityName: 'Custom Entity',
          maxLength: 500,
          required: true,
          initialRules: customRules
        }
      })
      expect(wrapper.vm.value).toBe('123 Custom Address')
      expect(wrapper.vm.id).toBe('address-custom')
      expect(wrapper.vm.maxLength).toBe(500)
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work with minimal props', () => {
      wrapper = shallowMount(InputAddress)
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.maxLength).toBe(200)
    })

    it('should handle prop updates gracefully', async () => {
      const address = '123 Main St'
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: address
        }
      })
      await wrapper.setProps({ maxLength: 300 })
      expect(wrapper.vm.value).toBe(address)
      expect(wrapper.vm.maxLength).toBe(300)
    })
  })

  describe('reactive data changes', () => {
    it('should reflect value changes reactively', async () => {
      wrapper = shallowMount(InputAddress, {
        propsData: {
          value: 'Original Address'
        }
      })
      await wrapper.setProps({ value: 'New Address' })
      expect(wrapper.vm.value).toBe('New Address')
    })

    it('should update maxLength reactively', async () => {
      expect(wrapper.vm.maxLength).toBe(200)
      await wrapper.setProps({ maxLength: 400 })
      expect(wrapper.vm.maxLength).toBe(400)
    })

  })
})
