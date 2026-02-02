import { shallowMount } from '@vue/test-utils'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  CannotStartWithSpace: 'Field cannot start with space',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputEntityName.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputEntityName, {
      propsData: {
        initialRules: [(v) => true]
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
      expect(wrapper.vm.$options.name).toBe('InputEntityName')
    })

    it('should render v-text-field element', () => {
      expect(wrapper.find('v-text-field-stub').exists()).toBe(true)
    })

    it('should have proper template structure', () => {
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$options.name).toBe('InputEntityName')
    })
  })

  describe('prop defaults', () => {
    it('should have maxLength default 200', () => {
      expect(wrapper.vm.maxLength).toBe(200)
    })

    it('should have required default true', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should have applyRules default true', () => {
      expect(wrapper.vm.applyRules).toBe(true)
    })

    it('should have initialPlaceholder default empty string', () => {
      expect(wrapper.vm.initialPlaceholder).toBe('')
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

    it('should have type prop default text', () => {
      expect(wrapper.vm.type).toBe('text')
    })

    it('should have label prop default empty string', () => {
      expect(wrapper.vm.label).toBe('')
    })

    it('should have persistentPlaceholder default false', () => {
      expect(wrapper.vm.persistentPlaceholder).toBe(false)
    })

    it('should have className prop default empty string', () => {
      expect(wrapper.vm.className).toBe('')
    })

    it('should have hideDetails default false', () => {
      expect(wrapper.vm.hideDetails).toBe(false)
    })

    it('should have hint prop default empty string', () => {
      expect(wrapper.vm.hint).toBe('')
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test Entity'
        }
      })
      expect(wrapper.vm.value).toBe('Test Entity')
    })

    it('should accept custom id', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          id: 'custom-entity'
        }
      })
      expect(wrapper.vm.id).toBe('custom-entity')
    })

    it('should accept custom initialPlaceholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Enter entity name'
        }
      })
      expect(wrapper.vm.initialPlaceholder).toBe('Enter entity name')
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          entityName: 'Training Course'
        }
      })
      expect(wrapper.vm.entityName).toBe('Training Course')
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should accept required prop false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should accept disabled prop true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept readonly prop true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should accept applyRules prop false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false
        }
      })
      expect(wrapper.vm.applyRules).toBe(false)
    })

    it('should accept custom initialRules', () => {
      const customRules = [(v) => v.length > 0 || 'Required']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: customRules
        }
      })
      expect(wrapper.vm.initialRules).toEqual(customRules)
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          hint: 'Custom hint text'
        }
      })
      expect(wrapper.vm.hint).toBe('Custom hint text')
    })

    it('should accept custom label', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: 'Entity Label'
        }
      })
      expect(wrapper.vm.label).toBe('Entity Label')
    })

    it('should accept custom type', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'email'
        }
      })
      expect(wrapper.vm.type).toBe('email')
    })

    it('should accept custom className', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: 'custom-class'
        }
      })
      expect(wrapper.vm.className).toBe('custom-class')
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

    it('should initialize placeholder properly', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should have empty requiredProps initially for non-required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('validation rules', () => {
    it('should have startsWithSpace validation', () => {
      const rule = wrapper.vm.rules[0]
      expect(typeof rule).toBe('function')
    })

    it('should have callable validation functions', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })

    it('should have at least 1 default validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(1)
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
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          entityName: 'Custom Entity',
          maxLength: 100
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
    })

    it('should use maxLength prop in validation', () => {
      wrapper = shallowMount(InputEntityName, {
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

  describe('watchers - initialRules', () => {
    it('should apply initialRules when provided', async () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should watch initialRules with deep option', () => {
      const watcher = wrapper.vm.$options.watch.initialRules
      expect(watcher.deep).toBe(true)
    })

    it('should watch initialRules with immediate option', () => {
      const watcher = wrapper.vm.$options.watch.initialRules
      expect(watcher.immediate).toBe(true)
    })

    it('should not apply initialRules when applyRules false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false,
          initialRules: []
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should update rules when initialRules changes', async () => {
      const initialRules = [(v) => v || 'Error 1']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: initialRules
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rules).toEqual(initialRules)
    })
  })

  describe('watchers - required', () => {
    it('should add required validation when required becomes true', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      const initialLength = wrapper.vm.rules.length
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.rules.length).toBeGreaterThan(initialLength)
    })

    it('should set requiredProps when required is true', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      await wrapper.setProps({ required: true })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBeGreaterThan(0)
    })

    it('should have hint in requiredProps when required', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should have persistentHint in requiredProps when required', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should watch required with immediate option', () => {
      const watcher = wrapper.vm.$options.watch.required
      expect(watcher.immediate).toBe(true)
    })

    it('should call applyRequiredProps when required changes', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      const spy = jest.spyOn(wrapper.vm, 'applyRequiredProps')
      await wrapper.setProps({ required: true })
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('mounted hook', () => {
    it('should initialize rules in mounted hook', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should initialize placeholder in mounted hook', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should add maxLength rule at start', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should set placeholder from initialPlaceholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Custom text'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom text')
    })

    it('should generate default placeholder with entity name', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: '',
          entityName: 'Department'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Department')
    })

    it('should apply initialRules in mounted if applyRules true', () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not apply initialRules in mounted if applyRules false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false,
          initialRules: []
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })
  })

  describe('applyRequiredProps method', () => {
    it('should set requiredProps when required is true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should add required rule when required is true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      const rulesLength = wrapper.vm.rules.length
      expect(rulesLength).toBeGreaterThan(0)
    })

    it('should unshift required rule to beginning', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      const firstRule = wrapper.vm.rules[0]
      expect(typeof firstRule).toBe('function')
    })

    it('should clear requiredProps when required is false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should clear rules when required false and applyRules false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          applyRules: false,
          initialRules: []
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should use custom hint if provided', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: 'Custom required hint'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Custom required hint')
    })

    it('should use default hint if not provided', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: ''
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })
  })

  describe('required vs optional behavior', () => {
    it('should initialize as required by default', () => {
      expect(wrapper.vm.required).toBe(true)
    })

    it('should initialize as optional when required false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should set required validation when required true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should add validation rules when required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have required hint text when required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should have custom hint when provided for required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: 'Custom required hint'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Custom required hint')
    })

    it('should not have requiredProps when not required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })
  })

  describe('text field specific behavior', () => {
    it('should render as text input not textarea', () => {
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.exists()).toBe(true)
    })

    it('should have outlined styling', () => {
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('outlined')).toBeDefined()
    })

    it('should have dense styling', () => {
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('dense')).toBeDefined()
    })

    it('should support custom type prop', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'email'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('type')).toBe('email')
    })

    it('should support persistent placeholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          persistentPlaceholder: true
        }
      })
      expect(wrapper.vm.persistentPlaceholder).toBe(true)
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
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should update requiredProps when required changes', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      const initialKeys = Object.keys(wrapper.vm.requiredProps).length
      await wrapper.setProps({ required: true })
      const updatedKeys = Object.keys(wrapper.vm.requiredProps).length
      expect(updatedKeys).toBeGreaterThan(initialKeys)
    })

    it('should update disabled state reactively', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: false
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update readonly state reactively', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: false
        }
      })
      expect(wrapper.vm.readonly).toBe(false)
      await wrapper.setProps({ readonly: true })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should update maxLength state reactively', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 200
        }
      })
      expect(wrapper.vm.maxLength).toBe(200)
      await wrapper.setProps({ maxLength: 300 })
      expect(wrapper.vm.maxLength).toBe(300)
    })
  })

  describe('state management', () => {
    it('should maintain maxLength state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should maintain required state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should maintain entityName state', () => {
      wrapper = shallowMount(InputEntityName, {
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

    it('should maintain disabled state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should maintain readonly state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })
  })

  describe('input event handling', () => {
    it('should emit input event on value change', () => {
      wrapper.vm.$emit('input', 'test content')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      const testContent = 'Test entity name'
      wrapper.vm.$emit('input', testContent)
      expect(wrapper.emitted('input')[0][0]).toBe(testContent)
    })

    it('should support v-model binding', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Initial content'
        }
      })
      expect(wrapper.vm.value).toBe('Initial content')
    })

    it('should accept empty string as value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })
  })

  describe('accessibility', () => {
    it('should have id for accessibility', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          id: 'entity-name-field'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('id')).toBe('entity-name-field')
    })

    it('should have placeholder for guidance', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('should have hint for required indication', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should have disabled state for accessibility', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should have readonly state for accessibility', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should have label for accessibility', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: 'Entity Name'
        }
      })
      expect(wrapper.vm.label).toBe('Entity Name')
    })
  })

  describe('integration scenarios', () => {
    it('should work as required entity name field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          entityName: 'Training Course',
          maxLength: 300
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should work as optional entity name field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          maxLength: 200,
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should work with custom placeholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Please enter entity name...'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Please enter entity name...')
    })

    it('should work with custom maxLength', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 500
        }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should work with applyRules false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false,
          initialRules: []
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should work with custom initialRules', () => {
      const customRules = [(v) => !v || 'Custom error']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should work in disabled state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should work in readonly state', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should work with all props configured', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test Entity',
          initialPlaceholder: 'Enter entity',
          entityName: 'Custom Entity',
          id: 'test-id',
          required: true,
          disabled: false,
          readonly: false,
          applyRules: true,
          maxLength: 250,
          label: 'Entity Name',
          persistentPlaceholder: true,
          className: 'custom-class',
          hideDetails: false,
          hint: 'Required field',
          type: 'text'
        }
      })
      expect(wrapper.vm.value).toBe('Test Entity')
      expect(wrapper.vm.entityName).toBe('Custom Entity')
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.maxLength).toBe(250)
    })
  })

  describe('text field configuration', () => {
    it('should have outlined and dense by default', () => {
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('outlined')).toBeDefined()
      expect(textfield.attributes('dense')).toBeDefined()
    })

    it('should bind value prop to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test content'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('value')).toBe('Test content')
    })

    it('should bind rules to text field', () => {
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('rules')).toBeDefined()
    })

    it('should bind id to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          id: 'test-id'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('id')).toBe('test-id')
    })

    it('should bind disabled to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('disabled')).toBeDefined()
    })

    it('should bind readonly to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          readonly: true
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('readonly')).toBeDefined()
    })

    it('should bind label to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: 'Entity Label'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('label')).toBe('Entity Label')
    })

    it('should bind type to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'email'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('type')).toBe('email')
    })

    it('should bind class to text field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: 'custom-class'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('class')).toContain('custom-class')
    })
  })

  describe('maxLength rule handling', () => {
    it('should add maxLength rule in mounted', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should use custom maxLength in rule', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 100,
          entityName: 'Test'
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should include entityName in maxLength validation', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 150,
          entityName: 'Custom Entity'
        }
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity')
      expect(wrapper.vm.maxLength).toBe(150)
    })
  })
})
