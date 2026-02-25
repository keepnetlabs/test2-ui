import QuishingCampaignManagerSummary from '@/components/QuishingCampaignManager/QuishingCampaignManagerSummary.vue'

describe('QuishingCampaignManagerSummary.vue', () => {
  describe('computed', () => {
    it('getEmailTemplateData returns empty object when emailTemplateParams empty', () => {
      const ctx = { emailTemplateParams: {} }
      expect(QuishingCampaignManagerSummary.computed.getEmailTemplateData.call(ctx)).toEqual({})
    })

    it('getEmailTemplateData returns resourceId and name when params set', () => {
      const ctx = {
        emailTemplateParams: { resourceId: 'r1', name: 'Template 1' }
      }
      expect(QuishingCampaignManagerSummary.computed.getEmailTemplateData.call(ctx)).toEqual({
        resourceId: 'r1',
        name: 'Template 1'
      })
    })

    it('getEmailTemplateTitle returns formatted title', () => {
      const ctx = { emailTemplateParams: { name: 'My Template' } }
      expect(QuishingCampaignManagerSummary.computed.getEmailTemplateTitle.call(ctx)).toBe(
        'Email Template: My Template'
      )
    })

    it('getLandingPageTemplateData returns empty object when landingPageParams empty', () => {
      const ctx = { landingPageParams: {} }
      expect(QuishingCampaignManagerSummary.computed.getLandingPageTemplateData.call(ctx)).toEqual(
        {}
      )
    })

    it('getScheduledDialogItems returns formData.scheduleItems', () => {
      const ctx = { formData: { scheduleItems: [{ id: 1 }] } }
      expect(QuishingCampaignManagerSummary.computed.getScheduledDialogItems.call(ctx)).toEqual([
        { id: 1 }
      ])
    })

    it('getScheduledDialogItems returns empty array when no scheduleItems', () => {
      const ctx = { formData: {} }
      expect(QuishingCampaignManagerSummary.computed.getScheduledDialogItems.call(ctx)).toEqual([])
    })

    it('getScheduledDate returns formData.scheduledDate', () => {
      const ctx = { formData: { scheduledDate: '2025-01-01' } }
      expect(QuishingCampaignManagerSummary.computed.getScheduledDate.call(ctx)).toBe('2025-01-01')
    })

    it('getTargetGroupItems filters active items', () => {
      const ctx = {
        formData: {
          userCountDetailResponse: {
            data: {
              data: [
                { status: 'Active', id: 1 },
                { status: 'Inactive', id: 2 }
              ]
            }
          }
        }
      }
      const result = QuishingCampaignManagerSummary.computed.getTargetGroupItems.call(ctx)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('Active')
    })
  })
})
