import { shallowMount } from '@vue/test-utils'
import EmailSettings from '@/components/PhishingReporter/Settings/EmailSettings.vue'

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  scrollToComponent: jest.fn()
}))

describe('EmailSettings.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}, getters = {}) =>
    shallowMount(EmailSettings, {
      propsData: {
        showHeader: true,
        showFooter: true,
        showForm: true,
        formData: null,
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getIncidentResponderNotifiedEmailPermission': false,
            ...getters
          }
        }
      },
      stubs: { FormGroup: true, InputEmail: true, PhishingSettingsFooter: true }
    })

  it('getImportantIncidentResponderNoticeText when sendUsACopy is true', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
    })
    expect(wrapper.vm.getImportantIncidentResponderNoticeText).toContain('enabled')
  })

  it('getImportantIncidentResponderNoticeText when sendUsACopy is false', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, sendUsACopy: false }
    })
    expect(wrapper.vm.getImportantIncidentResponderNoticeText).toContain('disabled')
  })

  it('isRecipientEmailRequired is true when showForm and isSendInformationEmail', () => {
    const wrapper = createWrapper({ showForm: true })
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
    })
    expect(wrapper.vm.isRecipientEmailRequired).toBe(true)
  })

  it('isRecipientEmailRequired is false when showForm is false', () => {
    const wrapper = createWrapper({ showForm: false })
    expect(wrapper.vm.isRecipientEmailRequired).toBe(false)
  })

  it('recipientEmailHint returns *Required when isSendInformationEmail', () => {
    const wrapper = createWrapper({ showForm: true })
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
    })
    expect(wrapper.vm.recipientEmailHint).toBe('*Required')
  })

  it('recipientEmailHint returns null when isSendInformationEmail is false', () => {
    const wrapper = createWrapper({ showForm: true })
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, isSendInformationEmail: false }
    })
    expect(wrapper.vm.recipientEmailHint).toBeNull()
  })

  it('recipientEmailHint returns null when showForm is false', () => {
    const wrapper = createWrapper({ showForm: false })
    wrapper.setData({
      formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
    })
    expect(wrapper.vm.recipientEmailHint).toBeNull()
  })

  it('getCurrentValues returns formValues', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formValues: {
        to: 'test@test.com',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        isSendInformationEmail: false,
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: false,
        defenderReportingEmailAddress: ''
      }
    })
    expect(wrapper.vm.getCurrentValues()).toMatchObject({ to: 'test@test.com' })
  })

  describe('Microsoft 365 Defender Integration', () => {
    it('isDefenderEmailRequired is true when showForm and integration enabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.isDefenderEmailRequired).toBe(true)
    })

    it('isDefenderEmailRequired is false when integration disabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: false
        }
      })
      expect(wrapper.vm.isDefenderEmailRequired).toBe(false)
    })

    it('defenderEmailHint returns *Required when integration enabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.defenderEmailHint).toBe('*Required')
    })

    it('defenderEmailHint returns null when integration disabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: false
        }
      })
      expect(wrapper.vm.defenderEmailHint).toBeNull()
    })

    it('defenderEmailRules returns rules when integration enabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.defenderEmailRules.length).toBeGreaterThan(0)
    })

    it('defenderEmailRules returns empty array when integration disabled', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: false
        }
      })
      expect(wrapper.vm.defenderEmailRules).toEqual([])
    })
  })

  describe('validateDefenderEmailNotSameAsInformationEmail', () => {
    it('returns error when defender email matches information email', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: 'same@email.com',
          defenderReportingEmailAddress: ''
        }
      })
      const result = wrapper.vm.validateDefenderEmailNotSameAsInformationEmail('same@email.com')
      expect(result).not.toBe(true)
      expect(result).toContain('Information Email')
    })

    it('returns true when emails are different', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: 'info@email.com'
        }
      })
      const result = wrapper.vm.validateDefenderEmailNotSameAsInformationEmail('defender@email.com')
      expect(result).toBe(true)
    })

    it('returns true when information email is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: ''
        }
      })
      const result = wrapper.vm.validateDefenderEmailNotSameAsInformationEmail('defender@email.com')
      expect(result).toBe(true)
    })
  })

  describe('validateInformationEmailNotSameAsDefenderEmail', () => {
    it('returns error when information email matches defender email and integration enabled', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          defenderReportingEmailAddress: 'same@email.com',
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      const result = wrapper.vm.validateInformationEmailNotSameAsDefenderEmail('same@email.com')
      expect(result).not.toBe(true)
      expect(result).toContain('Defender Submission')
    })

    it('returns true when integration disabled even if emails match', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          defenderReportingEmailAddress: 'same@email.com',
          isMicrosoftDefenderIntegrationEnabled: false
        }
      })
      const result = wrapper.vm.validateInformationEmailNotSameAsDefenderEmail('same@email.com')
      expect(result).toBe(true)
    })

    it('returns true when emails are different', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          defenderReportingEmailAddress: 'defender@email.com',
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      const result = wrapper.vm.validateInformationEmailNotSameAsDefenderEmail('info@email.com')
      expect(result).toBe(true)
    })
  })

  describe('rules when showForm is false', () => {
    it('recipientEmailRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.recipientEmailRules).toEqual([])
    })

    it('ccEmailRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.ccEmailRules).toEqual([])
    })

    it('emailSubjectRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.emailSubjectRules).toEqual([])
    })

    it('emailMessageRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.emailMessageRules).toEqual([])
    })
  })

  describe('emailSubjectRules', () => {
    it('includes required when isSendInformationEmail is true', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
      })
      const rules = wrapper.vm.emailSubjectRules
      expect(rules.length).toBeGreaterThan(1)
    })

    it('excludes required when isSendInformationEmail is false', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: false }
      })
      const rules = wrapper.vm.emailSubjectRules
      expect(rules.length).toBe(1)
    })
  })

  describe('emailMessageRules', () => {
    it('includes required when isSendInformationEmail is true', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
      })
      const rules = wrapper.vm.emailMessageRules
      expect(rules.length).toBeGreaterThan(1)
    })
  })

  describe('created', () => {
    it('emits getInitialFormValues on mount', () => {
      const wrapper = createWrapper()
      expect(wrapper.emitted('getInitialFormValues')).toBeTruthy()
      expect(wrapper.emitted('getInitialFormValues')[0][0]).toMatchObject({
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: false
      })
    })
  })

  describe('getIncidentResponderNotifiedEmailPermission', () => {
    it('getImportantIncidentResponderNoticeText when permission is true', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': true
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
      })
      expect(wrapper.vm.getImportantIncidentResponderNoticeText).toContain('enabled')
      expect(wrapper.vm.getImportantIncidentResponderNoticeText).toContain('analysis')
    })
  })

  describe('formData', () => {
    it('initializes defender fields from formData in created', () => {
      const formData = {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        isSendInformationEmail: false,
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: true,
        defenderReportingEmailAddress: 'defender@test.com'
      }
      const wrapper = createWrapper({ formData })
      expect(wrapper.vm.formValues.isMicrosoftDefenderIntegrationEnabled).toBe(true)
      expect(wrapper.vm.formValues.defenderReportingEmailAddress).toBe('defender@test.com')
    })
  })

  describe('submit', () => {
    it('emits updateForm and returns formValues when validation passes', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: { validate: () => true }
      }
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: 'test@test.com',
          isSendInformationEmail: false
        }
      })
      const result = wrapper.vm.submit({}, false)
      expect(wrapper.emitted('updateForm')).toBeTruthy()
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: false })
      expect(result).toMatchObject({ to: 'test@test.com' })
    })

    it('emits updateForm with isAddIn true when submitWithDownload', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: { validate: () => true }
      }
      wrapper.vm.submit({}, true)
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: true })
    })

    it('returns false when validation fails', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: {
          validate: () => false,
          $el: { querySelector: () => document.createElement('div') }
        }
      }
      const result = wrapper.vm.submit({})
      expect(result).toBe(false)
      expect(wrapper.emitted('updateForm')).toBeFalsy()
    })
  })

  describe('getFormValues', () => {
    it('returns formValues when validation passes', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: { validate: () => true }
      }
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: 'valid@test.com'
        }
      })
      const result = wrapper.vm.getFormValues()
      expect(result).toMatchObject({ to: 'valid@test.com' })
    })

    it('returns false when validation fails', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: { validate: () => false }
      }
      const result = wrapper.vm.getFormValues()
      expect(result).toBe(false)
    })
  })

  describe('formValues watcher', () => {
    it('emits formValuesChanged when formValues differ from initialFormValues', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          to: 'changed@test.com'
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('formValuesChanged')).toBeTruthy()
      expect(wrapper.emitted('formValuesChanged')[0][0]).toMatchObject({ to: 'changed@test.com' })
    })

  })

  describe('formData watcher', () => {
    it('updates formValues when formData changes', async () => {
      const wrapper = createWrapper()
      const formData = {
        to: 'new@test.com',
        cc: 'cc@test.com',
        bcc: '',
        subject: 'Subject',
        content: 'Content',
        isSendInformationEmail: true,
        sendUsACopy: false,
        isMicrosoftDefenderIntegrationEnabled: true,
        defenderReportingEmailAddress: 'def@test.com'
      }
      wrapper.setProps({ formData })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formValues.to).toBe('new@test.com')
      expect(wrapper.vm.formValues.cc).toBe('cc@test.com')
      expect(wrapper.vm.formValues.isSendInformationEmail).toBe(true)
      expect(wrapper.vm.formValues.sendUsACopy).toBe(false)
      expect(wrapper.vm.formValues.isMicrosoftDefenderIntegrationEnabled).toBe(true)
      expect(wrapper.vm.formValues.defenderReportingEmailAddress).toBe('def@test.com')
    })

    it('handles null formData without error', () => {
      const wrapper = createWrapper({ formData: null })
      expect(() => {
        wrapper.vm.$options.watch.formData.handler.call(wrapper.vm, null)
      }).not.toThrow()
    })

    it('clears defenderReportingEmailAddress when integration disabled', async () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true,
          defenderReportingEmailAddress: 'defender@test.com'
        }
      })
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: false
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formValues.defenderReportingEmailAddress).toBe('')
    })
  })
})
