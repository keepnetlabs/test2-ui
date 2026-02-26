import CampaignManagerReportNoResponseTable from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserNoResponse: jest.fn(),
    exportCampaignJobUserNoResponse: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customNR', label: 'Custom NR' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportNoResponseTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() printout branch hides resend actions and enables fixed scenario column', () => {
    const data = CampaignManagerReportNoResponseTable.data.call({
      getQuishingTypePrintOut: () => true
    })

    expect(data.tableOptions.rowActions).toEqual([])
    expect(data.tableOptions.selectEvent.resend).toBe(false)
    const scenarioCol = data.tableOptions.columns.find((c) => c.property === 'quishingScenarioName')
    expect(scenarioCol.fixed).toBe('right')
  })

  it('customFields watcher skips insert when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportNoResponseTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('handleOnResend supports array payload with excluded ids and selectAll', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      $emit: emit
    }

    CampaignManagerReportNoResponseTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [4],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'x' }
    })
  })

  it('callForData finalizes loading with empty custom fields', async () => {
    QuishingService.searchCampaignJobUserNoResponse.mockResolvedValueOnce({
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

    CampaignManagerReportNoResponseTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toHaveLength(1)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
