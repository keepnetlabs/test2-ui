import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

describe('SelectClickOnlyPageModal.vue (extra branches)', () => {
  const { methods, computed, watch } = SelectClickOnlyPageModal

  it('getSelectedPageIndex returns parsed tab index when valid', () => {
    const ctx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '3'
        }
      }
    }

    expect(methods.getSelectedPageIndex.call(ctx)).toBe(2)
  })

  it('getSelectedPageIndex returns 0 when parsed index is negative', () => {
    const ctx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '0'
        }
      }
    }

    expect(methods.getSelectedPageIndex.call(ctx)).toBe(0)
  })

  it('getSelectedPageIndex returns 0 when tab is not a number', () => {
    const ctx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: 'abc'
        }
      }
    }

    expect(methods.getSelectedPageIndex.call(ctx)).toBe(0)
  })

  it('getSelectedPageIndex returns 0 when template preview ref is missing', () => {
    const ctx = { $refs: {} }
    expect(methods.getSelectedPageIndex.call(ctx)).toBe(0)
  })

  it('handleAddTemplate emits selected resource id with selected tab index', () => {
    const emit = jest.fn()
    const ctx = {
      selectedResourceId: 'tpl-1',
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '2'
        }
      },
      $emit: emit
    }
    ctx.getSelectedPageIndex = SelectClickOnlyPageModal.methods.getSelectedPageIndex

    methods.handleAddTemplate.call(ctx)

    expect(emit).toHaveBeenCalledWith('add', 'tpl-1', 1)
  })

  it('handleAddTemplate does not emit when selectedResourceId is missing', () => {
    const emit = jest.fn()
    const ctx = {
      selectedResourceId: null,
      $emit: emit
    }

    methods.handleAddTemplate.call(ctx)

    expect(emit).not.toHaveBeenCalled()
  })

  it('stepSubtitle covers click/data/default branches', () => {
    const defaultText = 'Select a Click Only or Data Submission type landing page'
    expect(computed.stepSubtitle.call({ method: 'Click Only' })).toContain('Click Only or Data Submission')
    expect(computed.stepSubtitle.call({ method: 'Data Submission' })).toContain('Data Submission')
    expect(computed.stepSubtitle.call({ method: '' })).toContain('Click Only or Data Submission')
    expect(computed.stepSubtitle.call({ method: 'Click Only' })).toBe(defaultText)
  })

  it('status watcher opens drawer path when status becomes true', () => {
    jest.useFakeTimers()
    const openDrawer = jest.fn()
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      isVisible: false,
      isJustOpened: false,
      openDrawer,
      $nextTick: nextTick
    }

    watch.status.call(ctx, true)
    expect(ctx.isVisible).toBe(true)
    expect(ctx.isJustOpened).toBe(true)
    expect(openDrawer).toHaveBeenCalled()

    jest.advanceTimersByTime(300)
    expect(ctx.isJustOpened).toBe(false)
    jest.useRealTimers()
  })

  it('status watcher closes drawer path when status becomes false', () => {
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: true,
      closeDrawer
    }

    watch.status.call(ctx, false)
    expect(closeDrawer).toHaveBeenCalled()
  })

  it('status watcher does nothing when opening while already visible', () => {
    const openDrawer = jest.fn()
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: true,
      isJustOpened: false,
      openDrawer,
      closeDrawer,
      $nextTick: jest.fn()
    }

    watch.status.call(ctx, true)

    expect(openDrawer).not.toHaveBeenCalled()
    expect(closeDrawer).not.toHaveBeenCalled()
    expect(ctx.isJustOpened).toBe(false)
  })

  it('status watcher does nothing when closing while already hidden', () => {
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: false,
      closeDrawer
    }

    watch.status.call(ctx, false)
    expect(closeDrawer).not.toHaveBeenCalled()
  })

  it('openDrawer updates right style when drawer element exists', () => {
    jest.useFakeTimers()
    const el = { style: { right: '' } }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(el)

    methods.openDrawer.call({ drawerId: 'd-1' })
    expect(el.style.right).toBe('-100%')
    jest.advanceTimersByTime(10)
    expect(el.style.right).toBe('0')

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('openDrawer safely no-ops when drawer element is missing', () => {
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null)
    expect(() => methods.openDrawer.call({ drawerId: 'missing' })).not.toThrow()
    querySpy.mockRestore()
  })

  it('closeDrawer resets state and emits close', () => {
    jest.useFakeTimers()
    const el = { style: { right: '0' } }
    const emit = jest.fn()
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(el)
    const ctx = {
      drawerId: 'd-2',
      isVisible: true,
      selectedResourceId: 'tpl-9',
      $emit: emit
    }

    methods.closeDrawer.call(ctx)
    expect(el.style.right).toBe('-100%')

    jest.advanceTimersByTime(250)
    expect(ctx.isVisible).toBe(false)
    expect(ctx.selectedResourceId).toBeNull()
    expect(emit).toHaveBeenCalledWith('close')

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('closeDrawer still emits close even when drawer element is missing', () => {
    jest.useFakeTimers()
    const emit = jest.fn()
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null)
    const ctx = {
      drawerId: 'd-3',
      isVisible: true,
      selectedResourceId: 'tpl-10',
      $emit: emit
    }

    methods.closeDrawer.call(ctx)
    jest.advanceTimersByTime(250)

    expect(ctx.isVisible).toBe(false)
    expect(ctx.selectedResourceId).toBeNull()
    expect(emit).toHaveBeenCalledWith('close')

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('handleClose delegates to closeDrawer', () => {
    const closeDrawer = jest.fn()
    methods.handleClose.call({ closeDrawer })
    expect(closeDrawer).toHaveBeenCalled()
  })

  it('handleClickOutside returns early when drawer is just opened', () => {
    const handleClose = jest.fn()
    methods.handleClickOutside.call(
      {
        isJustOpened: true,
        handleClose
      },
      {
        target: { closest: () => null }
      }
    )
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores popper-like targets and does not close', () => {
    const handleClose = jest.fn()
    const ctx = {
      isJustOpened: false,
      handleClose
    }

    methods.handleClickOutside.call(ctx, {
      target: {
        closest: (selector) => (selector === '.el-popper' ? {} : null)
      }
    })

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores el-select-dropdown targets', () => {
    const handleClose = jest.fn()
    methods.handleClickOutside.call(
      {
        isJustOpened: false,
        handleClose
      },
      {
        target: {
          closest: (selector) => (selector === '.el-select-dropdown' ? {} : null)
        }
      }
    )

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores el-picker-panel targets', () => {
    const handleClose = jest.fn()
    methods.handleClickOutside.call(
      {
        isJustOpened: false,
        handleClose
      },
      {
        target: {
          closest: (selector) => (selector === '.el-picker-panel' ? {} : null)
        }
      }
    )

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores v-menu content targets', () => {
    const handleClose = jest.fn()
    methods.handleClickOutside.call(
      {
        isJustOpened: false,
        handleClose
      },
      {
        target: {
          closest: (selector) => (selector === '.v-menu__content' ? {} : null)
        }
      }
    )

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside triggers close when no guard selector matches', () => {
    const handleClose = jest.fn()
    methods.handleClickOutside.call(
      {
        isJustOpened: false,
        handleClose
      },
      {
        target: {
          closest: () => null
        }
      }
    )

    expect(handleClose).toHaveBeenCalled()
  })
})
