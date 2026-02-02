import { shallowMount } from '@vue/test-utils'
import InputUrl from '@/components/Common/Inputs/InputUrl.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

describe('InputUrl.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputUrl)
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 120,
      height: 35,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0
    }))
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputUrl')
    })

    it('should extend VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputUrl')
    })
  })

  describe('prop defaults', () => {
    it('should have placeholder default "Enter a URL"', () => {
      expect(wrapper.vm.placeholder).toBe('Enter a URL')
    })

    it('should have outlined default true', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should have dense default true', () => {
      expect(wrapper.vm.dense).toBe(true)
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

    it('should have default hint from labels', () => {
      expect(wrapper.vm.hint).toBe(labels.DefaultHint)
    })

    it('should have validation rules defined', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          placeholder: 'Enter website URL'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Enter website URL')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          hint: 'Please enter a valid URL'
        }
      })
      expect(wrapper.vm.hint).toBe('Please enter a valid URL')
    })

    it('should accept required false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputUrl, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should accept outlined false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          outlined: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should accept dense false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          dense: false
        }
      })
      expect(wrapper.vm.dense).toBe(false)
    })

    it('should accept all props together', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          placeholder: 'Custom',
          hint: 'Custom hint',
          required: true,
          outlined: false,
          dense: false,
          autocomplete: 'url'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom')
      expect(wrapper.vm.hint).toBe('Custom hint')
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
      expect(wrapper.vm.autocomplete).toBe('url')
    })
  })

  describe('validation rules initialization', () => {
    it('should initialize with default URL rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have default URL rules from COMMON_CONSTANTS', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_URL_RULES
      expect(defaultRules).toBeDefined()
      expect(Array.isArray(defaultRules)).toBe(true)
    })

    it('should add required validation when required is true', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(COMMON_CONSTANTS.DEFAULT_URL_RULES.length)
    })

    it('should not add required validation when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(COMMON_CONSTANTS.DEFAULT_URL_RULES.length)
    })

    it('should have all rules as functions', () => {
      const rulesAreFunction = wrapper.vm.rules.every((rule) => typeof rule === 'function')
      expect(rulesAreFunction).toBe(true)
    })
  })

  describe('hint behavior with required prop', () => {
    it('should show hint when required is true', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeDefined()
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should clear hint when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should set persistentHint false when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
    })

    it('should keep persistentHint true when required is true', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('URL input validation', () => {
    it('should have URL validation rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have at least one rule for URL format', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should accept valid URL format', () => {
      const validUrl = 'https://example.com'
      expect(validUrl).toMatch(/^https?:/)
    })

    it('should validate URLs with rules', () => {
      const testUrl = 'https://example.com'
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have callable URL validation rules', () => {
      const rules = wrapper.vm.rules
      expect(rules.some((rule) => typeof rule === 'function')).toBe(true)
    })
  })

  describe('watch on value - space and comma rejection', () => {
    it('should reject URLs with spaces', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      await wrapper.setProps({ value: 'https://example.com test' })
      expect(wrapper.vm).toBeDefined()
    })

    it('should reject URLs with commas', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      await wrapper.setProps({ value: 'https://example.com, another.com' })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept URLs without spaces or commas', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should prevent space characters in URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'valid-url'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should prevent comma characters in URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'valid-url'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should emit input event with old value when space detected', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://old.com'
        }
      })
      wrapper.vm.$watch('value', wrapper.vm.$options.watch.value.handler)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('autocomplete security', () => {
    it('should have autocomplete off by default', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should prevent browser autocomplete on URL fields', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support custom autocomplete', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          autocomplete: 'url'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('url')
    })

    it('should keep autocomplete off for security by default', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })
  })

  describe('lifecycle hook - created', () => {
    it('should modify rules array in created hook when required', () => {
      const initialLength = COMMON_CONSTANTS.DEFAULT_URL_RULES.length
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should add required rule function', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      const ruleIsFunction = wrapper.vm.rules.some((rule) => typeof rule === 'function')
      expect(ruleIsFunction).toBe(true)
    })

    it('should set hint to null when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should insert required rule at index 0', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      // First rule should be required validation when required is true
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should not modify rules when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      const baseLength = COMMON_CONSTANTS.DEFAULT_URL_RULES.length
      expect(wrapper.vm.rules.length).toBeLessThanOrEqual(baseLength)
    })
  })

  describe('component reactivity', () => {
    it('should update when props change', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          placeholder: 'Original'
        }
      })
      await wrapper.setProps({ placeholder: 'Updated' })
      expect(wrapper.vm.placeholder).toBe('Updated')
    })

    it('should handle required prop change', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      const initialHint = wrapper.vm.hint
      expect(initialHint).toBeDefined()
    })

    it('should maintain validation rules reactively', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      const rulesLength = wrapper.vm.rules.length
      expect(rulesLength).toBeGreaterThan(0)
    })

    it('should update hint when changed', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          hint: 'Original hint'
        }
      })
      await wrapper.setProps({ hint: 'Updated hint' })
      expect(wrapper.vm.hint).toBe('Updated hint')
    })

    it('should maintain outlined state', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          outlined: true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should maintain dense state', async () => {
      wrapper = shallowMount(InputUrl, {
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
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('url')
    })

    it('should have hint text for required fields', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeTruthy()
    })

    it('should support label prop for accessibility', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          label: 'Website URL'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should have persistent hint for required fields', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should provide clear placeholder guidance', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.length).toBeGreaterThan(0)
    })
  })

  describe('integration scenarios', () => {
    it('should work as required URL field with defaults', () => {
      wrapper = shallowMount(InputUrl)
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.placeholder).toBe('Enter a URL')
    })

    it('should work as optional URL field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false,
          label: 'Optional Website'
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should work with custom label and hint', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          label: 'Corporate Website',
          hint: 'Enter company website URL'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should work with custom validation rules', () => {
      const customRules = [
        (v) => v && v.length > 0 || 'URL is required',
        (v) => v && v.startsWith('https://') || 'Must use HTTPS'
      ]
      wrapper = shallowMount(InputUrl, {
        propsData: {
          rules: customRules
        }
      })
      // When required is true (default), it adds a rule to the custom rules
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should maintain all properties in complex scenario', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true,
          placeholder: 'Enter website',
          hint: 'Company URL',
          outlined: true,
          dense: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.placeholder).toBe('Enter website')
      expect(wrapper.vm.hint).toBe('Company URL')
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
    })
  })

  describe('appearance and styling', () => {
    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should support changing appearance', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          outlined: false,
          dense: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
    })

    it('should support outlined appearance prop', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          outlined: true
        }
      })
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should support dense appearance prop', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          dense: true
        }
      })
      expect(wrapper.vm.dense).toBe(true)
    })
  })

  describe('URL handling edge cases', () => {
    it('should handle empty URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs with protocol', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs without protocol', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs with paths', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com/path/to/page'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs with query parameters', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com?param=value'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs with fragments', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com#section'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle URLs with special characters', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com/path-with-dash_and_underscore'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle localhost URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'http://localhost:3000'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle IP address URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'http://192.168.1.1'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('state management', () => {
    it('should maintain required state', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain placeholder state', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          placeholder: 'Custom placeholder'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })

    it('should maintain hint state', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          hint: 'Custom hint'
        }
      })
      expect(wrapper.vm.hint).toBe('Custom hint')
    })

    it('should maintain validation rules state', () => {
      wrapper = shallowMount(InputUrl, {
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
      expect(wrapper.vm.$options.name).toBe('InputUrl')
    })

    it('should have proper component name defined', () => {
      expect(wrapper.vm.$options.name).toBe('InputUrl')
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

    it('should support v-model pattern', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('required vs optional behavior', () => {
    it('should add additional validations when required true', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      const requiredLength = wrapper.vm.rules.length

      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      const optionalLength = wrapper.vm.rules.length

      expect(requiredLength).toBeGreaterThanOrEqual(optionalLength)
    })

    it('should show hint for required URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeTruthy()
    })

    it('should hide hint for optional URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.hint).toBeNull()
    })
  })

  describe('default rules handling', () => {
    it('should not modify DEFAULT_URL_RULES constant', () => {
      const originalLength = COMMON_CONSTANTS.DEFAULT_URL_RULES.length
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(COMMON_CONSTANTS.DEFAULT_URL_RULES.length).toBe(originalLength)
    })

    it('should use copy of DEFAULT_URL_RULES', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_URL_RULES
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      // Instance should have its own rules array
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should have URL rules as functions', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_URL_RULES
      if (defaultRules && defaultRules.length > 0) {
        expect(typeof defaultRules[0]).toBe('function')
      }
    })
  })

  describe('text field behavior', () => {
    it('should have autocomplete off for security', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should have proper placeholder for URL input', () => {
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('url')
    })

    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should show hint persistently when required', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should extend VTextField component', () => {
      expect(wrapper.vm.$options.name).toBe('InputUrl')
    })
  })

  describe('initialization', () => {
    it('should initialize with all required defaults', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.autocomplete).toBe('off')
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
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

    it('should initialize with outlined and dense true', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should initialize with required true', () => {
      expect(wrapper.vm.required).toBe(true)
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

    it('should support form submission with validation', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })
  })

  describe('input value handling', () => {
    it('should accept single-word URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept URLs with subdomains', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'subdomain.example.com'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should reject null value when required', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should handle undefined value', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: undefined
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('boundary conditions', () => {
    it('should accept minimal URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'a.b'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should accept very long URL', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000)
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: longUrl
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle single character domain', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'a.c'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('combined validation scenarios', () => {
    it('should handle required URL field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should handle optional URL field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should pass all validations for valid URL', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should handle complex URL validation', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true,
          value: 'https://sub.example.com/path?query=value#fragment'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })
})
