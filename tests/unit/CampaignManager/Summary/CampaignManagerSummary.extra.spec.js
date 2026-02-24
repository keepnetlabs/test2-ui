import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary.vue'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('CampaignManagerSummary.vue (extra branch coverage)', () => {
  describe('computed branches', () => {
    it('getEmailTemplateTitle returns Quishing base title when type is QUISHING', () => {
      const ctx = {
        type: SCENARIO_TYPES.QUISHING,
        emailTemplateParams: { name: 'Qr Template' }
      }
      expect(CampaignManagerSummary.computed.getEmailTemplateTitle.call(ctx)).toContain(
        'Individual printout'
      )
    })

    it('getPreferredLanguageAlertBoxClass adds success class when count is 0', () => {
      const ctx = { getNonPreferredLanguageUsersCount: 0 }
      expect(CampaignManagerSummary.computed.getPreferredLanguageAlertBoxClass.call(ctx)).toContain(
        'preferred-language-alert-box--success'
      )
    })

    it('getPreferredLanguageAlertBoxClass adds preferred-language-alert-box when count > 0', () => {
      const ctx = { getNonPreferredLanguageUsersCount: 5 }
      expect(CampaignManagerSummary.computed.getPreferredLanguageAlertBoxClass.call(ctx)).toContain(
        'preferred-language-alert-box'
      )
    })

    it('getLanguageShortCode returns array when languageShortCode is string', () => {
      const ctx = {
        emailTemplateParams: { languageShortCode: 'en' }
      }
      expect(CampaignManagerSummary.computed.getLanguageShortCode.call(ctx)).toEqual(['en'])
    })

    it('getLanguageShortCode returns array when languageShortCode is array', () => {
      const ctx = {
        emailTemplateParams: { languageShortCode: ['en', 'tr'] }
      }
      expect(CampaignManagerSummary.computed.getLanguageShortCode.call(ctx)).toEqual(['en', 'tr'])
    })

    it('getEmailTemplatePreviewLanguageHint uses singular when one language', () => {
      const ctx = { selectedTemplateLanguages: [{ text: 'English' }] }
      const hint = CampaignManagerSummary.computed.getEmailTemplatePreviewLanguageHint.call(ctx)
      expect(hint).toContain('1 language')
      expect(hint).not.toContain('languages')
    })

    it('getPhishingScenariosText returns Scenario Info when not manual', () => {
      const ctx = { isDistributionNotManual: true }
      expect(CampaignManagerSummary.computed.getPhishingScenariosText.call(ctx)).toBe('Scenario Info')
    })

    it('getPreferredLanguageText returns empty when no activeData', () => {
      const ctx = {
        formData: { userCountDetailResponse: { data: { data: [] } } },
        languageOptions: []
      }
      expect(CampaignManagerSummary.computed.getPreferredLanguageText.call(ctx)).toBe('')
    })

    it('getPhoneNumberWarningText uses singular when count is 1', () => {
      const ctx = {
        getActiveUsersWithPhoneNumberCount: 1,
        getActiveUsersWithoutPhoneNumberCount: 1
      }
      const text = CampaignManagerSummary.computed.getPhoneNumberWarningText.call(ctx)
      expect(text).toContain('is')
      expect(text).toContain('1 active user')
    })

    it('getPreferredLanguageText returns No language match when languageCounts empty', () => {
      const ctx = {
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                {
                  status: 'Active',
                  companyPreferredLanguage: 'en',
                  hasPreferredLanguage: [{ status: 'No', count: 1 }]
                }
              ]
            }
          }
        },
        languageOptions: [{ languageTypeName: 'en', text: 'English' }]
      }
      const text = CampaignManagerSummary.computed.getPreferredLanguageText.call(ctx)
      expect(text).toContain('No language match')
      expect(text).toMatch(/\d+ user(s)?/)
    })

    it('getPreferredLanguageText returns All users matched when fallbackCount 0', () => {
      const ctx = {
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                {
                  status: 'Active',
                  companyPreferredLanguage: 'en',
                  hasPreferredLanguage: [
                    {
                      status: 'Yes',
                      hasPreferredLanguage: [{ status: 'English', count: 5 }]
                    }
                  ]
                }
              ]
            }
          }
        },
        languageOptions: [{ languageTypeName: 'English', text: 'English' }]
      }
      const text = CampaignManagerSummary.computed.getPreferredLanguageText.call(ctx)
      expect(text).toContain('All users matched')
    })

    it('getPreferredLanguageText returns valid message when has both matched and fallback users', () => {
      const ctx = {
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                {
                  status: 'Active',
                  companyPreferredLanguage: 'en',
                  hasPreferredLanguage: [
                    {
                      status: 'Yes',
                      hasPreferredLanguage: [{ status: 'English', count: 3 }]
                    },
                    { status: 'No', count: 2 }
                  ]
                }
              ]
            }
          }
        },
        languageOptions: [{ languageTypeName: 'English', text: 'English' }]
      }
      const text = CampaignManagerSummary.computed.getPreferredLanguageText.call(ctx)
      expect(typeof text).toBe('string')
      expect(text.length).toBeGreaterThan(0)
    })
  })
})
