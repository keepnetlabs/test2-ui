jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignQuishingJob: jest.fn().mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    }),
    exportCampaignManagerItem: jest.fn(),
    deleteQuishingCampaignJob: jest.fn(),
    stopQuishingCampaignJob: jest.fn(),
    launchQuishingCampaignInstanceGroup: jest.fn(),
    getQuishingPdfCampaignDownloadContent: jest.fn()
  }
}))

import QuishingCampaignManagerItemTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerItemTable.vue'
import QuishingService from '@/api/quishing'
import { COLUMNS } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManagerItemTable.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData handles missing nested payload and keeps default empty table', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValueOnce({ data: {} })
    const ctx = {
      item: { resourceId: 'q-extra' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    QuishingCampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('status watcher skips update on empty input and handles missing status column', () => {
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [{ property: 'other' }] },
      $set: set,
      reRenderFilters
    }

    QuishingCampaignManagerItemTable.watch.statusItems.call(ctx, [])
    expect(set).not.toHaveBeenCalled()

    QuishingCampaignManagerItemTable.watch.statusItems.call(ctx, [{ text: 'Error' }])
    expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', [{ text: 'Error', value: 'Error' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('toggleShowDeleteDialog clears selected row only when dialog was already open', () => {
    const ctx = { isShowDeleteDialog: false, selectedRow: { id: 1 } }
    QuishingCampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 1 })

    QuishingCampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})
  })

  it('handleDelete and handleStop support default row argument', () => {
    const deleteCtx = {
      selectedRow: { old: true },
      toggleShowDeleteDialog: jest.fn()
    }
    QuishingCampaignManagerItemTable.methods.handleDelete.call(deleteCtx)
    expect(deleteCtx.selectedRow).toEqual({})
    expect(deleteCtx.toggleShowDeleteDialog).toHaveBeenCalled()

    const stopCtx = {
      selectedRow: { old: true },
      toggleStopCampaignDialog: jest.fn()
    }
    QuishingCampaignManagerItemTable.methods.handleStop.call(stopCtx)
    expect(stopCtx.selectedRow).toEqual({})
    expect(stopCtx.toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('handleOnDelete and handleStopCampaign use default object args and reset action flags', async () => {
    QuishingService.deleteQuishingCampaignJob.mockResolvedValueOnce({})
    QuishingService.stopQuishingCampaignJob.mockResolvedValueOnce({})

    const deleteCtx = {
      item: { resourceId: 'q-del' },
      isDeleteDialogActionButtonDisabled: false,
      $refs: { refTable: { unSelectRow: jest.fn() } },
      callForData: jest.fn(),
      toggleShowDeleteDialog: jest.fn()
    }
    QuishingCampaignManagerItemTable.methods.handleOnDelete.call(deleteCtx)
    await flushPromises()

    expect(QuishingService.deleteQuishingCampaignJob).toHaveBeenCalledWith('q-del', undefined)
    expect(deleteCtx.isDeleteDialogActionButtonDisabled).toBe(false)
    expect(deleteCtx.toggleShowDeleteDialog).toHaveBeenCalled()

    const stopCtx = {
      item: { resourceId: 'q-stop' },
      isStopDialogActionButtonDisabled: false,
      callForData: jest.fn(),
      toggleStopCampaignDialog: jest.fn()
    }
    QuishingCampaignManagerItemTable.methods.handleStopCampaign.call(stopCtx)
    await flushPromises()

    expect(QuishingService.stopQuishingCampaignJob).toHaveBeenCalledWith('q-stop', undefined)
    expect(stopCtx.isStopDialogActionButtonDisabled).toBe(false)
    expect(stopCtx.toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('handleLaunch defaults instance group and still refreshes', async () => {
    QuishingService.launchQuishingCampaignInstanceGroup.mockResolvedValueOnce({})
    const ctx = { item: { resourceId: 'q-l' }, callForData: jest.fn() }

    QuishingCampaignManagerItemTable.methods.handleLaunch.call(ctx)
    await flushPromises()

    expect(QuishingService.launchQuishingCampaignInstanceGroup).toHaveBeenCalledWith(
      'q-l',
      undefined
    )
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('helper methods and resetTable cover fallback branches', () => {
    expect(QuishingCampaignManagerItemTable.methods.getErrorMessage({ status: 'Done' })).toBe('')
    expect(
      QuishingCampaignManagerItemTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)
    expect(
      QuishingCampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: 0 } },
        { status: 'Idle' }
      )
    ).toBe('')
    expect(
      QuishingCampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: null } },
        { status: 'Running' }
      )
    ).toBe('View Report')

    const resetSearchText = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      axiosPayload: { orderBy: 'Other' },
      $refs: { refTable: { resetSearchText, reRenderFilters } },
      resetSearchText: QuishingCampaignManagerItemTable.methods.resetSearchText,
      reRenderFilters: QuishingCampaignManagerItemTable.methods.reRenderFilters
    }

    QuishingCampaignManagerItemTable.methods.resetTable.call(ctx)
    expect(resetSearchText).toHaveBeenCalled()
    expect(reRenderFilters).toHaveBeenCalledWith({})
    expect(ctx.axiosPayload.orderBy).toBe('CreatedDate')
  })

  it('isQuishingTypePrintout watcher sets delete action disabled by permission branch', () => {
    const ctx = {
      tableOptions: { columns: [], rowActions: [] },
      labels: { Stop: 'Stop', Delete: 'Delete' },
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsDeletePermissions': false
        }
      }
    }

    QuishingCampaignManagerItemTable.watch.isQuishingTypePrintout.handler.call(ctx, true)
    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual([
      COLUMNS.START_TIME.property,
      COLUMNS.TARGET_USERS_ITEM_TABLE.property,
      COLUMNS.CREATE_TIME_ITEM_TABLE.property
    ])
    expect(ctx.tableOptions.rowActions[2].disabled).toBe(true)
  })

  it('isQuishingTypePrintout=false branch restores default columns and stop action name', () => {
    const ctx = {
      tableOptions: { columns: [], rowActions: [] },
      labels: { Stop: 'Stop', Delete: 'Delete' },
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsDeletePermissions': true
        }
      }
    }

    QuishingCampaignManagerItemTable.watch.isQuishingTypePrintout.handler.call(ctx, false)
    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual([
      COLUMNS.FREQUENCY.property,
      COLUMNS.START_TIME.property,
      COLUMNS.TARGET_USERS_ITEM_TABLE.property,
      COLUMNS.STATUS.property,
      COLUMNS.CREATE_TIME_ITEM_TABLE.property
    ])
    expect(ctx.tableOptions.rowActions[0].name).toBe('Stop')
    expect(ctx.tableOptions.rowActions[1].disabled).toBe(false)
  })

  it('emit handlers and mounted hook cover UI event branches', () => {
    const emit = jest.fn()
    const ctx = {
      item: { resourceId: 'q-emit', name: 'Q Name' },
      $emit: emit
    }

    QuishingCampaignManagerItemTable.methods.handleBackClick.call(ctx)
    QuishingCampaignManagerItemTable.methods.handleOnAddButtonClick.call(ctx)
    QuishingCampaignManagerItemTable.methods.handlePreview.call(ctx, { id: 'p-1' })
    QuishingCampaignManagerItemTable.methods.handleRecordButtonClick.call(ctx, { instanceGroup: 'ig-1' })

    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'q-emit' })
    expect(emit).toHaveBeenCalledWith('on-preview', { id: 'p-1' })
    expect(emit).toHaveBeenCalledWith('on-record-button-click', { instanceGroup: 'ig-1' })

    const callForData = jest.fn()
    QuishingCampaignManagerItemTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('exportCampaignManagerItemList no-ops with empty exportTypes', async () => {
    const ctx = {
      item: { resourceId: 'q-exp' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }

    QuishingCampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(QuishingService.exportCampaignManagerItem).not.toHaveBeenCalled()
  })

  it('table helper methods handle fallback and safe paths', () => {
    expect(
      QuishingCampaignManagerItemTable.computed.getTableAllRecordsText.call({ item: null })
    ).toBe('Campaign Name: undefined')

    const ctx = { $refs: {} }
    expect(() => QuishingCampaignManagerItemTable.methods.reRenderFilters.call(ctx, {})).not.toThrow()
  })

  it('callForData maps non numeric frequencyCount to 0', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-nan', frequencyCount: 'not-a-number' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 2
        }
      }
    })
    const ctx = {
      item: { resourceId: 'q-nan' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    QuishingCampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].total).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
  })

  it('exportCampaignManagerItemList keeps lowercase xls extension as xlsx', async () => {
    QuishingService.exportCampaignManagerItem.mockResolvedValueOnce({ data: new Uint8Array([9]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:xls')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ click: jest.fn(), href: '', download: '' })
    const ctx = {
      item: { resourceId: 'q-exp-xls' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} }
    }

    QuishingCampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    const [payload] = QuishingService.exportCampaignManagerItem.mock.calls[0]
    expect(payload.exportType).toBe('xls')
    expect(createElementSpy.mock.results[0].value.download).toBe('Campaign-Manager-Run.xlsx')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('error/status helper methods cover explicit branches', () => {
    expect(
      QuishingCampaignManagerItemTable.methods.getErrorMessage({
        status: 'Error',
        jobResultMessage: 'failed'
      })
    ).toBe('failed')
    expect(
      QuishingCampaignManagerItemTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: 'failed'
      })
    ).toBe(false)
    expect(QuishingCampaignManagerItemTable.methods.getStatusBadgeProps('Running')).toBeDefined()
  })

  it('getTableAllRecordsText and resetSearchText direct branches', () => {
    expect(
      QuishingCampaignManagerItemTable.computed.getTableAllRecordsText.call({
        item: { name: 'Quarterly Quishing' }
      })
    ).toBe('Campaign Name: Quarterly Quishing')

    const resetSearchText = jest.fn()
    QuishingCampaignManagerItemTable.methods.resetSearchText.call({
      $refs: { refTable: { resetSearchText } }
    })
    expect(resetSearchText).toHaveBeenCalled()
  })

  it('handleDelete and handleStop keep provided row payload', () => {
    const deleteCtx = {
      selectedRow: {},
      toggleShowDeleteDialog: jest.fn()
    }
    const row = { instanceGroup: 'ig-row' }
    QuishingCampaignManagerItemTable.methods.handleDelete.call(deleteCtx, row)
    expect(deleteCtx.selectedRow).toBe(row)
    expect(deleteCtx.toggleShowDeleteDialog).toHaveBeenCalled()

    const stopCtx = {
      selectedRow: {},
      toggleStopCampaignDialog: jest.fn()
    }
    QuishingCampaignManagerItemTable.methods.handleStop.call(stopCtx, row)
    expect(stopCtx.selectedRow).toBe(row)
    expect(stopCtx.toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('getRecordsButtonSingleLabel returns empty string for recurring campaigns', () => {
    expect(
      QuishingCampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: 10 } },
        { status: 'Completed' }
      )
    ).toBe('')
  })

  it('handleDownload sets progress/snackbar and handleViewReport routes to report page', async () => {
    QuishingService.getQuishingPdfCampaignDownloadContent.mockResolvedValueOnce({
      data: new Uint8Array([1, 2, 3])
    })
    const dispatch = jest.fn()
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const click = jest.fn()
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:download')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ click, href: '', download: '' })
    const row = { instanceGroup: 'ig-dl', startDate: '2026-02-01', isDownloading: false }
    const downloadCtx = {
      item: { resourceId: 'q-dl', name: 'Q Campaign' },
      $set: set,
      $store: { dispatch }
    }

    QuishingCampaignManagerItemTable.methods.handleDownload.call(downloadCtx, row)
    await flushPromises()

    expect(set).toHaveBeenNthCalledWith(1, row, 'isDownloading', true)
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Download progress has been started. Please wait...' })
    )
    expect(click).toHaveBeenCalled()
    expect(set).toHaveBeenLastCalledWith(row, 'isDownloading', false)

    const push = jest.fn()
    QuishingCampaignManagerItemTable.methods.handleViewReport.call(
      { item: { resourceId: 'q-vr' }, $router: { push } },
      { instanceGroup: 'ig-vr' }
    )
    expect(push).toHaveBeenCalledWith({
      name: 'Quishing Report',
      params: { id: 'q-vr', instanceGroup: 'ig-vr' }
    })

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })
})
