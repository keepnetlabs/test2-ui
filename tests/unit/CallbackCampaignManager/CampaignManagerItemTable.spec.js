jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getUsedCallbackNumbers: jest.fn(),
    searchCallbackJobs: jest.fn(),
    exportCallbackJobs: jest.fn(),
    deleteCallbackJob: jest.fn(),
    stopCallbackCampaignJob: jest.fn(),
    startCallbackCampaignJob: jest.fn()
  }
}))

import CampaignManagerItemTable from '@/components/CallbackCampaignManager/CampaignManagerItemTable.vue'
import CallbackService from '@/api/callback'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerItemTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('canRenderAlertBox is true only when not loading and no available numbers', () => {
    expect(
      CampaignManagerItemTable.computed.canRenderAlertBox.call({
        isLoading: false,
        availablePhoneNumbers: 0
      })
    ).toBe(true)
    expect(
      CampaignManagerItemTable.computed.canRenderAlertBox.call({
        isLoading: true,
        availablePhoneNumbers: 0
      })
    ).toBe(false)
    expect(
      CampaignManagerItemTable.computed.canRenderAlertBox.call({
        isLoading: false,
        availablePhoneNumbers: 2
      })
    ).toBe(false)
  })

  it('callForAvailableNumbers disables add button when no available numbers and forwards isInitial', async () => {
    CallbackService.getUsedCallbackNumbers.mockResolvedValue({
      data: {
        data: { companyCount: 2, usedCount: 2 }
      }
    })

    const callForData = jest.fn()
    const ctx = {
      availablePhoneNumbers: 99,
      tableOptions: { addButton: { disabled: false, tooltip: 'Add a Campaign' } },
      setLoading: jest.fn(),
      callForData
    }

    CampaignManagerItemTable.methods.callForAvailableNumbers.call(ctx, { isInitial: true })
    await flushPromises()

    expect(ctx.availablePhoneNumbers).toBe(0)
    expect(ctx.tableOptions.addButton.disabled).toBe(true)
    expect(ctx.tableOptions.addButton.tooltip).toContain('available Callback phone number')
    expect(callForData).toHaveBeenCalledWith({ isInitial: true })
  })

  it('callForAvailableNumbers keeps add button enabled when available numbers exist', async () => {
    CallbackService.getUsedCallbackNumbers.mockResolvedValue({
      data: {
        data: { companyCount: 5, usedCount: 2 }
      }
    })

    const ctx = {
      availablePhoneNumbers: 0,
      tableOptions: { addButton: { disabled: false, tooltip: 'Add a Campaign' } },
      setLoading: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerItemTable.methods.callForAvailableNumbers.call(ctx, {})
    await flushPromises()

    expect(ctx.availablePhoneNumbers).toBe(3)
    expect(ctx.tableOptions.addButton.disabled).toBe(false)
    expect(ctx.tableOptions.addButton.tooltip).toBe('Add a Campaign')
    expect(ctx.callForData).toHaveBeenCalledWith({ isInitial: undefined })
  })

  it('callForData maps frequencyCount to total and updates server side props', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'i1', frequencyCount: '4' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      item: { resourceId: 'c-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(CallbackService.searchCallbackJobs).toHaveBeenCalledWith('c-1', ctx.axiosPayload)
    expect(ctx.tableData[0].total).toBe(4)
    expect(ctx.tableData[0].frequencyCount).toBeUndefined()
  })

  it('callForData skips forcing loading when isInitial is true', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })
    const ctx = {
      item: { resourceId: 'c-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx, { isInitial: true })
    await flushPromises()

    expect(ctx.setLoading).not.toHaveBeenCalledWith(true)
  })

  it('handleOnDelete calls api, unselects row and refreshes', async () => {
    CallbackService.deleteCallbackJob.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      item: { resourceId: 'c-1' },
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn()
    }

    CampaignManagerItemTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-1' })
    await flushPromises()

    expect(CallbackService.deleteCallbackJob).toHaveBeenCalledWith('c-1', 'ig-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('handleStop and handleLaunch call respective APIs and refresh data', async () => {
    CallbackService.stopCallbackCampaignJob.mockResolvedValue({})
    CallbackService.startCallbackCampaignJob.mockResolvedValue({})
    const callForData = jest.fn()
    const ctx = {
      item: { resourceId: 'c-1' },
      callForData
    }

    CampaignManagerItemTable.methods.handleStop.call(ctx, { instanceGroup: 'ig-stop' })
    CampaignManagerItemTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-start' })
    await flushPromises()

    expect(CallbackService.stopCallbackCampaignJob).toHaveBeenCalledWith('c-1', 'ig-stop')
    expect(CallbackService.startCallbackCampaignJob).toHaveBeenCalledWith('c-1', 'ig-start')
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('exportCampaignManagerItemList maps XLS to Excel and clicks generated download links', async () => {
    CallbackService.exportCallbackJobs.mockResolvedValue({ data: new Uint8Array([1, 2, 3]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:callback')
    const createdLinks = []
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => {
        const link = { click: jest.fn(), href: '', download: '' }
        createdLinks.push(link)
        return link
      })

    const ctx = {
      item: { resourceId: 'c-1' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: { FilterGroups: [] } }
    }
    CampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(CallbackService.exportCallbackJobs).toHaveBeenCalledTimes(2)
    expect(CallbackService.exportCallbackJobs.mock.calls[0][1]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportCallbackJobs.mock.calls[1][1]).toEqual(
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createdLinks[0].download).toBe('Callback-Campaign-Runs.xlsx')
    expect(createdLinks[1].download).toBe('Callback-Campaign-Runs.csv')
    expect(createdLinks[0].click).toHaveBeenCalled()
    expect(createdLinks[1].click).toHaveBeenCalled()

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('statusItems watcher maps filter items and supports helper/reset methods', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const resetSearchText = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters, resetSearchText } },
      axiosPayload: {},
      resetSearchText: CampaignManagerItemTable.methods.resetSearchText,
      reRenderFilters: CampaignManagerItemTable.methods.reRenderFilters
    }

    CampaignManagerItemTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
    expect(reRenderFilters).toHaveBeenCalled()

    CampaignManagerItemTable.methods.reRenderFilters.call(ctx, {})
    CampaignManagerItemTable.methods.resetSearchText.call(ctx)
    CampaignManagerItemTable.methods.resetTable.call(ctx)
    expect(resetSearchText).toHaveBeenCalled()
    expect(reRenderFilters).toHaveBeenCalledWith({})
    expect(ctx.axiosPayload.orderBy).toBe('CreatedDate')
  })

  it('statusItems watcher does nothing for empty input', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerItemTable.watch.statusItems.handler.call(ctx, [])
    expect(set).not.toHaveBeenCalled()
    expect(reRenderFilters).not.toHaveBeenCalled()
  })

  it('emits back/add/record actions and toggles delete dialog with reset', () => {
    const emit = jest.fn()
    const ctx = {
      item: { resourceId: 'cb-1' },
      $emit: emit,
      isShowDeleteDialog: false,
      selectedRow: { id: 'x' }
    }

    CampaignManagerItemTable.methods.handleBackClick.call(ctx)
    CampaignManagerItemTable.methods.handleOnAddButtonClick.call(ctx)
    CampaignManagerItemTable.methods.handleRecordButtonClick.call(ctx, { instanceGroup: 'ig-9' })
    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'cb-1' })
    expect(emit).toHaveBeenCalledWith('on-record-button-click', { instanceGroup: 'ig-9' })
    expect(ctx.selectedRow).toEqual({})
  })

  it('created hook triggers available-number fetch', () => {
    const callForAvailableNumbers = jest.fn()
    CampaignManagerItemTable.created.call({ callForAvailableNumbers })
    expect(callForAvailableNumbers).toHaveBeenCalled()
  })

  it('error and tooltip helpers return expected values', () => {
    expect(
      CampaignManagerItemTable.methods.getErrorMessage.call({}, {
        status: 'Error',
        jobResultMessage: 'boom'
      })
    ).toBe('boom')
    expect(CampaignManagerItemTable.methods.getErrorMessage.call({}, { status: 'Running' })).toBe('')
    expect(
      CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: 'boom'
      })
    ).toBe(false)
    expect(
      CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)
  })

  it('getTableAllRecordsText formats campaign name and falls back safely', () => {
    expect(
      CampaignManagerItemTable.computed.getTableAllRecordsText.call({
        item: { name: 'Callback Campaign 1' }
      })
    ).toBe('Campaign Name: Callback Campaign 1')
    expect(
      CampaignManagerItemTable.computed.getTableAllRecordsText.call({
        item: null
      })
    ).toBe('Campaign Name: undefined')
  })

  it('status watcher does nothing when refTable is missing', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: {}
    }

    expect(() =>
      CampaignManagerItemTable.watch.statusItems.handler.call(ctx, [{ text: 'Running' }])
    ).not.toThrow()
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
  })
})
