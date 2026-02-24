jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignManager: jest.fn(),
    exportCampaignManager: jest.fn(),
    getQuishingPdfCampaignPreviewContent: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDataTableFieldLabel: jest.fn((v) => `label:${v}`)
  }
})

import QuishingCampaignManagerParentTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerParentTable.vue'
import QuishingService from '@/api/quishing'
import { COLUMNS } from '@/components/CampaignManager/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { getDataTableFieldLabel } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingCampaignManagerParentTable.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData handles missing nested response safely', async () => {
    QuishingService.searchCampaignManager.mockResolvedValueOnce({ data: {} })
    const ctx = {
      getQuishingCampaignManagerParentSearchPermissions: true,
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn()
    }

    QuishingCampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('callForData does nothing when search permission is false', async () => {
    const ctx = {
      getQuishingCampaignManagerParentSearchPermissions: false,
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [{ keep: true }],
      setLoading: jest.fn()
    }

    QuishingCampaignManagerParentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignManager).not.toHaveBeenCalled()
    expect(ctx.setLoading).not.toHaveBeenCalled()
    expect(ctx.tableData).toEqual([{ keep: true }])
  })

  it('statusItems watcher skips empty input and handles missing status column', () => {
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [{ property: 'other' }] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    QuishingCampaignManagerParentTable.watch.statusItems.call(ctx, [])
    expect(set).not.toHaveBeenCalled()

    QuishingCampaignManagerParentTable.watch.statusItems.call(ctx, [{ text: 'Error' }])
    expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', [{ text: 'Error', value: 'Error' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('setLoading emits default false and explicit true values', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    QuishingCampaignManagerParentTable.methods.setLoading.call(ctx)
    QuishingCampaignManagerParentTable.methods.setLoading.call(ctx, true)

    expect(emit).toHaveBeenNthCalledWith(1, 'update:is-loading', false)
    expect(emit).toHaveBeenNthCalledWith(2, 'update:is-loading', true)
  })

  it('exportCampaignManagerList no-ops without permission or empty exportTypes', async () => {
    const noPermCtx = {
      getQuishingCampaignManagerParentExportPermissions: false,
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: {} }
    }
    QuishingCampaignManagerParentTable.methods.exportCampaignManagerList.call(noPermCtx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    expect(QuishingService.exportCampaignManager).not.toHaveBeenCalled()

    const emptyCtx = {
      getQuishingCampaignManagerParentExportPermissions: true,
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: {} }
    }
    QuishingCampaignManagerParentTable.methods.exportCampaignManagerList.call(emptyCtx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(QuishingService.exportCampaignManager).not.toHaveBeenCalled()
  })

  it('handles add campaign action for undefined and unknown item safely', () => {
    const ctx = {
      addQuishingItems: [{ text: 'Email Campaign' }, { text: 'Individual Printout Campaign' }],
      toggleAddCampaignManagerModal: jest.fn(),
      $emit: jest.fn()
    }

    expect(() => QuishingCampaignManagerParentTable.methods.handleAddQuishingCampaign.call(ctx)).not.toThrow()
    QuishingCampaignManagerParentTable.methods.handleAddQuishingCampaign.call(ctx, { text: 'Unknown' })

    expect(ctx.toggleAddCampaignManagerModal).not.toHaveBeenCalled()
    expect(ctx.$emit).not.toHaveBeenCalledWith('on-add-individual-printout-campaign', null, false)
  })

  it('method/detail helpers and record labels cover fallback branches', () => {
    expect(QuishingCampaignManagerParentTable.methods.getMethodDetail.call({}, null)).toEqual({})
    expect(QuishingCampaignManagerParentTable.methods.getMethodDetail.call({}, '{bad')).toEqual({})
    expect(
      QuishingCampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call({}, {
        status: 'Idle',
        frequency: 0
      })
    ).toBe('')
    expect(
      QuishingCampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call({}, {
        status: 'Running',
        frequency: null
      })
    ).toBe('View Report')
  })

  it('multiple delete payload and helper emits use both selectAll branches', () => {
    const emit = jest.fn()
    const row = { resourceId: 'r-1' }
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 7 }
    }

    QuishingCampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      [row],
      ['r-2'],
      false
    )
    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      { items: ['r-1'], excludedItems: ['r-2'], selectAll: false, filter: { FilterGroups: [] } },
      1
    )

    QuishingCampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      [row],
      ['r-2'],
      true
    )
    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      { items: [], excludedItems: ['r-2'], selectAll: true, filter: { FilterGroups: [] } },
      7
    )
  })

  it('error/tooltip/template-type helpers cover negative branches', () => {
    expect(QuishingCampaignManagerParentTable.methods.getErrorMessage({ status: 'Done' })).toBe('')
    expect(
      QuishingCampaignManagerParentTable.methods.getTooltipDisabilityStatus({
        status: 'Error',
        jobResultMessage: ''
      })
    ).toBe(true)
    expect(
      QuishingCampaignManagerParentTable.methods.checkIsQuishingTypePrintout({
        templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      })
    ).toBe(true)
    expect(QuishingCampaignManagerParentTable.methods.checkIsQuishingTypePrintout({})).toBe(false)
    expect(QuishingCampaignManagerParentTable.methods.getDataTableFieldLabel('status')).toBe(
      'label:status'
    )
    expect(getDataTableFieldLabel).toHaveBeenCalledWith('status')
  })

  it('mounted hook triggers callForData', () => {
    const callForData = jest.fn()
    QuishingCampaignManagerParentTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('row action helper methods emit expected events', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }
    const row = { resourceId: 'q-row' }

    QuishingCampaignManagerParentTable.methods.handleEdit.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.handlePreview.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.handleDelete.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.handleDuplicate.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.handleLaunch.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.handleRecordButtonClick.call(ctx, row)
    QuishingCampaignManagerParentTable.methods.toggleAddCampaignManagerModal.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-edit', row)
    expect(emit).toHaveBeenCalledWith('on-preview', row)
    expect(emit).toHaveBeenCalledWith('on-delete', row)
    expect(emit).toHaveBeenCalledWith('on-duplicate', row)
    expect(emit).toHaveBeenCalledWith('on-launch', row)
    expect(emit).toHaveBeenCalledWith('on-record-button-click', row)
    expect(emit).toHaveBeenCalledWith('toggle-add-campaign-manager-modal')
  })

  it('getMethodDetail returns parsed array on valid json', () => {
    const parsed = QuishingCampaignManagerParentTable.methods.getMethodDetail(
      '[{"method":"MFA","count":2}]'
    )
    expect(parsed).toEqual([{ method: 'MFA', count: 2 }])
  })

  it('callForData maps NaN-able values to numbers as implemented', async () => {
    QuishingService.searchCampaignManager.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ resourceId: 'q-na', targetUsers: 'abc', instanceCount: undefined }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
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

    expect(Number.isNaN(ctx.tableData[0].targetUsers)).toBe(true)
    expect(Number.isNaN(ctx.tableData[0].total)).toBe(true)
  })

  it('exportCampaignManagerList keeps lowercase xls as exportType and still downloads xlsx', async () => {
    QuishingService.exportCampaignManager.mockResolvedValueOnce({ data: new Uint8Array([1, 2]) })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:lower')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      getQuishingCampaignManagerParentExportPermissions: true,
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: {} }
    }
    QuishingCampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(QuishingService.exportCampaignManager).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls' })
    )
    expect(createdLinks[0].download).toBe('Campaign-Manager.xlsx')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('handlePrintPreview opens preview tab and sets title on load', async () => {
    QuishingService.getQuishingPdfCampaignPreviewContent.mockResolvedValueOnce({
      data: new Uint8Array([1, 2, 3])
    })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:preview')
    const openedWindow = { onload: null, document: { title: '' } }
    const openSpy = jest.spyOn(window, 'open').mockReturnValue(openedWindow)
    const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    QuishingCampaignManagerParentTable.methods.handlePrintPreview.call({}, { resourceId: 'q-prev' })
    await flushPromises()

    expect(QuishingService.getQuishingPdfCampaignPreviewContent).toHaveBeenCalledWith('q-prev')
    expect(openSpy).toHaveBeenCalledWith('blob:preview')
    expect(typeof openedWindow.onload).toBe('function')

    openedWindow.onload()
    expect(openedWindow.document.title).toBe('Quishing PDF Preview')

    window.URL.createObjectURL = originalCreateObjectURL
    openSpy.mockRestore()
    timeoutSpy.mockRestore()
  })
})
