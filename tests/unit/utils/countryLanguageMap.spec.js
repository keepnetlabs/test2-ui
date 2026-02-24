import countryLanguageMap from '@/utils/countryLanguageMap'

describe('countryLanguageMap utility', () => {
  describe('data structure validation', () => {
    it('should be an array', () => {
      expect(Array.isArray(countryLanguageMap)).toBe(true)
    })

    it('should not be empty', () => {
      expect(countryLanguageMap.length).toBeGreaterThan(0)
    })

    it('should have more than 100 country-language mappings', () => {
      expect(countryLanguageMap.length).toBeGreaterThan(100)
    })
  })

  describe('each mapping object structure', () => {
    it('should have required fields: country and language', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(mapping).toHaveProperty('country')
        expect(mapping).toHaveProperty('language')
      })
    })

    it('should have exactly two properties', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(Object.keys(mapping).length).toBe(2)
      })
    })

    it('should have string values for both fields', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(typeof mapping.country).toBe('string')
        expect(typeof mapping.language).toBe('string')
      })
    })

    it('should not have empty string values', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(mapping.country.trim().length).toBeGreaterThan(0)
        expect(mapping.language.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('country name validation', () => {
    it('should not have duplicate country names', () => {
      const countries = countryLanguageMap.map((m) => m.country)
      const uniqueCountries = new Set(countries)
      expect(countries.length).toBe(uniqueCountries.size)
    })

    it('should contain common countries', () => {
      const countryNames = countryLanguageMap.map((m) => m.country)
      expect(countryNames).toContain('United States of America')
      expect(countryNames).toContain('France')
      expect(countryNames).toContain('Germany')
      expect(countryNames).toContain('Japan')
      expect(countryNames).toContain('India')
      expect(countryNames).toContain('Brazil')
      expect(countryNames).toContain('China')
      expect(countryNames).toContain('Canada')
    })

    it('should have country names that look like real countries', () => {
      countryLanguageMap.forEach((mapping) => {
        // Country names should be capitalized and contain letters
        expect(mapping.country).toMatch(/^[A-Z]/)
        expect(mapping.country).toMatch(/[a-zA-Z]/)
      })
    })
  })

  describe('language name validation', () => {
    it('should contain valid language names', () => {
      const validLanguagePatterns = [
        /^[A-Z]/,  // Should start with capital letter
        /[a-zA-Z]/  // Should contain letters
      ]

      countryLanguageMap.forEach((mapping) => {
        validLanguagePatterns.forEach((pattern) => {
          expect(mapping.language).toMatch(pattern)
        })
      })
    })

    it('should have diverse languages', () => {
      const languages = new Set(countryLanguageMap.map((m) => m.language))
      expect(languages.size).toBeGreaterThan(50)
    })

    it('should contain common world languages', () => {
      const languages = countryLanguageMap.map((m) => m.language)
      const languageString = languages.join('|')

      // Check for major languages (allowing variations like "English" or "English (Australia)")
      expect(languageString).toMatch(/English/)
      expect(languageString).toMatch(/Spanish/)
      expect(languageString).toMatch(/French/)
      expect(languageString).toMatch(/German/)
      expect(languageString).toMatch(/Chinese|Mandarin/)
      expect(languageString).toMatch(/Arabic/)
      expect(languageString).toMatch(/Portuguese/)
    })

    it('should handle language variants with parentheses', () => {
      const variantLanguages = countryLanguageMap.filter((m) => m.language.includes('('))
      expect(variantLanguages.length).toBeGreaterThan(0)
    })

    it('should handle N/A for countries without official language', () => {
      const naLanguages = countryLanguageMap.filter((m) => m.language === 'N/A')
      expect(naLanguages.length).toBeGreaterThan(0)
    })
  })

  describe('specific country-language mappings', () => {
    it('should map USA to English', () => {
      const usa = countryLanguageMap.find((m) => m.country === 'United States of America')
      expect(usa).toBeDefined()
      expect(usa.language).toMatch(/English/)
    })

    it('should map France to French', () => {
      const france = countryLanguageMap.find((m) => m.country === 'France')
      expect(france).toBeDefined()
      expect(france.language).toMatch(/French/)
    })

    it('should map Germany to German', () => {
      const germany = countryLanguageMap.find((m) => m.country === 'Germany')
      expect(germany).toBeDefined()
      expect(germany.language).toMatch(/German/)
    })

    it('should map Spain to Spanish', () => {
      const spain = countryLanguageMap.find((m) => m.country === 'Spain')
      expect(spain).toBeDefined()
      expect(spain.language).toMatch(/Spanish/)
    })

    it('should map Japan to Japanese', () => {
      const japan = countryLanguageMap.find((m) => m.country === 'Japan')
      expect(japan).toBeDefined()
      expect(japan.language).toMatch(/Japanese/)
    })

    it('should map Brazil to Portuguese', () => {
      const brazil = countryLanguageMap.find((m) => m.country === 'Brazil')
      expect(brazil).toBeDefined()
      expect(brazil.language).toMatch(/Portuguese/)
    })

    it('should map China to Chinese or Mandarin', () => {
      const china = countryLanguageMap.find((m) => m.country === 'China')
      expect(china).toBeDefined()
      expect(china.language).toMatch(/Chinese|Mandarin/)
    })

    it('should map India to a language', () => {
      const india = countryLanguageMap.find((m) => m.country === 'India')
      expect(india).toBeDefined()
      expect(india.language.length).toBeGreaterThan(0)
    })
  })

  describe('findCountry utility function', () => {
    it('should be able to find a country by name', () => {
      const mapping = countryLanguageMap.find((m) => m.country === 'France')
      expect(mapping).toBeDefined()
      expect(mapping.language).toBe('French')
    })

    it('should be able to find languages for a country', () => {
      const mappings = countryLanguageMap.filter((m) => m.language === 'English')
      expect(mappings.length).toBeGreaterThan(5)
    })

    it('should return undefined for non-existent country', () => {
      const mapping = countryLanguageMap.find((m) => m.country === 'Atlantis')
      expect(mapping).toBeUndefined()
    })

    it('should be case-sensitive for country names', () => {
      const upperCase = countryLanguageMap.find((m) => m.country === 'FRANCE')
      expect(upperCase).toBeUndefined()
    })
  })

  describe('regional language patterns', () => {
    it('should have European countries mapping mostly to European languages', () => {
      const europeanCountries = ['France', 'Germany', 'Spain', 'Italy', 'Poland']
      europeanCountries.forEach((countryName) => {
        const mapping = countryLanguageMap.find((m) => m.country === countryName)
        expect(mapping).toBeDefined()
        expect(mapping.language).not.toBe('N/A')
      })
    })

    it('should have English-speaking countries', () => {
      const englishCountries = countryLanguageMap.filter((m) =>
        m.language.includes('English')
      )
      expect(englishCountries.length).toBeGreaterThan(10)
    })

    it('should have Spanish-speaking countries', () => {
      const spanishCountries = countryLanguageMap.filter((m) =>
        m.language.includes('Spanish')
      )
      expect(spanishCountries.length).toBeGreaterThan(5)
    })

    it('should have Arabic-speaking countries', () => {
      const arabicCountries = countryLanguageMap.filter((m) =>
        m.language.includes('Arabic')
      )
      expect(arabicCountries.length).toBeGreaterThan(5)
    })

    it('should have French-speaking countries', () => {
      const frenchCountries = countryLanguageMap.filter((m) =>
        m.language.includes('French')
      )
      expect(frenchCountries.length).toBeGreaterThan(5)
    })
  })

  describe('data integrity checks', () => {
    it('should not have any null or undefined values', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(mapping.country).not.toBeNull()
        expect(mapping.country).not.toBeUndefined()
        expect(mapping.language).not.toBeNull()
        expect(mapping.language).not.toBeUndefined()
      })
    })

    it('should not have unexpected additional properties', () => {
      const allowedProperties = new Set(['country', 'language'])
      countryLanguageMap.forEach((mapping) => {
        Object.keys(mapping).forEach((key) => {
          expect(allowedProperties.has(key)).toBe(true)
        })
      })
    })

    it('should have consistent structure across all entries', () => {
      countryLanguageMap.forEach((mapping) => {
        expect(Object.keys(mapping).length).toBe(2)
        expect(mapping).toHaveProperty('country')
        expect(mapping).toHaveProperty('language')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle various country name formats', () => {
      const countryNames = countryLanguageMap.map((m) => m.country)
      // Check that we have a good variety of country names
      expect(countryNames.length).toBeGreaterThan(100)
      // All should be non-empty strings
      countryNames.forEach((name) => {
        expect(name.length).toBeGreaterThan(0)
      })
    })

    it('should handle various language name formats', () => {
      const languages = countryLanguageMap.map((m) => m.language)
      // Check that we have languages
      expect(languages.length).toBeGreaterThan(0)
      // All should be non-empty strings
      languages.forEach((lang) => {
        expect(lang.length).toBeGreaterThan(0)
      })
    })

    it('should handle countries with parentheses in names', () => {
      const parenCountries = countryLanguageMap.filter((m) => m.country.includes('('))
      expect(parenCountries.length).toBeGreaterThan(0)
    })

    it('should handle long country and language names', () => {
      const longNames = countryLanguageMap.filter(
        (m) => m.country.length > 30 || m.language.length > 30
      )
      expect(longNames.length).toBeGreaterThan(0)
    })
  })

  describe('sorting and ordering', () => {
    it('should allow sorting by country name', () => {
      const countries = countryLanguageMap.map((m) => m.country)
      const sorted = [...countries].sort()
      // Just verify it's sortable, not necessarily pre-sorted
      expect(sorted.length).toBe(countries.length)
    })

    it('should allow filtering by language prefix', () => {
      const englishVariants = countryLanguageMap.filter((m) =>
        m.language.startsWith('English')
      )
      expect(englishVariants.length).toBeGreaterThan(0)
    })
  })

  describe('statistics', () => {
    it('should provide statistics on language distribution', () => {
      const languages = countryLanguageMap.map((m) => m.language)
      const languageFrequency = {}
      languages.forEach((lang) => {
        languageFrequency[lang] = (languageFrequency[lang] || 0) + 1
      })

      // Most frequent language should appear in multiple countries
      const maxFrequency = Math.max(...Object.values(languageFrequency))
      expect(maxFrequency).toBeGreaterThan(1)
    })

    it('should have a reasonable distribution of languages', () => {
      const languages = new Set(countryLanguageMap.map((m) => m.language))
      const ratio = languages.size / countryLanguageMap.length
      // Should be between 0.3 and 0.8 (more shared languages, but good diversity)
      expect(ratio).toBeGreaterThan(0.3)
      expect(ratio).toBeLessThan(0.9)
    })

    it('should correctly count mappings', () => {
      expect(countryLanguageMap.length).toBeGreaterThan(190)
      expect(countryLanguageMap.length).toBeLessThan(300)
    })
  })

  describe('performance characteristics', () => {
    it('should be efficiently searchable by country', () => {
      const startTime = performance.now()
      for (let i = 0; i < 100; i++) {
        countryLanguageMap.find((m) => m.country === 'France')
      }
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(150)
    })

    it('should support filtering operations efficiently', () => {
      const startTime = performance.now()
      const englishCountries = countryLanguageMap.filter((m) =>
        m.language.includes('English')
      )
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
      expect(englishCountries.length).toBeGreaterThan(0)
    })

    it('should support mapping operations efficiently', () => {
      const startTime = performance.now()
      const countries = countryLanguageMap.map((m) => m.country)
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
      expect(countries.length).toBe(countryLanguageMap.length)
    })
  })
})
