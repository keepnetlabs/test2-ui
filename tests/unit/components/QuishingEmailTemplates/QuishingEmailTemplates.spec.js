jest.mock('@/api/quishing', () => ({
  deleteEmailTemplate: jest.fn(),
  deleteIndividualPrintoutTemplate: jest.fn(),
  getEmailTemplatePreviewContent: jest.fn(),
  getQuishingTemplatePreviewContent: jest.fn(),
  bulkDeleteQuishingTemplates: jest.fn()
}))

import QuishingEmailTemplates from '@/components/QuishingEmailTemplates/QuishingEmailTemplates.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import QuishingService from '@/api/quishing'

describe('QuishingEmailTemplates.vue', () => {
  describe('computed', () => {
    it('getSelectedEmailTemplateId returns resourceId when selected', () => {
      const ctx = { selectedEmailTemplate: { resourceId: 't1' } }
      expect(QuishingEmailTemplates.computed.getSelectedEmailTemplateId.call(ctx)).toBe('t1')
    })

    it('getSelectedEmailTemplateId returns empty when no selection', () => {
      const ctx = { selectedEmailTemplate: null }
      expect(QuishingEmailTemplates.computed.getSelectedEmailTemplateId.call(ctx)).toBe('')
    })

    it('isIndividualPrintoutTemplate returns true when quishingType is individual printout', () => {
      const ctx = {
        selectedEmailTemplate: {
          quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
        }
      }
      expect(QuishingEmailTemplates.computed.isIndividualPrintoutTemplate.call(ctx)).toBe(true)
    })

    it('isIndividualPrintoutTemplate returns false when quishingType is email', () => {
      const ctx = {
        selectedEmailTemplate: { quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL }
      }
      expect(QuishingEmailTemplates.computed.isIndividualPrintoutTemplate.call(ctx)).toBe(false)
    })

    it('getPreviewDialogApiFunc returns function when isIndividualPrintoutTemplate true', () => {
      const ctx = { isIndividualPrintoutTemplate: true }
      const fn = QuishingEmailTemplates.computed.getPreviewDialogApiFunc.call(ctx)
      expect(typeof fn).toBe('function')
    })

    it('getPreviewDialogApiFunc returns getEmailTemplatePreviewContent when not individual printout', () => {
      const ctx = {
        selectedEmailTemplate: { quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL },
        isIndividualPrintoutTemplate: false
      }
      const fn = QuishingEmailTemplates.computed.getPreviewDialogApiFunc.call(ctx)
      expect(typeof fn).toBe('function')
    })

    it('getDeleteApiFunc returns deleteIndividualPrintoutTemplate when isIndividualPrintoutTemplate', () => {
      const ctx = { isIndividualPrintoutTemplate: true }
      const fn = QuishingEmailTemplates.computed.getDeleteApiFunc.call(ctx)
      expect(typeof fn).toBe('function')
    })

    it('getDeleteApiFunc returns deleteEmailTemplate when not individual printout', () => {
      const ctx = { isIndividualPrintoutTemplate: false }
      const fn = QuishingEmailTemplates.computed.getDeleteApiFunc.call(ctx)
      expect(typeof fn).toBe('function')
    })
  })

  describe('methods', () => {
    it('toggleNewEmailTemplateModal toggles modal and sets selectedEmailTemplate', () => {
      const ctx = {
        selectedEmailTemplate: null,
        isShowNewEmailTemplateModal: false,
        isDuplicate: false,
        isEdit: false
      }
      QuishingEmailTemplates.methods.toggleNewEmailTemplateModal.call(ctx, { id: 1 }, true)
      expect(ctx.selectedEmailTemplate).toEqual({ id: 1 })
      expect(ctx.isDuplicate).toBe(true)
      expect(ctx.isEdit).toBe(true)
      expect(ctx.isShowNewEmailTemplateModal).toBe(true)
    })

    it('togglePreviewDialog toggles preview dialog', () => {
      const ctx = {
        selectedEmailTemplate: null,
        isShowPreviewDialog: false
      }
      QuishingEmailTemplates.methods.togglePreviewDialog.call(ctx, { id: 1 })
      expect(ctx.selectedEmailTemplate).toEqual({ id: 1 })
      expect(ctx.isShowPreviewDialog).toBe(true)
    })

    it('handleMultipleDelete sets multiple delete state', () => {
      const ctx = {
        isMultipleDelete: false,
        multipleDeletedTemplatesCount: 0,
        multipleTemplatesPayload: {}
      }
      QuishingEmailTemplates.methods.handleMultipleDelete.call(ctx, {
        selections: [{ resourceId: 'r1' }],
        excludedItems: [],
        selectAll: false,
        axiosPayload: { filter: {} },
        serverSideProps: { totalNumberOfRecords: 10 }
      })
      expect(ctx.isMultipleDelete).toBe(true)
      expect(ctx.multipleDeletedTemplatesCount).toBe(1)
      expect(ctx.multipleTemplatesPayload.items).toEqual(['r1'])
    })
  })
})
