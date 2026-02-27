jest.mock('@/api/phishingsimulator', () => ({
  searchScenarioInfo: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import { shallowMount } from '@vue/test-utils'
import CampaignManagerSummaryScenarioInfoTable from '@/components/CampaignManager/Summary/CampaignManagerSummaryScenarioInfoTable.vue'
import { searchScenarioInfo } from '@/api/phishingsimulator'

describe('CampaignManagerSummaryScenarioInfoTable.vue (extra branches)', () => {
  describe('lifecycle boundary conditions', () => {
    it('created hook calls callForData if axiosPayload exists', () => {
      const ctx = {
        axiosPayload: { pageNumber: 1 },
        callForData: jest.fn()
      }
      CampaignManagerSummaryScenarioInfoTable.created.call(ctx)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('created hook bypasses callForData if axiosPayload is falsy', () => {
      const ctx = {
        axiosPayload: null,
        callForData: jest.fn()
      }
      CampaignManagerSummaryScenarioInfoTable.created.call(ctx)
      expect(ctx.callForData).not.toHaveBeenCalled()
    })
  })

  describe('watchers', () => {
    it('axiosPayload handler triggers data refresh if payload is valid', () => {
      const ctx = { callForData: jest.fn() }
      CampaignManagerSummaryScenarioInfoTable.watch.axiosPayload.handler.call(ctx, { search: 'foo' })
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('axiosPayload handler prevents data refresh if payload is undefined', () => {
      const ctx = { callForData: jest.fn() }
      CampaignManagerSummaryScenarioInfoTable.watch.axiosPayload.handler.call(ctx, undefined)
      expect(ctx.callForData).not.toHaveBeenCalled()
    })
  })

  describe('methods: callForData branching', () => {
    it('sets loading and updates serverSideProps on success', async () => {
      searchScenarioInfo.mockResolvedValue({
        data: {
          data: {
            results: [1, 2],
            totalNumberOfRecords: 10,
            totalNumberOfPages: 5,
            pageNumber: 1
          }
        }
      })
      
      const ctx = {
        setLoading: jest.fn(),
        axiosPayload: { p: 1 },
        serverSideProps: {},
        tableData: []
      }
      
      await CampaignManagerSummaryScenarioInfoTable.methods.callForData.call(ctx)
      
      expect(ctx.setLoading).toHaveBeenCalledWith(true)
      expect(searchScenarioInfo).toHaveBeenCalledWith({ p: 1 })
      expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
      expect(ctx.tableData).toEqual([1, 2])
    })
  })
})
