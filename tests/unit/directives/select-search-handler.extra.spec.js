import selectSearchHandler from '@/directives/select-search-handler'

describe('select-search-handler directive (extra coverage)', () => {
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
            $_menuProps: { value: false }
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

  describe('$_menuProps watcher', () => {
    it('sets isLoadingKey to false when menu closes with no searchVal', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]

      menuWatcher(false)
      jest.advanceTimersByTime(500)

      expect(mockVNode.context.isLoadingState).toBe(false)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('invokes callback with empty string when menu closes and searchVal is set', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock
        .calls[0][1]
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]

      lazySearchWatcher('had-search')
      jest.advanceTimersByTime(500)
      mockCallback.mockClear()

      menuWatcher(false)
      jest.advanceTimersByTime(500)

      expect(mockCallback).toHaveBeenCalledWith('')
    })

    it('sets isLoadingKey to false when menu stays open', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock
        .calls[0][1]
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]

      lazySearchWatcher('term')
      expect(mockVNode.context.isLoadingState).toBe(true)

      menuWatcher(true)
      jest.advanceTimersByTime(500)

      expect(mockVNode.context.isLoadingState).toBe(false)
    })

    it('clears timeout on menu watcher when new value arrives', () => {
      const clearSpy = jest.spyOn(global, 'clearTimeout')
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const menuWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock.calls[1][1]

      menuWatcher(false)
      menuWatcher(true)

      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })
  })

  describe('lazySearch watcher', () => {
    it('invokes callback with search value after 500ms', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock
        .calls[0][1]

      expect(mockVNode.context.isLoadingState).toBe(false)
      lazySearchWatcher('search-term')
      expect(mockVNode.context.isLoadingState).toBe(true)

      jest.advanceTimersByTime(500)

      expect(mockCallback).toHaveBeenCalledWith('search-term')
      expect(mockVNode.context.isLoadingState).toBe(true)
    })

    it('does not invoke callback when value is null', () => {
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock
        .calls[0][1]

      lazySearchWatcher(null)
      jest.advanceTimersByTime(500)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('clears previous timeout before setting new one', () => {
      const clearSpy = jest.spyOn(global, 'clearTimeout')
      const binding = {
        value: {
          callback: mockCallback,
          isLoadingKey: 'isLoadingState',
          isOriginalVuetifyComponent: false
        }
      }

      selectSearchHandler.bind(mockElement, binding, mockVNode)
      const lazySearchWatcher = mockVNode.componentInstance.$refs.refComponent.$watch.mock
        .calls[0][1]

      lazySearchWatcher('first')
      lazySearchWatcher('second')

      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })
  })

  describe('isOriginalVuetifyComponent', () => {
    it('uses componentInstance directly when isOriginalVuetifyComponent is true', () => {
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

      selectSearchHandler.bind(mockElement, binding, vuetifyVNode)

      expect(vuetifyVNode.componentInstance.$watch).toHaveBeenCalledTimes(2)
    })
  })
})
