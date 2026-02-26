import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue (more branch coverage)', () => {
  it('changeServerSideSelectionCount never drops below zero', () => {
    const ctx = { serverSideSelectionCount: 1 }

    DataTable.methods.changeServerSideSelectionCount.call(ctx, -3)
    expect(ctx.serverSideSelectionCount).toBe(0)

    DataTable.methods.changeServerSideSelectionCount.call(ctx, 5)
    expect(ctx.serverSideSelectionCount).toBe(5)
  })

  it('handleToggleOrLazyWhenCheckboxSelected uses loadOrToggle for lazy rows', () => {
    const loadOrToggle = jest.fn()
    const toggleRowExpansion = jest.fn()
    const ctx = {
      $refs: {
        elTableRef: {
          store: { loadOrToggle },
          toggleRowExpansion
        }
      },
      selectCheckboxesLazy: false
    }

    DataTable.methods.handleToggleOrLazyWhenCheckboxSelected.call(
      ctx,
      { hasChildren: true, children: [] },
      true
    )

    expect(loadOrToggle).toHaveBeenCalled()
    expect(ctx.selectCheckboxesLazy).toBe(true)
    expect(toggleRowExpansion).not.toHaveBeenCalled()
  })

  it('handleToggleOrLazyWhenCheckboxSelected toggles expansion when children exist', () => {
    const loadOrToggle = jest.fn()
    const toggleRowExpansion = jest.fn()
    const row = { hasChildren: true, children: [{ id: 1 }] }
    const ctx = {
      $refs: {
        elTableRef: {
          store: { loadOrToggle },
          toggleRowExpansion
        }
      }
    }

    DataTable.methods.handleToggleOrLazyWhenCheckboxSelected.call(ctx, row, false)

    expect(toggleRowExpansion).toHaveBeenCalledWith(row, false)
    expect(loadOrToggle).not.toHaveBeenCalled()
  })

  it('toggleToTheClusterIfChild adds/removes only child rows', () => {
    const row = { id: 1, isChild: true }
    const parent = { id: 2, isChild: false }
    const ctx = { clusteredItems: [] }

    DataTable.methods.toggleToTheClusterIfChild.call(ctx, row)
    expect(ctx.clusteredItems).toEqual([row])

    DataTable.methods.toggleToTheClusterIfChild.call(ctx, row)
    expect(ctx.clusteredItems).toEqual([])

    DataTable.methods.toggleToTheClusterIfChild.call(ctx, parent)
    expect(ctx.clusteredItems).toEqual([])
  })

  it('handleFilterColumn and handleClearColumnFilter emit and reset selection state', () => {
    const emit = jest.fn()
    const del = jest.fn((obj, key) => {
      delete obj[key]
    })
    const ctx = {
      isSelectedAllEver: true,
      filterValues: { Status: 'Active', Type: 'User' },
      $emit: emit,
      $delete: del
    }

    DataTable.methods.handleFilterColumn.call(ctx, { field: 'status' })
    expect(ctx.isSelectedAllEver).toBe(false)
    expect(emit).toHaveBeenCalledWith('columnFilterChanged', { field: 'status' })

    DataTable.methods.handleClearColumnFilter.call(ctx, 'Status')
    expect(ctx.filterValues).toEqual({ Type: 'User' })
    expect(emit).toHaveBeenCalledWith('columnFilterCleared', 'Status')
  })

  it('reRenderFilters updates key and optionally overrides filterValues', () => {
    const ctx = {
      filterValues: { old: true },
      filterKey: 'old-key'
    }

    DataTable.methods.reRenderFilters.call(ctx)
    expect(ctx.filterKey.startsWith('filter-key-')).toBe(true)
    expect(ctx.filterValues).toEqual({ old: true })

    DataTable.methods.reRenderFilters.call(ctx, { next: true })
    expect(ctx.filterValues).toEqual({ next: true })
    expect(ctx.filterKey.startsWith('filter-key-')).toBe(true)
  })

  it('resetSearchText clears search input state', () => {
    const ctx = { search: 'john' }
    DataTable.methods.resetSearchText.call(ctx)
    expect(ctx.search).toBe('')
  })

  it('rowAct emits stop/investigation actions and delete-notify fallback row', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      multipleSelection: []
    }
    const row = { id: 9 }

    DataTable.methods.rowAct.call(ctx, 'stopInvestigationFunc', row)
    DataTable.methods.rowAct.call(ctx, 'investigationDetails', row)
    DataTable.methods.rowAct.call(ctx, 'deleteAndNotifyInvestigationDetails', row)

    expect(emit).toHaveBeenCalledWith('stopInvestigationFunc', { row })
    expect(emit).toHaveBeenCalledWith('investigationDetails', { row })
    expect(emit).toHaveBeenCalledWith('deleteAndNotifyInvestigationDetailsFunction', row)
  })

  it('handleDelete branches by refName and server-side selection', () => {
    const emit = jest.fn()
    const ctxRefName = {
      refName: 'investigationDetailsListTable',
      isServerSideSelection: false,
      multipleSelection: [{ id: 1 }],
      getServerSideSelectionParams: () => ({ excludedResourceIdList: ['x'], isSelectedAllEver: true }),
      $emit: emit
    }
    DataTable.methods.handleDelete.call(ctxRefName, [{ id: 8 }])

    const ctxServerSide = {
      refName: 'other',
      isServerSideSelection: true,
      multipleSelection: [{ id: 2 }],
      getServerSideSelectionParams: () => ({ excludedResourceIdList: ['y'], isSelectedAllEver: false }),
      $emit: emit
    }
    DataTable.methods.handleDelete.call(ctxServerSide, [{ id: 7 }])

    const ctxClient = {
      refName: 'other',
      isServerSideSelection: false,
      multipleSelection: [{ id: 3 }],
      getServerSideSelectionParams: () => ({}),
      $emit: emit
    }
    DataTable.methods.handleDelete.call(ctxClient, [{ id: 6 }])

    expect(emit).toHaveBeenCalledWith(
      'deleteInvestigationDetails',
      [{ id: 8 }],
      ['x'],
      true
    )
    expect(emit).toHaveBeenCalledWith(
      'handleMultipleDelete',
      [{ id: 7 }],
      ['y'],
      false
    )
    expect(emit).toHaveBeenCalledWith('handleMultipleDelete', [{ id: 3 }])
  })

  it('handleWarning and handleResend emit selection with server-side params', () => {
    const emit = jest.fn()
    const ctx = {
      getServerSideSelectionParams: () => ({
        excludedResourceIdList: ['u1'],
        isSelectedAllEver: true
      }),
      $emit: emit
    }
    const selections = [{ id: 1 }]

    DataTable.methods.handleWarning.call(ctx, selections)
    DataTable.methods.handleResend.call(ctx, selections)

    expect(emit).toHaveBeenCalledWith(
      'sendInvestigationDetailsWarningMessage',
      selections,
      ['u1'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', selections, ['u1'], true)
  })

  it('unSelectRow safely toggles row selection off when table ref exists', () => {
    const toggleRowSelection = jest.fn()
    const ctx = { $refs: { elTableRef: { toggleRowSelection } } }
    const row = { id: 3 }

    DataTable.methods.unSelectRow.call(ctx, row)

    expect(toggleRowSelection).toHaveBeenCalledWith(row, false)
  })

  it('changeDownloadModalStatus dispatches store action', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch }
    }

    DataTable.methods.changeDownloadModalStatus.call(ctx, true)

    expect(dispatch).toHaveBeenCalledWith('common/changeDownloadModalStatus', true)
  })

  it('handleEdit sets edit mode and emits payload when one row is selected', () => {
    const emit = jest.fn()
    const toggleRowSelection = jest.fn()
    const ctx = {
      isMultipleEdit: true,
      isServerSide: true,
      isServerSideSelection: true,
      rowKey: 'id',
      multipleSelection: [],
      findAndDeleteFromExcludedResourceIdList: jest.fn(),
      serverSideSelectionCount: 0,
      isWantToEditRow: false,
      isSettingsOpened: true,
      $refs: { elTableRef: { toggleRowSelection } },
      $emit: emit
    }
    const row = { id: 'u-1' }

    DataTable.methods.handleEdit.call(ctx, row, 2)

    expect(ctx.findAndDeleteFromExcludedResourceIdList).toHaveBeenCalledWith('u-1')
    expect(ctx.serverSideSelectionCount).toBe(1)
    expect(ctx.multipleSelection).toEqual([row])
    expect(toggleRowSelection).toHaveBeenCalledWith(row, true)
    expect(emit).toHaveBeenCalledWith('onEditClick', {
      selected: [row],
      isEditPopupOpen: true
    })
    expect(ctx.isWantToEditRow).toBe(true)
    expect(ctx.isSettingsOpened).toBe(false)
  })

  it('handleEdit with falsy selection does not emit edit payload', () => {
    const emit = jest.fn()
    const ctx = {
      isMultipleEdit: false,
      isServerSide: false,
      isServerSideSelection: false,
      multipleSelection: [],
      $refs: { elTableRef: { toggleRowSelection: jest.fn() } },
      $emit: emit
    }

    DataTable.methods.handleEdit.call(ctx, null)

    expect(emit).not.toHaveBeenCalledWith('onEditClick', expect.anything())
  })

  it('handleDownload is a safe no-op', () => {
    expect(() => DataTable.methods.handleDownload.call({}, ['CSV'])).not.toThrow()
  })
})
