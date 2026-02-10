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
})
