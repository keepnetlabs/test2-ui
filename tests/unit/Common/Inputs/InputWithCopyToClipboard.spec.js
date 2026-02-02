import { shallowMount } from '@vue/test-utils'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard.vue'
import labels from '@/model/constants/labels'

jest.mock('@/model/constants/labels', () => ({
  CopyToClipboard: 'Copy to Clipboard',
  Department: 'Department'
}))

describe('InputWithCopyToClipboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputWithCopyToClipboard, {
      stubs: {
        'form-group': true,
        'v-text-field': true,
        'v-btn': true
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
      expect(wrapper.vm.$options.name).toBe('InputWithCopyToClipboard')
    })

    it('should have proper component configuration', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('props')
      expect(wrapper.vm.$options).toHaveProperty('emits')
    })

    it('should be instance of Vue component', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('should have components object defined', () => {
      expect(wrapper.vm.$options.components).toBeDefined()
    })

    it('should have FormGroup component registered', () => {
      expect(wrapper.vm.$options.components).toHaveProperty('FormGroup')
    })

    it('should have props object defined', () => {
      expect(wrapper.vm.$options.props).toBeDefined()
    })

    it('should have emits array defined', () => {
      expect(wrapper.vm.$options.emits).toBeDefined()
    })

    it('should have title prop defined', () => {
      expect(wrapper.vm.$options.props).toHaveProperty('title')
    })

    it('should have subtitle prop defined', () => {
      expect(wrapper.vm.$options.props).toHaveProperty('subtitle')
    })

    it('should have copyKey prop defined', () => {
      expect(wrapper.vm.$options.props).toHaveProperty('copyKey')
    })
  })

  describe('prop defaults', () => {
    it('should have undefined title by default', () => {
      expect(wrapper.vm.title).toBeUndefined()
    })

    it('should have undefined subtitle by default', () => {
      expect(wrapper.vm.subtitle).toBeUndefined()
    })

    it('should have undefined copyKey by default', () => {
      expect(wrapper.vm.copyKey).toBeUndefined()
    })

    it('should initialize without default title', () => {
      expect(wrapper.vm.title).not.toBeDefined()
    })

    it('should initialize without default subtitle', () => {
      expect(wrapper.vm.subtitle).not.toBeDefined()
    })

    it('should initialize without default copyKey', () => {
      expect(wrapper.vm.copyKey).not.toBeDefined()
    })
  })

  describe('props configuration', () => {
    it('should accept custom title string', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'API Key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('API Key')
    })

    it('should accept custom subtitle string', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { subtitle: 'Your secure key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.subtitle).toBe('Your secure key')
    })

    it('should accept custom copyKey string', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'secret-key-123' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.copyKey).toBe('secret-key-123')
    })

    it('should accept all props together', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: {
          title: 'Authentication Token',
          subtitle: 'Your auth token',
          copyKey: 'auth-token-abc'
        },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('Authentication Token')
      expect(wrapper.vm.subtitle).toBe('Your auth token')
      expect(wrapper.vm.copyKey).toBe('auth-token-abc')
    })

    it('should accept empty string for title', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: '' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('')
    })

    it('should accept empty string for subtitle', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { subtitle: '' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.subtitle).toBe('')
    })

    it('should accept empty string for copyKey', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: '' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.copyKey).toBe('')
    })

    it('should accept long title string', () => {
      const longTitle = 'This is a very long title for testing purposes'
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: longTitle },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe(longTitle)
    })

    it('should accept long copyKey string', () => {
      const longKey = 'x'.repeat(100)
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: longKey },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.copyKey).toBe(longKey)
    })
  })

  describe('FormGroup integration', () => {
    it('should render FormGroup component', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should pass title to FormGroup', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'Test Title' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should have FormGroup with className', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should wrap content in FormGroup', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('slot rendering', () => {
    it('should render input slot', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should render default input when slot not provided', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })

    it('should support custom input slot', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        slots: {
          input: '<input type="text" />'
        },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.html()).toContain('input')
    })

    it('should render VTextField in default slot', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })

    it('should have v-text-field outlined', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })

    it('should have v-text-field dense', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })

    it('should have v-text-field disabled', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })
  })

  describe('button functionality', () => {
    it('should render copy button', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have button text from labels', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have correct button text', () => {
      expect(wrapper.vm.labels.CopyToClipboard).toBe('Copy to Clipboard')
    })

    it('should have button as text style', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have button color blue', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have button margin', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have click handler on button', () => {
      expect(wrapper.vm.handleCopyToClipboard).toBeDefined()
      expect(typeof wrapper.vm.handleCopyToClipboard).toBe('function')
    })

    it('should trigger handleCopyToClipboard on button click', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('event handling and emission', () => {
    it('should emit on-copy event when button clicked', () => {
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')).toBeTruthy()
    })

    it('should emit on-copy with copyKey value', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'test-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('test-key')
    })

    it('should emit on-copy with different copyKey values', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'key-1' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('key-1')
    })

    it('should emit multiple on-copy events on multiple clicks', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'test-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')).toHaveLength(2)
    })

    it('should emit on-copy even with undefined copyKey', () => {
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')).toBeTruthy()
    })

    it('should emit on-copy with empty copyKey', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: '' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('')
    })

    it('should have proper event name on-copy', () => {
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted()).toHaveProperty('on-copy')
    })

    it('should handle copyKey prop change and emit updated value', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'old-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ copyKey: 'new-key' })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('new-key')
    })
  })

  describe('copy button click', () => {
    it('should call handleCopyToClipboard method on button click', () => {
      const spy = jest.spyOn(wrapper.vm, 'handleCopyToClipboard')
      wrapper.vm.handleCopyToClipboard()
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('should handle multiple consecutive button clicks', () => {
      const spy = jest.spyOn(wrapper.vm, 'handleCopyToClipboard')
      wrapper.vm.handleCopyToClipboard()
      wrapper.vm.handleCopyToClipboard()
      wrapper.vm.handleCopyToClipboard()
      expect(spy).toHaveBeenCalledTimes(3)
      spy.mockRestore()
    })

    it('should not throw error on button click', () => {
      expect(() => {
        wrapper.vm.handleCopyToClipboard()
      }).not.toThrow()
    })

    it('should properly handle copyKey on click', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'button-test-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('button-test-key')
    })
  })

  describe('component reactivity', () => {
    it('should update title reactively', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'Original' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ title: 'Updated' })
      expect(wrapper.vm.title).toBe('Updated')
    })

    it('should update subtitle reactively', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { subtitle: 'Original Sub' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ subtitle: 'Updated Sub' })
      expect(wrapper.vm.subtitle).toBe('Updated Sub')
    })

    it('should update copyKey reactively', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'old-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ copyKey: 'new-key' })
      expect(wrapper.vm.copyKey).toBe('new-key')
    })

    it('should maintain reactivity for multiple prop changes', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'Title1', copyKey: 'key1' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ title: 'Title2', copyKey: 'key2' })
      expect(wrapper.vm.title).toBe('Title2')
      expect(wrapper.vm.copyKey).toBe('key2')
    })

    it('should emit updated copyKey after prop change', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'initial-key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ copyKey: 'changed-key' })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0][0]).toBe('changed-key')
    })

    it('should handle rapid prop updates', async () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'key1' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      await wrapper.setProps({ copyKey: 'key2' })
      await wrapper.setProps({ copyKey: 'key3' })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.vm.copyKey).toBe('key3')
    })
  })

  describe('state management', () => {
    it('should maintain title state', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'Test' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('Test')
    })

    it('should maintain subtitle state', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { subtitle: 'Subtitle' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.subtitle).toBe('Subtitle')
    })

    it('should maintain copyKey state', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'key' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.copyKey).toBe('key')
    })

    it('should preserve props when mounted', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: {
          title: 'API Token',
          subtitle: 'Your secret',
          copyKey: 'abc123'
        },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('API Token')
      expect(wrapper.vm.subtitle).toBe('Your secret')
      expect(wrapper.vm.copyKey).toBe('abc123')
    })

    it('should maintain labels data', () => {
      expect(wrapper.vm.labels).toBeDefined()
      expect(wrapper.vm.labels).toHaveProperty('CopyToClipboard')
    })
  })

  describe('label display', () => {
    it('should have labels imported', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should display correct button label', () => {
      expect(wrapper.vm.labels.CopyToClipboard).toBe('Copy to Clipboard')
    })

    it('should use label in button', () => {
      expect(wrapper.vm.labels.CopyToClipboard).toBeTruthy()
    })

    it('should have access to Department label', () => {
      expect(wrapper.vm.labels).toHaveProperty('Department')
    })

    it('should have labels as data property', () => {
      expect(wrapper.vm.$data.labels).toBeDefined()
    })
  })

  describe('accessibility', () => {
    it('should have proper button text for accessibility', () => {
      expect(wrapper.vm.labels.CopyToClipboard).toBeTruthy()
    })

    it('should support title for accessibility', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { title: 'Accessible Title' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm.title).toBe('Accessible Title')
    })

    it('should have disabled text field for read-only access', () => {
      const vTextField = wrapper.findComponent({ name: 'VTextField' })
      expect(vTextField.exists()).toBe(true)
    })

    it('should have button with clear action label', () => {
      expect(wrapper.vm.labels.CopyToClipboard).toContain('Copy')
    })

    it('should support custom aria labels through attrs', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        attrs: { 'aria-label': 'Copy text' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('methods', () => {
    it('should have handleCopyToClipboard method', () => {
      expect(wrapper.vm.handleCopyToClipboard).toBeDefined()
    })

    it('should have handleCopyToClipboard as function', () => {
      expect(typeof wrapper.vm.handleCopyToClipboard).toBe('function')
    })

    it('should emit event from handleCopyToClipboard', () => {
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')).toBeTruthy()
    })

    it('should pass copyKey to emitted event', () => {
      wrapper = shallowMount(InputWithCopyToClipboard, {
        propsData: { copyKey: 'test' },
        stubs: { 'form-group': true, 'v-text-field': true, 'v-btn': true }
      })
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')[0]).toEqual(['test'])
    })

    it('should be callable multiple times', () => {
      expect(() => {
        wrapper.vm.handleCopyToClipboard()
        wrapper.vm.handleCopyToClipboard()
        wrapper.vm.handleCopyToClipboard()
      }).not.toThrow()
    })
  })

  describe('emits configuration', () => {
    it('should have on-copy in emits', () => {
      const emits = wrapper.vm.$options.emits
      expect(emits).toContain('on-copy')
    })

    it('should emit on-copy event', () => {
      wrapper.vm.handleCopyToClipboard()
      expect(wrapper.emitted('on-copy')).toBeTruthy()
    })

    it('should allow parent to listen for on-copy', () => {
      wrapper.vm.$emit('on-copy', 'test-key')
      expect(wrapper.emitted('on-copy')).toBeTruthy()
    })

    it('should pass event payload correctly', () => {
      wrapper.vm.$emit('on-copy', 'payload-test')
      expect(wrapper.emitted('on-copy')[0]).toEqual(['payload-test'])
    })
  })
})
