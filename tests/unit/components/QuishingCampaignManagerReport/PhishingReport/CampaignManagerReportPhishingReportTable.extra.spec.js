import CampaignManagerReportPhishingReportTable from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserPhishingReport: jest.fn(),
    exportCampaignJobUserPhishingReport: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customPR', label: 'Custom PR' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReportTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher skips insertion when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportPhishingReportTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('handleOnResend supports array payload with excluded ids and selectAll', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'r' } },
      $emit: emit
    }

    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [6],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'r' }
    })
  })

  it('callForData handles empty customFieldValues and finalizes loading', async () => {
    QuishingService.searchCampaignJobUserPhishingReport.mockResolvedValueOnce({
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
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      id: 'cmp-1',
      instanceGroup: 'ig-1',
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportPhishingReportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toHaveLength(1)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
