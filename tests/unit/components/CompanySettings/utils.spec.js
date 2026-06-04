import {
  DIRECT_EMAIL_DELIVERY_TEMPLATE_NAMES,
  MERGED_TEXTS_MAP,
  isDirectEmailDeliveryTemplateName,
  scrollToEmailTemplateContent
} from '@/components/Company Settings/utils'

describe('Company Settings utils', () => {
  it('exports merged text map with expected keys', () => {
    expect(MERGED_TEXTS_MAP).toHaveProperty('{FULLNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{TRAININGNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{SURVEYNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{Manuel_Check_Url}')
  })

  it('keeps DEC email delivery enabled for supported notification template names', () => {
    expect(DIRECT_EMAIL_DELIVERY_TEMPLATE_NAMES).toEqual(
      expect.arrayContaining([
        'Infographic Enrollment',
        'Welcome Email',
        'Reset Password',
        'Threat Sharing Post Shared',
        'Multi-factor Authentication Activated',
        'Scheduled Report',
        'Scheduled Report Mail'
      ])
    )
    expect(isDirectEmailDeliveryTemplateName('Welcome Email')).toBe(true)
    expect(isDirectEmailDeliveryTemplateName('Legacy SMTP Only Template')).toBe(false)
    expect(isDirectEmailDeliveryTemplateName()).toBe(false)
  })

  it('scrollToEmailTemplateContent scrolls target element when found', () => {
    const scrollIntoView = jest.fn()
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView
    })

    scrollToEmailTemplateContent()

    expect(querySelectorSpy).toHaveBeenCalledWith('#email-template-content')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'end',
      inline: 'end'
    })
    querySelectorSpy.mockRestore()
  })
})
