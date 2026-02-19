import KEmailPreview from '@/components/KEmailPreview.vue'

describe('KEmailPreview.vue (extra)', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('handleWindowMessage increases height for redflag language change when iframe exists', () => {
    const resizeIframe = jest.fn()
    const ctx = {
      stopCalculateFrame: true,
      isInitialResize: false,
      animationFrame: 12,
      resizeIframe,
      $refs: { iframe: {} },
      height: '300px'
    }

    const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {})

    KEmailPreview.methods.handleWindowMessage.call(ctx, {
      data: { type: 'redflag:languageChanged' }
    })

    expect(ctx.stopCalculateFrame).toBe(false)
    expect(ctx.isInitialResize).toBe(true)
    expect(ctx.animationFrame).toBeNull()
    expect(resizeIframe).toHaveBeenCalled()
    expect(ctx.height).toBe('330px')
    expect(cancelSpy).toHaveBeenCalled()
  })

  it('getValidElementHeight parses px and keeps fallback for auto/%/vh', () => {
    expect(
      KEmailPreview.methods.getValidElementHeight.call({}, { height: '420px' }, 150)
    ).toBe(420)
    expect(
      KEmailPreview.methods.getValidElementHeight.call({}, { height: 'auto' }, 150)
    ).toBe(150)
    expect(
      KEmailPreview.methods.getValidElementHeight.call({}, { height: '100%' }, 150)
    ).toBe(150)
    expect(
      KEmailPreview.methods.getValidElementHeight.call({}, { height: '30vh' }, 150)
    ).toBe(150)
  })

  it('getFirstValidHeight returns 710 when microsoft container style is NaN', () => {
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn(() => ({
      height: 'abc',
      marginTop: 'def',
      marginBottom: 'ghi'
    }))

    const iframe = {
      contentWindow: {
        document: {
          querySelector: jest.fn((selector) => {
            if (selector === 'body') {
              return {
                querySelector: jest.fn((s) =>
                  s === '#emailCredentials.container' ? {} : null
                )
              }
            }
            return null
          })
        }
      }
    }

    const out = KEmailPreview.methods.getFirstValidHeight.call({}, 100, iframe)
    expect(out).toBe(710)

    global.getComputedStyle = originalGetComputedStyle
  })

  it('setDefaultHeight uses credentials-container branch and disables initial resize', () => {
    const ctx = {
      $refs: {
        iframe: {
          contentWindow: {
            document: {
              body: { scrollHeight: 240 },
              querySelector: jest.fn((selector) => {
                if (selector === 'body') return {}
                if (selector === '#emailCredentials.container') return {}
                return null
              })
            }
          }
        }
      },
      defaultHeight: 300,
      isInitialResize: true,
      getFirstValidHeight: jest.fn(() => 300)
    }

    const out = KEmailPreview.methods.setDefaultHeight.call(ctx, 240)
    expect(out).toBe(515)
    expect(ctx.defaultHeight).toBe(515)
    expect(ctx.isInitialResize).toBe(false)
  })
})
