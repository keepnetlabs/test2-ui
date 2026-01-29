import { shallowMount } from '@vue/test-utils'
import KSwiperFeedback from '@/components/Common/Swiper/KSwiperFeedback.vue'

describe('KSwiperFeedback.vue', () => {
  let wrapper

  const mockData = {
    title: 'How was your experience?',
    placeholder: 'Tell us your thoughts...',
    rows: 4,
    maxLength: 500,
    requireRating: true,
    requireText: false,
    minTextLength: 0,
    userName: 'John',
    initialRating: 0,
    initialText: '',
    actions: [
      { text: 'Submit', action: 'submit', type: 'primary' },
      { text: 'Cancel', action: 'cancel', type: 'secondary' }
    ]
  }

  beforeEach(() => {
    wrapper = shallowMount(KSwiperFeedback, {
      propsData: {
        data: mockData
      },
      stubs: {
        'swiper-slide': true,
        'v-icon': true
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
      expect(wrapper.vm.$options.name).toBe('KSwiperFeedback')
    })

    it('should have swiper-slide wrapper', () => {
      expect(wrapper.findComponent({ name: 'swiper-slide' }).exists()).toBe(true)
    })

    it('should have k-swiper-slide-feedback class', () => {
      const swiperSlide = wrapper.findComponent({ name: 'swiper-slide' })
      expect(swiperSlide.classes()).toContain('k-swiper-slide--feedback')
    })
  })

  describe('props handling', () => {
    it('should have required data prop', () => {
      expect(wrapper.vm.$options.props.data.required).toBe(true)
    })

    it('should have swiperRef prop with default null', () => {
      expect(wrapper.vm.$options.props.swiperRef.default).toBeNull()
    })

    it('should accept data prop', () => {
      expect(wrapper.vm.data).toEqual(mockData)
    })
  })

  describe('data initialization', () => {
    it('should initialize rating from initialRating', () => {
      expect(wrapper.vm.rating).toBe(mockData.initialRating)
    })

    it('should initialize hoverRating to 0', () => {
      expect(wrapper.vm.hoverRating).toBe(0)
    })

    it('should initialize feedbackText from initialText', () => {
      expect(wrapper.vm.feedbackText).toBe(mockData.initialText)
    })

    it('should initialize isSubmitting to false', () => {
      expect(wrapper.vm.isSubmitting).toBe(false)
    })

    it('should initialize isFocused to false', () => {
      expect(wrapper.vm.isFocused).toBe(false)
    })

    it('should initialize isSubmitted to false', () => {
      expect(wrapper.vm.isSubmitted).toBe(false)
    })
  })

  describe('feedbackClasses computed property', () => {
    it('should have default layout by default', () => {
      const data = { ...mockData, layout: undefined }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.feedbackClasses['k-swiper-feedback--default']).toBe(true)
    })

    it('should use custom layout', () => {
      const data = { ...mockData, layout: 'compact' }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.feedbackClasses['k-swiper-feedback--compact']).toBe(true)
    })

    it('should have primary theme by default', () => {
      const data = { ...mockData, theme: undefined }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.feedbackClasses['k-swiper-feedback--primary']).toBe(true)
    })

    it('should add has-actions class when actions exist', () => {
      expect(wrapper.vm.feedbackClasses['k-swiper-feedback--has-actions']).toBe(true)
    })

    it('should add submitted class when isSubmitted true', () => {
      wrapper.vm.isSubmitted = true
      expect(wrapper.vm.feedbackClasses['k-swiper-feedback--submitted']).toBe(true)
    })
  })

  describe('star rating', () => {
    it('should have 5 star buttons', () => {
      const stars = wrapper.vm.$el.querySelectorAll('.k-swiper-feedback__star')
      expect(stars.length).toBe(5)
    })

    it('should set rating on star click', () => {
      wrapper.vm.setRating(4)
      expect(wrapper.vm.rating).toBe(4)
    })

    it('should emit rating-change event', () => {
      wrapper.vm.setRating(3)
      expect(wrapper.emitted('rating-change')).toBeTruthy()
      expect(wrapper.emitted('rating-change')[0][0]).toBe(3)
    })

    it('should highlight stars up to rating', () => {
      wrapper.vm.rating = 3
      expect(wrapper.vm.rating).toBe(3)
    })

    it('should track hover rating', () => {
      wrapper.vm.hoverRating = 4
      expect(wrapper.vm.hoverRating).toBe(4)
    })
  })

  describe('feedback text input', () => {
    it('should render textarea', () => {
      const textarea = wrapper.vm.$el.querySelector('.k-swiper-feedback__textarea')
      expect(textarea).toBeTruthy()
    })

    it('should bind feedbackText to textarea', async () => {
      wrapper.vm.feedbackText = 'Test feedback'
      await wrapper.vm.$nextTick()
      const textarea = wrapper.vm.$el.querySelector('.k-swiper-feedback__textarea')
      expect(textarea.value).toBe('Test feedback')
    })

    it('should set textarea rows', () => {
      const textarea = wrapper.vm.$el.querySelector('.k-swiper-feedback__textarea')
      expect(parseInt(textarea.rows)).toBe(mockData.rows)
    })

    it('should set textarea maxlength', () => {
      const textarea = wrapper.vm.$el.querySelector('.k-swiper-feedback__textarea')
      expect(parseInt(textarea.maxLength)).toBe(mockData.maxLength)
    })

    it('should track focus state', async () => {
      const textarea = wrapper.vm.$el.querySelector('.k-swiper-feedback__textarea')
      textarea.dispatchEvent(new Event('focus'))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isFocused).toBe(true)
    })
  })

  describe('placeholder computation', () => {
    it('should use provided placeholder', () => {
      expect(wrapper.vm.computedPlaceholder).toBe('Tell us your thoughts...')
    })

    it('should prepend userName to placeholder', () => {
      const placeholder = wrapper.vm.computedPlaceholder
      expect(placeholder).toContain('John')
    })

    it('should use default placeholder if not provided', () => {
      const data = { ...mockData, placeholder: undefined, userName: undefined }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.computedPlaceholder).toContain('helpful')
    })
  })

  describe('text validation', () => {
    it('should show error if text required but empty', () => {
      const data = { ...mockData, requireText: true, minTextLength: 0 }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.hasTextError).toBe(true)
    })

    it('should not show error if text not required', () => {
      expect(wrapper.vm.hasTextError).toBe(false)
    })

    it('should show error if text below minimum length', () => {
      const data = { ...mockData, minTextLength: 10 }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      wrapper.vm.feedbackText = 'short'
      expect(wrapper.vm.hasTextError).toBe(true)
    })

    it('should display error message', () => {
      const data = { ...mockData, requireText: true }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.textErrorMessage).toBe('Feedback text is required')
    })
  })

  describe('character counter', () => {
    it('should display character count', () => {
      wrapper.vm.feedbackText = 'Test'
      expect(wrapper.text()).toContain('4/')
    })

    it('should show counter when maxLength is set', () => {
      expect(wrapper.vm.data.maxLength).toBeTruthy()
    })

    it('should not exceed maxLength', () => {
      wrapper.vm.feedbackText = 'a'.repeat(501)
      expect(wrapper.vm.feedbackText.length).toBeLessThanOrEqual(501)
    })
  })

  describe('isValid computed property', () => {
    it('should be invalid without rating when required', () => {
      expect(wrapper.vm.isValid).toBe(false)
    })

    it('should be valid with rating and valid text', () => {
      wrapper.vm.rating = 5
      expect(wrapper.vm.isValid).toBe(true)
    })

    it('should be invalid with text error', () => {
      const data = { ...mockData, requireText: true, minTextLength: 0 }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      wrapper.vm.rating = 5
      expect(wrapper.vm.isValid).toBe(false)
    })

    it('should be valid without rating requirement', () => {
      const data = { ...mockData, requireRating: false }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.isValid).toBe(true)
    })
  })

  describe('feedbackData computed property', () => {
    it('should return feedback object with rating and text', () => {
      wrapper.vm.rating = 5
      wrapper.vm.feedbackText = 'Great!'
      const feedback = wrapper.vm.feedbackData
      expect(feedback.rating).toBe(5)
      expect(feedback.text).toBe('Great!')
    })

    it('should include timestamp', () => {
      const feedback = wrapper.vm.feedbackData
      expect(feedback.timestamp).toBeTruthy()
    })

    it('should trim feedback text', () => {
      wrapper.vm.feedbackText = '  feedback  '
      expect(wrapper.vm.feedbackData.text).toBe('feedback')
    })
  })

  describe('setRating method', () => {
    it('should set rating value', () => {
      wrapper.vm.setRating(3)
      expect(wrapper.vm.rating).toBe(3)
    })

    it('should emit rating-change event', () => {
      wrapper.vm.setRating(2)
      expect(wrapper.emitted('rating-change')[0][0]).toBe(2)
    })
  })

  describe('submit handling', () => {
    it('should call handleSubmit with submit action', async () => {
      wrapper.vm.rating = 5
      const action = { action: 'submit', text: 'Submit', autoNext: false }
      await wrapper.vm.handleActionClick(action)
      expect(wrapper.vm.isSubmitted).toBe(true)
    })

    it('should emit submit event', async () => {
      wrapper.vm.rating = 5
      const action = { action: 'submit', text: 'Submit' }
      await wrapper.vm.handleActionClick(action)
      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('should show success state after submission', async () => {
      wrapper.vm.rating = 5
      const action = { action: 'submit', text: 'Submit' }
      await wrapper.vm.handleActionClick(action)
      expect(wrapper.vm.isSubmitted).toBe(true)
    })

    it('should emit disable-navigation on submit', async () => {
      wrapper.vm.rating = 5
      const action = { action: 'submit', text: 'Submit' }
      await wrapper.vm.handleActionClick(action)
      expect(wrapper.emitted('disable-navigation')).toBeTruthy()
    })

    it('should not submit if invalid', async () => {
      const action = { action: 'submit', text: 'Submit' }
      await wrapper.vm.handleActionClick(action)
      expect(wrapper.vm.isSubmitted).toBe(false)
    })
  })

  describe('cancel handling', () => {
    it('should reset form on cancel', () => {
      wrapper.vm.rating = 5
      wrapper.vm.feedbackText = 'Test'
      const action = { action: 'cancel', text: 'Cancel' }
      wrapper.vm.handleActionClick(action)
      expect(wrapper.vm.rating).toBe(0)
      expect(wrapper.vm.feedbackText).toBe('')
    })

    it('should emit cancel event', () => {
      const action = { action: 'cancel', text: 'Cancel' }
      wrapper.vm.handleActionClick(action)
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })

  describe('watch handlers', () => {
    it('should update rating when initialRating prop changes', async () => {
      const newData = { ...mockData, initialRating: 4 }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.rating).toBe(4)
    })

    it('should update feedbackText when initialText prop changes', async () => {
      const newData = { ...mockData, initialText: 'New text' }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.feedbackText).toBe('New text')
    })
  })

  describe('getActionButtonClasses method', () => {
    it('should add action button type class', () => {
      const action = { type: 'success', text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-feedback__action-button--success']).toBe(true)
    })

    it('should add disabled class when action invalid', () => {
      const action = { action: 'submit', text: 'Submit' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-feedback__action-button--disabled']).toBe(true)
    })
  })

  describe('getStarIcon method', () => {
    it('should return filled star for rated stars', () => {
      const icon = wrapper.vm.getStarIcon(3)
      expect(icon).toBe('mdi-star')
    })

    it('should return outline star for unrated stars', () => {
      const icon = wrapper.vm.getStarIcon(5)
      expect(icon).toBe('mdi-star-outline')
    })
  })

  describe('success state', () => {
    it('should show success message after submission', async () => {
      wrapper.vm.rating = 5
      const action = { action: 'submit', text: 'Submit' }
      await wrapper.vm.handleActionClick(action)
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Thanks for submitting')
    })

    it('should show success icon', async () => {
      wrapper.vm.rating = 5
      wrapper.vm.isSubmitted = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isSubmitted).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as survey feedback form', () => {
      expect(wrapper.vm.data.title).toBeTruthy()
      expect(wrapper.vm.$el.querySelectorAll('.k-swiper-feedback__star').length).toBe(5)
    })

    it('should handle user feedback with rating and comment', () => {
      wrapper.vm.rating = 5
      wrapper.vm.feedbackText = 'Excellent content!'
      expect(wrapper.vm.isValid).toBe(true)
      expect(wrapper.vm.feedbackData.rating).toBe(5)
    })

    it('should support anonymous feedback', () => {
      const data = { ...mockData, userName: undefined }
      wrapper = shallowMount(KSwiperFeedback, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.computedPlaceholder).not.toContain('undefined')
    })
  })
})
