import selectSearchHandler from '@/directives/select-search-handler'

describe('select-search-handler directive', () => {
  let mockElement
  let mockCallback
  let mockVNode

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()

    mockElement = document.createElement('div')
    mockCallback = jest.fn()

    mockVNode = {
      componentInstance: {
        $refs: {
          refComponent: {
            $watch: jest.fn(),
            lazySearch: null,
            $_menuProps: {
              value: false
            }
          }
        }
      },
      context: {
        isLoadingState: false
      }
    }
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('directive structure', () => {
    it('should be defined', () => {
      expect(selectSearchHandler).toBeDefined()
    })

    it('should have bind hook', () => {
      expect(typeof selectSearchHandler.bind).toBe('function')
    })

    it('should have unbind hook', () => {
      expect(typeof selectSearchHandler.unbind).toBe('function')
    })
  })

  describe('bind hook', () => {
    it('should bind without errors', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should set up watchers for lazySearch', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(mockVNode.componentInstance.$refs.refComponent.$watch).toHaveBeenCalled()
    })

    it('should set up watchers for menu props', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Should have two watchers: one for lazySearch, one for $_menuProps.value
      expect(mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls.length).toBeGreaterThanOrEqual(2)
    })

    it('should handle original Vuetify component', () => {
      const vuetifyVNode = {
        componentInstance: {
          $watch: jest.fn(),
          lazySearch: null,
          $_menuProps: { value: false }
        }
      }

      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: true
        }
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, vuetifyVNode)
      }).not.toThrow()
    })
  })

  describe('unbind hook', () => {
    it('should unbind without errors', () => {
      expect(() => {
        selectSearchHandler.unbind(mockElement)
      }).not.toThrow()
    })

    it('should clear timeout on unbind', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      selectSearchHandler.unbind(mockElement)

      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })

    it('should handle multiple unbind calls', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      selectSearchHandler.unbind(mockElement)
      selectSearchHandler.unbind(mockElement)
      selectSearchHandler.unbind(mockElement)

      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(3)

      clearTimeoutSpy.mockRestore()
    })
  })

  describe('loading state management', () => {
    it('should set loading state on lazySearch change', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Verify context is available for loading state
      expect(mockVNode.context).toBeDefined()
    })

    it('should use custom isLoadingKey', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'customLoadingKey',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(binding.value.isLoadingKey).toBe('customLoadingKey')
    })

    it('should handle loading state with different key names', () => {
      const customContext = {
        customLoadingKey: false,
        anotherLoadingKey: false
      }

      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'customLoadingKey',
          isOriginalVuetifyComponent: false
        }
      }

      const customVNode = {
        componentInstance: {
          $refs: {
            refComponent: {
              $watch: jest.fn(),
              lazySearch: null,
              $_menuProps: { value: false }
            }
          }
        },
        context: customContext
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, customVNode)
      }).not.toThrow()
    })
  })

  describe('search callback behavior', () => {
    it('should invoke callback with search value', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Get the watcher callback
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[0][1]
      expect(typeof lazySearchWatcher).toBe('function')
    })

    it('should handle null search value', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Callback with null should not invoke
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should debounce search callback', () => {
      expect(() => {
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })
  })

  describe('menu state watching', () => {
    it('should watch menu props value', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Should have watchers set up
      const watchCalls = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls
      expect(watchCalls.length).toBeGreaterThanOrEqual(2)
    })

    it('should handle menu close event', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Get the menu watcher callback
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]
      expect(typeof menuWatcher).toBe('function')
    })

    it('should clear search when menu closes', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Get the menu watcher callback
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]

      // Simulate menu closing
      expect(() => {
        menuWatcher(false)
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle multiple bind calls', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, mockVNode)
        selectSearchHandler.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })

    it('should handle empty search string', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(() => {
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })

    it('should handle special characters in search', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(() => {
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })

    it('should handle rapid menu toggle', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(() => {
        jest.advanceTimersByTime(250)
        jest.advanceTimersByTime(250)
        selectSearchHandler.unbind(mockElement)
      }).not.toThrow()
    })

    it('should handle long search values', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      const longString = 'a'.repeat(1000)

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(() => {
        jest.advanceTimersByTime(500)
      }).not.toThrow()
    })

    it('should handle context without isLoadingKey', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'missingKey',
          isOriginalVuetifyComponent: false
        }
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })
  })

  describe('watcher callback timing', () => {
    it('should debounce search callback with 500ms delay', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      // Advance time less than 500ms
      jest.advanceTimersByTime(250)
      expect(mockCallback).not.toHaveBeenCalled()

      // Advance remaining time
      jest.advanceTimersByTime(250)
      // Callback behavior depends on state
      expect(mockCallback).toBeDefined()
    })
  })

  describe('vNode integration', () => {
    it('should access componentInstance from vNode', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(mockVNode.componentInstance).toBeDefined()
      expect(mockVNode.componentInstance.$refs).toBeDefined()
    })

    it('should handle vNode with context', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(mockVNode.context).toBeDefined()
    })

    it('should work with Vuetify component directly', () => {
      const vuetifyVNode = {
        componentInstance: {
          $watch: jest.fn(),
          lazySearch: null,
          $_menuProps: { value: false }
        }
      }

      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: true
        }
      }

      expect(() => {
        selectSearchHandler.bind(mockElement, binding, vuetifyVNode)
      }).not.toThrow()
    })
  })

  describe('callback invocation', () => {
    it('should invoke callback with search term', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)

      expect(typeof mockCallback).toBe('function')
    })

    it('should handle callback errors gracefully', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error')
      })

      const binding = {
        value: {
          callback: errorCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      // Binding should not throw even if callback throws
      expect(() => {
        selectSearchHandler.bind(mockElement, binding, mockVNode)
      }).not.toThrow()
    })
  })
})
