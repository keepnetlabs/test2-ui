jest.mock('@/api/callback', () => ({
  searchCallbackTemplates: jest.fn().mockResolvedValue({
    data: { data: { results: [], totalNumberOfPages: 1 } }
  }),
  getCallbackTemplatePreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], vishingLanguageResourceId: '' } }
  })
}))

import CallbackTemplateSelectList from '@/components/CallbackScenarios/CallbackTemplateSelectList.vue'

describe('CallbackTemplateSelectList.vue (extra branch coverage)', () => {
  describe('getItemDescription', () => {
    it('returns nbsp when no description', () => {
      expect(
        CallbackTemplateSelectList.methods.getItemDescription.call({}, {})
      ).toBe('\xa0')
    })

    it('returns nbsp when description is null string', () => {
      expect(
        CallbackTemplateSelectList.methods.getItemDescription.call({}, {
          description: 'null'
        })
      ).toBe('\xa0')
    })

    it('returns nbsp when description is undefined string', () => {
      expect(
        CallbackTemplateSelectList.methods.getItemDescription.call({}, {
          description: 'undefined'
        })
      ).toBe('\xa0')
    })

    it('returns description when valid', () => {
      expect(
        CallbackTemplateSelectList.methods.getItemDescription.call({}, {
          description: 'Valid desc'
        })
      ).toBe('Valid desc')
    })
  })

  describe('computed', () => {
    it('getLanguageItems returns mapped languages', () => {
      const ctx = {
        languages: [
          { language: 'English', resourceId: 'r1' },
          { language: 'Turkish', resourceId: 'r2' }
        ]
      }
      expect(
        CallbackTemplateSelectList.computed.getLanguageItems.call(ctx)
      ).toEqual(['English', 'Turkish'])
    })

    it('getLanguageItems returns undefined when languages undefined', () => {
      expect(
        CallbackTemplateSelectList.computed.getLanguageItems.call({})
      ).toBeUndefined()
    })

    it('getVoiceItems returns filtered voices when language selected', () => {
      const ctx = {
        getSelectedLanguage: 'English',
        languages: [
          { language: 'English', name: 'Voice1' },
          { language: 'English', name: 'Voice2' },
          { language: 'Turkish', name: 'Voice3' }
        ]
      }
      expect(
        CallbackTemplateSelectList.computed.getVoiceItems.call(ctx)
      ).toEqual(['Voice1', 'Voice2'])
    })

    it('getVoiceItems returns empty when no language selected', () => {
      const ctx = {
        getSelectedLanguage: '',
        languages: []
      }
      expect(
        CallbackTemplateSelectList.computed.getVoiceItems.call(ctx)
      ).toEqual([])
    })
  })
})
