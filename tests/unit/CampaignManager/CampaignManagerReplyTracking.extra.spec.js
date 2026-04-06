jest.mock('@/api/domains', () => ({
  getDomainsList: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn(() => ({ pageSize: 1000, filter: {} }))
}))

import CampaignManagerReplyTracking from '@/components/CampaignManager/CampaignManagerReplyTracking'
import { getDomainsList } from '@/api/domains'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReplyTracking.vue (extra methods)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('callForDomains', () => {
    it('maps API results to text/value domainItems', async () => {
      getDomainsList.mockResolvedValue({
        data: {
          data: {
            results: [{ domain: 'alpha.test' }, { domain: 'beta.test' }]
          }
        }
      })
      const ctx = {
        axiosPayload: { pageSize: 1000 },
        domainItems: []
      }
      CampaignManagerReplyTracking.methods.callForDomains.call(ctx)
      await flushPromises()
      expect(getDomainsList).toHaveBeenCalledWith(ctx.axiosPayload)
      expect(ctx.domainItems).toEqual([
        { text: 'alpha.test', value: 'alpha.test' },
        { text: 'beta.test', value: 'beta.test' }
      ])
    })

    it('sets empty domainItems when API returns no results', async () => {
      getDomainsList.mockResolvedValue({
        data: { data: { results: [] } }
      })
      const ctx = { axiosPayload: {}, domainItems: [{ text: 'stale' }] }
      CampaignManagerReplyTracking.methods.callForDomains.call(ctx)
      await flushPromises()
      expect(ctx.domainItems).toEqual([])
    })
  })

  describe('handleDomainChange', () => {
    it('merges subDomain into value and emits input', () => {
      const emit = jest.fn()
      const value = {
        isEnabled: true,
        subDomain: 'old',
        domain: 'd.com',
        isSaveContentEnabled: false,
        isOutOfOfficeEnabled: false
      }
      CampaignManagerReplyTracking.methods.handleDomainChange.call(
        { value, $emit: emit },
        'new-sub'
      )
      expect(emit).toHaveBeenCalledWith('input', {
        ...value,
        subDomain: 'new-sub'
      })
    })

    it('emits cleared subDomain when input is empty string', () => {
      const emit = jest.fn()
      const value = {
        isEnabled: true,
        subDomain: 'old-sub',
        domain: 'd.com',
        isSaveContentEnabled: false,
        isOutOfOfficeEnabled: false
      }
      CampaignManagerReplyTracking.methods.handleDomainChange.call({ value, $emit: emit }, '')
      expect(emit).toHaveBeenCalledWith('input', {
        ...value,
        subDomain: ''
      })
    })
  })
})
