jest.mock('@/api/domainBlocklist', () => ({
  getAllDomainBlocklistStatuses: jest.fn()
}))

import domainSuggest from '@/mixins/domainSuggest'
import { getAllDomainBlocklistStatuses } from '@/api/domainBlocklist'

const pool = [
  { value: '1', text: 'random-store.net' },
  { value: '2', text: 'acme-bank-login.com' },
  { value: '3', text: 'phishy.com' }
]

const freshState = () => ({
  statusMap: null,
  candidates: [],
  excludedCount: 0,
  appliedValue: null,
  cursor: -1,
  message: '',
  isLoading: false
})

const makeCtx = (overrides = {}) => ({
  domainRecords: pool,
  contentText: 'Acme Bank secure login',
  domainSuggest: freshState(),
  handleChangeDomainRecord: jest.fn(),
  // pull real implementations under test
  suggestDomain: domainSuggest.methods.suggestDomain,
  buildDomainSuggestMessage: domainSuggest.methods.buildDomainSuggestMessage,
  resetDomainSuggest: domainSuggest.methods.resetDomainSuggest,
  ...overrides
})

const computed = domainSuggest.computed

describe('domainSuggest mixin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getAllDomainBlocklistStatuses.mockResolvedValue({
      data: { domains: [{ domain: 'phishy.com', status: 'malicious' }] }
    })
  })

  describe('isDomainSuggestDisabled', () => {
    it('is disabled with an empty pool', () => {
      expect(computed.isDomainSuggestDisabled.call({ domainRecords: [] })).toBe(true)
    })
    it('is enabled with a non-empty pool', () => {
      expect(computed.isDomainSuggestDisabled.call({ domainRecords: pool })).toBe(false)
    })
  })

  describe('domainSuggestIcon', () => {
    it('hides the icon when disabled', () => {
      expect(
        computed.domainSuggestIcon.call({ isDomainSuggestDisabled: true, domainSuggest: freshState() })
      ).toBe('')
    })
    it('shows the wand normally and the spinner while loading', () => {
      expect(
        computed.domainSuggestIcon.call({ isDomainSuggestDisabled: false, domainSuggest: { isLoading: false } })
      ).toBe('mdi-auto-fix')
      expect(
        computed.domainSuggestIcon.call({ isDomainSuggestDisabled: false, domainSuggest: { isLoading: true } })
      ).toBe('mdi-loading')
    })
  })

  describe('suggestDomain', () => {
    it('applies the best content match and excludes blacklisted domains on first click', async () => {
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(getAllDomainBlocklistStatuses).toHaveBeenCalledTimes(1)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('2') // acme-bank-login.com
      expect(ctx.domainSuggest.appliedValue).toBe('2')
      expect(ctx.domainSuggest.excludedCount).toBe(1)
      expect(ctx.domainSuggest.message).toBe('matched: acme, bank · 1 risky skipped')
      expect(ctx.domainSuggest.isLoading).toBe(false)
    })

    it('cycles to the next candidate on repeated clicks and does not refetch statuses', async () => {
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx) // -> acme-bank-login.com (best)
      await domainSuggest.methods.suggestDomain.call(ctx) // -> next: random-store.net
      expect(getAllDomainBlocklistStatuses).toHaveBeenCalledTimes(1) // cached
      expect(ctx.handleChangeDomainRecord).toHaveBeenLastCalledWith('1')
      expect(ctx.domainSuggest.appliedValue).toBe('1')
    })

    it('avoids re-selecting the already-chosen domain on a no-match (random) click', async () => {
      // No keyword overlap → all scores 0, candidates keep pool order: random-store('1'), acme('2').
      // Current selection is '1', so the first pick would be a no-op → step to '2'.
      const ctx = makeCtx({ contentText: 'lorem ipsum dolor', value: { domainRecordId: '1' } })
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('2')
      expect(ctx.domainSuggest.message).toBe('random clean domain · 1 risky skipped')
    })

    it('reports when no eligible domain exists and never selects one', async () => {
      getAllDomainBlocklistStatuses.mockResolvedValue({
        data: {
          domains: [
            { domain: 'random-store.net', status: 'malicious' },
            { domain: 'acme-bank-login.com', status: 'suspicious' },
            { domain: 'phishy.com', status: 'malicious' }
          ]
        }
      })
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).not.toHaveBeenCalled()
      expect(ctx.domainSuggest.message).toBe('No eligible (non-blacklisted) domain available')
    })

    it('still suggests (best effort) when the blocklist service fails', async () => {
      getAllDomainBlocklistStatuses.mockRejectedValueOnce(new Error('network'))
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.domainSuggest.statusMap).toEqual({})
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalled()
    })

    it('ignores clicks while disabled or already loading', async () => {
      const disabled = makeCtx({ isDomainSuggestDisabled: true })
      await domainSuggest.methods.suggestDomain.call(disabled)
      expect(getAllDomainBlocklistStatuses).not.toHaveBeenCalled()

      const loading = makeCtx()
      loading.domainSuggest.isLoading = true
      await domainSuggest.methods.suggestDomain.call(loading)
      expect(getAllDomainBlocklistStatuses).not.toHaveBeenCalled()
    })
  })

  describe('buildDomainSuggestMessage', () => {
    it('confirms a plain clean pick when nothing matched', () => {
      const ctx = { domainSuggest: { excludedCount: 0 } }
      expect(
        domainSuggest.methods.buildDomainSuggestMessage.call(ctx, { matchedKeywords: [] })
      ).toBe('random clean domain')
    })

    it('appends the risky-skipped count to a clean pick', () => {
      const ctx = { domainSuggest: { excludedCount: 2 } }
      expect(
        domainSuggest.methods.buildDomainSuggestMessage.call(ctx, { matchedKeywords: [] })
      ).toBe('random clean domain · 2 risky skipped')
    })

    it('combines matched keywords and risky-skipped count', () => {
      const ctx = { domainSuggest: { excludedCount: 1 } }
      expect(
        domainSuggest.methods.buildDomainSuggestMessage.call(ctx, { matchedKeywords: ['acme', 'bank'] })
      ).toBe('matched: acme, bank · 1 risky skipped')
    })
  })

  describe('resetDomainSuggest', () => {
    it('clears suggestion state and optionally drops cached statuses', () => {
      const ctx = {
        domainSuggest: {
          statusMap: { a: 'clean' },
          candidates: [{}],
          excludedCount: 2,
          appliedValue: 'x',
          cursor: 3,
          message: 'hi'
        }
      }
      domainSuggest.methods.resetDomainSuggest.call(ctx, true)
      expect(ctx.domainSuggest).toMatchObject({
        statusMap: null,
        candidates: [],
        excludedCount: 0,
        appliedValue: null,
        cursor: -1,
        message: ''
      })
    })
  })
})
