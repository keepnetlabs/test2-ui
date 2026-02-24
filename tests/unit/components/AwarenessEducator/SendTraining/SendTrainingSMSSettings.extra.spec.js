import SendTrainingSMSSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSMSSettings.vue'

describe('SendTrainingSMSSettings.vue (extra branch coverage)', () => {
  describe('handlePhoneNumberChange', () => {
    it('does not update when phoneNumberItems is empty', () => {
      const vm = {
        formData: { phoneNumber: 'old', smsProviderNumberResourceId: 'r-old' },
        phoneNumberItems: []
      }
      SendTrainingSMSSettings.methods.handlePhoneNumberChange.call(vm, '+1 555')
      expect(vm.formData.phoneNumber).toBe('old')
      expect(vm.formData.smsProviderNumberResourceId).toBe('r-old')
    })

    it('updates when phone number matches first item', () => {
      const vm = {
        formData: { phoneNumber: '', smsProviderNumberResourceId: '' },
        phoneNumberItems: [
          { phoneNumber: '+1 111', resourceId: 'r-1' },
          { phoneNumber: '+1 222', resourceId: 'r-2' }
        ]
      }
      SendTrainingSMSSettings.methods.handlePhoneNumberChange.call(vm, '+1 111')
      expect(vm.formData.phoneNumber).toBe('+1 111')
      expect(vm.formData.smsProviderNumberResourceId).toBe('r-1')
    })
  })

  describe('smsTextRules', () => {
    it('returns true when text has no merge tags and is exactly 160 chars', () => {
      const data = SendTrainingSMSSettings.data.call({
        defaultSmsTextTemplate: '',
        defaultMergeTags: []
      })
      const maxLengthRule = data.smsTextRules[1]
      const text160 = 'a'.repeat(160)
      expect(maxLengthRule(text160)).toBe(true)
    })

    it('returns error when text has no merge tags and exceeds 160 chars', () => {
      const data = SendTrainingSMSSettings.data.call({
        defaultSmsTextTemplate: '',
        defaultMergeTags: []
      })
      const maxLengthRule = data.smsTextRules[1]
      const text161 = 'a'.repeat(161)
      expect(maxLengthRule(text161)).toContain('160 characters')
    })

    it('returns true when matches is null (no merge tag pattern)', () => {
      const data = SendTrainingSMSSettings.data.call({
        defaultSmsTextTemplate: '',
        defaultMergeTags: []
      })
      const maxLengthRule = data.smsTextRules[1]
      const textNoTags = 'Hello world'
      expect(maxLengthRule(textNoTags)).toBe(true)
    })
  })

  describe('rules.number', () => {
    it('maxRule returns true when value is exactly 1000000', () => {
      const data = SendTrainingSMSSettings.data.call({
        defaultSmsTextTemplate: '',
        defaultMergeTags: []
      })
      const maxRule = data.rules.number[2]
      expect(maxRule(1000000)).toContain('cannot exceed')
    })

    it('startsWithRule returns true when value does not start with 0', () => {
      const data = SendTrainingSMSSettings.data.call({
        defaultSmsTextTemplate: '',
        defaultMergeTags: []
      })
      const startsWithRule = data.rules.number[1]
      expect(startsWithRule('1')).toBe(true)
      expect(startsWithRule('99')).toBe(true)
    })
  })

  describe('defaultValues watcher', () => {
    it('merges partial defaultValues without overwriting unspecified fields', () => {
      const vm = {
        formData: {
          smsTextTemplate: 'Template',
          phoneNumber: 'old',
          smsProviderNumberResourceId: 'r-old'
        }
      }
      SendTrainingSMSSettings.watch.defaultValues.handler.call(vm, {
        smsTextTemplate: 'New template'
      })
      expect(vm.formData.smsTextTemplate).toBe('New template')
      expect(vm.formData.phoneNumber).toBe('old')
      expect(vm.formData.smsProviderNumberResourceId).toBe('r-old')
    })
  })

  describe('validateForm', () => {
    it('returns result of refForm.validate', () => {
      const vm = {
        $refs: {
          refForm: { validate: jest.fn(() => false) }
        }
      }
      const result = SendTrainingSMSSettings.methods.validateForm.call(vm)
      expect(result).toBe(false)
    })
  })
})
