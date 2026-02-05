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
})
