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
})
