jest.mock('@/api/incidentResponder', () => ({
  reAnalyzeEmail: jest.fn()
}))

import { reAnalyzeEmail } from '@/api/incidentResponder'
import ReAnalyzeIncidentDialog from '@/components/IncidentResponder/ReAnalyzeIncidentDialog.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ReAnalyzeIncidentDialog.vue', () => {
  const { methods } = ReAnalyzeIncidentDialog

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('closeDialog emits on-close-dialog', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    methods.closeDialog.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-close-dialog')
  })

  it('confirm calls api, emits on-confirm and resets saveDisable', async () => {
    reAnalyzeEmail.mockResolvedValueOnce({})
    const emit = jest.fn()
    const ctx = {
      resourceId: 'mail-1',
      saveDisable: false,
      closeDialog: methods.closeDialog,
      $emit: emit
    }

    methods.confirm.call(ctx)
    expect(ctx.saveDisable).toBe(true)
    await flushPromises()

    expect(reAnalyzeEmail).toHaveBeenCalledWith('mail-1')
    expect(emit).toHaveBeenCalledWith('on-confirm')
    expect(emit).toHaveBeenCalledWith('on-close-dialog')
    expect(ctx.saveDisable).toBe(false)
  })

  it('confirm closes dialog and resets state when api fails', async () => {
    reAnalyzeEmail.mockRejectedValueOnce(new Error('failed'))
    const emit = jest.fn()
    const ctx = {
      resourceId: 'mail-2',
      saveDisable: false,
      closeDialog: methods.closeDialog,
      $emit: emit
    }

    methods.confirm.call(ctx)
    expect(ctx.saveDisable).toBe(true)
    await flushPromises()

    expect(reAnalyzeEmail).toHaveBeenCalledWith('mail-2')
    expect(emit).not.toHaveBeenCalledWith('on-confirm')
    expect(emit).toHaveBeenCalledWith('on-close-dialog')
    expect(ctx.saveDisable).toBe(false)
  })
})
