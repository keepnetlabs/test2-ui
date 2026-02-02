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
    // Reset window events or other side effects if possible
  })

  it('renders iframe with correct srcdoc', () => {
    const wrapper = mountComponent()
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('srcdoc')).toBe('<div>Test content</div>')
    expect(iframe.attributes('title')).toBe('Email Preview')
  })

  it('initializes height correctly for regular mode', () => {
    const wrapper = mountComponent({ isLandingPage: false })
    expect(wrapper.vm.height).toBe(300)
    expect(wrapper.vm.defaultHeight).toBe(300)
    expect(wrapper.vm.numberHeight).toBe(300)
  })

  it('initializes height correctly for landing page mode', () => {
    const wrapper = mountComponent({ isLandingPage: true })
    expect(wrapper.vm.height).toBe(660)
  })

  it('updates iframe key when html changes', async () => {
    const wrapper = mountComponent()
    const oldKey = wrapper.vm.iframeKey
    
    await wrapper.setProps({ html: '<span>New</span>' })
    
    expect(wrapper.vm.iframeKey).not.toBe(oldKey)
  })
  
  it('handles load event', () => {
     // Mock handleLoad
     const wrapper = mountComponent()
     // spy on update/resize
     wrapper.vm.resizeIframe = jest.fn()
     
     wrapper.find('iframe').trigger('load')
     
     expect(wrapper.vm.resizeIframe).toHaveBeenCalled()
  })

  it('enables pointer events if isRedFlaggedTemplate is true', () => {
    const wrapper = mountComponent({ isRedFlaggedTemplate: true })
    const iframe = wrapper.find('iframe')
    // Check style attribute string. JSDOM/Vue might strip !important or normalize. 
    // Just checking it is auto is sufficient for verifying the toggle logic.
    expect(iframe.attributes('style')).toContain('pointer-events: auto')
  })
})
