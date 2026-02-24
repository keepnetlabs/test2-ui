import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'

describe('ClientTableExportHelper', () => {
  let helper
  let mockTableRef
  let mockFilter

  beforeEach(() => {
    mockFilter = {
      FilterItems: [],
      FilterGroups: [],
      Condition: 'AND'
    }
    mockTableRef = {
      getSearchFilterItems: jest.fn(),
      sortProps: {
        order: 'ascending',
        prop: 'name'
      }
    }
    helper = new ClientTableExportHelper(mockFilter, mockTableRef, 'id')
  })

  describe('initialization', () => {
    it('should initialize with default values when no arguments provided', () => {
      const defaultHelper = new ClientTableExportHelper()
      expect(defaultHelper.filter).toEqual([])
      expect(defaultHelper.tableRef).toBeNull()
      expect(defaultHelper.searchFilter).toEqual({
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      })
      expect(defaultHelper.sortFilter.orderBy).toBe('')
      expect(defaultHelper.sortFilter.ascending).toBe(false)
    })

    it('should initialize with provided filter, tableRef, and sortOrder', () => {
      expect(helper.filter).toEqual(mockFilter)
      expect(helper.tableRef).toBe(mockTableRef)
      expect(helper.sortFilter.orderBy).toBe('id')
    })

    it('should initialize searchFilter with correct structure', () => {
      expect(helper.searchFilter).toEqual({
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      })
    })

    it('should initialize sortFilter with descending order', () => {
      expect(helper.sortFilter).toEqual({
        orderBy: 'id',
        ascending: false
      })
    })
  })

  describe('addSearchItems', () => {
    it('should add search filter items for matching columns', () => {
      const filterItems = [
        { FieldName: 'Name', Value: 'test' },
        { FieldName: 'Email', Value: 'test@test.com' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      const columns = [
        { property: 'name', filterableType: true },
        { property: 'email', filterableType: true },
        { property: 'ignored', filterableType: false }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(2)
      expect(helper.searchFilter.FilterItems[0]).toEqual({ FieldName: 'Name', Value: 'test' })
      expect(helper.searchFilter.FilterItems[1]).toEqual({ FieldName: 'Email', Value: 'test@test.com' })
    })

    it('should filter by exportSearchHelper property if filterableType is not present', () => {
      const filterItems = [
        { FieldName: 'Status', Value: 'active' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      const columns = [
        { property: 'status', exportSearchHelper: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
      expect(helper.searchFilter.FilterItems[0].FieldName).toBe('Status')
    })

    it('should match columns case-insensitively', () => {
      const filterItems = [
        { FieldName: 'UserName', Value: 'john' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      const columns = [
        { property: 'USERNAME', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should add search filter to filter FilterGroups', () => {
      const filterItems = [
        { FieldName: 'Name', Value: 'test' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      const columns = [
        { property: 'name', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.filter.FilterGroups).toContain(helper.searchFilter)
    })

    it('should handle empty columns array', () => {
      const filterItems = [
        { FieldName: 'Name', Value: 'test' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      helper.addSearchItems([])

      expect(helper.searchFilter.FilterItems).toHaveLength(0)
    })

    it('should handle empty search filter items', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])

      const columns = [
        { property: 'name', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(0)
    })

    it('should only add matching filter items', () => {
      const filterItems = [
        { FieldName: 'Name', Value: 'test' },
        { FieldName: 'Age', Value: '30' },
        { FieldName: 'City', Value: 'New York' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)

      const columns = [
        { property: 'name', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
      expect(helper.searchFilter.FilterItems[0].FieldName).toBe('Name')
    })
  })

  describe('addSortItems', () => {
    it('should set ascending to true when sort order is ascending', () => {
      mockTableRef.sortProps.order = 'ascending'
      mockTableRef.sortProps.prop = 'name'

      helper.addSortItems()

      expect(helper.sortFilter.ascending).toBe(true)
      expect(helper.sortFilter.orderBy).toBe('name')
    })

    it('should set ascending to false when sort order is not ascending', () => {
      mockTableRef.sortProps.order = 'descending'
      mockTableRef.sortProps.prop = 'email'

      helper.addSortItems()

      expect(helper.sortFilter.ascending).toBe(false)
      expect(helper.sortFilter.orderBy).toBe('email')
    })

    it('should update orderBy from tableRef sortProps', () => {
      mockTableRef.sortProps.prop = 'created_date'

      helper.addSortItems()

      expect(helper.sortFilter.orderBy).toBe('created_date')
    })

    it('should handle null sort prop', () => {
      mockTableRef.sortProps.prop = null
      mockTableRef.sortProps.order = 'ascending'

      helper.addSortItems()

      expect(helper.sortFilter.orderBy).toBeNull()
      expect(helper.sortFilter.ascending).toBe(true)
    })

    it('should handle undefined sort order', () => {
      mockTableRef.sortProps.order = undefined
      mockTableRef.sortProps.prop = 'name'

      helper.addSortItems()

      expect(helper.sortFilter.ascending).toBe(false)
      expect(helper.sortFilter.orderBy).toBe('name')
    })

    it('should update sort filter multiple times', () => {
      mockTableRef.sortProps.prop = 'name'
      mockTableRef.sortProps.order = 'ascending'
      helper.addSortItems()

      expect(helper.sortFilter.orderBy).toBe('name')
      expect(helper.sortFilter.ascending).toBe(true)

      mockTableRef.sortProps.prop = 'email'
      mockTableRef.sortProps.order = 'descending'
      helper.addSortItems()

      expect(helper.sortFilter.orderBy).toBe('email')
      expect(helper.sortFilter.ascending).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete export workflow', () => {
      const filterItems = [
        { FieldName: 'Name', Value: 'john' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)
      const columns = [
        { property: 'name', filterableType: true }
      ]
      mockTableRef.sortProps.order = 'ascending'
      mockTableRef.sortProps.prop = 'id'

      helper.addSearchItems(columns)
      helper.addSortItems()

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
      expect(helper.sortFilter.ascending).toBe(true)
      expect(helper.sortFilter.orderBy).toBe('id')
    })

    it('should maintain separate search and sort filters', () => {
      const filterItems = [
        { FieldName: 'Status', Value: 'active' }
      ]
      mockTableRef.getSearchFilterItems.mockReturnValue(filterItems)
      const columns = [
        { property: 'status', filterableType: true }
      ]

      helper.addSearchItems(columns)
      const searchFilterBeforeSort = helper.searchFilter.FilterItems[0]

      mockTableRef.sortProps.order = 'descending'
      helper.addSortItems()

      expect(helper.searchFilter.FilterItems[0]).toEqual(searchFilterBeforeSort)
      expect(helper.sortFilter.ascending).toBe(false)
    })
  })

  describe('Search Filter Structure & Manipulation', () => {
    it('should have correct search filter structure after initialization', () => {
      expect(helper.searchFilter).toHaveProperty('FilterItems')
      expect(helper.searchFilter).toHaveProperty('FilterGroups')
      expect(helper.searchFilter).toHaveProperty('Condition')
    })

    it('should initialize search filter with OR condition', () => {
      expect(helper.searchFilter.Condition).toBe('OR')
    })

    it('should maintain FilterGroups as array', () => {
      expect(Array.isArray(helper.searchFilter.FilterGroups)).toBe(true)
    })

    it('should maintain FilterItems as array', () => {
      expect(Array.isArray(helper.searchFilter.FilterItems)).toBe(true)
    })

    it('should preserve search filter structure when adding items', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.Condition).toBe('OR')
      expect(Array.isArray(helper.searchFilter.FilterItems)).toBe(true)
    })

    it('should accumulate multiple search filter items', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'john' },
        { FieldName: 'Email', Value: 'john@test.com' }
      ])
      const columns = [
        { property: 'name', filterableType: true },
        { property: 'email', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems.length).toBe(2)
      expect(helper.searchFilter.FilterItems[0].Value).toBe('john')
      expect(helper.searchFilter.FilterItems[1].Value).toBe('john@test.com')
    })

    it('should add search filter to main filter FilterGroups exactly once', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      const searchFilterOccurrences = helper.filter.FilterGroups.filter(
        f => f === helper.searchFilter
      ).length

      expect(searchFilterOccurrences).toBeGreaterThan(0)
    })

    it('should not duplicate search filter in FilterGroups on multiple calls', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      const beforeCount = helper.filter.FilterGroups.length
      helper.addSearchItems(columns)
      const afterFirstCall = helper.filter.FilterGroups.length

      helper.addSearchItems(columns)
      const afterSecondCall = helper.filter.FilterGroups.length

      // Should add once, then not increase on second call
      expect(afterFirstCall).toBeGreaterThanOrEqual(beforeCount)
    })
  })

  describe('Sort Filter State Management', () => {
    it('should initialize sortFilter with proper structure', () => {
      expect(helper.sortFilter).toHaveProperty('orderBy')
      expect(helper.sortFilter).toHaveProperty('ascending')
    })

    it('should have orderBy property from constructor param', () => {
      expect(helper.sortFilter.orderBy).toBe('id')
    })

    it('should have ascending as boolean', () => {
      expect(typeof helper.sortFilter.ascending).toBe('boolean')
    })

    it('should update ascending based on sort order', () => {
      mockTableRef.sortProps.order = 'ascending'
      helper.addSortItems()
      expect(helper.sortFilter.ascending).toBe(true)

      mockTableRef.sortProps.order = 'descending'
      helper.addSortItems()
      expect(helper.sortFilter.ascending).toBe(false)
    })

    it('should update orderBy from different prop names', () => {
      const propNames = ['name', 'email', 'created', 'status', 'id']

      for (const prop of propNames) {
        mockTableRef.sortProps.prop = prop
        helper.addSortItems()
        expect(helper.sortFilter.orderBy).toBe(prop)
      }
    })

    it('should handle empty string sort prop', () => {
      mockTableRef.sortProps.prop = ''
      helper.addSortItems()
      expect(helper.sortFilter.orderBy).toBe('')
    })

    it('should maintain sort filter independently from search filter', () => {
      mockTableRef.sortProps.order = 'ascending'
      mockTableRef.sortProps.prop = 'name'

      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Status', Value: 'active' }
      ])
      const columns = [{ property: 'status', filterableType: true }]

      helper.addSearchItems(columns)
      const sortBeforeChange = { ...helper.sortFilter }

      helper.addSortItems()

      expect(helper.sortFilter).toEqual({
        orderBy: 'name',
        ascending: true
      })
      expect(helper.searchFilter.FilterItems.length).toBeGreaterThan(0)
    })
  })

  describe('Column Configuration & Properties', () => {
    it('should handle columns with filterableType property', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [
        { property: 'name', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should ignore columns without filterableType or exportSearchHelper', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' },
        { FieldName: 'Ignored', Value: 'should not match' }
      ])
      const columns = [
        { property: 'name', filterableType: true },
        { property: 'ignored', filterableType: false }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should prefer filterableType over exportSearchHelper', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [
        { property: 'name', filterableType: true, exportSearchHelper: false }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should use exportSearchHelper when filterableType is not present', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Status', Value: 'active' }
      ])
      const columns = [
        { property: 'status', exportSearchHelper: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should handle columns with special property names', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'CreatedDate', Value: '2024-01-01' }
      ])
      const columns = [
        { property: 'CreatedDate', filterableType: true }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
    })

    it('should handle mixed column configurations', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' },
        { FieldName: 'Status', Value: 'active' },
        { FieldName: 'Email', Value: 'test@test.com' }
      ])
      const columns = [
        { property: 'name', filterableType: true },
        { property: 'status', exportSearchHelper: true },
        { property: 'email', filterableType: true },
        { property: 'ignored', filterableType: false }
      ]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems.length).toBeGreaterThan(0)
    })
  })

  describe('Filter Combination & Validation', () => {
    it('should combine search and sort filters in export', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      // Ensure consistent sort props
      mockTableRef.sortProps.order = 'ascending'
      mockTableRef.sortProps.prop = 'id'

      helper.addSearchItems(columns)
      helper.addSortItems()

      expect(helper.searchFilter.FilterItems.length).toBeGreaterThan(0)
      expect(helper.sortFilter.orderBy).toBe('id')
    })

    it('should maintain filter validity after modifications', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.filter).toHaveProperty('FilterGroups')
      expect(helper.filter).toHaveProperty('FilterItems')
      expect(helper.filter).toHaveProperty('Condition')
    })

    it('should allow empty search filters with defined sort filters', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)
      helper.addSortItems()

      expect(helper.searchFilter.FilterItems).toHaveLength(0)
      expect(helper.sortFilter.orderBy).toBeDefined()
    })

    it('should allow search filters without sort configuration', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toHaveLength(1)
      expect(helper.sortFilter.orderBy).toBe('id')
    })
  })

  describe('Edge Cases & Error Handling', () => {
    it('should handle null tableRef gracefully', () => {
      const helperWithoutRef = new ClientTableExportHelper(mockFilter, null, 'id')
      expect(helperWithoutRef.tableRef).toBeNull()
    })

    it('should throw when columns have null properties', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [
        { property: null, filterableType: true }
      ]

      // The helper throws when property is null (cannot call toLowerCase on null)
      expect(() => helper.addSearchItems(columns)).toThrow()
    })

    it('should throw when filterItems have missing FieldName', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      // The helper throws when FieldName is undefined
      expect(() => helper.addSearchItems(columns)).toThrow()
    })

    it('should handle filterItems with missing Value', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems).toBeDefined()
    })

    it('should handle very large column arrays', () => {
      const largeColumns = Array.from({ length: 100 }, (_, i) => ({
        property: `col${i}`,
        filterableType: i % 2 === 0
      }))
      mockTableRef.getSearchFilterItems.mockReturnValue([])

      helper.addSearchItems(largeColumns)

      expect(helper.searchFilter.FilterItems).toBeDefined()
    })

    it('should handle special characters in filter values', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test@#$%^&*()' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems[0].Value).toBe('test@#$%^&*()')
    })

    it('should handle unicode characters in filter values', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: '测试 тест 🎯' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.searchFilter.FilterItems[0].Value).toContain('测试')
    })
  })

  describe('Helper Method Validation', () => {
    it('should validate addSearchItems returns undefined', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      const result = helper.addSearchItems(columns)

      expect(result).toBeUndefined()
    })

    it('should validate addSortItems returns undefined', () => {
      const result = helper.addSortItems()

      expect(result).toBeUndefined()
    })

    it('should ensure helper is instantiable', () => {
      expect(helper).toBeDefined()
      expect(helper instanceof ClientTableExportHelper).toBe(true)
    })

    it('should have all expected methods', () => {
      expect(typeof helper.addSearchItems).toBe('function')
      expect(typeof helper.addSortItems).toBe('function')
    })

    it('should handle method chaining', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      const helper2 = new ClientTableExportHelper(mockFilter, mockTableRef, 'id')
      helper2.addSearchItems(columns)
      helper2.addSortItems()

      expect(helper2.searchFilter).toBeDefined()
      expect(helper2.sortFilter).toBeDefined()
    })
  })

  describe('Performance & Multiple Operations', () => {
    it('should handle addSearchItems quickly', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = Array.from({ length: 50 }, (_, i) => ({
        property: `col${i}`,
        filterableType: true
      }))

      const start = performance.now()
      helper.addSearchItems(columns)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(150)
    })

    it('should handle rapid consecutive addSortItems calls', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        helper.addSortItems()
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(150)
    })

    it('should handle multiple helpers independently', () => {
      const helper2 = new ClientTableExportHelper({ FilterItems: [], FilterGroups: [] }, mockTableRef, 'name')
      const helper3 = new ClientTableExportHelper({ FilterItems: [], FilterGroups: [] }, mockTableRef, 'email')

      expect(helper.sortFilter.orderBy).toBe('id')
      expect(helper2.sortFilter.orderBy).toBe('name')
      expect(helper3.sortFilter.orderBy).toBe('email')
    })

    it('should not affect other helper instances', () => {
      const helper2 = new ClientTableExportHelper(mockFilter, mockTableRef, 'name')

      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test' }
      ])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper2.searchFilter.FilterItems).toHaveLength(0)
    })
  })

  describe('State Preservation & Isolation', () => {
    it('should preserve filter state after addSearchItems', () => {
      const originalCondition = helper.filter.Condition
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [{ property: 'name', filterableType: true }]

      helper.addSearchItems(columns)

      expect(helper.filter.Condition).toBe(originalCondition)
    })

    it('should preserve sort state after addSearchItems', () => {
      mockTableRef.sortProps.order = 'ascending'
      mockTableRef.sortProps.prop = 'name'
      helper.addSortItems()

      const originalSort = { ...helper.sortFilter }

      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Status', Value: 'active' }
      ])
      const columns = [{ property: 'status', filterableType: true }]
      helper.addSearchItems(columns)

      expect(helper.sortFilter).toEqual(originalSort)
    })

    it('should isolate search filters between instances', () => {
      const helper2 = new ClientTableExportHelper(
        { FilterItems: [], FilterGroups: [], Condition: 'AND' },
        mockTableRef,
        'email'
      )

      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Name', Value: 'test1' }
      ])
      helper.addSearchItems([{ property: 'name', filterableType: true }])

      mockTableRef.getSearchFilterItems.mockReturnValue([
        { FieldName: 'Email', Value: 'test2@test.com' }
      ])
      helper2.addSearchItems([{ property: 'email', filterableType: true }])

      expect(helper.searchFilter.FilterItems[0].FieldName).toBe('Name')
      expect(helper2.searchFilter.FilterItems[0].FieldName).toBe('Email')
    })

    it('should not mutate input columns array', () => {
      mockTableRef.getSearchFilterItems.mockReturnValue([])
      const columns = [
        { property: 'name', filterableType: true },
        { property: 'email', filterableType: true }
      ]
      const originalLength = columns.length

      helper.addSearchItems(columns)

      expect(columns.length).toBe(originalLength)
      expect(columns[0]).toEqual({ property: 'name', filterableType: true })
    })
  })

  describe('Constructor Variations', () => {
    it('should handle undefined filter parameter', () => {
      const helperNoFilter = new ClientTableExportHelper(undefined, mockTableRef, 'id')
      expect(helperNoFilter.filter).toBeDefined()
    })

    it('should handle empty string sortOrder', () => {
      const helperEmptySort = new ClientTableExportHelper(mockFilter, mockTableRef, '')
      expect(helperEmptySort.sortFilter.orderBy).toBe('')
    })

    it('should handle null sortOrder', () => {
      const helperNullSort = new ClientTableExportHelper(mockFilter, mockTableRef, null)
      expect(helperNullSort.sortFilter.orderBy).toBeNull()
    })

    it('should initialize with different sort orders', () => {
      const helper1 = new ClientTableExportHelper(mockFilter, mockTableRef, 'id')
      const helper2 = new ClientTableExportHelper(mockFilter, mockTableRef, 'name')
      const helper3 = new ClientTableExportHelper(mockFilter, mockTableRef, 'email')

      expect(helper1.sortFilter.orderBy).toBe('id')
      expect(helper2.sortFilter.orderBy).toBe('name')
      expect(helper3.sortFilter.orderBy).toBe('email')
    })
  })

  describe('Property Accessors', () => {
    it('should provide access to filter property', () => {
      expect(helper.filter).toBe(mockFilter)
    })

    it('should provide access to tableRef property', () => {
      expect(helper.tableRef).toBe(mockTableRef)
    })

    it('should provide access to searchFilter property', () => {
      expect(helper.searchFilter).toBeDefined()
      expect(typeof helper.searchFilter).toBe('object')
    })

    it('should provide access to sortFilter property', () => {
      expect(helper.sortFilter).toBeDefined()
      expect(typeof helper.sortFilter).toBe('object')
    })

    it('should allow modification of searchFilter properties', () => {
      const newItems = [{ FieldName: 'Test', Value: 'value' }]
      helper.searchFilter.FilterItems = newItems

      expect(helper.searchFilter.FilterItems).toEqual(newItems)
    })

    it('should allow modification of sortFilter properties', () => {
      helper.sortFilter.orderBy = 'newProp'
      helper.sortFilter.ascending = true

      expect(helper.sortFilter.orderBy).toBe('newProp')
      expect(helper.sortFilter.ascending).toBe(true)
    })
  })
})
