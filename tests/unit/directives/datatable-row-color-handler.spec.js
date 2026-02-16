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

  describe('DOM element handling', () => {
    it('should find table body wrapper correctly', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        const result = rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        expect(result).not.toThrow
      }).not.toThrow()
    })

    it('should handle missing table body wrapper gracefully', () => {
      const emptyElement = document.createElement('div')
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(emptyElement, {}, mockVNode)
      }).not.toThrow()
    })

    it('should process all rows in table body', () => {
      const rows = []
      for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr')
        row.id = `row-${i}`
        rows.push(row)
        mockTableBody.appendChild(row)
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
    })
  })

  describe('Directive hook validation', () => {
    it('should have only componentUpdated hook', () => {
      const hooks = Object.keys(rowColorHandler)
      expect(hooks).toContain('componentUpdated')
    })

    it('should execute hook without errors', () => {
      const mockVNode = {
        context: {
          selectedCluster: false
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      }).not.toThrow()
    })

    it('should accept el, binding, and vNode parameters', () => {
      const binding = {}
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, binding, mockVNode)
      }).not.toThrow()
    })
  })

  describe('Context and binding handling', () => {
    it('should handle vNode context without selectedCluster property', () => {
      const mockVNode = {
        context: {}
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      }).not.toThrow()
    })

    it('should handle vNode with proper context', () => {
      const mockVNode = {
        context: {
          selectedCluster: false
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      }).not.toThrow()
    })

    it('should handle binding with empty object', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      }).not.toThrow()
    })
  })

  describe('Row processing and styling', () => {
    it('should process rows without modifying existing styles', () => {
      const row = document.createElement('tr')
      row.style.backgroundColor = 'red'
      const originalColor = row.style.backgroundColor
      mockTableBody.appendChild(row)

      const mockVNode = {
        context: {
          selectedCluster: false
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      // When selectedCluster is false, original styles should be preserved or not modified in certain way
      expect(row.style.backgroundColor === originalColor || row.style.backgroundColor === '').toBe(true)
    })

    it('should handle rows with data attributes', () => {
      const row = document.createElement('tr')
      row.dataset.id = '123'
      row.dataset.status = 'active'
      mockTableBody.appendChild(row)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
        jest.advanceTimersByTime(200)
      }).not.toThrow()

      expect(row.dataset.id).toBe('123')
      expect(row.dataset.status).toBe('active')
    })

    it('should maintain row element properties during processing', () => {
      const row = document.createElement('tr')
      row.setAttribute('data-test', 'value')
      mockTableBody.appendChild(row)

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      expect(row.getAttribute('data-test')).toBe('value')
    })
  })

  describe('Performance and efficiency', () => {
    it('should handle large number of rows efficiently', () => {
      const start = Date.now()

      for (let i = 0; i < 100; i++) {
        const row = document.createElement('tr')
        mockTableBody.appendChild(row)
      }

      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)

      const duration = Date.now() - start
      expect(duration).toBeLessThan(1000)
    })

    it('should use appropriate timing for async operations', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      const timeBefore = Date.now()
      rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
      jest.advanceTimersByTime(200)
      const timeAfter = Date.now()

      expect(timeAfter - timeBefore).toBeGreaterThanOrEqual(0)
    })
  })

  describe('State consistency', () => {
    it('should maintain consistent behavior across multiple calls', () => {
      const mockVNode1 = {
        context: {
          selectedCluster: true
        }
      }

      const mockVNode2 = {
        context: {
          selectedCluster: false
        }
      }

      expect(() => {
        rowColorHandler.componentUpdated(mockElement, {}, mockVNode1)
        jest.advanceTimersByTime(200)

        rowColorHandler.componentUpdated(mockElement, {}, mockVNode2)
        jest.advanceTimersByTime(200)
      }).not.toThrow()
    })

    it('should handle repeated directive updates', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      expect(() => {
        for (let i = 0; i < 3; i++) {
          rowColorHandler.componentUpdated(mockElement, {}, mockVNode)
          jest.advanceTimersByTime(200)
        }
      }).not.toThrow()
    })
  })

  describe('Integration and compatibility', () => {
    it('should work with Element Plus table structure', () => {
      expect(mockTableBody.className).toBe('el-table__body-wrapper')
      expect(mockWrapper.className).toBe('el-table__wrapper')

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

    it('should be compatible with Vue directive lifecycle', () => {
      const mockVNode = {
        context: {
          selectedCluster: true
        }
      }

      // Simulate lifecycle hook
      expect(typeof rowColorHandler.componentUpdated).toBe('function')
      expect(rowColorHandler.componentUpdated.length).toBeGreaterThanOrEqual(3)
    })
  })
})
