import labels from '@/model/constants/labels'
import NewSmtpSettings from '@/components/Company Settings/SmtpSettings/NewSmtpSettings.vue'

describe('NewSmtpSettings.vue', () => {
  it('has expected component name', () => {
    expect(NewSmtpSettings.name).toBe('NewSmtpSettings')
  })

  it('computed getTitle returns edit/new title', () => {
    expect(NewSmtpSettings.computed.getTitle.call({ isEdit: true, resourceId: 'r1' })).toBe(
      labels.EditSMTPSetting
    )
    expect(NewSmtpSettings.computed.getTitle.call({ isEdit: false, resourceId: '' })).toBe(
      labels.NewSMTPSetting
    )
  })

  it('getUserNameAndPasswordCommonProps reflects authentication state', () => {
    expect(
      NewSmtpSettings.computed.getUserNameAndPasswordCommonProps.call({
        formValues: { useAuthentication: false }
      })
    ).toBeNull()

    expect(
      NewSmtpSettings.computed.getUserNameAndPasswordCommonProps.call({
        formValues: { useAuthentication: true }
      })
    ).toEqual({ hint: '*Required', persistentHint: true })
  })

  it('handleChangeServiceProvider parses host and port', () => {
    const ctx = { formValues: { serverAddress: '', serverPort: '' } }

    NewSmtpSettings.methods.handleChangeServiceProvider.call(ctx, 'smtp.keepnetlabs.com:587')
    expect(ctx.formValues.serverAddress).toBe('smtp.keepnetlabs.com')
    expect(ctx.formValues.serverPort).toBe('587')

    NewSmtpSettings.methods.handleChangeServiceProvider.call(ctx, ':')
    expect(ctx.formValues.serverAddress).toBe('')
    expect(ctx.formValues.serverPort).toBe('')
  })

  it('onPortChange keeps only numeric input', () => {
    const ctx = {
      formValues: { serverPort: '25' },
      $refs: { refTextField: { lazyValue: '25' } }
    }

    NewSmtpSettings.methods.onPortChange.call(ctx, 'abc')
    expect(ctx.formValues.serverPort).toBe('25')

    NewSmtpSettings.methods.onPortChange.call(ctx, '2525')
    expect(ctx.formValues.serverPort).toBe('2525')
    expect(ctx.$refs.refTextField.lazyValue).toBe('2525')

    NewSmtpSettings.methods.onPortChange.call(ctx, '')
    expect(ctx.formValues.serverPort).toBe('')
  })

  it('getUserNameRules adds required rule only when authentication is enabled', () => {
    const noAuthRules = NewSmtpSettings.computed.getUserNameRules.call({
      formValues: { useAuthentication: false }
    })
    const authRules = NewSmtpSettings.computed.getUserNameRules.call({
      formValues: { useAuthentication: true }
    })

    expect(noAuthRules.length).toBe(1)
    expect(authRules.length).toBe(2)
  })

  it('getPasswordRules adds required rule only when authentication is enabled', () => {
    const noAuthRules = NewSmtpSettings.computed.getPasswordRules.call({
      formValues: { useAuthentication: false }
    })
    const authRules = NewSmtpSettings.computed.getPasswordRules.call({
      formValues: { useAuthentication: true }
    })

    expect(noAuthRules.length).toBe(1)
    expect(authRules.length).toBe(2)
  })

  it('toggle methods flip dialog visibility booleans', () => {
    const ctx = {
      isTestEmailDialogShowing: false,
      isTestEmailErrorDialogShowing: false
    }

    NewSmtpSettings.methods.toggleTestConnectionDialog.call(ctx)
    expect(ctx.isTestEmailDialogShowing).toBe(true)
    NewSmtpSettings.methods.toggleTestConnectionDialog.call(ctx)
    expect(ctx.isTestEmailDialogShowing).toBe(false)

    NewSmtpSettings.methods.toggleTestEmailErrorDialog.call(ctx)
    expect(ctx.isTestEmailErrorDialogShowing).toBe(true)
    NewSmtpSettings.methods.toggleTestEmailErrorDialog.call(ctx)
    expect(ctx.isTestEmailErrorDialogShowing).toBe(false)
  })

  it('handleTestConnection toggles dialog and sets default message on nextTick', async () => {
    const ctx = {
      formValues: { name: 'SMTP A' },
      $refs: { refTestEmailDialog: { formValues: { message: '' } } },
      toggleTestConnectionDialog: jest.fn(function () {
        this.isTestEmailDialogShowing = !this.isTestEmailDialogShowing
      }),
      isTestEmailDialogShowing: false,
      $nextTick: (cb) => cb()
    }

    NewSmtpSettings.methods.handleTestConnection.call(ctx)

    expect(ctx.toggleTestConnectionDialog).toHaveBeenCalled()
    expect(ctx.$refs.refTestEmailDialog.formValues.message).toBe('This is a test email by SMTP A')
  })

  it('closeOverlay emits directly when form is not changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const formValues = { name: 'same', serverPort: '25' }
    const ctx = {
      formValues,
      initialFormValues: { name: 'same', serverPort: '25' },
      $emit: emit,
      $store: { dispatch }
    }

    NewSmtpSettings.methods.closeOverlay.call(ctx)

    expect(emit).toHaveBeenCalledWith('closeOverlay')
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay dispatches leaving dialog when form is changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'changed', serverPort: '25' },
      initialFormValues: { name: 'initial', serverPort: '25' },
      $emit: emit,
      $store: { dispatch }
    }

    NewSmtpSettings.methods.closeOverlay.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({
        show: true,
        callback: expect.any(Function)
      })
    )

    const callback = dispatch.mock.calls[0][1].callback
    callback()
    expect(emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('handleChangeServiceProvider safely handles undefined input', () => {
    const ctx = { formValues: { serverAddress: 'old', serverPort: '25' } }

    NewSmtpSettings.methods.handleChangeServiceProvider.call(ctx, undefined)

    expect(ctx.formValues.serverAddress).toBe('')
    expect(ctx.formValues.serverPort).toBeUndefined()
  })
})
