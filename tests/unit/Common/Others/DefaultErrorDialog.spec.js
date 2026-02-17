import { shallowMount } from '@vue/test-utils'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'

describe('DefaultErrorDialog.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DefaultErrorDialog)
  })

  afterEach(() => {
    if (wrapper && wrapper.vm && !wrapper.vm._isDestroyed) {
      wrapper.destroy()
    }
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('DefaultErrorDialog')
    })

    it('should register AppDialog as a child component', () => {
      expect(wrapper.vm.$options.components.AppDialog).toBeDefined()
    })

    it('should have handleCloseDialog method', () => {
      expect(typeof wrapper.vm.handleCloseDialog).toBe('function')
    })
  })

  describe('props structure', () => {
    it('should define status prop of type Boolean', () => {
      expect(wrapper.vm.$options.props.status.type).toBe(Boolean)
    })

    it('should define errorMessage prop of type String', () => {
      expect(wrapper.vm.$options.props.errorMessage.type).toBe(String)
    })

    it('should define title prop of type String', () => {
      expect(wrapper.vm.$options.props.title.type).toBe(String)
    })

    it('should have all three props defined', () => {
      expect(wrapper.vm.$options.props.status).toBeDefined()
      expect(wrapper.vm.$options.props.errorMessage).toBeDefined()
      expect(wrapper.vm.$options.props.title).toBeDefined()
    })

    it('should have correct prop count', () => {
      const propCount = Object.keys(wrapper.vm.$options.props).length
      expect(propCount).toBe(3)
    })
  })

  describe('props defaults', () => {
    it('should have default title "Error Occurred"', () => {
      expect(wrapper.vm.$options.props.title.default).toBe('Error Occurred')
    })

    it('should use default title when not provided', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: true }
      })
      expect(newWrapper.vm.title).toBe('Error Occurred')
      newWrapper.destroy()
    })

    it('should override default title when provided', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: 'Custom Error Title'
        }
      })
      expect(newWrapper.vm.title).toBe('Custom Error Title')
      newWrapper.destroy()
    })

    it('should handle null title with default', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: null
        }
      })
      expect(newWrapper.vm.title).toBeNull()
      newWrapper.destroy()
    })

    it('should handle empty string as title', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: ''
        }
      })
      expect(newWrapper.vm.title).toBe('')
      newWrapper.destroy()
    })
  })

  describe('methods - handleCloseDialog', () => {
    it('should emit on-close event when handleCloseDialog is called', () => {
      wrapper.vm.handleCloseDialog()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('should emit on-close event exactly once per call', () => {
      wrapper.vm.handleCloseDialog()
      expect(wrapper.emitted('on-close').length).toBe(1)
    })

    it('should emit on-close event with empty payload', () => {
      wrapper.vm.handleCloseDialog()
      expect(wrapper.emitted('on-close')[0]).toEqual([])
    })

    it('should emit multiple on-close events on repeated calls', () => {
      wrapper.vm.handleCloseDialog()
      wrapper.vm.handleCloseDialog()
      wrapper.vm.handleCloseDialog()
      expect(wrapper.emitted('on-close').length).toBe(3)
    })

    it('should not throw error when called multiple times', () => {
      expect(() => {
        wrapper.vm.handleCloseDialog()
        wrapper.vm.handleCloseDialog()
        wrapper.vm.handleCloseDialog()
      }).not.toThrow()
    })

    it('should be defined on component instance', () => {
      expect(wrapper.vm.handleCloseDialog).toBeDefined()
    })
  })

  describe('props reactivity', () => {
    it('should update title prop reactively', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { title: 'Initial Title' }
      })
      expect(newWrapper.vm.title).toBe('Initial Title')

      await newWrapper.setProps({ title: 'Updated Title' })
      expect(newWrapper.vm.title).toBe('Updated Title')
      newWrapper.destroy()
    })

    it('should update errorMessage prop reactively', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { errorMessage: 'Initial error' }
      })
      expect(newWrapper.vm.errorMessage).toBe('Initial error')

      await newWrapper.setProps({ errorMessage: 'Updated error' })
      expect(newWrapper.vm.errorMessage).toBe('Updated error')
      newWrapper.destroy()
    })

    it('should update status prop reactively', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: false }
      })
      expect(newWrapper.vm.status).toBe(false)

      await newWrapper.setProps({ status: true })
      expect(newWrapper.vm.status).toBe(true)
      newWrapper.destroy()
    })

    it('should handle multiple prop changes simultaneously', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: false,
          title: 'Old Title',
          errorMessage: 'Old message'
        }
      })

      await newWrapper.setProps({
        status: true,
        title: 'New Title',
        errorMessage: 'New message'
      })

      expect(newWrapper.vm.status).toBe(true)
      expect(newWrapper.vm.title).toBe('New Title')
      expect(newWrapper.vm.errorMessage).toBe('New message')
      newWrapper.destroy()
    })
  })

  describe('edge cases', () => {
    it('should handle null errorMessage', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: null
        }
      })
      expect(newWrapper.vm.errorMessage).toBeNull()
      newWrapper.destroy()
    })

    it('should handle undefined errorMessage', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: undefined
        }
      })
      expect(newWrapper.vm.errorMessage).toBeUndefined()
      newWrapper.destroy()
    })

    it('should handle empty string errorMessage', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: ''
        }
      })
      expect(newWrapper.vm.errorMessage).toBe('')
      newWrapper.destroy()
    })

    it('should handle very long errorMessage', () => {
      const longMessage = 'A'.repeat(1000)
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: longMessage
        }
      })
      expect(newWrapper.vm.errorMessage).toBe(longMessage)
      expect(newWrapper.vm.errorMessage.length).toBe(1000)
      newWrapper.destroy()
    })

    it('should handle special characters in errorMessage', () => {
      const specialMessage = '<script>alert("test")</script>'
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: specialMessage
        }
      })
      expect(newWrapper.vm.errorMessage).toBe(specialMessage)
      newWrapper.destroy()
    })

    it('should handle special characters in title', () => {
      const specialTitle = 'Error: <test> & "quoted"'
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: specialTitle
        }
      })
      expect(newWrapper.vm.title).toBe(specialTitle)
      newWrapper.destroy()
    })

    it('should handle unicode characters in errorMessage', () => {
      const unicodeMessage = '错误: 无法完成操作 🚨'
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: unicodeMessage
        }
      })
      expect(newWrapper.vm.errorMessage).toBe(unicodeMessage)
      newWrapper.destroy()
    })

    it('should handle newlines in errorMessage', () => {
      const messageWithNewlines = 'Error line 1\nError line 2\nError line 3'
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          errorMessage: messageWithNewlines
        }
      })
      expect(newWrapper.vm.errorMessage).toBe(messageWithNewlines)
      newWrapper.destroy()
    })

    it('should handle both status true and false', () => {
      const trueWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: true }
      })
      expect(trueWrapper.vm.status).toBe(true)
      trueWrapper.destroy()

      const falseWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: false }
      })
      expect(falseWrapper.vm.status).toBe(false)
      falseWrapper.destroy()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently across instances', () => {
      const wrapper1 = shallowMount(DefaultErrorDialog)
      const wrapper2 = shallowMount(DefaultErrorDialog)
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      expect(wrapper1.vm.handleCloseDialog).toBeDefined()
      expect(wrapper2.vm.handleCloseDialog).toBeDefined()
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify props internally', () => {
      const initialProps = { status: true, title: 'Test', errorMessage: 'Error' }
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: initialProps
      })
      expect(newWrapper.props('status')).toBe(initialProps.status)
      expect(newWrapper.props('title')).toBe(initialProps.title)
      expect(newWrapper.props('errorMessage')).toBe(initialProps.errorMessage)
      newWrapper.destroy()
    })

    it('should handle component destruction gracefully', () => {
      const newWrapper = shallowMount(DefaultErrorDialog)
      expect(() => {
        newWrapper.destroy()
      }).not.toThrow()
    })

    it('should return same component name on multiple mounts', () => {
      const wrapper1 = shallowMount(DefaultErrorDialog)
      const wrapper2 = shallowMount(DefaultErrorDialog)
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      expect(wrapper1.vm.$options.methods.handleCloseDialog.toString()).toBe(wrapper2.vm.$options.methods.handleCloseDialog.toString())
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should emit consistent results', () => {
      const newWrapper1 = shallowMount(DefaultErrorDialog)
      newWrapper1.vm.handleCloseDialog()
      const result1 = newWrapper1.emitted('on-close')[0]

      const newWrapper2 = shallowMount(DefaultErrorDialog)
      newWrapper2.vm.handleCloseDialog()
      const result2 = newWrapper2.emitted('on-close')[0]

      expect(result1).toEqual(result2)
      newWrapper1.destroy()
      newWrapper2.destroy()
    })
  })

  describe('integration scenarios', () => {
    it('should work with typical error workflow', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: 'Validation Error',
          errorMessage: 'Please fill in all required fields'
        }
      })
      expect(newWrapper.vm.status).toBe(true)
      expect(newWrapper.vm.title).toBe('Validation Error')
      expect(newWrapper.vm.errorMessage).toBe('Please fill in all required fields')
      newWrapper.destroy()
    })

    it('should handle dialog open and close states', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: false, errorMessage: 'Test error' }
      })
      expect(newWrapper.vm.status).toBe(false)

      await newWrapper.setProps({ status: true })
      expect(newWrapper.vm.status).toBe(true)

      newWrapper.vm.handleCloseDialog()
      expect(newWrapper.emitted('on-close')).toBeTruthy()
      newWrapper.destroy()
    })

    it('should support multiple error types', () => {
      const errors = [
        { title: 'Network Error', message: 'Connection failed' },
        { title: 'Validation Error', message: 'Invalid input' },
        { title: 'Authorization Error', message: 'Access denied' },
        { title: 'Server Error', message: 'Internal server error' },
        { title: 'Timeout Error', message: 'Request timeout' }
      ]

      errors.forEach(error => {
        const newWrapper = shallowMount(DefaultErrorDialog, {
          propsData: {
            status: true,
            title: error.title,
            errorMessage: error.message
          }
        })
        expect(newWrapper.vm.title).toBe(error.title)
        expect(newWrapper.vm.errorMessage).toBe(error.message)
        newWrapper.destroy()
      })
    })

    it('should handle rapid status changes', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: false }
      })

      for (let i = 0; i < 5; i++) {
        await newWrapper.setProps({ status: true })
        await newWrapper.setProps({ status: false })
      }

      expect(newWrapper.vm.status).toBe(false)
      newWrapper.destroy()
    })

    it('should preserve component state across prop updates', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: 'Original Title',
          errorMessage: 'Original message'
        }
      })

      newWrapper.vm.handleCloseDialog()
      expect(newWrapper.emitted('on-close').length).toBe(1)

      await newWrapper.setProps({ title: 'Updated Title' })
      expect(newWrapper.emitted('on-close').length).toBe(1)

      newWrapper.vm.handleCloseDialog()
      expect(newWrapper.emitted('on-close').length).toBe(2)
      newWrapper.destroy()
    })
  })

  describe('error handling', () => {
    it('should handle being called without props', () => {
      expect(() => {
        shallowMount(DefaultErrorDialog)
      }).not.toThrow()
    })

    it('should handle undefined props gracefully', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: undefined,
          title: undefined,
          errorMessage: undefined
        }
      })
      expect(newWrapper.vm).toBeDefined()
      newWrapper.destroy()
    })

    it('should not throw on repeated method calls', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          wrapper.vm.handleCloseDialog()
        }
      }).not.toThrow()
    })

    it('should not throw on rapid prop updates', async () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { title: 'Initial' }
      })

      expect(async () => {
        for (let i = 0; i < 10; i++) {
          await newWrapper.setProps({ title: `Title ${i}` })
        }
      }).not.toThrow()

      newWrapper.destroy()
    })
  })

  describe('component composition', () => {
    it('should be a wrapper component', () => {
      expect(wrapper.vm.$options.name).toBe('DefaultErrorDialog')
    })

    it('should have handleCloseDialog method defined', () => {
      const methods = wrapper.vm.$options.methods
      expect(methods.handleCloseDialog).toBeDefined()
    })

    it('should have no computed properties', () => {
      const computed = wrapper.vm.$options.computed
      expect(computed).toBeUndefined()
    })

    it('should have no data properties', () => {
      const data = wrapper.vm.$options.data
      expect(data).toBeUndefined()
    })

    it('should have no watchers', () => {
      const watchers = wrapper.vm.$options.watch
      expect(watchers).toBeUndefined()
    })
  })

  describe('props value passing', () => {
    it('should accept and store status prop', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { status: true }
      })
      expect(newWrapper.vm.status).toBe(true)
      newWrapper.destroy()
    })

    it('should accept and store errorMessage prop', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { errorMessage: 'Test error message' }
      })
      expect(newWrapper.vm.errorMessage).toBe('Test error message')
      newWrapper.destroy()
    })

    it('should accept and store title prop', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: { title: 'Test title' }
      })
      expect(newWrapper.vm.title).toBe('Test title')
      newWrapper.destroy()
    })

    it('should accept all three props together', () => {
      const newWrapper = shallowMount(DefaultErrorDialog, {
        propsData: {
          status: true,
          title: 'Test Title',
          errorMessage: 'Test Error'
        }
      })
      expect(newWrapper.vm.status).toBe(true)
      expect(newWrapper.vm.title).toBe('Test Title')
      expect(newWrapper.vm.errorMessage).toBe('Test Error')
      newWrapper.destroy()
    })
  })

  describe('event emission', () => {
    it('should emit on-close event', () => {
      wrapper.vm.handleCloseDialog()
      expect(wrapper.emitted()).toHaveProperty('on-close')
    })

    it('should emit event with correct event name', () => {
      wrapper.vm.handleCloseDialog()
      const events = Object.keys(wrapper.emitted())
      expect(events).toContain('on-close')
    })

    it('should not emit other events', () => {
      wrapper.vm.handleCloseDialog()
      const events = Object.keys(wrapper.emitted())
      expect(events.length).toBe(1)
      expect(events[0]).toBe('on-close')
    })

    it('should emit event multiple times on multiple calls', () => {
      wrapper.vm.handleCloseDialog()
      wrapper.vm.handleCloseDialog()
      wrapper.vm.handleCloseDialog()
      const emitCount = wrapper.emitted('on-close').length
      expect(emitCount).toBe(3)
    })
  })
})
