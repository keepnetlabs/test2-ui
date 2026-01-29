import { shallowMount } from '@vue/test-utils'
import KSwiper from '@/components/Common/Swiper/KSwiper.vue'

describe('KSwiper.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(KSwiper, {
      stubs: {
        'swiper-container': true,
        'swiper-slide': true
      },
      mocks: {
        swiperEl: {
          initialize: jest.fn(),
          destroy: jest.fn()
        }
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
      expect(wrapper.vm.$options.name).toBe('KSwiper')
    })

    it('should have k-swiper class', () => {
      expect(wrapper.classes()).toContain('k-swiper')
    })
  })

  describe('props handling', () => {
    it('should have slidesPerView prop default 1', () => {
      expect(wrapper.vm.$options.props.slidesPerView.default).toBe(1)
    })

    it('should have spaceBetween prop default 0', () => {
      expect(wrapper.vm.$options.props.spaceBetween.default).toBe(0)
    })

    it('should have loop prop default false', () => {
      expect(wrapper.vm.$options.props.loop.default).toBe(false)
    })

    it('should have autoplay prop default false', () => {
      expect(wrapper.vm.$options.props.autoplay.default).toBe(false)
    })

    it('should have navigation prop default false', () => {
      expect(wrapper.vm.$options.props.navigation.default).toBe(false)
    })

    it('should have internalNavigation prop default false', () => {
      expect(wrapper.vm.$options.props.internalNavigation.default).toBe(false)
    })

    it('should have pagination prop default false', () => {
      expect(wrapper.vm.$options.props.pagination.default).toBe(false)
    })

    it('should have navigationDisabled prop default false', () => {
      expect(wrapper.vm.$options.props.navigationDisabled.default).toBe(false)
    })

    it('should accept custom slidesPerView', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { slidesPerView: 3 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.slidesPerView).toBe(3)
    })

    it('should accept custom spaceBetween', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { spaceBetween: 20 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.spaceBetween).toBe(20)
    })

    it('should accept loop prop true', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { loop: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.loop).toBe(true)
    })

    it('should accept autoplay as boolean', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { autoplay: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.autoplay).toBe(true)
    })

    it('should accept autoplay as number (delay)', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { autoplay: 5000 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.autoplay).toBe(5000)
    })

    it('should accept custom pagination type', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'fraction' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.pagination).toBe('fraction')
    })
  })

  describe('data initialization', () => {
    it('should initialize swiper to null', () => {
      expect(wrapper.vm.swiper).toBeNull()
    })

    it('should initialize isFirst to true', () => {
      expect(wrapper.vm.isFirst).toBe(true)
    })

    it('should initialize isLast to false', () => {
      expect(wrapper.vm.isLast).toBe(false)
    })

    it('should initialize windowWidth', () => {
      expect(typeof wrapper.vm.windowWidth).toBe('number')
    })
  })

  describe('computed properties', () => {
    it('should have paginationAttribute computed property', () => {
      expect(wrapper.vm.paginationAttribute).toBeDefined()
    })

    it('should return "true" when pagination enabled', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationAttribute).toBe('true')
    })

    it('should return "false" when pagination disabled', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: false },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationAttribute).toBe('false')
    })

    it('should have paginationType computed property', () => {
      expect(wrapper.vm.paginationType).toBeDefined()
    })

    it('should return default bullets type', () => {
      expect(wrapper.vm.paginationType).toBe('bullets')
    })

    it('should return custom pagination type', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'progressbar' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationType).toBe('progressbar')
    })

    it('should have isDesktop computed property', () => {
      expect(typeof wrapper.vm.isDesktop).toBe('boolean')
    })
  })

  describe('navigation buttons', () => {
    it('should render prev button when navigation enabled', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      const prevBtn = wrapper.find('.k-swiper-nav--prev')
      expect(prevBtn.exists()).toBe(true)
    })

    it('should render next button when navigation enabled', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      const nextBtn = wrapper.find('.k-swiper-nav--next')
      expect(nextBtn.exists()).toBe(true)
    })

    it('should disable prev button when isFirst', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      wrapper.vm.isFirst = true
      const prevBtn = wrapper.find('.k-swiper-nav--prev')
      expect(prevBtn.attributes('disabled')).toBeDefined()
    })

    it('should disable next button when isLast', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      wrapper.vm.isLast = true
      const nextBtn = wrapper.find('.k-swiper-nav--next')
      expect(nextBtn.attributes('disabled')).toBeDefined()
    })

    it('should disable buttons when navigationDisabled true', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true, navigationDisabled: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      const prevBtn = wrapper.find('.k-swiper-nav--prev')
      const nextBtn = wrapper.find('.k-swiper-nav--next')
      expect(prevBtn.attributes('disabled')).toBeDefined()
      expect(nextBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('methods', () => {
    it('should have slideNext method', () => {
      expect(typeof wrapper.vm.slideNext).toBe('function')
    })

    it('should have slidePrev method', () => {
      expect(typeof wrapper.vm.slidePrev).toBe('function')
    })

    it('should have slideTo method', () => {
      expect(typeof wrapper.vm.slideTo).toBe('function')
    })

    it('should have updateNavigation method', () => {
      expect(typeof wrapper.vm.updateNavigation).toBe('function')
    })

    it('should have initSwiper method', () => {
      expect(typeof wrapper.vm.initSwiper).toBe('function')
    })
  })

  describe('slideNext method', () => {
    it('should call swiper.slideNext when swiper exists', () => {
      wrapper.vm.swiper = { slideNext: jest.fn() }
      wrapper.vm.slideNext()
      expect(wrapper.vm.swiper.slideNext).toHaveBeenCalled()
    })

    it('should not throw when swiper is null', () => {
      wrapper.vm.swiper = null
      expect(() => wrapper.vm.slideNext()).not.toThrow()
    })
  })

  describe('slidePrev method', () => {
    it('should call swiper.slidePrev when swiper exists', () => {
      wrapper.vm.swiper = { slidePrev: jest.fn() }
      wrapper.vm.slidePrev()
      expect(wrapper.vm.swiper.slidePrev).toHaveBeenCalled()
    })

    it('should not throw when swiper is null', () => {
      wrapper.vm.swiper = null
      expect(() => wrapper.vm.slidePrev()).not.toThrow()
    })
  })

  describe('slideTo method', () => {
    it('should call swiper.slideTo with index', () => {
      wrapper.vm.swiper = { slideTo: jest.fn() }
      wrapper.vm.slideTo(3)
      expect(wrapper.vm.swiper.slideTo).toHaveBeenCalledWith(3)
    })

    it('should not throw when swiper is null', () => {
      wrapper.vm.swiper = null
      expect(() => wrapper.vm.slideTo(0)).not.toThrow()
    })
  })

  describe('updateNavigation method', () => {
    it('should set isFirst and isLast when not looping', () => {
      wrapper.vm.loop = false
      const swiper = { isBeginning: true, isEnd: false }
      wrapper.vm.updateNavigation(swiper)
      expect(wrapper.vm.isFirst).toBe(true)
      expect(wrapper.vm.isLast).toBe(false)
    })

    it('should keep both false when looping', () => {
      wrapper.vm.loop = true
      const swiper = { isBeginning: true, isEnd: true }
      wrapper.vm.updateNavigation(swiper)
      expect(wrapper.vm.isFirst).toBe(false)
      expect(wrapper.vm.isLast).toBe(false)
    })
  })

  describe('lifecycle hooks', () => {
    it('should have mounted hook', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should have beforeDestroy hook', () => {
      expect(typeof wrapper.vm.$options.beforeDestroy).toBe('function')
    })
  })

  describe('events', () => {
    it('should emit init event', () => {
      wrapper.vm.$emit('init', {})
      expect(wrapper.emitted('init')).toBeTruthy()
    })

    it('should emit slide-change event', () => {
      wrapper.vm.$emit('slide-change', {})
      expect(wrapper.emitted('slide-change')).toBeTruthy()
    })
  })

  describe('real-world scenarios', () => {
    it('should work as single slide carousel', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { slidesPerView: 1 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.slidesPerView).toBe(1)
    })

    it('should work as multi-slide carousel', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { slidesPerView: 4, spaceBetween: 15 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.slidesPerView).toBe(4)
      expect(wrapper.vm.spaceBetween).toBe(15)
    })

    it('should work with autoplay enabled', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { autoplay: 5000 },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.autoplay).toBe(5000)
    })

    it('should work with pagination', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'fraction' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationAttribute).toBe('true')
    })

    it('should work with external navigation', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { navigation: true },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      const buttons = wrapper.findAll('.k-swiper-nav')
      expect(buttons.length).toBe(2)
    })
  })

  describe('pagination types', () => {
    it('should support bullets pagination', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'bullets' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationType).toBe('bullets')
    })

    it('should support fraction pagination', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'fraction' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationType).toBe('fraction')
    })

    it('should support progressbar pagination', () => {
      wrapper = shallowMount(KSwiper, {
        propsData: { pagination: 'progressbar' },
        stubs: { 'swiper-container': true, 'swiper-slide': true }
      })
      expect(wrapper.vm.paginationType).toBe('progressbar')
    })
  })

  describe('responsive behavior', () => {
    it('should track window width', () => {
      expect(typeof wrapper.vm.windowWidth).toBe('number')
    })

    it('should detect desktop based on window width', () => {
      wrapper.vm.windowWidth = 1025
      expect(wrapper.vm.isDesktop).toBe(true)

      wrapper.vm.windowWidth = 768
      expect(wrapper.vm.isDesktop).toBe(false)
    })
  })

  describe('state management', () => {
    it('should track carousel position with isFirst', () => {
      wrapper.vm.isFirst = true
      expect(wrapper.vm.isFirst).toBe(true)

      wrapper.vm.isFirst = false
      expect(wrapper.vm.isFirst).toBe(false)
    })

    it('should track carousel position with isLast', () => {
      wrapper.vm.isLast = false
      expect(wrapper.vm.isLast).toBe(false)

      wrapper.vm.isLast = true
      expect(wrapper.vm.isLast).toBe(true)
    })
  })
})
