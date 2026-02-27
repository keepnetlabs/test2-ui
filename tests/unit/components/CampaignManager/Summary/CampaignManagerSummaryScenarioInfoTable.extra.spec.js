import { shallowMount } from '@vue/test-utils'
import CampaignManagerSummaryScenarioInfoTable from '@/components/CampaignManager/Summary/CampaignManagerSummaryScenarioInfoTable.vue'

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
})
