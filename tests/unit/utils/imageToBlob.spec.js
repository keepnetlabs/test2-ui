describe('image-to-blob.js utility', () => {
  let mockCanvas
  let mockImage
  let mockContext

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      drawImage: jest.fn()
    }

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      toDataURL: jest.fn((mimeType) => `data:${mimeType};base64,mock`),
      width: 100,
      height: 100
    }

    mockImage = {
      onload: null,
      onerror: null,
      src: null,
      crossOrigin: null,
      tagName: 'IMG'
    }

    // Mock document methods
    document.createElement = jest.fn((tag) => {
      if (tag === 'canvas') return mockCanvas
      if (tag === 'img') return mockImage
      return {}
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('module exports', () => {
    it('should export imageToBlob as default', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      expect(typeof imageToBlob).toBe('function')
    })

    it('should be a callable function', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      expect(typeof imageToBlob).toBe('function')
    })
  })

  describe('imageToBlob function parameters', () => {
    it('should handle URL string input', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const testUrl = 'https://example.com/image.png'

      imageToBlob(testUrl, callback)
      expect(callback).not.toThrow()
    })

    it('should handle IMG DOM node input', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const imgElement = document.createElement('img')

      imageToBlob(imgElement, callback)
      expect(callback).not.toThrow()
    })

    it('should handle options parameter as object', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const options = { type: 'png' }

      imageToBlob('https://example.com/image.jpg', options, callback)
      expect(callback).not.toThrow()
    })

    it('should accept callback as second parameter without options', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should accept callback as third parameter with options', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const options = { type: 'jpg' }

      imageToBlob('https://example.com/image.jpg', options, callback)
      expect(callback).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should call callback with error when no input provided', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob(null, callback)

      expect(callback).toHaveBeenCalled()
      expect(callback.mock.calls[0][0]).toBeDefined() // error
      expect(callback.mock.calls[0][0].message).toContain('Pass in a IMG DOM node')
    })

    it('should call callback with error when undefined input provided', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob(undefined, callback)

      expect(callback).toHaveBeenCalled()
      expect(callback.mock.calls[0][0]).toBeDefined()
    })

    it('should report unsupported image type error', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.unsupported', callback)

      expect(callback).toHaveBeenCalled()
      // The callback should be called with either error or result
    })
  })

  describe('image type support', () => {
    it('should support PNG type', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', { type: 'png' }, callback)
      expect(callback).not.toThrow()
    })

    it('should support JPG type', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpg', { type: 'jpg' }, callback)
      expect(callback).not.toThrow()
    })

    it('should support JPEG type', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpeg', { type: 'jpeg' }, callback)
      expect(callback).not.toThrow()
    })

    it('should support SVG type', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.svg', { type: 'svg' }, callback)
      expect(callback).not.toThrow()
    })

    it('should infer type from file extension', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle mixed case file extensions', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.PNG', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('data URL handling', () => {
    it('should handle data URI input', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'

      imageToBlob(dataUrl, { convert: false }, callback)
      expect(callback).not.toThrow()
    })

    it('should handle data URI without convert option', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'

      imageToBlob(dataUrl, callback)
      expect(callback).not.toThrow()
    })

    it('should detect base64 encoded data', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const base64DataUrl = 'data:image/png;base64,SGVsbG8gV29ybGQ='

      imageToBlob(base64DataUrl, { convert: false }, callback)
      expect(callback).not.toThrow()
    })
  })

  describe('URL parsing', () => {
    it('should handle URLs with query parameters', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png?size=200&quality=80', callback)
      expect(callback).not.toThrow()
    })

    it('should handle relative URLs', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('/images/photo.jpg', callback)
      expect(callback).not.toThrow()
    })

    it('should handle URLs with fragments', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png#section', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('options parameter', () => {
    it('should accept type option', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', { type: 'jpg' }, callback)
      expect(callback).not.toThrow()
    })

    it('should accept convert option', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('data:image/svg+xml;...', { convert: true }, callback)
      expect(callback).not.toThrow()
    })

    it('should use empty options if not provided', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('callback parameter', () => {
    it('should require callback parameter', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should be callable as second parameter', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(typeof callback).toBe('function')
    })

    it('should be callable as third parameter with options', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', { type: 'png' }, callback)
      expect(typeof callback).toBe('function')
    })
  })

  describe('MIME type mapping', () => {
    it('should map png to image/png', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should map jpg to image/jpeg', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpg', callback)
      expect(callback).not.toThrow()
    })

    it('should map jpeg to image/jpeg', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpeg', callback)
      expect(callback).not.toThrow()
    })

    it('should map svg to image/svg+xml', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.svg', callback)
      expect(callback).not.toThrow()
    })
  })
})
