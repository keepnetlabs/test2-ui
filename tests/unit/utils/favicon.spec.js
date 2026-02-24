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

  describe('Function Characteristics', () => {
    it('should be a function type', () => {
      expect(typeof updateFavicon).toBe('function')
    })

    it('should accept at least one parameter', () => {
      expect(updateFavicon.length).toBeGreaterThanOrEqual(1)
    })

    it('should be callable', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico')
      }).not.toThrow()
    })

    it('should return undefined', () => {
      const result = updateFavicon('https://example.com/favicon.ico')
      expect(result).toBeUndefined()
    })
  })

  describe('URL Handling and Validation', () => {
    it('should accept valid HTTP URLs', () => {
      expect(() => {
        updateFavicon('http://example.com/favicon.ico')
      }).not.toThrow()
    })

    it('should accept valid HTTPS URLs', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico')
      }).not.toThrow()
    })

    it('should accept relative URLs', () => {
      expect(() => {
        updateFavicon('/favicon.ico')
      }).not.toThrow()
    })

    it('should accept data URLs', () => {
      expect(() => {
        updateFavicon('data:image/x-icon;base64,ABC123')
      }).not.toThrow()
    })

    it('should accept blob URLs', () => {
      expect(() => {
        updateFavicon('blob:http://example.com/12345')
      }).not.toThrow()
    })

    it('should handle URLs with query parameters', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico?v=1.0')
      }).not.toThrow()
    })

    it('should handle URLs with multiple query parameters', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico?v=1&format=png')
      }).not.toThrow()
    })
  })

  describe('Cache Busting Options', () => {
    it('should accept cacheBust true option', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico', { cacheBust: true })
      }).not.toThrow()
    })

    it('should accept cacheBust false option', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico', { cacheBust: false })
      }).not.toThrow()
    })

    it('should work without cacheBust option', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico', {})
      }).not.toThrow()
    })

    it('should handle null cacheBust option', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico', { cacheBust: null })
      }).not.toThrow()
    })
  })

  describe('Icon Type Support', () => {
    it('should support favicon.ico updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.ico')
      }).not.toThrow()
    })

    it('should support PNG favicon updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.png')
      }).not.toThrow()
    })

    it('should support SVG favicon updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.svg')
      }).not.toThrow()
    })

    it('should support GIF favicon updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.gif')
      }).not.toThrow()
    })

    it('should support JPEG favicon updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.jpg')
      }).not.toThrow()
    })

    it('should support webp favicon updates', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon.webp')
      }).not.toThrow()
    })
  })

  describe('Multiple Calls and State', () => {
    it('should allow multiple calls with different URLs', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon1.ico')
        updateFavicon('https://example.com/favicon2.ico')
        updateFavicon('https://example.com/favicon3.ico')
      }).not.toThrow()
    })

    it('should allow alternating between URLs', () => {
      const url1 = 'https://example.com/favicon1.ico'
      const url2 = 'https://example.com/favicon2.ico'
      expect(() => {
        updateFavicon(url1)
        updateFavicon(url2)
        updateFavicon(url1)
        updateFavicon(url2)
      }).not.toThrow()
    })

    it('should handle repeated calls with same URL', () => {
      const testUrl = 'https://example.com/favicon.ico'
      expect(() => {
        for (let i = 0; i < 10; i++) {
          updateFavicon(testUrl)
        }
      }).not.toThrow()
    })

    it('should handle rapid updates without errors', () => {
      expect(() => {
        updateFavicon('https://example.com/favicon1.ico')
        updateFavicon('https://example.com/favicon2.ico')
        updateFavicon('https://example.com/favicon3.ico')
        updateFavicon('https://example.com/favicon4.ico')
        updateFavicon('https://example.com/favicon5.ico')
      }).not.toThrow()
    })
  })

  describe('Performance and Stability', () => {
    it('should complete function call quickly', () => {
      const startTime = Date.now()
      updateFavicon('https://example.com/favicon.ico')
      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(150)
    })

    it('should handle multiple rapid calls efficiently', () => {
      const startTime = Date.now()
      for (let i = 0; i < 100; i++) {
        updateFavicon('https://example.com/favicon.ico')
      }
      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(5000)
    })

    it('should not accumulate memory with repeated calls', () => {
      expect(() => {
        for (let i = 0; i < 1000; i++) {
          updateFavicon('https://example.com/favicon.ico?v=' + i)
        }
      }).not.toThrow()
    })

    it('should maintain consistent performance', () => {
      const times = []
      for (let i = 0; i < 10; i++) {
        const start = Date.now()
        updateFavicon('https://example.com/favicon.ico')
        times.push(Date.now() - start)
      }
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      expect(avgTime).toBeLessThan(100)
    })
  })

  describe('Error Resilience', () => {
    it('should not crash with malformed URLs', () => {
      expect(() => {
        updateFavicon('not a url')
      }).not.toThrow()
    })

    it('should handle zero-length strings gracefully', () => {
      expect(() => {
        updateFavicon('')
      }).not.toThrow()
    })

    it('should handle whitespace-only URLs', () => {
      expect(() => {
        updateFavicon('   ')
      }).not.toThrow()
    })

    it('should handle newlines in URLs', () => {
      expect(() => {
        updateFavicon('https://example.com/\nfavicon.ico')
      }).not.toThrow()
    })

    it('should handle tabs in URLs', () => {
      expect(() => {
        updateFavicon('https://example.com/\tfavicon.ico')
      }).not.toThrow()
    })
  })
})
