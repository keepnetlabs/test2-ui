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

  describe('sendUsACopyModel', () => {
    it('returns false when permission is false regardless of sendUsACopy value', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': false
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
      })
      expect(wrapper.vm.sendUsACopyModel).toBe(false)
    })

    it('returns formValues.sendUsACopy when permission is true', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': true
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
      })
      expect(wrapper.vm.sendUsACopyModel).toBe(true)
    })

    it('returns false when permission is true and sendUsACopy is false', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': true
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: false }
      })
      expect(wrapper.vm.sendUsACopyModel).toBe(false)
    })

    it('setter updates formValues.sendUsACopy', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': true
      })
      wrapper.vm.sendUsACopyModel = false
      expect(wrapper.vm.formValues.sendUsACopy).toBe(false)
      wrapper.vm.sendUsACopyModel = true
      expect(wrapper.vm.formValues.sendUsACopy).toBe(true)
    })
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

    it('defenderEmailHint returns null when showForm is false', () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.defenderEmailHint).toBeNull()
    })

    it('isDefenderEmailRequired is false when showForm is false', () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.isDefenderEmailRequired).toBe(false)
    })

    it('defenderEmailRules returns empty when showForm is false', () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      expect(wrapper.vm.defenderEmailRules).toEqual([])
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

    it('returns true when defender value is null', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, to: 'test@email.com' }
      })
      const result = wrapper.vm.validateDefenderEmailNotSameAsInformationEmail(null)
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

    it('returns true when defender email is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          defenderReportingEmailAddress: '',
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      const result = wrapper.vm.validateInformationEmailNotSameAsDefenderEmail('info@email.com')
      expect(result).toBe(true)
    })

    it('returns true when info value is null', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          defenderReportingEmailAddress: 'defender@email.com',
          isMicrosoftDefenderIntegrationEnabled: true
        }
      })
      const result = wrapper.vm.validateInformationEmailNotSameAsDefenderEmail(null)
      expect(result).toBe(true)
    })
  })

  describe('recipientEmailRules when showForm is true', () => {
    it('includes required rule when isSendInformationEmail is true', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
      })
      const rules = wrapper.vm.recipientEmailRules
      expect(rules.length).toBe(5)
    })

    it('excludes required rule when isSendInformationEmail is false', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: false }
      })
      const rules = wrapper.vm.recipientEmailRules
      expect(rules.length).toBe(4)
    })
  })

  describe('ccEmailRules when showForm is true', () => {
    it('returns 3 validation rules', () => {
      const wrapper = createWrapper({ showForm: true })
      expect(wrapper.vm.ccEmailRules.length).toBe(3)
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

  describe('subject merge tags', () => {
    it('defines only the supported subject merge tags', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.subjectMergeTags).toEqual([
        {
          text: 'Subject',
          value: '{SUBJECT}'
        },
        {
          text: "Reporter's Email Address",
          value: '{REPORTER_EMAIL}'
        },
        {
          text: 'Date & Time',
          value: '{DATE_AND_TIME}'
        }
      ])
    })

    it('renders merge tag buttons with disabled state when form is readonly', async () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isSendInformationEmail: true
        }
      })
      await wrapper.vm.$nextTick()

      const mergeTagButtons = wrapper.findAll('.input-merge-tag__tag')

      expect(mergeTagButtons).toHaveLength(3)
      mergeTagButtons.wrappers.forEach((button) => {
        expect(button.attributes('disabled')).toBe('true')
      })
    })

    it('renders enabled merge tag buttons and inserts tag on button click', async () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          isSendInformationEmail: true,
          subject: 'Reported: '
        }
      })
      await wrapper.vm.$nextTick()

      const mergeTagButtons = wrapper.findAll('.input-merge-tag__tag')

      expect(mergeTagButtons).toHaveLength(3)
      mergeTagButtons.wrappers.forEach((button) => {
        expect(button.attributes('disabled')).toBeUndefined()
      })

      mergeTagButtons.at(1).vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('Reported: {REPORTER_EMAIL}')
    })

    it('inserts selected merge tag at cursor position', async () => {
      const wrapper = createWrapper()
      const focus = jest.fn()
      const setSelectionRange = jest.fn()
      const subjectInput = {
        selectionStart: 7,
        selectionEnd: 7,
        focus,
        setSelectionRange
      }

      wrapper.vm.$refs = {
        refEmailSubject: {
          $el: {
            querySelector: jest.fn(() => subjectInput)
          }
        }
      }
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          subject: 'Report: '
        }
      })

      wrapper.vm.handleSubjectMergeTagClick('{REPORTER_EMAIL}')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('Report:{REPORTER_EMAIL} ')
      expect(focus).toHaveBeenCalled()
      expect(setSelectionRange).toHaveBeenCalledWith(23, 23)
    })

    it('replaces selected subject text with selected merge tag', async () => {
      const wrapper = createWrapper()
      const setSelectionRange = jest.fn()
      const subjectInput = {
        selectionStart: 10,
        selectionEnd: 17,
        focus: jest.fn(),
        setSelectionRange
      }

      wrapper.vm.$refs = {
        refEmailSubject: {
          $el: {
            querySelector: jest.fn(() => subjectInput)
          }
        }
      }
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          subject: 'Reported: old tag'
        }
      })

      wrapper.vm.handleSubjectMergeTagClick('{DATE_AND_TIME}')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('Reported: {DATE_AND_TIME}')
      expect(setSelectionRange).toHaveBeenCalledWith(25, 25)
    })

    it('appends merge tag when subject input has no selection positions', async () => {
      const wrapper = createWrapper()
      const setSelectionRange = jest.fn()
      const subjectInput = {
        focus: jest.fn(),
        setSelectionRange
      }

      wrapper.vm.$refs = {
        refEmailSubject: {
          $el: {
            querySelector: jest.fn(() => subjectInput)
          }
        }
      }
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          subject: 'Prefix '
        }
      })

      wrapper.vm.handleSubjectMergeTagClick('{DATE_AND_TIME}')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('Prefix {DATE_AND_TIME}')
      expect(setSelectionRange).toHaveBeenCalledWith(22, 22)
    })

    it('appends merge tag when subject input ref is unavailable', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {}
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          subject: 'Suspicious Email: '
        }
      })

      wrapper.vm.handleSubjectMergeTagClick('{SUBJECT}')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('Suspicious Email: {SUBJECT}')
    })

    it('inserts merge tag into an empty subject', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {}

      wrapper.vm.handleSubjectMergeTagClick('{SUBJECT}')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.formValues.subject).toBe('{SUBJECT}')
    })

    it('does not update subject when form is readonly', () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          subject: 'Existing subject'
        }
      })

      wrapper.vm.handleSubjectMergeTagClick('{SUBJECT}')

      expect(wrapper.vm.formValues.subject).toBe('Existing subject')
    })
  })

  describe('emailMessageRules', () => {
    it('includes required when isSendInformationEmail is true', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: true }
      })
      const rules = wrapper.vm.emailMessageRules
      expect(rules.length).toBe(2)
    })

    it('excludes required when isSendInformationEmail is false', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, isSendInformationEmail: false }
      })
      const rules = wrapper.vm.emailMessageRules
      expect(rules.length).toBe(1)
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
    it('sendUsACopyModel reflects sendUsACopy when permission is true', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': true
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
      })
      expect(wrapper.vm.sendUsACopyModel).toBe(true)
      expect(wrapper.vm.getIncidentResponderNotifiedEmailPermission).toBe(true)
    })

    it('sendUsACopyModel is forced false when permission is false', () => {
      const wrapper = createWrapper({}, {
        'permissions/getIncidentResponderNotifiedEmailPermission': false
      })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, sendUsACopy: true }
      })
      expect(wrapper.vm.sendUsACopyModel).toBe(false)
      expect(wrapper.vm.getIncidentResponderNotifiedEmailPermission).toBe(false)
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

    it('handles nullish formData fields with fallback defaults', () => {
      const formData = {
        to: null,
        cc: null,
        bcc: null,
        subject: null,
        content: null,
        isSendInformationEmail: false,
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: undefined,
        defenderReportingEmailAddress: null
      }
      const wrapper = createWrapper({ formData })
      expect(wrapper.vm.formValues.to).toBe('')
      expect(wrapper.vm.formValues.cc).toBe('')
      expect(wrapper.vm.formValues.bcc).toBe('')
      expect(wrapper.vm.formValues.subject).toBe('')
      expect(wrapper.vm.formValues.content).toBe('')
      expect(wrapper.vm.formValues.isMicrosoftDefenderIntegrationEnabled).toBe(false)
      expect(wrapper.vm.formValues.defenderReportingEmailAddress).toBe('')
    })

    it('initializes all fields from complete formData', () => {
      const formData = {
        to: 'to@test.com',
        cc: 'cc@test.com',
        bcc: 'bcc@test.com',
        subject: 'Test Subject',
        content: 'Test Content',
        isSendInformationEmail: true,
        sendUsACopy: false,
        isMicrosoftDefenderIntegrationEnabled: true,
        defenderReportingEmailAddress: 'defender@test.com'
      }
      const wrapper = createWrapper({ formData })
      expect(wrapper.vm.formValues.to).toBe('to@test.com')
      expect(wrapper.vm.formValues.cc).toBe('cc@test.com')
      expect(wrapper.vm.formValues.bcc).toBe('bcc@test.com')
      expect(wrapper.vm.formValues.subject).toBe('Test Subject')
      expect(wrapper.vm.formValues.content).toBe('Test Content')
      expect(wrapper.vm.formValues.isSendInformationEmail).toBe(true)
      expect(wrapper.vm.formValues.sendUsACopy).toBe(false)
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

    it('does not emit formValuesChanged when values match initialFormValues', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      const emittedBefore = (wrapper.emitted('formValuesChanged') || []).length
      wrapper.setData({
        formValues: { ...wrapper.vm.initialFormValues }
      })
      await wrapper.vm.$nextTick()
      const emittedAfter = (wrapper.emitted('formValuesChanged') || []).length
      expect(emittedAfter).toBe(emittedBefore)
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

    it('handles partial formData with fallback defaults', async () => {
      const wrapper = createWrapper()
      const formData = {
        to: null,
        cc: undefined,
        bcc: '',
        subject: null,
        content: null,
        defenderReportingEmailAddress: null
      }
      wrapper.setProps({ formData })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formValues.to).toBe('')
      expect(wrapper.vm.formValues.cc).toBe('')
      expect(wrapper.vm.formValues.bcc).toBe('')
      expect(wrapper.vm.formValues.subject).toBe('')
      expect(wrapper.vm.formValues.content).toBe('')
      expect(wrapper.vm.formValues.defenderReportingEmailAddress).toBe('')
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
