jest.mock('@/api/direct-creation', () => ({
  __esModule: true,
  default: {
    getDirectEmailCreation: jest.fn(() =>
      Promise.resolve({
        data: { data: { name: 'GW config', allowedDomains: ['a.com'], tenantId: '' } }
      })
    ),
    getGoogleWorkspaceClientId: jest.fn(() => Promise.resolve({ data: { data: 'client-id-1' } })),
    getDomains: jest.fn(() => Promise.resolve({ data: { data: ['a.com', 'b.com'] } })),
    testDirectEmailCreation: jest.fn(() => Promise.resolve()),
    createDirectEmailCreation: jest.fn(() => Promise.resolve()),
    updateDirectEmailCreation: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  copyToClipboard: jest.fn()
}))

import NewGoogleWorkspaceDEC from '@/components/Company Settings/DirectEmailCreation/NewGoogleWorkspaceDEC.vue'
import DirectCreationService from '@/api/direct-creation'
import { copyToClipboard } from '@/utils/functions'

describe('NewGoogleWorkspaceDEC.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has component name as defined', () => {
    expect(NewGoogleWorkspaceDEC.name).toBe('NewMicrosoft365DEC')
  })

  it('callForSelectedEmail skips when not edit', () => {
    const ctx = { isEdit: false, selectedRow: { resourceId: 'r1' } }
    NewGoogleWorkspaceDEC.methods.callForSelectedEmail.call(ctx)
    expect(DirectCreationService.getDirectEmailCreation).not.toHaveBeenCalled()
  })

  it('callForSelectedEmail fills form in edit mode', async () => {
    const ctx = {
      isEdit: true,
      selectedRow: { resourceId: 'r1' },
      formData: { name: '', domains: [] }
    }
    NewGoogleWorkspaceDEC.methods.callForSelectedEmail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.getDirectEmailCreation).toHaveBeenCalledWith('r1')
    expect(ctx.formData.name).toBe('GW config')
    expect(ctx.formData.domains).toEqual(['a.com'])
  })

  it('callForClientId sets clientId', async () => {
    const ctx = { clientId: '' }
    NewGoogleWorkspaceDEC.methods.callForClientId.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.clientId).toBe('client-id-1')
  })

  it('callForDomains loads domains and defaults all domain on new mode', async () => {
    const ctx = {
      isEdit: false,
      formData: { domains: [] },
      domainItems: [],
      isDomainsLoading: false,
      isShowDomainsLoader: false
    }
    NewGoogleWorkspaceDEC.methods.callForDomains.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.getDomains).toHaveBeenCalled()
    expect(ctx.formData.domains).toContain('All Domains')
    expect(ctx.domainItems.length).toBeGreaterThan(1)
    expect(ctx.isDomainsLoading).toBe(false)
  })

  it('submit opens test email dialog when not tested yet', () => {
    const ctx = {
      isEdit: false,
      isTestEmailSuccessful: false,
      $refs: { refForm: { validate: () => true } },
      toggleShowTestEmailDialog: jest.fn(),
      setActionButtonDisability: jest.fn()
    }
    NewGoogleWorkspaceDEC.methods.submit.call(ctx)
    expect(ctx.toggleShowTestEmailDialog).toHaveBeenCalled()
    expect(DirectCreationService.createDirectEmailCreation).not.toHaveBeenCalled()
  })

  it('submit creates in new mode after successful test', async () => {
    const ctx = {
      isEdit: false,
      isTestEmailSuccessful: true,
      formData: { name: 'A', domains: ['All'] },
      domainItems: [{ value: 'All' }, { value: 'a.com' }],
      selectedRow: { resourceId: 'r1' },
      $refs: { refForm: { validate: () => true } },
      handleClose: jest.fn(),
      setActionButtonDisability: jest.fn()
    }
    NewGoogleWorkspaceDEC.methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.createDirectEmailCreation).toHaveBeenCalled()
    expect(ctx.handleClose).toHaveBeenCalledWith(true)
  })

  it('callForTestEmail handles error branch', async () => {
    DirectCreationService.testDirectEmailCreation.mockRejectedValueOnce({
      response: { data: { message: 'failed' } }
    })
    const ctx = {
      isEdit: false,
      selectedRow: { resourceId: 'r1' },
      isTestEmailActionDisabled: false,
      testEmailErrorMessage: '',
      isTestEmailSuccessful: true,
      toggleShowTestEmailDialog: jest.fn(),
      toggleShowTestEmailErrorDialog: jest.fn()
    }
    NewGoogleWorkspaceDEC.methods.callForTestEmail.call(ctx, { from: 'a@a.com' })
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.testEmailErrorMessage).toBe('failed')
    expect(ctx.isTestEmailSuccessful).toBe(false)
    expect(ctx.toggleShowTestEmailErrorDialog).toHaveBeenCalled()
    expect(ctx.isTestEmailActionDisabled).toBe(false)
  })

  it('handleCopyToClipboard uses formData value by key', () => {
    const ctx = { formData: { clientId: 'id-1' }, clientId: 'id-2' }
    NewGoogleWorkspaceDEC.methods.handleCopyToClipboard.call(ctx, 'clientId')
    expect(copyToClipboard).toHaveBeenCalledWith('id-1')
  })
})
