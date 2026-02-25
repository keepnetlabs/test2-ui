import NewQuishingIndividualPrintoutTemplatesModal from '@/components/QuishingEmailTemplates/NewQuishingIndividualPrintoutTemplatesModal.vue'

describe('NewQuishingIndividualPrintoutTemplatesModal.vue', () => {
  describe('computed', () => {
    it('getTitle returns Duplicate when isEdit and isDuplicate', () => {
      const ctx = { isEdit: true, isDuplicate: true }
      expect(NewQuishingIndividualPrintoutTemplatesModal.computed.getTitle.call(ctx)).toContain(
        'Duplicate'
      )
    })

    it('getTitle returns Edit when isEdit only', () => {
      const ctx = { isEdit: true, isDuplicate: false }
      expect(NewQuishingIndividualPrintoutTemplatesModal.computed.getTitle.call(ctx)).toContain(
        'Edit'
      )
    })
  })
})
