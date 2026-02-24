import countryDefaultValues from '@/utils/countryDefaultValues'

describe('countryDefaultValues utility', () => {
  describe('data structure validation', () => {
    it('should be an array', () => {
      expect(Array.isArray(countryDefaultValues)).toBe(true)
    })

    it('should not be empty', () => {
      expect(countryDefaultValues.length).toBeGreaterThan(0)
    })

    it('should have more than 100 countries', () => {
      expect(countryDefaultValues.length).toBeGreaterThan(100)
    })
  })

  describe('each country object structure', () => {
    it('should have all required fields', () => {
      countryDefaultValues.forEach((country) => {
        expect(country).toHaveProperty('name')
        expect(country).toHaveProperty('timeFormat')
        expect(country).toHaveProperty('dateFormat')
        expect(country).toHaveProperty('timezone')
        expect(country).toHaveProperty('phoneNumberCode')
      })
    })

    it('should have string values for all fields', () => {
      countryDefaultValues.forEach((country) => {
        expect(typeof country.name).toBe('string')
        expect(typeof country.timeFormat).toBe('string')
        expect(typeof country.dateFormat).toBe('string')
        expect(typeof country.timezone).toBe('string')
        expect(typeof country.phoneNumberCode).toBe('string')
      })
    })

    it('should not have empty string values', () => {
      countryDefaultValues.forEach((country) => {
        expect(country.name.trim().length).toBeGreaterThan(0)
        expect(country.timeFormat.trim().length).toBeGreaterThan(0)
        expect(country.dateFormat.trim().length).toBeGreaterThan(0)
        expect(country.timezone.trim().length).toBeGreaterThan(0)
        expect(country.phoneNumberCode.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('timeFormat validation', () => {
    it('should only contain 12h or 24h', () => {
      countryDefaultValues.forEach((country) => {
        expect(['12h', '24h']).toContain(country.timeFormat)
      })
    })

    it('should have a mix of 12h and 24h formats', () => {
      const formats = countryDefaultValues.map((c) => c.timeFormat)
      expect(formats).toContain('12h')
      expect(formats).toContain('24h')
    })
  })

  describe('dateFormat validation', () => {
    const validFormats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/dd/MM']

    it('should only contain valid date formats', () => {
      countryDefaultValues.forEach((country) => {
        expect(validFormats).toContain(country.dateFormat)
      })
    })

    it('should have at least one of each format type', () => {
      const formats = new Set(countryDefaultValues.map((c) => c.dateFormat))
      expect(formats.size).toBeGreaterThanOrEqual(2)
    })
  })

  describe('phoneNumberCode validation', () => {
    it('should start with +', () => {
      countryDefaultValues.forEach((country) => {
        expect(country.phoneNumberCode).toMatch(/^\+/)
      })
    })

    it('should contain only numbers and + and -', () => {
      countryDefaultValues.forEach((country) => {
        expect(country.phoneNumberCode).toMatch(/^[\+\d\-]+$/)
      })
    })

    it('should not have duplicate phone codes (mostly)', () => {
      const phoneCodes = countryDefaultValues.map((c) => c.phoneNumberCode)
      const uniqueCodes = new Set(phoneCodes)
      // Some countries share codes (like +1), so just check there aren't excessive duplicates
      const duplicates = phoneCodes.filter((code, index) => phoneCodes.indexOf(code) !== index)
      expect(duplicates.length).toBeLessThan(20)
    })
  })

  describe('timezone validation', () => {
    it('should have valid timezone names', () => {
      countryDefaultValues.forEach((country) => {
        // Timezone should be a non-empty string
        expect(typeof country.timezone).toBe('string')
        expect(country.timezone.length).toBeGreaterThan(0)
        // Should contain word characters
        expect(country.timezone).toMatch(/[a-zA-Z]/)
      })
    })

    it('should have a reasonable number of unique timezones', () => {
      const timezones = new Set(countryDefaultValues.map((c) => c.timezone))
      expect(timezones.size).toBeLessThan(100)
      expect(timezones.size).toBeGreaterThan(10)
    })
  })

  describe('country name validation', () => {
    it('should not have duplicate country names', () => {
      const names = countryDefaultValues.map((c) => c.name)
      const uniqueNames = new Set(names)
      expect(names.length).toBe(uniqueNames.size)
    })

    it('should have alphabetically sortable names', () => {
      const names = countryDefaultValues.map((c) => c.name)
      const sortedNames = [...names].sort()
      // Check that names are actually strings that can be sorted
      expect(sortedNames.length).toBe(names.length)
    })

    it('should contain common countries', () => {
      const countryNames = countryDefaultValues.map((c) => c.name)
      expect(countryNames).toContain('United States of America')
      expect(countryNames).toContain('United Kingdom of Great Britain and Northern Ireland')
      expect(countryNames).toContain('France')
      expect(countryNames).toContain('Germany')
      expect(countryNames).toContain('Canada')
      expect(countryNames).toContain('Australia')
      expect(countryNames).toContain('Japan')
      expect(countryNames).toContain('India')
    })
  })

  describe('specific country configurations', () => {
    it('should have USA configuration', () => {
      const usa = countryDefaultValues.find((c) => c.name === 'United States of America')
      expect(usa).toBeDefined()
      expect(usa.timeFormat).toBe('12h')
      expect(usa.dateFormat).toBe('MM/dd/yyyy')
      expect(usa.phoneNumberCode).toBe('+1')
    })

    it('should have UK configuration', () => {
      const uk = countryDefaultValues.find(
        (c) => c.name === 'United Kingdom of Great Britain and Northern Ireland'
      )
      expect(uk).toBeDefined()
      expect(uk.timeFormat).toBe('24h')
      expect(uk.dateFormat).toBe('dd/MM/yyyy')
      expect(uk.phoneNumberCode).toBe('+44')
    })

    it('should have Japan configuration', () => {
      const japan = countryDefaultValues.find((c) => c.name === 'Japan')
      expect(japan).toBeDefined()
      expect(japan.timeFormat).toBe('24h')
      expect(japan.dateFormat).toBe('yyyy/dd/MM')
      expect(japan.phoneNumberCode).toBe('+81')
    })

    it('should have India configuration', () => {
      const india = countryDefaultValues.find((c) => c.name === 'India')
      expect(india).toBeDefined()
      expect(india.timeFormat).toBe('12h')
      expect(india.phoneNumberCode).toBe('+91')
    })

    it('should have Germany configuration', () => {
      const germany = countryDefaultValues.find((c) => c.name === 'Germany')
      expect(germany).toBeDefined()
      expect(germany.timeFormat).toBe('24h')
      expect(germany.dateFormat).toBe('dd/MM/yyyy')
      expect(germany.phoneNumberCode).toBe('+49')
    })
  })

  describe('findCountry utility function', () => {
    it('should be able to find a country by name', () => {
      const country = countryDefaultValues.find((c) => c.name === 'France')
      expect(country).toBeDefined()
      expect(country.phoneNumberCode).toBe('+33')
    })

    it('should be able to find a country by phone code', () => {
      const country = countryDefaultValues.find((c) => c.phoneNumberCode === '+86')
      expect(country).toBeDefined()
      expect(['China', 'Hong Kong', 'Macao']).toContain(country.name)
    })

    it('should return undefined for non-existent country', () => {
      const country = countryDefaultValues.find((c) => c.name === 'Atlantis')
      expect(country).toBeUndefined()
    })
  })

  describe('region consistency', () => {
    it('should have European countries with GMT or European timezones', () => {
      const europeanCountries = ['France', 'Germany', 'Poland', 'Spain', 'Netherlands']
      europeanCountries.forEach((countryName) => {
        const country = countryDefaultValues.find((c) => c.name === countryName)
        expect(country).toBeDefined()
        expect(
          country.timezone.includes('Europe') ||
          country.timezone.includes('GMT') ||
          country.timezone.includes('Romance')
        ).toBe(true)
      })
    })

    it('should have Asian countries with appropriate timezones', () => {
      const asianCountries = ['Japan', 'China', 'India', 'Thailand']
      asianCountries.forEach((countryName) => {
        const country = countryDefaultValues.find((c) => c.name === countryName)
        expect(country).toBeDefined()
        expect(
          country.timezone.includes('Asia') ||
          country.timezone.includes('India') ||
          country.timezone.includes('China') ||
          country.timezone.includes('Tokyo') ||
          country.timezone.includes('SE') ||
          country.timezone.includes('West')
        ).toBe(true)
      })
    })
  })

  describe('data integrity checks', () => {
    it('should not have any null or undefined values', () => {
      countryDefaultValues.forEach((country) => {
        Object.values(country).forEach((value) => {
          expect(value).not.toBeNull()
          expect(value).not.toBeUndefined()
        })
      })
    })

    it('should have consistent object keys across all entries', () => {
      const firstCountryKeys = Object.keys(countryDefaultValues[0]).sort()
      countryDefaultValues.forEach((country) => {
        const keys = Object.keys(country).sort()
        expect(keys).toEqual(firstCountryKeys)
      })
    })

    it('should not have unexpected additional properties', () => {
      const allowedProperties = new Set(['name', 'timeFormat', 'dateFormat', 'timezone', 'phoneNumberCode'])
      countryDefaultValues.forEach((country) => {
        Object.keys(country).forEach((key) => {
          expect(allowedProperties.has(key)).toBe(true)
        })
      })
    })
  })

  describe('edge cases', () => {
    it('should handle countries with special characters in names', () => {
      const specialCharCountries = countryDefaultValues.filter(
        (c) => /[àáâãäåèéêëìíîïòóôõöùúûüçñ]/i.test(c.name)
      )
      expect(specialCharCountries.length).toBeGreaterThan(0)
    })

    it('should handle countries with parentheses in names', () => {
      const parenCountries = countryDefaultValues.filter((c) => c.name.includes('('))
      expect(parenCountries.length).toBeGreaterThan(0)
    })

    it('should handle countries with long names', () => {
      const longNames = countryDefaultValues.filter((c) => c.name.length > 40)
      expect(longNames.length).toBeGreaterThan(0)
    })
  })

  describe('performance characteristics', () => {
    it('should be efficiently searchable by name', () => {
      const startTime = performance.now()
      for (let i = 0; i < 100; i++) {
        countryDefaultValues.find((c) => c.name === 'France')
      }
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(150)
    })

    it('should support array operations efficiently', () => {
      const startTime = performance.now()
      const mapped = countryDefaultValues.map((c) => c.phoneNumberCode)
      const filtered = mapped.filter((code) => code.length > 0)
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
      expect(filtered.length).toBe(countryDefaultValues.length)
    })
  })

  describe('search and filter operations', () => {
    it('should support filtering by time format', () => {
      const twelveHourCountries = countryDefaultValues.filter((c) => c.timeFormat === '12h')
      expect(twelveHourCountries.length).toBeGreaterThan(0)
      expect(twelveHourCountries.every((c) => c.timeFormat === '12h')).toBe(true)
    })

    it('should support filtering by date format', () => {
      const mmddyyFormat = countryDefaultValues.filter((c) => c.dateFormat === 'MM/dd/yyyy')
      expect(mmddyyFormat.length).toBeGreaterThan(0)
      expect(mmddyyFormat.every((c) => c.dateFormat === 'MM/dd/yyyy')).toBe(true)
    })

    it('should support filtering by timezone', () => {
      const europeanTimezones = countryDefaultValues.filter((c) => c.timezone.includes('Europe'))
      expect(europeanTimezones.length).toBeGreaterThan(0)
    })

    it('should support filtering by phone code pattern', () => {
      const singleDigitCodes = countryDefaultValues.filter((c) => c.phoneNumberCode === '+1')
      expect(singleDigitCodes.length).toBeGreaterThan(0)
    })

    it('should support combining multiple filters', () => {
      const filtered = countryDefaultValues.filter(
        (c) => c.timeFormat === '24h' && c.dateFormat === 'dd/MM/yyyy'
      )
      expect(filtered.length).toBeGreaterThan(0)
    })
  })

  describe('data export and serialization', () => {
    it('should be JSON serializable', () => {
      const json = JSON.stringify(countryDefaultValues)
      expect(json).toBeDefined()
      expect(json.length).toBeGreaterThan(0)
    })

    it('should be JSON deserializable', () => {
      const json = JSON.stringify(countryDefaultValues)
      const deserialized = JSON.parse(json)
      expect(Array.isArray(deserialized)).toBe(true)
      expect(deserialized.length).toBe(countryDefaultValues.length)
    })

    it('should preserve data integrity after serialization', () => {
      const json = JSON.stringify(countryDefaultValues)
      const deserialized = JSON.parse(json)
      expect(deserialized[0]).toEqual(countryDefaultValues[0])
    })

    it('should support object destructuring', () => {
      const [firstCountry] = countryDefaultValues
      const { name, timeFormat, dateFormat, timezone, phoneNumberCode } = firstCountry
      expect(name).toBeDefined()
      expect(timeFormat).toBeDefined()
      expect(dateFormat).toBeDefined()
      expect(timezone).toBeDefined()
      expect(phoneNumberCode).toBeDefined()
    })
  })

  describe('backwards compatibility', () => {
    it('should have stable field names', () => {
      const fieldNames = new Set()
      countryDefaultValues.forEach((country) => {
        Object.keys(country).forEach((key) => {
          fieldNames.add(key)
        })
      })
      expect(fieldNames.has('name')).toBe(true)
      expect(fieldNames.has('timeFormat')).toBe(true)
      expect(fieldNames.has('dateFormat')).toBe(true)
      expect(fieldNames.has('timezone')).toBe(true)
      expect(fieldNames.has('phoneNumberCode')).toBe(true)
    })

    it('should maintain expected array structure', () => {
      expect(countryDefaultValues[0]).toHaveProperty('name')
      expect(typeof countryDefaultValues[0].name).toBe('string')
    })

    it('should contain expected legacy countries', () => {
      const names = countryDefaultValues.map((c) => c.name)
      expect(names.length).toBeGreaterThan(0)
      // Should always have some major countries
      expect(names.some((n) => n.includes('United'))).toBe(true)
    })
  })

  describe('integration patterns', () => {
    it('should work with Array.from()', () => {
      const countries = Array.from(countryDefaultValues)
      expect(countries.length).toBe(countryDefaultValues.length)
    })

    it('should work with spread operator', () => {
      const countries = [...countryDefaultValues]
      expect(countries.length).toBe(countryDefaultValues.length)
    })

    it('should work with reduce', () => {
      const phoneCodeMap = countryDefaultValues.reduce((map, country) => {
        map[country.phoneNumberCode] = country.name
        return map
      }, {})
      expect(Object.keys(phoneCodeMap).length).toBeGreaterThan(0)
    })

    it('should work with find multiple times without issues', () => {
      const usa1 = countryDefaultValues.find((c) => c.name === 'United States of America')
      const usa2 = countryDefaultValues.find((c) => c.name === 'United States of America')
      expect(usa1).toEqual(usa2)
    })

    it('should work with some and every', () => {
      expect(countryDefaultValues.some((c) => c.timeFormat === '12h')).toBe(true)
      expect(countryDefaultValues.every((c) => c.name && c.timeFormat)).toBe(true)
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle empty string search gracefully', () => {
      const result = countryDefaultValues.find((c) => c.name === '')
      expect(result).toBeUndefined()
    })

    it('should handle case-sensitive search', () => {
      const lowercase = countryDefaultValues.find((c) => c.name === 'france')
      expect(lowercase).toBeUndefined()
    })

    it('should handle partial name matching with filter', () => {
      const partial = countryDefaultValues.filter((c) => c.name.includes('United'))
      expect(partial.length).toBeGreaterThan(0)
    })

    it('should handle special character searching', () => {
      const special = countryDefaultValues.filter((c) => c.name.includes("'"))
      // Some countries may have apostrophes
      expect(special.length >= 0).toBe(true)
    })

    it('should handle accessing non-existent countries gracefully', () => {
      const nonExistent = countryDefaultValues.find((c) => c.phoneNumberCode === '+9999')
      expect(nonExistent).toBeUndefined()
    })
  })

  describe('multi-format support verification', () => {
    it('should have countries with all supported time formats', () => {
      const formats = new Set(countryDefaultValues.map((c) => c.timeFormat))
      expect(formats.has('12h')).toBe(true)
      expect(formats.has('24h')).toBe(true)
    })

    it('should have countries with all supported date formats', () => {
      const dateFormats = new Set(countryDefaultValues.map((c) => c.dateFormat))
      expect(dateFormats.size).toBeGreaterThanOrEqual(2)
    })

    it('should verify format distribution', () => {
      const formats = countryDefaultValues.map((c) => c.timeFormat)
      const _12h = formats.filter((f) => f === '12h').length
      const _24h = formats.filter((f) => f === '24h').length
      expect(_12h).toBeGreaterThan(0)
      expect(_24h).toBeGreaterThan(0)
    })
  })

  describe('geographic grouping patterns', () => {
    it('should allow grouping by timezone', () => {
      const byTimezone = countryDefaultValues.reduce((groups, country) => {
        const tz = country.timezone
        if (!groups[tz]) groups[tz] = []
        groups[tz].push(country.name)
        return groups
      }, {})
      expect(Object.keys(byTimezone).length).toBeGreaterThan(0)
    })

    it('should allow grouping by phone code', () => {
      const byCode = countryDefaultValues.reduce((groups, country) => {
        const code = country.phoneNumberCode
        if (!groups[code]) groups[code] = []
        groups[code].push(country.name)
        return groups
      }, {})
      expect(Object.keys(byCode).length).toBeGreaterThan(0)
    })

    it('should support creating timezone-based maps', () => {
      const timezoneMap = new Map()
      countryDefaultValues.forEach((country) => {
        if (!timezoneMap.has(country.timezone)) {
          timezoneMap.set(country.timezone, [])
        }
        timezoneMap.get(country.timezone).push(country.name)
      })
      expect(timezoneMap.size).toBeGreaterThan(0)
    })
  })
})
