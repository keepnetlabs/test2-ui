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
  })
})
