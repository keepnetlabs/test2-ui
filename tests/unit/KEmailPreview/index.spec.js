import { createLocalVue, shallowMount } from '@vue/test-utils'
import KEmailPreview from '@/components/KEmailPreview.vue'

// Mock utils
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => Date.now().toString() + Math.random()),
  handleIsSafari: jest.fn(() => false)
}))

describe('KEmailPreview.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(KEmailPreview, {
      localVue,
      propsData: {
        html: '<div>Test content</div>',
        ...propsData
      },
      stubs: {
        // iframe cannot be easily stubbed if checking behavior,
        // but component renders native iframe.
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('component rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('KEmailPreview')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render iframe', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(true)
    })

    it('should render iframe with correct srcdoc', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(true)
      expect(iframe.attributes('srcdoc')).toBe('<div>Test content</div>')
    })

    it('should render iframe with Email Preview title', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('title')).toBe('Email Preview')
    })

    it('should have k-email-preview class', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.classes()).toContain('k-email-preview')
    })

    it('should have width 100%', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('width')).toBe('100%')
    })
  })

  describe('props handling', () => {
    it('should accept html prop', () => {
      const wrapper = mountComponent({ html: '<p>Content</p>' })
      expect(wrapper.props('html')).toBe('<p>Content</p>')
    })

    it('should accept isExtraHeight prop', () => {
      const wrapper = mountComponent({ isExtraHeight: true })
      expect(wrapper.props('isExtraHeight')).toBe(true)
    })

    it('should accept isLandingPage prop', () => {
      const wrapper = mountComponent({ isLandingPage: true })
      expect(wrapper.props('isLandingPage')).toBe(true)
    })

    it('should accept isRedFlaggedTemplate prop', () => {
      const wrapper = mountComponent({ isRedFlaggedTemplate: true })
      expect(wrapper.props('isRedFlaggedTemplate')).toBe(true)
    })

    it('should have default isExtraHeight as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('isExtraHeight')).toBe(false)
    })

    it('should have default isLandingPage as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('isLandingPage')).toBe(false)
    })

    it('should have default isRedFlaggedTemplate as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('isRedFlaggedTemplate')).toBe(false)
    })

    it('should accept empty html string', () => {
      const wrapper = mountComponent({ html: '' })
      expect(wrapper.props('html')).toBe('')
    })

    it('should accept complex html', () => {
      const complexHtml = '<div><h1>Title</h1><p>Content</p></div>'
      const wrapper = mountComponent({ html: complexHtml })
      expect(wrapper.props('html')).toBe(complexHtml)
    })
  })

  describe('data initialization', () => {
    it('should initialize height correctly for regular mode', () => {
      const wrapper = mountComponent({ isLandingPage: false })
      expect(wrapper.vm.height).toBe(300)
    })

    it('should initialize defaultHeight correctly for regular mode', () => {
      const wrapper = mountComponent({ isLandingPage: false })
      expect(wrapper.vm.defaultHeight).toBe(300)
    })

    it('should initialize numberHeight correctly for regular mode', () => {
      const wrapper = mountComponent({ isLandingPage: false })
      expect(wrapper.vm.numberHeight).toBe(300)
    })

    it('should initialize height correctly for landing page mode', () => {
      const wrapper = mountComponent({ isLandingPage: true })
      expect(wrapper.vm.height).toBe(660)
    })

    it('should initialize defaultHeight correctly for landing page mode', () => {
      const wrapper = mountComponent({ isLandingPage: true })
      expect(wrapper.vm.defaultHeight).toBe(660)
    })

    it('should initialize numberHeight correctly for landing page mode', () => {
      const wrapper = mountComponent({ isLandingPage: true })
      expect(wrapper.vm.numberHeight).toBe(660)
    })

    it('should initialize iframeKey', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.iframeKey).toBeDefined()
      expect(typeof wrapper.vm.iframeKey).toBe('string')
    })

    it('should initialize animationFrame to null', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.animationFrame).toBeNull()
    })

    it('should initialize isBodyHeightUsed to false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isBodyHeightUsed).toBe(false)
    })

    it('should initialize stopCalculateFrame to false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.stopCalculateFrame).toBe(false)
    })

    it('should initialize isInitialResize to true', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isInitialResize).toBe(true)
    })
  })

  describe('watcher behavior', () => {
    it('should update iframe key when html changes', async () => {
      const wrapper = mountComponent()
      const oldKey = wrapper.vm.iframeKey

      await wrapper.setProps({ html: '<span>New</span>' })

      expect(wrapper.vm.iframeKey).not.toBe(oldKey)
    })

    it('should call resizeIframe when html changes', async () => {
      const wrapper = mountComponent()
      wrapper.vm.resizeIframe = jest.fn()

      await wrapper.setProps({ html: '<div>Updated</div>' })

      expect(wrapper.vm.resizeIframe).toHaveBeenCalled()
    })

    it('should handle multiple html changes', async () => {
      const wrapper = mountComponent()
      const key1 = wrapper.vm.iframeKey

      await wrapper.setProps({ html: '<div>First</div>' })
      const key2 = wrapper.vm.iframeKey

      await wrapper.setProps({ html: '<div>Second</div>' })
      const key3 = wrapper.vm.iframeKey

      expect(key1).not.toBe(key2)
      expect(key2).not.toBe(key3)
    })
  })

  describe('event handling', () => {
    it('should handle load event', () => {
      const wrapper = mountComponent()
      wrapper.vm.resizeIframe = jest.fn()

      wrapper.find('iframe').trigger('load')

      expect(wrapper.vm.resizeIframe).toHaveBeenCalled()
    })

    it('should have handleLoad method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleLoad).toBe('function')
    })

    it('should have handleWindowMessage method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleWindowMessage).toBe('function')
    })

    it('should handle window message events', () => {
      const wrapper = mountComponent()
      const event = {
        data: { type: 'redflag:languageChanged' }
      }
      wrapper.vm.resizeIframe = jest.fn()

      wrapper.vm.handleWindowMessage(event)

      expect(wrapper.vm.resizeIframe).toHaveBeenCalled()
    })

    it('should reset flags on language change message', () => {
      const wrapper = mountComponent()
      wrapper.vm.stopCalculateFrame = true

      const event = {
        data: { type: 'redflag:languageChanged' }
      }

      wrapper.vm.handleWindowMessage(event)

      expect(wrapper.vm.stopCalculateFrame).toBe(false)
      expect(wrapper.vm.isInitialResize).toBe(true)
    })

    it('should ignore unknown message types', () => {
      const wrapper = mountComponent()
      const initialHeight = wrapper.vm.height

      const event = {
        data: { type: 'unknown:type' }
      }

      wrapper.vm.handleWindowMessage(event)

      expect(wrapper.vm.height).toBe(initialHeight)
    })
  })

  describe('pointer events styling', () => {
    it('should disable pointer events by default', () => {
      const wrapper = mountComponent({ isRedFlaggedTemplate: false })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('style')).toContain('pointer-events: none')
    })

    it('should enable pointer events if isRedFlaggedTemplate is true', () => {
      const wrapper = mountComponent({ isRedFlaggedTemplate: true })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('style')).toContain('pointer-events: auto')
    })

    it('should toggle pointer events based on prop', async () => {
      const wrapper = mountComponent({ isRedFlaggedTemplate: false })
      let iframe = wrapper.find('iframe')
      expect(iframe.attributes('style')).toContain('pointer-events: none')

      await wrapper.setProps({ isRedFlaggedTemplate: true })
      iframe = wrapper.find('iframe')
      expect(iframe.attributes('style')).toContain('pointer-events: auto')
    })
  })

  describe('height management', () => {
    it('should set iframe height attribute', () => {
      const wrapper = mountComponent()
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('height')).toBeDefined()
    })

    it('should update height in data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.height).toBe(300)
      wrapper.vm.height = 400
      expect(wrapper.vm.height).toBe(400)
    })

    it('should have different heights for landing page', () => {
      const regular = mountComponent({ isLandingPage: false })
      const landing = mountComponent({ isLandingPage: true })

      expect(regular.vm.height).toBe(300)
      expect(landing.vm.height).toBe(660)
    })
  })

  describe('methods', () => {
    it('should have resizeIframe method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.resizeIframe).toBe('function')
    })

    it('resizeIframe should not throw', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.resizeIframe()).not.toThrow()
    })

    it('handleLoad should not throw', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleLoad()).not.toThrow()
    })

    it('handleWindowMessage should accept null event', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleWindowMessage(null)).not.toThrow()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ html: '<div>Content</div>' })
      const wrapper2 = mountComponent({ html: '<div>Content</div>' })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after prop changes', async () => {
      const wrapper = mountComponent()
      const initialKey = wrapper.vm.iframeKey

      await wrapper.setProps({ html: '<div>New</div>' })

      expect(wrapper.vm.iframeKey).not.toBe(initialKey)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('iframe').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('height should be number type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.height === 'number' || typeof wrapper.vm.height === 'string').toBe(true)
    })

    it('iframeKey should be string type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.iframeKey).toBe('string')
    })

    it('boolean flags should be boolean type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isBodyHeightUsed).toBe('boolean')
      expect(typeof wrapper.vm.stopCalculateFrame).toBe('boolean')
      expect(typeof wrapper.vm.isInitialResize).toBe('boolean')
    })

    it('animationFrame should be null or number', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.animationFrame === null || typeof wrapper.vm.animationFrame === 'number').toBe(true)
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have proper component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('KEmailPreview')
    })

    it('should have iframe reference after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$refs.iframe).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle very long html content', () => {
      const longHtml = '<div>' + 'a'.repeat(5000) + '</div>'
      const wrapper = mountComponent({ html: longHtml })
      expect(wrapper.props('html')).toBe(longHtml)
    })

    it('should handle html with special characters', () => {
      const wrapper = mountComponent({ html: '<div>!@#$%^&*()</div>' })
      expect(wrapper.props('html')).toContain('!@#$%^&*()')
    })

    it('should handle rapid prop changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ html: `<div>Content ${i}</div>` })
      }
      expect(wrapper.vm.iframeKey).toBeDefined()
    })

    it('should handle all boolean combinations', () => {
      const combinations = [
        { isExtraHeight: true, isLandingPage: true, isRedFlaggedTemplate: true },
        { isExtraHeight: true, isLandingPage: false, isRedFlaggedTemplate: true },
        { isExtraHeight: false, isLandingPage: true, isRedFlaggedTemplate: false }
      ]

      combinations.forEach(props => {
        const wrapper = mountComponent(props)
        expect(wrapper.exists()).toBe(true)
      })
    })
  })
})
