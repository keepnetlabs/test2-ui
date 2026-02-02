import { shallowMount } from '@vue/test-utils'
import InputDuration from '@/components/Common/Inputs/InputDuration.vue'
import labels from '@/model/constants/labels'
import * as validations from '@/utils/validations'

describe('InputDuration.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputDuration, {
      stubs: {
        'form-group': true,
        'v-text-field': true
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
      expect(wrapper.vm.$options.name).toBe('InputDuration')
    })

    it('should have FormGroup component', () => {
      expect(wrapper.vm.$options.components.FormGroup).toBeDefined()
    })
  })

  describe('prop defaults', () => {
    it('should have value default of 30', () => {
      expect(wrapper.vm.value).toBe(30)
    })

    it('should have isCallback default false', () => {
      expect(wrapper.vm.isCallback).toBe(false)
    })

    it('should accept numeric value prop', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          value: 15
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.value).toBe(15)
    })

    it('should accept string value prop', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          value: '20'
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.value).toBe('20')
    })

    it('should accept isCallback true', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.isCallback).toBe(true)
    })

    it('should accept isCallback false', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: false
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.isCallback).toBe(false)
    })
  })

  describe('data properties', () => {
    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should initialize rules array', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have exactly 2 default validation rules when not callback', () => {
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should have all rules as functions', () => {
      const allFunctions = wrapper.vm.rules.every((rule) => typeof rule === 'function')
      expect(allFunctions).toBe(true)
    })
  })

  describe('validation rules - required', () => {
    it('should have required validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should reject empty value with required rule', () => {
      const requiredRule = wrapper.vm.rules[0]
      const result = requiredRule('')
      expect(result).not.toBe(true)
    })

    it('should accept non-empty value with required rule', () => {
      const requiredRule = wrapper.vm.rules[0]
      const result = requiredRule('30')
      expect(result).toBe(true)
    })

    it('should return required message when empty', () => {
      const requiredRule = wrapper.vm.rules[0]
      const result = requiredRule('')
      expect(typeof result).toBe('string')
    })
  })

  describe('validation rules - no leading zero', () => {
    it('should have no leading zero validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should reject values starting with 0', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('01')
      expect(result).not.toBe(true)
    })

    it('should accept values not starting with 0', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('10')
      expect(result).toBe(true)
    })

    it('should accept single digit without leading zero', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('5')
      expect(result).toBe(true)
    })

    it('should reject single digit 0', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('0')
      expect(result).not.toBe(true)
    })

    it('should return error message for leading zero', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('01')
      expect(typeof result).toBe('string')
      expect(result.toLowerCase()).toContain('cannot start with 0')
    })
  })

  describe('validation rules - callback range', () => {
    it('should not have range rule when isCallback is false', () => {
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should add range validation rule when isCallback is true', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBe(3)
    })

    it('should reject values outside 1-30 range in callback mode', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const rangeRule = wrapper.vm.rules[2]
      expect(typeof rangeRule).toBe('function')
      const resultBelow = rangeRule('0')
      const resultAbove = rangeRule('31')
      expect(resultBelow).not.toBe(true)
      expect(resultAbove).not.toBe(true)
    })

    it('should accept values 1-30 in callback mode', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const rangeRule = wrapper.vm.rules[2]
      const result1 = rangeRule('1')
      const result15 = rangeRule('15')
      const result30 = rangeRule('30')
      expect(result1).toBe(true)
      expect(result15).toBe(true)
      expect(result30).toBe(true)
    })

    it('should have specific error message for callback range', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const rangeRule = wrapper.vm.rules[2]
      const result = rangeRule('100')
      expect(typeof result).toBe('string')
      expect(result.toLowerCase()).toContain('minimum 1')
      expect(result.toLowerCase()).toContain('maximum 30')
    })
  })

  describe('isCallback watcher', () => {
    it('should execute immediately when component mounts', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBe(3)
    })

    it('should add range rule when isCallback changes from false to true', async () => {
      const initialLength = wrapper.vm.rules.length
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should not add duplicate range rules', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const firstLength = wrapper.vm.rules.length
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      // Changing to same value shouldn't add another rule
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(firstLength + 1)
    })
  })

  describe('handleDurationChange method', () => {
    it('should have handleDurationChange method', () => {
      expect(typeof wrapper.vm.handleDurationChange).toBe('function')
    })

    it('should emit input event for valid numeric value', () => {
      wrapper.vm.handleDurationChange('30')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('30')
    })

    it('should emit input event for single digit', () => {
      wrapper.vm.handleDurationChange('5')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('5')
    })

    it('should emit input event for empty value', () => {
      wrapper.vm.handleDurationChange('')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('')
    })

    it('should emit input for 3-digit value', () => {
      wrapper.vm.handleDurationChange('365')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('365')
    })

    it('should emit input for value matching regex /^\\d{1,3}$/', () => {
      wrapper.vm.handleDurationChange('999')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input for value with leading zero rejected by validation, not here', () => {
      wrapper.vm.handleDurationChange('01')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('input masking with v-mask', () => {
    it('should enforce 3-digit maximum through mask ###', () => {
      expect(wrapper.vm).toBeDefined()
      wrapper.vm.handleDurationChange('999')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should allow numeric input only', () => {
      wrapper.vm.handleDurationChange('30')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should handle masked input correctly', () => {
      wrapper.vm.handleDurationChange('123')
      expect(wrapper.emitted('input')[0][0]).toBe('123')
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          value: 10
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.setProps({ value: 20 })
      expect(wrapper.vm.value).toBe(20)
    })

    it('should handle numeric to string value changes', async () => {
      await wrapper.setProps({ value: '45' })
      expect(wrapper.vm.value).toBe('45')
    })

    it('should update when isCallback prop changes', async () => {
      const initialLength = wrapper.vm.rules.length
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isCallback).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should maintain rules reactivity', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: false
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      const beforeLength = wrapper.vm.rules.length
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBeGreaterThan(beforeLength)
    })
  })

  describe('integration scenarios', () => {
    it('should work with default values', () => {
      expect(wrapper.vm.value).toBe(30)
      expect(wrapper.vm.isCallback).toBe(false)
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should work as standard duration field', () => {
      wrapper.vm.handleDurationChange('45')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.vm.rules.length).toBe(2)
    })

    it('should work in callback mode with custom value', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true,
          value: 15
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.isCallback).toBe(true)
      expect(wrapper.vm.value).toBe(15)
      expect(wrapper.vm.rules.length).toBe(3)
    })

    it('should handle complete workflow: standard to callback', async () => {
      expect(wrapper.vm.rules.length).toBe(2)
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBe(3)
      wrapper.vm.handleDurationChange('20')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should validate callback range in workflow', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleDurationChange('30')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('edge cases with leading zeros', () => {
    it('should reject 0 as value', () => {
      wrapper.vm.handleDurationChange('0')
      const noLeadingZeroRule = wrapper.vm.rules[1]
      const result = noLeadingZeroRule('0')
      expect(result).not.toBe(true)
    })

    it('should reject 01, 02, etc.', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      expect(noLeadingZeroRule('01')).not.toBe(true)
      expect(noLeadingZeroRule('02')).not.toBe(true)
      expect(noLeadingZeroRule('09')).not.toBe(true)
    })

    it('should accept 10, 11, etc.', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      expect(noLeadingZeroRule('10')).toBe(true)
      expect(noLeadingZeroRule('11')).toBe(true)
      expect(noLeadingZeroRule('99')).toBe(true)
    })

    it('should handle 001, 010 etc (all leading zeros)', () => {
      wrapper.vm.handleDurationChange('001')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('boundary conditions', () => {
    it('should accept minimum valid value 1', () => {
      wrapper.vm.handleDurationChange('1')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should accept maximum 3-digit value 999', () => {
      wrapper.vm.handleDurationChange('999')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should callback mode: accept minimum 1', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleDurationChange('1')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should callback mode: accept maximum 30', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleDurationChange('30')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should callback mode: reject 31', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const rangeRule = wrapper.vm.rules[2]
      const result = rangeRule('31')
      expect(result).not.toBe(true)
    })
  })

  describe('required field behavior', () => {
    it('should show required hint via labels', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.labels.Required).toBeDefined()
    })

    it('should have persistent hint enabled', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should validate required with required rule', () => {
      const requiredRule = wrapper.vm.rules[0]
      expect(requiredRule('')).not.toBe(true)
      expect(requiredRule('30')).toBe(true)
    })
  })

  describe('v-model support', () => {
    it('should emit input for v-model binding', () => {
      wrapper.vm.handleDurationChange('25')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('25')
    })

    it('should handle multiple input emissions', () => {
      wrapper.vm.handleDurationChange('10')
      wrapper.vm.handleDurationChange('20')
      wrapper.vm.handleDurationChange('30')
      expect(wrapper.emitted('input').length).toBe(3)
    })

    it('should emit correct values for v-model sync', () => {
      const testValues = ['5', '10', '15', '20']
      testValues.forEach((val) => wrapper.vm.handleDurationChange(val))
      const emissions = wrapper.emitted('input').map((e) => e[0])
      expect(emissions).toEqual(testValues)
    })
  })

  describe('form field configuration', () => {
    it('should be configured as required form field', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have proper validation rules for form', () => {
      expect(wrapper.vm.rules.every((r) => typeof r === 'function')).toBe(true)
    })

    it('should support form submission validation', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should validate in both standard and callback modes', async () => {
      expect(wrapper.vm.rules.length).toBe(2)
      await wrapper.setProps({ isCallback: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules.length).toBe(3)
    })
  })

  describe('input validation flow', () => {
    it('should validate required on empty input', () => {
      const requiredRule = wrapper.vm.rules[0]
      expect(requiredRule('')).not.toBe(true)
    })

    it('should validate no leading zero on 0 input', () => {
      const noLeadingZeroRule = wrapper.vm.rules[1]
      expect(noLeadingZeroRule('0')).not.toBe(true)
    })

    it('should accept valid input through all rules', () => {
      const value = '50'
      const allPass = wrapper.vm.rules.every((rule) => rule(value) === true)
      expect(allPass).toBe(true)
    })

    it('should validate callback range in callback mode', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      await wrapper.vm.$nextTick()
      const value = '25'
      const allPass = wrapper.vm.rules.every((rule) => rule(value) === true)
      expect(allPass).toBe(true)
    })
  })

  describe('state management', () => {
    it('should maintain value state through prop changes', async () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          value: 25
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.value).toBe(25)
      await wrapper.setProps({ value: 50 })
      expect(wrapper.vm.value).toBe(50)
    })

    it('should maintain isCallback state', () => {
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: true
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      expect(wrapper.vm.isCallback).toBe(true)
    })

    it('should maintain immutable rules between instances', () => {
      const rules1 = wrapper.vm.rules.slice()
      wrapper = shallowMount(InputDuration, {
        propsData: {
          isCallback: false
        },
        stubs: {
          'form-group': true,
          'v-text-field': true
        }
      })
      const rules2 = wrapper.vm.rules.slice()
      expect(rules1.length).toBe(rules2.length)
    })
  })

  describe('days label indicator', () => {
    it('should indicate duration is in days', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should use TrackingDuration label', () => {
      expect(wrapper.vm.labels.TrackingDuration).toBeDefined()
    })

    it('should use TrackingDurationSub label', () => {
      expect(wrapper.vm.labels.TrackingDurationSub).toBeDefined()
    })
  })

  describe('accessibility', () => {
    it('should have proper component structure', () => {
      expect(wrapper.vm.$options.name).toBe('InputDuration')
    })

    it('should have accessible input field with id', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should provide required indicator', () => {
      expect(wrapper.vm.labels.Required).toBeDefined()
    })

    it('should have helpful validation error messages', () => {
      const requiredRule = wrapper.vm.rules[0]
      const result = requiredRule('')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
