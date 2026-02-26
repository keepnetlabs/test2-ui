import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import FeedbackPopup from '@/components/FeedbackPopup.vue'

jest.mock('@/api/dashboard', () => ({
  sendFeedback: jest.fn().mockResolvedValue({})
}))

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

describe('FeedbackPopup.vue (extra branch coverage)', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        dashboard: {
          namespaced: true,
          actions: { changeFeedbackPopup: jest.fn() }
        }
      }
    })
    store.dispatch = jest.fn()
  })

  const createWrapper = () =>
    shallowMount(FeedbackPopup, {
      localVue,
      vuetify: new Vuetify(),
      store,
      stubs: {
        VTextarea: {
          template: '<textarea/>',
          mounted() {
            this.$el.getBoundingClientRect = jest.fn(() => ({ height: 156 }))
          }
        },
        vForm: { template: '<form><slot/></form>', methods: { validate: () => true } }
      }
    })

  describe('getScrollingStyle branches', () => {
    it('returns base style when textAreaHeight is 165', () => {
      const wrapper = createWrapper()
      wrapper.setData({ textAreaHeight: 165 })
      const style = wrapper.vm.getScrollingStyle
      expect(style.boxShadow).toBe('none !important')
    })
    it('returns base style when textAreaHeight is 164', () => {
      const wrapper = createWrapper()
      wrapper.setData({ textAreaHeight: 164 })
      expect(wrapper.vm.getScrollingStyle.boxShadow).toBe('none !important')
    })
    it('adds boxShadow when textAreaHeight is 166', () => {
      const wrapper = createWrapper()
      wrapper.setData({ textAreaHeight: 166 })
      expect(wrapper.vm.getScrollingStyle.boxShadow).toContain('rgba')
    })
  })

  describe('onFeedbackSend validate branch', () => {
    it('does not call sendFeedback when validate returns false', () => {
      const { sendFeedback } = require('@/api/dashboard')
      sendFeedback.mockClear()
      const wrapper = createWrapper()
      wrapper.vm.$refs = { feedbackForm: { validate: () => false } }
      wrapper.setData({ feedbackMessage: 'test' })
      wrapper.vm.onFeedbackSend()
      expect(sendFeedback).not.toHaveBeenCalled()
    })
    it('calls sendFeedback and sets saveDisable when validate returns true', async () => {
      const { sendFeedback } = require('@/api/dashboard')
      sendFeedback.mockClear().mockResolvedValue({})
      const wrapper = createWrapper()
      wrapper.vm.$refs = { feedbackForm: { validate: () => true } }
      wrapper.setData({ feedbackMessage: 'Valid message here' })
      wrapper.vm.onFeedbackSend()
      expect(sendFeedback).toHaveBeenCalledWith({ Text: 'Valid message here' })
      expect(wrapper.vm.saveDisable).toBe(true)
    })

    it('resets saveDisable and closes popup in finally after successful send', async () => {
      const { sendFeedback } = require('@/api/dashboard')
      sendFeedback.mockClear().mockResolvedValue({})
      const wrapper = createWrapper()
      wrapper.vm.$refs = { feedbackForm: { validate: () => true } }
      wrapper.setData({ feedbackMessage: 'Final test message' })

      wrapper.vm.onFeedbackSend()
      await Promise.resolve()
      await Promise.resolve()

      expect(wrapper.vm.saveDisable).toBe(false)
      expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
    })
  })

  describe('watch feedbackMessage', () => {
    it('returns early when ref textarea element is missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {}
      expect(() => wrapper.vm.$options.watch.feedbackMessage.call(wrapper.vm)).not.toThrow()
    })

    it('returns early when getBoundingClientRect is not a function', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refTextArea: { $el: {} } }
      wrapper.vm.$options.watch.feedbackMessage.call(wrapper.vm)
      expect(wrapper.vm.textAreaHeight).toBe(156)
    })

    it('updates textAreaHeight when textarea ref is valid', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refTextArea: {
          $el: {
            getBoundingClientRect: () => ({ height: 212 })
          }
        }
      }
      wrapper.vm.$options.watch.feedbackMessage.call(wrapper.vm)
      expect(wrapper.vm.textAreaHeight).toBe(212)
    })
  })

  it('onCancelClicked closes feedback popup', () => {
    const wrapper = createWrapper()
    wrapper.vm.onCancelClicked()
    expect(store.dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', false)
  })
})
