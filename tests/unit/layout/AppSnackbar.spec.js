import AppSnackbar from '@/layout/AppSnackbar.vue'

describe('AppSnackbar.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'outerWidth', { value: 600, writable: true })
  })

  it('changeSnackbarStatus dispatches closeSnackBar', () => {
    const dispatch = jest.fn()
    const snackbar = { id: 's1' }
    const ctx = { $store: { dispatch } }

    AppSnackbar.methods.changeSnackbarStatus.call(ctx, false, snackbar)

    expect(dispatch).toHaveBeenCalledWith('common/closeSnackBar', snackbar)
  })

  it('changeSnackbarStatus dispatches regardless of input value', () => {
    const dispatch = jest.fn()
    const snackbar = { id: 's2' }
    const ctx = { $store: { dispatch } }

    AppSnackbar.methods.changeSnackbarStatus.call(ctx, true, snackbar)

    expect(dispatch).toHaveBeenCalledWith('common/closeSnackBar', snackbar)
  })

  it('getSnackBarStyle returns bottom 10px for first snackbar', () => {
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, 'msg', 0)
    expect(style.bottom).toBe('10px')
    expect(style.left).toBe('5px')
  })

  it('getSnackBarStyle returns stacked bottom for index >= 1', () => {
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, 'msg', 1)
    expect(style.bottom).toBe('75px')
  })

  it('getSnackBarStyle uses 95% width on narrow screens', () => {
    Object.defineProperty(window, 'outerWidth', { value: 400, writable: true })
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, 'msg', 0)
    expect(style.width).toBe('95%')
  })

  it('getSnackBarStyle sets width 580px for long messages', () => {
    Object.defineProperty(window, 'outerWidth', { value: 600, writable: true })
    const longMsg = 'x'.repeat(65)
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, longMsg, 0)
    expect(style.width).toBe('580px')
  })

  it('getSnackBarStyle sets width 580px for medium long messages', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const message = 'x'.repeat(50)
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, message, 0)
    expect(style.width).toBe('580px')
  })

  it('getSnackBarStyle sets width 480px for short or empty messages', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const shortStyle = AppSnackbar.methods.getSnackBarStyle.call({}, 'short msg', 0)
    const emptyStyle = AppSnackbar.methods.getSnackBarStyle.call({}, null, 0)
    expect(shortStyle.width).toBe('480px')
    expect(emptyStyle.width).toBe('480px')
    expect(shortStyle.paddingTop).toBe('0 !important')
  })

  it('getSnackBarStyle keeps 480px at exact boundary length 60 on wide screens', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const boundaryMsg = 'x'.repeat(60)
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, boundaryMsg, 0)
    expect(style.width).toBe('480px')
  })

  it('getSnackBarStyle uses 140px bottom for index 2 on wide screens', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, 'msg', 2)
    expect(style.bottom).toBe('140px')
  })

  it('getSnackBarStyle uses mobile stacked bottom for index >= 1 on narrow screens', () => {
    Object.defineProperty(window, 'outerWidth', { value: 480, writable: true })
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, 'msg', 2)
    expect(style.bottom).toBe('160px')
    expect(style.width).toBe('95%')
  })

  it('getSnackBarStyle keeps short width at boundary 40 and switches at 41 chars', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const boundary40 = AppSnackbar.methods.getSnackBarStyle.call({}, 'x'.repeat(40), 0)
    const boundary41 = AppSnackbar.methods.getSnackBarStyle.call({}, 'x'.repeat(41), 0)

    expect(boundary40.width).toBe('480px')
    expect(boundary41.width).toBe('580px')
  })

  it('getSnackBarStyle trims message before width calculation', () => {
    Object.defineProperty(window, 'outerWidth', { value: 700, writable: true })
    const style = AppSnackbar.methods.getSnackBarStyle.call({}, '     ', 0)
    expect(style.width).toBe('480px')
  })
})
