import { shallowMount } from '@vue/test-utils'
import EmailSettings from '@/components/PhishingReporter/Settings/EmailSettings.vue'

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

  it('getCurrentValues returns formValues', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formValues: { to: 'test@test.com', cc: '', bcc: '', subject: '', content: '', isSendInformationEmail: false, sendUsACopy: true }
    })
    expect(wrapper.vm.getCurrentValues()).toMatchObject({ to: 'test@test.com' })
  })
})
