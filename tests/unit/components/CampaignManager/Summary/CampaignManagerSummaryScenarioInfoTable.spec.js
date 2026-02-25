jest.mock('@/api/phishingsimulator', () => ({
  __esModule: true,
  searchScenarioInfo: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ category: 'Finance', method: 'Click-Only', language: 'EN', difficulty: 'Easy', numberOfScenarios: 3 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

import CampaignManagerSummaryScenarioInfoTable from '@/components/CampaignManager/Summary/CampaignManagerSummaryScenarioInfoTable.vue'
import { searchScenarioInfo } from '@/api/phishingsimulator'

describe('CampaignManagerSummaryScenarioInfoTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignManagerSummaryScenarioInfoTable.name).toBe('CampaignManagerSummaryScenarioInfoTable')
  })

  it('callForData sets paging fields and table rows', async () => {
    const ctx = {
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    CampaignManagerSummaryScenarioInfoTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(searchScenarioInfo).toHaveBeenCalledWith({ filter: {} })
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([
      { category: 'Finance', method: 'Click-Only', language: 'EN', difficulty: 'Easy', numberOfScenarios: 3 }
    ])
  })
})
