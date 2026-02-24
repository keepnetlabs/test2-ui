jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getUsedCallbackNumbers: jest.fn(),
    searchCallbackCampaigns: jest.fn(),
    exportCallbackCampaigns: jest.fn()
  }
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
    }))
  }
})

import CampaignManagerParentTable from '@/components/CallbackCampaignManager/CampaignManagerParentTable.vue'
import CallbackService from '@/api/callback'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerParentTable.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('covers getRecordsButtonSingleLabel branches', () => {
    expect(
      CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call({}, {
        status: 'Idle',
        frequency: 0
      })
    ).toBe('')
    expect(
      CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call({}, {
        status: 'Running',
        frequency: 2
      })
    ).toBe('')
    expect(
      CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call({}, {
        status: 'Running',
        frequency: 0
      })
    ).toBe('View Report')
  })

  it('does not export when export permission is false', () => {
    const ctx = {
      getCallbackCampaignExportPermissions: false,
      axiosPayload: { orderBy: 'CreateTime', ascending: false, filter: {} }
    }

    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })

    expect(CallbackService.exportCallbackCampaigns).not.toHaveBeenCalled()
  })

  it('callForData skips explicit loading toggle on initial load and still finalizes', async () => {
    CallbackService.searchCallbackCampaigns.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const ctx = {
      getCallbackCampaignSearchPermissions: true,
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerParentTable.methods.callForData.call(ctx, { isInitial: true })
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalledTimes(1)
    expect(ctx.setLoading).toHaveBeenCalledWith()
  })

  it('builds bulk delete payload for selectAll=true', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 42 }
    }

    CampaignManagerParentTable.methods.handleMultipleDeleteOfCampaigns.call(
      ctx,
      [{ resourceId: 'r1' }],
      ['r2'],
      true
    )

    expect(emit).toHaveBeenCalledWith(
      'on-multiple-delete',
      {
        items: [],
        excludedItems: ['r2'],
        selectAll: true,
        filter: { FilterGroups: [] }
      },
      42
    )
  })

  it('covers tooltip and error message negative/positive branches', () => {
    expect(
      CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call({}, {
        status: 'Error',
        jobResultMessage: 'failed'
      })
    ).toBe(false)
    expect(
      CampaignManagerParentTable.methods.getErrorMessage.call({}, {
        status: 'Done',
        jobResultMessage: 'x'
      })
    ).toBe('')
  })

  it('keeps add button enabled when there are available numbers', async () => {
    CallbackService.getUsedCallbackNumbers.mockResolvedValueOnce({
      data: { data: { companyCount: 10, usedCount: 4 } }
    })
    const ctx = {
      tableOptions: { addButton: { disabled: false, tooltip: '' } },
      availablePhoneNumbers: 0,
      setLoading: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerParentTable.methods.callForAvailableNumbers.call(ctx, { isInitial: false })
    await flushPromises()

    expect(ctx.availablePhoneNumbers).toBe(6)
    expect(ctx.tableOptions.addButton.disabled).toBe(false)
    expect(ctx.callForData).toHaveBeenCalledWith({ isInitial: false })
  })

  it('watch statusItems handles missing status column without crashing', () => {
    const set = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns: [{ property: 'other' }] },
      $set: set,
      $refs: { refTable: { reRenderFilters } }
    }

    CampaignManagerParentTable.watch.statusItems.call(ctx, [{ text: 'Error' }])
    expect(set).toHaveBeenCalledWith(undefined, 'filterableItems', [{ text: 'Error', value: 'Error' }])
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('setLoading emits update:is-loading with default and explicit values', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    CampaignManagerParentTable.methods.setLoading.call(ctx)
    CampaignManagerParentTable.methods.setLoading.call(ctx, true)

    expect(emit).toHaveBeenNthCalledWith(1, 'update:is-loading', false)
    expect(emit).toHaveBeenNthCalledWith(2, 'update:is-loading', true)
  })

  it('exportCampaignManagerList no-ops when exportTypes is empty array', async () => {
    const ctx = {
      getCallbackCampaignExportPermissions: true,
      axiosPayload: { orderBy: 'CreateTime', ascending: false, filter: {} }
    }

    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: [],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(CallbackService.exportCallbackCampaigns).not.toHaveBeenCalled()
  })

  it('getMethodDetail returns empty object when methodDetail is falsy', () => {
    expect(CampaignManagerParentTable.methods.getMethodDetail.call({}, null)).toEqual({})
  })

  it('handleEdit emits edit event and created hook triggers callForNumbers', () => {
    const emit = jest.fn()
    CampaignManagerParentTable.methods.handleEdit.call({ $emit: emit }, { resourceId: 'c-1' })
    expect(emit).toHaveBeenCalledWith('on-edit', { resourceId: 'c-1' })

    const callForNumbers = jest.fn()
    CampaignManagerParentTable.created.call({ callForNumbers })
    expect(callForNumbers).toHaveBeenCalled()
  })

  it('canRenderAlertBox is false when available numbers exist', () => {
    expect(
      CampaignManagerParentTable.computed.canRenderAlertBox.call({
        isLoading: false,
        selectedNumberCount: 2,
        availablePhoneNumbers: 3
      })
    ).toBe(false)
  })

  it('callForData toggles loading at start when isInitial is false', async () => {
    CallbackService.searchCallbackCampaigns.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const ctx = {
      getCallbackCampaignSearchPermissions: true,
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerParentTable.methods.callForData.call(ctx, { isInitial: false })
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalledTimes(2)
    expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
  })

  it('exportCampaignManagerList keeps lowercase xls type and still downloads xlsx', async () => {
    CallbackService.exportCallbackCampaigns.mockResolvedValueOnce({ data: { ok: true } })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:lower-cb')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ href: '', download: '', click: jest.fn() })

    const ctx = {
      getCallbackCampaignExportPermissions: true,
      axiosPayload: { orderBy: 'CreateTime', ascending: false, filter: {} }
    }
    CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    const [payload] = CallbackService.exportCallbackCampaigns.mock.calls[0]
    expect(payload.exportType).toBe('xls')
    expect(createElementSpy.mock.results[0].value.download).toBe('callback-campaign-manager.xlsx')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })
})
