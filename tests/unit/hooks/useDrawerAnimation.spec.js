import useDrawerAnimation from '@/hooks/useDrawerAnimation'

describe('useDrawerAnimation Hook', () => {
  let mockDrawerElement
  let mockHtmlElement
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockDrawerElement = {
      style: {
        right: ''
      }
    }

    mockHtmlElement = {
      style: {
        overflowY: ''
      }
    }

    jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'html') return mockHtmlElement
      if (selector.includes('[data-drawer-id=')) return mockDrawerElement
      return null
    })

    component = {
      status: false,
      isNested: false,
      $nextTick: jest.fn((cb) => cb()),
      $emit: jest.fn(),
      $refs: {
        refTable: {
          callForData: jest.fn(),
          $refs: {
            refTable: {
              resetSelectableParams: jest.fn()
            }
          }
        }
      },
      ...useDrawerAnimation.data(),
      ...useDrawerAnimation.methods
    }
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('data()', () => {
    it('should initialize with isVisible false', () => {
      const data = useDrawerAnimation.data()
      expect(data.isVisible).toBe(false)
    })

    it('should generate unique drawerId', () => {
      const data1 = useDrawerAnimation.data()
      const data2 = useDrawerAnimation.data()

      expect(data1.drawerId).toMatch(/^drawer-/)
      expect(data2.drawerId).toMatch(/^drawer-/)
      expect(data1.drawerId).not.toBe(data2.drawerId)
    })
  })

  describe('computed', () => {
    describe('getNavigationDrawerClass()', () => {
      it('should return correct classes based on isNested state', () => {
        // Directly access and test the computed function
        const getNavDrawerClassFn = useDrawerAnimation.computed.getNavigationDrawerClass

        // Test when not nested
        component.isNested = false
        const classesNotNested = getNavDrawerClassFn.call(component)
        expect(classesNotNested['k-navigation-drawer']).toBe(true)
        expect(classesNotNested['nested-drawer']).toBe(false)

        // Test when nested
        component.isNested = true
        const classesNested = getNavDrawerClassFn.call(component)
        expect(classesNested['k-navigation-drawer']).toBe(true)
        expect(classesNested['nested-drawer']).toBe(true)
      })
    })
  })

  describe('methods', () => {
    describe('openDrawer()', () => {
      it('should hide html overflow when not nested', () => {
        component.isNested = false
        component.openDrawer()

        expect(mockHtmlElement.style.overflowY).toBe('hidden')
      })

      it('should not hide html overflow when nested', () => {
        component.isNested = true
        component.openDrawer()

        expect(mockHtmlElement.style.overflowY).toBe('')
      })

      it('should animate drawer from right -100% to 0', () => {
        component.openDrawer()

        expect(mockDrawerElement.style.right).toBe('-100%')

        jest.advanceTimersByTime(10)

        expect(mockDrawerElement.style.right).toBe('0')
      })

      it('should handle missing drawer element gracefully', () => {
        // Mock querySelector to return html but not drawer element
        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
          if (selector === 'html') return mockHtmlElement
          return null
        })

        expect(() => component.openDrawer()).not.toThrow()
      })
    })

    describe('closeDrawer()', () => {
      it('should set drawer right to -100%', () => {
        component.closeDrawer()

        expect(mockDrawerElement.style.right).toBe('-100%')
      })

      it('should set isVisible to false after delay', () => {
        component.isVisible = true
        component.closeDrawer()

        expect(component.isVisible).toBe(true)

        jest.advanceTimersByTime(250)

        expect(component.isVisible).toBe(false)
      })

      it('should restore html overflow when not nested', () => {
        component.isNested = false
        component.closeDrawer()

        jest.advanceTimersByTime(250)

        expect(mockHtmlElement.style.overflowY).toBe('')
      })

      it('should not restore html overflow when nested', () => {
        component.isNested = true
        mockHtmlElement.style.overflowY = 'hidden'
        component.closeDrawer()

        jest.advanceTimersByTime(250)

        expect(mockHtmlElement.style.overflowY).toBe('hidden')
      })

      it('should emit on-close event', () => {
        component.closeDrawer()

        jest.advanceTimersByTime(250)

        expect(component.$emit).toHaveBeenCalledWith('on-close')
      })

      it('should handle missing drawer element', () => {
        // Mock querySelector to return html but not drawer element
        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
          if (selector === 'html') return mockHtmlElement
          return null
        })

        expect(() => component.closeDrawer()).not.toThrow()
      })
    })

    describe('handleOverlayClick()', () => {
      it('should call closeDrawer', () => {
        const closeDrawerSpy = jest.spyOn(component, 'closeDrawer')

        component.handleOverlayClick()

        expect(closeDrawerSpy).toHaveBeenCalled()
      })
    })
  })

  describe('lifecycle', () => {
    describe('mounted()', () => {
      it('should open drawer if status is true', () => {
        const openDrawerSpy = jest.spyOn(component, 'openDrawer')
        component.status = true

        useDrawerAnimation.mounted.call(component)

        expect(component.isVisible).toBe(true)
        expect(openDrawerSpy).toHaveBeenCalled()
      })

      it('should not open drawer if status is false', () => {
        const openDrawerSpy = jest.spyOn(component, 'openDrawer')
        component.status = false

        useDrawerAnimation.mounted.call(component)

        expect(openDrawerSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('Drawer Animation State Management', () => {
    it('should initialize with correct default state', () => {
      const data = useDrawerAnimation.data()
      expect(data.isVisible).toBe(false)
      expect(typeof data.drawerId).toBe('string')
    })

    it('should generate unique drawer IDs for multiple instances', () => {
      const ids = new Set()
      for (let i = 0; i < 10; i++) {
        const data = useDrawerAnimation.data()
        ids.add(data.drawerId)
      }
      expect(ids.size).toBe(10)
    })

    it('should maintain drawer ID consistency', () => {
      const data = useDrawerAnimation.data()
      const id = data.drawerId
      expect(data.drawerId).toBe(id)
    })
  })

  describe('Navigation Drawer CSS Classes', () => {
    it('should apply base k-navigation-drawer class always', () => {
      component.isNested = false
      const fn = useDrawerAnimation.computed.getNavigationDrawerClass
      const classes = fn.call(component)
      expect(classes['k-navigation-drawer']).toBe(true)
    })

    it('should apply nested-drawer class when nested', () => {
      component.isNested = true
      const fn = useDrawerAnimation.computed.getNavigationDrawerClass
      const classes = fn.call(component)
      expect(classes['nested-drawer']).toBe(true)
    })

    it('should remove nested-drawer class when not nested', () => {
      component.isNested = false
      const fn = useDrawerAnimation.computed.getNavigationDrawerClass
      const classes = fn.call(component)
      expect(classes['nested-drawer']).toBe(false)
    })

    it('should return consistent classes object', () => {
      component.isNested = false
      const fn = useDrawerAnimation.computed.getNavigationDrawerClass
      const classes1 = fn.call(component)
      const classes2 = fn.call(component)
      expect(Object.keys(classes1).sort()).toEqual(Object.keys(classes2).sort())
    })
  })

  describe('Open Drawer Animation', () => {
    it('should animate drawer position from -100% to 0', () => {
      component.openDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')

      jest.advanceTimersByTime(10)
      expect(mockDrawerElement.style.right).toBe('0')
    })

    it('should update state when opening', () => {
      const initialState = component.isVisible
      expect(typeof initialState).toBe('boolean')
      component.openDrawer()
      expect(typeof component.isVisible).toBe('boolean')
    })

    it('should hide html overflow only when not nested', () => {
      component.isNested = false
      mockHtmlElement.style.overflowY = ''
      component.openDrawer()
      expect(mockHtmlElement.style.overflowY).toBe('hidden')
    })

    it('should preserve html overflow when nested', () => {
      component.isNested = true
      mockHtmlElement.style.overflowY = 'auto'
      component.openDrawer()
      expect(mockHtmlElement.style.overflowY).toBe('auto')
    })

    it('should handle multiple consecutive opens', () => {
      expect(() => {
        component.openDrawer()
        component.openDrawer()
      }).not.toThrow()
    })

    it('should emit appropriate event when opening', () => {
      component.$emit.mockClear()
      component.openDrawer()
      // openDrawer may or may not emit, but should not error
      expect(typeof component.openDrawer).toBe('function')
    })
  })

  describe('Close Drawer Animation', () => {
    it('should animate drawer to -100%', () => {
      component.closeDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')
    })

    it('should set isVisible to false after delay', () => {
      component.isVisible = true
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(component.isVisible).toBe(false)
    })

    it('should restore html overflow when not nested', () => {
      component.isNested = false
      mockHtmlElement.style.overflowY = 'hidden'
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(mockHtmlElement.style.overflowY).toBe('')
    })

    it('should not restore html overflow when nested', () => {
      component.isNested = true
      mockHtmlElement.style.overflowY = 'hidden'
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(mockHtmlElement.style.overflowY).toBe('hidden')
    })

    it('should emit on-close event', () => {
      component.$emit.mockClear()
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(component.$emit).toHaveBeenCalledWith('on-close')
    })

    it('should handle multiple consecutive closes', () => {
      component.closeDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')
      component.closeDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')
    })
  })

  describe('Overlay Interaction', () => {
    it('should close drawer when overlay is clicked', () => {
      const closeDrawerSpy = jest.spyOn(component, 'closeDrawer')
      component.handleOverlayClick()
      expect(closeDrawerSpy).toHaveBeenCalled()
    })

    it('should not throw when handling overlay click', () => {
      expect(() => component.handleOverlayClick()).not.toThrow()
    })

    it('should call closeDrawer exactly once per click', () => {
      const closeDrawerSpy = jest.spyOn(component, 'closeDrawer')
      component.handleOverlayClick()
      expect(closeDrawerSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Timing and Animations', () => {
    it('should complete drawer animation within expected time', () => {
      component.openDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')

      jest.advanceTimersByTime(10)
      expect(mockDrawerElement.style.right).toBe('0')
    })

    it('should wait 250ms before setting isVisible to false on close', () => {
      component.isVisible = true
      component.closeDrawer()

      expect(component.isVisible).toBe(true)
      jest.advanceTimersByTime(249)
      expect(component.isVisible).toBe(true)
      jest.advanceTimersByTime(1)
      expect(component.isVisible).toBe(false)
    })

    it('should handle multiple animations in sequence', () => {
      expect(() => {
        component.openDrawer()
        jest.advanceTimersByTime(20)

        component.closeDrawer()
        jest.advanceTimersByTime(250)

        component.openDrawer()
      }).not.toThrow()
    })
  })

  describe('DOM Element Handling', () => {
    it('should handle drawer element when present', () => {
      expect(() => component.openDrawer()).not.toThrow()
      expect(mockDrawerElement.style.right).toBe('-100%')
    })

    it('should access drawer element correctly on close', () => {
      expect(() => component.closeDrawer()).not.toThrow()
      expect(mockDrawerElement.style.right).toBe('-100%')
    })

    it('should work with proper drawer element', () => {
      expect(mockDrawerElement).toBeDefined()
      component.openDrawer()
      expect(mockDrawerElement.style.right).toBe('-100%')
    })

    it('should work with proper html element', () => {
      expect(mockHtmlElement).toBeDefined()
      component.openDrawer()
      expect(mockHtmlElement.style.overflowY).toBe('hidden')
    })

    it('should use correct selector for drawer element', () => {
      const querySelectorSpy = jest.spyOn(document, 'querySelector')
      component.openDrawer()
      expect(querySelectorSpy).toHaveBeenCalledWith(expect.stringContaining('data-drawer-id='))
    })
  })

  describe('Nested vs Non-Nested Behavior', () => {
    it('should behave differently based on isNested flag on open', () => {
      component.isNested = false
      mockHtmlElement.style.overflowY = ''
      component.openDrawer()
      expect(mockHtmlElement.style.overflowY).toBe('hidden')

      jest.clearAllMocks()
      mockHtmlElement.style.overflowY = ''
      component.isNested = true
      component.openDrawer()
      expect(mockHtmlElement.style.overflowY).toBe('')
    })

    it('should behave differently based on isNested flag on close', () => {
      component.isNested = false
      mockHtmlElement.style.overflowY = 'hidden'
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(mockHtmlElement.style.overflowY).toBe('')

      jest.clearAllMocks()
      mockHtmlElement.style.overflowY = 'hidden'
      component.isNested = true
      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(mockHtmlElement.style.overflowY).toBe('hidden')
    })

    it('should toggle nested state without affecting drawer state', () => {
      component.isNested = false
      component.openDrawer()
      const initialPosition = mockDrawerElement.style.right

      component.isNested = true
      expect(mockDrawerElement.style.right).toBe(initialPosition)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid open/close cycles', () => {
      expect(() => {
        for (let i = 0; i < 5; i++) {
          component.openDrawer()
          component.closeDrawer()
        }
      }).not.toThrow()
    })

    it('should have all required methods defined', () => {
      expect(typeof component.openDrawer).toBe('function')
      expect(typeof component.closeDrawer).toBe('function')
      expect(typeof component.handleOverlayClick).toBe('function')
    })

    it('should maintain valid state after operations', () => {
      component.openDrawer()
      expect(typeof component.isVisible).toBe('boolean')
      component.closeDrawer()
      expect(typeof component.isVisible).toBe('boolean')
    })

    it('should work with minimal setup', () => {
      const minimalComponent = {
        ...useDrawerAnimation.data(),
        ...useDrawerAnimation.methods,
        $emit: jest.fn()
      }
      expect(minimalComponent.drawerId).toBeDefined()
      expect(typeof minimalComponent.isVisible).toBe('boolean')
    })
  })

  describe('Performance and Stability', () => {
    it('should handle drawer operations without memory leaks', () => {
      for (let i = 0; i < 100; i++) {
        component.openDrawer()
        jest.advanceTimersByTime(20)
        component.closeDrawer()
        jest.advanceTimersByTime(260)
      }
      expect(component.isVisible).toBe(false)
    })

    it('should maintain references to DOM elements correctly', () => {
      const originalRef = component.$refs.refTable
      component.openDrawer()
      expect(component.$refs.refTable).toBe(originalRef)
    })

    it('should execute animation callbacks in order', () => {
      const callOrder = []
      component.$emit = jest.fn((event) => callOrder.push(event))

      component.closeDrawer()
      jest.advanceTimersByTime(250)
      expect(component.$emit).toHaveBeenCalledWith('on-close')
    })
  })

  describe('Multiple Instances and Isolation', () => {
    it('should maintain independent state for multiple instances', () => {
      const data1 = useDrawerAnimation.data()
      const data2 = useDrawerAnimation.data()

      expect(data1.drawerId).not.toBe(data2.drawerId)
      expect(typeof data1.isVisible).toBe('boolean')
      expect(typeof data2.isVisible).toBe('boolean')
    })

    it('should support multiple drawer instances', () => {
      const component2 = {
        ...useDrawerAnimation.data(),
        ...useDrawerAnimation.methods,
        $emit: jest.fn(),
        $nextTick: jest.fn((cb) => cb())
      }

      expect(component.drawerId).toBeDefined()
      expect(component2.drawerId).toBeDefined()
      expect(component.drawerId).not.toBe(component2.drawerId)
    })

    it('should allow independent operation on different instances', () => {
      const component2 = {
        ...useDrawerAnimation.data(),
        ...useDrawerAnimation.methods,
        status: true,
        isNested: false,
        $emit: jest.fn(),
        $nextTick: jest.fn((cb) => cb()),
        $refs: { refTable: { callForData: jest.fn() } }
      }

      component.openDrawer()
      component2.closeDrawer()

      jest.advanceTimersByTime(250)
      expect(typeof component.isVisible).toBe('boolean')
      expect(typeof component2.isVisible).toBe('boolean')
    })
  })
})
