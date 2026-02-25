import QuishingCampaignManagerNewInstanceModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerNewInstanceModal.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import labels from '@/model/constants/labels'

describe('QuishingCampaignManagerNewInstanceModal.vue', () => {
  describe('computed', () => {
    it('isQuishingTypeEmail returns true when selectedRow type is EMAIL', () => {
      const ctx = { selectedRow: { type: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL } }
      expect(
        QuishingCampaignManagerNewInstanceModal.computed.isQuishingTypeEmail.call(ctx)
      ).toBe(true)
    })

    it('isQuishingTypeEmail returns false when selectedRow type is not EMAIL', () => {
      const ctx = { selectedRow: { type: 'other' } }
      expect(
        QuishingCampaignManagerNewInstanceModal.computed.isQuishingTypeEmail.call(ctx)
      ).toBe(false)
    })

    it('getTargetGroupErrorMessage returns TargetGroupSelectionRequiredError when no groups', () => {
      const ctx = {
        formValues: { targetGroupResourceIds: [] },
        getTargetGroupErrorText: 'Required'
      }
      expect(
        QuishingCampaignManagerNewInstanceModal.computed.getTargetGroupErrorMessage.call(ctx)
      ).toBe(labels.TargetGroupSelectionRequiredError)
    })

    it('getTargetGroupErrorMessage returns getTargetGroupErrorText when groups selected', () => {
      const ctx = {
        formValues: { targetGroupResourceIds: ['g1'] },
        getTargetGroupErrorText: 'Some error'
      }
      expect(
        QuishingCampaignManagerNewInstanceModal.computed.getTargetGroupErrorMessage.call(ctx)
      ).toBe('Some error')
    })
  })
})
