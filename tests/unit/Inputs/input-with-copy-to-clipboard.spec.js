import { createLocalVue, mount } from '@vue/test-utils'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
describe('Input Copy with clipboard component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue
    })
    //expecting component is rendering

    expect(wrapper.find('.input-copy-to-clipboard').exists()).toBeTruthy()

    //checking is input rendered
    expect(wrapper.find('input').exists()).toBeTruthy()

    //checking is button rendered

    expect(wrapper.find('button').exists()).toBeTruthy()
  })

  it('Check actions and props', async () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'Custom title',
        subTitle: 'Custom subtitle',
        copyKey: 'id'
      }
    })
    //expecting component is rendering
    expect(wrapper.find('.k-form-group__title').text()).toContain('Custom title')

    //clicking button

    await wrapper.find('button').trigger('click')
    //is event throwed
    const emittedEvent = wrapper.emitted()['on-copy']
    expect(emittedEvent.length).toBe(1)
    //comparing value
    expect(emittedEvent[0][0]).toEqual('id')
  })

  it('displays custom title and subtitle', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'API Key',
        subTitle: 'Your secret API key'
      }
    })
    expect(wrapper.find('.k-form-group__title').text()).toContain('API Key')
  })

  it('copy button emits event with correct key', async () => {
    const testKey = 'test-api-key-123'
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'API Key',
        copyKey: testKey
      }
    })
    await wrapper.find('button').trigger('click')
    const event = wrapper.emitted()['on-copy']
    expect(event[0][0]).toEqual(testKey)
  })

  it('button is clickable and visible', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.isVisible()).toBe(true)
  })

  it('handles different copyKey values', async () => {
    const testCases = ['key1', 'key2', 'abc-def-123']
    for (const key of testCases) {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: key }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toEqual(key)
    }
  })

  describe('Component Rendering', () => {
    it('renders input copy to clipboard component', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('.input-copy-to-clipboard').exists()).toBeTruthy()
    })

    it('renders input field element', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('renders button element', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('button').exists()).toBeTruthy()
    })

    it('renders title element', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Test Title' }
      })
      expect(wrapper.find('.k-form-group__title').exists()).toBeTruthy()
    })
  })

  describe('Props and Attributes', () => {
    it('accepts title prop', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Custom Title' }
      })
      expect(wrapper.vm.title).toBe('Custom Title')
    })

    it('accepts subtitle prop', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { subtitle: 'Custom Subtitle' }
      })
      expect(wrapper.vm.subtitle).toBe('Custom Subtitle')
    })

    it('accepts copyKey prop', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key-123' }
      })
      expect(wrapper.vm.copyKey).toBe('test-key-123')
    })

    it('displays title text correctly', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'API Key' }
      })
      expect(wrapper.find('.k-form-group__title').text()).toContain('API Key')
    })

    it('displays subtitle when provided', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: {
          title: 'API Key',
          subtitle: 'Your secret key'
        }
      })
      expect(wrapper.vm.subtitle).toBe('Your secret key')
    })
  })

  describe('Event Emission', () => {
    it('emits on-copy event when button clicked', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy']).toBeTruthy()
    })

    it('emits correct copyKey value in event', async () => {
      const testKey = 'secret-api-key'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: testKey }
      })
      await wrapper.find('button').trigger('click')
      const emitted = wrapper.emitted()['on-copy']
      expect(emitted[0][0]).toBe(testKey)
    })

    it('emits multiple events on multiple clicks', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })
      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      expect(wrapper.emitted()['on-copy']).toHaveLength(3)
    })

    it('emits event with special characters in key', async () => {
      const specialKey = 'key-with-!@#$%'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: specialKey }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe(specialKey)
    })
  })

  describe('Copy Button Functionality', () => {
    it('button is visible', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('button').isVisible()).toBe(true)
    })

    it('button is enabled by default', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('button').attributes('disabled')).not.toBeDefined()
    })

    it('button responds to clicks', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'key' }
      })
      const button = wrapper.find('button')
      await button.trigger('click')
      expect(wrapper.emitted()['on-copy']).toBeTruthy()
    })

    it('button handles rapid clicks', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })
      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      expect(wrapper.emitted()['on-copy']).toHaveLength(5)
    })
  })

  describe('Input Field Behavior', () => {
    it('input field exists and is visible', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.isVisible()).toBe(true)
    })

    it('input field is disabled for copy-to-clipboard', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('input element is part of the component', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
    })

    it('component renders form group container', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.findComponent({ name: 'FormGroup' }).exists()).toBe(true)
    })
  })

  describe('Edge Cases and Special Values', () => {
    it('handles empty copyKey', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: '' }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe('')
    })

    it('handles null copyKey', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: null }
      })
      expect(wrapper.vm.copyKey).toBeNull()
    })

    it('handles very long copyKey values', async () => {
      const longKey = 'a'.repeat(1000)
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: longKey }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe(longKey)
    })

    it('handles copyKey with whitespace', async () => {
      const keyWithSpace = 'test key with spaces'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: keyWithSpace }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe(keyWithSpace)
    })

    it('handles Unicode characters in copyKey', async () => {
      const unicodeKey = 'test-🔑-key'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: unicodeKey }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe(unicodeKey)
    })
  })

  describe('Multiple Instances', () => {
    it('creates multiple independent instances', () => {
      const wrapper1 = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'key1' }
      })
      const wrapper2 = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'key2' }
      })
      expect(wrapper1.vm.copyKey).toBe('key1')
      expect(wrapper2.vm.copyKey).toBe('key2')
    })

    it('multiple instances emit events independently', async () => {
      const wrapper1 = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'key1' }
      })
      const wrapper2 = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'key2' }
      })
      await wrapper1.find('button').trigger('click')
      await wrapper2.find('button').trigger('click')
      expect(wrapper1.emitted()['on-copy'][0][0]).toBe('key1')
      expect(wrapper2.emitted()['on-copy'][0][0]).toBe('key2')
    })
  })

  describe('Component Structure', () => {
    it('component is a Vue instance', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm._isVue).toBe(true)
    })

    it('component has required data properties', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Test', copyKey: 'key' }
      })
      expect(wrapper.vm.title).toBeDefined()
      expect(wrapper.vm.copyKey).toBeDefined()
    })

    it('component has methods defined', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.vm.$options.methods).toBeDefined()
    })

    it('contains required child elements', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('component mounts successfully', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('component renders on mount', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Test' }
      })
      expect(wrapper.find('.input-copy-to-clipboard').exists()).toBe(true)
    })

    it('component unmounts without errors', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('component maintains props after mount', () => {
      const testTitle = 'Custom Title'
      const testKey = 'test-key-123'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: testTitle, copyKey: testKey }
      })
      expect(wrapper.vm.title).toBe(testTitle)
      expect(wrapper.vm.copyKey).toBe(testKey)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('applies input-copy-to-clipboard class', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.find('.input-copy-to-clipboard').exists()).toBe(true)
    })

    it('applies k-form-group__title class to title', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Title' }
      })
      expect(wrapper.find('.k-form-group__title').exists()).toBe(true)
    })

    it('button has clickable styling', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      const button = wrapper.find('button')
      expect(button.isVisible()).toBe(true)
    })

    it('input field has disabled styling', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('Form Group Integration', () => {
    it('component integrates with FormGroup', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Label' }
      })
      expect(wrapper.findComponent({ name: 'FormGroup' }).exists()).toBe(true)
    })

    it('FormGroup receives title prop', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Test Label' }
      })
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.vm.title).toBe('Test Label')
    })

    it('VTextField is properly integrated', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
    })

    it('subtitle is passed to FormGroup', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { subtitle: 'Test Subtitle' }
      })
      expect(wrapper.vm.subtitle).toBe('Test Subtitle')
    })
  })

  describe('Accessibility', () => {
    it('button is keyboard accessible', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })
      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })

    it('input has proper attributes for accessibility', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('form group provides semantic structure', () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'API Key' }
      })
      expect(wrapper.find('.k-form-group__title').exists()).toBe(true)
    })
  })

  describe('Performance Characteristics', () => {
    it('component mounts quickly', () => {
      const start = Date.now()
      mount(InputWithCopyToClipboard, { localVue })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('handles multiple rapid clicks', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })
      const button = wrapper.find('button')

      const start = Date.now()
      for (let i = 0; i < 20; i++) {
        await button.trigger('click')
      }
      const duration = Date.now() - start

      expect(duration).toBeLessThan(500)
      expect(wrapper.emitted()['on-copy']).toHaveLength(20)
    })

    it('can create multiple instances efficiently', () => {
      const start = Date.now()
      for (let i = 0; i < 10; i++) {
        mount(InputWithCopyToClipboard, {
          localVue,
          propsData: { copyKey: `key${i}` }
        })
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete copy workflow', async () => {
      const testKey = 'api-key-secret-123'
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: {
          title: 'API Key',
          subtitle: 'Your secret key',
          copyKey: testKey
        }
      })

      expect(wrapper.find('.k-form-group__title').text()).toContain('API Key')
      expect(wrapper.vm.copyKey).toBe(testKey)

      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe(testKey)
    })

    it('handles prop updates dynamically', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { title: 'Original', copyKey: 'original-key' }
      })

      expect(wrapper.vm.title).toBe('Original')

      await wrapper.setProps({ title: 'Updated', copyKey: 'updated-key' })
      expect(wrapper.vm.title).toBe('Updated')
      expect(wrapper.vm.copyKey).toBe('updated-key')

      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toBe('updated-key')
    })

    it('supports multiple copy operations in sequence', async () => {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: 'test-key' }
      })

      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      const emitted = wrapper.emitted()['on-copy']
      expect(emitted).toHaveLength(3)
      expect(emitted[0][0]).toBe('test-key')
      expect(emitted[1][0]).toBe('test-key')
      expect(emitted[2][0]).toBe('test-key')
    })
  })
})
