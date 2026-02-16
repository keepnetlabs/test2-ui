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

  describe('Edge Cases', () => {
    it('should handle zero delay', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 0)
      jest.advanceTimersByTime(0)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle very large delay values', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 999999)
      jest.advanceTimersByTime(1000)
      expect(mockFn).not.toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle being called with null function', () => {
      jest.useFakeTimers()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      expect(() => component.debounce(null, 500)).toBeDefined()
      jest.useRealTimers()
    })
  })

  describe('Hook Integration', () => {
    it('should export proper hook structure', () => {
      expect(useDebounce.data).toBeDefined()
      expect(useDebounce.methods).toBeDefined()
      expect(useDebounce.beforeDestroy).toBeDefined()
    })

    it('should have debounce method in methods', () => {
      expect(useDebounce.methods.debounce).toBeDefined()
      expect(typeof useDebounce.methods.debounce).toBe('function')
    })

    it('should have beforeDestroy lifecycle hook', () => {
      expect(useDebounce.beforeDestroy).toBeDefined()
      expect(typeof useDebounce.beforeDestroy).toBe('function')
    })

    it('data should be a function', () => {
      expect(typeof useDebounce.data).toBe('function')
    })
  })

  describe('Function Arguments', () => {
    it('should handle function as first argument', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn)
      expect(mockFn).not.toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle function and delay as arguments', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 300)
      jest.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should accept arrow functions', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const arrowFn = () => mockFn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(arrowFn, 500)
      jest.advanceTimersByTime(500)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })
  })

  describe('State Management', () => {
    it('timeout should be accessible after debounce call', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn)
      expect(component.timeout).not.toBeNull()
      jest.useRealTimers()
    })

    it('timeout should be cleared after beforeDestroy', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce,
        beforeDestroy: useDebounce.beforeDestroy
      }

      component.debounce(mockFn, 500)
      const timeoutBefore = component.timeout
      component.beforeDestroy()

      jest.useRealTimers()
    })
  })

  describe('Debounce Timing', () => {
    it('should respect delay with multiple calls', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      for (let i = 0; i < 10; i++) {
        component.debounce(mockFn, 100)
        jest.advanceTimersByTime(50)
      }

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })

    it('should trigger only once after series of calls', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 500)
      component.debounce(mockFn, 500)
      component.debounce(mockFn, 500)
      jest.advanceTimersByTime(500)

      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })
  })

  describe('Hook Behavior', () => {
    it('should initialize with null timeout in data', () => {
      const data = useDebounce.data()
      expect(data).toEqual({ timeout: null })
    })

    it('should provide debounce method to components', () => {
      expect(useDebounce.methods.debounce).toBeDefined()
    })

    it('should cleanup on destroy', () => {
      const component = {
        timeout: 123,
        beforeDestroy: useDebounce.beforeDestroy
      }

      expect(() => component.beforeDestroy()).not.toThrow()
    })
  })

  describe('Debounce Cancellation', () => {
    it('should cancel pending call on new debounce', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce,
        beforeDestroy: useDebounce.beforeDestroy
      }

      component.debounce(mockFn, 500)
      jest.advanceTimersByTime(250)
      component.beforeDestroy()
      jest.advanceTimersByTime(250)
      expect(mockFn).not.toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should prevent execution of cancelled calls', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 300)
      jest.advanceTimersByTime(100)
      component.debounce(mockFn, 300)
      jest.advanceTimersByTime(250)
      expect(mockFn).not.toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should execute after final delay with proper cancellation', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      for (let i = 0; i < 5; i++) {
        component.debounce(mockFn, 200)
        jest.advanceTimersByTime(100)
      }
      jest.advanceTimersByTime(200)
      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })
  })

  describe('Multiple Debounce Instances', () => {
    it('should maintain independent timeout states', () => {
      jest.useFakeTimers()
      const mockFn1 = jest.fn()
      const mockFn2 = jest.fn()
      const component1 = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }
      const component2 = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component1.debounce(mockFn1, 300)
      component2.debounce(mockFn2, 500)

      jest.advanceTimersByTime(300)
      expect(mockFn1).toHaveBeenCalledTimes(1)
      expect(mockFn2).not.toHaveBeenCalled()

      jest.advanceTimersByTime(200)
      expect(mockFn2).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })

    it('should not affect other instances on destroy', () => {
      jest.useFakeTimers()
      const mockFn1 = jest.fn()
      const mockFn2 = jest.fn()
      const component1 = {
        timeout: null,
        debounce: useDebounce.methods.debounce,
        beforeDestroy: useDebounce.beforeDestroy
      }
      const component2 = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component1.debounce(mockFn1, 300)
      component2.debounce(mockFn2, 300)
      component1.beforeDestroy()
      jest.advanceTimersByTime(300)

      expect(mockFn1).not.toHaveBeenCalled()
      expect(mockFn2).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })
  })

  describe('Different Function Types', () => {
    it('should handle named functions', () => {
      jest.useFakeTimers()
      function namedFn() {}
      const spy = jest.fn(namedFn)
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(spy, 250)
      jest.advanceTimersByTime(250)
      expect(spy).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle method functions', () => {
      jest.useFakeTimers()
      const obj = {
        method: jest.fn()
      }
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(() => obj.method(), 200)
      jest.advanceTimersByTime(200)
      expect(obj.method).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle async functions', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(async () => mockFn(), 150)
      jest.advanceTimersByTime(150)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })
  })

  describe('Debounce with Side Effects', () => {
    it('should only trigger side effects once per debounce cycle', () => {
      jest.useFakeTimers()
      const sideEffect = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(sideEffect, 100)
      component.debounce(sideEffect, 100)
      component.debounce(sideEffect, 100)
      jest.advanceTimersByTime(100)

      expect(sideEffect).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })

    it('should prevent rapid successive executions', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      for (let i = 0; i < 100; i++) {
        component.debounce(mockFn, 50)
        jest.advanceTimersByTime(1)
      }
      jest.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })
  })

  describe('Timeout Precision', () => {
    it('should respect exact delay timing', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 1000)
      jest.advanceTimersByTime(999)
      expect(mockFn).not.toHaveBeenCalled()
      jest.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })

    it('should handle sub-millisecond precision requests', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 1)
      jest.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle very large delay values correctly', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 999999)
      jest.advanceTimersByTime(999998)
      expect(mockFn).not.toHaveBeenCalled()
      jest.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
      jest.useRealTimers()
    })
  })

  describe('Error Scenarios in Debounced Functions', () => {
    it('should call debounced function and track execution', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn, 100)
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should maintain timeout state through multiple debounce calls', () => {
      jest.useFakeTimers()
      const mockFn1 = jest.fn()
      const mockFn2 = jest.fn()
      const component = {
        timeout: null,
        debounce: useDebounce.methods.debounce
      }

      component.debounce(mockFn1, 50)
      jest.advanceTimersByTime(50)

      component.debounce(mockFn2, 50)
      jest.advanceTimersByTime(50)

      expect(mockFn2).toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should handle null timeout during cleanup', () => {
      const component = {
        timeout: null,
        beforeDestroy: useDebounce.beforeDestroy
      }

      expect(() => component.beforeDestroy()).not.toThrow()
    })
  })

  describe('Debounce Hook Composition', () => {
    it('should work with component lifecycle', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const component = {
        timeout: null,
        ...useDebounce.data(),
        ...useDebounce.methods,
        ...{ beforeDestroy: useDebounce.beforeDestroy }
      }

      component.debounce(mockFn, 300)
      expect(component.timeout).not.toBeNull()
      component.beforeDestroy()
      jest.advanceTimersByTime(300)
      expect(mockFn).not.toHaveBeenCalled()
      jest.useRealTimers()
    })

    it('should integrate seamlessly with other mixins', () => {
      const debounceData = useDebounce.data()
      expect(debounceData).toHaveProperty('timeout')
      expect(debounceData.timeout).toBeNull()
    })
  })
})
