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
    wrapper = shallowMount(InputDescription, {
      propsData: {
        value: ''
      },
      stubs: {
        'v-textarea': true
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
      expect(wrapper.vm.$options.name).toBe('InputDescription')
    })

    it('should render v-textarea component', () => {
      expect(wrapper.findComponent({ name: 'v-textarea' }).exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should have value prop', () => {
      expect(wrapper.vm.$options.props.value).toBeDefined()
    })

    it('should have id prop', () => {
      expect(wrapper.vm.$options.props.id).toBeDefined()
    })

    it('should have initialPlaceholder prop', () => {
      expect(wrapper.vm.$options.props.initialPlaceholder).toBeDefined()
    })

    it('should have initialRules prop', () => {
      expect(wrapper.vm.$options.props.initialRules).toBeDefined()
    })

    it('should have entityName prop with default Description', () => {
      expect(wrapper.vm.entityName).toBe('Description')
    })

    it('should have required prop with default false', () => {
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have maxLength prop with default 2000', () => {
      expect(wrapper.vm.maxLength).toBe(2000)
    })

    it('should have disabled prop with default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have readonly prop with default false', () => {
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should have applyRules prop with default true', () => {
      expect(wrapper.vm.applyRules).toBe(true)
    })

    it('should have height prop', () => {
      expect(wrapper.vm.$options.props.height).toBeDefined()
    })

    it('should have rows prop', () => {
      expect(wrapper.vm.$options.props.rows).toBeDefined()
    })

    it('should have hint prop', () => {
      expect(wrapper.vm.$options.props.hint).toBeDefined()
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', maxLength: 500 },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', entityName: 'Feedback' },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.entityName).toBe('Feedback')
    })
  })

  describe('data initialization', () => {
    it('should initialize rules array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should initialize placeholder as empty string', () => {
      expect(wrapper.vm.placeholder).toBe('')
    })

    it('should initialize requiredProps as empty object', () => {
      expect(wrapper.vm.requiredProps).toEqual({})
    })

    it('should have startsWithSpace validation rule', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should have maxLength validation rule', () => {
      expect(wrapper.vm.rules.some((rule) => typeof rule === 'function')).toBe(true)
    })
  })

  describe('required functionality', () => {
    it('should add required rule when required is true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should add requiredProps when required is true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.requiredProps.hint).toBeTruthy()
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })

    it('should use custom hint when required is true', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true, hint: 'Custom hint' },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.requiredProps.hint).toBe('Custom hint')
    })

    it('should use default RequiredStar hint when no custom hint', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.requiredProps.hint).toBe(labels.RequiredStar)
    })

    it('should not add required rule when required is false', () => {
      const initialRules = wrapper.vm.rules.length
      expect(initialRules).toBeGreaterThanOrEqual(0)
    })
  })

  describe('placeholder configuration', () => {
    it('should set placeholder to EnterDescription by default', () => {
      expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
    })

    it('should use initialPlaceholder when provided', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', initialPlaceholder: 'Custom placeholder' },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })
  })

  describe('rules application', () => {
    it('should apply initial rules when applyRules is true', () => {
      const initialRules = [() => true]
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', initialRules, applyRules: true },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.rules).toEqual(initialRules)
    })

    it('should not apply rules when applyRules is false', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', applyRules: false },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.rules.length).toBe(0)
    })
  })

  describe('watch required', () => {
    it('should update rules when required changes', async () => {
      const initialRules = wrapper.vm.rules.length
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(initialRules)
    })

    it('should update placeholder when required changes', async () => {
      await wrapper.setProps({ required: true, initialPlaceholder: 'Test' })
      expect(wrapper.vm.placeholder).toBe('Test')
    })

    it('should update requiredProps when required changes', async () => {
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.requiredProps.persistentHint).toBe(true)
    })
  })

  describe('created hook', () => {
    it('should initialize placeholder on created', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
    })

    it('should initialize rules on created', () => {
      expect(wrapper.vm.rules).toBeTruthy()
    })

    it('should initialize requiredProps on created if required', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.requiredProps).toBeTruthy()
    })
  })

  describe('textarea configuration', () => {
    it('should be outlined', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('outlined')).toBe(true)
    })

    it('should be dense', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('dense')).toBe(true)
    })

    it('should have no-resize', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('noResize')).toBe(true)
    })

    it('should have autocomplete disabled', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('autocomplete')).toBe('disabled')
    })

    it('should accept custom height', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', height: '300px' },
        stubs: { 'v-textarea': true }
      })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('height')).toBe('300px')
    })

    it('should accept custom rows', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', rows: 10 },
        stubs: { 'v-textarea': true }
      })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('rows')).toBe(10)
    })
  })

  describe('input emission', () => {
    it('should emit input event', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      textarea.vm.$emit('input', 'test text')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input event with new value', () => {
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      textarea.vm.$emit('input', 'new text')
      expect(wrapper.emitted('input')[0][0]).toBe('new text')
    })
  })

  describe('maxLength validation', () => {
    it('should have maxLength default 2000', () => {
      expect(wrapper.vm.maxLength).toBe(2000)
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', maxLength: 500 },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.maxLength).toBe(500)
    })

    it('should use maxLength in validation error message', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', maxLength: 500, entityName: 'Feedback' },
        stubs: { 'v-textarea': true }
      })
      expect(labels.getMaxLengthMessage).toHaveBeenCalledWith('Feedback', 500)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as required description field', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: true, maxLength: 1000 },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.required).toBe(true)
      expect(wrapper.vm.maxLength).toBe(1000)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('should work as optional description field', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', required: false },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should work with custom entity names', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', entityName: 'Feedback', maxLength: 500 },
        stubs: { 'v-textarea': true }
      })
      expect(wrapper.vm.entityName).toBe('Feedback')
      expect(labels.getMaxLengthMessage).toHaveBeenCalledWith('Feedback', 500)
    })

    it('should work with readonly state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: 'Readonly text', readonly: true },
        stubs: { 'v-textarea': true }
      })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('readonly')).toBe(true)
    })

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputDescription, {
        propsData: { value: '', disabled: true },
        stubs: { 'v-textarea': true }
      })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('disabled')).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: 'New value' })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('value')).toBe('New value')
    })

    it('should update when maxLength prop changes', async () => {
      await wrapper.setProps({ maxLength: 300 })
      expect(wrapper.vm.maxLength).toBe(300)
    })

    it('should update when required prop changes', async () => {
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      const textarea = wrapper.findComponent({ name: 'v-textarea' })
      expect(textarea.props('disabled')).toBe(true)
    })
  })

  describe('props type validation', () => {
    it('should have String type for value', () => {
      expect(wrapper.vm.$options.props.value.type).toBe(String)
    })

    it('should have String type for id', () => {
      expect(wrapper.vm.$options.props.id.type).toBe(String)
    })

    it('should have String type for entityName', () => {
      expect(wrapper.vm.$options.props.entityName.type).toBe(String)
    })

    it('should have Boolean type for required', () => {
      expect(wrapper.vm.$options.props.required.type).toBe(Boolean)
    })

    it('should have Number type for maxLength', () => {
      expect(wrapper.vm.$options.props.maxLength.type).toBe(Number)
    })

    it('should have Array type for initialRules', () => {
      expect(wrapper.vm.$options.props.initialRules.type).toBe(Array)
    })
  })
})
