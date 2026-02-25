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
})
