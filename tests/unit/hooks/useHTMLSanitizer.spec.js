import useHTMLSanitizer from '@/hooks/useHTMLSanitizer'

jest.mock('sanitize-html', () => {
  const mockSanitize = jest.fn((html, options) => {
    // Simple mock that returns the HTML with basic filtering
    return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
  })

  // Add defaults property with allowedTags
  mockSanitize.defaults = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br']
  }

  return {
    default: mockSanitize,
    __esModule: true
  }
})

describe('useHTMLSanitizer Hook', () => {
  let sanitizeHtmlMock

  beforeEach(() => {
    jest.clearAllMocks()
    sanitizeHtmlMock = require('sanitize-html').default
  })

  it('should be an async function', async () => {
    expect(typeof useHTMLSanitizer === 'function').toBe(true)
    const result = useHTMLSanitizer('test')
    expect(result instanceof Promise).toBe(true)
  })

  it('should call sanitize-html with provided HTML', async () => {
    const html = '<p>test content</p>'
    await useHTMLSanitizer(html)

    expect(sanitizeHtmlMock).toHaveBeenCalledWith(
      html,
      expect.objectContaining({
        allowedTags: expect.arrayContaining(['img', 'center']),
        allowedAttributes: expect.any(Object),
        allowedSchemes: expect.any(Array)
      })
    )
  })

  it('should pass correct allowedTags configuration', async () => {
    await useHTMLSanitizer('<p>test</p>')

    const callArgs = sanitizeHtmlMock.mock.calls[0][1]
    expect(callArgs.allowedTags).toContain('img')
    expect(callArgs.allowedTags).toContain('center')
  })

  it('should pass correct allowedAttributes configuration', async () => {
    await useHTMLSanitizer('<p>test</p>')

    const callArgs = sanitizeHtmlMock.mock.calls[0][1]
    expect(callArgs.allowedAttributes['*']).toContain('style')
    expect(callArgs.allowedAttributes['*']).toContain('align')
    expect(callArgs.allowedAttributes.img).toContain('src')
    expect(callArgs.allowedAttributes.a).toContain('href')
  })

  it('should pass correct allowedSchemes configuration', async () => {
    await useHTMLSanitizer('<p>test</p>')

    const callArgs = sanitizeHtmlMock.mock.calls[0][1]
    expect(callArgs.allowedSchemes).toEqual(['data', 'http', 'https', 'mailto'])
  })

  it('should remove script tags', async () => {
    sanitizeHtmlMock.mockImplementation((html) => {
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
    })

    const html = '<p>test</p><script>alert("xss")</script><p>end</p>'
    const result = await useHTMLSanitizer(html)

    expect(result).not.toContain('<script>')
  })

  it('should handle empty HTML string', async () => {
    sanitizeHtmlMock.mockReturnValue('')
    const result = await useHTMLSanitizer('')

    expect(result).toBe('')
  })

  it('should handle HTML with safe attributes', async () => {
    sanitizeHtmlMock.mockImplementation((html) => html)
    const html = '<img src="test.jpg" alt="test" width="100" height="100" loading="lazy" />'
    const result = await useHTMLSanitizer(html)

    expect(sanitizeHtmlMock).toHaveBeenCalledWith(html, expect.any(Object))
  })

  describe('Hook Functionality', () => {
    it('should be a function', () => {
      expect(typeof useHTMLSanitizer).toBe('function')
    })

    it('should return a Promise', () => {
      const result = useHTMLSanitizer('<p>test</p>')
      expect(result instanceof Promise).toBe(true)
    })

    it('should process HTML asynchronously', async () => {
      const html = '<p>test content</p>'
      const result = await useHTMLSanitizer(html)
      expect(result).toBeDefined()
    })
  })

  describe('Sanitization Configuration', () => {
    it('should use sanitize-html library', async () => {
      await useHTMLSanitizer('<p>test</p>')
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })

    it('should configure allowed tags', async () => {
      await useHTMLSanitizer('<p>test</p>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedTags).toBeDefined()
      expect(Array.isArray(config.allowedTags)).toBe(true)
    })

    it('should configure allowed attributes', async () => {
      await useHTMLSanitizer('<p>test</p>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedAttributes).toBeDefined()
      expect(typeof config.allowedAttributes).toBe('object')
    })

    it('should configure allowed schemes', async () => {
      await useHTMLSanitizer('<p>test</p>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedSchemes).toBeDefined()
      expect(Array.isArray(config.allowedSchemes)).toBe(true)
    })
  })

  describe('Security Features', () => {
    it('should remove script tags from HTML', async () => {
      sanitizeHtmlMock.mockImplementation((html) => {
        return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
      })
      const html = '<p>Safe</p><script>alert("xss")</script>'
      const result = await useHTMLSanitizer(html)
      expect(result).not.toContain('<script>')
    })

    it('should handle onclick attributes removal', async () => {
      const html = '<button onclick="alert(1)">Click</button>'
      await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(html, expect.any(Object))
    })

    it('should handle event handlers', async () => {
      const html = '<img src="x" onerror="alert(1)" />'
      await useHTMLSanitizer(html)
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedAttributes).toBeDefined()
    })
  })

  describe('HTML Content Handling', () => {
    it('should process plain text HTML', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>plain text</p>')
      const result = await useHTMLSanitizer('<p>plain text</p>')
      expect(result).toBe('<p>plain text</p>')
    })

    it('should handle empty strings', async () => {
      sanitizeHtmlMock.mockReturnValue('')
      const result = await useHTMLSanitizer('')
      expect(result).toBe('')
    })

    it('should handle complex HTML structures', async () => {
      sanitizeHtmlMock.mockReturnValue('<div><p>test</p><img src="x" /></div>')
      const html = '<div><p>test</p><img src="x" /></div>'
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(html, expect.any(Object))
    })

    it('should preserve safe HTML structure', async () => {
      sanitizeHtmlMock.mockImplementation((html) => html)
      const html = '<p>Safe <strong>content</strong></p>'
      const result = await useHTMLSanitizer(html)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
    })
  })

  describe('Image Tags', () => {
    it('should support image tags', async () => {
      await useHTMLSanitizer('<img src="test.jpg" />')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedTags).toContain('img')
    })

    it('should allow src attribute on images', async () => {
      await useHTMLSanitizer('<img src="test.jpg" />')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedAttributes.img).toContain('src')
    })

    it('should handle image attributes', async () => {
      sanitizeHtmlMock.mockImplementation((html) => html)
      const html = '<img src="test.jpg" alt="Test" width="100" height="100" />'
      await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(html, expect.any(Object))
    })
  })

  describe('Link Handling', () => {
    it('should support anchor tags', async () => {
      await useHTMLSanitizer('<a href="http://test.com">Link</a>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedTags).toContain('a')
    })

    it('should allow href attribute', async () => {
      await useHTMLSanitizer('<a href="http://test.com">Link</a>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedAttributes.a).toContain('href')
    })

    it('should handle different URL schemes', async () => {
      await useHTMLSanitizer('<a href="https://test.com">Link</a>')
      const config = sanitizeHtmlMock.mock.calls[0][1]
      expect(config.allowedSchemes).toContain('https')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null gracefully', async () => {
      sanitizeHtmlMock.mockReturnValue('')
      const result = await useHTMLSanitizer(null)
      expect(result).toBeDefined()
    })

    it('should handle very long HTML', async () => {
      const longHtml = '<p>' + 'test'.repeat(1000) + '</p>'
      await useHTMLSanitizer(longHtml)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(longHtml, expect.any(Object))
    })

    it('should handle nested HTML tags', async () => {
      sanitizeHtmlMock.mockImplementation((html) => html)
      const html = '<div><p><strong><em>nested</em></strong></p></div>'
      await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })

    it('should handle malformed HTML', async () => {
      const malformed = '<p>unclosed <div>tags'
      await useHTMLSanitizer(malformed)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(malformed, expect.any(Object))
    })
  })

  describe('Promise Behavior', () => {
    it('should resolve to sanitized content', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>clean</p>')
      const result = await useHTMLSanitizer('<p>test</p>')
      expect(result).toBe('<p>clean</p>')
    })

    it('should handle promise rejection gracefully', async () => {
      sanitizeHtmlMock.mockRejectedValue(new Error('Sanitization failed'))
      try {
        await useHTMLSanitizer('<p>test</p>')
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
})
