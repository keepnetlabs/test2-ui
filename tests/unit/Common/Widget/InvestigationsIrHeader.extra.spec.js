import InvestigationsIrHeader from '@/components/Common/Widget/WidgetComponents/InvestigationsIrHeader.vue'

describe('InvestigationsIrHeader.vue (extra branch coverage)', () => {
  describe('isInvestigationsEmpty', () => {
    it('returns false when investigationTypeCount is null', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, null)
      ).toBe(false)
    })

    it('returns false when investigationTypeCount is undefined', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, undefined)
      ).toBe(false)
    })

    it('returns false when object has no keys', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, {})
      ).toBe(false)
    })

    it('returns true when object has at least one truthy value', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, {
          automaticInvestigationCount: 5,
          manualInvestigationCount: 0
        })
      ).toBe(true)
    })

    it('returns false when all values are falsy', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, {
          automaticInvestigationCount: 0,
          manualInvestigationCount: 0
        })
      ).toBe(false)
    })

    it('returns true when manualInvestigationCount is truthy', () => {
      expect(
        InvestigationsIrHeader.methods.isInvestigationsEmpty.call({}, {
          automaticInvestigationCount: 0,
          manualInvestigationCount: 3
        })
      ).toBe(true)
    })
  })
})
