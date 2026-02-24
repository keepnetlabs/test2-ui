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
})
