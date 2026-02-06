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
})
