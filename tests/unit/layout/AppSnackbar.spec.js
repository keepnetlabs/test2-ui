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
})
