import { useLoading } from '@/hooks/useLoading'

describe('useLoading Hook', () => {
  describe('data()', () => {
    it('should initialize isLoading as false', () => {
      const data = useLoading.data()
      expect(data.isLoading).toBe(false)
    })
  })

  describe('methods', () => {
    describe('setLoading()', () => {
      let component

      beforeEach(() => {
        component = {
          isLoading: false,
          setLoading: useLoading.methods.setLoading
        }
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
    })
  })
})
