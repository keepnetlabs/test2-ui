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

  describe('Class Structure & Properties', () => {
    it('should be a class/constructor function', () => {
      expect(typeof ServerSideProps).toBe('function')
    })

    it('should create instances with new keyword', () => {
      const props = new ServerSideProps()
      expect(props).toBeInstanceOf(ServerSideProps)
    })

    it('should have all expected properties', () => {
      const props = new ServerSideProps()
      expect(props).toHaveProperty('orderBy')
      expect(props).toHaveProperty('isClustered')
      expect(props).toHaveProperty('pageSize')
      expect(props).toHaveProperty('pageNumber')
      expect(props).toHaveProperty('totalNumberOfPages')
      expect(props).toHaveProperty('totalNumberOfRecords')
    })

    it('should have all expected methods', () => {
      const props = new ServerSideProps()
      expect(typeof props.getPageSize).toBe('function')
      expect(typeof props.getPageNumber).toBe('function')
      expect(typeof props.getTotalNumberOfPages).toBe('function')
      expect(typeof props.getTotalNumberOfRecords).toBe('function')
    })

    it('methods should be accessible on instance', () => {
      const props = new ServerSideProps('', false, 25, 3, 10, 100)
      expect(props.getPageSize()).toBe(25)
      expect(props.getPageNumber()).toBe(3)
    })
  })

  describe('Constructor Validation', () => {
    it('should accept all parameters', () => {
      const props = new ServerSideProps('status', true, 50, 5, 20, 1000)
      expect(props.orderBy).toBe('status')
      expect(props.isClustered).toBe(true)
      expect(props.pageSize).toBe(50)
      expect(props.pageNumber).toBe(5)
      expect(props.totalNumberOfPages).toBe(20)
      expect(props.totalNumberOfRecords).toBe(1000)
    })

    it('should work with no parameters', () => {
      const props = new ServerSideProps()
      expect(props).toBeDefined()
      expect(props.orderBy).toBe('')
      expect(props.pageSize).toBe(10)
    })

    it('should work with mixed parameter counts', () => {
      expect(() => new ServerSideProps('col')).not.toThrow()
      expect(() => new ServerSideProps('col', true)).not.toThrow()
      expect(() => new ServerSideProps('col', true, 20)).not.toThrow()
    })

    it('should preserve parameter order', () => {
      const props = new ServerSideProps('id', false, 30, 2, 5, 150)
      expect(props.orderBy).toBe('id')
      expect(props.isClustered).toBe(false)
      expect(props.pageSize).toBe(30)
      expect(props.pageNumber).toBe(2)
    })
  })

  describe('Getter Methods Consistency', () => {
    it('getter results should match property values', () => {
      const props = new ServerSideProps('name', false, 15, 4, 8, 120)
      expect(props.getPageSize()).toBe(props.pageSize)
      expect(props.getPageNumber()).toBe(props.pageNumber)
      expect(props.getTotalNumberOfPages()).toBe(props.totalNumberOfPages)
      expect(props.getTotalNumberOfRecords()).toBe(props.totalNumberOfRecords)
    })

    it('getters should return consistent values across multiple calls', () => {
      const props = new ServerSideProps('email', true, 20, 3, 7, 140)
      const size1 = props.getPageSize()
      const size2 = props.getPageSize()
      expect(size1).toBe(size2)

      const number1 = props.getPageNumber()
      const number2 = props.getPageNumber()
      expect(number1).toBe(number2)
    })

    it('all getters should work without errors', () => {
      const props = new ServerSideProps('status', false, 25, 5, 10, 250)
      expect(() => {
        props.getPageSize()
        props.getPageNumber()
        props.getTotalNumberOfPages()
        props.getTotalNumberOfRecords()
      }).not.toThrow()
    })
  })

  describe('State Mutations', () => {
    it('should allow changing orderBy', () => {
      const props = new ServerSideProps('initial', false, 10, 1, 5, 50)
      props.orderBy = 'updated'
      expect(props.orderBy).toBe('updated')
    })

    it('should allow changing isClustered', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      props.isClustered = true
      expect(props.isClustered).toBe(true)
      props.isClustered = false
      expect(props.isClustered).toBe(false)
    })

    it('should allow changing pageSize', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      props.pageSize = 100
      expect(props.getPageSize()).toBe(100)
    })

    it('should allow changing pageNumber', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      props.pageNumber = 3
      expect(props.getPageNumber()).toBe(3)
    })

    it('should allow multiple mutations in sequence', () => {
      const props = new ServerSideProps('initial', false, 10, 1, 5, 50)
      props.orderBy = 'updated1'
      expect(props.orderBy).toBe('updated1')
      props.orderBy = 'updated2'
      expect(props.orderBy).toBe('updated2')
      props.pageSize = 25
      expect(props.getPageSize()).toBe(25)
    })
  })

  describe('Pagination Calculations', () => {
    it('should calculate pages correctly with even records', () => {
      const props = new ServerSideProps('', false, 10, 1, 10, 100)
      expect(props.getTotalNumberOfRecords()).toBe(100)
      expect(props.getTotalNumberOfPages()).toBe(10)
    })

    it('should handle odd number of records', () => {
      const props = new ServerSideProps('', false, 10, 1, 11, 105)
      expect(props.getTotalNumberOfRecords()).toBe(105)
      expect(props.getTotalNumberOfPages()).toBe(11)
    })

    it('should track pagination across multiple pages', () => {
      const props = new ServerSideProps('', false, 20, 1, 5, 100)

      for (let page = 1; page <= 5; page++) {
        props.pageNumber = page
        expect(props.getPageNumber()).toBe(page)
      }
    })

    it('should maintain data integrity during pagination', () => {
      const props = new ServerSideProps('id', true, 50, 2, 4, 200)
      const initialRecords = props.getTotalNumberOfRecords()
      const initialPages = props.getTotalNumberOfPages()

      props.pageNumber = 1
      expect(props.getTotalNumberOfRecords()).toBe(initialRecords)
      expect(props.getTotalNumberOfPages()).toBe(initialPages)
    })
  })

  describe('Performance Characteristics', () => {
    it('should instantiate quickly', () => {
      const start = Date.now()
      for (let i = 0; i < 1000; i++) {
        new ServerSideProps('name', false, 10, 1, 5, 50)
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })

    it('getters should execute quickly', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      const start = Date.now()

      for (let i = 0; i < 10000; i++) {
        props.getPageSize()
        props.getPageNumber()
        props.getTotalNumberOfPages()
        props.getTotalNumberOfRecords()
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('property mutations should be fast', () => {
      const props = new ServerSideProps('', false, 10, 1, 5, 50)
      const start = Date.now()

      for (let i = 0; i < 1000; i++) {
        props.pageNumber = i
        props.pageSize = i % 100
        props.orderBy = `col${i}`
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })

  describe('Type Flexibility', () => {
    it('should accept boolean for isClustered', () => {
      const props1 = new ServerSideProps('', true, 10, 1, 5, 50)
      const props2 = new ServerSideProps('', false, 10, 1, 5, 50)
      expect(props1.isClustered).toBe(true)
      expect(props2.isClustered).toBe(false)
    })

    it('should accept various numeric types for pageSize', () => {
      const props1 = new ServerSideProps('', false, 10, 1, 5, 50)
      const props2 = new ServerSideProps('', false, 25.5, 1, 5, 50)
      expect(props1.pageSize).toBe(10)
      expect(props2.pageSize).toBe(25.5)
    })

    it('should accept string for orderBy', () => {
      const props1 = new ServerSideProps('columnName', false, 10, 1, 5, 50)
      const props2 = new ServerSideProps('another_column', false, 10, 1, 5, 50)
      expect(props1.orderBy).toBe('columnName')
      expect(props2.orderBy).toBe('another_column')
    })

    it('should handle unicode in orderBy', () => {
      const props = new ServerSideProps('Ñombre_日本語', false, 10, 1, 5, 50)
      expect(props.orderBy).toBe('Ñombre_日本語')
    })
  })

  describe('Multiple Instance Isolation', () => {
    it('instances should have independent state', () => {
      const props1 = new ServerSideProps('name', false, 10, 1, 5, 50)
      const props2 = new ServerSideProps('email', true, 25, 3, 10, 100)

      props1.pageNumber = 5
      expect(props2.getPageNumber()).toBe(3)
    })

    it('modifying one instance should not affect others', () => {
      const instances = [
        new ServerSideProps('col1', false, 10, 1, 5, 50),
        new ServerSideProps('col2', false, 20, 2, 10, 100),
        new ServerSideProps('col3', false, 30, 3, 15, 150)
      ]

      instances[0].pageNumber = 99
      expect(instances[1].getPageNumber()).toBe(2)
      expect(instances[2].getPageNumber()).toBe(3)
    })

    it('can create and manage many instances', () => {
      const instances = []
      for (let i = 0; i < 100; i++) {
        instances.push(new ServerSideProps(`col${i}`, i % 2 === 0, 10 + i, 1, 5, 50))
      }

      instances.forEach((inst, i) => {
        expect(inst.pageSize).toBe(10 + i)
        expect(inst.orderBy).toBe(`col${i}`)
      })
    })
  })
})
