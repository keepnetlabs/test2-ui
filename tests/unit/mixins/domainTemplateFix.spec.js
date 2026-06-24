jest.mock('@/api/domainBlocklist', () => ({
  getAllDomainBlocklistStatuses: jest.fn(),
  getDomainBlocklistStatus: jest.fn()
}))
jest.mock('@/api/landingPage', () => ({
  getLandingPageFormDetails: jest.fn(),
  getLandingPageTemplate: jest.fn(),
  updateLandingPage: jest.fn()
}))
jest.mock('@/api/domainSuggest', () => ({
  suggestDomainByContent: jest.fn()
}))
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getLandingPageTemplateFormDetails: jest.fn(),
    getLandingPageTemplate: jest.fn(),
    updateLandingPageTemplate: jest.fn()
  }
}))
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getLandingPageFormDetails: jest.fn(),
    getLandingPageTemplate: jest.fn(),
    updateLandingPage: jest.fn()
  }
}))

import domainTemplateFix from '@/mixins/domainTemplateFix'
import { getAllDomainBlocklistStatuses, getDomainBlocklistStatus } from '@/api/domainBlocklist'
import {
  getLandingPageFormDetails,
  getLandingPageTemplate,
  updateLandingPage
} from '@/api/landingPage'
import { suggestDomainByContent } from '@/api/domainSuggest'
import smishingApi from '@/api/smishing'
import quishingApi from '@/api/quishing'

const rawPool = [
  { id: 1, domain: 'random-store.net', urlSchemaType: 'https', urlSchemaTypeId: 2, isStopBotActivity: false },
  { id: 2, domain: 'acme-bank-login.com', urlSchemaType: 'https', urlSchemaTypeId: 2, isStopBotActivity: false },
  { id: 3, domain: 'phishy.com', urlSchemaType: 'http', urlSchemaTypeId: 1, isStopBotActivity: false }
]

const freshState = () => ({
  domainRecords: null,
  statusMap: null,
  cursor: -1,
  message: '',
  isLoading: false,
  aiPreferredValue: null,
  aiComputedFor: undefined
})

const makeCtx = (overrides = {}) => {
  const ctx = {
    domainFix: freshState(),
    domainFixResourceId: 'lp-1',
    domainFixContentText: 'Acme Bank secure login',
    refreshAfterDomainFix: jest.fn(),
    domainFixChannel: 'phishing',
    fixDomain: domainTemplateFix.methods.fixDomain,
    loadDomainFixApi: domainTemplateFix.methods.loadDomainFixApi,
    resolveSafeDomainFixPick: domainTemplateFix.methods.resolveSafeDomainFixPick,
    verifyDomainFixStatus: domainTemplateFix.methods.verifyDomainFixStatus,
    ensureAiPreferredFix: domainTemplateFix.methods.ensureAiPreferredFix,
    ...overrides
  }
  // mirror the computed
  if (!('isDomainFixDisabled' in overrides)) {
    ctx.isDomainFixDisabled = !ctx.domainFixResourceId
  }
  return ctx
}

const computed = domainTemplateFix.computed

describe('domainTemplateFix mixin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getLandingPageFormDetails.mockResolvedValue({ data: { data: { domainRecords: rawPool } } })
    getAllDomainBlocklistStatuses.mockResolvedValue({
      data: { domains: [{ domain: 'phishy.com', status: 'malicious' }] }
    })
    getDomainBlocklistStatus.mockResolvedValue({ data: { status: 'clean' } })
    getLandingPageTemplate.mockResolvedValue({
      data: { data: { resourceId: 'lp-1', name: 'Acme', domainRecordId: '3', landingPages: [] } }
    })
    updateLandingPage.mockResolvedValue({})
    // No AI preference by default → pure rule-based ranking (worker may be unconfigured/down).
    suggestDomainByContent.mockResolvedValue(null)
  })

  describe('computed', () => {
    it('disables the wand without a resourceId and enables it with one', () => {
      expect(computed.isDomainFixDisabled.call({ domainFixResourceId: null })).toBe(true)
      expect(computed.isDomainFixDisabled.call({ domainFixResourceId: 'x' })).toBe(false)
    })
    it('shows a check on the success note only, no icon for errors/empty', () => {
      expect(computed.domainFixNoteIcon.call({ domainFix: { message: 'clean domain selected' } })).toBe('mdi-check-circle')
      expect(computed.domainFixNoteIcon.call({ domainFix: { message: 'No eligible (non-blacklisted) domain available' } })).toBe('')
      expect(computed.domainFixNoteIcon.call({ domainFix: { message: '' } })).toBe('')
    })
    it('hides a stale success note + icon while the domain is currently flagged', () => {
      const flagged = { domainFix: { message: 'clean domain selected' }, blocklistWarning: { status: 'malicious' } }
      expect(computed.domainFixNote.call(flagged)).toBe('')
      expect(computed.domainFixNoteIcon.call(flagged)).toBe('')
      // and shows again once the warning clears
      const clean = { domainFix: { message: 'clean domain selected' }, blocklistWarning: null }
      expect(computed.domainFixNote.call(clean)).toBe('clean domain selected')
      expect(computed.domainFixNoteIcon.call(clean)).toBe('mdi-check-circle')
    })
    it('hides the icon when disabled, shows wand/spinner otherwise', () => {
      expect(computed.domainFixIcon.call({ isDomainFixDisabled: true, domainFix: freshState() })).toBe('')
      expect(
        computed.domainFixIcon.call({ isDomainFixDisabled: false, domainFix: { isLoading: false } })
      ).toBe('mdi-auto-fix')
      expect(
        computed.domainFixIcon.call({ isDomainFixDisabled: false, domainFix: { isLoading: true } })
      ).toBe('mdi-loading')
    })
  })

  describe('mixin stubs + watch (host contract)', () => {
    it('default stubs disable the wand and rank on empty content until a host overrides them', () => {
      expect(computed.domainFixResourceId.call({})).toBe(null)
      expect(computed.domainFixContentText.call({})).toBe('')
    })
    it('default refreshAfterDomainFix is a no-op (host overrides it)', () => {
      expect(() => domainTemplateFix.methods.refreshAfterDomainFix.call({})).not.toThrow()
    })
    it('switching previewed template (resourceId watch) restarts the cycle and drops the stale note', () => {
      const ctx = { domainFix: { cursor: 3, message: 'clean domain selected' } }
      domainTemplateFix.watch.domainFixResourceId.call(ctx)
      expect(ctx.domainFix.cursor).toBe(-1)
      expect(ctx.domainFix.message).toBe('')
    })
  })

  describe('loadDomainFixApi (channel adapter)', () => {
    it('phishing → landingPage exports; update is silent and (payload, id)', async () => {
      const api = await domainTemplateFix.methods.loadDomainFixApi.call({ domainFixChannel: 'phishing' })
      await api.getFormDetails()
      await api.getTemplate('p1')
      await api.update({ a: 1 }, 'p1')
      expect(getLandingPageFormDetails).toHaveBeenCalled()
      expect(getLandingPageTemplate).toHaveBeenCalledWith('p1')
      expect(updateLandingPage).toHaveBeenCalledWith({ a: 1 }, 'p1', { silent: true })
    })

    it('quishing → quishing exports; update is (payload, id)', async () => {
      const api = await domainTemplateFix.methods.loadDomainFixApi.call({ domainFixChannel: 'quishing' })
      await api.getFormDetails()
      await api.getTemplate('q1')
      await api.update({ b: 2 }, 'q1')
      expect(quishingApi.getLandingPageFormDetails).toHaveBeenCalled()
      expect(quishingApi.getLandingPageTemplate).toHaveBeenCalledWith('q1')
      expect(quishingApi.updateLandingPage).toHaveBeenCalledWith({ b: 2 }, 'q1', { silent: true })
    })

    it('smishing → smishing exports; update args are REVERSED to (id, payload), silent', async () => {
      const api = await domainTemplateFix.methods.loadDomainFixApi.call({ domainFixChannel: 'smishing' })
      await api.getFormDetails()
      await api.getTemplate('s1')
      await api.update({ c: 3 }, 's1')
      expect(smishingApi.getLandingPageTemplateFormDetails).toHaveBeenCalled()
      expect(smishingApi.getLandingPageTemplate).toHaveBeenCalledWith('s1')
      expect(smishingApi.updateLandingPageTemplate).toHaveBeenCalledWith('s1', { c: 3 }, { silent: true })
    })
  })

  describe('fixDomain', () => {
    it('picks the best clean domain, updates the template, and refreshes', async () => {
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)

      expect(getLandingPageFormDetails).toHaveBeenCalledTimes(1)
      expect(getLandingPageTemplate).toHaveBeenCalledWith('lp-1')
      // best content match = acme-bank-login.com (id 2)
      const [payload, id] = updateLandingPage.mock.calls[0]
      expect(id).toBe('lp-1')
      expect(payload.domainRecordId).toBe('2')
      expect(ctx.domainFix.message).toBe('clean domain selected')
      expect(ctx.refreshAfterDomainFix).toHaveBeenCalledTimes(1)
      expect(ctx.domainFix.isLoading).toBe(false)
      // updates silently — the inline note is the confirmation, no global snackbar
      expect(updateLandingPage).toHaveBeenCalledWith(expect.any(Object), 'lp-1', { silent: true })
    })

    it('lets a valid AI preference override the rule-based pick', async () => {
      // Rule-based best is acme-bank-login.com (id 2); AI prefers random-store.net (id 1).
      suggestDomainByContent.mockResolvedValue('1')
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(suggestDomainByContent).toHaveBeenCalledTimes(1)
      expect(updateLandingPage.mock.calls[0][0].domainRecordId).toBe('1')
    })

    it('falls back to the rule-based pick when the AI pick is not an eligible candidate', async () => {
      suggestDomainByContent.mockResolvedValue('999') // not in pool
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(updateLandingPage.mock.calls[0][0].domainRecordId).toBe('2')
    })

    it('forwards the previewed template language to the AI worker as a hint', async () => {
      const ctx = makeCtx({ domainFixLanguage: 'Turkish (Türkiye)' })
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(suggestDomainByContent).toHaveBeenCalledWith(
        expect.objectContaining({ language: 'Turkish (Türkiye)' })
      )
    })

    it('caches the pool and blocklist statuses across clicks', async () => {
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(getLandingPageFormDetails).toHaveBeenCalledTimes(1)
      expect(getAllDomainBlocklistStatuses).toHaveBeenCalledTimes(1)
      // second click cycles to the next candidate
      expect(updateLandingPage.mock.calls[1][0].domainRecordId).toBe('1')
    })

    it('passes the rebuilt urlTemplate to refreshAfterDomainFix so the preview refreshes', async () => {
      updateLandingPage.mockResolvedValue({
        data: { data: { urlTemplate: 'https://clean.example.com/x' } }
      })
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.refreshAfterDomainFix).toHaveBeenCalledWith(
        expect.objectContaining({ urlTemplate: 'https://clean.example.com/x' })
      )
    })

    it('does nothing while disabled or already loading', async () => {
      const disabled = makeCtx({ domainFixResourceId: null, isDomainFixDisabled: true })
      await domainTemplateFix.methods.fixDomain.call(disabled)
      expect(getLandingPageFormDetails).not.toHaveBeenCalled()

      const loading = makeCtx()
      loading.domainFix.isLoading = true
      await domainTemplateFix.methods.fixDomain.call(loading)
      expect(getLandingPageFormDetails).not.toHaveBeenCalled()
    })

    it('reports "No domain available" when the pool is empty and never updates', async () => {
      getLandingPageFormDetails.mockResolvedValue({ data: { data: { domainRecords: [] } } })
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.domainFix.message).toBe('No domain available')
      expect(getAllDomainBlocklistStatuses).not.toHaveBeenCalled()
      expect(updateLandingPage).not.toHaveBeenCalled()
      expect(ctx.domainFix.isLoading).toBe(false)
    })

    it('treats a failed pool fetch as an empty pool (no crash, no update)', async () => {
      getLandingPageFormDetails.mockRejectedValueOnce(new Error('500'))
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.domainFix.domainRecords).toEqual([])
      expect(ctx.domainFix.message).toBe('No domain available')
      expect(updateLandingPage).not.toHaveBeenCalled()
    })

    it('still picks a domain when the bulk blocklist service is down (per-domain check covers it)', async () => {
      getAllDomainBlocklistStatuses.mockRejectedValueOnce(new Error('worker down'))
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.domainFix.statusMap).toBeDefined()
      expect(updateLandingPage).toHaveBeenCalledTimes(1)
      expect(ctx.domainFix.message).toBe('clean domain selected')
    })

    it('reports when no eligible domain exists and never updates', async () => {
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
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(updateLandingPage).not.toHaveBeenCalled()
      expect(ctx.domainFix.message).toBe('No eligible (non-blacklisted) domain available')
    })

    it('skips a domain the per-domain check flags even if missing from the bulk list', async () => {
      getAllDomainBlocklistStatuses.mockResolvedValue({ data: { domains: [] } })
      getDomainBlocklistStatus.mockImplementation((domain) =>
        Promise.resolve({ data: { status: domain === 'acme-bank-login.com' ? 'malicious' : 'clean' } })
      )
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(updateLandingPage).toHaveBeenCalled()
      expect(updateLandingPage.mock.calls[0][0].domainRecordId).not.toBe('2') // acme skipped
      expect(ctx.domainFix.statusMap['acme-bank-login.com']).toBe('malicious')
    })

    it('treats a per-domain check that errors as clean (best-effort, never blocks)', async () => {
      getAllDomainBlocklistStatuses.mockResolvedValue({ data: { domains: [] } })
      getDomainBlocklistStatus.mockRejectedValue(new Error('timeout'))
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(updateLandingPage).toHaveBeenCalledTimes(1)
      expect(ctx.domainFix.message).toBe('clean domain selected')
    })

    it('falls back to empty urlTemplate when both the PUT echo and the re-fetch fail', async () => {
      updateLandingPage.mockResolvedValue({}) // no urlTemplate echoed
      getLandingPageTemplate
        .mockResolvedValueOnce({ data: { data: { resourceId: 'lp-1', landingPages: [] } } }) // entity fetch
        .mockRejectedValueOnce(new Error('500')) // fallback re-fetch fails
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.domainFix.message).toBe('clean domain selected')
      expect(ctx.refreshAfterDomainFix).toHaveBeenCalledWith(
        expect.objectContaining({ urlTemplate: '' })
      )
    })

    it('clears the note and does not refresh when the update fails', async () => {
      updateLandingPage.mockRejectedValueOnce(new Error('500'))
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      expect(ctx.domainFix.message).toBe('')
      expect(ctx.refreshAfterDomainFix).not.toHaveBeenCalled()
      expect(ctx.domainFix.isLoading).toBe(false)
    })

    it('aligns urlSchemaTypeId to the chosen domain schema in the payload', async () => {
      const ctx = makeCtx()
      await domainTemplateFix.methods.fixDomain.call(ctx)
      // acme-bank-login.com schema is https / id 2
      expect(updateLandingPage.mock.calls[0][0].urlSchemaTypeId).toBe('2')
    })
  })
})
