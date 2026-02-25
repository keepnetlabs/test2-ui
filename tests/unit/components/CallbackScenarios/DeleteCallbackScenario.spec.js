jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    deleteCallbackScenario: jest.fn(() => Promise.resolve()),
    bulkDeleteCallbackScenarios: jest.fn(() => Promise.resolve())
  }
}))

import DeleteCallbackScenario from '@/components/CallbackScenarios/DeleteCallbackScenario.vue'
import CallbackService from '@/api/callback'

describe('DeleteCallbackScenario.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeleteCallbackScenario.name).toBe('DeleteCallbackScenario')
  })

  it('getBodyText returns single and multiple variants', () => {
    expect(
      DeleteCallbackScenario.computed.getBodyText.call({
        isMultiple: false,
        selectedScenario: { name: 'Scenario A' }
      })
    ).toBe('Scenario A will be deleted.')
    expect(
      DeleteCallbackScenario.computed.getBodyText.call({
        isMultiple: true,
        scenarioCount: 3
      })
    ).toBe('3 scenarios will be deleted.')
  })

  it('closeModal emits handleCloseModal', () => {
    const $emit = jest.fn()
    DeleteCallbackScenario.methods.closeModal.call({ $emit })
    expect($emit).toHaveBeenCalledWith('handleCloseModal')
  })

  it('handleDelete single calls service and emits success events', async () => {
    const $emit = jest.fn()
    const ctx = {
      isMultiple: false,
      isActionButtonDisabled: false,
      selectedScenario: { resourceId: 'r1', name: 'Scenario A' },
      $emit,
      closeModal: DeleteCallbackScenario.methods.closeModal
    }

    DeleteCallbackScenario.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.deleteCallbackScenario).toHaveBeenCalledWith('r1')
    expect($emit).toHaveBeenCalledWith('handleSuccessDeleteAction', ctx.selectedScenario)
    expect($emit).toHaveBeenCalledWith('handleCloseModal')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleDelete multiple calls bulk service and emits on-success-multiple', async () => {
    const $emit = jest.fn()
    const payload = { ids: ['r1', 'r2'] }
    const ctx = {
      isMultiple: true,
      isActionButtonDisabled: false,
      multipleDeletePayload: payload,
      $emit
    }

    DeleteCallbackScenario.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.bulkDeleteCallbackScenarios).toHaveBeenCalledWith(payload)
    expect($emit).toHaveBeenCalledWith('on-success-multiple')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
