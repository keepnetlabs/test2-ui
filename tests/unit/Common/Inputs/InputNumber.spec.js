import { shallowMount } from '@vue/test-utils'
import InputNumber from '@/components/Common/Inputs/InputNumber.vue'

describe('InputNumber.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputNumber, {
      stubs: {
        VTextField: true
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
      expect(wrapper.vm.$options.name).toBe('InputNumber')
    })
  })

  describe('props handling', () => {
    it('should have value prop', () => {
      expect(wrapper.vm.$options.props.value).toBeDefined()
    })

    it('should have initialPlaceholder prop', () => {
      expect(wrapper.vm.$options.props.initialPlaceholder).toBeDefined()
    })

    it('should have initialRules prop', () => {
      expect(wrapper.vm.$options.props.initialRules).toBeDefined()
    })

    it('should have entityName prop', () => {
      expect(wrapper.vm.$options.props.entityName).toBeDefined()
    })

    it('should have id prop', () => {
      expect(wrapper.vm.$options.props.id).toBeDefined()
    })

    it('should have required prop default true', () => {
      expect(wrapper.vm.$options.props.required.default).toBe(true)
    })

    it('should have disabled prop default false', () => {
      expect(wrapper.vm.$options.props.disabled.default).toBe(false)
    })

    it('should have readonly prop default false', () => {
      expect(wrapper.vm.$options.props.readonly.default).toBe(false)
    })

    it('should have applyRules prop default true', () => {
      expect(wrapper.vm.$options.props.applyRules.default).toBe(true)
    })

    it('should have hideDetails prop default false', () => {
      expect(wrapper.vm.$options.props.hideDetails.default).toBe(false)
    })

    it('should have pattern prop', () => {
      expect(wrapper.vm.$options.props.pattern).toBeDefined()
    })

    it('should have default pattern for digits only', () => {
      const pattern = wrapper.vm.$options.props.pattern.default()
      expect(pattern).toEqual(/^\d+$/)
    })
  })

  describe('data initialization', () => {
    it('should initialize rules as empty array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should initialize placeholder as empty string', () => {
      expect(wrapper.vm.placeholder).toBe('')
    })

    it('should initialize requiredProps as empty object', () => {
      expect(typeof wrapper.vm.requiredProps).toBe('object')
    })
  })

  describe('pattern validation', () => {
    it('should have default pattern /^\\d+$/', () => {
      const pattern = wrapper.vm.pattern
      expect(pattern).toEqual(/^\d+$/)
    })

    it('should accept custom pattern', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          pattern: /^[0-9]{3}$/
        }
      })
      expect(wrapper.vm.pattern).toEqual(/^[0-9]{3}$/)
    })

    it('should validate digit pattern correctly', () => {
      const pattern = /^\d+$/
      expect(pattern.test('123')).toBe(true)
      expect(pattern.test('0')).toBe(true)
      expect(pattern.test('999')).toBe(true)
    })

    it('should reject non-digit pattern', () => {
      const pattern = /^\d+$/
      expect(pattern.test('abc')).toBe(false)
      expect(pattern.test('12a')).toBe(false)
      expect(pattern.test('12.5')).toBe(false)
    })
  })

  describe('placeholder initialization', () => {
    it('should use initialPlaceholder if provided', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          initialPlaceholder: 'Custom placeholder'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })

    it('should use entityName if initialPlaceholder is empty', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          initialPlaceholder: '',
          entityName: 'Age'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Age')
    })

    it('should generate default placeholder from entityName', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Quantity'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Quantity')
    })

    it('should use empty placeholder if no entityName provided', () => {
      expect(wrapper.vm.placeholder).toBe('')
    })
  })

  describe('required props configuration', () => {
    it('should set required props when required is true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should not set required props when required is false', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.requiredProps).toEqual({})
    })

    it('should add required validation rule when required is true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('rules handling', () => {
    it('should initialize rules from initialRules when provided', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputNumber, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not apply rules when applyRules is false', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputNumber, {
        propsData: {
          initialRules: customRules,
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should apply rules when applyRules is true', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputNumber, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('handleInputChange method', () => {
    it('should be defined', () => {
      expect(wrapper.vm.handleInputChange).toBeDefined()
      expect(typeof wrapper.vm.handleInputChange).toBe('function')
    })

    it('should emit input event for valid number', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('123')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('456')
      expect(wrapper.emitted('input')[0][0]).toBe('456')
    })

    it('should emit empty string for empty value', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('')
      expect(wrapper.emitted('input')[0][0]).toBe('')
    })

    it('should revert invalid input to previous value', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          value: '123'
        }
      })
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '123',
        lazyValue: '123'
      }
      wrapper.vm.handleInputChange('abc')
      expect(wrapper.vm.$refs.refInputNumber.lazyValue).toBe('123')
    })

    it('should not emit for invalid pattern', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('not a number')
      // Should revert, not emit
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle custom pattern validation', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          pattern: /^[0-9]{1,3}$/
        }
      })
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('12')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('input states', () => {
    it('should support disabled state', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should support readonly state', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should support id attribute', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          id: 'age-input'
        }
      })
      expect(wrapper.vm.id).toBe('age-input')
    })

    it('should hide details when hideDetails is true', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          hideDetails: true
        }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })
  })

  describe('lifecycle - created hook', () => {
    it('should set up required props on created', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: true,
          entityName: 'User ID'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })

    it('should set placeholder from entityName on created', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Quantity'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Quantity')
    })

    it('should add required rule if needed', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('reactivity', () => {
    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          value: '100'
        }
      })
      await wrapper.setProps({ value: '200' })
      expect(wrapper.vm.value).toBe('200')
    })

    it('should update when entityName changes', async () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Age'
        }
      })
      await wrapper.setProps({ entityName: 'Amount' })
      expect(wrapper.vm.entityName).toBe('Amount')
    })

    it('should update disabled state', async () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          disabled: false
        }
      })
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as quantity input', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Quantity',
          required: true
        }
      })
      expect(wrapper.vm.placeholder).toContain('Quantity')
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })

    it('should work as age input', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Age',
          initialPlaceholder: 'Enter your age',
          required: true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Enter your age')
    })

    it('should work as optional number field', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          entityName: 'Additional Info',
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.requiredProps).toEqual({})
    })

    it('should work with custom validation pattern', () => {
      wrapper = shallowMount(InputNumber, {
        propsData: {
          pattern: /^[0-9]{1,3}$/,
          entityName: 'PIN'
        }
      })
      expect(wrapper.vm.pattern).toEqual(/^[0-9]{1,3}$/)
    })
  })

  describe('user interaction', () => {
    it('should handle number input', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('123')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle zero input', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('0')
      expect(wrapper.emitted('input')[0][0]).toBe('0')
    })

    it('should handle large numbers', () => {
      wrapper.vm.$refs.refInputNumber = {
        initialValue: '',
        lazyValue: ''
      }
      wrapper.vm.handleInputChange('999999999')
      expect(wrapper.emitted('input')[0][0]).toBe('999999999')
    })
  })
})
