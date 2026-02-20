import AddUserModal from '@/components/TargetUsers/AddUserModal.vue'

describe('AddUserModal.vue methods', () => {
  it('computes dialog body with license values', () => {
    const withActive = {
      companyLicense: { licenseLimit: 50, activeUserCount: 20 }
    }
    expect(AddUserModal.computed.getDialogBody.call(withActive)).toContain('50 target users')
    expect(AddUserModal.computed.getDialogBody.call(withActive)).toContain('20')

    const withTotal = {
      companyLicense: { licenseLimit: 50, totalUserCount: 30 }
    }
    expect(AddUserModal.computed.getDialogBody.call(withTotal)).toContain('30')
  })

  it('setStringBoolean converts values consistently', () => {
    const fn = AddUserModal.methods.setStringBoolean
    expect(fn.call({}, true)).toBe('True')
    expect(fn.call({}, false)).toBe('False')
    expect(fn.call({}, 'indeterminate')).toBe('False')
    expect(fn.call({}, 'x')).toBe(true)
  })

  it('getBooleanValue converts values consistently', () => {
    const fn = AddUserModal.methods.getBooleanValue
    expect(fn.call({}, 'True')).toBe(true)
    expect(fn.call({}, 'False')).toBe(false)
    expect(fn.call({}, '')).toBe('indeterminate')
    expect(fn.call({}, 'x')).toBe(true)
  })

  it('getDatePickerProps returns date and datetime props', () => {
    const datetimeProps = AddUserModal.methods.getDatePickerProps.call({}, { fieldDataType: 'DateTime', name: 'Start' })
    expect(datetimeProps).toEqual({
      type: 'datetime',
      placeholder: 'Enter Start',
      'value-format': 'yyyy-MM-dd HH:mm',
      format: 'yyyy-MM-dd HH:mm'
    })

    const dateProps = AddUserModal.methods.getDatePickerProps.call({}, { fieldDataType: 'Date', name: 'End' })
    expect(dateProps).toEqual({
      type: 'date',
      placeholder: 'Enter End',
      'value-format': 'yyyy-MM-dd',
      format: 'yyyy-MM-dd'
    })
  })

  it('validatePicker respects required date picker validation state', () => {
    const ctx = {
      customFieldsModels: { d1: '' },
      isPickersValidated: { d1: true }
    }
    const item = { fieldDataType: 'Date', resourceId: 'd1' }
    expect(AddUserModal.methods.validatePicker.call(ctx, item)).toBe(true)
  })

  it('getCustomFieldRules builds required/maxLength/mail rules for email fields', () => {
    const ctx = {
      customFieldsModels: {},
      validations: {
        required: jest.fn(() => true),
        maxLength: jest.fn(() => true),
        mail: jest.fn(() => true)
      }
    }
    const rules = AddUserModal.methods.getCustomFieldRules.call(ctx, {
      fieldDataType: 'Email',
      isRequired: true,
      name: 'Work Email'
    })
    expect(rules.length).toBe(3)
    rules.forEach((rule) => rule('a@b.com'))
    expect(ctx.validations.required).toHaveBeenCalled()
    expect(ctx.validations.maxLength).toHaveBeenCalled()
    expect(ctx.validations.mail).toHaveBeenCalled()
  })

  it('getCustomFieldRules for required boolean checks indeterminate value', () => {
    const ctx = {
      customFieldsModels: { b1: 'indeterminate' },
      validations: {}
    }
    const rules = AddUserModal.methods.getCustomFieldRules.call(ctx, {
      resourceId: 'b1',
      fieldDataType: 'Boolean',
      isRequired: true
    })
    expect(rules.length).toBe(1)
    expect(rules[0]()).toBe('Required')
  })

  it('getCustomFieldsPayload maps manager and custom field payload correctly', () => {
    const ctx = {
      formValues: {
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        phoneNumber: ' +1 222  ',
        manager: { managerFirstName: 'M', managerLastName: '', managerEmail: '' }
      },
      customFieldsModels: {
        b1: true,
        d1: '2026-01-01 10:00',
        s1: ''
      },
      customFields: [
        { resourceId: 'b1', fieldDataType: 'Boolean' },
        { resourceId: 'd1', fieldDataType: 'DateTime' },
        { resourceId: 's1', fieldDataType: 'String' }
      ],
      setStringBoolean: AddUserModal.methods.setStringBoolean
    }

    const payload = AddUserModal.methods.getCustomFieldsPayload.call(ctx)
    expect(payload.managerFirstName).toBe('M')
    expect(payload.customFields).toEqual([
      { resourceId: 'b1', value: 'True', timestampValue: '' },
      { resourceId: 'd1', value: '2026-01-01 10:00', timestampValue: '2026-01-01 10:00' }
    ])
  })

  it('toggleShowLicenseExceededDialog toggles state', () => {
    const ctx = { showLicenseExceededDialog: false }
    AddUserModal.methods.toggleShowLicenseExceededDialog.call(ctx)
    expect(ctx.showLicenseExceededDialog).toBe(true)
  })
})
