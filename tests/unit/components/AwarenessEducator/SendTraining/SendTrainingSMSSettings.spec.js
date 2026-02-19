import SendTrainingSMSSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSMSSettings.vue'

describe('SendTrainingSMSSettings.vue', () => {
  it('initializes form data from default props', () => {
    const ctx = {
      defaultSmsTextTemplate: 'Hello {TRAININGURL}',
      defaultMergeTags: [{ text: 'Training URL', value: '{TRAININGURL}' }]
    }
    const data = SendTrainingSMSSettings.data.call(ctx)

    expect(data.formData.smsTextTemplate).toBe('Hello {TRAININGURL}')
    expect(data.formData.phoneNumber).toBe('')
    expect(data.mergeTags).toEqual([{ text: 'Training URL', value: '{TRAININGURL}' }])
  })

  it('updates selected phone number and resource id', () => {
    const vm = {
      formData: { phoneNumber: '', smsProviderNumberResourceId: '' },
      phoneNumberItems: [
        { phoneNumber: '+1 111', resourceId: 'r-1' },
        { phoneNumber: '+1 222', resourceId: 'r-2' }
      ]
    }

    SendTrainingSMSSettings.methods.handlePhoneNumberChange.call(vm, '+1 222')

    expect(vm.formData.phoneNumber).toBe('+1 222')
    expect(vm.formData.smsProviderNumberResourceId).toBe('r-2')
  })

  it('does not change phone data when number is not found', () => {
    const vm = {
      formData: { phoneNumber: '+1 111', smsProviderNumberResourceId: 'r-1' },
      phoneNumberItems: [{ phoneNumber: '+1 222', resourceId: 'r-2' }]
    }

    SendTrainingSMSSettings.methods.handlePhoneNumberChange.call(vm, '+1 999')

    expect(vm.formData.phoneNumber).toBe('+1 111')
    expect(vm.formData.smsProviderNumberResourceId).toBe('r-1')
  })

  it('validateForm proxies to form ref validate', () => {
    const validate = jest.fn(() => true)
    const vm = {
      $refs: {
        refForm: { validate }
      }
    }

    const result = SendTrainingSMSSettings.methods.validateForm.call(vm)
    expect(result).toBe(true)
    expect(validate).toHaveBeenCalledTimes(1)
  })

  it('defaultValues watcher merges incoming values', () => {
    const vm = {
      formData: {
        smsTextTemplate: 'Old',
        phoneNumber: '',
        smsProviderNumberResourceId: ''
      }
    }

    SendTrainingSMSSettings.watch.defaultValues.handler.call(vm, {
      phoneNumber: '+1 333',
      smsProviderNumberResourceId: 'r-3'
    })

    expect(vm.formData).toEqual({
      smsTextTemplate: 'Old',
      phoneNumber: '+1 333',
      smsProviderNumberResourceId: 'r-3'
    })
  })

  it('sms text length rule ignores merge tags and enforces max 160 chars', () => {
    const data = SendTrainingSMSSettings.data.call({
      defaultSmsTextTemplate: '',
      defaultMergeTags: []
    })
    const maxLengthRule = data.smsTextRules[1]

    const valid = `${'a'.repeat(160)}{TRAININGURL}`
    const invalid = `${'a'.repeat(161)} {TRAININGURL}`

    expect(maxLengthRule(valid)).toBe(true)
    expect(maxLengthRule(invalid)).toContain('160 characters')
  })
})
