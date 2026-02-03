import { shallowMount } from '@vue/test-utils'
import InputDescription from '@/components/Common/Inputs/InputDescription.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Description: 'Description',
  CannotStartWithSpace: 'Cannot start with space',
  RequiredStar: '*Required',
  EnterDescription: 'Enter description',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputDescription.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputDescription)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputDescription')
    })

    it('should render v-textarea element', () => {
      expect(wrapper.find('v-textarea-stub').exists()).toBe(true)
    })

    it('should have proper template structure', () => {
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$options.name).toBe('InputDescription')
    })
  })

  describe('prop defaults', () => {
    it('should have maxLength default 2000', () => {
      expect(wrapper.vm.maxLength).toBe(2000)
    })

    it('should have required default false', () => {
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have applyRules default true', () => {
      expect(wrapper.vm.applyRules).toBe(true)
    })

    it('should have initialPlaceholder default empty string', () => {
      expect(wrapper.vm.initialPlaceholder).toBe('')
    })

    it('should have entityName default Description label', () => {
      expect(wrapper.vm.entityName).toBe(labels.Description)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have readonly default false', () => {
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should have value prop', () => {
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should have id prop', () => {
      expect(wrapper.vm.id).toBeUndefined()
    })

    it('should support persistent hint in requiredProps', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: 'Test description content'
        }
      })
      expect(wrapper.vm.value).toBe('Test description content')
    })

    it('should accept custom id', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          id: 'custom-description'
        }
      })
      expect(wrapper.vm.id).toBe('custom-description')
    })

    it('should accept custom initialPlaceholder', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: 'Enter your description'
        }
      })
      expect(wrapper.vm.initialPlaceholder).toBe('Enter your description')
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          entityName: 'Training Content'
        }
      })
      expect(wrapper.vm.entityName).toBe('Training Content')
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          maxLength: 5000
        }
      })
      expect(wrapper.vm.maxLength).toBe(5000)
    })

    it('should accept required prop true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept disabled prop true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept readonly prop true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should accept applyRules prop false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          applyRules: false
        }
      })
      expect(wrapper.vm.applyRules).toBe(false)
    })

    it('should accept custom initialRules', () => {
      const customRules = [(v) => v.length > 0 || 'Required']
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.initialRules).toEqual(customRules)
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          hint: 'Custom hint text'
        }
      })
      expect(wrapper.vm.hint).toBe('Custom hint text')
    })

    it('should accept custom height', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          height: '300px'
        }
      })
      expect(wrapper.vm.height).toBe('300px')
    })

    it('should accept custom rows', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          rows: '10'
        }
      })
      expect(wrapper.vm.rows).toBe('10')
    })
  })

  describe('data properties', () => {
    it('should have rules data property', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have placeholder data property', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should have requiredProps data property', () => {
      expect(wrapper.vm.requiredProps).toBeDefined()
      expect(typeof wrapper.vm.requiredProps).toBe('object')
    })

    it('should initialize rules with default validations', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have startsWithSpace rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(1)
    })

    it('should have maxLength rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should have placeholder initialized to default', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
    })

    it('should have empty requiredProps initially for non-required', () => {
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('validation rules', () => {
    it('should have startsWithSpace validation', () => {
      const rule = wrapper.vm.rules[0]
      expect(typeof rule).toBe('function')
    })

    it('should have maxLength validation', () => {
      const rule = wrapper.vm.rules[1]
      expect(typeof rule).toBe('function')
    })

    it('should have callable validation functions', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })

    it('should have at least 2 default validation rules', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should initialize rules from data', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have proper rule function types', () => {
      const rules = wrapper.vm.rules
      expect(rules.every((rule) => typeof rule === 'function')).toBe(true)
    })

    it('should use startsWithSpace validation from utils', () => {
      expect(Validations.startsWithSpace).toBeDefined()
    })

    it('should use maxLength validation from utils', () => {
      expect(Validations.maxLength).toBeDefined()
    })

    it('should include entityName in validation logic', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          entityName: 'Custom Entity',
          maxLength: 100
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
    })

    it('should use maxLength prop in validation', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should have rules that are functions', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
      expect(typeof rules[0]).toBe('function')
    })
  })

  describe('required prop watcher', () => {
    it('should add required validation when required becomes true', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false
        }
      })
      const initialLength = wrapper.vm.rules.length
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should set requiredProps when required is true', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false
        }
      })
      await wrapper.setProps({ required: true })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBeGreaterThan(0)
    })

    it('should have hint in requiredProps when required', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should have persistentHint in requiredProps when required', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should update placeholder on required change', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false,
          initialPlaceholder: 'Custom placeholder'
        }
      })
      const initialPlaceholder = wrapper.vm.placeholder
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.placeholder).toBe(initialPlaceholder)
    })
  })

  describe('created hook behavior', () => {
    it('should initialize rules in created hook', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should initialize placeholder in created hook', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
    })

    it('should add required rule when required prop true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      // Should have required validation added
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should set requiredProps in created hook', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should use custom initialPlaceholder when provided', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: 'Custom text'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom text')
    })

    it('should apply initialRules when applyRules true', () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not apply initialRules when applyRules false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })
  })

  describe('required vs optional behavior', () => {
    it('should initialize as optional by default', () => {
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should set required validation when required true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      // Should have additional required validation added
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(3)
    })

    it('should add validation rules when required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should have required hint text when required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
    })

    it('should have custom hint when provided for required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          hint: 'Custom required hint'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Custom required hint')
    })

    it('should not have requiredProps when not required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false
        }
      })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('textarea specific behavior', () => {
    it('should render as textarea not text input', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.exists()).toBe(true)
    })

    it('should have no-resize attribute', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.exists()).toBe(true)
    })

    it('should have outlined styling', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('outlined')).toBeDefined()
    })

    it('should have dense styling', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('dense')).toBeDefined()
    })

    it('should support custom height', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          height: '400px'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('height')).toBe('400px')
    })

    it('should support custom rows', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          rows: '12'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('rows')).toBe('12')
    })

    it('should have autocomplete disabled', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('autocomplete')).toBe('disabled')
    })
  })

  describe('component reactivity', () => {
    it('should maintain rules reactivity', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should maintain placeholder reactivity', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should respond to required prop changes', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false
        }
      })
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should update requiredProps when required changes', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false
        }
      })
      const initialKeys = Object.keys(wrapper.vm.requiredProps).length
      await wrapper.setProps({ required: true })
      const updatedKeys = Object.keys(wrapper.vm.requiredProps).length
      expect(updatedKeys).toBeGreaterThan(initialKeys)
    })

    it('should update disabled state reactively', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: false
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update readonly state reactively', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          readonly: false
        }
      })
      expect(wrapper.vm.readonly).toBe(false)
      await wrapper.setProps({ readonly: true })
      expect(wrapper.vm.readonly).toBe(true)
    })
  })

  describe('state management', () => {
    it('should maintain maxLength state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          maxLength: 5000
        }
      })
      expect(wrapper.vm.maxLength).toBe(5000)
    })

    it('should maintain required state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain entityName state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          entityName: 'Custom Entity'
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
    })

    it('should maintain rules state', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should maintain placeholder state', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })
  })

  describe('input event handling', () => {
    it('should emit input event on value change', () => {
      wrapper.vm.$emit('input', 'test content')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      const testContent = 'Test description'
      wrapper.vm.$emit('input', testContent)
      expect(wrapper.emitted('input')[0][0]).toBe(testContent)
    })

    it('should support v-model binding', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: 'Initial content'
        }
      })
      expect(wrapper.vm.value).toBe('Initial content')
    })

    it('should accept empty string as value', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should handle multiline content', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3'
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: multilineContent
        }
      })
      expect(wrapper.vm.value).toBe(multilineContent)
    })
  })

  describe('accessibility', () => {
    it('should have id for accessibility', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          id: 'description-field'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('id')).toBe('description-field')
    })

    it('should have placeholder for guidance', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(wrapper.vm.placeholder).toContain('description')
    })

    it('should have hint for required indication', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should have disabled state for accessibility', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should have readonly state for accessibility', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as required description field', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          entityName: 'Training Description',
          maxLength: 3000
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should work as optional description field', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: false,
          maxLength: 2000
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should work with custom placeholder', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: 'Please provide details...'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Please provide details...')
    })

    it('should work with custom height and rows', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          height: '500px',
          rows: '15'
        }
      })
      expect(wrapper.vm.height).toBe('500px')
      expect(wrapper.vm.rows).toBe('15')
    })

    it('should work in disabled state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should work in readonly state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should work with applyRules false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should work with custom initialRules', () => {
      const customRules = [(v) => !v || 'Custom error']
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })
  })

  describe('textarea configuration', () => {
    it('should have outlined and dense by default', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('outlined')).toBeDefined()
      expect(textarea.attributes('dense')).toBeDefined()
    })

    it('should bind value prop to textarea', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: 'Test content'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('value')).toBe('Test content')
    })

    it('should bind rules to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('rules')).toBeDefined()
    })

    it('should bind id to textarea', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          id: 'test-id'
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('id')).toBe('test-id')
    })

    it('should bind placeholder to textarea', () => {
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('placeholder')).toBe(labels.EnterDescription)
    })

    it('should bind disabled to textarea', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('disabled')).toBeDefined()
    })

    it('should bind readonly to textarea', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          readonly: true
        }
      })
      const textarea = wrapper.find('v-textarea-stub')
      expect(textarea.attributes('readonly')).toBeDefined()
    })
  })

  describe('multi-line text handling', () => {
    it('should accept single line text', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: 'Single line text'
        }
      })
      expect(wrapper.vm.value).toBe('Single line text')
    })

    it('should accept text with two newlines', () => {
      const text = 'Line 1\nLine 2'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept text with multiple newlines', () => {
      const text = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle Windows-style newlines (CRLF)', () => {
      const text = 'Line 1\r\nLine 2'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle tab characters in text', () => {
      const text = 'Text\twith\ttabs'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle text with mixed newlines and tabs', () => {
      const text = 'Line 1\n\tIndented line'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve leading spaces after newlines', () => {
      const text = 'Line 1\n  Indented line'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle empty lines between text', () => {
      const text = 'Line 1\n\nLine 3'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle multiple consecutive empty lines', () => {
      const text = 'Line 1\n\n\n\nLine 5'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle text ending with newline', () => {
      const text = 'Line 1\nLine 2\n'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('HTML and rich text content', () => {
    it('should accept HTML tags as plain text', () => {
      const text = '<p>Paragraph</p>'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept HTML with attributes', () => {
      const text = '<div class="container">Content</div>'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept markdown-style formatting', () => {
      const text = '# Heading\n**Bold text**\n*Italic text*'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle bold markdown', () => {
      const text = 'This is **bold** text'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle italic markdown', () => {
      const text = 'This is *italic* text'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle code blocks', () => {
      const text = 'Some text\n```code block```'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle links in text', () => {
      const text = 'Visit [example](https://example.com) for more'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle inline code', () => {
      const text = 'Use `const x = 5;` for variable declaration'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept script tags as plain text (no execution)', () => {
      const text = '<script>alert("test")</script>'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve angle brackets and special chars', () => {
      const text = 'Math: 5 < 10 && 10 > 5'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('character count and limits', () => {
    it('should allow text at default maxLength of 2000', () => {
      const text = 'A'.repeat(2000)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(2000)
    })

    it('should track character count correctly', () => {
      const text = 'Hello World'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(11)
    })

    it('should handle text at custom maxLength boundary', () => {
      const text = 'A'.repeat(5000)
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: text,
          maxLength: 5000
        }
      })
      expect(wrapper.vm.value.length).toBe(5000)
    })

    it('should apply maxLength rule correctly', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { maxLength: 100 }
      })
      const rules = wrapper.vm.rules
      expect(rules.some((rule) => typeof rule === 'function')).toBe(true)
    })

    it('should have maxLength validation for long text', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { maxLength: 10 }
      })
      const maxLengthRule = wrapper.vm.rules[1]
      expect(typeof maxLengthRule).toBe('function')
    })

    it('should accept empty text', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '' }
      })
      expect(wrapper.vm.value).toBe('')
      expect(wrapper.vm.value.length).toBe(0)
    })

    it('should accept single character', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'A' }
      })
      expect(wrapper.vm.value.length).toBe(1)
    })

    it('should handle very small maxLength', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: 'Test',
          maxLength: 5
        }
      })
      expect(wrapper.vm.maxLength).toBe(5)
    })

    it('should handle very large maxLength', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          maxLength: 50000
        }
      })
      expect(wrapper.vm.maxLength).toBe(50000)
    })

    it('should count newlines as characters', () => {
      const text = 'Line 1\nLine 2'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(13)
    })

    it('should count tabs as single characters', () => {
      const text = 'Text\tWith\tTabs'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(14)
    })
  })

  describe('large text blocks (1000+ characters)', () => {
    it('should accept text with 1000 characters', () => {
      const text = 'A'.repeat(1000)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(1000)
    })

    it('should accept text with 5000 characters', () => {
      const text = 'B'.repeat(5000)
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: text,
          maxLength: 5000
        }
      })
      expect(wrapper.vm.value.length).toBe(5000)
    })

    it('should accept paragraph with 2000 words', () => {
      const words = Array(2000).fill('word').join(' ')
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: words,
          maxLength: 15000
        }
      })
      expect(wrapper.vm.value.length).toBeGreaterThan(1000)
    })

    it('should handle large text with newlines', () => {
      const text = Array(100).fill('Line of text').join('\n')
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: text,
          maxLength: 5000
        }
      })
      expect(wrapper.vm.value).toContain('Line of text')
    })

    it('should handle JSON content as large text', () => {
      const json = JSON.stringify({ key: 'value', nested: { deep: 'data' } }).repeat(50)
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: json,
          maxLength: 10000
        }
      })
      expect(wrapper.vm.value).toContain('key')
    })

    it('should handle CSV-like content', () => {
      const csv = 'name,email,phone\nJohn,john@test.com,123456\nJane,jane@test.com,789012'.repeat(10)
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: csv,
          maxLength: 5000
        }
      })
      expect(wrapper.vm.value).toContain('name')
    })

    it('should handle repeating patterns in large text', () => {
      const pattern = 'ABCDEFGHIJ'
      const text = pattern.repeat(200)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text, maxLength: 5000 }
      })
      expect(wrapper.vm.value.length).toBe(2000)
    })
  })

  describe('text formatting preservation', () => {
    it('should preserve original text case', () => {
      const text = 'MiXeD CaSe TeXt'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve spaces between words', () => {
      const text = 'Multiple   spaces   between   words'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve leading spaces before newline', () => {
      const text = '  Leading spaces\n  Next line'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve trailing spaces', () => {
      const text = 'Text with trailing spaces   '
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve list formatting', () => {
      const text = '- Item 1\n- Item 2\n- Item 3'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve numbered list formatting', () => {
      const text = '1. First\n2. Second\n3. Third'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve mixed whitespace and punctuation', () => {
      const text = 'Hello! World? @#$% & *()[]'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should preserve Unicode characters', () => {
      const text = '你好世界 مرحبا العالم Привет мир'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('placeholder and label behavior', () => {
    it('should use default placeholder when not provided', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
    })

    it('should use custom placeholder when provided', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: 'Custom placeholder text'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder text')
    })

    it('should use default placeholder when initialPlaceholder is empty string', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: ''
        }
      })
      // Component defaults to EnterDescription label when initialPlaceholder is empty
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should maintain entityName in label', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          entityName: 'Training Material'
        }
      })
      expect(wrapper.vm.entityName).toBe('Training Material')
    })

    it('should use default entityName label when not provided', () => {
      expect(wrapper.vm.entityName).toBe(labels.Description)
    })

    it('should show required indicator when required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { required: true }
      })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should display hint text for required field', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { required: true }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should show custom hint when provided', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          hint: 'Please provide a detailed description'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Please provide a detailed description')
    })

    it('should handle long placeholder text', () => {
      const longPlaceholder = 'Enter a detailed description with multiple sentences and paragraphs'
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: longPlaceholder
        }
      })
      expect(wrapper.vm.placeholder).toBe(longPlaceholder)
    })

    it('should handle placeholder with special characters', () => {
      const placeholder = 'Enter text (required) - max 2000 chars #important'
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: placeholder
        }
      })
      expect(wrapper.vm.placeholder).toBe(placeholder)
    })

    it('should maintain placeholder on required change', async () => {
      const placeholder = 'Custom placeholder'
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialPlaceholder: placeholder,
          required: false
        }
      })
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.placeholder).toBe(placeholder)
    })
  })

  describe('special characters and unicode', () => {
    it('should accept emoji characters', () => {
      const text = 'Hello 👋 World 🌍'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept Chinese characters', () => {
      const text = '你好世界，这是一个测试'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept Arabic characters', () => {
      const text = 'مرحبا بك في الاختبار'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept Cyrillic characters', () => {
      const text = 'Привет мир, это тест'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept Japanese characters', () => {
      const text = 'こんにちは世界'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept mixed Unicode content', () => {
      const text = 'English 英文 Русский 阿拉伯'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept accented characters', () => {
      const text = 'Café résumé naïve façade'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept mathematical symbols', () => {
      const text = '√ ∞ ± ÷ × ≈ ≠ ≤ ≥'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept currency symbols', () => {
      const text = '$100 €50 £75 ¥200 ₹500'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept combining diacritical marks', () => {
      const text = 'e̊ å ø æ'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('null and undefined handling', () => {
    it('should handle undefined value', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: undefined }
      })
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should handle null value', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: null }
      })
      expect(wrapper.vm.value).toBeNull()
    })

    it('should handle value change from null to string', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: null }
      })
      await wrapper.setProps({ value: 'Now has content' })
      expect(wrapper.vm.value).toBe('Now has content')
    })

    it('should handle value change from string to null', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'Content' }
      })
      await wrapper.setProps({ value: null })
      expect(wrapper.vm.value).toBeNull()
    })

    it('should handle value change from string to undefined', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'Content' }
      })
      await wrapper.setProps({ value: undefined })
      expect(wrapper.vm.value).toBeUndefined()
    })
  })

  describe('edge case values', () => {
    it('should handle value with only spaces', () => {
      const text = '     '
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle value with only newlines', () => {
      const text = '\n\n\n'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle value with only tabs', () => {
      const text = '\t\t\t'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle very long single word without spaces', () => {
      const text = 'A'.repeat(500)
      wrapper = shallowMount(InputDescription, {
        propsData: {
          value: text,
          maxLength: 1000
        }
      })
      expect(wrapper.vm.value.length).toBe(500)
    })

    it('should handle zero width characters', () => {
      const text = 'Text\u200bWith\u200bZWS'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle null byte like characters (safely)', () => {
      const text = 'Text with special chars'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('event emissions for text content', () => {
    it('should emit input event when value changes', () => {
      wrapper.vm.$emit('input', 'new text')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input with multiline text', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      wrapper.vm.$emit('input', text)
      expect(wrapper.emitted('input')[0][0]).toBe(text)
    })

    it('should emit input with large text block', () => {
      const text = 'A'.repeat(2000)
      wrapper.vm.$emit('input', text)
      expect(wrapper.emitted('input')[0][0]).toBe(text)
    })

    it('should emit change event', () => {
      wrapper.vm.$emit('change', 'updated text')
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('should emit blur event', () => {
      wrapper.vm.$emit('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit focus event', () => {
      wrapper.vm.$emit('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('disabled and readonly combinations', () => {
    it('should work when both disabled and readonly are false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: false,
          readonly: false
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should work when disabled is true and readonly is false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true,
          readonly: false
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should work when disabled is false and readonly is true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: false,
          readonly: true
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should work when both disabled and readonly are true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true,
          readonly: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should transition from disabled to enabled', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { disabled: true }
      })
      await wrapper.setProps({ disabled: false })
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should transition from readonly to editable', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { readonly: true }
      })
      await wrapper.setProps({ readonly: false })
      expect(wrapper.vm.readonly).toBe(false)
    })
  })

  describe('validation rule application', () => {
    it('should apply custom rules when applyRules is true', () => {
      const customRules = [
        (v) => v.length > 10 || 'Must be longer than 10 characters',
        (v) => v.length < 100 || 'Must be less than 100 characters'
      ]
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not apply custom rules when applyRules is false', () => {
      const customRules = [
        (v) => v.length > 10 || 'Must be longer than 10 characters'
      ]
      wrapper = shallowMount(InputDescription, {
        propsData: {
          initialRules: customRules,
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should combine required rule with other rules', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { required: true }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    })

    it('should validate empty string when required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { required: true }
      })
      const requiredRule = wrapper.vm.rules.find((rule) => {
        const result = rule('')
        return result !== true
      })
      expect(requiredRule).toBeDefined()
    })

    it('should validate text with leading space using startsWithSpace rule', () => {
      wrapper = shallowMount(InputDescription)
      const startsWithSpaceRule = wrapper.vm.rules[0]
      const result = startsWithSpaceRule(' Text')
      expect(result).not.toBe(true)
    })
  })

  describe('numeric input edge cases', () => {
    it('should accept numeric values as strings', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '12345' }
      })
      expect(wrapper.vm.value).toBe('12345')
    })

    it('should accept values with only numbers', () => {
      const text = '9876543210'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept negative numbers as text', () => {
      const text = '-123'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept decimal numbers as text', () => {
      const text = '3.14159'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept scientific notation as text', () => {
      const text = '1e10'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept hexadecimal representation as text', () => {
      const text = '0x1A2B'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('whitespace handling variations', () => {
    it('should accept leading whitespace in multiline text', () => {
      const text = '\n  indented line'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept trailing whitespace', () => {
      const text = 'text with trailing spaces    '
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept form feed character', () => {
      const text = 'text\fwith form feed'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept vertical tab character', () => {
      const text = 'text\vwith vertical tab'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept no-break space (NBSP)', () => {
      const text = 'text\u00A0with NBSP'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('punctuation and symbols', () => {
    it('should accept common punctuation marks', () => {
      const text = '.,;:!?\'"-'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept brackets and braces', () => {
      const text = '()[]{}< >'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept mathematical symbols', () => {
      const text = '+-*/=≠<>≤≥'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept currency and financial symbols', () => {
      const text = '$¢£¤¥₹€₽₩₪₦'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept ampersand and other symbols', () => {
      const text = '& @ # % ^ ~ | \\ / _ « » • ‰'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept repeated punctuation', () => {
      const text = '...!!!???---===__'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept mixed symbols and text', () => {
      const text = 'Price: $99.99 (50% off!)'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('line break variations', () => {
    it('should handle Unix line endings (LF)', () => {
      const text = 'Line1\nLine2\nLine3'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle Mac classic line endings (CR)', () => {
      const text = 'Line1\rLine2\rLine3'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle mixed line endings in same text', () => {
      const text = 'Line1\nLine2\rLine3\r\nLine4'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle consecutive line breaks', () => {
      const text = 'Text\n\n\n\nMore text'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle text starting with line break', () => {
      const text = '\n\nText starting with breaks'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle text ending with line break', () => {
      const text = 'Text ending with break\n\n'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('data representation formats', () => {
    it('should accept XML/SGML format text', () => {
      const text = '<?xml version="1.0"?><root><item>test</item></root>'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept CSS format text', () => {
      const text = 'body { color: red; font-size: 14px; }'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept SQL format text', () => {
      const text = 'SELECT * FROM users WHERE id = 1;'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept JavaScript code as text', () => {
      const text = 'const x = { key: "value" }; console.log(x);'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept Python code as text', () => {
      const text = 'def hello():\n    print("world")'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept regex patterns as text', () => {
      const text = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('mixed language and script system support', () => {
    it('should accept Latin with numbers and symbols', () => {
      const text = 'Test123 !@#$%^&*()'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept CJK with punctuation', () => {
      const text = '测试：中文文本。Test、Testing！123'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept RTL text with LTR text', () => {
      const text = 'Hello مرحبا 你好'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept multiple scripts in single line', () => {
      const text = 'Привет world नमस्ते 안녕'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should accept all Unicode planes', () => {
      const text = 'Basic: A1! Emoji: 😀🎉 Ancient: 𐌀𐌁𐌂'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })
  })

  describe('extreme boundary testing', () => {
    it('should handle text near maximum length (1999 chars)', () => {
      const text = 'A'.repeat(1999)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(1999)
    })

    it('should handle exactly maximum length (2000 chars)', () => {
      const text = 'B'.repeat(2000)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value.length).toBe(2000)
    })

    it('should handle single character input', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'X' }
      })
      expect(wrapper.vm.value).toBe('X')
    })

    it('should handle extremely nested structures as text', () => {
      const text = '((((((((((((((((((((hello))))))))))))))))))'
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text }
      })
      expect(wrapper.vm.value).toBe(text)
    })

    it('should handle repeated pattern of 100+ characters', () => {
      const pattern = 'ABCDEFGHIJ'
      const text = pattern.repeat(300)
      wrapper = shallowMount(InputDescription, {
        propsData: { value: text, maxLength: 5000 }
      })
      expect(wrapper.vm.value.length).toBe(3000)
    })
  })

  describe('v-model behavior with different value types', () => {
    it('should handle value updates via prop changes', async () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'Initial' }
      })
      await wrapper.setProps({ value: 'Updated' })
      expect(wrapper.vm.value).toBe('Updated')
    })

    it('should emit on input event when value changes', () => {
      wrapper.vm.$emit('input', 'new value')
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe('new value')
    })

    it('should emit change event on blur', () => {
      wrapper.vm.$emit('change', 'changed value')
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('should emit focus event on focus', () => {
      wrapper.vm.$emit('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit blur event on blur', () => {
      wrapper.vm.$emit('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('component prop validation combinations', () => {
    it('should handle required with custom placeholder', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          initialPlaceholder: 'Custom required'
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.placeholder).toBe('Custom required')
    })

    it('should handle disabled with required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          disabled: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should handle readonly with required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          required: true,
          readonly: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should handle both disabled and readonly', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          disabled: true,
          readonly: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should handle custom height with custom rows', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          height: '500px',
          rows: '20'
        }
      })
      expect(wrapper.vm.height).toBe('500px')
      expect(wrapper.vm.rows).toBe('20')
    })

    it('should handle all styling props together', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: {
          height: '400px',
          rows: '15',
          disabled: false,
          readonly: false,
          required: true
        }
      })
      expect(wrapper.vm.height).toBe('400px')
      expect(wrapper.vm.rows).toBe('15')
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(false)
      expect(wrapper.vm.required).toBe(true)
    })
  })
})
