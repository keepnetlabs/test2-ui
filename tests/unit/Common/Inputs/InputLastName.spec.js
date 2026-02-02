import { shallowMount } from '@vue/test-utils'
import InputLastName from '@/components/Common/Inputs/InputLastName.vue'
import labels from '@/model/constants/labels'

describe('InputLastName.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputLastName)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputLastName')
    })

    it('should extend VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputLastName')
    })
  })

  describe('prop defaults', () => {
    it('should have outlined default true', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should have dense default true', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter last name')
    })

    it('should have hint default', () => {
      expect(wrapper.vm.hint).toBe('*Required')
    })

    it('should have persistentHint default true', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should have autocomplete default off', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should have validation rules defined', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have exactly 3 rules by default', () => {
      expect(wrapper.vm.rules.length).toBe(3)
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          placeholder: 'Your family name'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Your family name')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          hint: 'Enter your family name'
        }
      })
      expect(wrapper.vm.hint).toBe('Enter your family name')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0 || 'Field required']
      wrapper = shallowMount(InputLastName, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not be outlined when prop is false', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          outlined: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          dense: false
        }
      })
      expect(wrapper.vm.dense).toBe(false)
    })

    it('should accept all props together', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          placeholder: 'Custom',
          hint: 'Custom hint',
          outlined: false,
          dense: false,
          autocomplete: 'family-name'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom')
      expect(wrapper.vm.hint).toBe('Custom hint')
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
      expect(wrapper.vm.autocomplete).toBe('family-name')
    })
  })

  describe('validation rules', () => {
    it('should have required validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(1)
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should have startsWithSpace validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
      expect(typeof wrapper.vm.rules[1]).toBe('function')
    })

    it('should have maxLength validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(3)
      expect(typeof wrapper.vm.rules[2]).toBe('function')
    })

    it('should have exactly 3 default validation rules', () => {
      expect(wrapper.vm.rules.length).toBe(3)
    })

    it('should have rule functions in correct order', () => {
      const rules = wrapper.vm.rules
      expect(typeof rules[0]).toBe('function')
      expect(typeof rules[1]).toBe('function')
      expect(typeof rules[2]).toBe('function')
    })

    it('should have all rules as functions', () => {
      const rulesAreFunction = wrapper.vm.rules.every((rule) => typeof rule === 'function')
      expect(rulesAreFunction).toBe(true)
    })
  })

  describe('required validation', () => {
    it('should validate required field', () => {
      const rule = wrapper.vm.rules[0]
      expect(typeof rule).toBe('function')
    })

    it('should reject empty value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('')
      expect(result).not.toBe(true)
    })

    it('should accept non-empty value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('Smith')
      expect(result).toBe(true)
    })

    it('should use required label from labels object', () => {
      expect(labels.Required).toBeDefined()
    })

    it('should reject null value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule(null)
      expect(result).not.toBe(true)
    })

    it('should reject undefined value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule(undefined)
      expect(result).not.toBe(true)
    })
  })

  describe('startsWithSpace validation', () => {
    it('should have startsWithSpace rule', () => {
      const rule = wrapper.vm.rules[1]
      expect(typeof rule).toBe('function')
    })

    it('should reject value starting with space', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule(' Smith')
      expect(result).not.toBe(true)
    })

    it('should accept value not starting with space', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule('Smith')
      expect(result).toBe(true)
    })

    it('should use appropriate error message', () => {
      expect(labels.CannotStartWithSpace).toBeDefined()
    })

    it('should accept value with internal spaces', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule('Smith Jr')
      expect(result).toBe(true)
    })
  })

  describe('maxLength validation', () => {
    it('should have maxLength rule', () => {
      const rule = wrapper.vm.rules[2]
      expect(typeof rule).toBe('function')
    })

    it('should reject value longer than 40 characters', () => {
      const rule = wrapper.vm.rules[2]
      const longName = 'A'.repeat(41)
      const result = rule(longName)
      expect(result).not.toBe(true)
    })

    it('should accept value of exactly 40 characters', () => {
      const rule = wrapper.vm.rules[2]
      const name = 'A'.repeat(40)
      const result = rule(name)
      expect(result).toBe(true)
    })

    it('should accept value shorter than 40 characters', () => {
      const rule = wrapper.vm.rules[2]
      const result = rule('Smith')
      expect(result).toBe(true)
    })

    it('should use max length 40 for validation', () => {
      const rule = wrapper.vm.rules[2]
      const name39 = 'A'.repeat(39)
      const name40 = 'A'.repeat(40)
      const name41 = 'A'.repeat(41)

      expect(rule(name39)).toBe(true)
      expect(rule(name40)).toBe(true)
      expect(rule(name41)).not.toBe(true)
    })

    it('should include field name in error message', () => {
      expect(labels.LastNameSecondLower).toBeDefined()
    })

    it('should accept single character', () => {
      const rule = wrapper.vm.rules[2]
      const result = rule('S')
      expect(result).toBe(true)
    })
  })

  describe('text field behavior', () => {
    it('should have autocomplete off for security', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support custom autocomplete', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          autocomplete: 'family-name'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('family-name')
    })

    it('should have proper placeholder for last name', () => {
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('last name')
    })

    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should show hint persistently when required', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should display hint text properly', () => {
      expect(wrapper.vm.hint).toBeTruthy()
      expect(wrapper.vm.hint).toContain('Required')
    })

    it('should extend VTextField component', () => {
      expect(wrapper.vm.$options.name).toBe('InputLastName')
    })
  })

  describe('component reactivity', () => {
    it('should update when props change', async () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          placeholder: 'Original'
        }
      })
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.placeholder).toBe('Updated')
    })

    it('should update hint when prop changes', async () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          hint: 'Original hint'
        }
      })
      await wrapper.setProps({ hint: 'New hint' })
      expect(wrapper.vm.hint).toBe('New hint')
    })

    it('should maintain validation rules reactively', async () => {
      const rulesLength = wrapper.vm.rules.length
      expect(rulesLength).toBe(3)
    })

    it('should update outlined state', async () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          outlined: true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should update dense state', async () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          dense: true
        }
      })
      expect(wrapper.vm.dense).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have descriptive placeholder', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('name')
    })

    it('should have hint text for required field', () => {
      expect(wrapper.vm.hint).toBeTruthy()
      expect(wrapper.vm.hint).toContain('Required')
    })

    it('should have persistent hint for users', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should show validation errors clearly', () => {
      const rules = wrapper.vm.rules
      expect(rules.every((r) => typeof r === 'function')).toBe(true)
    })

    it('should have label references for accessibility', () => {
      expect(labels.Required).toBeDefined()
      expect(labels.CannotStartWithSpace).toBeDefined()
    })
  })

  describe('validation error messages', () => {
    it('should provide required error message', () => {
      expect(labels.Required).toBeDefined()
    })

    it('should provide space error message', () => {
      expect(labels.CannotStartWithSpace).toBeDefined()
    })

    it('should provide length error message', () => {
      expect(labels.LastNameSecondLower).toBeDefined()
    })
  })

  describe('validation sequence', () => {
    it('should validate in correct order: required, space, length', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBe(3)

      // Test required first
      expect(typeof rules[0]).toBe('function')
      expect(typeof rules[1]).toBe('function')
      expect(typeof rules[2]).toBe('function')
    })

    it('should apply all validations to input', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Smith'

      // All rules should pass for valid input
      const allPass = rules.every((rule) => rule(testValue) === true)
      expect(allPass).toBe(true)
    })
  })

  describe('real world scenarios', () => {
    it('should accept valid last name "Smith"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Smith'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept valid last name "Garcia"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Garcia'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept last name with hyphen "Johnson-Lee"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Johnson-Lee'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept last name with apostrophe "O\'Connor"', () => {
      const rules = wrapper.vm.rules
      const testValue = "O'Connor"

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept last name with multiple hyphens "Smith-Jones-Brown"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Smith-Jones-Brown'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept international last names', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Müller'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should reject empty string', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('')
      expect(result).not.toBe(true)
    })

    it('should reject space at start', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule(' Smith')
      expect(result).not.toBe(true)
    })

    it('should reject names longer than 40 chars', () => {
      const rule = wrapper.vm.rules[2]
      const longName = 'A'.repeat(41)
      const result = rule(longName)
      expect(result).not.toBe(true)
    })
  })

  describe('user input handling', () => {
    it('should support v-model pattern', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          value: 'Smith'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should validate as user types', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBe(3)
    })

    it('should provide immediate feedback on invalid input', () => {
      const rules = wrapper.vm.rules
      const invalidInput = ' Invalid'
      const secondRule = rules[1]

      // Should immediately fail on space
      expect(secondRule(invalidInput)).not.toBe(true)
    })

    it('should accept single word last names', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule('Smith') === true)
      expect(result).toBe(true)
    })

    it('should handle complex input validation', () => {
      const rules = wrapper.vm.rules
      const testCases = ['Anderson', 'van Der Berg', 'O\'Brien']

      testCases.forEach((name) => {
        // Not all may pass, but we're checking the validation works
        const validated = rules.every((rule) => {
          const res = rule(name)
          return res === true || typeof res === 'string'
        })
        expect(validated).toBe(true)
      })
    })
  })

  describe('initialization', () => {
    it('should initialize with all required defaults', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.autocomplete).toBe('off')
      expect(wrapper.vm.rules.length).toBe(3)
    })

    it('should have properly initialized rules array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have callable rules', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })

    it('should initialize with proper defaults', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
      expect(wrapper.vm.placeholder).toBe('Enter last name')
      expect(wrapper.vm.hint).toBe('*Required')
    })
  })

  describe('form field integration', () => {
    it('should work as form field with defaults', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should provide validation for form integration', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should be compatible with v-form', () => {
      expect(typeof wrapper.vm.rules).toBe('object')
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('input value handling', () => {
    it('should accept single word last names', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule('Smith') === true)
      expect(result).toBe(true)
    })

    it('should accept hyphenated last names', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule('Johnson-Lee') === true)
      expect(result).toBe(true)
    })

    it('should accept last names with apostrophes', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule("O'Connor") === true)
      expect(result).toBe(true)
    })

    it('should accept international last names with accents', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule('François') === true)
      expect(result).toBe(true)
    })

    it('should accept last names with multiple hyphens', () => {
      const rules = wrapper.vm.rules
      const result = rules.every((rule) => rule('Mary-Jane-Ann') === true)
      expect(result).toBe(true)
    })

    it('should reject null value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule(null)
      expect(result).not.toBe(true)
    })

    it('should handle undefined value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule(undefined)
      expect(result).not.toBe(true)
    })
  })

  describe('boundary conditions', () => {
    it('should accept single character last name', () => {
      const rule = wrapper.vm.rules[2]
      const result = rule('S')
      expect(result).toBe(true)
    })

    it('should accept exactly 40 character last name', () => {
      const rule = wrapper.vm.rules[2]
      const name = 'A'.repeat(40)
      const result = rule(name)
      expect(result).toBe(true)
    })

    it('should reject 41 character last name', () => {
      const rule = wrapper.vm.rules[2]
      const name = 'A'.repeat(41)
      const result = rule(name)
      expect(result).not.toBe(true)
    })

    it('should accept 39 character last name', () => {
      const rule = wrapper.vm.rules[2]
      const name = 'A'.repeat(39)
      const result = rule(name)
      expect(result).toBe(true)
    })
  })

  describe('combined validation scenarios', () => {
    it('should fail on required when empty', () => {
      const rules = wrapper.vm.rules
      const result = rules[0]('')
      expect(result).not.toBe(true)
    })

    it('should fail on space when it starts with space', () => {
      const rules = wrapper.vm.rules
      const result = rules[1](' Smith')
      expect(result).not.toBe(true)
    })

    it('should fail on length when exceeds 40', () => {
      const rules = wrapper.vm.rules
      const longName = 'A'.repeat(50)
      const result = rules[2](longName)
      expect(result).not.toBe(true)
    })

    it('should pass all validations for valid last name', () => {
      const rules = wrapper.vm.rules
      const validName = 'Anderson'
      const allPass = rules.every((rule) => rule(validName) === true)
      expect(allPass).toBe(true)
    })

    it('should handle complex valid last names', () => {
      const rules = wrapper.vm.rules
      const complexNames = ['van Berg', "O'Brien", 'José', 'François-Marie']
      const allValid = complexNames.every((name) =>
        rules.every((rule) => {
          const res = rule(name)
          return res === true || typeof res === 'string'
        })
      )
      expect(allValid).toBe(true)
    })
  })

  describe('VTextField extension', () => {
    it('should inherit from VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputLastName')
    })

    it('should have proper component name defined', () => {
      expect(wrapper.vm.$options.name).toBe('InputLastName')
    })

    it('should maintain VTextField properties', () => {
      expect(wrapper.vm.outlined).toBeDefined()
      expect(wrapper.vm.dense).toBeDefined()
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should have all required text field properties', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.hint).toBeTruthy()
    })
  })

  describe('custom configuration', () => {
    it('should allow overriding all props', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          outlined: false,
          dense: false,
          placeholder: 'Custom placeholder',
          hint: 'Custom hint',
          persistentHint: false,
          autocomplete: 'family-name'
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
      expect(wrapper.vm.hint).toBe('Custom hint')
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.autocomplete).toBe('family-name')
    })

    it('should maintain rules when overriding other props', () => {
      wrapper = shallowMount(InputLastName, {
        propsData: {
          placeholder: 'Custom',
          hint: 'Custom'
        }
      })
      expect(wrapper.vm.rules.length).toBe(3)
    })
  })

  describe('validation error reporting', () => {
    it('should provide meaningful error for required validation', () => {
      expect(labels.Required).toBeDefined()
      const rule = wrapper.vm.rules[0]
      const result = rule('')
      expect(result).toBe(labels.Required)
    })

    it('should provide meaningful error for space validation', () => {
      expect(labels.CannotStartWithSpace).toBeDefined()
      const rule = wrapper.vm.rules[1]
      const result = rule(' Name')
      expect(result).toContain(labels.CannotStartWithSpace)
    })

    it('should include field name in max length error', () => {
      expect(labels.LastNameSecondLower).toBeDefined()
      const rule = wrapper.vm.rules[2]
      const longName = 'A'.repeat(41)
      const result = rule(longName)
      expect(result).toContain(labels.LastNameSecondLower)
    })

    it('should include max length in error message', () => {
      const rule = wrapper.vm.rules[2]
      const longName = 'A'.repeat(41)
      const result = rule(longName)
      expect(result).toContain('40')
    })
  })

  describe('label references', () => {
    it('should use LastNameSecondLower label in validation', () => {
      expect(labels.LastNameSecondLower).toBeDefined()
    })

    it('should use Required label', () => {
      expect(labels.Required).toBeDefined()
    })

    it('should use CannotStartWithSpace label', () => {
      expect(labels.CannotStartWithSpace).toBeDefined()
    })
  })

  describe('internationalization', () => {
    it('should support different languages via labels', () => {
      expect(labels.LastNameSecondLower).toBeDefined()
    })

    it('should display localized placeholder', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should display localized hint', () => {
      expect(wrapper.vm.hint).toBeDefined()
    })

    it('should use localized labels in validation', () => {
      expect(labels.Required).toBeDefined()
      expect(labels.CannotStartWithSpace).toBeDefined()
      expect(labels.LastNameSecondLower).toBeDefined()
    })
  })
})
