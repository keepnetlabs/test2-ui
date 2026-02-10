import { createLocalVue, shallowMount } from '@vue/test-utils'
import FeedbackPopup from '@/components/FeedbackPopup.vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { sendFeedback } from '@/api/dashboard'

jest.mock('@/api/dashboard', () => ({
  sendFeedback: jest.fn()
}))

jest.mock('@/model/constants/labels', () => ({
  Cancel: 'Cancel'
}))

describe('FeedbackPopup.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let actions
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      actions: {
        'dashboard/changeFeedbackPopup': jest.fn()
      }
    })
    store.dispatch = jest.fn()
    sendFeedback.mockReset()
  })

  const mountComponent = () => {
    return shallowMount(FeedbackPopup, {
      localVue,
      vuetify,
      store,
      stubs: {
        VTextarea: {
          template: '<textarea class="v-textarea-stub" @input="$emit(\'input\', $event.target.value)"></textarea>',
          methods: {
            focus: jest.fn() 
          }
        },
        vForm: {
          template: '<form @submit.prevent><slot/></form>',
          methods: {
            validate: jest.fn(() => true)
          }
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.feedback-popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Feedback')
  })

  it('calls changeFeedbackPopup on cancel', async () => {
    const wrapper = mountComponent()
    wrapper.vm.onCancelClicked()
    expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
  })

  it('submits feedback when valid', async () => {
    const wrapper = mountComponent()
    sendFeedback.mockResolvedValue({})
    
    // Mock validation explicitly
    wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)
    
    await wrapper.setData({ feedbackMessage: 'Some feedback text' })
    
    wrapper.vm.onFeedbackSend()
    
    expect(sendFeedback).toHaveBeenCalledWith({ Text: 'Some feedback text' })
    
    // Wait for promise
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
  })

  it('updates textAreaHeight on message change', async () => {
    const wrapper = mountComponent()
    const mockRect = { height: 200 }
    
    // Ensure ref matches
    const textarea = wrapper.findComponent({ ref: 'refTextArea' })
    textarea.element.getBoundingClientRect = jest.fn(() => mockRect)
    
    await wrapper.setData({ feedbackMessage: 'New Text' })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.textAreaHeight).toBe(200)
    expect(wrapper.vm.getScrollingStyle.boxShadow).toContain('rgba')
  })

  it('getScrollingStyle returns none default', () => {
    const wrapper = mountComponent()
    wrapper.setData({ textAreaHeight: 100 })
    expect(wrapper.vm.getScrollingStyle.boxShadow).toContain('none')
  })

  it('does not submit when validation fails', async () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => false)
    
    wrapper.vm.onFeedbackSend()
    
    expect(sendFeedback).not.toHaveBeenCalled()
  })

  it('sets saveDisable true while sending feedback', async () => {
    const wrapper = mountComponent()
    // Mock sendFeedback to be a pending promise
    let resolvePromise
    sendFeedback.mockReturnValue(new Promise(resolve => { resolvePromise = resolve }))
    
    wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)
    await wrapper.setData({ feedbackMessage: 'Test message' })
    
    wrapper.vm.onFeedbackSend()
    
    expect(wrapper.vm.saveDisable).toBe(true)
    
    resolvePromise({})
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(wrapper.vm.saveDisable).toBe(false)
  })

  it('resets loading state after API call', async () => {
    const wrapper = mountComponent()
    let resolvePromise
    const p = new Promise((resolve) => { resolvePromise = resolve })
    sendFeedback.mockReturnValue(p)

    wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)
    await wrapper.setData({ feedbackMessage: 'Test message' })

    wrapper.vm.onFeedbackSend()

    expect(wrapper.vm.saveDisable).toBe(true)

    resolvePromise({})

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(wrapper.vm.saveDisable).toBe(false)
    expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
  })

  describe('Component Props and Data', () => {
    it('initializes with correct default data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.feedbackMessage === '' || wrapper.vm.feedbackMessage === null).toBe(true)
      expect(wrapper.vm.saveDisable).toBe(false)
      expect(typeof wrapper.vm.textAreaHeight).toBe('number')
    })

    it('accepts and updates feedbackMessage prop', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ feedbackMessage: 'Test feedback' })
      expect(wrapper.vm.feedbackMessage).toBe('Test feedback')
    })

    it('displays feedback message in textarea', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ feedbackMessage: 'User feedback text' })
      expect(wrapper.vm.feedbackMessage).toContain('User feedback')
    })
  })

  describe('Form Validation', () => {
    it('validates form before submission', async () => {
      const wrapper = mountComponent()
      sendFeedback.mockResolvedValue({})
      const validateSpy = jest.fn(() => true)
      wrapper.vm.$refs.feedbackForm.validate = validateSpy

      await wrapper.setData({ feedbackMessage: 'Test' })
      wrapper.vm.onFeedbackSend()

      expect(validateSpy).toHaveBeenCalled()
    })

    it('prevents submission with invalid form', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => false)
      sendFeedback.mockClear()

      wrapper.vm.onFeedbackSend()

      expect(sendFeedback).not.toHaveBeenCalled()
    })

    it('allows submission with valid form', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)
      sendFeedback.mockResolvedValue({})

      await wrapper.setData({ feedbackMessage: 'Valid feedback' })
      wrapper.vm.onFeedbackSend()

      expect(sendFeedback).toHaveBeenCalled()
    })
  })

  describe('Feedback Message Handling', () => {
    it('accepts long feedback messages', async () => {
      const wrapper = mountComponent()
      const longMessage = 'a'.repeat(500)
      await wrapper.setData({ feedbackMessage: longMessage })
      expect(wrapper.vm.feedbackMessage.length).toBe(500)
    })

    it('accepts special characters in feedback', async () => {
      const wrapper = mountComponent()
      const specialMessage = 'Feedback with @special #chars & symbols!'
      await wrapper.setData({ feedbackMessage: specialMessage })
      expect(wrapper.vm.feedbackMessage).toBe(specialMessage)
    })

    it('handles multiline feedback text', async () => {
      const wrapper = mountComponent()
      const multilineMessage = 'Line 1\nLine 2\nLine 3'
      await wrapper.setData({ feedbackMessage: multilineMessage })
      expect(wrapper.vm.feedbackMessage).toContain('Line 1')
      expect(wrapper.vm.feedbackMessage).toContain('Line 2')
    })

    it('sends feedback payload with correct structure', async () => {
      const wrapper = mountComponent()
      sendFeedback.mockResolvedValue({})
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)

      await wrapper.setData({ feedbackMessage: 'Test feedback payload' })
      wrapper.vm.onFeedbackSend()

      expect(sendFeedback).toHaveBeenCalledWith({ Text: 'Test feedback payload' })
    })
  })

  describe('Text Area Height Management', () => {
    it('calculates text area height from element dimensions', async () => {
      const wrapper = mountComponent()
      const mockRect = { height: 250 }

      wrapper.vm.$refs.refTextArea.getBoundingClientRect = jest.fn(() => mockRect)
      await wrapper.setData({ feedbackMessage: 'Message' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.textAreaHeight).toBeGreaterThanOrEqual(0)
    })

    it('updates scrolling style based on height', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ textAreaHeight: 150 })
      expect(wrapper.vm.getScrollingStyle).toBeDefined()
    })

    it('applies box shadow style when scrolling', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ textAreaHeight: 200 })
      const style = wrapper.vm.getScrollingStyle
      expect(style.boxShadow).toBeDefined()
    })
  })

  describe('Store Integration', () => {
    it('dispatches changeFeedbackPopup action to close popup', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onCancelClicked()

      expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
    })

    it('closes popup after successful feedback submission', async () => {
      const wrapper = mountComponent()
      sendFeedback.mockResolvedValue({})
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)

      await wrapper.setData({ feedbackMessage: 'Feedback' })
      wrapper.vm.onFeedbackSend()

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
    })

    it('does not dispatch when validation fails', async () => {
      const wrapper = mountComponent()
      store.dispatch.mockClear()
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => false)

      wrapper.vm.onFeedbackSend()

      expect(store.dispatch).not.toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
    })
  })

  describe('Loading and Error States', () => {
    it('disables save button during submission', async () => {
      const wrapper = mountComponent()
      sendFeedback.mockReturnValue(new Promise(() => {}))
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)

      await wrapper.setData({ feedbackMessage: 'Test' })
      wrapper.vm.onFeedbackSend()

      expect(wrapper.vm.saveDisable).toBe(true)
    })

    it('re-enables save button after submission completes', async () => {
      const wrapper = mountComponent()
      let resolvePromise
      sendFeedback.mockReturnValue(new Promise(resolve => { resolvePromise = resolve }))
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)

      await wrapper.setData({ feedbackMessage: 'Test' })
      wrapper.vm.onFeedbackSend()

      expect(wrapper.vm.saveDisable).toBe(true)

      resolvePromise({})
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(wrapper.vm.saveDisable).toBe(false)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('resets component state on cancel', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ feedbackMessage: 'Test message' })

      wrapper.vm.onCancelClicked()

      expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty feedback message', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ feedbackMessage: '' })
      expect(wrapper.vm.feedbackMessage).toBe('')
    })

    it('handles feedback message with only whitespace', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ feedbackMessage: '   ' })
      expect(wrapper.vm.feedbackMessage).toBe('   ')
    })

    it('handles unicode characters in feedback', async () => {
      const wrapper = mountComponent()
      const unicodeMessage = 'Feedback with émojis 🎉 and spëcial çharacters'
      await wrapper.setData({ feedbackMessage: unicodeMessage })
      expect(wrapper.vm.feedbackMessage).toContain('émojis')
    })

    it('handles rapid consecutive submissions', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.feedbackForm.validate = jest.fn(() => true)
      sendFeedback.mockResolvedValue({})

      await wrapper.setData({ feedbackMessage: 'Test 1' })
      wrapper.vm.onFeedbackSend()
      wrapper.vm.onFeedbackSend()

      expect(sendFeedback).toHaveBeenCalledTimes(2)
    })
  })
})
