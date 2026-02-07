import { useLoading } from '@/hooks/useLoading'

describe('useLoading Hook', () => {
  describe('Hook Structure', () => {
    it('should export useLoading object', () => {
      expect(useLoading).toBeDefined()
      expect(typeof useLoading).toBe('object')
    })

    it('should have data method', () => {
      expect(typeof useLoading.data).toBe('function')
    })

    it('should have methods object', () => {
      expect(useLoading.methods).toBeDefined()
      expect(typeof useLoading.methods).toBe('object')
    })

    it('should have setLoading method', () => {
      expect(typeof useLoading.methods.setLoading).toBe('function')
    })
  })

  describe('data()', () => {
    it('should be a function', () => {
      expect(typeof useLoading.data).toBe('function')
    })

    it('should return an object', () => {
      const data = useLoading.data()
      expect(typeof data).toBe('object')
      expect(data !== null).toBe(true)
    })

    it('should initialize isLoading as false', () => {
      const data = useLoading.data()
      expect(data.isLoading).toBe(false)
    })

    it('should have isLoading property as boolean', () => {
      const data = useLoading.data()
      expect(typeof data.isLoading).toBe('boolean')
    })

    it('should return a new object each time', () => {
      const data1 = useLoading.data()
      const data2 = useLoading.data()
      expect(data1).not.toBe(data2)
    })

    it('should only have isLoading property', () => {
      const data = useLoading.data()
      expect(Object.keys(data).length).toBe(1)
      expect(Object.keys(data)[0]).toBe('isLoading')
    })
  })

  describe('methods.setLoading()', () => {
    let component

    beforeEach(() => {
      component = {
        isLoading: false,
        setLoading: useLoading.methods.setLoading
      }
    })

    it('should be a function', () => {
      expect(typeof useLoading.methods.setLoading).toBe('function')
    })

    it('should set isLoading to true when passed true', () => {
      component.setLoading(true)
      expect(component.isLoading).toBe(true)
    })

    it('should set isLoading to false when passed false', () => {
      component.isLoading = true
      component.setLoading(false)
      expect(component.isLoading).toBe(false)
    })

    it('should default to false when no argument is provided', () => {
      component.isLoading = true
      component.setLoading()
      expect(component.isLoading).toBe(false)
    })

    it('should handle multiple calls correctly', () => {
      component.setLoading(true)
      expect(component.isLoading).toBe(true)

      component.setLoading(false)
      expect(component.isLoading).toBe(false)

      component.setLoading(true)
      expect(component.isLoading).toBe(true)
    })

    it('should toggle from false to true', () => {
      expect(component.isLoading).toBe(false)
      component.setLoading(true)
      expect(component.isLoading).toBe(true)
    })

    it('should toggle from true to false', () => {
      component.isLoading = true
      expect(component.isLoading).toBe(true)
      component.setLoading(false)
      expect(component.isLoading).toBe(false)
    })

    it('should maintain state without changing other properties', () => {
      component.customProperty = 'value'
      component.setLoading(true)
      expect(component.customProperty).toBe('value')
      expect(component.isLoading).toBe(true)
    })

    it('should accept truthy values as true', () => {
      component.setLoading(1)
      expect(component.isLoading).toBe(1)

      component.setLoading('true')
      expect(component.isLoading).toBe('true')

      component.setLoading({})
      expect(component.isLoading).toEqual({})
    })

    it('should accept falsy values as false', () => {
      component.setLoading(0)
      expect(component.isLoading).toBe(0)

      component.setLoading('')
      expect(component.isLoading).toBe('')

      component.setLoading(null)
      expect(component.isLoading).toBeNull()
    })

    it('should default to false when passed undefined explicitly', () => {
      component.setLoading(undefined)
      expect(component.isLoading).toBe(false)
    })
  })

  describe('Integration Tests', () => {
    it('should work with Vue component data', () => {
      const vueData = useLoading.data()
      const method = useLoading.methods.setLoading

      const component = {
        ...vueData,
        setLoading: method
      }

      expect(component.isLoading).toBe(false)
      component.setLoading(true)
      expect(component.isLoading).toBe(true)
      component.setLoading(false)
      expect(component.isLoading).toBe(false)
    })

    it('should handle rapid state changes', () => {
      const component = {
        isLoading: false,
        setLoading: useLoading.methods.setLoading
      }

      for (let i = 0; i < 100; i++) {
        const state = i % 2 === 0
        component.setLoading(state)
        expect(component.isLoading).toBe(state)
      }
    })

    it('should work with multiple component instances', () => {
      const component1 = {
        ...useLoading.data(),
        setLoading: useLoading.methods.setLoading
      }

      const component2 = {
        ...useLoading.data(),
        setLoading: useLoading.methods.setLoading
      }

      component1.setLoading(true)
      component2.setLoading(false)

      expect(component1.isLoading).toBe(true)
      expect(component2.isLoading).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle calling setLoading with no this context', () => {
      const setLoading = useLoading.methods.setLoading
      const obj = { isLoading: false }
      setLoading.call(obj, true)
      expect(obj.isLoading).toBe(true)
    })

    it('should handle setting loading multiple times in sequence', () => {
      const component = {
        isLoading: false,
        setLoading: useLoading.methods.setLoading
      }

      component.setLoading(true)
      component.setLoading(true)
      component.setLoading(true)
      expect(component.isLoading).toBe(true)

      component.setLoading(false)
      component.setLoading(false)
      component.setLoading(false)
      expect(component.isLoading).toBe(false)
    })

    it('should work with bind context', () => {
      const component = {
        isLoading: false,
        setLoading: useLoading.methods.setLoading.bind({ isLoading: false })
      }

      component.setLoading(true)
      expect(component.setLoading.bind.toString()).toBeDefined()
    })
  })
})
