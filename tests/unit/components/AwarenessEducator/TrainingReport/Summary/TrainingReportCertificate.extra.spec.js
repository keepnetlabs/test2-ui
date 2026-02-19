import TrainingReportCertificate from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportCertificate.vue'

describe('TrainingReportCertificate.vue (extra)', () => {
  const { computed, methods } = TrainingReportCertificate

  it('templateLanguageLabel and language items handle singular/plural and empty', () => {
    const oneLang = {
      formData: {
        languages: [{ languageTypeName: 'English', languageTypeResourceId: 'en' }]
      }
    }
    const twoLang = {
      formData: {
        languages: [
          { languageTypeName: 'English', languageTypeResourceId: 'en' },
          { languageTypeName: 'Turkish', languageTypeResourceId: 'tr' }
        ]
      }
    }

    expect(computed.templateLanguageLabel.call(oneLang)).toBe('Template Language (1)')
    expect(computed.templateLanguageLabel.call(twoLang)).toBe('Template Languages (2)')
    expect(computed.templateLanguageLabel.call({ formData: {} })).toBe('Template Language (0)')

    expect(computed.getLanguageItems.call(twoLang)).toEqual([
      { text: 'English', value: 'en' },
      { text: 'Turkish', value: 'tr' }
    ])
    expect(computed.getLanguageItems.call({ formData: {} })).toEqual([])
  })

  it('updateSelectedTemplate falls back to base template when selected language missing', () => {
    const ctx = {
      formData: {
        template: 'fallback-template',
        selectedLanguageResourceId: 'missing',
        languages: [{ languageTypeResourceId: 'en', template: 'template-en' }]
      },
      selectedTemplate: ''
    }

    methods.updateSelectedTemplate.call(ctx)
    expect(ctx.selectedTemplate).toBe('fallback-template')
  })

  it('handleLanguageChange does nothing for unknown language id', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      formData: {
        selectedLanguageResourceId: 'en',
        selectedLanguageName: 'English',
        languages: [{ languageTypeResourceId: 'en', languageTypeName: 'English', template: 'template-en' }]
      },
      selectedTemplate: 'template-en',
      $set: set
    }

    methods.handleLanguageChange.call(ctx, 'missing')

    expect(set).not.toHaveBeenCalled()
    expect(ctx.formData.selectedLanguageResourceId).toBe('en')
    expect(ctx.selectedTemplate).toBe('template-en')
  })
})
