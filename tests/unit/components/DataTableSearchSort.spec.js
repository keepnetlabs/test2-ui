import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue search/sort/tooltip methods', () => {
  it('cellClick emits payload and cellLeave hides tooltip', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, showOverFlowTooltip: true }
    const row = { id: 1 }
    const column = { property: 'name' }
    const event = { type: 'click' }

    DataTable.methods.cellClick.call(ctx, row, column, event)
    expect(emit).toHaveBeenCalledWith('cellClick', { row, column, event })

    DataTable.methods.cellLeave.call(ctx)
    expect(ctx.showOverFlowTooltip).toBe(false)
  })

  it('cellEnter uses custom tooltip text when provided', () => {
    const hasOverflowTooltip = jest.fn()
    const ctx = {
      getCellTooltipText: jest.fn(() => 'Custom tooltip'),
      isCustomOverflowedColumn: false,
      cellPadding: 0,
      showOverFlowTooltip: false,
      overFlowTooltipContent: '',
      overFlowTooltipStyle: {},
      hasOverflowTooltip
    }
    const cell = {
      getBoundingClientRect: () => ({ top: 10, left: 20 })
    }
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn(() => ({ paddingLeft: '4px' }))

    DataTable.methods.cellEnter.call(ctx, { name: 'A' }, { property: 'name' }, cell)

    expect(ctx.showOverFlowTooltip).toBe(true)
    expect(ctx.overFlowTooltipContent).toBe('Custom tooltip')
    expect(ctx.overFlowTooltipStyle.top).toBe('70px')
    expect(ctx.overFlowTooltipStyle.left).toBe('24px')
    expect(hasOverflowTooltip).not.toHaveBeenCalled()

    global.getComputedStyle = originalGetComputedStyle
  })

  it('cellEnter falls back to overflow detection when custom tooltip is empty', () => {
    const hasOverflowTooltip = jest.fn()
    const ctx = {
      getCellTooltipText: jest.fn(() => ''),
      hasOverflowTooltip
    }
    const row = { name: 'A' }
    const column = { property: 'name' }
    const cell = {}

    DataTable.methods.cellEnter.call(ctx, row, column, cell)
    expect(hasOverflowTooltip).toHaveBeenCalledWith(row, column, cell)
  })

  it('hasOverflowTooltip sets tooltip when span width exceeds cell width', () => {
    const span = {
      classList: [],
      getBoundingClientRect: () => ({ width: 120 })
    }
    const cell = {
      getBoundingClientRect: () => ({ width: 80, top: 30, left: 40 }),
      querySelector: jest.fn((selector) => {
        if (selector === 'span:last-child') return span
        return span
      }),
      classList: [],
      parentNode: { classList: [] }
    }
    const originalGetComputedStyle = global.getComputedStyle
    global.getComputedStyle = jest.fn(() => ({ paddingLeft: '0px' }))
    const originalVendor = navigator.vendor
    Object.defineProperty(navigator, 'vendor', { configurable: true, value: 'Google Inc.' })

    const ctx = {
      columns: [{ property: 'name' }],
      isCustomOverflowedColumn: false,
      cellPadding: 0,
      showOverFlowTooltip: false,
      overFlowTooltipContent: '',
      overFlowTooltipStyle: {}
    }
    DataTable.methods.hasOverflowTooltip.call(ctx, { name: 'Very long name' }, { property: 'name' }, cell)

    expect(ctx.showOverFlowTooltip).toBe(true)
    expect(ctx.overFlowTooltipContent).toBe('Very long name')
    expect(ctx.overFlowTooltipStyle.top).toBe('90px')
    expect(ctx.overFlowTooltipStyle.left).toBe('40px')

    global.getComputedStyle = originalGetComputedStyle
    Object.defineProperty(navigator, 'vendor', { configurable: true, value: originalVendor })
  })

  it('sortChangedEvent emits in server-side mode', () => {
    const emit = jest.fn()
    const ctx = {
      sortProps: null,
      isServerSide: true,
      serverSideEvents: { sort: true },
      $emit: emit
    }
    const sortProps = { prop: 'name', order: 'ascending' }
    DataTable.methods.sortChangedEvent.call(ctx, sortProps)
    expect(ctx.sortProps).toEqual(sortProps)
    expect(emit).toHaveBeenCalledWith('sortChangedEvent', sortProps)
  })

  it('sortChangedEvent updates filteredData in client mode', () => {
    const sorted = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const ctx = {
      sortProps: null,
      isServerSide: false,
      serverSideEvents: { sort: false },
      showfilteredData: true,
      filteredData: [{ id: 99 }],
      unRenderedFilterData: [{ id: 3 }, { id: 2 }, { id: 1 }],
      sortFunction: jest.fn(() => sorted),
      rowCount: 2,
      currentPage: 1
    }
    const result = DataTable.methods.sortChangedEvent.call(ctx, { prop: 'id', order: 'ascending' })

    expect(ctx.filteredData).toEqual([{ id: 1 }, { id: 2 }])
    expect(result).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('sortChangedEvent updates tableData in client mode when no filtered data', () => {
    const sorted = [{ id: 10 }, { id: 20 }, { id: 30 }]
    const ctx = {
      sortProps: null,
      isServerSide: false,
      serverSideEvents: { sort: false },
      showfilteredData: false,
      filteredData: [],
      initialData: [{ id: 30 }, { id: 20 }, { id: 10 }],
      sortFunction: jest.fn(() => sorted),
      rowCount: 2,
      currentPage: 2,
      tableData: []
    }
    const result = DataTable.methods.sortChangedEvent.call(ctx, { prop: 'id', order: 'ascending' })

    expect(ctx.tableData).toEqual([{ id: 30 }])
    expect(result).toEqual([{ id: 30 }])
  })

  it('searchChangedEvent emits server-side search payload', () => {
    const emit = jest.fn()
    const ctx = {
      isSearchActive: false,
      isServerSide: true,
      serverSideEvents: { search: true },
      search: 'alice',
      debounce: (fn) => fn(),
      getSearchFilterItems: jest.fn(() => [{ FieldName: 'Name', Operator: 'Contains', Value: 'alice' }]),
      $emit: emit
    }

    DataTable.methods.searchChangedEvent.call(ctx)

    expect(ctx.isSearchActive).toBe(false)
    expect(emit).toHaveBeenCalledWith(
      'searchChangedEvent',
      expect.objectContaining({
        filter: expect.objectContaining({
          SearchInputTextValue: 'alice'
        })
      }),
      true
    )
  })

  it('searchChangedEvent filters client-side data and respects unSearchable columns', () => {
    const sortChangedEvent = jest.fn()
    const ctx = {
      isSearchActive: false,
      isServerSide: false,
      serverSideEvents: { search: false },
      debounce: (fn) => fn(),
      search: 'al',
      showfilteredData: false,
      sortProps: null,
      initialData: [
        { name: 'Alice', secret: 'alpha' },
        { name: 'Bob', secret: 'alpine' }
      ],
      renderedColumns: ['name', 'secret'],
      columns: [
        { property: 'name' },
        { property: 'secret', unSearchable: true }
      ],
      currentPage: 1,
      rowCount: 10,
      filteredData: [],
      unRenderedFilterData: [],
      filteredDataLength: 0,
      showOverFlowTooltip: true,
      sortChangedEvent
    }

    DataTable.methods.searchChangedEvent.call(ctx)

    expect(ctx.showfilteredData).toBe(true)
    expect(ctx.filteredData).toEqual([{ name: 'Alice', secret: 'alpha' }])
    expect(ctx.unRenderedFilterData).toEqual([{ name: 'Alice', secret: 'alpha' }])
    expect(ctx.filteredDataLength).toBe(1)
    expect(ctx.showOverFlowTooltip).toBe(true)
  })

  it('searchChangedEvent with empty client search restores table and clears filtered data', () => {
    const sortChangedEvent = jest.fn()
    const ctx = {
      isSearchActive: false,
      isServerSide: false,
      serverSideEvents: { search: false },
      debounce: (fn) => fn(),
      search: '',
      showfilteredData: true,
      sortProps: { order: 'ascending' },
      sortChangedEvent,
      initialData: [{ id: 1 }, { id: 2 }],
      renderedColumns: ['id'],
      columns: [{ property: 'id' }],
      currentPage: 1,
      rowCount: 10,
      filteredData: [{ id: 1 }],
      unRenderedFilterData: [{ id: 1 }],
      filteredDataLength: 1,
      showOverFlowTooltip: true,
      tableData: []
    }

    DataTable.methods.searchChangedEvent.call(ctx)

    expect(sortChangedEvent).toHaveBeenCalled()
    expect(ctx.showfilteredData).toBe(false)
    expect(ctx.filteredData).toEqual([])
  })
})
