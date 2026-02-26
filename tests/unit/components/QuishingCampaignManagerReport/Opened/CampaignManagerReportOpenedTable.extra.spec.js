import CampaignManagerReportOpenedTable from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailOpened: jest.fn(),
    exportCampaignJobUserEmailOpened: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOpened', label: 'Custom Opened' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() creates printout variant without row actions and with printout opened column', () => {
    const data = CampaignManagerReportOpenedTable.data.call({
      getQuishingTypePrintOut: () => true,
      $store: { getters: {} }
    })

    expect(data.tableOptions.rowActions).toEqual([])
    expect(data.tableOptions.selectEvent.resend).toBe(false)
    expect(data.tableOptions.columns.some((c) => c.property === 'openedCount')).toBe(true)
  })

  it('customFields watcher skips insertion when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportOpenedTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('callForData keeps existing activityType and defaults botActivityCount to 0', async () => {
    QuishingService.searchCampaignJobUserEmailOpened.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { activityType: 2, filter: {} },
      id: 'cmp-1',
      instanceGroup: 'ig-1',
      serverSideProps: {},
      tableData: [],
      botActivityCount: 9
    }

    CampaignManagerReportOpenedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(ctx.botActivityCount).toBe(0)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })

  it('handleOnResend maps array items with excluded ids and selectAll flag', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      $emit: emit
    }

    CampaignManagerReportOpenedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [1],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'x' }
    })
  })
})
