import NewQuishingEmailTemplatesModal from '@/components/QuishingEmailTemplates/NewQuishingEmailTemplatesModal.vue'

describe('NewQuishingEmailTemplatesModal.vue', () => {
  describe('computed', () => {
    it('getTitle returns Duplicate Email Template when isEdit and isDuplicate', () => {
      const ctx = { isEdit: true, isDuplicate: true }
      expect(NewQuishingEmailTemplatesModal.computed.getTitle.call(ctx)).toBe(
        'Duplicate Email Template'
      )
    })

    it('getTitle returns Edit Email Template when isEdit only', () => {
      const ctx = { isEdit: true, isDuplicate: false }
      expect(NewQuishingEmailTemplatesModal.computed.getTitle.call(ctx)).toBe(
        'Edit Email Template'
      )
    })

    it('getTitle returns New Email Template when not edit', () => {
      const ctx = { isEdit: false, isDuplicate: false }
      expect(NewQuishingEmailTemplatesModal.computed.getTitle.call(ctx)).toBe(
        'New Email Template'
      )
    })

    it('isAttachmentBasedTemplate returns true when categoryResourceId matches', () => {
      const ctx = { formValues: { categoryResourceId: '7dLrW2kdBTDs' } }
      expect(NewQuishingEmailTemplatesModal.computed.isAttachmentBasedTemplate.call(ctx)).toBe(true)
    })

    it('isAttachmentBasedTemplate returns false when categoryResourceId differs', () => {
      const ctx = { formValues: { categoryResourceId: 'other' } }
      expect(NewQuishingEmailTemplatesModal.computed.isAttachmentBasedTemplate.call(ctx)).toBe(false)
    })

    it('language selector computed values use selected and lookup languages', () => {
      const ctx = {
        selectedLanguages: [{ text: 'English', value: 'en' }],
        activeLanguage: 'tr',
        formValues: { languageTypeResourceId: 'de' },
        getCompanyPreferredLanguageId: 'company-lang',
        languageOptions: [{ text: 'English', value: 'en' }],
        scenarioDetailsLookup: {
          languageTypes: [{ text: 'Turkish', value: 'tr' }]
        }
      }

      expect(NewQuishingEmailTemplatesModal.computed.primaryLanguageResourceId.call(ctx)).toBe('en')
      expect(NewQuishingEmailTemplatesModal.computed.getTemplateLanguageOptions.call(ctx)).toEqual([
        { text: 'English', value: 'en' }
      ])
      expect(
        NewQuishingEmailTemplatesModal.computed.getTemplateLanguageOptions.call({
          languageOptions: [],
          scenarioDetailsLookup: ctx.scenarioDetailsLookup
        })
      ).toEqual([{ text: 'Turkish', value: 'tr' }])
    })
  })

  describe('methods', () => {
    it('handlePrimaryLanguageChange syncs first step language with selected languages', () => {
      const handleSelectedLanguagesChange = jest.fn()
      const ctx = {
        getTemplateLanguageOptions: [
          { text: 'English', value: 'en' },
          { text: 'Turkish', value: 'tr' }
        ],
        selectedLanguages: [{ text: 'English', value: 'en' }],
        activeLanguage: 'en',
        formValues: { languageTypeResourceId: 'en' },
        getSelectedLanguagePayload: { languageTypeResourceId: 'tr', subject: 'Merhaba' },
        selectedLanguagePayloadItemBeforeSave: null,
        handleSelectedLanguagesChange
      }

      NewQuishingEmailTemplatesModal.methods.handlePrimaryLanguageChange.call(ctx, 'tr')

      expect(ctx.selectedLanguages).toEqual([{ text: 'Turkish', value: 'tr' }])
      expect(ctx.activeLanguage).toBe('tr')
      expect(ctx.formValues.languageTypeResourceId).toBe('tr')
      expect(handleSelectedLanguagesChange).toHaveBeenCalledWith([{ text: 'Turkish', value: 'tr' }])
      expect(ctx.selectedLanguagePayloadItemBeforeSave).toEqual({
        languageTypeResourceId: 'tr',
        subject: 'Merhaba'
      })

      NewQuishingEmailTemplatesModal.methods.handlePrimaryLanguageChange.call(ctx, 'missing')
      expect(ctx.activeLanguage).toBe('tr')
    })

    it('ensurePrimaryLanguageSelection initializes default language before next or submit', () => {
      const handlePrimaryLanguageChange = jest.fn()
      const ctx = {
        primaryLanguageResourceId: 'en',
        selectedLanguages: [],
        languagesPayload: [],
        handlePrimaryLanguageChange
      }

      NewQuishingEmailTemplatesModal.methods.ensurePrimaryLanguageSelection.call(ctx)
      expect(handlePrimaryLanguageChange).toHaveBeenCalledWith('en')

      handlePrimaryLanguageChange.mockClear()
      ctx.selectedLanguages = [{ value: 'en' }]
      ctx.languagesPayload = [{ languageTypeResourceId: 'en' }]
      NewQuishingEmailTemplatesModal.methods.ensurePrimaryLanguageSelection.call(ctx)
      expect(handlePrimaryLanguageChange).not.toHaveBeenCalled()
    })
  })
})
