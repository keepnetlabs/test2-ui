import DeleteSmtpSettings from '@/components/Company Settings/SmtpSettings/DeleteSmtpSettings.vue'

describe('DeleteSmtpSettings.vue', () => {
  it('has correct component name', () => {
    expect(DeleteSmtpSettings.name).toBe('DeleteSmtpSettings')
  })

  it('getSubtitle returns smtp name for object', () => {
    const subtitle = DeleteSmtpSettings.computed.getSubtitle.call({ data: { name: 'SMTP A' } })
    expect(subtitle).toBe('SMTP A')
  })

  it('getSubtitle returns single/multiple labels for arrays', () => {
    const single = DeleteSmtpSettings.computed.getSubtitle.call({ data: [{ name: 'SMTP B' }] })
    const multi = DeleteSmtpSettings.computed.getSubtitle.call({
      data: [{ name: 'SMTP C' }, { name: 'SMTP D' }]
    })
    expect(single).toBe('SMTP B')
    expect(multi).toBe('2 SMTP Settings')
  })

  it('getActionName and getActionData branch by payload type', () => {
    expect(DeleteSmtpSettings.methods.getActionName.call({ data: { name: 'A' } })).toBe(
      'handleDelete'
    )
    expect(DeleteSmtpSettings.methods.getActionName.call({ data: [{ name: 'A' }, { name: 'B' }] })).toBe(
      'handleMultipleDelete'
    )
    expect(DeleteSmtpSettings.methods.getActionData.call({ data: [{ name: 'A' }] })).toEqual({
      name: 'A'
    })
  })

  it('handleDelete emits action and closes dialog', () => {
    const ctx = {
      data: [{ name: 'SMTP A' }, { name: 'SMTP B' }],
      getActionName: DeleteSmtpSettings.methods.getActionName,
      getActionData: DeleteSmtpSettings.methods.getActionData,
      handleCloseDialog: jest.fn(),
      $emit: jest.fn()
    }
    DeleteSmtpSettings.methods.handleDelete.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleMultipleDelete', ctx.data)
    expect(ctx.handleCloseDialog).toHaveBeenCalled()
  })
})
