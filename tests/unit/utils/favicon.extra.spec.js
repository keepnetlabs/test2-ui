describe('favicon.js (extra coverage)', () => {
  let updateFavicon

  beforeEach(() => {
    jest.resetModules()
    const module = require('@/utils/favicon')
    updateFavicon = module.updateFavicon
  })

  it('uses raw URL when cacheBust is false', () => {
    const url = 'https://example.com/fav.ico'
    updateFavicon(url, { cacheBust: false })
    const iconLink = document.querySelector('link[rel="icon"]')
    expect(iconLink).toBeTruthy()
    expect(iconLink.href).not.toMatch(/\?v=|\&v=/)
  })

  it('appends cache bust param with ? when URL has no query', () => {
    const url = 'https://example.com/fav.ico'
    updateFavicon(url, { cacheBust: true })
    const iconLink = document.querySelector('link[rel="icon"]')
    expect(iconLink).toBeTruthy()
    expect(iconLink.href).toMatch(/\?v=\d+/)
  })

  it('appends cache bust param with & when URL has existing query', () => {
    const url = 'https://example.com/fav.ico?foo=bar'
    updateFavicon(url, { cacheBust: true })
    const iconLink = document.querySelector('link[rel="icon"]')
    expect(iconLink).toBeTruthy()
    expect(iconLink.href).toMatch(/&v=\d+/)
    expect(iconLink.href).toContain('foo=bar')
  })

  it('replaces apple-touch-icon and shortcut icon links', () => {
    updateFavicon('https://x.com/fav.ico')
    expect(document.querySelectorAll('link[rel="apple-touch-icon"]').length).toBeLessThanOrEqual(1)
    expect(document.querySelectorAll('link[rel="shortcut icon"]').length).toBeLessThanOrEqual(1)
  })
})
