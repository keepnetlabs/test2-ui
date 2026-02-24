import IncidentAnalysisIrHeader from '@/components/Common/Widget/WidgetComponents/IncidentAnalysisIrHeader.vue'

describe('IncidentAnalysisIrHeader.vue (extra branch coverage)', () => {
  describe('isNotifiedEmailEmpty', () => {
    it('returns true when data is empty object', () => {
      expect(
        IncidentAnalysisIrHeader.methods.isNotifiedEmailEmpty.call({}, {})
      ).toBe(true)
    })

    it('returns true when reportedMailCount and harmfulCount are 0', () => {
      expect(
        IncidentAnalysisIrHeader.methods.isNotifiedEmailEmpty.call({}, {
          reportedMailCount: 0,
          harmfulCount: 0
        })
      ).toBe(true)
    })

    it('returns false when reportedMailCount is present', () => {
      expect(
        IncidentAnalysisIrHeader.methods.isNotifiedEmailEmpty.call({}, {
          reportedMailCount: 5,
          harmfulCount: 0
        })
      ).toBe(false)
    })

    it('returns false when harmfulCount is present', () => {
      expect(
        IncidentAnalysisIrHeader.methods.isNotifiedEmailEmpty.call({}, {
          reportedMailCount: 0,
          harmfulCount: 2
        })
      ).toBe(false)
    })

    it('returns true when data is undefined', () => {
      expect(
        IncidentAnalysisIrHeader.methods.isNotifiedEmailEmpty.call({})
      ).toBe(true)
    })
  })
})
