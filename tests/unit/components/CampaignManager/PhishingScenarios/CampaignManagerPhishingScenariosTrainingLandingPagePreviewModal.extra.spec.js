import CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.vue'

describe('CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.vue (extra branching)', () => {
  const comp = CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal

  describe('computed isMultiple', () => {
    it('is false when trainingLanguageIds is undefined', () => {
      expect(comp.computed.isMultiple.call({ trainingLanguageIds: undefined })).toBe(false)
    })

    it('is false when only All remains after filter', () => {
      expect(comp.computed.isMultiple.call({ trainingLanguageIds: ['All'] })).toBe(false)
    })

    it('is true when two or more non-All ids', () => {
      expect(comp.computed.isMultiple.call({ trainingLanguageIds: ['en', 'de'] })).toBe(true)
    })
  })

  describe('computed getButtons', () => {
    it('returns empty array when no languages match ids', () => {
      const buttons = comp.computed.getButtons.call({
        languages: [{ id: 'en', nativeLanguageName: 'English', name: 'English' }],
        trainingLanguageIds: ['tr']
      })
      expect(buttons).toEqual([])
    })

    it('maps multiple matching languages', () => {
      const buttons = comp.computed.getButtons.call({
        languages: [
          { id: 'en', nativeLanguageName: 'English', name: 'English' },
          { id: 'tr', nativeLanguageName: 'Türkçe', name: 'Turkish' }
        ],
        trainingLanguageIds: ['en', 'tr']
      })
      expect(buttons).toEqual([
        { text: 'English', language: 'English' },
        { text: 'Türkçe', language: 'Turkish' }
      ])
    })
  })

  describe('message getters with explicit redirect page', () => {
    it('returns custom strings when trainingRedirectPage fields are set', () => {
      const ctx = {
        trainingRedirectPage: {
          informationMessage: 'Custom info',
          redirectMessage: 'Custom redirect',
          startButtonLabel: 'Go now'
        }
      }
      expect(comp.computed.getInformationMessage.call(ctx)).toBe('Custom info')
      expect(comp.computed.getRedirectMessage.call(ctx)).toBe('Custom redirect')
      expect(comp.computed.getStartButtonLabel.call(ctx)).toBe('Go now')
    })
  })

  describe('computed getLogoImage', () => {
    it('returns empty string when getUser is falsy', () => {
      const ctx = {
        getUser: null,
        $store: { state: { auth: {}, dashboard: {} } }
      }
      expect(comp.computed.getLogoImage.call(ctx)).toBe('')
    })

    it('uses selected company logo when isSelectCompany is true', () => {
      const orig = localStorage.getItem
      localStorage.getItem = jest.fn((k) => (k === 'isSelectCompany' ? 'true' : orig(k)))
      const ctx = {
        getUser: { id: 1 },
        $store: {
          state: {
            auth: { logoUrl: 'https://auth/logo.png' },
            dashboard: { selectedCompanyObject: { logoUrl: 'https://company/logo.png' } }
          }
        }
      }
      expect(comp.computed.getLogoImage.call(ctx)).toBe('https://company/logo.png')
      localStorage.getItem = orig
    })

    it('uses auth logo when isSelectCompany is not true', () => {
      const orig = localStorage.getItem
      localStorage.getItem = jest.fn((k) => (k === 'isSelectCompany' ? 'false' : orig(k)))
      const ctx = {
        getUser: { id: 1 },
        $store: {
          state: {
            auth: { logoUrl: 'https://auth/only.png' },
            dashboard: { selectedCompanyObject: { logoUrl: 'https://ignored/when-not-selected.png' } }
          }
        }
      }
      expect(comp.computed.getLogoImage.call(ctx)).toBe('https://auth/only.png')
      localStorage.getItem = orig
    })
  })
})
