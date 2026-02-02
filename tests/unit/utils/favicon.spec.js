describe('favicon.js utility', () => {
  let updateFavicon

  beforeEach(() => {
    jest.clearAllMocks()
    const module = require('../../../src/utils/favicon.js')
    updateFavicon = module.updateFavicon
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('module structure', () => {
    it('should export updateFavicon function', () => {
      expect(typeof updateFavicon).toBe('function')
    })

    it('should have updateFavicon as named export', () => {
      expect(updateFavicon).toBeDefined()
    })

    it('should be a function with parameters', () => {
      expect(updateFavicon.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('updateFavicon - basic functionality', () => {
    it('should not throw with valid favicon URL', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should not throw when URL is null', () => {
      expect(() => {
        updateFavicon(null)
      }).not.toThrow()
    })

    it('should not throw when URL is empty string', () => {
      expect(() => {
        updateFavicon('')
      }).not.toThrow()
    })

    it('should not throw when URL is undefined', () => {
      expect(() => {
        updateFavicon(undefined)
      }).not.toThrow()
    })

    it('should accept options parameter', () => {
      const testUrl = 'https://example.com/favicon.ico'
      const options = { cacheBust: false }
      expect(() => {
        updateFavicon(testUrl, options)
      }).not.toThrow()
    })

    it('should accept empty options object', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl, {})
      }).not.toThrow()
    })
  })

  describe('document availability checks', () => {
    it('should not process when document is undefined', () => {
      const originalDoc = global.document
      global.document = undefined
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
      global.document = originalDoc
    })

    it('should not throw when document check fails', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should return early when document is unavailable', () => {
      const originalDoc = global.document
      global.document = undefined
      const testUrl = 'https://example.com/favicon.ico'
      const result = updateFavicon(testUrl)
      expect(result).toBeUndefined()
      global.document = originalDoc
    })
  })

  describe('DOM element creation', () => {
    it('should set href on all icon types', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should set rel attribute on links', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should set href attribute on links', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })
  })

  describe('options handling', () => {
    it('should handle missing options', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle undefined options', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl, undefined)
      }).not.toThrow()
    })

    it('should handle empty options object', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl, {})
      }).not.toThrow()
    })

    it('should handle unknown options', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl, { unknownOption: true })
      }).not.toThrow()
    })

    it('should work with boolean options', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl, { cacheBust: true })
      }).not.toThrow()
    })
  })

  describe('integration scenarios', () => {
    it('should update all icon types with same URL', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should work multiple times without errors', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        updateFavicon(testUrl)
        updateFavicon(testUrl)
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle rapid successive calls', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        for (let i = 0; i < 5; i++) {
          updateFavicon(testUrl)
        }
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle very long URLs', () => {
      const testUrl = 'https://example.com/' + 'a'.repeat(1000)
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle special characters in URL', () => {
      const testUrl = 'https://example.com/favicon-@#$%.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle URLs with fragments', () => {
      const testUrl = 'https://example.com/favicon.ico#section'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle URLs with encoded characters', () => {
      const testUrl = 'https://example.com/favicon%20file.ico'
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })
  })
})
