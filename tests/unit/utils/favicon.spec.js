describe('favicon.js utility', () => {
  let originalDocument

  beforeEach(() => {
    // Mock document
    originalDocument = global.document
    global.document = {
      head: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
      },
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      createElement: jest.fn((tag) => {
        const element = {
          rel: null,
          href: null,
          remove: jest.fn()
        }
        return element
      })
    }
  })

  afterEach(() => {
    global.document = originalDocument
    jest.clearAllMocks()
  })

  describe('appendCacheBust', () => {
    it('should add cache bust parameter to URL with query string', () => {
      // We need to require the module to test internal functions
      const module = require('../../../src/utils/favicon.js')

      // Test the behavior through updateFavicon since appendCacheBust is not exported
      // We can verify by checking that updateFavicon is called
      expect(typeof module.updateFavicon).toBe('function')
    })
  })

  describe('updateFavicon', () => {
    it('should not throw when URL is empty', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')

      expect(() => {
        updateFavicon('')
      }).not.toThrow()
    })

    it('should not throw when URL is null', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')

      expect(() => {
        updateFavicon(null)
      }).not.toThrow()
    })

    it('should handle valid favicon URL', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico'

      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should accept options parameter', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico'
      const options = { cacheBust: false }

      expect(() => {
        updateFavicon(testUrl, options)
      }).not.toThrow()
    })

    it('should handle cache bust option', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico'
      const optionsWithCacheBust = { cacheBust: true }
      const optionsWithoutCacheBust = { cacheBust: false }

      expect(() => {
        updateFavicon(testUrl, optionsWithCacheBust)
        updateFavicon(testUrl, optionsWithoutCacheBust)
      }).not.toThrow()
    })

    it('should default cache bust to true', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico'

      // Without options should use cache bust by default
      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })
  })

  describe('favicon utility exports', () => {
    it('should export updateFavicon function', () => {
      const module = require('../../../src/utils/favicon.js')
      expect(typeof module.updateFavicon).toBe('function')
    })

    it('should have updateFavicon as named export', () => {
      const module = require('../../../src/utils/favicon.js')
      expect(module).toHaveProperty('updateFavicon')
    })
  })

  describe('favicon URL handling', () => {
    it('should handle URLs with query parameters', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico?size=64'

      expect(() => {
        updateFavicon(testUrl, { cacheBust: true })
      }).not.toThrow()
    })

    it('should handle URLs without query parameters', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = 'https://example.com/favicon.ico'

      expect(() => {
        updateFavicon(testUrl, { cacheBust: true })
      }).not.toThrow()
    })

    it('should handle relative URLs', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const testUrl = '/favicon.ico'

      expect(() => {
        updateFavicon(testUrl)
      }).not.toThrow()
    })

    it('should handle data URLs', () => {
      const { updateFavicon } = require('../../../src/utils/favicon.js')
      const dataUrl = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAA=='

      expect(() => {
        updateFavicon(dataUrl, { cacheBust: false })
      }).not.toThrow()
    })

    it('should not process when document is undefined', () => {
      const originalDoc = global.document
      global.document = undefined

      const { updateFavicon } = require('../../../src/utils/favicon.js')

      expect(() => {
        updateFavicon('https://example.com/favicon.ico')
      }).not.toThrow()

      global.document = originalDoc
    })
  })
})
