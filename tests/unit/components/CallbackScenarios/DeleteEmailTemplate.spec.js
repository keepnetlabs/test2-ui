jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    deleteEmailTemplate: jest.fn(() => Promise.resolve()),
    bulkDeleteEmailTemplates: jest.fn(() => Promise.resolve())
  }
}))

import DeleteEmailTemplate from '@/components/CallbackScenarios/DeleteEmailTemplate.vue'
import CallbackService from '@/api/callback'

describe('DeleteEmailTemplate.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeleteEmailTemplate.name).toBe('CallbackDeleteEmailTemplate')
  })

  it('getBodyText returns single and multiple variants', () => {
    expect(
      DeleteEmailTemplate.computed.getBodyText.call({
        isMultiple: false,
        selectedEmailTemplate: { name: 'Template A' }
      })
    ).toBe('Template A will be deleted.')
    expect(
      DeleteEmailTemplate.computed.getBodyText.call({
        isMultiple: true,
        templateCount: 2
      })
    ).toBe('2 email templates will be deleted.')
  })

  it('handleDelete single calls service and emits success events', async () => {
    const $emit = jest.fn()
    const ctx = {
      isMultiple: false,
      isActionButtonDisabled: false,
      selectedEmailTemplate: { resourceId: 't1', name: 'Template A' },
      $emit,
      closeModal: DeleteEmailTemplate.methods.closeModal
    }

    DeleteEmailTemplate.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.deleteEmailTemplate).toHaveBeenCalledWith('t1')
    expect($emit).toHaveBeenCalledWith('handleSuccessDeleteAction', ctx.selectedEmailTemplate)
    expect($emit).toHaveBeenCalledWith('handleCloseModal')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleDelete multiple calls bulk service and emits on-success-multiple', async () => {
    const $emit = jest.fn()
    const payload = { ids: ['t1', 't2'] }
    const ctx = {
      isMultiple: true,
      isActionButtonDisabled: false,
      multipleDeletePayload: payload,
      $emit
    }

    DeleteEmailTemplate.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.bulkDeleteEmailTemplates).toHaveBeenCalledWith(payload)
    expect($emit).toHaveBeenCalledWith('on-success-multiple')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
