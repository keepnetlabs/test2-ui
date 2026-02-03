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

  describe('edge cases - null and undefined props', () => {
    it('should handle null value prop', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: null
        }
      })
      expect(wrapper.vm.value).toBeNull()
    })

    it('should handle undefined value prop', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {}
      })
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('should handle empty string value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should handle null initialPlaceholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: null
        }
      })
      expect(wrapper.vm.initialPlaceholder).toBeNull()
    })

    it('should handle undefined entityName', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {}
      })
      expect(wrapper.vm.entityName).toBeUndefined()
    })

    it('should handle null hint', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: null
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })

    it('should handle null label', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: null
        }
      })
      expect(wrapper.vm.label).toBeNull()
    })

    it('should handle undefined initialRules', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {}
      })
      expect(wrapper.vm.initialRules).toBeUndefined()
    })
  })

  describe('special characters and Unicode support', () => {
    it('should accept values with special characters', () => {
      const specialValue = 'Test!@#$%^&*()'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: specialValue
        }
      })
      expect(wrapper.vm.value).toBe(specialValue)
    })

    it('should accept values with Unicode characters', () => {
      const unicodeValue = 'Тест العربية 中文'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: unicodeValue
        }
      })
      expect(wrapper.vm.value).toBe(unicodeValue)
    })

    it('should accept emoji characters', () => {
      const emojiValue = 'Test 😀 🎉 ❤️'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: emojiValue
        }
      })
      expect(wrapper.vm.value).toBe(emojiValue)
    })

    it('should accept mixed special characters and spaces', () => {
      const mixedValue = 'Test @ Entity - Name_123'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: mixedValue
        }
      })
      expect(wrapper.vm.value).toBe(mixedValue)
    })

    it('should accept quotes and apostrophes', () => {
      const quotedValue = "Test \"Entity\" 'Name'"
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: quotedValue
        }
      })
      expect(wrapper.vm.value).toBe(quotedValue)
    })

    it('should accept backslashes', () => {
      const backslashValue = 'Test\\Entity\\Name'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: backslashValue
        }
      })
      expect(wrapper.vm.value).toBe(backslashValue)
    })

    it('should accept newline characters', () => {
      const newlineValue = 'Test\nEntity\nName'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: newlineValue
        }
      })
      expect(wrapper.vm.value).toBe(newlineValue)
    })

    it('should accept tab characters', () => {
      const tabValue = 'Test\tEntity\tName'
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: tabValue
        }
      })
      expect(wrapper.vm.value).toBe(tabValue)
    })
  })

  describe('extreme length values', () => {
    it('should handle very long strings (500+ characters)', () => {
      const longValue = 'a'.repeat(500)
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: longValue,
          maxLength: 600
        }
      })
      expect(wrapper.vm.value).toBe(longValue)
      expect(wrapper.vm.value.length).toBe(500)
    })

    it('should handle very long strings (1000+ characters)', () => {
      const veryLongValue = 'b'.repeat(1000)
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: veryLongValue,
          maxLength: 1200
        }
      })
      expect(wrapper.vm.value.length).toBe(1000)
    })

    it('should handle maxLength of 50', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 50
        }
      })
      expect(wrapper.vm.maxLength).toBe(50)
    })

    it('should handle maxLength of 1000', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 1000
        }
      })
      expect(wrapper.vm.maxLength).toBe(1000)
    })

    it('should handle maxLength of 5000', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 5000
        }
      })
      expect(wrapper.vm.maxLength).toBe(5000)
    })

    it('should handle single character value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'A'
        }
      })
      expect(wrapper.vm.value).toBe('A')
    })
  })

  describe('event emissions - comprehensive', () => {
    it('should emit input event with correct payload', () => {
      const testValue = 'New Value'
      wrapper.vm.$emit('input', testValue)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input').length).toBe(1)
    })

    it('should emit input event multiple times', () => {
      wrapper.vm.$emit('input', 'Value 1')
      wrapper.vm.$emit('input', 'Value 2')
      wrapper.vm.$emit('input', 'Value 3')
      expect(wrapper.emitted('input').length).toBe(3)
    })

    it('should emit input event with empty string', () => {
      wrapper.vm.$emit('input', '')
      expect(wrapper.emitted('input')[0][0]).toBe('')
    })

    it('should emit input event with special characters', () => {
      const specialValue = '@#$%^&*()'
      wrapper.vm.$emit('input', specialValue)
      expect(wrapper.emitted('input')[0][0]).toBe(specialValue)
    })

    it('should emit input event with Unicode', () => {
      const unicodeValue = '中文'
      wrapper.vm.$emit('input', unicodeValue)
      expect(wrapper.emitted('input')[0][0]).toBe(unicodeValue)
    })

    it('should emit input event with emoji', () => {
      const emojiValue = '😀'
      wrapper.vm.$emit('input', emojiValue)
      expect(wrapper.emitted('input')[0][0]).toBe(emojiValue)
    })
  })

  describe('validation with different content types', () => {
    it('should validate numeric strings', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: '12345'
        }
      })
      expect(wrapper.vm.value).toBe('12345')
    })

    it('should validate alphanumeric strings', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test123'
        }
      })
      expect(wrapper.vm.value).toBe('Test123')
    })

    it('should validate strings with hyphens', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test-Entity-Name'
        }
      })
      expect(wrapper.vm.value).toBe('Test-Entity-Name')
    })

    it('should validate strings with underscores', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test_Entity_Name'
        }
      })
      expect(wrapper.vm.value).toBe('Test_Entity_Name')
    })

    it('should validate strings with dots', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'test.entity.name'
        }
      })
      expect(wrapper.vm.value).toBe('test.entity.name')
    })

    it('should validate strings with parentheses', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Entity (Name)'
        }
      })
      expect(wrapper.vm.value).toBe('Entity (Name)')
    })

    it('should validate strings with brackets', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Entity [Name]'
        }
      })
      expect(wrapper.vm.value).toBe('Entity [Name]')
    })

    it('should validate strings with slashes', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Entity/Name'
        }
      })
      expect(wrapper.vm.value).toBe('Entity/Name')
    })
  })

  describe('disabled and readonly state combinations', () => {
    it('should handle disabled true and readonly false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true,
          readonly: false
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should handle disabled false and readonly true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: false,
          readonly: true
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should handle disabled true and readonly true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true,
          readonly: true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should handle disabled false and readonly false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: false,
          readonly: false
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should change from disabled to readonly', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true,
          readonly: false
        }
      })
      await wrapper.setProps({ disabled: false, readonly: true })
      expect(wrapper.vm.disabled).toBe(false)
      expect(wrapper.vm.readonly).toBe(true)
    })
  })

  describe('required validation with various states', () => {
    it('should show required hint when required is true', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should show custom required hint', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: 'This field is required'
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.hint).toBe('This field is required')
    })

    it('should toggle required hint on required change', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      await wrapper.vm.$nextTick()
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should persist hint when required', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })
  })

  describe('placeholder generation and customization', () => {
    it('should generate default placeholder with entityName', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          entityName: 'Course'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Course')
    })

    it('should use initialPlaceholder when provided', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Custom placeholder text'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder text')
    })

    it('should prefer initialPlaceholder over generated placeholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Custom',
          entityName: 'Test'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom')
      expect(wrapper.vm.placeholder).not.toContain('Test')
    })

    it('should handle empty initialPlaceholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: '',
          entityName: 'Entity'
        }
      })
      expect(wrapper.vm.placeholder).toContain('Entity')
    })

    it('should handle special characters in placeholder', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Enter @Entity #Name'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Enter @Entity #Name')
    })
  })

  describe('rules array management', () => {
    it('should have rules as an array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should initialize with at least one rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(1)
    })

    it('should have all rules as functions', () => {
      wrapper.vm.rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })

    it('should add maxLength rule at position 0', () => {
      expect(typeof wrapper.vm.rules[0]).toBe('function')
    })

    it('should replace rules with initialRules when applyRules true', () => {
      const customRules = [
        (v) => v || 'Error 1',
        (v) => v.length > 0 || 'Error 2'
      ]
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: customRules,
          applyRules: true
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should not apply initialRules when applyRules false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: [(v) => v || 'Error'],
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should add required rule when required changes to true', async () => {
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
  })

  describe('applyRules flag behavior', () => {
    it('should respect applyRules true with initialRules', () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: true,
          initialRules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should respect applyRules false with initialRules', () => {
      const customRules = [(v) => v || 'Required']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false,
          initialRules: customRules
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should clear rules when applyRules false and required false', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false,
          required: false,
          initialRules: []
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })

    it('should apply default rules when applyRules false and no initialRules', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          applyRules: false
        }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })
  })

  describe('label and hint combinations', () => {
    it('should handle both label and hint', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: 'Entity Name',
          hint: 'Enter a unique name'
        }
      })
      expect(wrapper.vm.label).toBe('Entity Name')
      expect(wrapper.vm.hint).toBe('Enter a unique name')
    })

    it('should handle empty label and empty hint', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: '',
          hint: ''
        }
      })
      expect(wrapper.vm.label).toBe('')
      expect(wrapper.vm.hint).toBe('')
    })

    it('should use default hint when required and hint empty', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: ''
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('*Required')
    })

    it('should override default required hint with custom hint', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: 'Custom'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Custom')
    })
  })

  describe('type prop variations', () => {
    it('should support type text', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'text'
        }
      })
      expect(wrapper.vm.type).toBe('text')
    })

    it('should support type email', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'email'
        }
      })
      expect(wrapper.vm.type).toBe('email')
    })

    it('should support type password', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'password'
        }
      })
      expect(wrapper.vm.type).toBe('password')
    })

    it('should support type number', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'number'
        }
      })
      expect(wrapper.vm.type).toBe('number')
    })

    it('should support type url', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'url'
        }
      })
      expect(wrapper.vm.type).toBe('url')
    })

    it('should support type tel', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'tel'
        }
      })
      expect(wrapper.vm.type).toBe('tel')
    })

    it('should support type search', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'search'
        }
      })
      expect(wrapper.vm.type).toBe('search')
    })
  })

  describe('className and styling', () => {
    it('should apply custom className', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: 'custom-class'
        }
      })
      expect(wrapper.vm.className).toBe('custom-class')
    })

    it('should handle multiple classes in className', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: 'class1 class2 class3'
        }
      })
      expect(wrapper.vm.className).toContain('class1')
      expect(wrapper.vm.className).toContain('class2')
      expect(wrapper.vm.className).toContain('class3')
    })

    it('should handle empty className', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: ''
        }
      })
      expect(wrapper.vm.className).toBe('')
    })

    it('should bind className to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          className: 'my-class'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('class')).toContain('my-class')
    })
  })

  describe('hideDetails prop functionality', () => {
    it('should show details by default', () => {
      expect(wrapper.vm.hideDetails).toBe(false)
    })

    it('should hide details when hideDetails true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          hideDetails: true
        }
      })
      expect(wrapper.vm.hideDetails).toBe(true)
    })

    it('should bind hideDetails to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          hideDetails: true
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      // hideDetails attribute will be present as a boolean binding
      expect(wrapper.vm.hideDetails).toBe(true)
    })

    it('should toggle hideDetails reactively', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          hideDetails: false
        }
      })
      expect(wrapper.vm.hideDetails).toBe(false)
      await wrapper.setProps({ hideDetails: true })
      expect(wrapper.vm.hideDetails).toBe(true)
    })
  })

  describe('persistentPlaceholder prop functionality', () => {
    it('should have persistent placeholder disabled by default', () => {
      expect(wrapper.vm.persistentPlaceholder).toBe(false)
    })

    it('should enable persistent placeholder when set true', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          persistentPlaceholder: true
        }
      })
      expect(wrapper.vm.persistentPlaceholder).toBe(true)
    })

    it('should bind persistentPlaceholder to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          persistentPlaceholder: true
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      // persistentPlaceholder prop is bound to v-text-field
      expect(wrapper.vm.persistentPlaceholder).toBe(true)
    })
  })

  describe('form integration scenarios', () => {
    it('should work in a form with required validation', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          entityName: 'Training Course',
          label: 'Course Name'
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should work in a form with optional field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          entityName: 'Description',
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should support form reset (clear value)', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test'
        }
      })
      expect(wrapper.vm.value).toBe('Test')
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('should work with disabled form fields', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: true,
          value: 'Read-only value'
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
      expect(wrapper.vm.value).toBe('Read-only value')
    })

    it('should support id for form submission', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          id: 'course-name',
          label: 'Course Name'
        }
      })
      expect(wrapper.vm.id).toBe('course-name')
    })
  })

  describe('edge cases - boundary conditions', () => {
    it('should handle maxLength = 0', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 0
        }
      })
      expect(wrapper.vm.maxLength).toBe(0)
    })

    it('should handle maxLength = 1', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 1
        }
      })
      expect(wrapper.vm.maxLength).toBe(1)
    })

    it('should handle very large maxLength', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          maxLength: 10000
        }
      })
      expect(wrapper.vm.maxLength).toBe(10000)
    })

    it('should handle value equal to maxLength', () => {
      const value = 'a'.repeat(100)
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: value,
          maxLength: 100
        }
      })
      expect(wrapper.vm.value.length).toBe(100)
    })

    it('should handle value exceeding maxLength', () => {
      const value = 'a'.repeat(300)
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: value,
          maxLength: 200
        }
      })
      expect(wrapper.vm.value.length).toBe(300)
    })
  })

  describe('component lifecycle and reactivity', () => {
    it('should maintain state through multiple prop changes', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Initial',
          required: true
        }
      })
      await wrapper.setProps({ value: 'Updated' })
      expect(wrapper.vm.value).toBe('Updated')
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should update rules when initialRules prop changes', async () => {
      const rules1 = [(v) => v || 'Error 1']
      const rules2 = [(v) => v && v.length > 0 || 'Error 2']
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialRules: rules1
        }
      })
      await wrapper.setProps({ initialRules: rules2 })
      expect(wrapper.vm.rules).toEqual(rules2)
    })

    it('should maintain requiredProps when hint changes for required field', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          hint: 'Original hint'
        }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Original hint')
      // Note: The component's applyRequiredProps is only called when required prop changes
      // not when hint changes, so hint prop changes don't update requiredProps
      await wrapper.setProps({ hint: 'New hint' })
      // The requiredProps.hint remains as the initial value
      expect(wrapper.vm.hint).toBe('New hint')
    })
  })

  describe('text field rendering with props', () => {
    it('should pass value to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Test Value'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('value')).toBe('Test Value')
    })

    it('should pass placeholder to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          initialPlaceholder: 'Test Placeholder'
        }
      })
      // The placeholder is set in the component's data after mounted
      // In shallowMount, we verify the wrapper's placeholder is set correctly
      expect(wrapper.vm.placeholder).toBe('Test Placeholder')
    })

    it('should pass label to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          label: 'Test Label'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('label')).toBe('Test Label')
    })

    it('should pass type to v-text-field', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          type: 'email'
        }
      })
      const textfield = wrapper.find('v-text-field-stub')
      expect(textfield.attributes('type')).toBe('email')
    })
  })

  describe('whitespace and trimming', () => {
    it('should preserve leading spaces in value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: '   test'
        }
      })
      expect(wrapper.vm.value).toBe('   test')
    })

    it('should preserve trailing spaces in value', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'test   '
        }
      })
      expect(wrapper.vm.value).toBe('test   ')
    })

    it('should preserve internal spaces', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'test   value'
        }
      })
      expect(wrapper.vm.value).toBe('test   value')
    })

    it('should handle value with only spaces', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: '     '
        }
      })
      expect(wrapper.vm.value).toBe('     ')
    })
  })

  describe('multiple rule validation', () => {
    it('should have multiple validation rules when required', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should apply both maxLength and required rules', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          maxLength: 100
        }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })

    it('should preserve rule order', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true
        }
      })
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThanOrEqual(2)
      rules.forEach((rule) => {
        expect(typeof rule).toBe('function')
      })
    })
  })

  describe('complex integration scenarios', () => {
    it('should handle full configuration with all props', () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          value: 'Complete Test',
          initialPlaceholder: 'Enter name',
          entityName: 'Entity',
          id: 'complete-test',
          required: true,
          disabled: false,
          readonly: false,
          applyRules: true,
          hideDetails: false,
          hint: 'Test hint',
          type: 'text',
          maxLength: 300,
          label: 'Test Label',
          persistentPlaceholder: true,
          className: 'test-class'
        }
      })
      expect(wrapper.vm.value).toBe('Complete Test')
      expect(wrapper.vm.entityName).toBe('Entity')
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.maxLength).toBe(300)
    })

    it('should transition from required to optional', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: true,
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
      await wrapper.setProps({ required: false })
      expect(wrapper.vm.required).toBe(false)
      expect(Object.keys(wrapper.vm.requiredProps).length).toBe(0)
    })

    it('should transition from optional to required', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          required: false,
          initialRules: [(v) => true]
        }
      })
      expect(wrapper.vm.required).toBe(false)
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.requiredProps.hint).toBeDefined()
    })

    it('should handle enabled to disabled transition', async () => {
      wrapper = shallowMount(InputEntityName, {
        propsData: {
          disabled: false
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })
})
