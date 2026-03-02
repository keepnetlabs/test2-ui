jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchSmishingCampaignJobReport: jest.fn(),
    exportSmishingCampaignItems: jest.fn(),
    deleteSmishingCampaignItem: jest.fn(),
    stopSmishingCampaign: jest.fn(),
    startSmishingCampaign: jest.fn()
  }
}))

import CampaignManagerFrequencyTable from '@/components/SmishingCampaignManager/CampaignManagerFrequencyTable.vue'
import SmishingService from '@/api/smishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager/CampaignManagerFrequencyTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('TARGET_USERS_ITEM_TABLE column has type text — regression guard for Users column rendering', () => {
    // Bug: when type was 'slot', Users column showed Status badge instead of user count.
    expect(COLUMNS.TARGET_USERS_ITEM_TABLE.type).toBe('text')
    expect(COLUMNS.TARGET_USERS_ITEM_TABLE.property).toBe('totalTargetUserCount')
  })

  it('callForData queries with smishingCampaignFrequencyGroup and parentResourceId', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-1', status: 'Scheduled', totalTargetUserCount: 5 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      item: { frequencyGroup: 'fg-1' },
      parentResourceId: 'parent-1',
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(SmishingService.searchSmishingCampaignJobReport).toHaveBeenCalledWith(
      expect.objectContaining({ smishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].totalTargetUserCount).toBe(5)
  })

  it('callForData handles empty API response with defaults', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValue({
      data: { data: {} }
    })

    const ctx = {
      item: { frequencyGroup: 'fg-2' },
      parentResourceId: 'parent-2',
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.pageNumber).toBeUndefined()
  })

  it('handleOnDelete calls deleteSmishingCampaignItem, unselects row, and refreshes', async () => {
    SmishingService.deleteSmishingCampaignItem.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-1',
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn(),
      isDeleteDialogActionButtonDisabled: false
    }

    CampaignManagerFrequencyTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-1' })
    await flushPromises()

    expect(SmishingService.deleteSmishingCampaignItem).toHaveBeenCalledWith('parent-1', 'ig-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('handleStopCampaign calls stopSmishingCampaign with parentResourceId and refreshes', async () => {
    SmishingService.stopSmishingCampaign.mockResolvedValue({})
    const callForData = jest.fn()
    const toggleStopCampaignDialog = jest.fn()
    const ctx = {
      parentResourceId: 'parent-1',
      callForData,
      toggleStopCampaignDialog,
      isStopDialogActionButtonDisabled: false
    }

    CampaignManagerFrequencyTable.methods.handleStopCampaign.call(ctx, { instanceGroup: 'ig-stop' })
    await flushPromises()

    expect(SmishingService.stopSmishingCampaign).toHaveBeenCalledWith('parent-1', 'ig-stop')
    expect(callForData).toHaveBeenCalled()
    expect(toggleStopCampaignDialog).toHaveBeenCalled()
    expect(ctx.isStopDialogActionButtonDisabled).toBe(false)
  })

  it('handleLaunch calls startSmishingCampaign and refreshes', async () => {
    SmishingService.startSmishingCampaign.mockResolvedValue({})
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-1',
      callForData
    }

    CampaignManagerFrequencyTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-launch' })
    await flushPromises()

    expect(SmishingService.startSmishingCampaign).toHaveBeenCalledWith('parent-1', 'ig-launch')
    expect(callForData).toHaveBeenCalled()
  })

  it('watch statusItems maps filter values and re-renders', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => { obj[key] = val })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Scheduled' }])

    expect(col.filterableItems).toEqual([{ text: 'Scheduled', value: 'Scheduled' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('watch statusItems skips empty list', () => {
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [])

    expect(set).not.toHaveBeenCalled()
    expect(reRenderFilters).not.toHaveBeenCalled()
  })

  it('helper methods return correct values', () => {
    expect(
      CampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Error', jobResultMessage: 'fail' })
    ).toBe('fail')
    expect(
      CampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Running', jobResultMessage: 'x' })
    ).toBe('')
    expect(
      CampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Error' })
    ).toBe('')
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Error', jobResultMessage: 'x' })
    ).toBe(false)
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Scheduled' })
    ).toBe(true)
  })

  it('toggle dialog helpers work correctly', () => {
    const ctx = {
      isShowDeleteDialog: false,
      isShowStopDialog: false,
      selectedRow: { id: 1 },
      toggleShowDeleteDialog: CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog,
      toggleStopCampaignDialog: CampaignManagerFrequencyTable.methods.toggleStopCampaignDialog
    }

    CampaignManagerFrequencyTable.methods.handleDelete.call(ctx, { instanceGroup: 'ig-d' })
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-d' })
    expect(ctx.isShowDeleteDialog).toBe(true)

    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})

    CampaignManagerFrequencyTable.methods.handleStop.call(ctx, { instanceGroup: 'ig-s' })
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-s' })
    expect(ctx.isShowStopDialog).toBe(true)
  })

  it('handleBackClick emits on-back-click', () => {
    const emit = jest.fn()
    CampaignManagerFrequencyTable.methods.handleBackClick.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-back-click')
  })

  it('exportCampaignManagerItemList maps XLS to Excel and triggers download', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValue({ data: new Uint8Array([1]) })
    window.URL.createObjectURL = jest.fn(() => 'blob:smishing-freq')
    const link = { click: jest.fn(), href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(link)

    const ctx = {
      item: { frequencyGroup: 'fg-export' },
      parentResourceId: 'parent-export',
      axiosPayload: { orderBy: 'CreatedDate', ascending: false, filter: {} }
    }

    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        smishingCampaignFrequencyGroup: 'fg-export'
      }),
      'parent-export'
    )
    expect(link.download).toBe('Smishing-Campaign-Runs.xlsx')
    expect(link.click).toHaveBeenCalled()

    jest.restoreAllMocks()
  })

  it('exportCampaignManagerItemList maps CSV to csv extension', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValue({ data: new Uint8Array([1]) })
    window.URL.createObjectURL = jest.fn(() => 'blob:smishing-csv')
    const link = { click: jest.fn(), href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(link)

    const ctx = {
      item: { frequencyGroup: 'fg-csv' },
      parentResourceId: 'parent-csv',
      axiosPayload: { orderBy: 'CreatedDate', ascending: false, filter: {} }
    }

    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'parent-csv'
    )
    expect(link.download).toBe('Smishing-Campaign-Runs.csv')

    jest.restoreAllMocks()
  })

  it('statusItems watcher calls $set with undefined when status column is missing', () => {
    const set = jest.fn()
    const ctx = {
      tableOptions: { columns: [] },
      $set: set,
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])

    expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', expect.any(Array))
  })

  it('statusItems watcher handles missing refTable without throwing', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => { obj[key] = val })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }

    expect(() => {
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])
    }).not.toThrow()
  })

  it('handleOnAddButtonClick emits on-launch with parentResourceId', () => {
    const emit = jest.fn()
    CampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call({
      parentResourceId: 'parent-add',
      $emit: emit
    })
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'parent-add' })
  })

  it('getStatusBadgeProps delegates to utility helper', () => {
    const result = CampaignManagerFrequencyTable.methods.getStatusBadgeProps.call({}, 'Completed')
    expect(result).toEqual({ color: '#217124', text: 'Completed' })
  })
})
