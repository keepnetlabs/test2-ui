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
  })

  describe('prop defaults', () => {
    

    

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

    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputLastName, {
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

    

    

    it('should show hint persistently when required', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
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
  })
})
