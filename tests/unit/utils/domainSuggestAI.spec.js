jest.mock('@/api/domainSuggest', () => ({
  suggestDomainByContent: jest.fn()
}))

import { aiPreferredDomainId, hoistCandidate } from '@/utils/domainSuggestAI'
import { suggestDomainByContent } from '@/api/domainSuggest'

const candidates = [
  { value: '2', text: 'acme-bank-login.com' },
  { value: '1', text: 'random-store.net' },
  { value: '5', text: 'secure-portal.net' }
]

describe('domainSuggestAI', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('aiPreferredDomainId', () => {
    it('returns the worker pick when it is one of the candidates', async () => {
      suggestDomainByContent.mockResolvedValue('1')
      const id = await aiPreferredDomainId({ candidates, contentText: 'Acme Bank login' })
      expect(id).toBe('1')
      // sends only id+name pairs, plus the content signal
      expect(suggestDomainByContent).toHaveBeenCalledWith({
        signal: 'Acme Bank login',
        language: undefined,
        domains: [
          { id: '2', name: 'acme-bank-login.com' },
          { id: '1', name: 'random-store.net' },
          { id: '5', name: 'secure-portal.net' }
        ]
      })
    })

    it('rejects a worker pick that is not in the candidate list', async () => {
      suggestDomainByContent.mockResolvedValue('999')
      expect(await aiPreferredDomainId({ candidates, contentText: 'x' })).toBeNull()
    })

    it('returns null when the worker returns null (down / unconfigured)', async () => {
      suggestDomainByContent.mockResolvedValue(null)
      expect(await aiPreferredDomainId({ candidates, contentText: 'x' })).toBeNull()
    })

    it('skips the worker call for empty content or a single/empty candidate set', async () => {
      expect(await aiPreferredDomainId({ candidates, contentText: '' })).toBeNull()
      expect(await aiPreferredDomainId({ candidates: [candidates[0]], contentText: 'x' })).toBeNull()
      expect(await aiPreferredDomainId({ candidates: [], contentText: 'x' })).toBeNull()
      expect(suggestDomainByContent).not.toHaveBeenCalled()
    })

    it('distills the signal: strips HTML/entities, collapses whitespace, caps length', async () => {
      suggestDomainByContent.mockResolvedValue('1')
      await aiPreferredDomainId({
        candidates,
        contentText: '<div class="x">Acme&nbsp;Bank</div>\n   <span>secure   login</span>'
      })
      expect(suggestDomainByContent).toHaveBeenCalledWith(
        expect.objectContaining({ signal: 'Acme Bank secure login' })
      )
      const sent = suggestDomainByContent.mock.calls[0][0].signal
      expect(sent.length).toBeLessThanOrEqual(600)
      expect(sent).not.toMatch(/[<>]/)
    })

    it('forwards the optional language hint', async () => {
      suggestDomainByContent.mockResolvedValue('2')
      await aiPreferredDomainId({ candidates, contentText: 'x', language: 'tr' })
      expect(suggestDomainByContent).toHaveBeenCalledWith(expect.objectContaining({ language: 'tr' }))
    })
  })

  describe('hoistCandidate', () => {
    it('moves the matching candidate to the front', () => {
      const out = hoistCandidate(candidates, '1')
      expect(out.map((c) => c.value)).toEqual(['1', '2', '5'])
      expect(candidates.map((c) => c.value)).toEqual(['2', '1', '5']) // input untouched
    })
    it('is a no-op when already first, not found, or value is null', () => {
      expect(hoistCandidate(candidates, '2')).toBe(candidates) // already first
      expect(hoistCandidate(candidates, '999')).toBe(candidates) // not found
      expect(hoistCandidate(candidates, null)).toBe(candidates) // no value
      expect(hoistCandidate(null, '1')).toBeNull() // no list
    })
    it('matches by string-coerced value (number vs string)', () => {
      const out = hoistCandidate(candidates, 5)
      expect(out.map((c) => c.value)).toEqual(['5', '2', '1'])
    })
  })
})
