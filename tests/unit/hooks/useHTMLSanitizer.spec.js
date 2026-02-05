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
})
