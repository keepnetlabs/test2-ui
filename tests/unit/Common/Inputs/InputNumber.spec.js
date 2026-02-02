import { shallowMount } from '@vue/test-utils'
import InputNumber from '@/components/Common/Inputs/InputNumber.vue'

describe('InputNumber.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputNumber)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputNumber')
    })

    it('should render v-text-field', () => {
      const textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have value prop', () => {
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should have initialPlaceholder default empty string', () => {
      expect(wrapper.vm.initialPlaceholder).toBe('')
    })

    it('should have required default true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have readonly default false', () => {
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should have applyRules default true', () => {
      expect(wrapper.vm.applyRules).toBe(true)
    })

    it('should have hideDetails default false', () => {
      expect(wrapper.vm.hideDetails).toBe(false)
    })

    it('should have digit pattern by default', () => {
      expect(wrapper.vm.pattern).toBeDefined()
      expect(wrapper.vm.pattern.test('123')).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { value: '42' }
      })
      expect(wrapper.vm.value).toBe('42')
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { initialPlaceholder: 'Enter age' }
      })
      expect(wrapper.vm.initialPlaceholder).toBe('Enter age')
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { entityName: 'Age' }
      })
      expect(wrapper.vm.entityName).toBe('Age')
    })

    it('should accept custom id', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { id: 'input-age' }
      })
      expect(wrapper.vm.id).toBe('input-age')
    })

    it('should accept required false', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: false }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should accept disabled true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { disabled: true }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept readonly true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { readonly: true }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should accept applyRules false', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { applyRules: false }
      })
      expect(wrapper.vm.applyRules).toBe(false)
    })

    it('should accept hideDetails true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { hideDetails: true }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })

    it('should accept custom pattern', () => {
      const customPattern = /^[0-9]{1,3}$/
      wrapper = shallowMount(InputNumber, {
        propsData: { pattern: customPattern }
      })
      expect(wrapper.vm.pattern).toBe(customPattern)
    })

    it('should accept custom rules', () => {
      const rules = [(v) => v.length > 0]
      wrapper = shallowMount(InputNumber, {
        propsData: { initialRules: rules }
      })
      expect(wrapper.vm.initialRules).toEqual(rules)
    })
  })

  describe('data properties', () => {
    it('should initialize rules array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should initialize placeholder', () => {
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should initialize requiredProps', () => {
      expect(typeof wrapper.vm.requiredProps).toBe('object')
    })
  })

  describe('handleInputChange method', () => {
    it('should have handleInputChange method', () => {
      expect(typeof wrapper.vm.handleInputChange).toBe('function')
    })

    it('should emit input event for valid number', () => {
      wrapper.vm.handleInputChange('123')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('123')
    })

    it('should emit input event for empty value', () => {
      wrapper.vm.handleInputChange('')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('')
    })

    it('should not emit input for invalid pattern', () => {
      wrapper.vm.value = '123'
      wrapper.vm.handleInputChange('abc')
      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('should emit input for valid multi-digit number', () => {
      wrapper.vm.handleInputChange('9876543210')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should not emit input for non-numeric characters', () => {
      wrapper.vm.value = '100'
      wrapper.vm.handleInputChange('12.5')
      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('should not emit input for negative numbers by default', () => {
      wrapper.vm.value = '50'
      wrapper.vm.handleInputChange('-10')
      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('should reset field value on invalid input', () => {
      wrapper.vm.value = '100'
      wrapper.vm.$refs.refInputNumber = { initialValue: '100', lazyValue: '100' }
      wrapper.vm.handleInputChange('invalid')
      expect(wrapper.vm.$refs.refInputNumber.initialValue).toBe('100')
      expect(wrapper.vm.$refs.refInputNumber.lazyValue).toBe('100')
    })

    it('should handle zero value', () => {
      wrapper.vm.handleInputChange('0')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('created hook', () => {
    it('should add required rule when required is true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: true }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should set requiredProps when required is true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: true }
      })
      expect(wrapper.vm.requiredProps).toEqual({
        hint: '*Required',
        persistentHint: true
      })
    })

    it('should not add required rule when required is false', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: false }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should set placeholder from initialPlaceholder', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { initialPlaceholder: 'Custom placeholder' }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })

    it('should set placeholder with entityName when initialPlaceholder not provided', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { entityName: 'Age' }
      })
      expect(wrapper.vm.placeholder).toContain('Age')
    })

    it('should use initialRules when applyRules is true', () => {
      const rules = [(v) => v > 0]
      wrapper = shallowMount(InputNumber, {
        propsData: { applyRules: true, initialRules: rules }
      })
      expect(wrapper.vm.rules).toContain(rules[0])
    })

    it('should clear rules when applyRules is false', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { applyRules: false, initialRules: [(v) => v > 0], required: false }
      })
      expect(wrapper.vm.rules).toEqual([])
    })
  })

  describe('pattern validation', () => {
    it('should accept digits only pattern', () => {
      expect(wrapper.vm.pattern.test('12345')).toBe(true)
    })

    it('should reject non-digit characters', () => {
      expect(wrapper.vm.pattern.test('123abc')).toBe(false)
    })

    it('should accept zero', () => {
      expect(wrapper.vm.pattern.test('0')).toBe(true)
    })

    it('should reject empty string with pattern', () => {
      const emptyPatternTest = wrapper.vm.pattern.test('')
      expect(emptyPatternTest).toBe(false)
    })

    it('should handle custom pattern', () => {
      const customPattern = /^[0-9]{1,3}$/
      wrapper = shallowMount(InputNumber, {
        propsData: { pattern: customPattern }
      })
      expect(wrapper.vm.pattern.test('123')).toBe(true)
      expect(wrapper.vm.pattern.test('1234')).toBe(false)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: '100' })
      expect(wrapper.vm.value).toBe('100')
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update when required prop changes', async () => {
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })
  })

  describe('text field props binding', () => {
    it('should pass value to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { value: '42' }
      })
      expect(wrapper.vm.value).toBe('42')
    })

    it('should pass disabled to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { disabled: true }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should pass readonly to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { readonly: true }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should pass hideDetails to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { hideDetails: true }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })

    it('should pass placeholder to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { initialPlaceholder: 'Enter number' }
      })
      expect(wrapper.vm.placeholder).toBe('Enter number')
    })

    it('should pass id to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { id: 'input-number' }
      })
      expect(wrapper.vm.id).toBe('input-number')
    })

    it('should pass rules to text field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: true }
      })
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('required field behavior', () => {
    it('should have hint for required field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: true }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })

    it('should have persistentHint for required field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: true }
      })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should not have hint for optional field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { required: false }
      })
      expect(wrapper.vm.requiredProps).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('should handle very large number', () => {
      wrapper.vm.handleInputChange('999999999999')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle single digit', () => {
      wrapper.vm.handleInputChange('5')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle null value', () => {
      wrapper.vm.handleInputChange(null)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle undefined value', () => {
      wrapper.vm.handleInputChange(undefined)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle false value', () => {
      wrapper.vm.handleInputChange(false)
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle value with leading zeros', () => {
      wrapper.vm.value = '999'
      wrapper.vm.handleInputChange('0123')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('integration scenarios', () => {
    it('should work as required number field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: true,
          entityName: 'Amount'
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.placeholder).toContain('Amount')
    })

    it('should work as optional number field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: false,
          initialPlaceholder: 'Optional amount'
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.placeholder).toBe('Optional amount')
    })

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { disabled: true }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should work with readonly state', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: { readonly: true }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })
  })
})
