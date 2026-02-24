jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignQuishingJob: jest.fn(),
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

describe('QuishingCampaignManager/QuishingCampaignManagerItemTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData maps frequencyCount to total and updates server props', async () => {
    QuishingService.searchCampaignQuishingJob.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-1', frequencyCount: '4' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 'q-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    QuishingCampaignManagerItemTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignQuishingJob).toHaveBeenCalledWith(ctx.axiosPayload, 'q-1')
    expect(ctx.tableData[0].total).toBe(4)
    expect(ctx.tableData[0].frequencyCount).toBeUndefined()
  })

  it('statusItems watcher maps status filter items and rerenders', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      reRenderFilters
    }

    QuishingCampaignManagerItemTable.watch.statusItems.call(ctx, [{ text: 'Running' }])
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('isQuishingTypePrintout watcher switches columns/row actions for printout mode', () => {
    const ctx = {
      tableOptions: { columns: [], rowActions: [] },
      labels: { Stop: 'Stop', Delete: 'Delete' },
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsDeletePermissions': true
        }
      }
    }

    QuishingCampaignManagerItemTable.watch.isQuishingTypePrintout.handler.call(ctx, true)
    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual([
      COLUMNS.START_TIME.property,
      COLUMNS.TARGET_USERS_ITEM_TABLE.property,
      COLUMNS.CREATE_TIME_ITEM_TABLE.property
    ])
    expect(ctx.tableOptions.rowActions.some((x) => x.action === 'on-download')).toBe(true)

    QuishingCampaignManagerItemTable.watch.isQuishingTypePrintout.handler.call(ctx, false)
    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual([
      COLUMNS.FREQUENCY.property,
      COLUMNS.START_TIME.property,
      COLUMNS.TARGET_USERS_ITEM_TABLE.property,
      COLUMNS.STATUS.property,
      COLUMNS.CREATE_TIME_ITEM_TABLE.property
    ])
  })

  it('delete flow calls api, unselects row, refreshes and closes dialog', async () => {
    QuishingService.deleteQuishingCampaignJob.mockResolvedValue({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      item: { resourceId: 'q-1' },
      $refs: { refTable: { unSelectRow } },
      callForData,
      toggleShowDeleteDialog: jest.fn(),
      isDeleteDialogActionButtonDisabled: false
    }

    QuishingCampaignManagerItemTable.methods.handleOnDelete.call(ctx, { instanceGroup: 'ig-2' })
    await flushPromises()

    expect(QuishingService.deleteQuishingCampaignJob).toHaveBeenCalledWith('q-1', 'ig-2')
    expect(unSelectRow).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
    expect(ctx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('stop and launch methods call api and refresh', async () => {
    QuishingService.stopQuishingCampaignJob.mockResolvedValue({})
    QuishingService.launchQuishingCampaignInstanceGroup.mockResolvedValue({})
    const callForData = jest.fn()
    const toggleStopCampaignDialog = jest.fn()
    const ctx = {
      item: { resourceId: 'q-1' },
      callForData,
      toggleStopCampaignDialog,
      isStopDialogActionButtonDisabled: false
    }

    QuishingCampaignManagerItemTable.methods.handleStopCampaign.call(ctx, { instanceGroup: 'ig-s' })
    QuishingCampaignManagerItemTable.methods.handleLaunch.call(ctx, { instanceGroup: 'ig-l' })
    await flushPromises()

    expect(QuishingService.stopQuishingCampaignJob).toHaveBeenCalledWith('q-1', 'ig-s')
    expect(QuishingService.launchQuishingCampaignInstanceGroup).toHaveBeenCalledWith('q-1', 'ig-l')
    expect(callForData).toHaveBeenCalledTimes(2)
    expect(toggleStopCampaignDialog).toHaveBeenCalled()
  })

  it('exports item list and maps XLS to Excel', async () => {
    QuishingService.exportCampaignManagerItem.mockResolvedValue({ data: new Uint8Array([1, 2]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:q')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      item: { resourceId: 'q-1' },
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: { FilterGroups: [] } }
    }
    QuishingCampaignManagerItemTable.methods.exportCampaignManagerItemList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManagerItem.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(QuishingService.exportCampaignManagerItem.mock.calls[1][0]).toEqual(
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(createdLinks[0].download).toBe('Campaign-Manager-Run.xlsx')
    expect(createdLinks[1].download).toBe('Campaign-Manager-Run.pdf')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('download flow dispatches snackbar, downloads file and resets isDownloading', async () => {
    QuishingService.getQuishingPdfCampaignDownloadContent.mockResolvedValue({
      data: new Uint8Array([3, 4])
    })
    const dispatch = jest.fn()
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const click = jest.fn()
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:pdf')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ click, href: '', download: '' })
    const row = { instanceGroup: 'ig-9', startDate: '2026-01-01', isDownloading: false }
    const ctx = {
      item: { resourceId: 'q-1', name: 'QCampaign' },
      $set: set,
      $store: { dispatch }
    }

    QuishingCampaignManagerItemTable.methods.handleDownload.call(ctx, row)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Download progress has been started. Please wait...' })
    )
    expect(QuishingService.getQuishingPdfCampaignDownloadContent).toHaveBeenCalledWith('q-1', 'ig-9')
    expect(click).toHaveBeenCalled()
    expect(row.isDownloading).toBe(false)

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleViewReport routes to quishing report', () => {
    const push = jest.fn()
    const ctx = {
      item: { resourceId: 'q-1' },
      $router: { push }
    }

    QuishingCampaignManagerItemTable.methods.handleViewReport.call(ctx, { instanceGroup: 'ig-r' })
    expect(push).toHaveBeenCalledWith({
      name: 'Quishing Report',
      params: { id: 'q-1', instanceGroup: 'ig-r' }
    })
  })
})

