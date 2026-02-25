jest.mock('@/api/direct-creation', () => ({
  __esModule: true,
  default: {
    deleteEmailCreation: jest.fn(() => Promise.resolve())
  }
}))

import DeleteDirectEmailCreationDialog from '@/components/Company Settings/DirectEmailCreation/DeleteDirectEmailCreationDialog.vue'
import DirectCreationService from '@/api/direct-creation'

describe('DeleteDirectEmailCreationDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeleteDirectEmailCreationDialog.name).toBe('DeleteDirectEmailCreationDialog')
  })

  it('getSubtitle returns selected row name', () => {
    const subtitle = DeleteDirectEmailCreationDialog.computed.getSubtitle.call({
      selectedRow: { name: 'Config A' }
    })
    expect(subtitle).toBe('Config A')
  })

  it('handleClose emits on-close with force update value', () => {
    const ctx = { $emit: jest.fn() }
    DeleteDirectEmailCreationDialog.methods.handleClose.call(ctx, true)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close', true)
  })

  it('handleDelete calls api, closes dialog and resets disabled state', async () => {
    const ctx = {
      selectedRow: { resourceId: 'dec-1' },
      isActionButtonDisabled: false,
      handleClose: jest.fn()
    }
    DeleteDirectEmailCreationDialog.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.deleteEmailCreation).toHaveBeenCalledWith('dec-1')
    expect(ctx.handleClose).toHaveBeenCalledWith(true)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
