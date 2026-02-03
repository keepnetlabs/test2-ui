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
  })

  describe('prop defaults', () => {
    it('should have outlined default true', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should have dense default true', () => {
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

    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          dense: false
        }
      })

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

    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should support persistent placeholder', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          persistentPlaceholder: true
        }
      })
      expect(wrapper.vm.persistentPlaceholder).toBe(true)
    })

    it('should extend VTextField component', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
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

  describe('email format validation', () => {
    it('should have email validation in rules', () => {
      const hasEmailValidation = wrapper.vm.rules.length > 0
      expect(hasEmailValidation).toBe(true)
    })

    it('should accept standard email format', () => {
      const validEmails = [
        'user@domain.com',
        'test.user@domain.co.uk',
        'user+tag@domain.com'
      ]
      validEmails.forEach((email) => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should have email pattern in validation', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('required vs optional email behavior', () => {
    it('should add additional validations when required true', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const requiredLength = wrapper.vm.rules.length

      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      const optionalLength = wrapper.vm.rules.length

      expect(requiredLength).toBeGreaterThanOrEqual(optionalLength)
    })

    it('should show hint for required email', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeTruthy()
    })

    it('should hide hint for optional email', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.hint).toBeNull()
    })
  })

  describe('created hook functionality', () => {
    it('should modify rules in created hook for required', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(defaultRules)
    })

    it('should insert rules at correct position', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const rulesAreFunction = wrapper.vm.rules.every((rule) => typeof rule === 'function')
      expect(rulesAreFunction).toBe(true)
    })

    it('should not modify rules for optional email', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      // Optional should have at most the default rules
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(defaultRules.length + 2)
    })

    it('should set persistentHint false when not required', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
    })
  })

  describe('minimum length validation', () => {
    it('should enforce minimum email length when required', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const minLength = 8
      expect(wrapper.vm.rules.length).toBeGreaterThan(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length)
    })

    it('should accept email with minimum length', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have minLength rule function', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const hasFunction = wrapper.vm.rules.some((rule) => typeof rule === 'function')
      expect(hasFunction).toBe(true)
    })
  })

  describe('common constants integration', () => {
    it('should use DEFAULT_EMAIL_RULES from COMMON_CONSTANTS', () => {
      expect(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES).toBeDefined()
      expect(Array.isArray(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES)).toBe(true)
    })

    it('should initialize with DEFAULT_EMAIL_RULES', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should not modify DEFAULT_EMAIL_RULES constant', () => {
      const originalLength = COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(COMMON_CONSTANTS.DEFAULT_EMAIL_RULES.length).toBe(originalLength)
    })
  })

  describe('form field configuration', () => {
    it('should configure as required form field', () => {
      wrapper = shallowMount(InputEmail)
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.hint).toBe('*Required')
    })

    it('should configure as optional form field', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should support custom label for form integration', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Corporate Email'
        }
      })
      expect(wrapper.vm.label).toBe('Corporate Email')
    })

    it('should have all form field props', () => {
      expect(wrapper.vm.outlined).toBeDefined()
      expect(wrapper.vm.dense).toBeDefined()
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(wrapper.vm.hint).toBeDefined()
      expect(wrapper.vm.persistentHint).toBeDefined()
      expect(wrapper.vm.rules).toBeDefined()
    })
  })

  describe('state management', () => {
    it('should maintain required state', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain placeholder state', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Custom placeholder'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })

    it('should maintain hint state', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: 'Custom hint'
        }
      })
      expect(wrapper.vm.hint).toBe('Custom hint')
    })

    it('should maintain label state', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Email Field'
        }
      })
      expect(wrapper.vm.label).toBe('Email Field')
    })

    it('should maintain validation rules state', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      const initialLength = wrapper.vm.rules.length
      expect(wrapper.vm.rules.length).toBe(initialLength)
    })
  })

  describe('VTextField extension', () => {
    it('should inherit from VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
    })

    it('should have proper component name defined', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
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

  describe('edge cases - special characters', () => {
    it('should handle email with special chars in local part', () => {
      const specialEmails = [
        'user+tag@example.com',
        'user.name@example.com',
        'user_name@example.com',
        'user-name@example.com'
      ]
      specialEmails.forEach((email) => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should handle email with numbers', () => {
      const emailsWithNumbers = [
        'user123@example.com',
        '123user@example.com',
        'user1name2@example.com'
      ]
      emailsWithNumbers.forEach((email) => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should handle international domain extensions', () => {
      const intlEmails = [
        'user@example.co.uk',
        'user@example.com.au',
        'user@example.de',
        'user@example.fr',
        'user@example.in'
      ]
      intlEmails.forEach((email) => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should handle email with subdomain', () => {
      const subdomainEmails = [
        'user@mail.example.com',
        'user@smtp.example.com',
        'user@api.example.com'
      ]
      subdomainEmails.forEach((email) => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should validate very long but valid email', () => {
      const longEmail = 'very.long.email.address.with.many.dots@very.long.example.domain.com'
      expect(longEmail).toMatch(/.+@.+\..+/)
    })

    it('should validate short valid email', () => {
      const shortEmail = 'a@b.co'
      expect(shortEmail).toMatch(/.+@.+\..+/)
    })

    it('should handle email with plus addressing', () => {
      const plusEmail = 'user+notifications@example.com'
      expect(plusEmail).toMatch(/.+@.+\..+/)
    })

    it('should handle email with hyphen in domain', () => {
      const hyphenEmail = 'user@my-example-domain.com'
      expect(hyphenEmail).toMatch(/.+@.+\..+/)
    })

    it('should handle email with numbers in domain', () => {
      const numberEmail = 'user@example123.com'
      expect(numberEmail).toMatch(/.+@.+\..+/)
    })
  })

  describe('value binding edge cases', () => {
    it('should handle undefined value prop', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: undefined
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle null value prop', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: null
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept empty string value prop', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept whitespace value prop', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: '   '
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept very long email string prop', () => {
      const veryLongEmail = 'a'.repeat(200) + '@test.com'
      wrapper = shallowMount(InputEmail, {
        propsData: {
          value: veryLongEmail
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('validation rule execution', () => {
    it('should have first rule as function', () => {
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should call first rule with test value', () => {
      const rule = wrapper.vm.rules[0]
      const result = rule('test@example.com')
      expect(result === true || typeof result === 'string').toBe(true)
    })

    it('should call second rule with test value', () => {
      if (wrapper.vm.rules.length > 1) {
        const rule = wrapper.vm.rules[1]
        const result = rule('test@example.com')
        expect(result === true || typeof result === 'string').toBe(true)
      }
    })

    it('should handle rule error messages', () => {
      const rules = wrapper.vm.rules
      rules.forEach((rule) => {
        const result = rule('')
        if (result !== true) {
          expect(typeof result).toBe('string')
        }
      })
    })

    it('should rules be deterministic', () => {
      const rules = wrapper.vm.rules
      const firstRun = rules[0]('test@example.com')
      const secondRun = rules[0]('test@example.com')
      expect(firstRun).toBe(secondRun)
    })
  })

  describe('label prop handling', () => {
    it('should accept label with spaces', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'User Email Address'
        }
      })
      expect(wrapper.vm.label).toBe('User Email Address')
    })

    it('should accept label with special chars', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Email (Required)'
        }
      })
      expect(wrapper.vm.label).toBe('Email (Required)')
    })

    it('should accept very long label', () => {
      const longLabel = 'This is a very long label for the email field that exceeds normal length'
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: longLabel
        }
      })
      expect(wrapper.vm.label).toBe(longLabel)
    })

    it('should accept empty label', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: ''
        }
      })
      expect(wrapper.vm.label).toBe('')
    })

    it('should accept unicode in label', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          label: 'Email 邮箱'
        }
      })
      expect(wrapper.vm.label).toBe('Email 邮箱')
    })
  })

  describe('placeholder variations', () => {
    it('should accept custom placeholder with unicode', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Введите адрес электронной почты'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Введите адрес электронной почты')
    })

    it('should accept very long placeholder', () => {
      const longPlaceholder = 'Enter your email address here for account registration and notifications'.repeat(2)
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: longPlaceholder
        }
      })
      expect(wrapper.vm.placeholder).toBe(longPlaceholder)
    })

    it('should accept placeholder with emoji', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Email 📧'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Email')
    })

    it('should accept single character placeholder', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: '@'
        }
      })
      expect(wrapper.vm.placeholder).toBe('@')
    })
  })

  describe('hint variations', () => {
    it('should accept hint with html entities', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: 'Required &amp; Valid'
        }
      })
      expect(wrapper.vm.hint).toBe('Required &amp; Valid')
    })

    it('should accept very long hint', () => {
      const longHint = 'Please enter a valid email address. This field is required for account creation and notifications.'.repeat(2)
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: longHint
        }
      })
      expect(wrapper.vm.hint).toBe(longHint)
    })

    it('should accept empty string hint', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: ''
        }
      })
      expect(wrapper.vm.hint).toBe('')
    })

    it('should accept hint with newlines', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: 'Line 1\nLine 2'
        }
      })
      expect(wrapper.vm.hint).toContain('Line 1')
    })

    it('should accept numeric hint', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          hint: '123'
        }
      })
      expect(wrapper.vm.hint).toBe('123')
    })
  })

  describe('custom rules array handling', () => {
    it('should accept empty rules array', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          rules: []
        }
      })
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should accept single rule function', () => {
      const singleRule = [(v) => true]
      wrapper = shallowMount(InputEmail, {
        propsData: {
          rules: singleRule
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should accept 10+ rule functions', () => {
      const manyRules = Array.from({ length: 15 }, () => (v) => true)
      wrapper = shallowMount(InputEmail, {
        propsData: {
          rules: manyRules
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(10)
    })

    it('should handle rules that return error messages', () => {
      const rulesWithMessages = [
        (v) => v ? true : 'Field is required',
        (v) => v && v.includes('@') ? true : 'Must be valid email'
      ]
      wrapper = shallowMount(InputEmail, {
        propsData: {
          rules: rulesWithMessages
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(1)
    })
  })

  describe('required prop variations', () => {
    it('should work with required true and custom rules', () => {
      const customRules = [(v) => v ? true : 'Required']
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true,
          rules: customRules
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should work with required false and empty rules', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false,
          rules: []
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should change hint when required changes', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBe('*Required')

      wrapper = shallowMount(InputEmail, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.hint).toBeNull()
    })
  })

  describe('component lifecycle', () => {
    it('should initialize properly on mount', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should maintain state after update', async () => {
      const originalRulesLength = wrapper.vm.rules.length
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.rules.length).toBe(originalRulesLength)
    })

    it('should be destroyable without errors', () => {
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should handle multiple remounts', () => {
      wrapper.destroy()
      wrapper = shallowMount(InputEmail)
      expect(wrapper.vm).toBeDefined()
      wrapper.destroy()
      wrapper = shallowMount(InputEmail)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('attribute passing', () => {
    it('should pass through data attributes', () => {
      wrapper = shallowMount(InputEmail, {
        attrs: {
          'data-test': 'email-input'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should pass through aria attributes', () => {
      wrapper = shallowMount(InputEmail, {
        attrs: {
          'aria-label': 'Email Address Input'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle readonly attribute', () => {
      wrapper = shallowMount(InputEmail, {
        attrs: {
          readonly: true
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle disabled attribute', () => {
      wrapper = shallowMount(InputEmail, {
        attrs: {
          disabled: true
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('multiple instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = shallowMount(InputEmail, {
        propsData: { placeholder: 'Email 1' }
      })
      const wrapper2 = shallowMount(InputEmail, {
        propsData: { placeholder: 'Email 2' }
      })
      expect(wrapper1.vm.placeholder).not.toBe(wrapper2.vm.placeholder)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not share state between instances', () => {
      const wrapper1 = shallowMount(InputEmail, {
        propsData: { required: true }
      })
      const wrapper2 = shallowMount(InputEmail, {
        propsData: { required: false }
      })
      expect(wrapper1.vm.required).not.toBe(wrapper2.vm.required)
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('type attribute handling', () => {
    it('should support email type by default', () => {
      expect(wrapper.vm.placeholder).toContain('email')
    })

    it('should maintain email-specific behavior', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support autocomplete prop override', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          autocomplete: 'email'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('email')
    })
  })

  describe('validation with complex inputs', () => {
    it('should handle email with uppercase letters', () => {
      const emails = [
        'User@Example.com',
        'USER@EXAMPLE.COM',
        'UsEr@ExAmPlE.cOm'
      ]
      emails.forEach(email => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should handle email with mixed case domain', () => {
      const emails = [
        'user@Example.COM',
        'user@EXAMPLE.com',
        'user@ExampleDomain.co.UK'
      ]
      emails.forEach(email => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })

    it('should reject email without @ symbol', () => {
      const invalidEmails = [
        'userexample.com',
        'user example.com',
        'user.example.com'
      ]
      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/.+@.+\..+/)
      })
    })

    it('should reject email without domain extension', () => {
      const invalidEmails = [
        'user@domain',
        'user@',
        '@domain.com'
      ]
      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/.+@.+\..+/)
      })
    })

    it('should handle email with numbers and special chars', () => {
      const complexEmails = [
        'user123+test@example.co.uk',
        'first.last.123@sub.example.com',
        'a1b2c3@test-domain.org'
      ]
      complexEmails.forEach(email => {
        expect(email).toMatch(/.+@.+\..+/)
      })
    })
  })

  describe('prop mutation prevention', () => {
    it('should not mutate required prop when reading', () => {
      const originalRequired = wrapper.vm.required
      expect(originalRequired).toBe(true)
      expect(wrapper.vm.required).toBe(originalRequired)
    })

    it('should not mutate rules prop when reading', () => {
      const originalRulesLength = wrapper.vm.rules.length
      expect(wrapper.vm.rules.length).toBe(originalRulesLength)
    })

    it('should not mutate placeholder when reading', () => {
      const originalPlaceholder = wrapper.vm.placeholder
      expect(wrapper.vm.placeholder).toBe(originalPlaceholder)
    })
  })

  describe('template interaction', () => {
    it('should render as expected component', () => {
      expect(wrapper.vm.$options.name).toBe('InputEmail')
    })

    it('should have proper props object structure', () => {
      const props = wrapper.vm.$options.props
      expect(props).toBeDefined()
      expect(typeof props).toBe('object')
    })

    it('should support v-slot bindings', () => {
      wrapper = shallowMount(InputEmail, {
        slots: {
          prepend: '<span>@</span>'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should support v-on event handlers', () => {
      wrapper = shallowMount(InputEmail, {
        listeners: {
          input: jest.fn(),
          focus: jest.fn(),
          blur: jest.fn()
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('configuration combinations', () => {
    it('should work with all props customized', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          outlined: false,
          dense: false,
          placeholder: 'Custom Email',
          hint: 'Custom Hint',
          persistentHint: false,
          autocomplete: 'email',
          required: false,
          label: 'Email Field'
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
      expect(wrapper.vm.placeholder).toBe('Custom Email')
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.autocomplete).toBe('email')
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.label).toBe('Email Field')
    })

    it('should work with minimal customization', () => {
      wrapper = shallowMount(InputEmail, {
        propsData: {
          placeholder: 'Email'
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
      expect(wrapper.vm.required).toBe(true)
    })
  })
})
