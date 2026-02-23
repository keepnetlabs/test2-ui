import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue selection and lazy flow methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleLoad emits lazy load payload with callback reference', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      callbackOfLazyLoad: jest.fn()
    }
    const tree = { id: 't1' }
    const treeNode = { level: 1 }
    const resolve = jest.fn()

    DataTable.methods.handleLoad.call(ctx, tree, treeNode, resolve)

    expect(emit).toHaveBeenCalledWith('handleClusterLazyLoad', {
      tree,
      treeNode,
      resolve,
      callback: ctx.callbackOfLazyLoad
    })
  })

  it('callbackOfLazyLoad adds rows, toggles selection, and recalculates totals', () => {
    const toggleRowSelection = jest.fn()
    const addItemToClusteredItems = jest.fn()
    const calculateAllSelected = jest.fn()
    const ctx = {
      selectCheckboxesLazy: true,
      selectionCheckbox: false,
      initialData: [{ id: 1 }, { id: 2 }],
      totalLength: 0,
      addItemToClusteredItems,
      getTotalLength: jest.fn(() => 2),
      calculateAllSelected,
      $refs: { elTableRef: { toggleRowSelection } }
    }
    const rows = [{ id: 11 }, { id: 12 }]

    DataTable.methods.callbackOfLazyLoad.call(ctx, rows)

    expect(addItemToClusteredItems).toHaveBeenCalledTimes(2)
    expect(toggleRowSelection).toHaveBeenCalledWith(rows[0], true)
    expect(toggleRowSelection).toHaveBeenCalledWith(rows[1], true)
    expect(ctx.selectCheckboxesLazy).toBe(false)
    expect(ctx.totalLength).toBe(2)
    expect(calculateAllSelected).toHaveBeenCalledTimes(1)
  })

  it('handleExtendedViewEdit emits and resets selection only when api-wait is false', () => {
    const emit = jest.fn()
    const resetSelectableParams = jest.fn()
    const row = { id: 5 }
    const noWaitCtx = {
      excludedResourceIdList: ['x'],
      isSelectedAllEver: true,
      waitExtendedViewApi: false,
      resetSelectableParams,
      $emit: emit
    }

    DataTable.methods.handleExtendedViewEdit.call(noWaitCtx, row)
    expect(emit).toHaveBeenCalledWith('handleEdit', row, ['x'], true)
    expect(resetSelectableParams).toHaveBeenCalledTimes(1)

    const waitCtx = {
      excludedResourceIdList: [],
      isSelectedAllEver: false,
      waitExtendedViewApi: true,
      resetSelectableParams: jest.fn(),
      $emit: emit
    }
    DataTable.methods.handleExtendedViewEdit.call(waitCtx, row)
    expect(waitCtx.resetSelectableParams).not.toHaveBeenCalled()
  })

  it('resetSelectableParams clears selection state and table selection', () => {
    const clearSelection = jest.fn()
    const ctx = {
      multipleSelection: [{ id: 1 }],
      isSelectedAllEver: true,
      excludedResourceIdList: ['a'],
      serverSideSelectionCount: 3,
      clusteredItems: [{ id: 9 }],
      $refs: { elTableRef: { clearSelection } }
    }

    DataTable.methods.resetSelectableParams.call(ctx)

    expect(ctx.multipleSelection).toEqual([])
    expect(ctx.isSelectedAllEver).toBe(false)
    expect(ctx.excludedResourceIdList).toEqual([])
    expect(ctx.serverSideSelectionCount).toBe(0)
    expect(ctx.clusteredItems).toEqual([])
    expect(clearSelection).toHaveBeenCalledTimes(1)
  })

  it('handleExpandedRowChange updates existing item or appends new one', () => {
    const target = { id: 7 }
    const ctx = {
      expandedRows: [{ data: target, isExpanded: true }]
    }

    DataTable.methods.handleExpandedRowChange.call(ctx, target, false)
    expect(ctx.expandedRows).toEqual([{ data: target, isExpanded: false }])

    const next = { id: 8 }
    DataTable.methods.handleExpandedRowChange.call(ctx, next, true)
    expect(ctx.expandedRows).toEqual([
      { data: target, isExpanded: false },
      { data: next, isExpanded: true }
    ])
  })

  it('calculateExpandedRows toggles row expansion for tracked rows', () => {
    const toggleRowExpansion = jest.fn()
    const rowA = { id: 1 }
    const rowB = { id: 2 }
    const ctx = {
      expandedRows: [
        { data: rowA, isExpanded: true },
        { data: rowB, isExpanded: false }
      ],
      $refs: { elTableRef: { toggleRowExpansion } },
      $nextTick: (cb) => cb()
    }

    DataTable.methods.calculateExpandedRows.call(ctx)

    expect(toggleRowExpansion).toHaveBeenCalledWith(rowA, true)
    expect(toggleRowExpansion).toHaveBeenCalledWith(rowB, false)
  })
})
