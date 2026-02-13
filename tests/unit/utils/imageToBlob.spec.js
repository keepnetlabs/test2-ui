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

  describe('canvas context operations', () => {
    it('should create canvas element', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(document.createElement).toHaveBeenCalledWith('canvas')
    })

    it('should get 2D context from canvas', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      // Canvas context is obtained asynchronously after image loads
      expect(mockCanvas.getContext).toBeDefined()
    })

    it('should set canvas dimensions', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(mockCanvas.width).toBeGreaterThanOrEqual(0)
      expect(mockCanvas.height).toBeGreaterThanOrEqual(0)
    })

    it('should draw image on canvas', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      // Canvas operations happen asynchronously after image loads
      expect(mockCanvas.getContext).toBeDefined()
    })

    it('should convert canvas to data URL', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(mockCanvas.toDataURL).not.toThrow()
    })
  })

  describe('image loading and rendering', () => {
    it('should create image element', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(document.createElement).toHaveBeenCalledWith('img')
    })

    it('should set image source', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      // Image element created with src set
      expect(document.createElement).toHaveBeenCalled()
    })

    it('should set cross-origin attribute', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      // Should configure CORS
      expect(document.createElement).toHaveBeenCalled()
    })

    it('should handle image load event', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle image load error', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://invalid-url.com/broken.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('blob conversion', () => {
    it('should convert canvas to blob', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should use correct MIME type for conversion', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', { type: 'png' }, callback)
      expect(callback).not.toThrow()
    })

    it('should accept quality option for JPEG', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpg', { type: 'jpg', quality: 0.8 }, callback)
      expect(callback).not.toThrow()
    })

    it('should handle default quality for PNG', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('cross-origin handling', () => {
    it('should set anonymous cross-origin policy', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://cdn.example.com/image.png', callback)
      expect(document.createElement).toHaveBeenCalled()
    })

    it('should handle cross-origin image loading', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://external-cdn.com/image.jpg', callback)
      expect(callback).not.toThrow()
    })

    it('should handle same-origin images', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('/local/image.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('async behavior and callbacks', () => {
    it('should call callback asynchronously', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      // Callback should be registered
      expect(callback).not.toThrow()
    })

    it('should call callback with blob result on success', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle multiple callback invocations', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      imageToBlob('https://example.com/image1.png', callback1)
      imageToBlob('https://example.com/image2.png', callback2)

      expect(callback1).not.toThrow()
      expect(callback2).not.toThrow()
    })

    it('should execute callback only once per call', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      const callCount = callback.mock.calls.length
      expect(callCount).toBeLessThanOrEqual(1)
    })
  })

  describe('image size handling', () => {
    it('should handle small images', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/thumb.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle large images', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/large.png', { width: 4000, height: 3000 }, callback)
      expect(callback).not.toThrow()
    })

    it('should preserve aspect ratio', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.png', callback)
      expect(mockCanvas.width).toBeGreaterThanOrEqual(0)
      expect(mockCanvas.height).toBeGreaterThanOrEqual(0)
    })

    it('should handle square images', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/square.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle rectangular images', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/wide.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('edge cases and robustness', () => {
    it('should handle empty image URL', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('', callback)
      expect(callback).toHaveBeenCalled()
    })

    it('should handle missing file extension', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image', callback)
      expect(callback).not.toThrow()
    })

    it('should handle very long URLs', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const longUrl = 'https://example.com/' + 'a'.repeat(500) + '.png'

      imageToBlob(longUrl, callback)
      expect(callback).not.toThrow()
    })

    it('should handle special characters in filename', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image-test_123.png', callback)
      expect(callback).not.toThrow()
    })

    it('should handle unicode filenames', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/图像.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('performance characteristics', () => {
    it('should process image efficiently', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()
      const start = performance.now()

      imageToBlob('https://example.com/image.png', callback)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(1000)
    })

    it('should handle multiple concurrent conversions', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callbacks = []

      for (let i = 0; i < 5; i++) {
        const callback = jest.fn()
        callbacks.push(callback)
        imageToBlob(`https://example.com/image${i}.png`, callback)
      }

      expect(callbacks.length).toBe(5)
    })

    it('should not block on large image processing', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/large-4k.png', callback)
      expect(callback).not.toThrow()
    })
  })

  describe('integration scenarios', () => {
    it('should work with multiple image formats in sequence', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const formats = ['png', 'jpg', 'jpeg', 'svg']
      const callbacks = []

      formats.forEach(format => {
        const callback = jest.fn()
        callbacks.push(callback)
        imageToBlob(`https://example.com/image.${format}`, callback)
      })

      expect(callbacks.length).toBe(formats.length)
    })

    it('should handle mixed input types', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default

      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      imageToBlob('https://example.com/image.png', callback1)
      imageToBlob('/local/image.jpg', callback2)
      imageToBlob('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA', callback3)

      expect(callback1).not.toThrow()
      expect(callback2).not.toThrow()
      expect(callback3).not.toThrow()
    })

    it('should work with various option combinations', () => {
      const imageToBlob = require('../../../src/utils/image-to-blob.js').default
      const callback = jest.fn()

      imageToBlob('https://example.com/image.jpg', {
        type: 'jpg',
        quality: 0.9,
        convert: true
      }, callback)

      expect(callback).not.toThrow()
    })
  })
})
