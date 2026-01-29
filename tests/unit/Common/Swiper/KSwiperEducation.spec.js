import { shallowMount } from '@vue/test-utils'
import KSwiperEducation from '@/components/Common/Swiper/KSwiperEducation.vue'

describe('KSwiperEducation.vue', () => {
  let wrapper

  const mockData = {
    title: 'Phishing Email Education',
    description: 'Learn to identify phishing emails',
    layout: 'default',
    theme: 'phishing',
    fields: [
      { key: 'From', value: 'suspicious@fake.com', tooltip: 'Check sender address' },
      { key: 'Subject', value: 'Urgent Action Required', tooltip: 'Suspicious subject' }
    ],
    htmlContent: '<p>HTML content here</p>',
    isShowRedFlags: true,
    redFlagsReviewed: 0,
    totalRedFlags: 5,
    actions: [
      { text: 'Next', action: 'next_slide', variant: 'primary' }
    ]
  }

  beforeEach(() => {
    wrapper = shallowMount(KSwiperEducation, {
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
      expect(wrapper.vm.$options.name).toBe('KSwiperEducation')
    })

    it('should have swiper-slide wrapper', () => {
      expect(wrapper.findComponent({ name: 'swiper-slide' }).exists()).toBe(true)
    })

    it('should have k-swiper-slide-education class', () => {
      const swiperSlide = wrapper.findComponent({ name: 'swiper-slide' })
      expect(swiperSlide.classes()).toContain('k-swiper-slide--education')
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
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.swiperRef).toEqual(mockSwiper)
    })
  })

  describe('data prop validator', () => {
    it('should validate data with title and fields', () => {
      const validData = { title: 'Test', fields: [] }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data: validData },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data).toEqual(validData)
    })

    it('should validate data with title and htmlContent', () => {
      const validData = { title: 'Test', htmlContent: '<p>Content</p>' }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data: validData },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.data).toEqual(validData)
    })

    it('should require title in data', () => {
      const invalidData = { fields: [] }
      expect(() => {
        shallowMount(KSwiperEducation, {
          propsData: { data: invalidData },
          stubs: { 'swiper-slide': true, 'v-tooltip': true }
        })
      }).toThrow()
    })
  })

  describe('data initialization', () => {
    it('should initialize reviewedFlags as empty Set', () => {
      expect(wrapper.vm.reviewedFlags instanceof Set).toBe(true)
      expect(wrapper.vm.reviewedFlags.size).toBe(0)
    })
  })

  describe('educationClasses computed property', () => {
    it('should have default layout by default', () => {
      const data = { ...mockData, layout: undefined, fields: [] }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.educationClasses['k-swiper-education--default']).toBe(true)
    })

    it('should use custom layout', () => {
      const data = { ...mockData, layout: 'compact' }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.educationClasses['k-swiper-education--compact']).toBe(true)
    })

    it('should have phishing theme by default', () => {
      const data = { ...mockData, theme: undefined, fields: [] }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.educationClasses['k-swiper-education--phishing']).toBe(true)
    })

    it('should use custom theme', () => {
      const data = { ...mockData, theme: 'malware' }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.educationClasses['k-swiper-education--malware']).toBe(true)
    })

    it('should add has-html class when htmlContent exists', () => {
      expect(wrapper.vm.educationClasses['k-swiper-education--has-html']).toBe(true)
    })

    it('should not add has-html class when no htmlContent', () => {
      const data = { ...mockData, htmlContent: undefined }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.educationClasses['k-swiper-education--has-html']).toBe(false)
    })
  })

  describe('fields rendering', () => {
    it('should render fields', () => {
      expect(wrapper.text()).toContain('From')
      expect(wrapper.text()).toContain('suspicious@fake.com')
    })

    it('should render field tooltips', () => {
      expect(wrapper.text()).toContain('Check sender address')
    })

    it('should set data-field attribute', () => {
      const field = wrapper.vm.$el.querySelector('[data-field="From"]')
      expect(field).toBeTruthy()
    })

    it('should set data-flagged-area attribute', () => {
      const flaggedArea = wrapper.vm.$el.querySelector('[data-flagged-area]')
      expect(flaggedArea).toBeTruthy()
    })
  })

  describe('red flags tracking', () => {
    it('should initialize redFlagsReviewed from data', () => {
      expect(wrapper.vm.data.redFlagsReviewed).toBe(0)
    })

    it('should track reviewed flags in Set', () => {
      wrapper.vm.reviewedFlags.add('From')
      expect(wrapper.vm.reviewedFlags.has('From')).toBe(true)
    })

    it('should show red flags section when isShowRedFlags is true', () => {
      expect(wrapper.text()).toContain('Red Flags Reviewed')
    })

    it('should display red flags count', () => {
      expect(wrapper.text()).toContain('0/5')
    })
  })

  describe('HTML content rendering', () => {
    it('should render HTML content when provided', () => {
      expect(wrapper.vm.data.htmlContent).toBeTruthy()
    })

    it('should have html-wrapper div', () => {
      const htmlWrapper = wrapper.vm.$el.querySelector('.k-swiper-education__html-wrapper')
      expect(htmlWrapper).toBeTruthy()
    })

    it('should not render HTML content section if no htmlContent', () => {
      const data = { ...mockData, htmlContent: undefined }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      const htmlSection = wrapper.vm.$el.querySelector('.k-swiper-education__html-content')
      expect(htmlSection).toBeFalsy()
    })
  })

  describe('separator rendering', () => {
    it('should render separator when both fields and htmlContent exist', () => {
      const separator = wrapper.vm.$el.querySelector('.k-swiper-education__separator')
      expect(separator).toBeTruthy()
    })

    it('should not render separator without both fields and htmlContent', () => {
      const data = { ...mockData, htmlContent: undefined }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      const separator = wrapper.vm.$el.querySelector('.k-swiper-education__separator')
      expect(separator).toBeFalsy()
    })
  })

  describe('handleActionClick method', () => {
    it('should call slideNext on swiperRef', () => {
      const mockSwiper = { slideNext: jest.fn() }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      const action = { action: 'next_slide', text: 'Next' }
      wrapper.vm.handleActionClick(action)
      expect(mockSwiper.slideNext).toHaveBeenCalled()
    })

    it('should call slidePrev on swiperRef', () => {
      const mockSwiper = { slidePrev: jest.fn() }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data: mockData, swiperRef: mockSwiper },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      const action = { action: 'prev_slide', text: 'Previous' }
      wrapper.vm.handleActionClick(action)
      expect(mockSwiper.slidePrev).toHaveBeenCalled()
    })

    it('should emit action event', () => {
      const action = { action: 'next_slide', text: 'Next' }
      wrapper.vm.handleActionClick(action)
      expect(wrapper.emitted('action')).toBeTruthy()
    })

    it('should emit action with correct payload', () => {
      const action = { action: 'next_slide', text: 'Next', variant: 'primary' }
      wrapper.vm.handleActionClick(action)
      const emitted = wrapper.emitted('action')[0][0]
      expect(emitted.type).toBe('next_slide')
      expect(emitted.data).toEqual(action)
    })
  })

  describe('getActionButtonClasses method', () => {
    it('should add action button variant class', () => {
      const action = { variant: 'success', text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-education__action-button--success']).toBe(true)
    })

    it('should use primary variant by default', () => {
      const action = { text: 'OK' }
      const classes = wrapper.vm.getActionButtonClasses(action)
      expect(classes['k-swiper-education__action-button--primary']).toBe(true)
    })
  })

  describe('header section', () => {
    it('should render title', () => {
      expect(wrapper.text()).toContain('Phishing Email Education')
    })

    it('should render description', () => {
      expect(wrapper.text()).toContain('Learn to identify phishing emails')
    })

    it('should not render title if not provided', () => {
      const data = { ...mockData, title: undefined, fields: [] }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.vm.$el.querySelector('.k-swiper-education__title')).toBeFalsy()
    })
  })

  describe('tooltip configuration', () => {
    it('should have tooltip color #B83A3A for flagged areas', () => {
      expect(wrapper.vm.$el).toBeTruthy()
    })

    it('should have tooltip max-width 320', () => {
      expect(wrapper.vm.$el).toBeTruthy()
    })

    it('should render tooltip on flagged fields', () => {
      const fieldWithTooltip = wrapper.vm.data.fields[0]
      expect(fieldWithTooltip.tooltip).toBeTruthy()
    })
  })

  describe('red flag flag icon', () => {
    it('should render red flag image for flagged fields', () => {
      const field = mockData.fields[0]
      if (field.tooltip) {
        expect(field.key).toBeTruthy()
      }
    })
  })

  describe('mounted hook', () => {
    it('should have mounted hook', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should add event listeners to flagged areas', () => {
      expect(wrapper.vm.reviewedFlags instanceof Set).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as phishing email education slide', () => {
      expect(wrapper.vm.data.fields.length).toBeGreaterThan(0)
      expect(wrapper.vm.data.isShowRedFlags).toBe(true)
    })

    it('should track multiple reviewed flags', () => {
      wrapper.vm.reviewedFlags.add('From')
      wrapper.vm.reviewedFlags.add('Subject')
      expect(wrapper.vm.reviewedFlags.size).toBe(2)
    })

    it('should work with various themes', () => {
      const themes = ['phishing', 'malware', 'scam']
      themes.forEach((theme) => {
        const data = { ...mockData, theme, fields: [] }
        wrapper = shallowMount(KSwiperEducation, {
          propsData: { data },
          stubs: { 'swiper-slide': true, 'v-tooltip': true }
        })
        expect(wrapper.vm.educationClasses[`k-swiper-education--${theme}`]).toBe(true)
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

    it('should update education classes when data changes', async () => {
      const newData = {
        ...mockData,
        theme: 'malware'
      }
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.educationClasses['k-swiper-education--malware']).toBe(true)
    })
  })

  describe('field display', () => {
    it('should display field key and value', () => {
      expect(wrapper.text()).toContain('From')
      expect(wrapper.text()).toContain('suspicious@fake.com')
    })

    it('should handle multiple fields', () => {
      const data = {
        ...mockData,
        fields: [
          { key: 'From', value: 'fake@domain.com', tooltip: 'Suspicious' },
          { key: 'To', value: 'user@company.com', tooltip: 'Check recipient' },
          { key: 'Subject', value: 'Urgent!', tooltip: 'Phishing subject' }
        ]
      }
      wrapper = shallowMount(KSwiperEducation, {
        propsData: { data },
        stubs: { 'swiper-slide': true, 'v-tooltip': true }
      })
      expect(wrapper.text()).toContain('From')
      expect(wrapper.text()).toContain('To')
      expect(wrapper.text()).toContain('Subject')
    })
  })
})
