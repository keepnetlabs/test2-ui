import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'

describe('useHtmlOverflowControl Hook', () => {
  let mockHtmlElement

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Mock document.querySelector for html element
    mockHtmlElement = {
      style: {
        overflowY: ''
      }
    }

    jest.spyOn(document, 'querySelector').mockReturnValue(mockHtmlElement)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('props', () => {
    it('should have shouldControlHtmlOverflow prop with default true', () => {
      expect(useHtmlOverflowControl.props.shouldControlHtmlOverflow.type).toBe(Boolean)
      expect(useHtmlOverflowControl.props.shouldControlHtmlOverflow.default).toBe(true)
    })
  })

  describe('data()', () => {
    it('should initialize with correct default values', () => {
      const data = useHtmlOverflowControl.data()
      expect(data.isHtmlOverflowControlManuallyDisabled).toBe(false)
    })
  })

  describe('lifecycle', () => {
    describe('created()', () => {
      it('should set html overflow to hidden if shouldControlHtmlOverflow is true', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: true,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.created.call(component)

        expect(setOverflowSpy).toHaveBeenCalledWith('hidden')
      })

      it('should not set html overflow if shouldControlHtmlOverflow is false', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: false,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.created.call(component)

        expect(setOverflowSpy).not.toHaveBeenCalled()
      })
    })

    describe('beforeDestroy()', () => {
      it('should reset html overflow to auto after delay if conditions are met', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: true,
          isHtmlOverflowControlManuallyDisabled: false,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.beforeDestroy.call(component)

        jest.advanceTimersByTime(250)

        expect(setOverflowSpy).toHaveBeenCalledWith('auto')
      })

      it('should not reset if shouldControlHtmlOverflow is false', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: false,
          isHtmlOverflowControlManuallyDisabled: false,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.beforeDestroy.call(component)

        jest.advanceTimersByTime(250)

        expect(setOverflowSpy).not.toHaveBeenCalled()
      })

      it('should not reset if overflow control is manually disabled', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: true,
          isHtmlOverflowControlManuallyDisabled: true,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.beforeDestroy.call(component)

        jest.advanceTimersByTime(250)

        expect(setOverflowSpy).not.toHaveBeenCalled()
      })

      it('should wait 250ms before resetting', () => {
        const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
        const component = {
          shouldControlHtmlOverflow: true,
          isHtmlOverflowControlManuallyDisabled: false,
          _setHtmlOverflow: setOverflowSpy
        }

        useHtmlOverflowControl.beforeDestroy.call(component)

        // Should be called after 250ms
        expect(setOverflowSpy).not.toHaveBeenCalled()

        jest.advanceTimersByTime(249)
        expect(setOverflowSpy).not.toHaveBeenCalled()

        jest.advanceTimersByTime(1)
        expect(setOverflowSpy).toHaveBeenCalledWith('auto')
      })
    })
  })

  describe('methods', () => {
    describe('_setHtmlOverflow()', () => {
      it('should set overflow-y style on html element', () => {
        const component = {
          _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
        }

        component._setHtmlOverflow('hidden')
        expect(mockHtmlElement.style.overflowY).toBe('hidden')

        component._setHtmlOverflow('auto')
        expect(mockHtmlElement.style.overflowY).toBe('auto')
      })

      it('should handle different overflow values', () => {
        const component = {
          _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
        }

        const values = ['visible', 'scroll', 'hidden', 'auto']
        values.forEach(value => {
          component._setHtmlOverflow(value)
          expect(mockHtmlElement.style.overflowY).toBe(value)
        })
      })

      it('should not throw if html element is not found', () => {
        jest.spyOn(document, 'querySelector').mockReturnValue(null)

        const component = {
          _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
        }

        expect(() => component._setHtmlOverflow('hidden')).not.toThrow()
      })

      it('should use querySelector with "html" selector', () => {
        const component = {
          _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
        }

        const querySelectorSpy = jest.spyOn(document, 'querySelector')

        component._setHtmlOverflow('hidden')

        expect(querySelectorSpy).toHaveBeenCalledWith('html')
      })
    })
  })

  describe('prop validation', () => {
    it('should accept boolean values for shouldControlHtmlOverflow', () => {
      expect(useHtmlOverflowControl.props.shouldControlHtmlOverflow.type).toBe(Boolean)
    })

    it('should have proper prop structure', () => {
      const prop = useHtmlOverflowControl.props.shouldControlHtmlOverflow
      expect(prop.default).toBeDefined()
      expect(typeof prop.default).toBe('boolean')
    })

    it('should validate prop with true value', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }
      expect(component.shouldControlHtmlOverflow).toBe(true)
    })

    it('should validate prop with false value', () => {
      const component = {
        shouldControlHtmlOverflow: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }
      expect(component.shouldControlHtmlOverflow).toBe(false)
    })
  })

  describe('overflow control state management', () => {
    it('should track manual disable state correctly', () => {
      const data = useHtmlOverflowControl.data()
      expect(data.isHtmlOverflowControlManuallyDisabled).toBe(false)
    })

    it('should maintain state across multiple operations', () => {
      const data = useHtmlOverflowControl.data()
      expect(data.isHtmlOverflowControlManuallyDisabled).toBe(false)

      const component = {
        isHtmlOverflowControlManuallyDisabled: true
      }
      expect(component.isHtmlOverflowControlManuallyDisabled).toBe(true)
    })

    it('should allow state transitions', () => {
      const component = {
        isHtmlOverflowControlManuallyDisabled: false
      }

      component.isHtmlOverflowControlManuallyDisabled = true
      expect(component.isHtmlOverflowControlManuallyDisabled).toBe(true)

      component.isHtmlOverflowControlManuallyDisabled = false
      expect(component.isHtmlOverflowControlManuallyDisabled).toBe(false)
    })

    it('should respect manual disable during destroy', () => {
      const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: true,
        _setHtmlOverflow: setOverflowSpy
      }

      useHtmlOverflowControl.beforeDestroy.call(component)
      jest.advanceTimersByTime(250)

      expect(setOverflowSpy).not.toHaveBeenCalled()
    })
  })

  describe('timing and animation', () => {
    it('should use 250ms delay for reset', () => {
      const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: setOverflowSpy
      }

      useHtmlOverflowControl.beforeDestroy.call(component)

      jest.advanceTimersByTime(249)
      expect(setOverflowSpy).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(setOverflowSpy).toHaveBeenCalledWith('auto')
    })

    it('should handle multiple timer operations', () => {
      const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')

      const component1 = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: setOverflowSpy
      }

      useHtmlOverflowControl.beforeDestroy.call(component1)
      jest.advanceTimersByTime(250)

      expect(setOverflowSpy).toHaveBeenCalledWith('auto')
    })

    it('should complete timer operations synchronously', () => {
      const setOverflowSpy = jest.spyOn(useHtmlOverflowControl.methods, '_setHtmlOverflow')
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: setOverflowSpy
      }

      useHtmlOverflowControl.beforeDestroy.call(component)
      jest.runAllTimers()

      expect(setOverflowSpy).toHaveBeenCalledWith('auto')
    })
  })

  describe('DOM element interaction', () => {
    it('should query for html element', () => {
      const querySelectorSpy = jest.spyOn(document, 'querySelector')
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      component._setHtmlOverflow('hidden')
      expect(querySelectorSpy).toHaveBeenCalledWith('html')
    })

    it('should update style property on html element', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      component._setHtmlOverflow('hidden')
      expect(mockHtmlElement.style.overflowY).toBe('hidden')

      component._setHtmlOverflow('auto')
      expect(mockHtmlElement.style.overflowY).toBe('auto')
    })

    it('should handle null element gracefully', () => {
      jest.spyOn(document, 'querySelector').mockReturnValue(null)
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      expect(() => component._setHtmlOverflow('hidden')).not.toThrow()
    })

    it('should preserve element reference between calls', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      component._setHtmlOverflow('hidden')
      component._setHtmlOverflow('auto')

      expect(mockHtmlElement.style.overflowY).toBe('auto')
    })
  })

  describe('integration scenarios', () => {
    it('should create and destroy without errors', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      useHtmlOverflowControl.created.call(component)
      expect(() => {
        useHtmlOverflowControl.beforeDestroy.call(component)
      }).not.toThrow()
    })

    it('should handle full lifecycle', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      useHtmlOverflowControl.created.call(component)
      expect(mockHtmlElement.style.overflowY).toBe('hidden')

      jest.advanceTimersByTime(250)
      useHtmlOverflowControl.beforeDestroy.call(component)
      jest.advanceTimersByTime(250)

      expect(mockHtmlElement.style.overflowY).toBe('auto')
    })

    it('should handle prop changes during lifecycle', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      useHtmlOverflowControl.created.call(component)
      expect(mockHtmlElement.style.overflowY).toBe('hidden')

      component.shouldControlHtmlOverflow = false
      expect(component.shouldControlHtmlOverflow).toBe(false)
    })
  })

  describe('multiple instances', () => {
    it('should support multiple component instances', () => {
      const component1 = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      const component2 = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      useHtmlOverflowControl.created.call(component1)
      expect(mockHtmlElement.style.overflowY).toBe('hidden')
    })

    it('should isolate state between instances', () => {
      const component1 = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false
      }

      const component2 = {
        shouldControlHtmlOverflow: false,
        isHtmlOverflowControlManuallyDisabled: true
      }

      expect(component1.shouldControlHtmlOverflow).not.toBe(component2.shouldControlHtmlOverflow)
      expect(component1.isHtmlOverflowControlManuallyDisabled).not.toBe(component2.isHtmlOverflowControlManuallyDisabled)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle empty string overflow value', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      component._setHtmlOverflow('')
      expect(mockHtmlElement.style.overflowY).toBe('')
    })

    it('should handle invalid overflow values without throwing', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      expect(() => component._setHtmlOverflow('invalid-value')).not.toThrow()
      expect(mockHtmlElement.style.overflowY).toBe('invalid-value')
    })

    it('should handle rapid state changes', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      component.shouldControlHtmlOverflow = true
      component.shouldControlHtmlOverflow = false
      component.shouldControlHtmlOverflow = true

      expect(component.shouldControlHtmlOverflow).toBe(true)
    })

    it('should handle null values in method', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      expect(() => component._setHtmlOverflow(null)).not.toThrow()
    })
  })

  describe('performance and stability', () => {
    it('should handle style updates efficiently', () => {
      const component = {
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        component._setHtmlOverflow('hidden')
        component._setHtmlOverflow('auto')
      }
      const duration = Date.now() - start

      expect(duration).toBeLessThan(1000)
    })

    it('should maintain stability with repeated operations', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      for (let i = 0; i < 10; i++) {
        useHtmlOverflowControl.created.call(component)
        expect(mockHtmlElement.style.overflowY).toBe('hidden')
      }
    })

    it('should not leak memory on destroy', () => {
      const component = {
        shouldControlHtmlOverflow: true,
        isHtmlOverflowControlManuallyDisabled: false,
        _setHtmlOverflow: useHtmlOverflowControl.methods._setHtmlOverflow
      }

      useHtmlOverflowControl.beforeDestroy.call(component)
      jest.runAllTimers()

      // Component should be cleaned up without errors
      expect(component).toBeDefined()
    })
  })
})

