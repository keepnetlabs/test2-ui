jest.mock('element-ui/lib/locale', () => ({
  use: jest.fn()
}))

import locale from 'element-ui/lib/locale'
import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue computed/watch extra coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rowsPerPageText and actionsLabel return dashboard labels or defaults', () => {
    expect(
      DataTable.computed.rowsPerPageText.call({
        dashboardLabels: { dataTableRowsPerPage: 'Rows' }
      })
    ).toBe('Rows')
    expect(DataTable.computed.rowsPerPageText.call({ dashboardLabels: null })).toBe('Rows per page:')

    expect(
      DataTable.computed.actionsLabel.call({
        dashboardLabels: { dataTableActions: 'Acts' }
      })
    ).toBe('Acts')
    expect(DataTable.computed.actionsLabel.call({ dashboardLabels: null })).toBe('Actions')
  })

  it('shouldRenderTable reflects data/filter/loading combinations', () => {
    expect(
      DataTable.computed.shouldRenderTable.call({
        tableData: [],
        isColumnFilterActive: false,
        loading: false
      })
    ).toBe(false)
    expect(
      DataTable.computed.shouldRenderTable.call({
        tableData: [],
        isColumnFilterActive: true,
        loading: false
      })
    ).toBe(true)
    expect(
      DataTable.computed.shouldRenderTable.call({
        tableData: [{ id: 1 }],
        isColumnFilterActive: false,
        loading: false
      })
    ).toBe(1)
  })

  it('isColumnFilterActive checks parent-managed state and payload filter values', () => {
    expect(
      DataTable.computed.isColumnFilterActive.call({
        manageColumnFilterStatusFromParent: { status: true }
      })
    ).toBe(true)

    expect(
      DataTable.computed.isColumnFilterActive.call({
        manageColumnFilterStatusFromParent: null,
        axiosPayload: {
          filter: {
            FilterGroups: [
              { FilterItems: [] },
              { FilterItems: [{ Value: '' }, { value: '' }] }
            ]
          }
        }
      })
    ).toBe(false)

    expect(
      DataTable.computed.isColumnFilterActive.call({
        manageColumnFilterStatusFromParent: null,
        axiosPayload: {
          filter: {
            FilterGroups: [
              { FilterItems: [{ FieldName: 'Name', Value: 'A' }] },
              { FilterItems: [] }
            ]
          }
        }
      })
    ).toBe(true)
  })

  it('select-all and table-data computed branches work for server/client modes', () => {
    expect(
      DataTable.computed.isRenderSelectAllButton.call({
        isServerSideSelection: true,
        search: '',
        isSearchActive: false
      })
    ).toBe(true)
    expect(
      DataTable.computed.isRenderSelectAllButton.call({
        isServerSideSelection: true,
        search: 'abc',
        isSearchActive: false
      })
    ).toBe(false)
    expect(
      DataTable.computed.isRenderSelectAllButton.call({
        isServerSideSelection: false,
        isServerSide: false
      })
    ).toBe(true)

    expect(
      DataTable.computed.getTableData.call({
        isServerSide: true,
        tableData: [{ id: 1 }],
        showfilteredData: true,
        filteredData: [{ id: 2 }]
      })
    ).toEqual([{ id: 1 }])
    expect(
      DataTable.computed.getTableData.call({
        isServerSide: false,
        tableData: [{ id: 1 }],
        showfilteredData: true,
        filteredData: [{ id: 2 }]
      })
    ).toEqual([{ id: 2 }])
  })

  it('selection computed values use server/client counts and flags', () => {
    expect(
      DataTable.computed.getSelectionText.call({
        isServerSide: true,
        isServerSideSelection: true,
        serverSideSelectionCount: 5,
        multipleSelection: [],
        isSelectedAll: false
      })
    ).toBe('5 item(s) selected')

    expect(
      DataTable.computed.getSelectionText.call({
        isServerSide: false,
        isServerSideSelection: false,
        serverSideSelectionCount: 0,
        multipleSelection: [{}, {}],
        isSelectedAll: true
      })
    ).toBe('All selected')

    expect(
      DataTable.computed.getSelectionButtonText.call({
        isSelectedAll: false,
        isServerSide: true,
        serverSideProps: { totalNumberOfRecords: 42 }
      })
    ).toBe('Select all 42 item(s)')

    expect(
      DataTable.computed.getSelectionButtonText.call({
        isSelectedAll: true,
        isServerSide: false,
        groupable: false,
        initialData: [{}, {}, {}]
      })
    ).toBe('Unselect all 3 item(s)')
  })

  it('getSelectionCheckboxDisabledValue depends on filtered data visibility', () => {
    expect(
      DataTable.computed.getSelectionCheckboxDisabledValue.call({
        showfilteredData: true,
        filteredData: []
      })
    ).toBe(true)
    expect(
      DataTable.computed.getSelectionCheckboxDisabledValue.call({
        showfilteredData: true,
        filteredData: [{ id: 1 }]
      })
    ).toBe(false)
    expect(
      DataTable.computed.getSelectionCheckboxDisabledValue.call({
        showfilteredData: false,
        filteredData: []
      })
    ).toBe(false)
  })

  it('watch.getSelectionText emits current selection count', () => {
    const emit = jest.fn()
    DataTable.watch.getSelectionText.call({
      isServerSide: false,
      isServerSideSelection: false,
      multipleSelection: [{}, {}, {}],
      serverSideSelectionCount: 0,
      $emit: emit
    })
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 3)
  })

  it('watch.firstColFixed and watch.lastColFixed update fixed values', () => {
    const ctx = {
      columns: [{ fixed: 'left' }, { fixed: false }],
      firstColFixed: true,
      $refs: {
        elTableRef: { columns: [{ fixed: true }] }
      }
    }
    DataTable.watch.firstColFixed.call(ctx, false)
    expect(ctx.columns[0].fixed).toBe(false)
    expect(ctx.firstColFixed).toBe(false)
    expect(ctx.$refs.elTableRef.columns[0].fixed).toBe(false)

    DataTable.watch.firstColFixed.call(ctx, true)
    expect(ctx.columns[0].fixed).toBe('left')
    expect(ctx.firstColFixed).toBe(true)
    expect(ctx.$refs.elTableRef.columns[0].fixed).toBe(true)

    const lastCtx = { actionFixed: 'right' }
    DataTable.watch.lastColFixed.call(lastCtx, false)
    expect(lastCtx.actionFixed).toBe(false)
    DataTable.watch.lastColFixed.call(lastCtx, true)
    expect(lastCtx.actionFixed).toBe('right')
  })

  it('watch.columns.handler updates rendered columns and allHidden flag', () => {
    const ctx = {
      setRenderedColumns: jest.fn(),
      allHidden: false
    }
    DataTable.watch.columns.handler.call(ctx, [{ show: false }, { show: false }])
    expect(ctx.setRenderedColumns).toHaveBeenCalled()
    expect(ctx.allHidden).toBe(true)

    DataTable.watch.columns.handler.call(ctx, [{ show: false }, { show: true }])
    expect(ctx.allHidden).toBe(false)
  })

  it('watch.currentLanguage sets Element locale and falls back for unknown language', () => {
    DataTable.watch.currentLanguage.call({}, 'tr-TR')
    expect(locale.use).toHaveBeenCalledTimes(1)

    DataTable.watch.currentLanguage.call({}, 'xx-XX')
    expect(locale.use).toHaveBeenCalledTimes(2)
  })
})
