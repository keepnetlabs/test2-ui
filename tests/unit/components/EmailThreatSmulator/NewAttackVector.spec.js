import NewAttackVector from '@/components/EmailThreatSmulator/NewAttackVector.vue'

describe('NewAttackVector.vue', () => {
  describe('computed', () => {
    it('pageTitle returns Edit Attack Vector when isEdit', () => {
      const ctx = { isEdit: true }
      expect(NewAttackVector.computed.pageTitle.call(ctx)).toBe('Edit Attack Vector')
    })

    it('pageTitle returns Create Attack Vector when not isEdit', () => {
      const ctx = { isEdit: false }
      expect(NewAttackVector.computed.pageTitle.call(ctx)).toBe('Create Attack Vector')
    })

    it('isFileDeletable returns true when formValues.content has name', () => {
      const ctx = { formValues: { content: { name: 'file.pdf' } } }
      expect(NewAttackVector.computed.isFileDeletable.call(ctx)).toBe(true)
    })

    it('isFileDeletable returns false when no content', () => {
      const ctx = { formValues: {} }
      expect(NewAttackVector.computed.isFileDeletable.call(ctx)).toBe(false)
    })
  })
})
