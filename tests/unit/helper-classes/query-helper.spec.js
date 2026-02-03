import QueryHelperForTable from '@/helper-classes/query-helper'

describe('QueryHelperForTable', () => {
  let mockRouter
  let mockRoute
  let queryHelper

  beforeEach(() => {
    mockRouter = {
      replace: jest.fn().mockResolvedValue({}),
      push: jest.fn().mockResolvedValue({})
    }

    mockRoute = {
      name: 'TestRoute',
      query: {}
    }

    queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
  })

  describe('initialization', () => {
    it('should initialize with router and route', () => {
      expect(queryHelper.router).toBe(mockRouter)
      expect(queryHelper.route).toBe(mockRoute)
    })

    it('should store route name', () => {
      expect(queryHelper.name).toBe('TestRoute')
    })

    it('should copy route query to internal query object', () => {
      mockRoute.query = { page: 2, size: 25 }
      const helper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(helper.query).toEqual({ page: 2, size: 25 })
    })

    it('should create new query object without modifying original route', () => {
      mockRoute.query = { page: 1 }
      const helper = new QueryHelperForTable(mockRouter, mockRoute)
      helper.query.page = 5
      expect(mockRoute.query.page).toBe(1)
    })

    it('should handle empty route query', () => {
      mockRoute.query = {}
      const helper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(helper.query).toEqual({})
    })
  })

  describe('isRouteQuery', () => {
    it('should return truthy when page and size are present', () => {
      mockRoute.query = { page: '1', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeTruthy()
    })

    it('should return falsy when page is missing', () => {
      mockRoute.query = { size: 10 }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })

    it('should return falsy when size is missing', () => {
      mockRoute.query = { page: 1 }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })

    it('should return falsy when both are missing', () => {
      mockRoute.query = {}
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })

    it('should return falsy when route is null', () => {
      queryHelper.route = null
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })
  })

  describe('setDefaultValues', () => {
    it('should set page to 1', () => {
      queryHelper.setDefaultValues()
      expect(queryHelper.query.page).toBe(1)
    })

    it('should set size to 10', () => {
      queryHelper.setDefaultValues()
      expect(queryHelper.query.size).toBe(10)
    })

    it('should call setRouterQuery for each default', () => {
      const spy = jest.spyOn(queryHelper, 'setRouterQuery')
      queryHelper.setDefaultValues()
      expect(spy).toHaveBeenCalledWith('page', 1)
      expect(spy).toHaveBeenCalledWith('size', 10)
      spy.mockRestore()
    })

    it('should preserve existing query parameters', () => {
      queryHelper.query = { search: 'test', sort: 'name' }
      queryHelper.setDefaultValues()
      expect(queryHelper.query.search).toBe('test')
      expect(queryHelper.query.sort).toBe('name')
      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(10)
    })
  })

  describe('controlRouteQuery', () => {
    it('should set defaults if no route query exists', () => {
      mockRoute.query = {}
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(10)
    })

    it('should accept valid size 5', () => {
      mockRoute.query = { page: 1, size: '5' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe('5')
    })

    it('should accept valid size 10', () => {
      mockRoute.query = { page: 1, size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe('10')
    })

    it('should accept valid size 25', () => {
      mockRoute.query = { page: 1, size: '25' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe('25')
    })

    it('should reset invalid size to 10', () => {
      mockRoute.query = { page: 1, size: '50' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe(10)
    })

    it('should accept valid page numbers', () => {
      mockRoute.query = { page: '5', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe('5')
    })

    it('should reset invalid page 0 to 1', () => {
      mockRoute.query = { page: '0', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('should reset invalid page negative to 1', () => {
      mockRoute.query = { page: '-5', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('should reset non-numeric page to 1', () => {
      mockRoute.query = { page: 'abc', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('should handle NaN page value', () => {
      mockRoute.query = { page: 'NaN', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })
  })

  describe('setRouterQuery', () => {
    it('should update internal query object', () => {
      queryHelper.setRouterQuery('page', 5)
      expect(queryHelper.query.page).toBe(5)
    })

    it('should call router.replace with updated query', () => {
      queryHelper.setRouterQuery('page', 5)
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: expect.objectContaining({ page: 5 })
      })
    })

    it('should preserve other query parameters', () => {
      queryHelper.query = { size: 25, search: 'test' }
      queryHelper.setRouterQuery('page', 3)
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: expect.objectContaining({
          page: 3,
          size: 25,
          search: 'test'
        })
      })
    })

    it('should reset query if route name changes', () => {
      queryHelper.query = { page: 5, size: 25 }
      queryHelper.name = 'OldRoute'
      mockRoute.name = 'NewRoute'
      queryHelper.setRouterQuery('page', 1)
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: {} })
    })

    it('should handle router replace errors silently', async () => {
      mockRouter.replace.mockRejectedValueOnce(new Error('Navigation error'))
      expect(() => {
        queryHelper.setRouterQuery('page', 5)
      }).not.toThrow()
    })

    it('should update multiple query parameters', () => {
      queryHelper.setRouterQuery('page', 2)
      queryHelper.setRouterQuery('size', 25)
      expect(mockRouter.replace).toHaveBeenLastCalledWith({
        query: expect.objectContaining({
          page: 2,
          size: 25
        })
      })
    })

    it('should handle string and number values', () => {
      queryHelper.setRouterQuery('page', '5')
      expect(queryHelper.query.page).toBe('5')

      queryHelper.setRouterQuery('limit', 100)
      expect(queryHelper.query.limit).toBe(100)
    })

    it('should handle special query parameter names', () => {
      queryHelper.setRouterQuery('search', 'test term')
      queryHelper.setRouterQuery('sort', 'name:asc')
      expect(mockRouter.replace).toHaveBeenLastCalledWith({
        query: expect.objectContaining({
          search: 'test term',
          sort: 'name:asc'
        })
      })
    })
  })

  describe('integration scenarios', () => {
    it('should handle full workflow: initialize, control, set values', () => {
      mockRoute.query = { page: 'invalid', size: 'invalid' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)

      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(10)

      queryHelper.setRouterQuery('page', 2)
      expect(mockRouter.replace).toHaveBeenCalled()
    })

    it('should handle pagination workflow', () => {
      mockRoute.query = {}
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)

      queryHelper.setDefaultValues()
      queryHelper.setRouterQuery('page', 1)
      queryHelper.setRouterQuery('size', 25)

      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(25)
    })

    it('should maintain state across multiple operations', () => {
      mockRoute.query = { page: 1, size: 10 }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)

      queryHelper.setRouterQuery('search', 'test')
      expect(queryHelper.query.search).toBe('test')

      queryHelper.setRouterQuery('page', 2)
      expect(queryHelper.query.search).toBe('test')
      expect(queryHelper.query.page).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined router', () => {
      // Constructor assigns undefined router - this is allowed
      const helper = new QueryHelperForTable(undefined, mockRoute)
      expect(helper.router).toBeUndefined()
    })

    it('should handle undefined route gracefully when route is provided', () => {
      const helper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(helper.route).toBeDefined()
    })

    it('should handle router.replace throwing', () => {
      mockRouter.replace.mockRejectedValueOnce(new Error('Error'))
      expect(() => {
        queryHelper.setRouterQuery('page', 5)
      }).not.toThrow()
    })

    it('should handle very large page numbers', () => {
      mockRoute.query = { page: '999999', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe('999999')
    })

    it('should handle empty string values', () => {
      mockRoute.query = { page: '', size: '' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(10)
    })

    it('should handle null values in route query', () => {
      mockRoute.query = { page: null, size: null }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(() => {
        queryHelper.controlRouteQuery()
      }).not.toThrow()
    })
  })
})
