import QuishingCampaignManagerPrintoutAddOrEditModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerPrintoutAddOrEditModal.vue'
import labels from '@/model/constants/labels'

describe('QuishingCampaignManagerPrintoutAddOrEditModal.vue', () => {
  describe('computed', () => {
    it('getTitle returns Edit title when isEdit', () => {
      const ctx = { isEdit: true }
      const result = QuishingCampaignManagerPrintoutAddOrEditModal.computed.getTitle.call(ctx)
      expect(result).toContain(labels.Edit)
      expect(result).toContain('Quishing')
    })

    it('getTitle returns New title when not isEdit', () => {
      const ctx = { isEdit: false }
      const result = QuishingCampaignManagerPrintoutAddOrEditModal.computed.getTitle.call(ctx)
      expect(result).toContain(labels.New)
    })
  })
})
