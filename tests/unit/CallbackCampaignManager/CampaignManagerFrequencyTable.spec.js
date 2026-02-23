jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    searchCallbackJobs: jest.fn(),
    exportCallbackJobs: jest.fn(),
    deleteCallbackJob: jest.fn(),
    stopCallbackCampaignJob: jest.fn(),
    startCallbackCampaignJob: jest.fn()
  }
}))

import CampaignManagerFrequencyTable from '@/components/CallbackCampaignManager/CampaignManagerFrequencyTable.vue'
import CallbackService from '@/api/callback'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerFrequencyTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData queries by parent id and frequency group, then maps table data', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-1', status: 'Running' }],
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

    expect(CallbackService.searchCallbackJobs).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ instanceGroup: 'ig-1', status: 'Running' }])
  })

  it('watch statusItems maps filter values and re-renders filters', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Paused' }])

    expect(col.filterableItems).toEqual([{ text: 'Paused', value: 'Paused' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('watch statusItems skips empty list and attempts set when status column is missing', () => {
    const col = { property: 'other', filterableItems: [] }
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [])
    expect(set).not.toHaveBeenCalled()
    CampaignManagerFrequencyTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])

    expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', [
      { text: 'Running', value: 'Running' }
    ])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('handleOnDelete calls API, unselects row, refreshes and closes dialog', async () => {
    CallbackService.deleteCallbackJob.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      parentResourceId: 'parent-2',
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn()
    }

    CampaignManagerFrequencyTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-22' })
    await flushPromises()

    expect(CallbackService.deleteCallbackJob).toHaveBeenCalledWith('parent-2', 'ig-22')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
    expect(ctx.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('handleStop and handleLaunch call APIs then refresh data', async () => {
    CallbackService.stopCallbackCampaignJob.mockResolvedValue({})
    CallbackService.startCallbackCampaignJob.mockResolvedValue({})
    const callForData = jest.fn()
    const ctx = { parentResourceId: 'parent-3', callForData }

    CampaignManagerFrequencyTable.methods.handleStop.call(ctx, { instanceGroup: 'ig-stop' })
    CampaignManagerFrequencyTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-start' })
    await flushPromises()

    expect(CallbackService.stopCallbackCampaignJob).toHaveBeenCalledWith('parent-3', 'ig-stop')
    expect(CallbackService.startCallbackCampaignJob).toHaveBeenCalledWith('parent-3', 'ig-start')
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('exportCampaignManagerItemList maps XLS to Excel and file extensions', async () => {
    CallbackService.exportCallbackJobs.mockResolvedValue({ data: new Uint8Array([1]) })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:cb')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      parentResourceId: 'parent-4',
      item: { frequencyGroup: 'fg-4' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }
    CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(CallbackService.exportCallbackJobs).toHaveBeenCalledTimes(2)
    expect(CallbackService.exportCallbackJobs.mock.calls[0][1]).toEqual(
      expect.objectContaining({ exportType: 'Excel', phishingCampaignFrequencyGroup: 'fg-4' })
    )
    expect(createdLinks[0].download).toBe('Callback-Campaign-Instances.xlsx')
    expect(createdLinks[1].download).toBe('Callback-Campaign-Instances.pdf')

    globalThis.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('helper methods and emits work as expected', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      parentResourceId: 'p-1',
      item: { frequencyDescription: 'Weekly' },
      isShowDeleteDialog: false,
      selectedRow: { id: 'x' }
    }

    CampaignManagerFrequencyTable.methods.handleBackClick.call(ctx)
    CampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call(ctx)
    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)
    CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'p-1' })
    expect(ctx.selectedRow).toEqual({})
    expect(CampaignManagerFrequencyTable.methods.getErrorMessage({ status: 'Error' })).toBe('')
    expect(
      CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)
  })

  it('created hook triggers callForData', () => {
    const callForData = jest.fn()
    CampaignManagerFrequencyTable.created.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })
})
