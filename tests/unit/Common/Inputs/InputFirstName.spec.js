import { shallowMount } from '@vue/test-utils'
import InputFirstName from '@/components/Common/Inputs/InputFirstName.vue'
import labels from '@/model/constants/labels'

describe('InputFirstName.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputFirstName)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputFirstName')
    })
  })

  describe('prop defaults', () => {
    

    

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter first name')
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
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          placeholder: 'Your first name'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Your first name')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          hint: 'Enter your given name'
        }
      })
      expect(wrapper.vm.hint).toBe('Enter your given name')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0 || 'Field required']
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not be outlined when prop is false', () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          outlined: false
        }
      })

    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          dense: false
        }
      })

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
      const result = rule('John')
      expect(result).toBe(true)
    })

    it('should use required label from labels object', () => {
      expect(labels.Required).toBeDefined()
    })
  })

  describe('startsWithSpace validation', () => {
    it('should have startsWithSpace rule', () => {
      const rule = wrapper.vm.rules[1]
      expect(typeof rule).toBe('function')
    })

    it('should reject value starting with space', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule(' John')
      expect(result).not.toBe(true)
    })

    it('should accept value not starting with space', () => {
      const rule = wrapper.vm.rules[1]
      const result = rule('John')
      expect(result).toBe(true)
    })

    it('should use appropriate error message', () => {
      expect(labels.CannotStartWithSpace).toBeDefined()
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
      const result = rule('John')
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
      expect(labels.FirstNameSecondLower).toBeDefined()
    })
  })

  describe('text field behavior', () => {
    it('should have autocomplete off for security', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support custom autocomplete', () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          autocomplete: 'given-name'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('given-name')
    })

    it('should have proper placeholder for first name', () => {
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('first name')
    })

    

    

    it('should show hint persistently when required', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when props change', async () => {
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          placeholder: 'Original'
        }
      })
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.placeholder).toBe('Updated')
    })

    it('should update hint when prop changes', async () => {
      wrapper = shallowMount(InputFirstName, {
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
      // All rules should be functions that return true or error message
      expect(rules.every((r) => typeof r === 'function')).toBe(true)
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
      expect(labels.FirstNameSecondLower).toBeDefined()
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
      const testValue = 'John'

      // All rules should pass for valid input
      const allPass = rules.every((rule) => rule(testValue) === true)
      expect(allPass).toBe(true)
    })
  })

  describe('real world scenarios', () => {
    it('should accept valid first name "John"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'John'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept valid first name "Maria"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Maria'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept valid first name with hyphen "Jean-Pierre"', () => {
      const rules = wrapper.vm.rules
      const testValue = 'Jean-Pierre'

      const allPass = rules.every((rule) => {
        const result = rule(testValue)
        return result === true
      })
      expect(allPass).toBe(true)
    })

    it('should accept valid first name with apostrophe "O\'Brien"', () => {
      const rules = wrapper.vm.rules
      const testValue = "O'Brien"

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
      const result = rule(' John')
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
      wrapper = shallowMount(InputFirstName, {
        propsData: {
          value: 'John'
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
  })
})
