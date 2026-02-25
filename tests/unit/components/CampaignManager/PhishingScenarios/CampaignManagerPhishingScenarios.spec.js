import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'

describe('CampaignManagerPhishingScenarios.vue', () => {
  describe('computed', () => {
    it('getMethodItems returns quishingMethods when type is QUISHING', () => {
      const ctx = { type: SCENARIO_TYPES.QUISHING }
      const result = CampaignManagerPhishingScenarios.computed.getMethodItems.call(ctx)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('getMethodItems returns methods when type is PHISHING', () => {
      const ctx = { type: SCENARIO_TYPES.PHISHING }
      const result = CampaignManagerPhishingScenarios.computed.getMethodItems.call(ctx)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('getContainerStyle returns border style when invalid and manually', () => {
      const ctx = {
        isValid: false,
        scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY
      }
      const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
      expect(result).toHaveProperty('border')
      expect(result.border).toContain('#ff5252')
    })

    it('getContainerStyle returns empty when valid', () => {
      const ctx = {
        isValid: true,
        scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY
      }
      const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
      expect(result).toEqual({})
    })

    it('getEmailTemplatePreviewLanguageHint formats correctly', () => {
      const ctx = { selectedTemplateLanguages: [{ id: 1 }] }
      const result =
        CampaignManagerPhishingScenarios.computed.getEmailTemplatePreviewLanguageHint.call(ctx)
      expect(result).toContain('1 language')
    })

    it('getEmailTemplatePreviewLanguageHint uses plural for multiple', () => {
      const ctx = { selectedTemplateLanguages: [{ id: 1 }, { id: 2 }] }
      const result =
        CampaignManagerPhishingScenarios.computed.getEmailTemplatePreviewLanguageHint.call(ctx)
      expect(result).toContain('2 languages')
    })

    it('getBadges returns empty array when no filters', () => {
      const ctx = { method: [], language: [], difficulty: [], category: [] }
      const result = CampaignManagerPhishingScenarios.computed.getBadges.call(ctx)
      expect(result).toEqual([])
    })

    it('getBadges includes method badges when method has items', () => {
      const ctx = {
        method: [{ text: 'Click-Only' }],
        language: [],
        difficulty: [],
        category: []
      }
      const result = CampaignManagerPhishingScenarios.computed.getBadges.call(ctx)
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('Type')
      expect(result[0].value).toBe('Click-Only')
    })
  })
})
