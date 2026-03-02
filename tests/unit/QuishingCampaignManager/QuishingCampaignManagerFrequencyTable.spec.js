jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignQuishingJob: jest.fn(),
    exportCampaignManagerItem: jest.fn(),
    deleteQuishingCampaignJob: jest.fn(),
    stopQuishingCampaignJob: jest.fn(),
    launchQuishingCampaignInstanceGroup: jest.fn()
  }
}))

jest.mock('@/components/Common/Simulator/utils', () => ({
  SCENARIO_TYPES: { QUISHING: 'quishing' }
}))

import QuishingCampaignManagerFrequencyTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerFrequencyTable.vue'
import QuishingService from '@/api/quishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManager/QuishingCampaignManagerFrequencyTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('TARGET_USERS_ITEM_TABLE column has type text — regression guard for Users column rendering', () => {
    // Bug: when type was 'slot', Users column showed Status badge instead of user count.
    expect(COLUMNS.TARGET_USERS_ITEM_TABLE.type).toBe('text')
    expect(COLUMNS.TARGET_USERS_ITEM_TABLE.property).toBe('totalTargetUserCount')
  })

  it('callForData queries with phishingCampaignFrequencyGroup and parentResourceId', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-1', status: 'Scheduled', totalTargetUserCount: 8 }],
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

    QuishingCampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignQuishingJob).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].totalTargetUserCount).toBe(8)
  })

  it('callForData handles empty API response with defaults', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValue({
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

    QuishingCampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.pageNumber).toBeUndefined()
  })

  it('handleOnDelete calls deleteQuishingCampaignJob with parentResourceId, unselects row, and refreshes', async () => {
    QuishingService.deleteQuishingCampaignJob.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-1',
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn(),
      isDeleteDialogActionButtonDisabled: false
    }

    QuishingCampaignManagerFrequencyTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-1' })
    await flushPromises()

    expect(QuishingService.deleteQuishingCampaignJob).toHaveBeenCalledWith('parent-1', 'ig-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('handleStopCampaign calls stopQuishingCampaignJob with item.resourceId and refreshes', async () => {
    // Note: stop uses item.resourceId (not parentResourceId) — important distinction
    QuishingService.stopQuishingCampaignJob.mockResolvedValue({})
    const callForData = jest.fn()
    const toggleStopCampaignDialog = jest.fn()
    const ctx = {
      item: { resourceId: 'item-resource-1' },
      callForData,
      toggleStopCampaignDialog,
      isStopDialogActionButtonDisabled: false
    }

    QuishingCampaignManagerFrequencyTable.methods.handleStopCampaign.call(ctx, { instanceGroup: 'ig-stop' })
    await flushPromises()

    expect(QuishingService.stopQuishingCampaignJob).toHaveBeenCalledWith('item-resource-1', 'ig-stop')
    expect(callForData).toHaveBeenCalled()
    expect(toggleStopCampaignDialog).toHaveBeenCalled()
    expect(ctx.isStopDialogActionButtonDisabled).toBe(false)
  })

  it('handleLaunch calls launchQuishingCampaignInstanceGroup with parentResourceId and refreshes', async () => {
    QuishingService.launchQuishingCampaignInstanceGroup.mockResolvedValue({})
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-1',
      callForData
    }

    QuishingCampaignManagerFrequencyTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-launch' })
    await flushPromises()

    expect(QuishingService.launchQuishingCampaignInstanceGroup).toHaveBeenCalledWith('parent-1', 'ig-launch')
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

    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [{ text: 'Running' }])

    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('watch statusItems skips empty list', () => {
    const set = jest.fn()
    const ctx = {
      tableOptions: { columns: [] },
      $set: set,
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }

    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [])

    expect(set).not.toHaveBeenCalled()
  })

  it('helper methods return correct values', () => {
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Error', jobResultMessage: 'err' })
    ).toBe('err')
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Running', jobResultMessage: 'x' })
    ).toBe('')
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getErrorMessage.call({}, { status: 'Error' })
    ).toBe('')
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Error', jobResultMessage: 'x' })
    ).toBe(false)
    expect(
      QuishingCampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Scheduled' })
    ).toBe(true)
  })

  it('toggle dialog helpers work correctly', () => {
    const ctx = {
      isShowDeleteDialog: false,
      isShowStopDialog: false,
      selectedRow: {},
      toggleShowDeleteDialog: QuishingCampaignManagerFrequencyTable.methods.toggleShowDeleteDialog,
      toggleStopCampaignDialog: QuishingCampaignManagerFrequencyTable.methods.toggleStopCampaignDialog
    }

    QuishingCampaignManagerFrequencyTable.methods.handleDelete.call(ctx, { instanceGroup: 'ig-d' })
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-d' })
    expect(ctx.isShowDeleteDialog).toBe(true)

    QuishingCampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})

    QuishingCampaignManagerFrequencyTable.methods.handleStop.call(ctx, { instanceGroup: 'ig-s' })
    expect(ctx.selectedRow).toEqual({ instanceGroup: 'ig-s' })
    expect(ctx.isShowStopDialog).toBe(true)
  })

  it('handleBackClick emits on-back-click', () => {
    const emit = jest.fn()
    QuishingCampaignManagerFrequencyTable.methods.handleBackClick.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-back-click')
  })

  it('exportCampaignManagerItemList maps XLS to Excel and triggers download', async () => {
    QuishingService.exportCampaignManagerItem.mockResolvedValue({ data: new Uint8Array([1]) })
    window.URL.createObjectURL = jest.fn(() => 'blob:quishing-freq')
    const link = { click: jest.fn(), href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(link)

    const ctx = {
      item: { frequencyGroup: 'fg-export' },
      parentResourceId: 'parent-export',
      axiosPayload: { orderBy: 'CreatedDate', ascending: false, filter: {} }
    }

    QuishingCampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        phishingCampaignFrequencyGroup: 'fg-export'
      }),
      'parent-export'
    )
    expect(link.download).toBe('Quishing-Campaign-Manager-Run.xlsx')
    expect(link.click).toHaveBeenCalled()

    jest.restoreAllMocks()
  })

  it('exportCampaignManagerItemList maps CSV to csv extension', async () => {
    QuishingService.exportCampaignManagerItem.mockResolvedValue({ data: new Uint8Array([1]) })
    window.URL.createObjectURL = jest.fn(() => 'blob:quishing-csv')
    const link = { click: jest.fn(), href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(link)

    const ctx = {
      item: { frequencyGroup: 'fg-csv' },
      parentResourceId: 'parent-csv',
      axiosPayload: { orderBy: 'CreatedDate', ascending: false, filter: {} }
    }

    QuishingCampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'parent-csv'
    )
    expect(link.download).toBe('Quishing-Campaign-Manager-Run.csv')

    jest.restoreAllMocks()
  })

  it('statusItems watcher calls $set with undefined when status column is missing', () => {
    const set = jest.fn()
    const ctx = {
      tableOptions: { columns: [] },
      $set: set,
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }

    QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [{ text: 'Running' }])

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
      QuishingCampaignManagerFrequencyTable.watch.statusItems.call(ctx, [{ text: 'Running' }])
    }).not.toThrow()
  })

  it('handleOnAddButtonClick emits on-launch with parentResourceId', () => {
    const emit = jest.fn()
    QuishingCampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call({
      parentResourceId: 'parent-add',
      $emit: emit
    })
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'parent-add' })
  })

  it('getStatusBadgeProps delegates to utility helper', () => {
    const result = QuishingCampaignManagerFrequencyTable.methods.getStatusBadgeProps.call({}, 'Completed')
    expect(result).toEqual({ color: '#217124', text: 'Completed' })
  })
})
