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

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerItemTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTableAllRecordsText and canRenderAlertBox cover fallback branches', () => {
    expect(
      CampaignManagerItemTable.computed.getTableAllRecordsText.call({
        item: { name: 'CB Campaign' }
      })
    ).toBe('Campaign Name: CB Campaign')
    expect(
      CampaignManagerItemTable.computed.getTableAllRecordsText.call({
        item: null
      })
    ).toBe('Campaign Name: undefined')

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
  })

  it('toggleShowDeleteDialog and handleDelete cover open/close/default-row branches', () => {
    const ctx = {
      isShowDeleteDialog: false,
      selectedRow: { id: 'x' }
    }
    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 'x' })

    CampaignManagerItemTable.methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({})

    const handleCtx = {
      selectedRow: { old: 1 },
      toggleShowDeleteDialog: jest.fn()
    }
    CampaignManagerItemTable.methods.handleDelete.call(handleCtx)
    expect(handleCtx.selectedRow).toEqual({})
    expect(handleCtx.toggleShowDeleteDialog).toHaveBeenCalled()
  })

  it('callForData sets loading when not initial and maps empty results safely', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })
    const ctx = {
      item: { resourceId: 'cb-1' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx, { isInitial: false })
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(CallbackService.searchCallbackJobs).toHaveBeenCalledWith('cb-1', ctx.axiosPayload)
    expect(ctx.tableData).toEqual([])
  })

  it('callForAvailableNumbers keeps add button as-is when numbers are available', async () => {
    CallbackService.getUsedCallbackNumbers.mockResolvedValue({
      data: { data: { companyCount: 6, usedCount: 2 } }
    })
    const callForData = jest.fn()
    const ctx = {
      availablePhoneNumbers: 0,
      tableOptions: { addButton: { disabled: false, tooltip: 'Add a Campaign' } },
      setLoading: jest.fn(),
      callForData
    }

    CampaignManagerItemTable.methods.callForAvailableNumbers.call(ctx, { isInitial: true })
    await flushPromises()

    expect(ctx.availablePhoneNumbers).toBe(4)
    expect(ctx.tableOptions.addButton.disabled).toBe(false)
    expect(ctx.tableOptions.addButton.tooltip).toBe('Add a Campaign')
    expect(callForData).toHaveBeenCalledWith({ isInitial: true })
  })

  it('record/add/back handlers and safe filter helper methods emit/call properly', () => {
    const emit = jest.fn()
    const resetSearchText = jest.fn()
    const reRenderFilters = jest.fn()
    const ctx = {
      item: { resourceId: 'cb-2', frequency: 0 },
      $emit: emit,
      $refs: { refTable: { resetSearchText, reRenderFilters } }
    }

    CampaignManagerItemTable.methods.handleBackClick.call(ctx)
    CampaignManagerItemTable.methods.handleOnAddButtonClick.call(ctx)
    CampaignManagerItemTable.methods.handleRecordButtonClick.call(ctx, { instanceGroup: 'ig-1' })
    expect(emit).toHaveBeenCalledWith('on-back-click')
    expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'cb-2' })
    expect(emit).toHaveBeenCalledWith('on-record-button-click', { instanceGroup: 'ig-1' })

    CampaignManagerItemTable.methods.resetSearchText.call(ctx)
    CampaignManagerItemTable.methods.reRenderFilters.call(ctx, {})
    expect(resetSearchText).toHaveBeenCalled()
    expect(reRenderFilters).toHaveBeenCalledWith({})

    expect(
      CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: null } },
        { status: 'Completed' }
      )
    ).toBe('View Report')
    expect(
      CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: 1 } },
        { status: 'Completed' }
      )
    ).toBe('')
    expect(
      CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(
        { item: { frequency: 0 } },
        { status: 'Idle' }
      )
    ).toBe('')
  })

  it('callForData maps invalid frequencyCount to total 0', async () => {
    CallbackService.searchCallbackJobs.mockResolvedValue({
      data: {
        data: {
          results: [{ instanceGroup: 'i-1', frequencyCount: 'invalid' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 'cb-3' },
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CampaignManagerItemTable.methods.callForData.call(ctx, { isInitial: false })
    await flushPromises()

    expect(ctx.tableData).toEqual([{ instanceGroup: 'i-1', total: 0 }])
  })

  it('reRenderFilters safely forwards undefined filter values', () => {
    const reRenderFilters = jest.fn()
    const ctx = { $refs: { refTable: { reRenderFilters } } }
    CampaignManagerItemTable.methods.reRenderFilters.call(ctx)
    expect(reRenderFilters).toHaveBeenCalledWith(undefined)
  })
})
