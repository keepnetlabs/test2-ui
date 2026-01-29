import { shallowMount } from '@vue/test-utils'
import KSwiperSlide from '@/components/Common/Swiper/KSwiperSlide.vue'

describe('KSwiperSlide.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(KSwiperSlide, {
      stubs: {
        'swiper-slide': true
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
      expect(wrapper.vm.$options.name).toBe('KSwiperSlide')
    })
  })

  describe('props handling', () => {
    it('should have type prop default "default"', () => {
      expect(wrapper.vm.$options.props.type.default).toBe('default')
    })

    it('should have centered prop default false', () => {
      expect(wrapper.vm.$options.props.centered.default).toBe(false)
    })

    it('should accept custom type', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('html')
    })

    it('should accept centered as true', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { centered: true },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.centered).toBe(true)
    })
  })

  describe('computed slideClasses', () => {
    it('should have k-swiper-slide class always', () => {
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide']).toBe(true)
    })

    it('should have type-specific class when type provided', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--html']).toBe(true)
    })

    it('should not have type-specific class for default type', () => {
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--default']).toBeUndefined()
    })

    it('should have centered class when centered true', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { centered: true },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--centered']).toBe(true)
    })

    it('should not have centered class when centered false', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { centered: false },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--centered']).toBe(false)
    })
  })

  describe('slide types', () => {
    it('should support html type', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('html')
      expect(wrapper.vm.slideClasses['k-swiper-slide--html']).toBe(true)
    })

    it('should support youtube type', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'youtube' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('youtube')
      expect(wrapper.vm.slideClasses['k-swiper-slide--youtube']).toBe(true)
    })

    it('should support video type', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'video' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('video')
      expect(wrapper.vm.slideClasses['k-swiper-slide--video']).toBe(true)
    })

    it('should support quiz type', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'quiz' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('quiz')
      expect(wrapper.vm.slideClasses['k-swiper-slide--quiz']).toBe(true)
    })

    it('should support default type', () => {
      expect(wrapper.vm.type).toBe('default')
      expect(wrapper.vm.slideClasses['k-swiper-slide--default']).toBeUndefined()
    })
  })

  describe('slot rendering', () => {
    it('should render slot content', () => {
      wrapper = shallowMount(KSwiperSlide, {
        slots: {
          default: '<div>Slide Content</div>'
        },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.text()).toContain('Slide Content')
    })

    it('should render html type slot', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        slots: {
          default: '<h1>HTML Content</h1>'
        },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.text()).toContain('HTML Content')
    })

    it('should render youtube type slot', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'youtube' },
        slots: {
          default: '<iframe>YouTube</iframe>'
        },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('youtube')
    })

    it('should render video type slot', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'video' },
        slots: {
          default: '<video>Video</video>'
        },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('video')
    })

    it('should render quiz type slot', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'quiz' },
        slots: {
          default: '<div>Quiz</div>'
        },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('quiz')
    })
  })

  describe('layout options', () => {
    it('should support centered layout', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { centered: true },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--centered']).toBe(true)
    })

    it('should default to non-centered layout', () => {
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--centered']).toBe(false)
    })

    it('should combine type and centered classes', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html', centered: true },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide']).toBe(true)
      expect(classes['k-swiper-slide--html']).toBe(true)
      expect(classes['k-swiper-slide--centered']).toBe(true)
    })
  })

  describe('data attributes', () => {
    it('should set data-type attribute', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('html')
    })

    it('should have correct data-type for different types', () => {
      const types = ['html', 'youtube', 'video', 'quiz', 'default']
      types.forEach((type) => {
        wrapper = shallowMount(KSwiperSlide, {
          propsData: { type },
          stubs: { 'swiper-slide': true }
        })
        expect(wrapper.vm.type).toBe(type)
      })
    })
  })

  describe('reactivity', () => {
    it('should update when type prop changes', async () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('html')

      await wrapper.setProps({ type: 'video' })
      expect(wrapper.vm.type).toBe('video')
      expect(wrapper.vm.slideClasses['k-swiper-slide--video']).toBe(true)
    })

    it('should update when centered prop changes', async () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { centered: false },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.slideClasses['k-swiper-slide--centered']).toBe(false)

      await wrapper.setProps({ centered: true })
      expect(wrapper.vm.slideClasses['k-swiper-slide--centered']).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as simple HTML slide', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'html' },
        slots: { default: '<p>HTML Content</p>' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('html')
      expect(wrapper.text()).toContain('HTML Content')
    })

    it('should work as centered YouTube slide', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'youtube', centered: true },
        stubs: { 'swiper-slide': true }
      })
      const classes = wrapper.vm.slideClasses
      expect(classes['k-swiper-slide--youtube']).toBe(true)
      expect(classes['k-swiper-slide--centered']).toBe(true)
    })

    it('should work as video slide', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'video' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('video')
    })

    it('should work as quiz slide', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'quiz' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('quiz')
    })

    it('should work as default content slide', () => {
      wrapper = shallowMount(KSwiperSlide, {
        slots: { default: '<div>Default Content</div>' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.text()).toContain('Default Content')
    })
  })

  describe('class generation', () => {
    it('should generate correct classes for all type combinations', () => {
      const types = ['html', 'youtube', 'video', 'quiz', 'default']
      types.forEach((type) => {
        wrapper = shallowMount(KSwiperSlide, {
          propsData: { type },
          stubs: { 'swiper-slide': true }
        })
        const classes = wrapper.vm.slideClasses
        expect(classes['k-swiper-slide']).toBe(true)
        if (type !== 'default') {
          expect(classes[`k-swiper-slide--${type}`]).toBe(true)
        }
      })
    })
  })

  describe('extensibility', () => {
    it('should support custom types for future extensibility', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'custom' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('custom')
      expect(wrapper.vm.slideClasses['k-swiper-slide--custom']).toBe(true)
    })

    it('should handle unknown types gracefully', () => {
      wrapper = shallowMount(KSwiperSlide, {
        propsData: { type: 'unknown-type' },
        stubs: { 'swiper-slide': true }
      })
      expect(wrapper.vm.type).toBe('unknown-type')
    })
  })
})
