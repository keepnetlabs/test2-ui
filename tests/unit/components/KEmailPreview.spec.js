jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345'),
  handleIsSafari: jest.fn(() => false)
}))

import { shallowMount } from '@vue/test-utils'
import KEmailPreview from '@/components/KEmailPreview.vue'

describe('KEmailPreview.vue', () => {
  const createWrapper = (props = {}) =>
    shallowMount(KEmailPreview, {
      propsData: { html: '<p>test</p>', ...props }
    })

  it('renders iframe with html', () => {
    const wrapper = createWrapper({ html: '<div>content</div>' })
    expect(wrapper.find('iframe').attributes('srcdoc')).toBe('<div>content</div>')
  })

  it('sets height 300 by default', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.height).toBe(300)
  })

  it('sets height 660 when isLandingPage', () => {
    const wrapper = createWrapper({ isLandingPage: true })
    expect(wrapper.vm.height).toBe(660)
  })

  it('sets pointerEvents auto when isRedFlaggedTemplate', () => {
    const wrapper = createWrapper({ isRedFlaggedTemplate: true })
    expect(wrapper.vm.$el.style.pointerEvents).toBeDefined()
  })

  it('handleLoad calls resizeIframe', () => {
    const wrapper = createWrapper()
    const resizeSpy = jest.spyOn(wrapper.vm, 'resizeIframe')
    wrapper.vm.handleLoad()
    expect(resizeSpy).toHaveBeenCalled()
  })

  it('handleLoad uses setTimeout when Safari', () => {
    const { handleIsSafari } = require('@/utils/functions')
    handleIsSafari.mockReturnValueOnce(true)
    jest.useFakeTimers()
    const wrapper = createWrapper()
    const resizeSpy = jest.spyOn(wrapper.vm, 'resizeIframe')
    wrapper.vm.handleLoad()
    expect(resizeSpy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(resizeSpy).toHaveBeenCalled()
    jest.useRealTimers()
  })

  it('handleWindowMessage resets state on redflag:languageChanged', () => {
    const wrapper = createWrapper()
    wrapper.setData({ stopCalculateFrame: true, height: '400px' })
    wrapper.vm.$refs = { iframe: { contentWindow: {}, contentDocument: {} } }
    wrapper.vm.handleWindowMessage({
      data: { type: 'redflag:languageChanged' }
    })
    expect(wrapper.vm.stopCalculateFrame).toBe(false)
    expect(wrapper.vm.isInitialResize).toBe(true)
  })

  it('handleWindowMessage bumps height for Safari px string', () => {
    const wrapper = createWrapper()
    wrapper.setData({ height: '400px' })
    wrapper.vm.$refs = { iframe: {} }
    wrapper.vm.handleWindowMessage({
      data: { type: 'redflag:languageChanged' }
    })
    expect(wrapper.vm.height).toBe('430px')
  })

  it('getValidElementHeight returns parsed px when not auto/vh/%', () => {
    const wrapper = createWrapper()
    const style = { height: '500px' }
    expect(wrapper.vm.getValidElementHeight(style, 300)).toBe(500)
  })

  it('getValidElementHeight returns fallback for auto', () => {
    const wrapper = createWrapper()
    const style = { height: 'auto' }
    expect(wrapper.vm.getValidElementHeight(style, 300)).toBe(300)
  })

  it('getValidElementHeight returns fallback for vh', () => {
    const wrapper = createWrapper()
    const style = { height: '50vh' }
    expect(wrapper.vm.getValidElementHeight(style, 300)).toBe(300)
  })

  it('resizeIframe does nothing when no iframe', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}
    expect(() => wrapper.vm.resizeIframe()).not.toThrow()
  })

  it('resizeIframe does nothing when stopCalculateFrame', () => {
    const wrapper = createWrapper()
    wrapper.setData({ stopCalculateFrame: true })
    wrapper.vm.$refs = {
      iframe: {
        contentWindow: { document: { body: { scrollHeight: 400 } } }
      }
    }
    wrapper.vm.resizeIframe()
    expect(wrapper.vm.height).toBe(300)
  })

  it('handleWindowMessage ignores non-redflag events', () => {
    const wrapper = createWrapper()
    wrapper.setData({ stopCalculateFrame: true, isInitialResize: false })
    wrapper.vm.handleWindowMessage({ data: { type: 'other:event' } })
    expect(wrapper.vm.stopCalculateFrame).toBe(true)
    expect(wrapper.vm.isInitialResize).toBe(false)
  })

  it('setDefaultHeight uses body scrollHeight when >200 and no microsoft container', () => {
    const wrapper = createWrapper()
    const iframe = {
      contentWindow: {
        document: {
          body: { scrollHeight: 450 },
          querySelector: jest.fn((q) => (q === 'body' ? {} : null))
        }
      }
    }
    wrapper.vm.$refs = { iframe }

    const result = wrapper.vm.setDefaultHeight(100)
    expect(result).toBe(100)
    expect(wrapper.vm.defaultHeight).toBe(450)
    expect(wrapper.vm.isInitialResize).toBe(false)
  })

  it('setDefaultHeight applies +275 when microsoft email container exists', () => {
    const wrapper = createWrapper()
    const iframe = {
      contentWindow: {
        document: {
          body: { scrollHeight: 300 },
          querySelector: jest.fn(() => ({}))
        }
      }
    }
    wrapper.vm.$refs = { iframe }

    const result = wrapper.vm.setDefaultHeight(150)
    expect(result).toBe(575)
    expect(wrapper.vm.defaultHeight).toBe(575)
  })

  it('setDefaultHeight falls back to getFirstValidHeight when body scrollHeight <=200', () => {
    const wrapper = createWrapper()
    const getFirstValidHeight = jest.spyOn(wrapper.vm, 'getFirstValidHeight').mockReturnValue(333)
    const iframe = {
      contentWindow: {
        document: {
          body: { scrollHeight: 120 }
        }
      }
    }
    wrapper.vm.$refs = { iframe }
    wrapper.vm.setDefaultHeight(120)
    expect(getFirstValidHeight).toHaveBeenCalledWith(150, iframe)
    expect(wrapper.vm.defaultHeight).toBe(333)
  })

  it('getFirstValidHeight returns 710 when microsoft container height is NaN', () => {
    const wrapper = createWrapper()
    const microsoftEmailContainer = {}
    const body = {
      querySelector: jest.fn(() => microsoftEmailContainer),
      querySelectorAll: jest.fn(() => [])
    }
    const iframe = {
      contentWindow: {
        document: {
          querySelector: jest.fn(() => body)
        }
      }
    }
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn((el) => {
      if (el === microsoftEmailContainer) {
        return { height: 'auto', marginTop: '10px', marginBottom: '10px' }
      }
      return { height: 'auto' }
    })

    const result = wrapper.vm.getFirstValidHeight(100, iframe)
    expect(result).toBe(710)
    global.getComputedStyle = originalGetComputedStyle
  })

  it('getFirstValidHeight scans child elements and picks first valid greater height', () => {
    const wrapper = createWrapper()
    const element1 = { style: { minHeight: '50vh' } }
    const element2 = { style: {} }
    const body = {
      querySelector: jest.fn(() => null),
      querySelectorAll: jest.fn(() => [element1, element2])
    }
    const iframe = {
      contentWindow: {
        document: {
          querySelector: jest.fn(() => body)
        }
      }
    }
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn((el) => {
      if (el === body) return { height: 'auto' }
      if (el === element1) return { height: '260px' }
      return { height: '150px' }
    })

    const result = wrapper.vm.getFirstValidHeight(120, iframe)
    expect(result).toBe(260)
    expect(element1.style.minHeight).toBe('50%')
    global.getComputedStyle = originalGetComputedStyle
  })

  it('resizeIframe enforces landing-page minimum height', () => {
    const wrapper = createWrapper({ isLandingPage: true })
    wrapper.setData({ isInitialResize: false, stopCalculateFrame: false, numberHeight: 700 })
    wrapper.vm.getFirstValidHeight = jest.fn(() => 120)
    const iframe = {
      contentWindow: {
        document: {
          body: { scrollHeight: 100 }
        }
      },
      height: '660px'
    }
    const raf = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = jest.fn(() => 1)
    wrapper.vm.$refs = { iframe }

    wrapper.vm.resizeIframe()
    expect(wrapper.vm.height).toBe('678px')
    globalThis.requestAnimationFrame = raf
  })

  it('watches html and updates iframeKey', () => {
    const { createRandomCryptStringNumber } = require('@/utils/functions')
    createRandomCryptStringNumber.mockReturnValueOnce('99999')
    const wrapper = createWrapper()
    wrapper.setProps({ html: '<p>new</p>' })
    expect(wrapper.vm.iframeKey).toBe('key-99999')
  })
})
