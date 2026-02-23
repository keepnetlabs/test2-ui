jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignManager: jest.fn(),
    exportCampaignManager: jest.fn(),
    getQuishingPdfCampaignPreviewContent: jest.fn()
  }
}))

import QuishingCampaignManagerParentTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerParentTable.vue'
import QuishingService from '@/api/quishing'
import { COLUMNS } from '@/components/CampaignManager/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManager/QuishingCampaignManagerParentTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData maps results and server-side props when search permission is enabled', async () => {
    QuishingService.searchCampaignManager.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'q-1', targetUsers: '8', instanceCount: '2' }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getQuishingCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    QuishingCampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignManager).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.tableData[0].targetUsers).toBe(8)
    expect(ctx.tableData[0].total).toBe(2)
  })

  it('callForData does nothing when search permission is disabled', () => {
    const ctx = {
      getQuishingCampaignManagerParentSearchPermissions: false,
      setLoading: jest.fn()
    }
    QuishingCampaignManagerParentTable.methods.callForData.call(ctx)
    expect(QuishingService.searchCampaignManager).not.toHaveBeenCalled()
    expect(ctx.setLoading).not.toHaveBeenCalled()
  })

  it('statusItems watcher maps filter items and rerenders filters', () => {
    const col = { property: COLUMNS.STATUS.property, filterableItems: [] }
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [col] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    QuishingCampaignManagerParentTable.watch.statusItems.call(ctx, [{ text: 'Running' }])
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('exportCampaignManagerList maps XLS to Excel and triggers download', async () => {
    QuishingService.exportCampaignManager.mockResolvedValue({ data: new Uint8Array([1]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:q')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      getQuishingCampaignManagerParentExportPermissions: true,
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: { FilterGroups: [] } }
    }
    QuishingCampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManager.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(QuishingService.exportCampaignManager.mock.calls[1][0]).toEqual(
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(createdLinks[0].download).toBe('Campaign-Manager.xlsx')
    expect(createdLinks[1].download).toBe('Campaign-Manager.pdf')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handleAddQuishingCampaign emits correct events per item text', () => {
    const emit = jest.fn()
    const toggleAddCampaignManagerModal = jest.fn()
    const ctx = {
      addQuishingItems: [
        { text: 'Email Campaign' },
        { text: 'Individual Printout Campaign' }
      ],
      toggleAddCampaignManagerModal,
      $emit: emit
    }

    QuishingCampaignManagerParentTable.methods.handleAddQuishingCampaign.call(ctx, {
      text: 'Email Campaign'
    })
    QuishingCampaignManagerParentTable.methods.handleAddQuishingCampaign.call(ctx, {
      text: 'Individual Printout Campaign'
    })

    expect(toggleAddCampaignManagerModal).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-add-individual-printout-campaign', null, false)
  })

  it('checkIsQuishingTypePrintout matches individual printout template type', () => {
    expect(
      QuishingCampaignManagerParentTable.methods.checkIsQuishingTypePrintout.call({}, {
        templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      })
    ).toBe(true)
    expect(
      QuishingCampaignManagerParentTable.methods.checkIsQuishingTypePrintout.call({}, {
        templateType: 'EMAIL'
      })
    ).toBe(false)
  })

  it('handlePrintPreview fetches pdf preview and opens new window', async () => {
    jest.useFakeTimers()
    QuishingService.getQuishingPdfCampaignPreviewContent.mockResolvedValue({
      data: new Uint8Array([1, 2, 3])
    })

    const originalFile = global.File
    const originalCreateObjectURL = URL.createObjectURL
    const originalOpen = window.open
    global.File = jest.fn(() => ({}))
    URL.createObjectURL = jest.fn(() => 'blob:preview')
    const newWindow = { onload: null, document: { title: '' } }
    window.open = jest.fn(() => newWindow)

    QuishingCampaignManagerParentTable.methods.handlePrintPreview.call({}, { resourceId: 'q-99' })
    await Promise.resolve()
    await Promise.resolve()

    expect(QuishingService.getQuishingPdfCampaignPreviewContent).toHaveBeenCalledWith('q-99')
    expect(window.open).toHaveBeenCalledWith('blob:preview')
    newWindow.onload()
    jest.runAllTimers()
    expect(newWindow.document.title).toBe('Quishing PDF Preview')

    global.File = originalFile
    URL.createObjectURL = originalCreateObjectURL
    window.open = originalOpen
    jest.useRealTimers()
  })
})
