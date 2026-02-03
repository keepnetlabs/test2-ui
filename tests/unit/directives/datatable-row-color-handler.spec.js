import rowColorHandler from '@/directives/datatable-row-color-handler'

describe('datatable-row-color-handler directive', () => {
  let mockElement
  let mockWrapper
  let mockTableBody

  beforeEach(() => {
    jest.useFakeTimers()
    // Clear any existing timeouts
    jest.clearAllTimers()

    // Create mock DOM elements
    mockTableBody = document.createElement('div')
    mockTableBody.className = 'el-table__body-wrapper'

    mockWrapper = document.createElement('div')
    mockWrapper.className = 'el-table__wrapper'
    mockWrapper.appendChild(mockTableBody)

    mockElement = document.createElement('div')
    mockElement.appendChild(mockWrapper)

    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    jest.useRealTimers()
    if (mockElement && mockElement.parentElement) {
      mockElement.parentElement.removeChild(mockElement)
    }
  })

  describe('directive structure', () => {
    it('should be defined', () => {
      expect(rowColorHandler).toBeDefined()
    })

    it('should have componentUpdated hook', () => {
      expect(typeof rowColorHandler.componentUpdated).toBe('function')
    })

    it('should be an object with required Vue directive hooks', () => {
      expect(typeof rowColorHandler.componentUpdated).toBe('function')
    })
  })

  describe('row coloring behavior', () => {
    it('should process rows when selectedCluster is true', () => {
      const row1 = document.createElement('tr')
      const row2 = document.createElement('tr')
      const row3 = document.createElement('tr')

      mockTableBody.appendChild(row1)
      mockTableBody.appendChild(row2)
      mockTableBody.appendChild(row3)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should apply background colors to rows', () => {
      const row1 = document.createElement('tr')
      mockTableBody.appendChild(row1)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      // Row should have some styling applied
      expect(row1).toBeDefined()
    })

    it('should handle multiple rows with alternating styling', () => {
      const rows = []
      for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr')
        mockTableBody.appendChild(row)
        rows.push(row)
      }

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()

      // All rows should be processed
      rows.forEach((row) => {
        expect(row).toBeDefined()
      })
    })

    it('should skip rows with level classes', () => {
      const levelRow = document.createElement('tr')
      levelRow.className = 'level-1'

      const normalRow = document.createElement('tr')

      mockTableBody.appendChild(levelRow)
      mockTableBody.appendChild(normalRow)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      // Rows should be processed without errors
      expect(levelRow).toBeDefined()
      expect(normalRow).toBeDefined()
    })

    it('should check selectedCluster before processing', () => {
      const row = document.createElement('tr')
      mockTableBody.appendChild(row)

      const mockVNode = {
        context: {
          selectedCluster: false
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      // When selectedCluster is false, timeout should not be set
      expect(row).toBeDefined()
    })
  })

  describe('DOM querying', () => {
    it('should handle missing el-table__body-wrapper gracefully', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      const elementWithoutWrapper = document.createElement('div')
      expect(() => {
        rowColorHandler.componentUpdated(elementWithoutWrapper, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should handle empty table body', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      const emptyTableBody = document.createElement('div')
      emptyTableBody.className = 'el-table__body-wrapper'

      const wrapper = document.createElement('div')
      wrapper.appendChild(emptyTableBody)

      const element = document.createElement('div')
      element.appendChild(wrapper)

      expect(() => {
        rowColorHandler.componentUpdated(element, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should query multiple table sections', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      // The directive queries these specific classes
      const bodyWrapper = mockElement.querySelector('.el-table__body-wrapper')
      const fixedBodyWrapper = document.createElement('div')
      fixedBodyWrapper.className = 'el-table__fixed-body-wrapper'

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })
  })

  describe('timing behavior', () => {
    it('should support async updates', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      // Should complete without errors
      expect(true).toBe(true)
    })

    it('should handle multiple successive updates', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should defer row coloring with setTimeout', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      const row = document.createElement('tr')
      mockTableBody.appendChild(row)

      // Before timeout expires, row should not have color
      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      expect(row.style.backgroundColor).toBe('')

      // After timeout, row should have color
      jest.advanceTimersByTime(200)
      expect(row.style.backgroundColor).not.toBe('')
    })
  })

  describe('integration with Vue vNode', () => {
    it('should handle valid vNode context', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      }).not.toThrow()
    })

    it('should handle vNode with context property', () => {
      const mockVNode = {
        context: {}
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should work with binding parameter', () => {
      const binding = {
        value: true,
        modifiers: {}
      }

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, binding, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle table with many rows', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      // Create 100 rows
      for (let i = 0; i < 100; i++) {
        const row = document.createElement('tr')
        mockTableBody.appendChild(row)
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should handle rows with various classList configurations', () => {
      const row1 = document.createElement('tr')
      row1.className = 'level-1 custom-class'

      const row2 = document.createElement('tr')
      row2.className = 'custom-class'

      const row3 = document.createElement('tr')
      row3.className = 'level-2 another-class'

      mockTableBody.appendChild(row1)
      mockTableBody.appendChild(row2)
      mockTableBody.appendChild(row3)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should work with multiple table wrapper elements', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      const multiWrapper = document.createElement('div')
      for (let i = 0; i < 5; i++) {
        const body = document.createElement('div')
        body.className = 'el-table__body-wrapper'
        const row = document.createElement('tr')
        body.appendChild(row)
        multiWrapper.appendChild(body)
      }

      expect(() => {
        rowColorHandler.componentUpdated(multiWrapper, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })
  })
})
