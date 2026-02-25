import NewScan from '@/components/EmailThreatSmulator/NewScan.vue'
import labels from '@/model/constants/labels'

describe('NewScan.vue', () => {
  describe('computed', () => {
    it('validateCheckbox returns required when acceptRule false', () => {
      const ctx = { acceptRule: false }
      const result = NewScan.computed.validateCheckbox.call(ctx)
      expect(result[0]).toBe(labels.Required)
    })

    it('validateCheckbox returns true when acceptRule true', () => {
      const ctx = { acceptRule: true }
      const result = NewScan.computed.validateCheckbox.call(ctx)
      expect(result[0]).toBe(true)
    })
  })
})
