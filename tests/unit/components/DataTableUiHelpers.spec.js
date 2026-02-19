import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue UI helper methods', () => {
  it('getSearchFilterItems maps rendered columns to API filters', () => {
    const ctx = {
      columns: [
        { property: 'name' },
        { property: 'customField', isCustomField: true },
        { property: 'hidden' }
      ],
      renderedColumns: ['name', 'customField'],
      search: 'alice'
    }

    const result = DataTable.methods.getSearchFilterItems.call(ctx)
    expect(result).toEqual([
      { FieldName: 'Name', Operator: 'Contains', Value: 'alice' },
      { FieldName: 'customField', Operator: 'Contains', Value: 'alice' }
    ])
  })

  it('toggleIsSettingsOpened toggles state, emits, and clears first-open flag later', () => {
    jest.useFakeTimers()
    const emit = jest.fn()
    const ctx = {
      isWantToEditRow: true,
      isSettingsOpened: false,
      isFirstOpenSettings: false,
      firstOpenSettingsTimeout: null,
      $emit: emit
    }

    DataTable.methods.toggleIsSettingsOpened.call(ctx)

    expect(ctx.isWantToEditRow).toBe(false)
    expect(ctx.isSettingsOpened).toBe(true)
    expect(ctx.isFirstOpenSettings).toBe(true)
    expect(emit).toHaveBeenCalledWith('handleChangeIsSettingsOpen', true)

    jest.advanceTimersByTime(200)
    expect(ctx.isFirstOpenSettings).toBe(false)
    jest.useRealTimers()
  })

  it('debounce schedules latest callback and clears previous timeout', () => {
    jest.useFakeTimers()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    const ctx = { timeout: null }

    DataTable.methods.debounce.call(ctx, fn1, 100)
    DataTable.methods.debounce.call(ctx, fn2, 100)

    jest.advanceTimersByTime(100)
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
    jest.useRealTimers()
  })

  it('renderFixedItems returns early when table element is missing', () => {
    const ctx = { $el: null }
    expect(() => DataTable.methods.renderFixedItems.call(ctx)).not.toThrow()
  })

  it('renderFixedItems increases fixed column heights when body gap is small', () => {
    const originalWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1400
    })

    const leftBody = {}
    const rightBody = {}
    const leftFixed = {
      style: { height: '100px' },
      querySelector: jest.fn(() => leftBody)
    }
    const rightFixed = {
      style: { height: '100px' },
      querySelector: jest.fn(() => rightBody)
    }
    const table = {
      querySelector: jest.fn((selector) => {
        if (selector === '.el-table__fixed') return leftFixed
        if (selector === '.el-table__fixed-right') return rightFixed
        return null
      })
    }
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn((el) => {
      if (el === leftBody || el === rightBody) return { height: '70px' }
      return { height: '0px' }
    })

    DataTable.methods.renderFixedItems.call({ $el: table })

    expect(leftFixed.style.height).toBe('115px')
    expect(rightFixed.style.height).toBe('115px')

    global.getComputedStyle = originalGetComputedStyle
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalWidth
    })
  })
})
