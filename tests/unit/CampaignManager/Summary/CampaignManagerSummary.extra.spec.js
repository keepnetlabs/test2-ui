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

    it('enrollmentNotificationLanguage summarizes selected training notification language', () => {
      const ctx = {
        formData: {
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          trainings: {
            s1: {
              trainingId: 't1',
              isCheckboxSelected: true,
              sendTemplatesInPreferredLanguage: true
            },
            s2: {
              trainingId: 't2',
              isCheckboxSelected: true,
              sendTemplatesInPreferredLanguage: false
            }
          }
        }
      }

      expect(CampaignManagerSummary.computed.enrollmentNotificationLanguage.call(ctx)).toBe('Mixed')
    })

    it('enrollmentNotificationLanguage returns empty when no selected training exists', () => {
      const ctx = {
        formData: {
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          trainings: {
            s1: {
              trainingId: 't1',
              isCheckboxSelected: false,
              sendTemplatesInPreferredLanguage: true
            }
          }
        }
      }

      expect(CampaignManagerSummary.computed.enrollmentNotificationLanguage.call(ctx)).toBe('')
    })

    it('enrollmentNotificationLanguage summarizes all selected trainings as company language', () => {
      const ctx = {
        formData: {
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          trainings: {
            s1: {
              trainingId: 't1',
              isCheckboxSelected: true,
              sendTemplatesInPreferredLanguage: false
            },
            s2: {
              trainingId: 't2',
              isCheckboxSelected: true,
              sendTemplatesInPreferredLanguage: false
            }
          }
        }
      }

      expect(CampaignManagerSummary.computed.enrollmentNotificationLanguage.call(ctx)).toBe(
        'Company Language'
      )
    })

    it('enrollmentNotificationLanguage reads category distribution training settings', () => {
      const ctx = {
        formData: {
          scenarioDistribution: SCENARIO_DISTRIBUTION.RANDOM_SCENARIO_FOR_EACH,
          trainingForCategory: {
            trainingId: 't-category',
            sendTemplatesInPreferredLanguage: true
          }
        }
      }

      expect(CampaignManagerSummary.computed.enrollmentNotificationLanguage.call(ctx)).toBe(
        'Preferred Language'
      )
    })

    it('enrollmentNotificationLanguage returns empty for category distribution without training', () => {
      const ctx = {
        formData: {
          scenarioDistribution: SCENARIO_DISTRIBUTION.RANDOM_SCENARIO_FOR_EACH,
          trainingForCategory: {}
        }
      }

      expect(CampaignManagerSummary.computed.enrollmentNotificationLanguage.call(ctx)).toBe('')
    })

    it('getCampaignInfoItems includes enrollment notification language below hyper-personalization', () => {
      const ctx = {
        formData: {
          name: 'Campaign A',
          sendUserPreferredLanguage: 0,
          smartGroup: {},
          duration: 30,
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          emailReplySettings: {},
          trainings: {
            s1: {
              trainingId: 't1',
              isCheckboxSelected: true,
              sendTemplatesInPreferredLanguage: true
            }
          }
        },
        phishingScenarios: [{ method: 'Click-Only', difficulty: 'Medium' }],
        enrollmentNotificationLanguage: 'Preferred Language'
      }

      const items = CampaignManagerSummary.computed.getCampaignInfoItems.call(ctx)

      expect(Object.keys(items)).toEqual([
        'name',
        'Hyper-Personalization',
        'Enrollment Notification Language',
        'Smart Grouping',
        'method',
        'difficulty',
        'Tracking Duration',
        'Scenario Distribution',
        'Reply Tracking'
      ])
      expect(items['Enrollment Notification Language']).toBe('Preferred Language')
    })

    it('getCampaignInfoItems includes enrollment notification language for category distribution', () => {
      const ctx = {
        formData: {
          name: 'Campaign B',
          sendUserPreferredLanguage: 1,
          smartGroup: { name: 'Smart Group A' },
          duration: 10,
          scenarioDistribution: SCENARIO_DISTRIBUTION.RANDOM_SCENARIO_FOR_EACH,
          emailReplySettings: { isEnabled: true },
          phishingScenarioItems: [
            { method: 'Click-Only', difficulty: 'Easy' },
            { method: 'Data Submission', difficulty: 'Hard' }
          ],
          trainingForCategory: {
            trainingId: 't-category',
            sendTemplatesInPreferredLanguage: false
          }
        },
        enrollmentNotificationLanguage: 'Company Language'
      }

      const items = CampaignManagerSummary.computed.getCampaignInfoItems.call(ctx)

      expect(items['Enrollment Notification Language']).toBe('Company Language')
      expect(items.method).toBe('Click-Only, Data Submission')
      expect(items['Reply Tracking']).toBe('On')
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

    it('getSettingsItems appends barrel rows for a Double Barrel campaign', () => {
      const ctx = {
        formData: {
          selectedEmailDelivery: { type: 1, name: 'SMTP A' },
          sendingLimit: 50,
          selectedSchedule: 'Now',
          frequency: 'One Time',
          isBarrelCampaign: true,
          barrelOptions: {
            orderType: 1,
            delayMinutes: 60,
            urgentFlagType: 2,
            skipPayloadIfReported: true,
            responsiveDelivery: false
          }
        }
      }

      const items = CampaignManagerSummary.computed.getSettingsItems.call(ctx)

      expect(items['Send Order']).toBe('Lure First')
      expect(items['Delay Between Emails']).toBe('60 minutes')
      expect(items['Urgent Flag']).toBe('Payload Only')
      expect(items['Skip Payload If Reported']).toBe('On')
      expect(items['Responsive Delivery']).toBe('Off')
    })

    it('getSettingsItems omits barrel rows for a non-barrel campaign', () => {
      const ctx = {
        formData: {
          selectedEmailDelivery: { type: 1, name: 'SMTP A' },
          sendingLimit: 50,
          selectedSchedule: 'Now',
          frequency: 'One Time',
          isBarrelCampaign: false
        }
      }

      const items = CampaignManagerSummary.computed.getSettingsItems.call(ctx)

      expect(items['Send Order']).toBeUndefined()
      expect(items['Urgent Flag']).toBeUndefined()
      expect(items['Skip Payload If Reported']).toBeUndefined()
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
