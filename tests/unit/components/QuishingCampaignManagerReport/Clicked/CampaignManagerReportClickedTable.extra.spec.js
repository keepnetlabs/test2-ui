import CampaignManagerReportClickedTable from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailClicked: jest.fn(),
    exportCampaignJobUserEmailClicked: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customClicked', label: 'Custom Clicked' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportClickedTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() printout branch creates single details action and hides resend select event', () => {
    const data = CampaignManagerReportClickedTable.data.call({
      getQuishingTypePrintOut: () => true,
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsClickedDetailsPermissions': true
        }
      }
    })

    expect(data.tableOptions.rowActions).toHaveLength(1)
    expect(data.tableOptions.rowActions[0].action).toBe('on-detail')
    expect(data.tableOptions.selectEvent.resend).toBe(false)
    expect(data.tableOptions.addButton.show).toBe(false)
  })

  it('customFields watcher skips insertion when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportClickedTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('callForData keeps existing activityType and defaults botActivityCount to 0', async () => {
    QuishingService.searchCampaignJobUserEmailClicked.mockResolvedValueOnce({
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
      botActivityCount: 99
    }

    CampaignManagerReportClickedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(ctx.botActivityCount).toBe(0)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
