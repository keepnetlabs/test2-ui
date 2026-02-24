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

import CampaignManagerItemTable from '@/components/SmishingCampaignManager/CampaignManagerItemTable.vue'
import SmishingService from '@/api/smishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager/CampaignManagerItemTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData maps frequencyCount to total and updates server side props', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'i1', frequencyCount: '2' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      item: { resourceId: 's-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(SmishingService.searchSmishingCampaignJobReport).toHaveBeenCalledWith(
      ctx.axiosPayload,
      's-1'
    )
    expect(ctx.tableData[0].total).toBe(2)
    expect(ctx.tableData[0].frequencyCount).toBeUndefined()
  })

  it('callForData maps missing frequencyCount to total=0', async () => {
    SmishingService.searchSmishingCampaignJobReport.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'i1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 's-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].total).toBe(0)
  })

  it('delete flow calls api, unselects row, refreshes and closes dialog', async () => {
    SmishingService.deleteSmishingCampaignItem.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      item: { resourceId: 's-1' },
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn(),
      isDeleteDialogActionButtonDisabled: false
    }

    CampaignManagerItemTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-1' })
    await flushPromises()

    expect(SmishingService.deleteSmishingCampaignItem).toHaveBeenCalledWith('s-1', 'ig-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('stop campaign flow toggles dialog and refreshes on confirm', async () => {
    SmishingService.stopSmishingCampaign.mockResolvedValue({})
    const callForData = jest.fn()
    const toggleStopCampaignDialog = jest.fn()
    const ctx = {
      item: { resourceId: 's-1' },
      callForData,
      toggleStopCampaignDialog,
      isStopDialogActionButtonDisabled: false
    }

    CampaignManagerItemTable.methods.handleStopCampaign.call(ctx, { instanceGroup: 'ig-stop' })
    await flushPromises()

    expect(SmishingService.stopSmishingCampaign).toHaveBeenCalledWith('s-1', 'ig-stop')
    expect(callForData).toHaveBeenCalled()
    expect(toggleStopCampaignDialog).toHaveBeenCalled()
    expect(ctx.isStopDialogActionButtonDisabled).toBe(false)
  })

  it('handleStop stores selected row and opens stop dialog', () => {
    const toggleStopCampaignDialog = jest.fn()
    const ctx = {
      selectedRow: {},
      toggleStopCampaignDialog
    }
    const row = { instanceGroup: 'ig-2' }

    CampaignManagerItemTable.methods.handleStop.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('launch and preview handlers call API/emit correctly', async () => {
    SmishingService.startSmishingCampaign.mockResolvedValue({})
    const callForData = jest.fn()
    const emit = jest.fn()
    const ctx = {
      item: { resourceId: 's-1' },
      callForData,
      $emit: emit
    }

    CampaignManagerItemTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-start' })
    CampaignManagerItemTable.methods.handlePreview.call(ctx, { id: 'p1' })
    await flushPromises()

    expect(SmishingService.startSmishingCampaign).toHaveBeenCalledWith('s-1', 'ig-start')
    expect(callForData).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-preview', { id: 'p1' })
  })

  it('exportCampaignManagerItemList maps XLS to Excel and triggers downloads', async () => {
    SmishingService.exportSmishingCampaignItems.mockResolvedValue({ data: new Uint8Array([4, 5]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:smishing')
    const createdLinks = []
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => {
        const link = { click: jest.fn(), href: '', download: '' }
        createdLinks.push(link)
        return link
      })

    const ctx = {
      item: { resourceId: 's-1' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: { FilterGroups: [] } }
    }
    CampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })
    await flushPromises()

    expect(SmishingService.exportSmishingCampaignItems).toHaveBeenCalledTimes(2)
    expect(SmishingService.exportSmishingCampaignItems.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(SmishingService.exportSmishingCampaignItems.mock.calls[1][0]).toEqual(
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(createdLinks[0].download).toBe('Smishing-Campaign-Runs.xlsx')
    expect(createdLinks[1].download).toBe('Smishing-Campaign-Runs.pdf')
    expect(createdLinks[0].click).toHaveBeenCalled()
    expect(createdLinks[1].click).toHaveBeenCalled()

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('statusItems watcher updates status column filters and helper methods reset table', () => {
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

    CampaignManagerItemTable.watch.statusItems.handler.call(ctx, [{ text: 'Paused' }])
    expect(col.filterableItems).toEqual([{ text: 'Paused', value: 'Paused' }])
    expect(reRenderFilters).toHaveBeenCalled()

    CampaignManagerItemTable.methods.reRenderFilters.call(ctx, {})
    CampaignManagerItemTable.methods.resetSearchText.call(ctx)
    CampaignManagerItemTable.methods.resetTable.call(ctx)
    expect(resetSearchText).toHaveBeenCalled()
    expect(reRenderFilters).toHaveBeenCalledWith({})
    expect(ctx.axiosPayload.orderBy).toBe('CreatedDate')
  })

  it('statusItems watcher ignores empty values', () => {
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

  it('emits back/add/record button events', () => {
    const emit = jest.fn()
    const ctx = {
      item: { resourceId: 's-99' },
      $emit: emit
    }

    CampaignManagerItemTable.methods.handleBackClick.call(ctx)
    CampaignManagerItemTable.methods.handleOnAddButtonClick.call(ctx)
    CampaignManagerItemTable.methods.handleRecordButtonClick.call(ctx, { instanceGroup: 'ig-7' })

    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 's-99' })
    expect(emit).toHaveBeenCalledWith('on-record-button-click', { instanceGroup: 'ig-7' })
  })

  it('created hook triggers initial data fetch', () => {
    const callForData = jest.fn()
    CampaignManagerItemTable.created.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('error/tooltip helpers and toggle dialogs behave correctly', () => {
    expect(
      CampaignManagerItemTable.methods.getErrorMessage.call({}, {
        status: 'Error',
        jobResultMessage: 'x'
      })
    ).toBe('x')
    expect(CampaignManagerItemTable.methods.getErrorMessage.call({}, { status: 'Running' })).toBe('')
    expect(
      CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: 'x'
      })
    ).toBe(false)
    expect(
      CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)

    const ctx = { isShowDeleteDialog: false, isShowStopDialog: false, selectedRow: { a: 1 } }
    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})

    CampaignManagerItemTable.methods.toggleStopCampaignDialog.call(ctx)
    expect(ctx.isShowStopDialog).toBe(true)
  })
})
