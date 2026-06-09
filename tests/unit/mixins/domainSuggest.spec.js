jest.mock('@/api/domainBlocklist', () => ({
  getAllDomainBlocklistStatuses: jest.fn(),
  getDomainBlocklistStatus: jest.fn()
}))
jest.mock('@/api/domainSuggest', () => ({
  suggestDomainByContent: jest.fn()
}))

import domainSuggest from '@/mixins/domainSuggest'
import { getAllDomainBlocklistStatuses, getDomainBlocklistStatus } from '@/api/domainBlocklist'
import { suggestDomainByContent } from '@/api/domainSuggest'

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
  isLoading: false,
  aiPreferredValue: null,
  aiComputedFor: undefined
})

const makeCtx = (overrides = {}) => ({
  domainRecords: pool,
  contentText: 'Acme Bank secure login',
  domainSuggest: freshState(),
  handleChangeDomainRecord: jest.fn(),
  // pull real implementations under test
  suggestDomain: domainSuggest.methods.suggestDomain,
  resolveSafePick: domainSuggest.methods.resolveSafePick,
  verifyDomainStatus: domainSuggest.methods.verifyDomainStatus,
  buildDomainSuggestMessage: domainSuggest.methods.buildDomainSuggestMessage,
  resetDomainSuggest: domainSuggest.methods.resetDomainSuggest,
  ensureAiPreferred: domainSuggest.methods.ensureAiPreferred,
  ...overrides
})

const computed = domainSuggest.computed

describe('domainSuggest mixin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getAllDomainBlocklistStatuses.mockResolvedValue({
      data: { domains: [{ domain: 'phishy.com', status: 'malicious' }] }
    })
    // Per-domain verification: clean by default unless a test overrides it.
    getDomainBlocklistStatus.mockResolvedValue({ data: { status: 'clean' } })
    // No AI preference by default → pure rule-based ranking (worker may be unconfigured/down).
    suggestDomainByContent.mockResolvedValue(null)
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
      expect(ctx.domainSuggest.message).toBe('clean domain selected')
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
      expect(ctx.domainSuggest.message).toBe('clean domain selected')
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

    it('still suggests (best effort) when the bulk blocklist service fails', async () => {
      getAllDomainBlocklistStatuses.mockRejectedValueOnce(new Error('network'))
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalled()
    })

    it('never selects a domain the per-domain check flags, even if missing from the bulk list', async () => {
      // Bulk list reports nothing → no exclusions from rankDomains.
      getAllDomainBlocklistStatuses.mockResolvedValue({ data: { domains: [] } })
      // But the authoritative per-domain check says the best match (acme-bank-login) is malicious.
      getDomainBlocklistStatus.mockImplementation((domain) =>
        Promise.resolve({ data: { status: domain === 'acme-bank-login.com' ? 'malicious' : 'clean' } })
      )
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalled()
      expect(ctx.handleChangeDomainRecord).not.toHaveBeenCalledWith('2') // acme-bank-login skipped
      expect(ctx.domainSuggest.statusMap['acme-bank-login.com']).toBe('malicious')
    })

    it('lets the AI preference win the first pick over the rule-based best', async () => {
      // Rule-based best for "Acme Bank…" is acme-bank-login.com ('2'); AI prefers random-store ('1').
      suggestDomainByContent.mockResolvedValue('1')
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('1')
      expect(ctx.domainSuggest.appliedValue).toBe('1')
    })

    it('ignores an AI pick outside the eligible pool and falls back to rule-based', async () => {
      suggestDomainByContent.mockResolvedValue('999') // not a real candidate
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(ctx.handleChangeDomainRecord).toHaveBeenCalledWith('2') // rule-based best
    })

    it('computes the AI preference once and reuses it across cycle clicks', async () => {
      suggestDomainByContent.mockResolvedValue('1')
      const ctx = makeCtx()
      await domainSuggest.methods.suggestDomain.call(ctx)
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(suggestDomainByContent).toHaveBeenCalledTimes(1) // not re-called while cycling
    })

    it('forwards the edited template language to the AI worker as a hint', async () => {
      const ctx = makeCtx({ suggestLanguage: 'Turkish (Türkiye)' })
      await domainSuggest.methods.suggestDomain.call(ctx)
      expect(suggestDomainByContent).toHaveBeenCalledWith(
        expect.objectContaining({ language: 'Turkish (Türkiye)' })
      )
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
    it('returns a simple confirmation message', () => {
      expect(domainSuggest.methods.buildDomainSuggestMessage.call({})).toBe('clean domain selected')
    })
  })

  describe('value.domainRecordId watcher', () => {
    const watcher = domainSuggest.watch['value.domainRecordId']

    it('clears a stale note when the domain changes outside the wand', () => {
      const ctx = { domainSuggest: { message: 'clean domain selected', appliedValue: '2', cursor: 0 } }
      watcher.call(ctx, '5') // user manually picked a different domain
      expect(ctx.domainSuggest.message).toBe('')
      expect(ctx.domainSuggest.appliedValue).toBeNull()
      expect(ctx.domainSuggest.cursor).toBe(-1)
    })

    it('keeps the note when the change came from the wand itself', () => {
      const ctx = { domainSuggest: { message: 'clean domain selected', appliedValue: '2', cursor: 0 } }
      watcher.call(ctx, '2') // same value the wand just applied
      expect(ctx.domainSuggest.message).toBe('clean domain selected')
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
