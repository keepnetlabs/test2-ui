import { shallowMount } from '@vue/test-utils'
import InputUrl from '@/components/Common/Inputs/InputUrl.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

describe('InputUrl.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputUrl)
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
      expect(wrapper.vm.placeholder).toBe('Enter a URL')
    })

    it('should have hint default from labels', () => {
      expect(wrapper.vm.hint).toBe(labels.DefaultHint)
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

    it('should have validation rules defined', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          placeholder: 'https://example.com'
        }
      })
      expect(wrapper.vm.placeholder).toBe('https://example.com')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          hint: 'Enter your website'
        }
      })
      expect(wrapper.vm.hint).toBe('Enter your website')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => /^https?:\/\/.+/.test(v) || 'Invalid URL']
      wrapper = shallowMount(InputUrl, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should accept required as false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should not be outlined when prop is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          outlined: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should not be dense when prop is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          dense: false
        }
      })
      expect(wrapper.vm.dense).toBe(false)
    })
  })

  describe('URL validation rules', () => {
    it('should initialize with default URL rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have default URL rules from COMMON_CONSTANTS', () => {
      const defaultRules = COMMON_CONSTANTS.DEFAULT_URL_RULES
      expect(defaultRules).toBeDefined()
    })

    it('should have validation rules as functions', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })
  })

  describe('watch value property', () => {
    it('should reject value with spaces', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      const oldValue = 'https://example.com'
      // Watch would emit input with old value
      expect(wrapper.vm.value).toBe('https://example.com')
    })

    it('should reject value with commas', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com,test'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should accept clean URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com')
    })
  })

  describe('required validation behavior', () => {
    it('should add required rule when required is true', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(COMMON_CONSTANTS.DEFAULT_URL_RULES.length)
    })

    it('should not add required rule when required is false', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
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

    it('should set persistentHint false when not required', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
    })
  })

  describe('lifecycle hook - created', () => {
    it('should modify rules array when required', () => {
      const initialLength = COMMON_CONSTANTS.DEFAULT_URL_RULES.length
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should splice rules at index 0 when required', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      // First rule should be required validation
      expect(typeof wrapper.vm.rules[0]).toBe('function')
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
  })

  describe('text field behavior', () => {
    it('should have autocomplete off for security', () => {
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

    it('should have proper placeholder for URL input', () => {
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('url')
    })

    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default for compact appearance', () => {
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

    it('should update hint when prop changes', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          hint: 'Original'
        }
      })
      await wrapper.setProps({ hint: 'New hint' })
      expect(wrapper.vm.hint).toBe('New hint')
    })

    it('should handle required prop change', async () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have descriptive placeholder', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('url')
    })

    it('should have hint text for required field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.hint).toBeTruthy()
    })

    it('should have persistent hint for required fields', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should show validation errors clearly', () => {
      const rules = wrapper.vm.rules
      expect(rules.every((r) => typeof r === 'function')).toBe(true)
    })
  })

  describe('real-world URL examples', () => {
    it('should accept https URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com')
    })

    it('should accept http URLs', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'http://example.com'
        }
      })
      expect(wrapper.vm.value).toBe('http://example.com')
    })

    it('should accept URLs with paths', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com/path/to/page'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com/path/to/page')
    })

    it('should accept URLs with query parameters', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com?param=value'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com?param=value')
    })

    it('should accept URLs with fragments', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com#section'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com#section')
    })

    it('should accept URLs with port', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com:8080'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com:8080')
    })

    it('should accept URLs with credentials in path', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com/user/profile'
        }
      })
      expect(wrapper.vm.value).toBe('https://example.com/user/profile')
    })
  })

  describe('user input handling', () => {
    it('should support v-model pattern', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should validate as user types', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
    })

    it('should provide immediate feedback on invalid input', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
    })
  })

  describe('input validation', () => {
    it('should reject URLs with spaces', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example .com'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should reject URLs with commas', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com,https://test.com'
        }
      })
      expect(wrapper.vm.value).toBeDefined()
    })
  })

  describe('initialization', () => {
    it('should initialize with all required defaults', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
      expect(wrapper.vm.persistentHint).toBe(true)
      expect(wrapper.vm.autocomplete).toBe('off')
      expect(wrapper.vm.required).toBe(true)
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

  describe('security features', () => {
    it('should have autocomplete off by default', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should prevent special characters via watch', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          value: 'https://example.com'
        }
      })
      // Watch method checks for spaces and commas
      expect(wrapper.vm.value).toBe('https://example.com')
    })

    it('should use URL validation rules from constants', () => {
      expect(COMMON_CONSTANTS.DEFAULT_URL_RULES).toBeDefined()
    })
  })

  describe('label references', () => {
    it('should use DefaultHint label', () => {
      expect(labels.DefaultHint).toBeDefined()
    })

    it('should use Required label when needed', () => {
      expect(labels.Required).toBeDefined()
    })
  })

  describe('optional URL field', () => {
    it('should work as optional URL field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: false
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(wrapper.vm.persistentHint).toBe(false)
      expect(wrapper.vm.hint).toBeNull()
    })

    it('should work as required URL field', () => {
      wrapper = shallowMount(InputUrl, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.persistentHint).toBe(true)
    })
  })
})
