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

  it('watches html and updates iframeKey', () => {
    const { createRandomCryptStringNumber } = require('@/utils/functions')
    createRandomCryptStringNumber.mockReturnValueOnce('99999')
    const wrapper = createWrapper()
    wrapper.setProps({ html: '<p>new</p>' })
    expect(wrapper.vm.iframeKey).toBe('key-99999')
  })
})
