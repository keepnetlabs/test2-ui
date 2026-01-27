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
})
