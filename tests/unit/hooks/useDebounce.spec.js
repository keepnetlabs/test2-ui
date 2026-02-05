import useDebounce from '@/hooks/useDebounce'

describe('useDebounce Hook', () => {
  describe('data()', () => {
    it('should initialize timeout as null', () => {
      const data = useDebounce.data()
      expect(data.timeout).toBeNull()
    })
  })

  describe('methods', () => {
    describe('debounce()', () => {
      let component
      let mockFn

      beforeEach(() => {
        jest.useFakeTimers()
        mockFn = jest.fn()
        component = {
          timeout: null,
          debounce: useDebounce.methods.debounce
        }
      })

      afterEach(() => {
        jest.clearAllTimers()
        jest.useRealTimers()
      })

      it('should call the function after default delay (750ms)', () => {
        component.debounce(mockFn)

        expect(mockFn).not.toHaveBeenCalled()
        jest.advanceTimersByTime(750)
        expect(mockFn).toHaveBeenCalledTimes(1)
      })

      it('should call the function after custom delay', () => {
        component.debounce(mockFn, 500)

        expect(mockFn).not.toHaveBeenCalled()
        jest.advanceTimersByTime(500)
        expect(mockFn).toHaveBeenCalledTimes(1)
      })

      it('should cancel previous call if debounce is called again before delay expires', () => {
        component.debounce(mockFn, 500)
        jest.advanceTimersByTime(300)

        component.debounce(mockFn, 500)
        jest.advanceTimersByTime(400)

        expect(mockFn).not.toHaveBeenCalled()
        jest.advanceTimersByTime(100)
        expect(mockFn).toHaveBeenCalledTimes(1)
      })

      it('should handle multiple consecutive debounce calls', () => {
        component.debounce(mockFn, 300)
        jest.advanceTimersByTime(100)

        component.debounce(mockFn, 300)
        jest.advanceTimersByTime(100)

        component.debounce(mockFn, 300)
        jest.advanceTimersByTime(300)

        expect(mockFn).toHaveBeenCalledTimes(1)
      })

      it('should store timeout id', () => {
        component.debounce(mockFn)
        expect(component.timeout).not.toBeNull()
        expect(typeof component.timeout).toBe('number')
      })

      it('should clear previous timeout before setting new one', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

        component.debounce(mockFn, 500)
        const firstTimeout = component.timeout

        component.debounce(mockFn, 500)

        expect(clearTimeoutSpy).toHaveBeenCalledWith(firstTimeout)
        clearTimeoutSpy.mockRestore()
      })
    })
  })

  describe('lifecycle', () => {
    describe('beforeDestroy()', () => {
      it('should clear timeout on component destroy', () => {
        jest.useFakeTimers()
        const mockFn = jest.fn()

        const component = {
          timeout: null,
          debounce: useDebounce.methods.debounce,
          beforeDestroy: useDebounce.beforeDestroy
        }

        // Set up a timeout using debounce
        component.debounce(mockFn, 500)
        const timeoutId = component.timeout

        // Call beforeDestroy
        component.beforeDestroy()

        // Verify timeout was cleared - function should not be called
        jest.advanceTimersByTime(500)
        expect(mockFn).not.toHaveBeenCalled()

        jest.useRealTimers()
      })

      it('should handle null timeout gracefully', () => {
        const component = {
          timeout: null,
          beforeDestroy: useDebounce.beforeDestroy
        }

        expect(() => component.beforeDestroy()).not.toThrow()
      })
    })
  })
})
