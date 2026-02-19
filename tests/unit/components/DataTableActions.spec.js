import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue action methods', () => {
  it('handleDownloadButtonClick updates modal state and emits event', () => {
    const emit = jest.fn()
    const changeDownloadModalStatus = jest.fn()
    const ctx = {
      $emit: emit,
      changeDownloadModalStatus,
      isShowDownloadModal: false,
      downloadModalTitle: ''
    }

    DataTable.methods.handleDownloadButtonClick.call(ctx, 'Download All')

    expect(emit).toHaveBeenCalledWith('handleDownloadButtonClick')
    expect(ctx.isShowDownloadModal).toBe(true)
    expect(ctx.downloadModalTitle).toBe('Download All')
    expect(changeDownloadModalStatus).toHaveBeenCalledWith(true)
  })

  it('onEmptyBtnClicked emits configured action or fallback event', () => {
    const emit = jest.fn()
    const ctxWithAction = {
      empty: { action: 'on-create' },
      $emit: emit
    }
    DataTable.methods.onEmptyBtnClicked.call(ctxWithAction, { test: 1 })
    expect(emit).toHaveBeenCalledWith('on-create')

    const emitFallback = jest.fn()
    const payload = { key: 'value' }
    const ctxFallback = {
      empty: {},
      $emit: emitFallback
    }
    DataTable.methods.onEmptyBtnClicked.call(ctxFallback, payload)
    expect(emitFallback).toHaveBeenCalledWith('onEmptyBtnClicked', payload)
  })

  it('rowAct handles special actions and default emit path', () => {
    const emit = jest.fn()
    const push = jest.fn()
    const ctx = {
      $emit: emit,
      $router: { push },
      multipleSelection: [{ id: 1 }]
    }

    DataTable.methods.rowAct.call(ctx, 'details', { id: 11 })
    expect(push).toHaveBeenCalledWith('/analysis-details')

    DataTable.methods.rowAct.call(ctx, 'stopInvestigationFunc', { id: 12 })
    expect(emit).toHaveBeenCalledWith('stopInvestigationFunc', { row: { id: 12 } })

    DataTable.methods.rowAct.call(ctx, 'investigationDetails', { id: 13 })
    expect(emit).toHaveBeenCalledWith('investigationDetails', { row: { id: 13 } })

    DataTable.methods.rowAct.call(ctx, 'deleteAndNotifyInvestigationDetails', { id: 14 })
    expect(emit).toHaveBeenCalledWith('deleteAndNotifyInvestigationDetailsFunction', [{ id: 1 }])

    const scope = { raw: true }
    DataTable.methods.rowAct.call(ctx, 'syncUser', { id: 15 }, scope)
    expect(emit).toHaveBeenCalledWith('syncUser', scope)

    const ret = DataTable.methods.rowAct.call(ctx, 'custom-action', { id: 16 })
    expect(emit).toHaveBeenCalledWith('custom-action', { id: 16 })
    expect(ret).toBe(false)
  })

  it('rowAct deleteAndNotify falls back to row when selection is empty', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      $router: { push: jest.fn() },
      multipleSelection: []
    }

    const row = { id: 99 }
    DataTable.methods.rowAct.call(ctx, 'deleteAndNotifyInvestigationDetails', row)
    expect(emit).toHaveBeenCalledWith('deleteAndNotifyInvestigationDetailsFunction', row)
  })

  it('filter helpers emit expected events and mutate flags', () => {
    const emit = jest.fn()
    const del = jest.fn((obj, key) => delete obj[key])
    const ctx = {
      isSelectedAllEver: true,
      $emit: emit,
      $delete: del,
      filterValues: { status: 'open' }
    }

    DataTable.methods.handleFilterColumn.call(ctx, { field: 'status', value: 'open' })
    expect(ctx.isSelectedAllEver).toBe(false)
    expect(emit).toHaveBeenCalledWith('columnFilterChanged', { field: 'status', value: 'open' })

    ctx.isSelectedAllEver = true
    DataTable.methods.handleClearColumnFilter.call(ctx, 'status')
    expect(ctx.isSelectedAllEver).toBe(false)
    expect(del).toHaveBeenCalledWith(ctx.filterValues, 'status')
    expect(emit).toHaveBeenCalledWith('columnFilterCleared', 'status')
  })

  it('reRenderFilters and resetSearchText update local state', () => {
    const ctx = {
      filterValues: { old: true },
      filterKey: '',
      search: 'query'
    }

    DataTable.methods.reRenderFilters.call(ctx, { updated: true })
    expect(ctx.filterValues).toEqual({ updated: true })
    expect(ctx.filterKey.startsWith('filter-key-')).toBe(true)

    DataTable.methods.resetSearchText.call(ctx)
    expect(ctx.search).toBe('')
  })

  it('getServerSideSelectionParams returns params only when enabled', () => {
    const ctxEnabled = {
      isServerSideSelection: true,
      excludedResourceIdList: ['u1', 'u2'],
      isSelectedAllEver: true
    }
    expect(DataTable.methods.getServerSideSelectionParams.call(ctxEnabled)).toEqual({
      excludedResourceIdList: ['u1', 'u2'],
      isSelectedAllEver: true
    })

    const ctxDisabled = {
      isServerSideSelection: false,
      excludedResourceIdList: ['x'],
      isSelectedAllEver: true
    }
    expect(DataTable.methods.getServerSideSelectionParams.call(ctxDisabled)).toEqual({})
  })

  it('downloadEvent emits payload based on server-side pagination flag', () => {
    const emit = jest.fn()
    const ctxServerSide = {
      $emit: emit,
      serverSideEvents: { pagination: true },
      serverSideProps: { pageNumber: 3, pageSize: 50 },
      currentPage: 1,
      rowCount: 10,
      downloadModalTitle: 'Download All',
      downloadButtonOptions: ['Download Current Page', 'Download All']
    }
    DataTable.methods.downloadEvent.call(ctxServerSide, ['Csv'])
    expect(emit).toHaveBeenCalledWith('downloadEvent', {
      exportTypes: ['Csv'],
      pageNumber: 3,
      pageSize: 50,
      reportAllPages: true
    })

    const emitClient = jest.fn()
    const ctxClient = {
      $emit: emitClient,
      serverSideEvents: { pagination: false },
      serverSideProps: { pageNumber: 9, pageSize: 99 },
      currentPage: 2,
      rowCount: 25,
      downloadModalTitle: 'Download Current Page',
      downloadButtonOptions: ['Download Current Page', 'Download All']
    }
    DataTable.methods.downloadEvent.call(ctxClient, ['Pdf'])
    expect(emitClient).toHaveBeenCalledWith('downloadEvent', {
      exportTypes: ['Pdf'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: false
    })
  })

  it('changeServerSideSelectionCount never drops below zero', () => {
    const ctx = { serverSideSelectionCount: 2 }
    DataTable.methods.changeServerSideSelectionCount.call(ctx, -1)
    expect(ctx.serverSideSelectionCount).toBe(1)

    DataTable.methods.changeServerSideSelectionCount.call(ctx, -99)
    expect(ctx.serverSideSelectionCount).toBe(0)
  })

  it('findAndDeleteFromExcludedResourceIdList removes matching id only', () => {
    const ctx = { excludedResourceIdList: ['a', 'b', 'c'] }
    DataTable.methods.findAndDeleteFromExcludedResourceIdList.call(ctx, 'b')
    expect(ctx.excludedResourceIdList).toEqual(['a', 'c'])

    DataTable.methods.findAndDeleteFromExcludedResourceIdList.call(ctx, 'x')
    expect(ctx.excludedResourceIdList).toEqual(['a', 'c'])
  })

  it('tableRowClassName combines selected-row and custom class', () => {
    const ctx = {
      multipleSelection: [{ id: 1 }],
      addRowClassName: jest.fn(() => ' custom-row')
    }
    const className = DataTable.methods.tableRowClassName.call(ctx, { row: { id: 1 } })
    expect(className).toContain('selected-row')
    expect(className).toContain('custom-row')
  })

  it('handleSelectionChange emits and handles edit mode state', () => {
    const emit = jest.fn()
    const getServerSideSelectionParams = jest.fn(() => ({
      excludedResourceIdList: ['x'],
      isSelectedAllEver: true
    }))
    const handleMultipleSelectedEdits = jest.fn()
    const ctx = {
      multipleSelection: [],
      isWantToEditRow: true,
      isMultipleEdit: true,
      $emit: emit,
      getServerSideSelectionParams,
      handleMultipleSelectedEdits
    }

    DataTable.methods.handleSelectionChange.call(ctx, [{ id: 10 }])
    expect(ctx.multipleSelection).toEqual([{ id: 10 }])
    expect(emit).toHaveBeenCalledWith(
      'handleSelectionChange',
      [{ id: 10 }],
      ['x'],
      true
    )
    expect(handleMultipleSelectedEdits).toHaveBeenCalled()

    DataTable.methods.handleSelectionChange.call(ctx, [])
    expect(ctx.isWantToEditRow).toBe(false)
  })

  it('toggleToTheClusterIfChild toggles clustered child membership', () => {
    const child = { id: 1, isChild: true }
    const ctx = { clusteredItems: [] }

    DataTable.methods.toggleToTheClusterIfChild.call(ctx, child)
    expect(ctx.clusteredItems).toEqual([child])

    DataTable.methods.toggleToTheClusterIfChild.call(ctx, child)
    expect(ctx.clusteredItems).toEqual([])
  })

  it('selectChildrenByRowCheckbox recursively selects children without duplicates', () => {
    const toggleRowSelection = jest.fn()
    const addItemToClusteredItems = jest.fn()
    const child2 = { id: 2 }
    const child1 = { id: 1, children: [child2] }
    const selection = []

    const ctx = {
      $refs: { elTableRef: { toggleRowSelection } },
      addItemToClusteredItems
    }
    ctx.selectChildrenByRowCheckbox = DataTable.methods.selectChildrenByRowCheckbox

    DataTable.methods.selectChildrenByRowCheckbox.call(ctx, [child1], selection)
    expect(toggleRowSelection).toHaveBeenCalledWith(child2, true)
    expect(toggleRowSelection).toHaveBeenCalledWith(child1, true)
    expect(addItemToClusteredItems).toHaveBeenCalled()
    expect(selection).toEqual([child2, child1])
  })

  it('unSelectChildrenByRowCheckbox recursively unselects and removes from lists', () => {
    const toggleRowSelection = jest.fn()
    const child2 = { id: 2 }
    const child1 = { id: 1, children: [child2] }
    const selection = [child1, child2]
    const clusteredItems = [child1, child2]

    const ctx = {
      clusteredItems,
      $refs: { elTableRef: { toggleRowSelection } }
    }
    ctx.unSelectChildrenByRowCheckbox = DataTable.methods.unSelectChildrenByRowCheckbox

    DataTable.methods.unSelectChildrenByRowCheckbox.call(ctx, [child1], selection)
    expect(toggleRowSelection).toHaveBeenCalledWith(child2, false)
    expect(toggleRowSelection).toHaveBeenCalledWith(child1, false)
    expect(selection).toEqual([])
    expect(clusteredItems).toEqual([])
  })

  it('handleToggleOrLazyWhenCheckboxSelected triggers lazy load or expansion', () => {
    const loadOrToggle = jest.fn()
    const toggleRowExpansion = jest.fn()
    const ctx = {
      $refs: { elTableRef: { store: { loadOrToggle }, toggleRowExpansion } },
      selectCheckboxesLazy: false
    }

    const lazyRow = { hasChildren: true, children: [] }
    DataTable.methods.handleToggleOrLazyWhenCheckboxSelected.call(ctx, lazyRow, true)
    expect(loadOrToggle).toHaveBeenCalledWith(lazyRow)
    expect(ctx.selectCheckboxesLazy).toBe(true)

    const expandedRow = { hasChildren: true, children: [{ id: 1 }] }
    DataTable.methods.handleToggleOrLazyWhenCheckboxSelected.call(ctx, expandedRow, false)
    expect(toggleRowExpansion).toHaveBeenCalledWith(expandedRow, false)
  })

  it('changeDownloadModalStatus dispatches to store', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }
    DataTable.methods.changeDownloadModalStatus.call(ctx, true)
    expect(dispatch).toHaveBeenCalledWith('common/changeDownloadModalStatus', true)
  })

  it('toggleAll calls toggleAllSelection when checkbox is checked and not indeterminate', () => {
    const toggleAllSelection = jest.fn()
    const ctx = {
      selectionCheckbox: true,
      selectionRowCheckboxDeterminate: false,
      $refs: { elTableRef: { toggleAllSelection } }
    }

    DataTable.methods.toggleAll.call(ctx)
    expect(toggleAllSelection).toHaveBeenCalled()
  })

  it('toggleAll unselects currently selected rows in indeterminate mode', () => {
    const rowA = { id: 'a' }
    const toggleRowSelection = jest.fn()
    const ctx = {
      selectionCheckbox: true,
      selectionRowCheckboxDeterminate: true,
      showfilteredData: false,
      filteredData: [],
      tableData: [rowA],
      getAllItems: jest.fn(() => [rowA]),
      multipleSelection: [rowA],
      rowKey: 'id',
      $refs: { elTableRef: { toggleRowSelection } },
      isServerSide: true,
      isServerSideSelection: true,
      isSelectedAllEver: true,
      excludedResourceIdList: [],
      serverSideSelectionCount: 3
    }

    DataTable.methods.toggleAll.call(ctx)

    expect(toggleRowSelection).toHaveBeenCalledWith(rowA, false)
    expect(ctx.excludedResourceIdList).toEqual(['a'])
    expect(ctx.serverSideSelectionCount).toBe(2)
    expect(ctx.selectionCheckbox).toBe(false)
    expect(ctx.selectionRowCheckboxDeterminate).toBe(false)
  })

  it('toggleAll clears selection when checkbox is unchecked and no matching selected items', () => {
    const clearSelection = jest.fn()
    const tableData = [{ id: 'a' }, { id: 'b' }]
    const ctx = {
      selectionCheckbox: false,
      showfilteredData: false,
      filteredData: [],
      tableData,
      getAllItems: jest.fn(() => []),
      multipleSelection: [{ id: 'x' }],
      rowKey: 'id',
      $refs: { elTableRef: { clearSelection } },
      isServerSide: true,
      isServerSideSelection: true,
      isSelectedAllEver: true,
      excludedResourceIdList: [],
      serverSideSelectionCount: 5
    }

    DataTable.methods.toggleAll.call(ctx)

    expect(clearSelection).toHaveBeenCalled()
    expect(ctx.serverSideSelectionCount).toBe(3)
    expect(ctx.excludedResourceIdList).toEqual(['a', 'b'])
  })

  it('toggleAll unselects matched items when checkbox is unchecked with selected items', () => {
    const toggleRowSelection = jest.fn()
    const row = { id: '1' }
    const ctx = {
      selectionCheckbox: false,
      showfilteredData: false,
      filteredData: [],
      tableData: [row],
      multipleSelection: [row],
      getAllItems: jest.fn((items) => items),
      rowKey: 'id',
      $refs: { elTableRef: { toggleRowSelection } },
      isServerSide: false,
      isServerSideSelection: false,
      isSelectedAllEver: false
    }

    DataTable.methods.toggleAll.call(ctx)
    expect(toggleRowSelection).toHaveBeenCalledWith(row)
  })

  it('handleSelect updates server-side selection count for selected and unselected rows', () => {
    const findAndDeleteFromExcludedResourceIdList = jest.fn()
    const ctx = {
      isServerSide: true,
      isServerSideSelection: true,
      rowKey: 'id',
      serverSideSelectionCount: 0,
      excludedResourceIdList: [],
      isSelectedAllEver: true,
      groupable: false,
      findAndDeleteFromExcludedResourceIdList
    }
    const row = { id: 'u1' }

    DataTable.methods.handleSelect.call(ctx, [row], row)
    expect(ctx.serverSideSelectionCount).toBe(1)
    expect(findAndDeleteFromExcludedResourceIdList).toHaveBeenCalledWith('u1')

    DataTable.methods.handleSelect.call(ctx, [], row)
    expect(ctx.serverSideSelectionCount).toBe(0)
    expect(ctx.excludedResourceIdList).toEqual(['u1'])
  })

  it('clusterSelected updates selected cluster, clears selection and emits event', () => {
    const emit = jest.fn()
    const clearSelection = jest.fn()
    const ctx = {
      selectedCluster: '',
      multipleSelection: [{ id: 1 }],
      $emit: emit,
      $refs: { elTableRef: { clearSelection } }
    }

    DataTable.methods.clusterSelected.call(ctx, 'Department')

    expect(ctx.selectedCluster).toBe('Department')
    expect(ctx.multipleSelection).toEqual([])
    expect(emit).toHaveBeenCalledWith('clusterChanged', 'Department')
    expect(clearSelection).toHaveBeenCalled()
  })

  it('handleListBulletedClick resets cluster state and emits event', () => {
    const emit = jest.fn()
    const clearSelection = jest.fn()
    const ctx = {
      selectedCluster: 'X',
      multipleSelection: [{ id: 2 }],
      $emit: emit,
      $refs: { elTableRef: { clearSelection } }
    }

    DataTable.methods.handleListBulletedClick.call(ctx)

    expect(ctx.selectedCluster).toBe('')
    expect(ctx.multipleSelection).toEqual([])
    expect(emit).toHaveBeenCalledWith('handleListBulleted')
    expect(clearSelection).toHaveBeenCalled()
  })

  it('handleGroupedClick toggles grouped mode and clears selection', () => {
    const emit = jest.fn()
    const clearSelection = jest.fn()
    const ctx = {
      selectedCluster: '',
      multipleSelection: [{ id: 1 }],
      $emit: emit,
      $refs: { elTableRef: { clearSelection } }
    }

    DataTable.methods.handleGroupedClick.call(ctx)
    expect(ctx.selectedCluster).toBe('grouped')
    expect(emit).toHaveBeenCalledWith('handleGroupedClick')
    expect(ctx.multipleSelection).toEqual([])
    expect(clearSelection).toHaveBeenCalled()

    DataTable.methods.handleGroupedClick.call(ctx)
    expect(ctx.selectedCluster).toBe('')
    expect(emit).toHaveBeenCalledWith('handleListBulleted')
  })

  it('onClusterLeftClick calls grouped click only when cluster menu is hidden', () => {
    const handleGroupedClick = jest.fn()
    const ctxHidden = { showClusterMenu: false, handleGroupedClick }
    DataTable.methods.onClusterLeftClick.call(ctxHidden)
    expect(handleGroupedClick).toHaveBeenCalled()

    const handleGroupedClick2 = jest.fn()
    const ctxShown = { showClusterMenu: true, handleGroupedClick: handleGroupedClick2 }
    DataTable.methods.onClusterLeftClick.call(ctxShown)
    expect(handleGroupedClick2).not.toHaveBeenCalled()
  })

  it('isEqualCluster compares cluster names', () => {
    const ctx = { selectedCluster: 'Department' }
    expect(DataTable.methods.isEqualCluster.call(ctx, 'Department')).toBe(true)
    expect(DataTable.methods.isEqualCluster.call(ctx, 'Role')).toBe(false)
  })

  it('handleEdit updates selection, emits edit payload and opens edit state', () => {
    const emit = jest.fn()
    const toggleRowSelection = jest.fn()
    const findAndDeleteFromExcludedResourceIdList = jest.fn()
    const row = { id: 'r1' }
    const ctx = {
      isMultipleEdit: true,
      extendedViewStyle: {},
      isServerSide: true,
      isServerSideSelection: true,
      rowKey: 'id',
      multipleSelection: [],
      serverSideSelectionCount: 0,
      findAndDeleteFromExcludedResourceIdList,
      $refs: { elTableRef: { toggleRowSelection } },
      $emit: emit,
      isWantToEditRow: false,
      isSettingsOpened: true
    }

    DataTable.methods.handleEdit.call(ctx, row, 2)

    expect(ctx.isMultipleEdit).toBe(false)
    expect(ctx.extendedViewStyle).toEqual({ top: '96px' })
    expect(findAndDeleteFromExcludedResourceIdList).toHaveBeenCalledWith('r1')
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

  it('handleEdit supports array selections payload', () => {
    const emit = jest.fn()
    const toggleRowSelection = jest.fn()
    const arr = [{ id: 1 }, { id: 2 }]
    const ctx = {
      isMultipleEdit: false,
      extendedViewStyle: {},
      isServerSide: false,
      isServerSideSelection: false,
      rowKey: 'id',
      multipleSelection: [],
      $refs: { elTableRef: { toggleRowSelection } },
      $emit: emit,
      isWantToEditRow: false,
      isSettingsOpened: false
    }

    DataTable.methods.handleEdit.call(ctx, arr, -1)
    expect(emit).toHaveBeenCalledWith('onEditClick', {
      selected: arr,
      isEditPopupOpen: true
    })
  })

  it('handleDelete emits correct event shape in different modes', () => {
    const emit = jest.fn()
    const getServerSideSelectionParams = jest.fn(() => ({
      excludedResourceIdList: ['x'],
      isSelectedAllEver: true
    }))

    const ctxInvestigation = {
      refName: 'investigationDetailsListTable',
      isServerSideSelection: false,
      multipleSelection: [],
      $emit: emit,
      getServerSideSelectionParams
    }
    DataTable.methods.handleDelete.call(ctxInvestigation, [{ id: 1 }])
    expect(emit).toHaveBeenCalledWith(
      'deleteInvestigationDetails',
      [{ id: 1 }],
      ['x'],
      true
    )

    const emit2 = jest.fn()
    const ctxServer = {
      refName: '',
      isServerSideSelection: true,
      multipleSelection: [],
      $emit: emit2,
      getServerSideSelectionParams
    }
    DataTable.methods.handleDelete.call(ctxServer, [{ id: 2 }])
    expect(emit2).toHaveBeenCalledWith('handleMultipleDelete', [{ id: 2 }], ['x'], true)

    const emit3 = jest.fn()
    const ctxClient = {
      refName: '',
      isServerSideSelection: false,
      multipleSelection: [{ id: 3 }],
      $emit: emit3,
      getServerSideSelectionParams
    }
    DataTable.methods.handleDelete.call(ctxClient, [{ id: 4 }])
    expect(emit3).toHaveBeenCalledWith('handleMultipleDelete', [{ id: 3 }])
  })

  it('handleWarning and handleResend emit with server-side selection params', () => {
    const emit = jest.fn()
    const getServerSideSelectionParams = jest.fn(() => ({
      excludedResourceIdList: ['x'],
      isSelectedAllEver: false
    }))
    const ctx = { $emit: emit, getServerSideSelectionParams }
    const rows = [{ id: 7 }]

    DataTable.methods.handleWarning.call(ctx, rows)
    expect(emit).toHaveBeenCalledWith(
      'sendInvestigationDetailsWarningMessage',
      rows,
      ['x'],
      false
    )

    DataTable.methods.handleResend.call(ctx, rows)
    expect(emit).toHaveBeenCalledWith('on-resend', rows, ['x'], false)
  })

  it('handleDeleteAndNotify delegates to rowAct', () => {
    const rowAct = jest.fn()
    const ctx = { rowAct }
    const selections = [{ id: 8 }]

    DataTable.methods.handleDeleteAndNotify.call(ctx, selections)
    expect(rowAct).toHaveBeenCalledWith('deleteAndNotifyInvestigationDetails', selections)
  })

  it('setStoredTableSettings applies defaults when fixed flags are false', () => {
    const setRenderedColumns = jest.fn()
    const ctx = {
      firstColFixed: true,
      lastColFixed: true,
      actionFixed: true,
      columns: [{ property: 'a', fixed: 'left', show: true }],
      renderedColumns: ['a'],
      setRenderedColumns
    }

    DataTable.methods.setStoredTableSettings.call(ctx, {
      firstColFixed: false,
      lastColFixed: false,
      renderedColumns: []
    })

    expect(ctx.firstColFixed).toBe(false)
    expect(ctx.lastColFixed).toBe(false)
    expect(ctx.actionFixed).toBe(false)
    expect(ctx.columns[0].fixed).toBe(false)
    expect(setRenderedColumns).toHaveBeenCalled()
  })

  it('setStoredTableSettings updates visible columns from renderedColumns list', () => {
    const ctx = {
      firstColFixed: false,
      lastColFixed: false,
      actionFixed: false,
      columns: [
        { property: 'a', show: true },
        { property: 'b', show: true }
      ],
      renderedColumns: [],
      setRenderedColumns: jest.fn()
    }

    DataTable.methods.setStoredTableSettings.call(ctx, {
      firstColFixed: true,
      lastColFixed: true,
      renderedColumns: ['b']
    })

    expect(ctx.columns[0].show).toBeUndefined()
    expect(ctx.columns[1].show).toBe('b')
    expect(ctx.renderedColumns).toEqual(['b'])
  })

  it('clustered item helpers add/delete without duplicates', () => {
    const row = { id: 1 }
    const ctx = { clusteredItems: [] }
    DataTable.methods.addItemToClusteredItems.call(ctx, row)
    DataTable.methods.addItemToClusteredItems.call(ctx, row)
    expect(ctx.clusteredItems).toEqual([row])

    DataTable.methods.deleteItemFromClusteredItems.call(ctx, row)
    expect(ctx.clusteredItems).toEqual([])
  })

  it('calculateLength and getTotalLength compute nested lengths', () => {
    const data = [{ id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }]
    const ctx = {}
    ctx.calculateLength = DataTable.methods.calculateLength
    expect(DataTable.methods.calculateLength.call(ctx, data)).toBe(4)
    expect(DataTable.methods.getTotalLength.call(ctx, data)).toBe(4)
  })

  it('closeEditPopup resets flag and emits update event', () => {
    const emit = jest.fn()
    const ctx = { isWantToEditRow: true, $emit: emit }
    DataTable.methods.closeEditPopup.call(ctx)
    expect(ctx.isWantToEditRow).toBe(false)
    expect(emit).toHaveBeenCalledWith('update:is-show-extended-view-with-external-value', false)
  })

  it('server-side pagination emitters forward page and size', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }
    DataTable.methods.handleServerSideCurrentChange.call(ctx, 7)
    DataTable.methods.handleServerSideSizeChange.call(ctx, 25)
    expect(emit).toHaveBeenCalledWith('server-side-page-number-changed', 7)
    expect(emit).toHaveBeenCalledWith('server-side-size-changed', 25)
  })

  it('handleSizeChange updates rows and emits onSizeChanged', () => {
    const emit = jest.fn()
    const calculateAllSelected = jest.fn()
    const ctx = {
      rowCount: 10,
      currentPage: 1,
      initialData: [{ id: 1 }, { id: 2 }, { id: 3 }],
      tableData: [],
      $emit: emit,
      calculateAllSelected
    }

    DataTable.methods.handleSizeChange.call(ctx, 2)
    expect(ctx.rowCount).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }, { id: 2 }])
    expect(emit).toHaveBeenCalledWith('onSizeChanged')
    expect(calculateAllSelected).toHaveBeenCalled()
  })

  it('handleCurrentChange and filtered pagination methods update slices', () => {
    const calculateAllSelected = jest.fn()
    const emit = jest.fn()
    const ctx = {
      currentPage: 1,
      rowCount: 2,
      initialData: [{ id: 1 }, { id: 2 }, { id: 3 }],
      tableData: [],
      unRenderedFilterData: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      filteredData: [],
      $emit: emit,
      calculateAllSelected
    }

    DataTable.methods.handleCurrentChange.call(ctx, 2)
    expect(ctx.currentPage).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 3 }])
    expect(emit).toHaveBeenCalledWith('onPageChanged')

    DataTable.methods.handleFilteredCurrentChange.call(ctx, 1)
    expect(ctx.filteredData).toEqual([{ id: 'a' }, { id: 'b' }])

    ctx.currentPage = 2
    DataTable.methods.handleFilteredSizeChange.call(ctx, 1)
    expect(ctx.rowCount).toBe(1)
    expect(ctx.filteredData).toEqual([{ id: 'b' }])
  })

  it('handleSettingsPopupClickOutside closes settings when eligible', () => {
    const ctxClosed = { isSettingsOpened: false, isFirstOpenSettings: false }
    DataTable.methods.handleSettingsPopupClickOutside.call(ctxClosed)
    expect(ctxClosed.isSettingsOpened).toBe(false)

    const ctxFirstOpen = { isSettingsOpened: true, isFirstOpenSettings: true }
    DataTable.methods.handleSettingsPopupClickOutside.call(ctxFirstOpen)
    expect(ctxFirstOpen.isSettingsOpened).toBe(true)

    const ctxNormal = { isSettingsOpened: true, isFirstOpenSettings: false }
    DataTable.methods.handleSettingsPopupClickOutside.call(ctxNormal)
    expect(ctxNormal.isSettingsOpened).toBe(false)
  })

  it('getAllItems flattens nested rows and manages clustered items hooks', () => {
    const addItemToClusteredItems = jest.fn()
    const deleteItemFromClusteredItems = jest.fn()
    const ctx = {
      addItemToClusteredItems,
      deleteItemFromClusteredItems
    }
    ctx.getAllItems = DataTable.methods.getAllItems
    const data = [
      { id: 1, isChild: true, children: [{ id: 2 }, { id: 3, isChild: true }] }
    ]

    const flattened = DataTable.methods.getAllItems.call(ctx, data, [], true, true)

    expect(flattened.map((x) => x.id)).toEqual([2, 3, 1])
    expect(addItemToClusteredItems).toHaveBeenCalled()
    expect(deleteItemFromClusteredItems).toHaveBeenCalled()
  })

  it('selectAllItems selects flattened initial data', () => {
    const toggleRowSelection = jest.fn()
    const initialData = [{ id: 1 }, { id: 2 }]
    const ctx = {
      initialData,
      multipleSelection: [],
      $refs: { elTableRef: { toggleRowSelection } },
      getAllItems: jest.fn((arr) => arr)
    }

    DataTable.methods.selectAllItems.call(ctx)
    expect(ctx.multipleSelection).toEqual(initialData)
    expect(toggleRowSelection).toHaveBeenCalledWith({ id: 1 }, true)
    expect(toggleRowSelection).toHaveBeenCalledWith({ id: 2 }, true)
  })

  it('handleSelectButtonClick server-side toggles all selected state', () => {
    const clearSelection = jest.fn()
    const emit = jest.fn()
    const selectAllItems = jest.fn()
    const ctx = {
      isServerSide: true,
      isSelectedAll: false,
      serverSideProps: { totalNumberOfRecords: 10 },
      rowCount: 5,
      isSelectedAllEver: false,
      selectAllItems,
      excludedResourceIdList: ['x'],
      serverSideSelectionCount: 0,
      multipleSelection: [{ id: 1 }],
      clusteredItems: [{ id: 1 }],
      $refs: { elTableRef: { clearSelection } },
      $emit: emit
    }

    DataTable.methods.handleSelectButtonClick.call(ctx)
    expect(ctx.isSelectedAll).toBe(true)
    expect(ctx.isSelectedAllEver).toBe(true)
    expect(ctx.excludedResourceIdList).toEqual([])
    expect(ctx.serverSideSelectionCount).toBe(10)
    expect(selectAllItems).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-selected-all-click')

    DataTable.methods.handleSelectButtonClick.call(ctx)
    expect(ctx.isSelectedAll).toBe(false)
    expect(ctx.isSelectedAllEver).toBe(false)
    expect(ctx.serverSideSelectionCount).toBe(0)
    expect(ctx.multipleSelection).toEqual([])
    expect(ctx.clusteredItems).toEqual([])
    expect(clearSelection).toHaveBeenCalled()
  })

  it('handleSelectButtonClick client-side toggles without server counters', () => {
    const clearSelection = jest.fn()
    const selectAllItems = jest.fn()
    const ctx = {
      isServerSide: false,
      isSelectedAll: false,
      multipleSelection: [{ id: 1 }],
      clusteredItems: [{ id: 1 }],
      selectAllItems,
      $refs: { elTableRef: { clearSelection } }
    }

    DataTable.methods.handleSelectButtonClick.call(ctx)
    expect(ctx.isSelectedAll).toBe(true)
    expect(selectAllItems).toHaveBeenCalled()

    DataTable.methods.handleSelectButtonClick.call(ctx)
    expect(ctx.isSelectedAll).toBe(false)
    expect(ctx.multipleSelection).toEqual([])
    expect(ctx.clusteredItems).toEqual([])
    expect(clearSelection).toHaveBeenCalled()
  })
})
