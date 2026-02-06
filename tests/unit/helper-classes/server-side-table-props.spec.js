import ServerSideProps from '@/helper-classes/server-side-table-props'

describe('ServerSideProps', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const props = new ServerSideProps()
      expect(props.orderBy).toBe('')
      expect(props.isClustered).toBe(false)
      expect(props.pageSize).toBe(10)
      expect(props.pageNumber).toBe(1)
      expect(props.totalNumberOfPages).toBe(0)
      expect(props.totalNumberOfRecords).toBe(0)
    })

    it('should initialize with provided values', () => {
      const props = new ServerSideProps('name', true, 25, 2, 5, 100)
      expect(props.orderBy).toBe('name')
      expect(props.isClustered).toBe(true)
      expect(props.pageSize).toBe(25)
      expect(props.pageNumber).toBe(2)
      expect(props.totalNumberOfPages).toBe(5)
      expect(props.totalNumberOfRecords).toBe(100)
    })

    it('should initialize with partial arguments', () => {
      const props = new ServerSideProps('email', false, 50)
      expect(props.orderBy).toBe('email')
      expect(props.isClustered).toBe(false)
      expect(props.pageSize).toBe(50)
      expect(props.pageNumber).toBe(1)
      expect(props.totalNumberOfPages).toBe(0)
      expect(props.totalNumberOfRecords).toBe(0)
    })
  })

  describe('getTotalNumberOfRecords', () => {
    it('should return total number of records', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 150)
      expect(props.getTotalNumberOfRecords()).toBe(150)
    })

    it('should return zero when no records', () => {
      const props = new ServerSideProps('', false, 10, 1, 0, 0)
      expect(props.getTotalNumberOfRecords()).toBe(0)
    })

    it('should return correct value for large numbers', () => {
      const props = new ServerSideProps('', false, 10, 1, 10000, 999999)
      expect(props.getTotalNumberOfRecords()).toBe(999999)
    })
  })

  describe('getTotalNumberOfPages', () => {
    it('should return total number of pages', () => {
      const props = new ServerSideProps('', false, 10, 1, 15, 150)
      expect(props.getTotalNumberOfPages()).toBe(15)
    })

    it('should return zero when no pages', () => {
      const props = new ServerSideProps('', false, 10, 1, 0, 0)
      expect(props.getTotalNumberOfPages()).toBe(0)
    })

    it('should return one for single page', () => {
      const props = new ServerSideProps('', false, 50, 1, 1, 25)
      expect(props.getTotalNumberOfPages()).toBe(1)
    })

    it('should return correct value for large page counts', () => {
      const props = new ServerSideProps('', false, 10, 1, 5000, 50000)
      expect(props.getTotalNumberOfPages()).toBe(5000)
    })
  })

  describe('getPageSize', () => {
    it('should return page size', () => {
      const props = new ServerSideProps('', false, 25)
      expect(props.getPageSize()).toBe(25)
    })

    it('should return default page size when initialized with default', () => {
      const props = new ServerSideProps()
      expect(props.getPageSize()).toBe(10)
    })

    it('should return various page sizes', () => {
      expect(new ServerSideProps('', false, 5).getPageSize()).toBe(5)
      expect(new ServerSideProps('', false, 50).getPageSize()).toBe(50)
      expect(new ServerSideProps('', false, 100).getPageSize()).toBe(100)
    })
  })

  describe('getPageNumber', () => {
    it('should return page number', () => {
      const props = new ServerSideProps('', false, 10, 5)
      expect(props.getPageNumber()).toBe(5)
    })

    it('should return default page number when initialized with default', () => {
      const props = new ServerSideProps()
      expect(props.getPageNumber()).toBe(1)
    })

    it('should return various page numbers', () => {
      expect(new ServerSideProps('', false, 10, 1).getPageNumber()).toBe(1)
      expect(new ServerSideProps('', false, 10, 10).getPageNumber()).toBe(10)
      expect(new ServerSideProps('', false, 10, 100).getPageNumber()).toBe(100)
    })

    it('should handle page number of zero', () => {
      const props = new ServerSideProps('', false, 10, 0)
      expect(props.getPageNumber()).toBe(0)
    })

    it('should handle negative page numbers', () => {
      const props = new ServerSideProps('', false, 10, -5)
      expect(props.getPageNumber()).toBe(-5)
    })
  })

  describe('property access', () => {
    it('should allow direct access to orderBy property', () => {
      const props = new ServerSideProps()
      props.orderBy = 'status'
      expect(props.orderBy).toBe('status')
    })

    it('should allow direct access to isClustered property', () => {
      const props = new ServerSideProps()
      props.isClustered = true
      expect(props.isClustered).toBe(true)
    })

    it('should allow direct access to pageSize property', () => {
      const props = new ServerSideProps()
      props.pageSize = 50
      expect(props.pageSize).toBe(50)
    })

    it('should allow direct access to pageNumber property', () => {
      const props = new ServerSideProps()
      props.pageNumber = 7
      expect(props.pageNumber).toBe(7)
    })

    it('should allow direct access to totalNumberOfPages property', () => {
      const props = new ServerSideProps()
      props.totalNumberOfPages = 20
      expect(props.totalNumberOfPages).toBe(20)
    })

    it('should allow direct access to totalNumberOfRecords property', () => {
      const props = new ServerSideProps()
      props.totalNumberOfRecords = 500
      expect(props.totalNumberOfRecords).toBe(500)
    })
  })

  describe('integration scenarios', () => {
    it('should handle pagination workflow', () => {
      const props = new ServerSideProps('name', false, 10, 1, 5, 50)
      expect(props.getPageSize()).toBe(10)
      expect(props.getPageNumber()).toBe(1)
      expect(props.getTotalNumberOfPages()).toBe(5)
      expect(props.getTotalNumberOfRecords()).toBe(50)
    })

    it('should support paginating through results', () => {
      const props = new ServerSideProps('created_date', true, 25, 1, 4, 100)

      // First page
      expect(props.getPageNumber()).toBe(1)
      expect(props.getPageSize()).toBe(25)

      // Move to next page
      props.pageNumber = 2
      expect(props.getPageNumber()).toBe(2)

      // Move to last page
      props.pageNumber = 4
      expect(props.getPageNumber()).toBe(4)
    })

    it('should update sort order while maintaining pagination', () => {
      const props = new ServerSideProps('name', false, 10, 1, 3, 30)
      expect(props.orderBy).toBe('name')

      props.orderBy = 'email'
      expect(props.orderBy).toBe('email')
      expect(props.getPageNumber()).toBe(1)
      expect(props.getPageSize()).toBe(10)
    })

    it('should track pagination state across updates', () => {
      const props = new ServerSideProps('id', false, 20, 3, 10, 200)

      // Verify initial state
      expect(props.getPageNumber()).toBe(3)
      expect(props.getTotalNumberOfPages()).toBe(10)
      expect(props.getTotalNumberOfRecords()).toBe(200)

      // Update records and pages
      props.totalNumberOfRecords = 300
      props.totalNumberOfPages = 15

      expect(props.getTotalNumberOfRecords()).toBe(300)
      expect(props.getTotalNumberOfPages()).toBe(15)
      expect(props.getPageNumber()).toBe(3) // Page number unchanged
    })
  })

  describe('edge cases', () => {
    it('should handle string values for numeric properties', () => {
      const props = new ServerSideProps('id', 'false', '25', '2', '5', '100')
      // Note: Constructor doesn't validate types, so values will be as passed
      expect(props.pageSize).toBe('25')
      expect(props.pageNumber).toBe('2')
    })

    it('should handle null values', () => {
      const props = new ServerSideProps(null, null, null, null, null, null)
      expect(props.orderBy).toBeNull()
      expect(props.isClustered).toBeNull()
      expect(props.getPageSize()).toBeNull()
    })

    it('should handle very large numbers', () => {
      const props = new ServerSideProps('', false, 1000000, 999999, 100000, 1000000000)
      expect(props.getPageSize()).toBe(1000000)
      expect(props.getPageNumber()).toBe(999999)
      expect(props.getTotalNumberOfPages()).toBe(100000)
      expect(props.getTotalNumberOfRecords()).toBe(1000000000)
    })

    it('should handle empty orderBy string', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      expect(props.orderBy).toBe('')
    })

    it('should handle multiple instances independently', () => {
      const props1 = new ServerSideProps('name', false, 10, 1, 5, 50)
      const props2 = new ServerSideProps('email', true, 25, 2, 10, 100)

      expect(props1.orderBy).toBe('name')
      expect(props2.orderBy).toBe('email')
      expect(props1.isClustered).toBe(false)
      expect(props2.isClustered).toBe(true)
    })
  })
})
