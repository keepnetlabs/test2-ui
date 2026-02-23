jest.mock('@/api/whitelabel', () => ({
  getWhiteLabel: jest.fn(),
  checkDNS: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => '123'),
    scrollToComponent: jest.fn()
  }
})

jest.mock('@/utils/favicon', () => ({
  updateFavicon: jest.fn()
}))

import WhiteLabeling from '@/components/Company Settings/WhiteLabeling.vue'
import { getWhiteLabel, checkDNS } from '@/api/whitelabel'
import { scrollToComponent } from '@/utils/functions'
import { updateFavicon } from '@/utils/favicon'
import labels from '@/model/constants/labels'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanySettings/WhiteLabeling.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed helpers return expected disabled/style/logo/domain values', () => {
    const ctx = {
      isCompanyAdmin: false,
      isActionButtonDisabled: false,
      getWhiteLabelingUpdatePermissions: true,
      formValues: { isShowReleaseNotes: true, pointingUrl: 'cname.keepnetlabs.com' },
      initialFormValues: {}
    }
    expect(WhiteLabeling.computed.getActionButtonDisabled.call(ctx)).toBe(false)
    expect(WhiteLabeling.computed.getActionButtonStyle.call(ctx)).toEqual(
      expect.objectContaining({ marginTop: '21px' })
    )
    expect(WhiteLabeling.computed.getMainDomainInformationText.call(ctx)).toContain(
      'cname.keepnetlabs.com'
    )

    const logoCtx = {
      formValues: {
        mainLogoFile: null,
        mainLogoUrl: 'logo.png',
        minimizedMenuLogoFile: null,
        minimizedMenuLogoUrl: 'mini.png',
        favIconFile: null,
        faviconUrl: 'fav.ico',
        emailTemplateLogoFile: null,
        emailTemplateLogoUrl: 'mail.png'
      }
    }
    expect(WhiteLabeling.computed.getMainLogo.call(logoCtx)).toBe('logo.png')
    expect(WhiteLabeling.computed.getMinimizedLogo.call(logoCtx)).toBe('mini.png')
    expect(WhiteLabeling.computed.getFavIcon.call(logoCtx)).toBe('fav.ico')
    expect(WhiteLabeling.computed.getEmailTemplateLogo.call(logoCtx)).toBe('mail.png')
  })

  it('watch formValues.mainDomainUrl resets validation state', () => {
    const ctx = {
      mainDomainValidationError: 'old',
      mainDomainValidationSuccess: true
    }
    WhiteLabeling.watch['formValues.mainDomainUrl'].call(ctx, 'a.com')
    expect(ctx.mainDomainValidationError).toBe('')
    expect(ctx.mainDomainValidationSuccess).toBe(null)
  })

  it('file/logo handlers update or reset file fields', () => {
    const ctx = {
      formValues: {
        mainLogoFile: 'x',
        minimizedMenuLogoFile: 'x',
        favIconFile: 'x',
        emailTemplateLogoFile: 'x'
      }
    }
    WhiteLabeling.methods.onMenuLogoChange.call(ctx, [])
    WhiteLabeling.methods.onMinimizedLogoChange.call(ctx, [])
    WhiteLabeling.methods.onFavIconChange.call(ctx, [])
    WhiteLabeling.methods.onNotificationTemplateLogoChange.call(ctx, [])
    expect(ctx.formValues.mainLogoFile).toBe(null)
    expect(ctx.formValues.minimizedMenuLogoFile).toBe(null)
    expect(ctx.formValues.favIconFile).toBe(null)
    expect(ctx.formValues.emailTemplateLogoFile).toBe(null)

    const file = { name: 'file.png' }
    WhiteLabeling.methods.onMenuLogoChange.call(ctx, file)
    expect(ctx.formValues.mainLogoFile).toEqual(file)
  })

  it('other logo handlers set file object on non-empty input', () => {
    const ctx = {
      formValues: {
        minimizedMenuLogoFile: null,
        favIconFile: null,
        emailTemplateLogoFile: null
      }
    }
    const mini = { name: 'mini.svg' }
    const fav = { name: 'favicon.ico' }
    const mail = { name: 'mail.png' }

    WhiteLabeling.methods.onMinimizedLogoChange.call(ctx, mini)
    WhiteLabeling.methods.onFavIconChange.call(ctx, fav)
    WhiteLabeling.methods.onNotificationTemplateLogoChange.call(ctx, mail)

    expect(ctx.formValues.minimizedMenuLogoFile).toEqual(mini)
    expect(ctx.formValues.favIconFile).toEqual(fav)
    expect(ctx.formValues.emailTemplateLogoFile).toEqual(mail)
  })

  it('mainDomainCustomValidation and getFileUploadClasses behave as expected', () => {
    const invalid = WhiteLabeling.methods.mainDomainCustomValidation('https://bad.com')
    expect(invalid).not.toBe(true)
    expect(WhiteLabeling.methods.mainDomainCustomValidation('example.com')).toBe(true)
    expect(WhiteLabeling.methods.getFileUploadClasses.call({}, '')).toEqual([
      'white-labeling__file-upload',
      { 'mb-6': true }
    ])
  })

  it('callForData populates state and handles favicon update', async () => {
    getWhiteLabel.mockResolvedValue({
      data: {
        data: {
          resourceId: 'wl-1',
          brandName: 'Keepnet',
          faviconUrl: 'https://x/favicon.ico',
          systemVersion: '1.0.0',
          supportEmailAddress: 'support@example.com'
        }
      }
    })
    const ctx = {
      isWhiteLabelLoading: false,
      formValues: { brandName: '', supportEmailAddress: '' },
      initialFormValues: {},
      configureCompanyWhitelabelingResourceId: '',
      $store: { dispatch: jest.fn() }
    }
    WhiteLabeling.methods.callForData.call(ctx, { loading: true })
    await flushPromises()

    expect(getWhiteLabel).toHaveBeenCalled()
    expect(updateFavicon).toHaveBeenCalledWith('https://x/favicon.ico')
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'whitelabel/setState',
      expect.objectContaining({ brandName: 'Keepnet' })
    )
    expect(ctx.configureCompanyWhitelabelingResourceId).toBe('wl-1')
    expect(ctx.formValues.brandName).toBe('Keepnet')
    expect(ctx.formValues.supportEmailAddress).toBe('support@example.com')
    expect(ctx.isWhiteLabelLoading).toBe(false)
  })

  it('submit emits configure event in company configure mode', () => {
    const emit = jest.fn()
    WhiteLabeling.methods.submit.call({ isCompanyConfigure: true, $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-configure-company-submit')
  })

  it('submit success path dispatches update and refreshes', async () => {
    const dispatch = jest.fn((type) => {
      if (type === 'whitelabel/updateData') return Promise.resolve()
      return Promise.resolve()
    })
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingUpdatePermissions: true,
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { brandName: 'A', acceptDnsRecordSettings: true, mainDomainUrl: 'a.com', pointingUrl: 'p.com' },
      isActionButtonDisabled: false,
      isWhiteLabelLoading: true,
      isShowDomainDialog: true,
      whiteLabelingErrorMessage: 'x',
      acceptedDnsRecordSettingsDomain: 'a.com',
      $refs: { refForm: { validate: () => true } },
      $store: { dispatch },
      callForData: jest.fn(),
      toggleWhiteLabelingDomainDialog: jest.fn()
    }
    WhiteLabeling.methods.submit.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith(
      'whitelabel/updateData',
      expect.objectContaining({ resourceId: 'wl-1' })
    )
    expect(ctx.formValues.acceptDnsRecordSettings).toBe(false)
    expect(ctx.isShowDomainDialog).toBe(false)
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('submit 404 path sets domain dialog error details', async () => {
    const dispatch = jest.fn(() =>
      Promise.reject({ response: { status: 404 } })
    )
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingUpdatePermissions: true,
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { mainDomainUrl: 'acme.com', pointingUrl: 'cname.keepnet.com' },
      $refs: { refForm: { validate: () => true } },
      $store: { dispatch },
      callForData: jest.fn(),
      toggleWhiteLabelingDomainDialog: jest.fn()
    }
    WhiteLabeling.methods.submit.call(ctx)
    await flushPromises()

    expect(ctx.whiteLabelingErrorTitle).toBe('CNAME record does not exist')
    expect(ctx.acceptedDnsRecordSettingsDomain).toBe('acme.com')
    expect(ctx.toggleWhiteLabelingDomainDialog).toHaveBeenCalled()
  })

  it('submit invalid form scrolls to first error component', async () => {
    const errorEl = {}
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingUpdatePermissions: true,
      $refs: { refForm: { validate: () => false, $el: { querySelector: () => errorEl } } },
      $nextTick: (cb) => cb()
    }
    WhiteLabeling.methods.submit.call(ctx)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('reset dialog, reset handler and checkMainDomainValidation branches work', async () => {
    const ctx = {
      resetToDefaultWhiteLabelingDialogStatus: false,
      getWhiteLabelingDeletePermissions: true,
      isWhiteLabelLoading: false,
      isResetToDefaultActionButtonDisabled: false,
      formValues: { brandName: 'x' },
      fileUploadKey: 'old',
      $store: { dispatch: jest.fn(() => Promise.resolve()) },
      callForData: jest.fn(),
      toggleWhiteLabelingDialog: jest.fn()
    }
    WhiteLabeling.methods.toggleWhiteLabelingDialog.call(ctx)
    expect(ctx.resetToDefaultWhiteLabelingDialogStatus).toBe(true)

    WhiteLabeling.methods.handleResetWhiteLabeling.call(ctx)
    await flushPromises()
    expect(ctx.$store.dispatch).toHaveBeenCalledWith('whitelabel/resetToDefault')
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.fileUploadKey).toContain('key-')

    const dnsCtx = {
      formValues: { mainDomainUrl: 'example.com' },
      isCheckingMainDomainValidation: false,
      mainDomainValidationError: '',
      mainDomainValidationSuccess: null
    }
    checkDNS.mockResolvedValueOnce({ data: { status: 'SUCCESS' } })
    WhiteLabeling.methods.checkMainDomainValidation.call(dnsCtx)
    await flushPromises()
    expect(dnsCtx.mainDomainValidationSuccess).toBe(true)

    checkDNS.mockRejectedValueOnce({
      response: { data: { validationMessages: ['Not found'] } }
    })
    WhiteLabeling.methods.checkMainDomainValidation.call(dnsCtx)
    await flushPromises()
    expect(dnsCtx.mainDomainValidationError).toBe('Not found')
    expect(dnsCtx.mainDomainValidationSuccess).toBe(false)
  })

  it('isCompanyAdmin computed maps store role', () => {
    const ctx = { $store: { state: { auth: { userRoleName: labels.CompanyAdmin } } } }
    expect(WhiteLabeling.computed.isCompanyAdmin.call(ctx)).toBe(true)
  })

  it('created calls callForData with company configure override config', () => {
    const ctx = {
      isCompanyConfigure: true,
      createdCompanyId: 'company-1',
      callForData: jest.fn(),
      getWhiteLabelingGetPermissions: false
    }
    WhiteLabeling.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledWith({
      overrideCompanyId: true,
      headers: { 'X-IR-COMPANY-ID': 'company-1' },
      loading: true
    })
  })

  it('created calls callForData when get permission exists', () => {
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingGetPermissions: true,
      callForData: jest.fn()
    }
    WhiteLabeling.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('created does not call callForData without permission in non-configure mode', () => {
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingGetPermissions: false,
      callForData: jest.fn()
    }
    WhiteLabeling.created.call(ctx)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('domain dialog handlers and mainDomain watcher update flags', () => {
    const ctx = {
      isShowDomainDialog: false,
      formValues: { acceptDnsRecordSettings: false },
      acceptedDnsRecordSettingsDomain: 'example.com',
      submit: jest.fn()
    }
    WhiteLabeling.methods.toggleWhiteLabelingDomainDialog.call(ctx)
    expect(ctx.isShowDomainDialog).toBe(true)

    WhiteLabeling.methods.handleConfirmWhiteLabelingDomainDialog.call(ctx)
    expect(ctx.formValues.acceptDnsRecordSettings).toBe(true)
    expect(ctx.submit).toHaveBeenCalled()

    const watchCtx = {
      formValues: { acceptDnsRecordSettings: false },
      acceptedDnsRecordSettingsDomain: 'example.com'
    }
    WhiteLabeling.watch.mainDomainUrl.call(watchCtx, 'example.com')
    expect(watchCtx.formValues.acceptDnsRecordSettings).toBe(true)
    WhiteLabeling.watch.mainDomainUrl.call(watchCtx, 'other.com')
    expect(watchCtx.formValues.acceptDnsRecordSettings).toBe(false)
  })

  it('getImagePreview uses string directly and blob via createObjectURL', () => {
    expect(WhiteLabeling.methods.getImagePreview('https://img/logo.png')).toBe('https://img/logo.png')

    const original = global.URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:preview')
    const blobLike = Buffer.from('x')
    expect(WhiteLabeling.methods.getImagePreview(blobLike)).toBe('blob:preview')
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blobLike)
    global.URL.createObjectURL = original
  })

  it('getActionButtonDisabled returns true for unchanged/admin/no-permission states', () => {
    expect(
      WhiteLabeling.computed.getActionButtonDisabled.call({
        isCompanyAdmin: true,
        isActionButtonDisabled: false,
        getWhiteLabelingUpdatePermissions: true,
        formValues: {},
        initialFormValues: { x: 1 }
      })
    ).toBe(true)

    const sameState = { a: 1 }
    expect(
      WhiteLabeling.computed.getActionButtonDisabled.call({
        isCompanyAdmin: false,
        isActionButtonDisabled: false,
        getWhiteLabelingUpdatePermissions: true,
        formValues: sameState,
        initialFormValues: { a: 1 }
      })
    ).toBe(true)

    expect(
      WhiteLabeling.computed.getActionButtonDisabled.call({
        isCompanyAdmin: false,
        isActionButtonDisabled: true,
        getWhiteLabelingUpdatePermissions: true,
        formValues: { a: 2 },
        initialFormValues: { a: 1 }
      })
    ).toBe(true)

    expect(
      WhiteLabeling.computed.getActionButtonDisabled.call({
        isCompanyAdmin: false,
        isActionButtonDisabled: false,
        getWhiteLabelingUpdatePermissions: false,
        formValues: { a: 2 },
        initialFormValues: { a: 1 }
      })
    ).toBe(true)
  })

  it('getActionButtonStyle adds disabled style and alternate margin when release notes hidden', () => {
    const style = WhiteLabeling.computed.getActionButtonStyle.call({
      formValues: { isShowReleaseNotes: false },
      getActionButtonDisabled: true
    })

    expect(style).toEqual(
      expect.objectContaining({
        marginTop: '23px',
        opacity: 0.5,
        cursor: 'auto',
        pointerEvents: 'none'
      })
    )
  })

  it('submit non-404 error calls callForData fallback', async () => {
    const dispatch = jest.fn(() => Promise.reject({ response: { status: 500 } }))
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingUpdatePermissions: true,
      configureCompanyWhitelabelingResourceId: 'wl-1',
      formValues: { mainDomainUrl: 'acme.com', pointingUrl: 'cname.keepnet.com' },
      $refs: { refForm: { validate: () => true } },
      $store: { dispatch },
      callForData: jest.fn(),
      toggleWhiteLabelingDomainDialog: jest.fn()
    }
    WhiteLabeling.methods.submit.call(ctx)
    await flushPromises()

    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.toggleWhiteLabelingDomainDialog).not.toHaveBeenCalled()
  })

  it('handleResetWhiteLabeling does nothing without delete permission', async () => {
    const ctx = {
      getWhiteLabelingDeletePermissions: false,
      $store: { dispatch: jest.fn() },
      callForData: jest.fn()
    }
    WhiteLabeling.methods.handleResetWhiteLabeling.call(ctx)
    await flushPromises()
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('submit does nothing when update permission is missing', () => {
    const dispatch = jest.fn()
    const ctx = {
      isCompanyConfigure: false,
      getWhiteLabelingUpdatePermissions: false,
      $refs: { refForm: { validate: jest.fn(() => true) } },
      $store: { dispatch }
    }

    WhiteLabeling.methods.submit.call(ctx)

    expect(dispatch).not.toHaveBeenCalled()
    expect(ctx.$refs.refForm.validate).not.toHaveBeenCalled()
  })

  it('callForData skips favicon update when faviconUrl is absent', async () => {
    getWhiteLabel.mockResolvedValueOnce({
      data: {
        data: {
          resourceId: 'wl-2',
          brandName: 'NoFav'
        }
      }
    })
    const ctx = {
      isWhiteLabelLoading: false,
      formValues: { brandName: '' },
      initialFormValues: {},
      configureCompanyWhitelabelingResourceId: '',
      $store: { dispatch: jest.fn() }
    }

    WhiteLabeling.methods.callForData.call(ctx)
    await flushPromises()

    expect(updateFavicon).not.toHaveBeenCalled()
    expect(ctx.formValues.brandName).toBe('NoFav')
    expect(ctx.configureCompanyWhitelabelingResourceId).toBe('wl-2')
  })

  it('checkMainDomainValidation keeps state when response status is not SUCCESS', async () => {
    const dnsCtx = {
      formValues: { mainDomainUrl: 'example.com' },
      isCheckingMainDomainValidation: false,
      mainDomainValidationError: '',
      mainDomainValidationSuccess: null
    }
    checkDNS.mockResolvedValueOnce({ data: { status: 'FAILED' } })

    WhiteLabeling.methods.checkMainDomainValidation.call(dnsCtx)
    await flushPromises()

    expect(dnsCtx.mainDomainValidationError).toBe('')
    expect(dnsCtx.mainDomainValidationSuccess).toBe(null)
    expect(dnsCtx.isCheckingMainDomainValidation).toBe(false)
  })

  it('getActionButtonStyle when enabled only sets margin', () => {
    const style = WhiteLabeling.computed.getActionButtonStyle.call({
      formValues: { isShowReleaseNotes: true },
      getActionButtonDisabled: false
    })

    expect(style).toEqual({ marginTop: '21px' })
  })

  it('checkMainDomainValidation keeps default error when backend message is absent', async () => {
    const dnsCtx = {
      formValues: { mainDomainUrl: 'example.com' },
      isCheckingMainDomainValidation: false,
      mainDomainValidationError: '',
      mainDomainValidationSuccess: null
    }
    checkDNS.mockRejectedValueOnce({ response: { data: {} } })
    WhiteLabeling.methods.checkMainDomainValidation.call(dnsCtx)
    await flushPromises()
    expect(dnsCtx.mainDomainValidationError).toBe('')
    expect(dnsCtx.mainDomainValidationSuccess).toBe(null)
    expect(dnsCtx.isCheckingMainDomainValidation).toBe(false)
  })
})
