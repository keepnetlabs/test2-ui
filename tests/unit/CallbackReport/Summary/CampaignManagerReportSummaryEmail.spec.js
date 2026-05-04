jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getEmailTemplate: jest.fn()
  }
}))

import CampaignManagerReportSummaryEmail from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryEmail.vue'
import CallbackService from '@/api/callback'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackReport/Summary/CampaignManagerReportSummaryEmail.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('computed', () => {
    it('emailTemplatePreviewSelectedRow merges formData with current name', () => {
      const ctx = {
        formData: { resourceId: 'et-1', extra: 'x' },
        name: 'Email A'
      }
      expect(
        CampaignManagerReportSummaryEmail.computed.emailTemplatePreviewSelectedRow.call(ctx)
      ).toEqual({ resourceId: 'et-1', extra: 'x', name: 'Email A' })
    })

    it('emailTemplatePreviewSelectedRow handles missing formData', () => {
      const ctx = { formData: null, name: 'Email A' }
      expect(
        CampaignManagerReportSummaryEmail.computed.emailTemplatePreviewSelectedRow.call(ctx)
      ).toEqual({ name: 'Email A' })
    })

    it('emailTemplatePreviewParams uses formData.attachment when present', () => {
      const ctx = {
        name: 'Tpl',
        fromName: 'Sender',
        fromAddress: 'sender@x.com',
        subject: 'Subject',
        formData: { attachment: { name: 'file.pdf' } }
      }
      expect(
        CampaignManagerReportSummaryEmail.computed.emailTemplatePreviewParams.call(ctx)
      ).toEqual({
        name: 'Tpl',
        fromName: 'Sender',
        fromAddress: 'sender@x.com',
        subject: 'Subject',
        attachment: { name: 'file.pdf' }
      })
    })

    it('emailTemplatePreviewParams falls back to null attachment when missing', () => {
      const ctx = {
        name: 'Tpl',
        fromName: '',
        fromAddress: '',
        subject: '',
        formData: {}
      }
      expect(
        CampaignManagerReportSummaryEmail.computed.emailTemplatePreviewParams.call(ctx).attachment
      ).toBeNull()

      const ctxNullForm = {
        name: 'Tpl',
        fromName: '',
        fromAddress: '',
        subject: '',
        formData: null
      }
      expect(
        CampaignManagerReportSummaryEmail.computed.emailTemplatePreviewParams.call(ctxNullForm)
          .attachment
      ).toBeNull()
    })
  })

  describe('callForTemplate', () => {
    it('does nothing when formData has no resourceId', () => {
      const ctx = { formData: {} }
      CampaignManagerReportSummaryEmail.methods.callForTemplate.call(ctx)
      expect(CallbackService.getEmailTemplate).not.toHaveBeenCalled()
    })

    it('populates state from api response', async () => {
      CallbackService.getEmailTemplate.mockResolvedValueOnce({
        data: {
          data: {
            template: '<html />',
            fromName: 'Sender',
            fromAddress: 'sender@x.com',
            subject: 'Subject',
            name: 'Tpl'
          }
        }
      })
      const ctx = {
        formData: { resourceId: 'et-1' },
        emailTemplate: null,
        fromName: '',
        fromAddress: '',
        subject: '',
        name: ''
      }
      CampaignManagerReportSummaryEmail.methods.callForTemplate.call(ctx)
      await flushPromises()

      expect(CallbackService.getEmailTemplate).toHaveBeenCalledWith('et-1')
      expect(ctx.emailTemplate).toBe('<html />')
      expect(ctx.fromName).toBe('Sender')
      expect(ctx.fromAddress).toBe('sender@x.com')
      expect(ctx.subject).toBe('Subject')
      expect(ctx.name).toBe('Tpl')
    })
  })

  describe('lifecycle', () => {
    it('created hook calls callForTemplate', () => {
      const callForTemplate = jest.fn()
      CampaignManagerReportSummaryEmail.created.call({ callForTemplate })
      expect(callForTemplate).toHaveBeenCalled()
    })
  })
})
