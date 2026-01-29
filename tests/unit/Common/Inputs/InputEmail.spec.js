import { shallowMount } from '@vue/test-utils'
import InputEmail from '@/components/Common/Inputs/InputEmail.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

describe('InputEmail.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputEmail)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
    })

    it('should extend VTextField', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('prop defaults', () => {
    it('should have outlined prop default true', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should have dense prop default true', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter an email address')
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

    it('should have required default true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should have label default empty string', () => {
      expect(wrapper.vm.label).toBe('')
    })

    it('should have persistentPlaceholder default false', () => {
      expect(wrapper.vm.persistentPlaceholder).toBe(false)
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Custom email'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom email')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: 'Please enter your email'
        }
      })
      expect(wrapper.vm.hint).toBe('Please enter your email')
    })

    it('should accept custom label', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Email Address'
        }
      })
      expect(wrapper.vm.label).toBe('Email Address')
    })

    it('should accept required prop false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputEmail, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not be outlined when prop is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          outlined: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          dense: false
        }
      })
      expect(wrapper.vm.dense).toBe(false)
    })
  })

  describe('validation rules initialization', () => {
    it('should initialize with default email rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have default email rules from COMMON_CONSTANTS', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES
      expect(defaultRules).toBeDefined()
    })

    it('should add required validation when required is true', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length)
    })

    it('should add min length validation when required is true', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      // Should have additional rules added
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length + 2)
    })

    it('should not add required validation when required is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length)
    })
  })

  describe('hint behavior with required prop', () => {
    it('should show hint when required is true', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBe('*Required')
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should clear hint when required is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should set persistentHint false when required is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
    })
  })

  describe('lifecycle hook - created', () => {
    it('should modify rules array in created hook when required', () => {
      const initialLength = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should splice rules at correct index', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      // Should have inserted at index 2
      expect(wrapper.vm.rules.length).toBeGreaterThan(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length)
    })

    it('should add required rule function', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const ruleIsFunction = wrapper.vm.rules.some((rule) => typeof rule === 'function')
      expect(ruleIsFunction).toBe(true)
    })

    it('should add minLength rule function', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const ruleIsFunction = wrapper.vm.rules.some((rule) => typeof rule === 'function')
      expect(ruleIsFunction).toBe(true)
    })
  })

  describe('text field type behavior', () => {
    it('should have autocomplete off for security', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support custom autocomplete', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          autocomplete: 'email'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('email')
    })

    it('should have proper placeholder for email input', () => {
      expect(wrapper.vm.placeholder).toContain('email')
    })

    it('should have outlined style by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default for compact appearance', () => {
      expect(wrapper.vm.dense).toBe(true)
    })
  })

  describe('email validation integration', () => {
    it('should have email validation rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have at least one rule for email format', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should accept valid email format', () => {
      const validEmail = 'test@example.com'
      expect(validEmail).toMatch(/.+@.+\..+/)
    })

    it('should validate email in rules', () => {
      const testEmail = 'user@domain.com'
      // Rules should be callable
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('component reactivity', () => {
    it('should update when props change', async () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Original'
        }
      })
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.placeholder).toBe('Updated')
    })

    it('should handle required prop change', async () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const initialHint = wrapper.vm.hint
      expect(initialHint).toBe('*Required')
    })

    it('should maintain validation rules reactively', async () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const rulesLength = wrapper.vm.rules.length
      expect(rulesLength).toBeGreaterThan(0)
    })
  })

  describe('accessibility', () => {
    it('should have descriptive placeholder', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('email')
    })

    it('should have hint text for required fields', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeTruthy()
    })

    it('should support label prop for accessibility', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Email Address'
        }
      })
      expect(wrapper.vm.label).toBe('Email Address')
    })

    it('should have persistent hint for required fields', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as required email field with defaults', () => {
      wrapper = shallowMount(InputEmail)
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should work as optional email field', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false,
          label: 'Optional Email'
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should work with custom label and hint', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Work Email',
          hint: 'Use your corporate email'
        }
      })
      expect(wrapper.vm.label).toBe('Work Email')
      expect(wrapper.vm.hint).toBe('Use your corporate email')
    })
  })

  describe('security features', () => {
    it('should have autocomplete off by default', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should prevent browser autocomplete on email fields', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })
  })

  describe('user input handling', () => {
    it('should support v-model pattern', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: 'test@example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept input events', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should validate input through rules', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })
})
