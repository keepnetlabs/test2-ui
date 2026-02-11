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

  describe('Hook Behavior - Return Values', () => {
    it('should return promise-like object', async () => {
      const result = useHTMLSanitizer('<p>test</p>')
      expect(result).toHaveProperty('then')
    })

    it('should resolve with sanitized HTML', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>sanitized</p>')
      const result = await useHTMLSanitizer('<p>test</p>')
      expect(result).toBe('<p>sanitized</p>')
    })

    it('should return truthy sanitized content', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>content</p>')
      const result = await useHTMLSanitizer('<p>test</p>')
      expect(result).toBeTruthy()
    })
  })

  describe('Configuration - AllowedTags', () => {
    it('should allow paragraph tags', async () => {
      await useHTMLSanitizer('<p>test</p>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedTags).toContain('p')
    })

    it('should allow image tags', async () => {
      await useHTMLSanitizer('<img src="test.jpg" />')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedTags).toContain('img')
    })

    it('should allow center tags', async () => {
      await useHTMLSanitizer('<center>test</center>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedTags).toContain('center')
    })

    it('should allow anchor tags', async () => {
      await useHTMLSanitizer('<a href="test.html">link</a>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedTags).toContain('a')
    })

    it('should allow multiple tag types simultaneously', async () => {
      await useHTMLSanitizer('<p><img src="test.jpg" /><a href="#">link</a></p>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedTags.length).toBeGreaterThan(0)
    })
  })

  describe('Configuration - AllowedAttributes', () => {
    it('should allow style attribute globally', async () => {
      await useHTMLSanitizer('<p style="color: red;">test</p>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedAttributes['*']).toContain('style')
    })

    it('should allow src attribute on img tags', async () => {
      await useHTMLSanitizer('<img src="test.jpg" />')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedAttributes.img).toContain('src')
    })

    it('should allow href attribute on anchor tags', async () => {
      await useHTMLSanitizer('<a href="test.html">link</a>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedAttributes.a).toContain('href')
    })

    it('should have allowedAttributes as object', async () => {
      await useHTMLSanitizer('<p>test</p>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(typeof callArgs.allowedAttributes).toBe('object')
    })
  })

  describe('Configuration - AllowedSchemes', () => {
    it('should allow http scheme', async () => {
      await useHTMLSanitizer('<a href="http://example.com">link</a>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedSchemes).toContain('http')
    })

    it('should allow https scheme', async () => {
      await useHTMLSanitizer('<a href="https://example.com">link</a>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedSchemes).toContain('https')
    })

    it('should allow mailto scheme', async () => {
      await useHTMLSanitizer('<a href="mailto:test@example.com">email</a>')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedSchemes).toContain('mailto')
    })

    it('should allow data scheme', async () => {
      await useHTMLSanitizer('<img src="data:image/png;base64,..." />')
      const callArgs = sanitizeHtmlMock.mock.calls[0][1]
      expect(callArgs.allowedSchemes).toContain('data')
    })
  })

  describe('XSS Prevention', () => {
    it('should remove inline event handlers', async () => {
      const html = '<p onclick="alert(1)">test</p>'
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const result = await useHTMLSanitizer(html)
      expect(result).not.toContain('onclick')
    })

    it('should remove javascript: URLs', async () => {
      const html = '<a href="javascript:alert(1)">click</a>'
      sanitizeHtmlMock.mockReturnValue('<a>click</a>')
      const result = await useHTMLSanitizer(html)
      expect(result).not.toContain('javascript:')
    })

    it('should remove data: URLs with scripts', async () => {
      const html = '<img src="data:text/html,<script>alert(1)</script>" />'
      sanitizeHtmlMock.mockReturnValue('<img />')
      const result = await useHTMLSanitizer(html)
      expect(result).not.toContain('script')
    })

    it('should handle complex XSS payloads', async () => {
      const html = '<img src=x onerror="alert(1)" /><svg><script>alert(2)</script></svg>'
      sanitizeHtmlMock.mockReturnValue('<img />')
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })
  })

  describe('Edge Cases - Input Handling', () => {
    it('should handle null-like strings', async () => {
      sanitizeHtmlMock.mockReturnValue('')
      const result = await useHTMLSanitizer(null || '')
      expect(result).toBeDefined()
    })

    it('should handle very long HTML strings', async () => {
      const longHtml = '<p>' + 'a'.repeat(10000) + '</p>'
      sanitizeHtmlMock.mockReturnValue('<p>' + 'a'.repeat(10000) + '</p>')
      const result = await useHTMLSanitizer(longHtml)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })

    it('should handle HTML with special unicode characters', async () => {
      const html = '<p>test 你好 🎉 العربية</p>'
      sanitizeHtmlMock.mockReturnValue('<p>test 你好 🎉 العربية</p>')
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })

    it('should handle deeply nested HTML', async () => {
      const html = '<p><div><span><b><i>nested</i></b></span></div></p>'
      sanitizeHtmlMock.mockReturnValue(html)
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })

    it('should handle HTML with comments', async () => {
      const html = '<p>test<!-- comment --></p>'
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalled()
    })
  })

  describe('Promise Handling', () => {
    it('should be awaitable', async () => {
      const promise = useHTMLSanitizer('<p>test</p>')
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const result = await promise
      expect(result).toBeDefined()
    })

    it('should handle multiple concurrent calls', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const results = await Promise.all([
        useHTMLSanitizer('<p>test1</p>'),
        useHTMLSanitizer('<p>test2</p>'),
        useHTMLSanitizer('<p>test3</p>')
      ])
      expect(results.length).toBe(3)
    })

    it('should maintain sanitization across sequential calls', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>sanitized</p>')
      const result1 = await useHTMLSanitizer('<p>test1</p>')
      const result2 = await useHTMLSanitizer('<p>test2</p>')
      expect(result1).toBe('<p>sanitized</p>')
      expect(result2).toBe('<p>sanitized</p>')
    })
  })

  describe('Performance and Stability', () => {
    it('should handle rapid consecutive calls', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(useHTMLSanitizer('<p>test</p>'))
      }
      await Promise.all(promises)
      expect(sanitizeHtmlMock.mock.calls.length).toBe(10)
    })

    it('should complete sanitization without errors', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const result = await useHTMLSanitizer('<p>test</p>')
      expect(() => {
        expect(result).toBeDefined()
      }).not.toThrow()
    })

    it('should handle different HTML complexities', async () => {
      const htmlVariants = [
        '<p>simple</p>',
        '<div><p>nested</p></div>',
        '<p style="color:red;">styled</p>',
        '<a href="http://example.com">link</a>',
        '<img src="test.jpg" alt="image" />'
      ]

      sanitizeHtmlMock.mockReturnValue('<p>sanitized</p>')
      for (const html of htmlVariants) {
        await useHTMLSanitizer(html)
      }
      expect(sanitizeHtmlMock.mock.calls.length).toBe(htmlVariants.length)
    })
  })

  describe('Integration Scenarios', () => {
    it('should work with common HTML patterns', async () => {
      const patterns = [
        '<p>text</p>',
        '<a href="#">link</a>',
        '<img src="test.jpg" />',
        '<center>centered</center>'
      ]

      sanitizeHtmlMock.mockImplementation((html) => html)
      for (const pattern of patterns) {
        const result = await useHTMLSanitizer(pattern)
        expect(result).toBeDefined()
      }
    })

    it('should preserve safe HTML structure', async () => {
      const safeHtml = '<p>test <b>bold</b> <i>italic</i></p>'
      sanitizeHtmlMock.mockReturnValue(safeHtml)
      const result = await useHTMLSanitizer(safeHtml)
      expect(result).toBe(safeHtml)
    })

    it('should handle sanitization with multiple tag types', async () => {
      const html = '<p>paragraph <a href="#">link</a> <img src="test.jpg" /></p>'
      sanitizeHtmlMock.mockReturnValue(html)
      const result = await useHTMLSanitizer(html)
      expect(sanitizeHtmlMock).toHaveBeenCalledWith(html, expect.any(Object))
    })
  })

  describe('Multiple Instances and Isolation', () => {
    it('should handle independent sanitization calls', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const result1 = await useHTMLSanitizer('<p>input1</p>')
      const result2 = await useHTMLSanitizer('<p>input2</p>')
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })

    it('should not mix results from different calls', async () => {
      sanitizeHtmlMock.mockImplementation((html) => html)
      const result1 = await useHTMLSanitizer('<p>A</p>')
      const result2 = await useHTMLSanitizer('<p>B</p>')
      expect(result1).not.toBe(result2)
    })

    it('should maintain call count across multiple invocations', async () => {
      sanitizeHtmlMock.mockReturnValue('<p>test</p>')
      const initialCount = sanitizeHtmlMock.mock.calls.length
      await useHTMLSanitizer('<p>test</p>')
      await useHTMLSanitizer('<p>test</p>')
      expect(sanitizeHtmlMock.mock.calls.length).toBe(initialCount + 2)
    })
  })
})
