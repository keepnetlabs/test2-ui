jest.mock('@/api/direct-creation', () => ({
  __esModule: true,
  default: {
    getDirectEmailCreation: jest.fn(() =>
      Promise.resolve({
        data: { data: { name: 'MS config', allowedDomains: ['x.com'], tenantId: 'ten-edit' } }
      })
    ),
    getDomains: jest.fn(() => Promise.resolve({ data: { data: ['x.com', 'y.com'] } })),
    getDirectEmailSettings: jest.fn(() =>
      Promise.resolve({ data: { data: { applicationId: 'app-1', redirectUri: 'https://r' } } })
    ),
    testDirectEmailCreation: jest.fn(() => Promise.resolve()),
    createDirectEmailCreation: jest.fn(() => Promise.resolve()),
    updateDirectEmailCreation: jest.fn(() => Promise.resolve())
  }
}))

import NewMicrosoft365DEC from '@/components/Company Settings/DirectEmailCreation/NewMicrosoft365DEC.vue'
import DirectCreationService from '@/api/direct-creation'

describe('NewMicrosoft365DEC.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(NewMicrosoft365DEC.name).toBe('NewMicrosoft365DEC')
  })

  it('callForDomains returns early for initial new flow', () => {
    const ctx = { isInitial: true, isEdit: false }
    NewMicrosoft365DEC.methods.callForDomains.call(ctx)
    expect(DirectCreationService.getDomains).not.toHaveBeenCalled()
  })

  it('callForSelectedEmail fills edit form and tenant', async () => {
    const ctx = {
      isEdit: true,
      selectedRow: { resourceId: 'r1' },
      editedTenantId: null,
      formData: { name: '', domains: [] }
    }
    NewMicrosoft365DEC.methods.callForSelectedEmail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.editedTenantId).toBe('ten-edit')
    expect(ctx.formData.name).toBe('MS config')
    expect(ctx.formData.domains).toEqual(['x.com'])
  })

  it('callForApplicationId sets connection url in initial mode', async () => {
    const ctx = { isInitial: true, connectionUrl: '' }
    NewMicrosoft365DEC.methods.callForApplicationId.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.connectionUrl).toContain('client_id=app-1')
  })

  it('submit shows snackbar when initial mode', () => {
    const ctx = {
      isInitial: true,
      $store: { dispatch: jest.fn() }
    }
    NewMicrosoft365DEC.methods.submit.call(ctx)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ icon: 'mdi-alert-circle' })
    )
  })

  it('submit creates in non-edit mode', async () => {
    const ctx = {
      isInitial: false,
      isEdit: false,
      tenantId: 'ten-1',
      formData: { name: 'Cfg', domains: ['All'] },
      domainItems: [{ value: 'All' }, { value: 'x.com' }],
      $refs: { refForm: { validate: () => true } },
      setActionButtonDisability: jest.fn(),
      handleClose: jest.fn()
    }
    NewMicrosoft365DEC.methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.createDirectEmailCreation).toHaveBeenCalled()
    expect(ctx.handleClose).toHaveBeenCalledWith(true)
  })

  it('callForTestEmail sends edit payload and handles success', async () => {
    const ctx = {
      isEdit: true,
      tenantId: 'ten-1',
      editedTenantId: 'ten-edit',
      selectedRow: { resourceId: 'r1' },
      isTestEmailActionDisabled: false,
      toggleShowTestEmailDialog: jest.fn(),
      toggleShowTestEmailErrorDialog: jest.fn()
    }
    NewMicrosoft365DEC.methods.callForTestEmail.call(ctx, { to: 'a@a.com' })
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.testDirectEmailCreation).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: 'ten-edit', resourceId: 'r1' })
    )
    expect(ctx.toggleShowTestEmailDialog).toHaveBeenCalled()
    expect(ctx.isTestEmailActionDisabled).toBe(false)
  })

  it('handleDomainFocus mirrors loading state', () => {
    const ctx = { isDomainsLoading: true, isShowDomainsLoader: false }
    NewMicrosoft365DEC.methods.handleDomainFocus.call(ctx)
    expect(ctx.isShowDomainsLoader).toBe(true)
  })
})
