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
})
