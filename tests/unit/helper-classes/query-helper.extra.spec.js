import QueryHelperForTable from '@/helper-classes/query-helper'

describe('QueryHelperForTable (extra coverage)', () => {
  const mockRouter = {
    replace: jest.fn().mockResolvedValue()
  }
  let mockRoute
  let queryHelper

  beforeEach(() => {
    mockRouter.replace.mockClear()
    mockRoute = {
      name: 'TestRoute',
      query: { page: '1', size: '10' }
    }
    queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
  })

  describe('returnQueryValues', () => {
    it('returns default page 1 when page is NaN', () => {
      queryHelper.query = { page: 'abc', size: '10' }
      expect(queryHelper.returnQueryValues()).toEqual({ page: 1, size: 10 })
    })

    it('returns default size 10 when size is NaN', () => {
      queryHelper.query = { page: '1', size: 'xyz' }
      expect(queryHelper.returnQueryValues()).toEqual({ page: 1, size: 10 })
    })

    it('returns defaults when both page and size are undefined', () => {
      queryHelper.query = {}
      expect(queryHelper.returnQueryValues()).toEqual({ page: 1, size: 10 })
    })

    it('parses string numbers correctly', () => {
      queryHelper.query = { page: '5', size: '25' }
      expect(queryHelper.returnQueryValues()).toEqual({ page: 5, size: 25 })
    })

    it('handles numeric page and size', () => {
      queryHelper.query = { page: 3, size: 25 }
      expect(queryHelper.returnQueryValues()).toEqual({ page: 3, size: 25 })
    })
  })

  describe('setRouterQuery route name mismatch', () => {
    it('replaces with empty query when name differs from route.name', () => {
      queryHelper.name = 'OtherRoute'
      queryHelper.setRouterQuery('page', 5)
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: {} })
    })
  })

  describe('controlRouteQuery size validation', () => {
    it('keeps size 25 when valid', () => {
      mockRoute.query = { page: '1', size: '25' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe('25')
    })

    it('resets size to 10 when size is 20 (invalid)', () => {
      mockRoute.query = { page: '1', size: '20' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.size).toBe(10)
    })

    it('resets page to 1 when page is NaN', () => {
      mockRoute.query = { page: 'abc', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('resets page to 1 when page is 0', () => {
      mockRoute.query = { page: '0', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('resets page to 1 when page is negative', () => {
      mockRoute.query = { page: '-1', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
    })

    it('sets defaults when no route query (page/size missing)', () => {
      mockRoute.query = {}
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      queryHelper.controlRouteQuery()
      expect(queryHelper.query.page).toBe(1)
      expect(queryHelper.query.size).toBe(10)
    })
  })

  describe('isRouteQuery', () => {
    it('returns truthy when page and size in query', () => {
      mockRoute.query = { page: '1', size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeTruthy()
    })

    it('returns falsy when page missing', () => {
      mockRoute.query = { size: '10' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })

    it('returns falsy when size missing', () => {
      mockRoute.query = { page: '1' }
      queryHelper = new QueryHelperForTable(mockRouter, mockRoute)
      expect(queryHelper.isRouteQuery()).toBeFalsy()
    })
  })

  describe('setRouterQuery name match', () => {
    it('updates query when name matches route', () => {
      queryHelper.setRouterQuery('page', 5)
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: expect.objectContaining({ page: 5 }) })
    })
  })
})
