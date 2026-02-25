jest.mock('@/api/phishingsimulator', () => ({
  __esModule: true,
  callForCampaignReports: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              method: 'Click-Only',
              status: 'Error',
              jobResultMessage: 'failed',
              totalNoResponseCount: 5,
              totalClickedCount: 2,
              totalOpenedCount: 1,
              emailDeliveredUserCount: 8,
              totalTargetUserCount: 10
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportCampaignReports: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  getDefaultAxiosPayload: jest.fn(() => ({ orderBy: 'CreatedDate', ascending: true, filter: {} })),
  getDataTableFieldLabel: jest.fn((v) => v),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn)
}))

import CampaignReportsTable from '@/components/CampaignReports/CampaignReportsTable.vue'
import { callForCampaignReports } from '@/api/phishingsimulator'

describe('CampaignReportsTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignReportsTable.name).toBe('CampaignReportsTable')
  })

  it('getMethodDetail parses json and handles invalid json', () => {
    expect(CampaignReportsTable.methods.getMethodDetail.call({}, '[{"method":"A","count":1}]')).toEqual([
      { method: 'A', count: 1 }
    ])
    expect(CampaignReportsTable.methods.getMethodDetail.call({}, 'invalid')).toEqual({})
  })

  it('getChartOptionsForRow returns method-specific labels', () => {
    const mfa = CampaignReportsTable.methods.getChartOptionsForRow.call({}, { method: 'MFA' })
    expect(mfa.labels).toContain('Submitted MFA Code')
    const clickOnly = CampaignReportsTable.methods.getChartOptionsForRow.call({}, { method: 'Click-Only' })
    expect(clickOnly.labels).toEqual(['No Response', 'Clicked', 'Opened'])
  })

  it('callForData maps rows, campaignStatus and progress', async () => {
    const ctx = {
      axiosPayload: { orderBy: 'CreatedDate', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    CampaignReportsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(callForCampaignReports).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].campaignStatus).toEqual([5, 2, 1])
    expect(ctx.tableData[0].progress).toBe(80)
    expect(ctx.tableData[0].customKey).toBe('key-rnd')
  })

  it('emits row actions and tooltip status logic', () => {
    const $emit = jest.fn()
    CampaignReportsTable.methods.handleViewReport.call({ $emit }, { id: 1 })
    CampaignReportsTable.methods.handleDelete.call({ $emit }, { id: 2 })
    expect($emit).toHaveBeenCalledWith('on-view-report', { id: 1 })
    expect($emit).toHaveBeenCalledWith('on-delete', { id: 2 })

    expect(CampaignReportsTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Error', jobResultMessage: 'x' })).toBe(false)
    expect(CampaignReportsTable.methods.getTooltipDisabilityStatus.call({}, { status: 'Completed', jobResultMessage: '' })).toBe(true)
  })
})
