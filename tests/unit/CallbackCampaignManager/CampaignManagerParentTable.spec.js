jest.mock('@/api/callback', () => ({
  getUsedCallbackNumbers: jest.fn(),
  searchCallbackSettings: jest.fn(),
  searchCallbackCampaigns: jest.fn(),
  exportCallbackCampaigns: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'CreateTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    })),
    getDataTableFieldLabel: jest.fn((v) => `label:${v}`)
  }
})

import CampaignManagerParentTable from '@/components/CallbackCampaignManager/CampaignManagerParentTable.vue'
import CallbackService from '@/api/callback'
import { COLUMNS } from '@/components/CallbackCampaignManager/utils'
import { getDataTableFieldLabel } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerParentTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes alertbox rendering status', () => {
    expect(
      CampaignManagerParentTable.computed.canRenderAlertBox.call({
        isLoading: false,
        selectedNumberCount: 2,
        availablePhoneNumbers: 0
      })
    ).toBe(true)
    expect(
      CampaignManagerParentTable.computed.canRenderAlertBox.call({
        isLoading: true,
        selectedNumberCount: 2,
        availablePhoneNumbers: 0
      })
    ).toBe(false)
  })

  it('statusItems watcher maps filters and safely rerenders', () => {
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
    CampaignManagerParentTable.watch.statusItems.call(ctx, [{ text: 'Running' }])
    expect(col.filterableItems).toEqual([{ text: 'Running', value: 'Running' }])
    expect(reRenderFilters).toHaveBeenCalled()

    const ctxNoRef = { tableOptions: { columns: [col] }, $set: set, $refs: {} }
    expect(() => CampaignManagerParentTable.watch.statusItems.call(ctxNoRef, [])).not.toThrow()
  })

  it('callForNumbers sets empty-state when there is no selected callback number', async () => {
    CallbackService.searchCallbackSettings.mockResolvedValue({
      data: { data: { totalNumberOfRecords: 0 } }
    })

    const ctx = {
      callbackPayload: {},
      selectedNumberCount: 1,
      tableOptions: {
        iEmpty: { message: 'old', btn: 'old', action: 'x', icon: 'i' },
        addButton: { disabled: false }
      },
      tableData: [{ id: 1 }],
      setLoading: jest.fn(),
      callForAvailableNumbers: jest.fn()
    }

    CampaignManagerParentTable.methods.callForNumbers.call(ctx)
    await flushPromises()

    expect(ctx.selectedNumberCount).toBe(0)
    expect(ctx.tableOptions.iEmpty.btn).toBe('GO TO SETTINGS')
    expect(ctx.tableOptions.iEmpty.action).toBe('on-go-to-settings')
    expect(ctx.tableOptions.addButton.disabled).toBe(true)
    expect(ctx.tableData).toEqual([])
    expect(ctx.callForAvailableNumbers).not.toHaveBeenCalled()
    expect(ctx.setLoading).toHaveBeenLastCalledWith(false)
  })

  it('callForNumbers delegates to callForAvailableNumbers when settings count exists', async () => {
    CallbackService.searchCallbackSettings.mockResolvedValue({
      data: { data: { totalNumberOfRecords: 4 } }
    })
    const ctx = {
      callbackPayload: {},
      setLoading: jest.fn(),
      callForAvailableNumbers: jest.fn()
    }

    CampaignManagerParentTable.methods.callForNumbers.call(ctx)
    await flushPromises()
    expect(ctx.callForAvailableNumbers).toHaveBeenCalledWith({ isInitial: true })
  })

  it('callForAvailableNumbers handles success and failure branches', async () => {
    CallbackService.getUsedCallbackNumbers.mockResolvedValueOnce({
      data: { data: { companyCount: 2, usedCount: 2 } }
    })
    CallbackService.getUsedCallbackNumbers.mockRejectedValueOnce(new Error('network'))

    const ctx = {
      availablePhoneNumbers: 5,
      tableOptions: { addButton: { disabled: false, tooltip: '' } },
      setLoading: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerParentTable.methods.callForAvailableNumbers.call(ctx, { isInitial: true })
    await flushPromises()
    expect(ctx.availablePhoneNumbers).toBe(0)
    expect(ctx.tableOptions.addButton.disabled).toBe(true)
    expect(ctx.callForData).toHaveBeenCalledWith({ isInitial: true })

    CampaignManagerParentTable.methods.callForAvailableNumbers.call(ctx, {})
    await flushPromises()
    expect(ctx.tableOptions.addButton.disabled).toBe(true)
    expect(ctx.callForData).toHaveBeenCalledWith({ isInitial: undefined })
  })

  it('callForData maps server-side data only with search permission', async () => {
    CallbackService.searchCallbackCampaigns.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'c1', targetUsers: '3', instanceCount: '7' }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 2
        }
      }
    })
    const ctx = {
      getCallbackCampaignSearchPermissions: true,
      axiosPayload: {},
      tableData: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 },
      setLoading: jest.fn()
    }
    CampaignManagerParentTable.methods.callForData.call(ctx, {})
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.tableData).toEqual([{ resourceId: 'c1', targetUsers: 3, total: 7 }])

    const noPermCtx = {
      getCallbackCampaignSearchPermissions: false,
      setLoading: jest.fn(),
      tableData: [],
      serverSideProps: {}
    }
    CampaignManagerParentTable.methods.callForData.call(noPermCtx, {})
    expect(CallbackService.searchCallbackCampaigns).toHaveBeenCalledTimes(1)
    expect(noPermCtx.setLoading).not.toHaveBeenCalled()
  })

  it('exports campaigns with extension mapping when export permission exists', async () => {
    CallbackService.exportCallbackCampaigns.mockResolvedValue({ data: { ok: true } })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:x')
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      createdLinks.push(link)
      return link
    })

    const ctx = {
      getCallbackCampaignExportPermissions: true,
      axiosPayload: { orderBy: 'CreateTime', ascending: false, filter: { FilterGroups: [] } }
    }
    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(CallbackService.exportCallbackCampaigns).toHaveBeenCalledTimes(2)
    expect(CallbackService.exportCallbackCampaigns.mock.calls[0][0].exportType).toBe('Excel')
    expect(createdLinks[0].download).toBe('callback-campaign-manager.xlsx')
    expect(createdLinks[1].download).toBe('callback-campaign-manager.csv')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('forwards helpers and row action events', () => {
    const push = jest.fn()
    CampaignManagerParentTable.methods.handleGoToSettings.call({ $router: { push } })
    expect(push).toHaveBeenCalledWith('/callback-simulator/settings')

    expect(CampaignManagerParentTable.methods.getMethodDetail.call({}, '{bad')).toEqual({})
    expect(
      CampaignManagerParentTable.methods.getMethodDetail.call({}, '[{"method":"MFA","count":2}]')
    ).toEqual([{ method: 'MFA', count: 2 }])

    expect(
      CampaignManagerParentTable.methods.getErrorMessage.call({}, {
        status: 'Error',
        jobResultMessage: 'x'
      })
    ).toBe('x')
    expect(CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call({}, {})).toBe(true)
    expect(CampaignManagerParentTable.methods.getDataTableFieldLabel.call({}, 'status')).toBe(
      'label:status'
    )
    expect(getDataTableFieldLabel).toHaveBeenCalledWith('status')

    const emit = jest.fn()
    const ctx = { $emit: emit, axiosPayload: { filter: {} }, serverSideProps: { totalNumberOfRecords: 8 } }
    const row = { resourceId: 'r1' }
    CampaignManagerParentTable.methods.handleRecordButtonClick.call(ctx, row)
    CampaignManagerParentTable.methods.toggleAddCampaignManagerModal.call(ctx)
    CampaignManagerParentTable.methods.handlePreview.call(ctx, row)
    CampaignManagerParentTable.methods.handleDelete.call(ctx, row)
    CampaignManagerParentTable.methods.handleDuplicate.call(ctx, row)
    CampaignManagerParentTable.methods.handleLaunch.call(ctx, row)
    CampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      [row],
      ['r2'],
      false
    )

    expect(emit).toHaveBeenCalledWith('on-record-button-click', row)
    expect(emit).toHaveBeenCalledWith('toggle-add-campaign-manager-modal')
    expect(emit).toHaveBeenCalledWith('on-preview', row)
    expect(emit).toHaveBeenCalledWith('on-delete', row)
    expect(emit).toHaveBeenCalledWith('on-duplicate', row)
    expect(emit).toHaveBeenCalledWith('on-launch', row)
    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      { items: ['r1'], excludedItems: ['r2'], selectAll: false, filter: {} },
      1
    )
  })
})
