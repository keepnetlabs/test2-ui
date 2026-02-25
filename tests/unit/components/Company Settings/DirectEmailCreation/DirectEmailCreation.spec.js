import DirectEmailCreation from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreation.vue'
import { DEC_PLATFORMS } from '@/components/Company Settings/DirectEmailCreation/utils'

describe('DirectEmailCreation.vue', () => {
  it('has correct component name', () => {
    expect(DirectEmailCreation.name).toBe('DirectEmailCreation')
  })

  it('checkUrlForMicrosoft handles tenant flow', () => {
    const ctx = {
      $route: { query: { tenant: 'tenant-1' } },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      isMicrosoftEmailCreationInitial: true,
      tenantId: '',
      toggleNewMicrosoft365DECModal: jest.fn()
    }
    DirectEmailCreation.methods.checkUrlForMicrosoft.call(ctx)
    expect(ctx.isMicrosoftEmailCreationInitial).toBe(false)
    expect(ctx.tenantId).toBe('tenant-1')
    expect(ctx.toggleNewMicrosoft365DECModal).toHaveBeenCalled()
    expect(ctx.$router.replace).toHaveBeenCalledWith('/company/company-settings')
  })

  it('checkUrlForMicrosoft handles error flow and snackbar', () => {
    const ctx = {
      $route: { query: { error: 'x', error_description: 'auth failed' } },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      isMicrosoftEmailCreationInitial: true,
      toggleNewMicrosoft365DECModal: jest.fn()
    }
    DirectEmailCreation.methods.checkUrlForMicrosoft.call(ctx)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'auth failed' })
    )
    expect(ctx.toggleNewMicrosoft365DECModal).toHaveBeenCalled()
    expect(ctx.$router.replace).not.toHaveBeenCalled()
  })

  it('toggleNewMicrosoft365DECModal resets state when closing and refreshes when forced', () => {
    const ctx = {
      isShowMicrosoft365DECCreationModal: true,
      isMicrosoftEmailCreationInitial: false,
      isEdit: true,
      tenantId: 't',
      callForTableData: jest.fn()
    }
    DirectEmailCreation.methods.toggleNewMicrosoft365DECModal.call(ctx, true)
    expect(ctx.isMicrosoftEmailCreationInitial).toBe(true)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.tenantId).toBe('')
    expect(ctx.callForTableData).toHaveBeenCalledWith(true)
    expect(ctx.isShowMicrosoft365DECCreationModal).toBe(false)
  })

  it('handleEditRowClick opens microsoft modal path', () => {
    const row = { type: DEC_PLATFORMS.MICROSOFT_365 }
    const ctx = {
      selectedRow: null,
      isEdit: false,
      isMicrosoftEmailCreationInitial: true,
      toggleNewMicrosoft365DECModal: jest.fn(),
      toggleNewGoogleWorkspaceDECModal: jest.fn()
    }
    DirectEmailCreation.methods.handleEditRowClick.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isMicrosoftEmailCreationInitial).toBe(false)
    expect(ctx.toggleNewMicrosoft365DECModal).toHaveBeenCalled()
    expect(ctx.toggleNewGoogleWorkspaceDECModal).not.toHaveBeenCalled()
  })

  it('handleEditRowClick opens google workspace modal path', () => {
    const row = { type: DEC_PLATFORMS.GOOGLE_WORKSPACE }
    const ctx = {
      selectedRow: null,
      isEdit: false,
      toggleNewMicrosoft365DECModal: jest.fn(),
      toggleNewGoogleWorkspaceDECModal: jest.fn()
    }
    DirectEmailCreation.methods.handleEditRowClick.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.toggleNewGoogleWorkspaceDECModal).toHaveBeenCalled()
    expect(ctx.toggleNewMicrosoft365DECModal).not.toHaveBeenCalled()
  })
})
