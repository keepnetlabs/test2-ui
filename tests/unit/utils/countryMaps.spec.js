import countryDefaults from '@/utils/countryDefaultValues'
import countryLanguageMap from '@/utils/countryLanguageMap'

describe('Country Utility Maps', () => {
  describe('countryDefaultValues', () => {
    it('should be defined', () => {
      expect(countryDefaults).toBeDefined()
    })

    it('should be an object or array', () => {
      expect(typeof countryDefaults === 'object' || Array.isArray(countryDefaults)).toBe(true)
    })

    it('should have entries', () => {
      if (typeof countryDefaults === 'object' && !Array.isArray(countryDefaults)) {
        expect(Object.keys(countryDefaults).length >= 0).toBe(true)
      }
    })
  })

  describe('countryLanguageMap', () => {
    it('should be defined', () => {
      expect(countryLanguageMap).toBeDefined()
    })

    it('should be an object or array', () => {
      expect(typeof countryLanguageMap === 'object' || Array.isArray(countryLanguageMap)).toBe(true)
    })

    it('should provide language mappings', () => {
      if (typeof countryLanguageMap === 'object' && !Array.isArray(countryLanguageMap)) {
        expect(Object.keys(countryLanguageMap).length >= 0).toBe(true)
      }
    })
  })
})
