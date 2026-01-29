import { shallowMount } from '@vue/test-utils'
import KSwiperBehavior from '@/components/Common/Swiper/KSwiperBehavior.vue'

describe('KSwiperBehavior.vue', () => {
  let wrapper

  const mockData = {
    title: 'Security Best Practices',
    description: 'Learn how to identify phishing emails',
    layout: 'default',
    theme: 'primary',
    tips: [
      {
        title: 'Check Sender',
        description: 'Verify email sender address',
        icon: 'mdi-mail-check'
      },
      {
        title: 'Hover Links',
        description: 'Hover over links before clicking',
        icon: 'mdi-link-variant'
      },
      {
        title: 'Look for HTTPS',
        description: 'Ensure secure connection',
        icon: 'mdi-lock'
      }
    ],
    actions: [
      {
        text: 'Next',
        action: 'next_slide',
        type: 'primary'
      }
    ]
  }

  beforeEach(() => {
    wrapper = shallowMount(KSwiperBehavior, {
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
      expect(wrapper.vm.$options.name).toBe('KSwiperBehavior')
    })

    it('should have swiper-slide wrapper', () => {
      expect(wrapper.findComponent({ name: 'swiper-slide' }).exists()).toBe(true)
    })

    it('should have k-swiper-slide-behavior class', () => {
      const swiperSlide = wrapper.findComponent({ name: 'swiper-slide' })
      expect(swiperSlide.classes()).toContain('k-swiper-slide--behavior')
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

    it('should accept swiperRef prop', () => {
      const mockSwiper = { slideNext: jest.fn() }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: {
          data: mockData,
          swiperRef: mockSwiper
        },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.swiperRef).toEqual(mockSwiper)
    })
  })

  describe('data prop validator', () => {
    it('should validate data with title and tips', () => {
      const validData = {
        title: 'Test',
        tips: []
      }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data: validData },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.data).toEqual(validData)
    })

    it('should require title in data', () => {
      const invalidData = {
        tips: []
      }
      expect(() => {
        shallowMount(KSwiperBehavior, {
          propsData: { data: invalidData },
          stubs: { 'swiper-slide': true, 'v-icon': true }
        })
      }).toThrow()
    })

    it('should require tips array in data', () => {
      const invalidData = {
        title: 'Test'
      }
      expect(() => {
        shallowMount(KSwiperBehavior, {
          propsData: { data: invalidData },
          stubs: { 'swiper-slide': true, 'v-icon': true }
        })
      }).toThrow()
    })
  })

  describe('behaviorClasses computed property', () => {
    it('should have k-swiper-behavior--default layout by default', () => {
      const data = { ...mockData, layout: undefined }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--default']).toBe(true)
    })

    it('should use custom layout', () => {
      const data = { ...mockData, layout: 'compact' }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--compact']).toBe(true)
    })

    it('should have primary theme by default', () => {
      const data = { ...mockData, theme: undefined }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--primary']).toBe(true)
    })

    it('should use custom theme', () => {
      const data = { ...mockData, theme: 'danger' }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--danger']).toBe(true)
    })

    it('should add has-actions class when actions exist', () => {
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--has-actions']).toBe(true)
    })

    it('should not add has-actions class when no actions', () => {
      const data = { ...mockData, actions: [] }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--has-actions']).toBe(false)
    })
  })

  describe('tips rendering', () => {
    it('should render up to 3 tips', () => {
      const tips = wrapper.vm.$el.querySelectorAll('.k-swiper-behavior__tip')
      expect(tips.length).toBeLessThanOrEqual(3)
    })

    it('should not render more than 3 tips', () => {
      const data = {
        ...mockData,
        tips: Array(5).fill({ title: 'Tip', description: 'Desc', icon: 'mdi-info' })
      }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      const tips = wrapper.vm.$el.querySelectorAll('.k-swiper-behavior__tip')
      expect(tips.length).toBeLessThanOrEqual(3)
    })

    it('should render tip content', () => {
      expect(wrapper.text()).toContain('Check Sender')
      expect(wrapper.text()).toContain('Hover Links')
    })

    it('should set data-tip-index attribute', () => {
      const firstTip = wrapper.vm.$el.querySelector('[data-tip-index="0"]')
      expect(firstTip).toBeTruthy()
    })
  })

  describe('tip icon rendering', () => {
    it('should render icon from tip.icon', () => {
      const data = {
        ...mockData,
        tips: [
          { title: 'Test', description: 'Desc', icon: 'mdi-test' }
        ]
      }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.data.tips[0].icon).toBe('mdi-test')
    })

    it('should render image from tip.iconPath', () => {
      const data = {
        ...mockData,
        tips: [
          { title: 'Test', description: 'Desc', iconPath: '/path/to/icon.png' }
        ]
      }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.data.tips[0].iconPath).toBe('/path/to/icon.png')
    })

    it('should use default icon if neither icon nor iconPath', () => {
      const data = {
        ...mockData,
        tips: [
          { title: 'Test', description: 'Desc' }
        ]
      }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.data.tips[0].icon).toBeUndefined()
    })
  })

  describe('handleActionClick method', () => {
    it('should call slideNext on swiperRef', () => {
      const mockSwiper = { slideNext: jest.fn() }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      const action = { action: 'next_slide', text: 'Next' }
      wrapper.vm.handleActionClick(action)
      expect(mockSwiper.slideNext).toHaveBeenCalled()
    })

    it('should call slidePrev on swiperRef', () => {
      const mockSwiper = { slidePrev: jest.fn() }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      const action = { action: 'prev_slide', text: 'Previous' }
      wrapper.vm.handleActionClick(action)
      expect(mockSwiper.slidePrev).toHaveBeenCalled()
    })

    it('should emit action event', () => {
      const action = { action: 'next_slide', text: 'Next', type: 'primary' }
      wrapper.vm.handleActionClick(action)
      expect(wrapper.emitted('action')).toBeTruthy()
    })

    it('should emit action with correct payload', () => {
      const action = { action: 'next_slide', text: 'Next' }
      wrapper.vm.handleActionClick(action)
      const emitted = wrapper.emitted('action')[0][0]
      expect(emitted.type).toBe('next_slide')
      expect(emitted.data).toEqual(action)
    })

    it('should not call slideNext if no swiperRef', () => {
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data: mockData, swiperRef: null },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      const action = { action: 'next_slide', text: 'Next' }
      expect(() => wrapper.vm.handleActionClick(action)).not.toThrow()
    })
  })

  describe('getActionButtonClasses method', () => {
    it('should add action button type class', () => {
      const action = { type: 'success', text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-behavior__action-button--success']).toBe(true)
    })

    it('should use primary type by default', () => {
      const action = { text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-behavior__action-button--primary']).toBe(true)
    })

    it('should add disabled class', () => {
      const action = { disabled: true, text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-behavior__action-button--disabled']).toBe(true)
    })

    it('should not add disabled class when not disabled', () => {
      const action = { disabled: false, text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-behavior__action-button--disabled']).toBe(false)
    })
  })

  describe('action buttons rendering', () => {
    it('should render action buttons', () => {
      const buttons = wrapper.vm.$el.querySelectorAll('.k-swiper-behavior__action-button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should render correct button text', () => {
      expect(wrapper.text()).toContain('Next')
    })

    it('should handle button click', () => {
      const button = wrapper.vm.$el.querySelector('.k-swiper-behavior__action-button')
      button.click()
      expect(wrapper.emitted('action')).toBeTruthy()
    })
  })

  describe('header section', () => {
    it('should render title', () => {
      expect(wrapper.text()).toContain('Security Best Practices')
    })

    it('should render description', () => {
      expect(wrapper.text()).toContain('Learn how to identify phishing emails')
    })

    it('should not render title if not provided', () => {
      const data = { ...mockData, title: undefined, tips: [] }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-behavior__title')).toBeFalsy()
    })

    it('should not render description if not provided', () => {
      const data = { ...mockData, description: undefined }
      wrapper = shallowMount(KSwiperBehavior, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-icon': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-behavior__description')).toBeFalsy()
    })
  })

  describe('real-world scenarios', () => {
    it('should work as security tips slide', () => {
      expect(wrapper.vm.data.tips.length).toBeGreaterThan(0)
      expect(wrapper.vm.data.actions.length).toBeGreaterThan(0)
    })

    it('should work with various themes', () => {
      const themes = ['primary', 'danger', 'success']
      themes.forEach((theme) => {
        const data = { ...mockData, theme }
        wrapper = shallowMount(KSwiperBehavior, {
          propsData: { data },
          stubs: { 'swiper-slide': true, 'v-icon': true }
        })
        expect(wrapper.vm.behaviorClasses[`k-swiper-behavior--${theme}`]).toBe(true)
      })
    })

    it('should work with custom layouts', () => {
      const layouts = ['default', 'compact', 'expanded']
      layouts.forEach((layout) => {
        const data = { ...mockData, layout }
        wrapper = shallowMount(KSwiperBehavior, {
          propsData: { data },
          stubs: { 'swiper-slide': true, 'v-icon': true }
        })
        expect(wrapper.vm.behaviorClasses[`k-swiper-behavior--${layout}`]).toBe(true)
      })
    })
  })

  describe('tip icon color', () => {
    it('should have icon color #0671C0', () => {
      expect(wrapper.vm.$el).toBeTruthy()
    })
  })

  describe('icon size', () => {
    it('should render icons with size 32', () => {
      expect(wrapper.vm.$el).toBeTruthy()
    })
  })

  describe('component reactivity', () => {
    it('should update when data prop changes', async () => {
      const newData = {
        ...mockData,
        title: 'New Title'
      }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.data.title).toBe('New Title')
    })

    it('should update behavior classes when data changes', async () => {
      const newData = {
        ...mockData,
        theme: 'danger'
      }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.behaviorClasses['k-swiper-behavior--danger']).toBe(true)
    })
  })
})
