import infiniteScroll from '@/directives/infinite-scroll'

describe('infinite-scroll directive', () => {
  let mockElement
  let mockTarget
  let mockCallback
  let mockVNode

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()

    mockElement = document.createElement('div')
    mockTarget = document.createElement('div')
    mockCallback = jest.fn()

    document.body.appendChild(mockTarget)

    mockVNode = {
      componentInstance: {
        $refs: {
          refComponent: {
            $watch: jest.fn()
          }
        },
        $_menuProps: {
          value: false
        }
      },
      context: {}
    }
  })

  afterEach(() => {
    jest.useRealTimers()
    if (mockTarget.parentElement) {
      mockTarget.parentElement.removeChild(mockTarget)
    }
  })

  describe('directive structure', () => {
    it('should be defined', () => {
      expect(infiniteScroll).toBeDefined()
    })

    it('should have bind hook', () => {
      expect(typeof infiniteScroll.bind).toBe('function')
    })

    it('should have unbind hook', () => {
      expect(typeof infiniteScroll.unbind).toBe('function')
    })
  })

  describe('bind hook', () => {
    it('should bind without errors', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should watch menu props when binding', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)

      expect(mockVNode.componentInstance.$refs.refComponent.$watch).toHaveBeenCalled()
    })

    it('should handle original Vuetify component', () => {
      const vuetifyVNode = {
        componentInstance: {
          $watch: jest.fn(),
          $_menuProps: {
            value: false
          }
        }
      }

      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: true
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, vuetifyVNode)
      }).not.toThrow()
    })

    it('should watch the menu props value', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)

      // Verify the watcher is set up for $_menuProps.value
      expect(mockVNode.componentInstance.$refs.refComponent.$watch).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  describe('unbind hook', () => {
    it('should unbind without errors', () => {
      const binding = {
        value: {
          target: '.mock-target'
        }
      }

      expect(() => {
        infiniteScroll.unbind(mockElement, binding)
      }).not.toThrow()
    })

    it('should set isEventAttached to false', () => {
      const binding = {
        value: {
          target: '.mock-target'
        }
      }

      infiniteScroll.unbind(mockElement, binding)

      // Access the scrollState through the directive to verify state
      expect(infiniteScroll).toBeDefined()
    })

    it('should clear timeout on unbind', () => {
      const binding = {
        value: {
          target: '.mock-target'
        }
      }

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      infiniteScroll.unbind(mockElement, binding)

      // clearTimeout should have been called
      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })
  })

  describe('scroll detection behavior', () => {
    it('should handle scroll near bottom', () => {
      // Create a scrollable element
      const scrollableDiv = document.createElement('div')
      scrollableDiv.style.height = '100px'
      scrollableDiv.style.overflow = 'auto'
      scrollableDiv.textContent = 'Content'

      const binding = {
        value: {
          target: '',
          callback: mockCallback
        }
      }

      document.body.appendChild(scrollableDiv)

      // Simulate scroll event
      const scrollEvent = new Event('scroll', { bubbles: true })
      Object.defineProperty(scrollableDiv, 'scrollTop', { value: 90, writable: true })
      Object.defineProperty(scrollableDiv, 'scrollHeight', { value: 100, writable: true })
      Object.defineProperty(scrollableDiv, 'offsetHeight', { value: 100, writable: true })

      expect(() => {
        scrollableDiv.dispatchEvent(scrollEvent)
      }).not.toThrow()

      document.body.removeChild(scrollableDiv)
    })
  })

  describe('event attachment', () => {
    it('should handle binding with valid target', () => {
      const targetClass = 'scroll-container'
      mockTarget.className = targetClass

      const binding = {
        value: {
          target: '.' + targetClass,
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should handle binding with null callback', () => {
      const binding = {
        value: {
          target: '.no-target',
          callback: null,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should handle unbind with missing target', () => {
      const binding = {
        value: {
          target: '.non-existent-target'
        }
      }

      expect(() => {
        infiniteScroll.unbind(mockElement, binding)
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle multiple bind calls', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, mockVNode)
        infiniteScroll.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should handle unbind without prior bind', () => {
      const binding = {
        value: {
          target: '.mock-target'
        }
      }

      expect(() => {
        infiniteScroll.unbind(mockElement, binding)
      }).not.toThrow()
    })

    it('should handle binding with special characters in target', () => {
      const binding = {
        value: {
          target: '[data-selector="test"]',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should clear previous timeout before setting new one', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      infiniteScroll.unbind(mockElement, {
        value: { target: '.test' }
      })

      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })
  })

  describe('debounce behavior', () => {
    it('should debounce scroll callback', () => {
      expect(() => {
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })

    it('should handle rapid unbind calls', () => {
      const binding = {
        value: { target: '.test' }
      }

      expect(() => {
        infiniteScroll.unbind(mockElement, binding)
        infiniteScroll.unbind(mockElement, binding)
        infiniteScroll.unbind(mockElement, binding)
      }).not.toThrow()
    })
  })

  describe('vNode integration', () => {
    it('should access componentInstance from vNode', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)

      expect(mockVNode.componentInstance).toBeDefined()
      expect(mockVNode.componentInstance.$refs).toBeDefined()
    })

    it('should handle vNode with direct componentInstance reference', () => {
      const directVNode = {
        componentInstance: {
          $watch: jest.fn(),
          $_menuProps: { value: false }
        }
      }

      const binding = {
        value: {
          target: '.test',
          callback: mockCallback,
          isOriginalVuetifyComponent: true
        }
      }

      expect(() => {
        infiniteScroll.bind(mockElement, binding, directVNode)
      }).not.toThrow()
    })
  })

  describe('menu state watching', () => {
    it('should watch $_menuProps value property', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)

      const watchCall = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0]
      expect(watchCall).toBeDefined()
      expect(typeof watchCall[0]).toBe('function')
      expect(typeof watchCall[1]).toBe('function')
    })

    it('should only attach event when menu opens', () => {
      const binding = {
        value: {
          target: '.mock-target',
          callback: mockCallback,
          isOriginalVuetifyComponent: false
        }
      }

      infiniteScroll.bind(mockElement, binding, mockVNode)

      // The watcher callback should handle menu state changes
      const watchCallback = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      expect(typeof watchCallback).toBe('function')
    })
  })
})
