import infiniteScroll from '@/directives/infinite-scroll'

describe('infinite-scroll directive (extra coverage)', () => {
  let mockElement
  let mockTarget
  let mockCallback
  let mockVNode
  let scrollHandler

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()

    mockElement = document.createElement('div')
    mockTarget = document.createElement('div')
    mockTarget.className = 'scroll-target'
    mockCallback = jest.fn()
    scrollHandler = null

    jest.spyOn(mockTarget, 'addEventListener').mockImplementation((event, handler) => {
      scrollHandler = handler
    })
    jest.spyOn(mockTarget, 'removeEventListener').mockImplementation(() => {})

    document.body.appendChild(mockTarget)

    infiniteScroll.unbind(mockElement, { value: { target: '.scroll-target' } })

    mockVNode = {
      componentInstance: {
        $refs: {
          refComponent: {
            $watch: jest.fn()
          }
        }
      }
    }
  })

  afterEach(() => {
    jest.useRealTimers()
    if (mockTarget.parentElement) {
      mockTarget.parentElement.removeChild(mockTarget)
    }
    mockTarget.addEventListener.mockRestore?.()
    mockTarget.removeEventListener.mockRestore?.()
  })

  describe('attachEvent and handleScroll', () => {
    it('attaches scroll listener and handleScroll triggers callback when at bottom', () => {
      const binding = {
        value: {
          target: '.scroll-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      expect(scrollHandler).toBeDefined()

      Object.defineProperty(mockTarget, 'scrollTop', { value: 50, configurable: true })
      Object.defineProperty(mockTarget, 'scrollHeight', { value: 100, configurable: true })
      Object.defineProperty(mockTarget, 'offsetHeight', { value: 50, configurable: true })

      scrollHandler({ target: mockTarget })
      jest.advanceTimersByTime(500)

      expect(mockCallback).toHaveBeenCalledWith(true)
    })

    it('returns early when scrollTop < lastScrollTop (scrolling up)', () => {
      const binding = {
        value: {
          target: '.scroll-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      Object.defineProperty(mockTarget, 'scrollTop', { value: 50, configurable: true })
      Object.defineProperty(mockTarget, 'scrollHeight', { value: 100, configurable: true })
      Object.defineProperty(mockTarget, 'offsetHeight', { value: 50, configurable: true })
      scrollHandler({ target: mockTarget })
      jest.advanceTimersByTime(500)
      mockCallback.mockClear()

      Object.defineProperty(mockTarget, 'scrollTop', { value: 40, configurable: true })
      scrollHandler({ target: mockTarget })
      jest.advanceTimersByTime(500)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('does not attach when target is falsy', () => {
      const binding = {
        value: {
          target: '',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('does not attach when callback is falsy', () => {
      const binding = {
        value: {
          target: '.scroll-target',
          callback: null,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('clears previous timeout before setting new one', () => {
      const binding = {
        value: {
          target: '.scroll-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      const clearSpy = jest.spyOn(global, 'clearTimeout')
      Object.defineProperty(mockTarget, 'scrollTop', { value: 50, configurable: true })
      Object.defineProperty(mockTarget, 'scrollHeight', { value: 100, configurable: true })
      Object.defineProperty(mockTarget, 'offsetHeight', { value: 50, configurable: true })
      scrollHandler({ target: mockTarget })
      scrollHandler({ target: mockTarget })

      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })
  })

  describe('detachEvent', () => {
    it('calls removeEventListener when target exists', () => {
      const binding = {
        value: {
          target: '.scroll-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      watchCallback(true)

      infiniteScroll.unbind(mockElement, binding)

      expect(mockTarget.removeEventListener).toHaveBeenCalledWith('scroll', null)
    })

    it('returns early when target does not exist', () => {
      const binding = {
        value: {
          target: '.non-existent-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.unbind(mockElement, binding)
      }).not.toThrow()
    })
  })
})
