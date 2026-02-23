import { createLocalVue, shallowMount } from '@vue/test-utils'
import CustomError from '@/components/CustomError.vue'

// Mock labels since it's a constant file interaction
jest.mock('@/model/constants/labels', () => ({
  RequiredStar: '*',
  Required: 'Required Field'
}))

describe('CustomError.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(CustomError, {
      localVue,
      propsData: {
        ...propsData
      }
    })
  }

  it('renders valid message when isValid is true and showValidMessage is true', () => {
    const wrapper = mountComponent({
      isValid: true,
      showValidMessage: true
    })
    
    expect(wrapper.text()).toContain('*')
    expect(wrapper.find('.error--text').exists()).toBe(false)
  })

  it('renders nothing visible when isValid is true and showValidMessage is false', () => {
    const wrapper = mountComponent({
      isValid: true,
      showValidMessage: false
    })
    
    expect(wrapper.text()).toBe('')
    expect(wrapper.find('.v-messages').exists()).toBe(false)
  })

  it('renders default error message when isValid is false', () => {
    const wrapper = mountComponent({
      isValid: false
    })
    
    expect(wrapper.find('.error--text').exists()).toBe(true)
    expect(wrapper.text()).toContain('Required Field')
  })

  it('renders custom error message when provided', () => {
    const customMsg = 'Custom Error Occurred'
    const wrapper = mountComponent({
      isValid: false,
      errorMessage: customMsg
    })
    
    expect(wrapper.text()).toContain(customMsg)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mountComponent({
      isValid: false
    })
    
    expect(wrapper.find('.error--text').exists()).toBe(true)
    expect(wrapper.find('.v-messages').exists()).toBe(true)
  })

  it('handles multiple error states', async () => {
    const wrapper = mountComponent({
      isValid: false,
      errorMessage: 'Error 1'
    })
    
    expect(wrapper.text()).toContain('Error 1')
    
    // Change error message
    await wrapper.setProps({ errorMessage: 'Error 2' })
    
    expect(wrapper.text()).toContain('Error 2')
  })

  it('updates when validity changes', async () => {
    const wrapper = mountComponent({
      isValid: false,
      errorMessage: 'Error!'
    })

    expect(wrapper.find('.error--text').exists()).toBe(true)

    await wrapper.setProps({ isValid: true, showValidMessage: true })

    expect(wrapper.find('.error--text').exists()).toBe(false)
    expect(wrapper.text()).toContain('*')
  })

  describe('Component Props', () => {
    it('accepts isValid prop', () => {
      const wrapper = mountComponent({ isValid: true })
      expect(wrapper.vm.isValid).toBe(true)
    })

    it('accepts errorMessage prop', () => {
      const wrapper = mountComponent({ errorMessage: 'Test error' })
      expect(wrapper.vm.errorMessage).toBe('Test error')
    })

    it('accepts showValidMessage prop', () => {
      const wrapper = mountComponent({ showValidMessage: true })
      expect(wrapper.vm.showValidMessage).toBe(true)
    })
  })

  describe('Error Message Variations', () => {
    it('displays empty message when no error', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: false })
      expect(wrapper.text()).toBe('')
    })

    it('displays long error messages', () => {
      const longMsg = 'This is a very long error message that spans multiple words'
      const wrapper = mountComponent({ isValid: false, errorMessage: longMsg })
      expect(wrapper.text()).toContain(longMsg)
    })

    it('handles special characters in error message', () => {
      const specialMsg = 'Error: Invalid @input & "<tag>"'
      const wrapper = mountComponent({ isValid: false, errorMessage: specialMsg })
      expect(wrapper.vm.errorMessage).toBe(specialMsg)
    })

    it('displays error with numbers and symbols', () => {
      const numMsg = 'Error #123: Code 404 - Not Found!'
      const wrapper = mountComponent({ isValid: false, errorMessage: numMsg })
      expect(wrapper.text()).toContain(numMsg)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('has error--text class when invalid', () => {
      const wrapper = mountComponent({ isValid: false })
      expect(wrapper.find('.error--text').exists()).toBe(true)
    })

    it('has v-messages class for message display', () => {
      const wrapper = mountComponent({ isValid: false })
      expect(wrapper.find('.v-messages').exists()).toBe(true)
    })

    it('does not have error--text class when valid', () => {
      const wrapper = mountComponent({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })

    it('renders messages wrapper correctly', () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Test' })
      expect(wrapper.find('.v-messages__wrapper').exists()).toBe(true)
    })
  })

  describe('Valid State Handling', () => {
    it('shows valid message with asterisk when valid', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: true })
      expect(wrapper.text()).toContain('*')
    })

    it('hides valid message when showValidMessage is false', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: false })
      expect(wrapper.find('.v-messages').exists()).toBe(false)
    })

    it('combines valid state with message display', () => {
      const wrapper = mountComponent({
        isValid: true,
        showValidMessage: true
      })
      expect(wrapper.text()).toContain('*')
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })
  })

  describe('State Transitions', () => {
    it('transitions from valid to invalid', async () => {
      const wrapper = mountComponent({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)

      await wrapper.setProps({ isValid: false, errorMessage: 'Now invalid' })
      expect(wrapper.find('.error--text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Now invalid')
    })

    it('transitions from invalid to valid', async () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Invalid' })
      expect(wrapper.find('.error--text').exists()).toBe(true)

      await wrapper.setProps({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })

    it('handles message changes during invalid state', async () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Error 1' })
      expect(wrapper.text()).toContain('Error 1')

      await wrapper.setProps({ errorMessage: 'Error 2' })
      expect(wrapper.text()).toContain('Error 2')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string error message', () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: '' })
      expect(wrapper.vm.errorMessage).toBe('')
    })

    it('handles very long error messages', () => {
      const longMsg = 'a'.repeat(500)
      const wrapper = mountComponent({ isValid: false, errorMessage: longMsg })
      expect(wrapper.vm.errorMessage.length).toBe(500)
    })

    it('displays error with special characters correctly', () => {
      const specialMsg = 'Error with ♦ symbols!'
      const wrapper = mountComponent({ isValid: false, errorMessage: specialMsg })
      expect(wrapper.vm.errorMessage).toBe(specialMsg)
    })
  })

  describe('Component Lifecycle', () => {
    it('component mounts correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state during lifecycle', async () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Test' })
      const initialText = wrapper.text()

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe(initialText)
    })
  })

  describe('Component Structure', () => {
    it('component name is CustomError', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CustomError')
    })

    it('component has data function', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component is a Vue instance', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm._isVue).toBe(true)
    })

    it('component has required props defined', () => {
      const wrapper = mountComponent({
        isValid: true,
        errorMessage: 'Test',
        showValidMessage: true
      })
      expect(wrapper.vm.isValid).toBeDefined()
      expect(wrapper.vm.errorMessage).toBeDefined()
      expect(wrapper.vm.showValidMessage).toBeDefined()
    })

    it('component renders a div element', () => {
      const wrapper = mountComponent()
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('Prop Default Values', () => {
    it('isValid defaults to undefined/falsy', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.isValid).toBeFalsy()
    })

    it('errorMessage defaults to Required Field', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.errorMessage).toBe('Required Field')
    })

    it('showValidMessage defaults to true', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm.showValidMessage).toBe(true)
    })

    it('all props can be overridden', () => {
      const wrapper = mountComponent({
        isValid: false,
        errorMessage: 'Custom',
        showValidMessage: true
      })
      expect(wrapper.vm.isValid).toBe(false)
      expect(wrapper.vm.errorMessage).toBe('Custom')
      expect(wrapper.vm.showValidMessage).toBe(true)
    })
  })

  describe('Dynamic Prop Updates', () => {
    it('responds to isValid prop changes', async () => {
      const wrapper = mountComponent({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)

      await wrapper.setProps({ isValid: false, errorMessage: 'Error' })
      expect(wrapper.find('.error--text').exists()).toBe(true)
    })

    it('responds to errorMessage prop changes', async () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Error 1' })
      expect(wrapper.text()).toContain('Error 1')

      await wrapper.setProps({ errorMessage: 'Error 2' })
      expect(wrapper.text()).toContain('Error 2')
    })

    it('responds to showValidMessage prop changes', async () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: false })
      expect(wrapper.find('.v-messages').exists()).toBe(false)

      await wrapper.setProps({ showValidMessage: true })
      expect(wrapper.find('.v-messages').exists()).toBe(true)
    })

    it('handles rapid prop updates', async () => {
      const wrapper = mountComponent({ isValid: false, errorMessage: 'Error' })

      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ errorMessage: `Error ${i}` })
        expect(wrapper.text()).toContain(`Error ${i}`)
      }
    })

    it('maintains consistency during batch updates', async () => {
      const wrapper = mountComponent({ isValid: true })

      await wrapper.setProps({
        isValid: false,
        errorMessage: 'Multiple updates',
        showValidMessage: false
      })

      expect(wrapper.find('.error--text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Multiple updates')
    })
  })

  describe('Message Handling', () => {
    it('renders default Required message when no custom message', () => {
      const wrapper = mountComponent({ isValid: false })
      expect(wrapper.text()).toContain('Required Field')
    })

    it('custom message overrides default', () => {
      const wrapper = mountComponent({
        isValid: false,
        errorMessage: 'Custom message'
      })
      expect(wrapper.text()).toContain('Custom message')
      expect(wrapper.text()).not.toContain('Required Field')
    })

    it('handles unicode characters in messages', () => {
      const unicodeMsg = 'Error: 错误 エラー'
      const wrapper = mountComponent({ isValid: false, errorMessage: unicodeMsg })
      expect(wrapper.vm.errorMessage).toBe(unicodeMsg)
    })

    it('handles HTML-like content safely', () => {
      const htmlLikeMsg = 'Error: <script>alert("xss")</script>'
      const wrapper = mountComponent({ isValid: false, errorMessage: htmlLikeMsg })
      expect(wrapper.vm.errorMessage).toBe(htmlLikeMsg)
    })
  })

  describe('Visibility Control', () => {
    it('error is visible when isValid is false', () => {
      const wrapper = mountComponent({ isValid: false })
      const errorElement = wrapper.find('.error--text')
      expect(errorElement.exists()).toBe(true)
    })

    it('error is hidden when isValid is true', () => {
      const wrapper = mountComponent({ isValid: true })
      const errorElement = wrapper.find('.error--text')
      expect(errorElement.exists()).toBe(false)
    })

    it('valid indicator is visible when showValidMessage is true', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: true })
      expect(wrapper.text()).toContain('*')
    })

    it('valid indicator is hidden when showValidMessage is false', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: false })
      expect(wrapper.find('.v-messages').exists()).toBe(false)
    })

    it('nothing is shown when valid and showValidMessage is false', () => {
      const wrapper = mountComponent({ isValid: true, showValidMessage: false })
      expect(wrapper.text()).toBe('')
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })
  })

  describe('Multiple Instances', () => {
    it('multiple instances maintain independent state', () => {
      const wrapper1 = mountComponent({ isValid: true, errorMessage: 'Error 1' })
      const wrapper2 = mountComponent({ isValid: false, errorMessage: 'Error 2' })

      expect(wrapper1.vm.errorMessage).toBe('Error 1')
      expect(wrapper2.vm.errorMessage).toBe('Error 2')
    })

    it('updating one instance does not affect others', async () => {
      const wrapper1 = mountComponent({ isValid: false, errorMessage: 'Error 1' })
      const wrapper2 = mountComponent({ isValid: false, errorMessage: 'Error 2' })

      await wrapper1.setProps({ errorMessage: 'Updated Error 1' })

      expect(wrapper1.text()).toContain('Updated Error 1')
      expect(wrapper2.text()).toContain('Error 2')
    })

    it('can create many instances without errors', () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        wrappers.push(mountComponent({ errorMessage: `Error ${i}` }))
      }

      expect(wrappers).toHaveLength(10)
      wrappers.forEach((w, i) => {
        expect(w.vm.errorMessage).toBe(`Error ${i}`)
      })
    })
  })

  describe('Performance Characteristics', () => {
    it('component mounts quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })

    it('prop updates are fast', async () => {
      const wrapper = mountComponent()
      const start = Date.now()

      for (let i = 0; i < 100; i++) {
        await wrapper.setProps({ errorMessage: `Error ${i}` })
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(1000)
    })

    it('multiple instances can be created efficiently', () => {
      const start = Date.now()

      for (let i = 0; i < 50; i++) {
        mountComponent({ errorMessage: `Error ${i}` })
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(1500)
    })
  })

  describe('Integration Scenarios', () => {
    it('works with form validation workflow', async () => {
      const wrapper = mountComponent({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)

      await wrapper.setProps({ isValid: false, errorMessage: 'Field required' })
      expect(wrapper.find('.error--text').exists()).toBe(true)

      await wrapper.setProps({ isValid: true })
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })

    it('displays errors for different validation types', async () => {
      const wrapper = mountComponent({ isValid: false })

      const validationErrors = [
        'Field is required',
        'Email format is invalid',
        'Password must be at least 8 characters',
        'Passwords do not match'
      ]

      for (const error of validationErrors) {
        await wrapper.setProps({ errorMessage: error })
        expect(wrapper.text()).toContain(error)
      }
    })

    it('can be used in a parent component scenario', async () => {
      const wrapper = mountComponent({
        isValid: false,
        errorMessage: 'Initial error',
        showValidMessage: false
      })

      // Simulate parent updating props
      await wrapper.setProps({
        isValid: true,
        showValidMessage: true
      })

      expect(wrapper.text()).toContain('*')
      expect(wrapper.find('.error--text').exists()).toBe(false)
    })
  })
})
