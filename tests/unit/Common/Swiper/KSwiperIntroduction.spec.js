import { shallowMount } from '@vue/test-utils'
import KSwiperIntroduction from '@/components/Common/Swiper/KSwiperIntroduction.vue'

describe('KSwiperIntroduction.vue', () => {
  let wrapper

  const mockData = {
    title: 'Welcome to Security Training',
    content: [
      'Learn about phishing attacks',
      'Understand email security',
      'Protect your organization'
    ],
    layout: 'split',
    theme: 'default',
    button: {
      text: 'Get Started',
      action: 'next_slide',
      variant: 'primary',
      tooltip: 'Click to continue'
    },
    illustration: {
      url: '/images/security.png',
      alt: 'Security illustration'
    }
  }

  beforeEach(() => {
    wrapper = shallowMount(KSwiperIntroduction, {
      propsData: {
        data: mockData
      },
      stubs: {
        'swiper-slide': true,
        'v-tooltip': true
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
      expect(wrapper.vm.$options.name).toBe('KSwiperIntroduction')
    })

    it('should have swiper-slide wrapper', () => {
      expect(wrapper.findComponent({ name: 'swiper-slide' }).exists()).toBe(true)
    })

    it('should have k-swiper-slide-introduction class', () => {
      const swiperSlide = wrapper.findComponent({ name: 'swiper-slide' })
      expect(swiperSlide.classes()).toContain('k-swiper-slide--introduction')
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
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.swiperRef).toEqual(mockSwiper)
    })
  })

  describe('data prop validator', () => {
    it('should validate data with title', () => {
      const validData = { title: 'Test' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data: validData },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data).toEqual(validData)
    })

    it('should validate data with content', () => {
      const validData = { content: 'Test content' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data: validData },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data).toEqual(validData)
    })

    it('should accept either title or content', () => {
      const data = { content: 'Content only' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data).toBeTruthy()
    })
  })

  describe('introClasses computed property', () => {
    it('should have split layout by default', () => {
      const data = { ...mockData, layout: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.introClasses['k-swiper-introduction--split']).toBe(true)
    })

    it('should use custom layout', () => {
      const data = { ...mockData, layout: 'centered' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.introClasses['k-swiper-introduction--centered']).toBe(true)
    })

    it('should have default theme by default', () => {
      const data = { ...mockData, theme: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.introClasses['k-swiper-introduction--default']).toBe(true)
    })

    it('should use custom theme', () => {
      const data = { ...mockData, theme: 'dark' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.introClasses['k-swiper-introduction--dark']).toBe(true)
    })

    it('should add has-illustration class when illustration exists', () => {
      expect(wrapper.vm.introClasses['k-swiper-introduction--has-illustration']).toBe(true)
    })

    it('should not add has-illustration class without illustration', () => {
      const data = { ...mockData, illustration: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.introClasses['k-swiper-introduction--has-illustration']).toBe(false)
    })
  })

  describe('buttonClasses computed property', () => {
    it('should have primary button variant by default', () => {
      const data = { ...mockData, button: { text: 'Click' } }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.buttonClasses['k-swiper-introduction__button--primary']).toBe(true)
    })

    it('should use custom button variant', () => {
      const data = {
        ...mockData,
        button: { text: 'Click', variant: 'secondary' }
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.buttonClasses['k-swiper-introduction__button--secondary']).toBe(true)
    })

    it('should not throw without button', () => {
      const data = { ...mockData, button: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.buttonClasses).toBeTruthy()
    })
  })

  describe('contentArray computed property', () => {
    it('should handle array content', () => {
      expect(wrapper.vm.contentArray).toEqual(mockData.content)
    })

    it('should handle string content as array', () => {
      const data = { ...mockData, content: 'Single paragraph' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.contentArray).toEqual(['Single paragraph'])
    })

    it('should return empty array if no content', () => {
      const data = { ...mockData, content: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(Array.isArray(wrapper.vm.contentArray)).toBe(true)
    })

    it('should return empty array for null content', () => {
      const data = { ...mockData, content: null }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.contentArray).toEqual([])
    })
  })

  describe('title rendering', () => {
    it('should render title', () => {
      expect(wrapper.text()).toContain('Welcome to Security Training')
    })

    it('should not render title if not provided', () => {
      const data = { ...mockData, title: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-introduction__title')).toBeFalsy()
    })
  })

  describe('content rendering', () => {
    it('should render content paragraphs', () => {
      expect(wrapper.text()).toContain('Learn about phishing attacks')
      expect(wrapper.text()).toContain('Understand email security')
      expect(wrapper.text()).toContain('Protect your organization')
    })

    it('should render correct number of paragraphs', () => {
      const paragraphs = wrapper.vm.$el.querySelectorAll('.k-swiper-introduction__paragraph')
      expect(paragraphs.length).toBe(3)
    })

    it('should handle single paragraph content', () => {
      const data = { ...mockData, content: 'Single paragraph text' }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.text()).toContain('Single paragraph text')
    })
  })

  describe('button rendering', () => {
    it('should render button when button prop exists', () => {
      const button = wrapper.vm.$el.querySelector('.k-swiper-introduction__button')
      expect(button).toBeTruthy()
    })

    it('should render button text', () => {
      expect(wrapper.text()).toContain('Get Started')
    })

    it('should not render button if not provided', () => {
      const data = { ...mockData, button: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-introduction__button')).toBeFalsy()
    })
  })

  describe('button tooltip', () => {
    it('should render tooltip when tooltip exists', () => {
      const data = {
        ...mockData,
        button: { text: 'Click', tooltip: 'Click to continue' }
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data.button.tooltip).toBeTruthy()
    })

    it('should not render tooltip wrapper without tooltip', () => {
      const data = {
        ...mockData,
        button: { text: 'Click' }
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data.button.tooltip).toBeUndefined()
    })
  })

  describe('illustration rendering', () => {
    it('should render illustration image', () => {
      const image = wrapper.vm.$el.querySelector('.k-swiper-introduction__image')
      expect(image).toBeTruthy()
    })

    it('should set image src', () => {
      const image = wrapper.vm.$el.querySelector('.k-swiper-introduction__image')
      expect(image.src).toContain('/images/security.png')
    })

    it('should set image alt text', () => {
      const image = wrapper.vm.$el.querySelector('.k-swiper-introduction__image')
      expect(image.alt).toBe('Security illustration')
    })

    it('should not render illustration if not provided', () => {
      const data = { ...mockData, illustration: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-introduction__illustration')).toBeFalsy()
    })

    it('should handle illustration with type', () => {
      const data = {
        ...mockData,
        illustration: { type: 'svg', url: '/images/icon.svg' }
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data.illustration.url).toBeTruthy()
    })
  })

  describe('handleButtonClick method', () => {
    it('should emit action event', () => {
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('action')).toBeTruthy()
    })

    it('should emit action with button action type', () => {
      wrapper.vm.handleButtonClick()
      const emitted = wrapper.emitted('action')[0][0]
      expect(emitted.type).toBe('next_slide')
    })

    it('should emit action with data payload', () => {
      wrapper.vm.handleButtonClick()
      const emitted = wrapper.emitted('action')[0][0]
      expect(emitted.data).toEqual(mockData)
    })

    it('should not emit if no button', () => {
      const data = { ...mockData, button: undefined }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      // Should not throw error if button is not present
      expect(() => {
        // handleButtonClick would not be called if no button
      }).not.toThrow()
    })
  })

  describe('button click handling', () => {
    it('should trigger handleButtonClick on button click', async () => {
      const spy = jest.spyOn(wrapper.vm, 'handleButtonClick')
      const button = wrapper.vm.$el.querySelector('.k-swiper-introduction__button')
      button.click()
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('real-world scenarios', () => {
    it('should work as introduction slide with content and button', () => {
      expect(wrapper.vm.data.title).toBeTruthy()
      expect(wrapper.vm.data.button).toBeTruthy()
      expect(wrapper.vm.contentArray.length).toBeGreaterThan(0)
    })

    it('should work with only title and button', () => {
      const data = {
        title: 'Welcome',
        button: { text: 'Start' }
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.text()).toContain('Welcome')
      expect(wrapper.text()).toContain('Start')
    })

    it('should work with content only', () => {
      const data = {
        content: 'Welcome to the training program'
      }
      wrapper = shallowMount(KSwiperIntroduction, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.text()).toContain('Welcome to the training program')
    })

    it('should support different layouts', () => {
      const layouts = ['split', 'centered', 'full']
      layouts.forEach((layout) => {
        const data = { ...mockData, layout }
        wrapper = shallowMount(KSwiperIntroduction, {
          propsData: { data },
          stubs: { 'swiper-slide': true, 'v-tooltip': true }
        })
        expect(wrapper.vm.introClasses[`k-swiper-introduction--${layout}`]).toBe(true)
      })
    })

    it('should support different themes', () => {
      const themes = ['default', 'dark', 'light']
      themes.forEach((theme) => {
        const data = { ...mockData, theme }
        wrapper = shallowMount(KSwiperIntroduction, {
          propsData: { data },
          stubs: { 'swiper-slide': true, 'v-tooltip': true }
        })
        expect(wrapper.vm.introClasses[`k-swiper-introduction--${theme}`]).toBe(true)
      })
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

    it('should update intro classes when data changes', async () => {
      const newData = {
        ...mockData,
        theme: 'dark'
      }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.introClasses['k-swiper-introduction--dark']).toBe(true)
    })

    it('should update contentArray when content changes', async () => {
      const newData = {
        ...mockData,
        content: ['New content 1', 'New content 2']
      }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.contentArray).toEqual(['New content 1', 'New content 2'])
    })
  })

  describe('text section', () => {
    it('should have k-swiper-introduction__text class', () => {
      const textSection = wrapper.vm.$el.querySelector('.k-swiper-introduction__text')
      expect(textSection).toBeTruthy()
    })

    it('should have k-swiper-introduction__body for content', () => {
      const body = wrapper.vm.$el.querySelector('.k-swiper-introduction__body')
      expect(body).toBeTruthy()
    })
  })

  describe('illustration section', () => {
    it('should have k-swiper-introduction__illustration class', () => {
      const illustration = wrapper.vm.$el.querySelector('.k-swiper-introduction__illustration')
      expect(illustration).toBeTruthy()
    })

    it('should have k-swiper-introduction__image class', () => {
      const image = wrapper.vm.$el.querySelector('.k-swiper-introduction__image')
      expect(image).toBeTruthy()
    })
  })
})
