import {
  DELIVERY_METHODS,
  deliveryMethodOptions,
  getDeliveryMethodLabel
} from '@/components/Common/DeliveryMethod/utils'

describe('Common DeliveryMethod utils', () => {
  it('returns delivery options without LMS by default', () => {
    const options = deliveryMethodOptions()
    const values = options.map((item) => item.value)

    expect(values).toEqual(['email', 'microsoft-teams', 'sms'])
  })

  it('includes LMS option when enabled and customizes description type', () => {
    const options = deliveryMethodOptions(true, 'Poster')
    const lms = options.find((item) => item.value === 'lms')

    expect(lms).toBeTruthy()
    expect(lms.description).toContain('Poster')
  })

  it('maps delivery method labels', () => {
    expect(getDeliveryMethodLabel(DELIVERY_METHODS.LMS)).toBe('LMS')
    expect(getDeliveryMethodLabel(DELIVERY_METHODS.SMS)).toBe('SMS & Email')
    expect(getDeliveryMethodLabel(DELIVERY_METHODS.MICROSOFT_TEAMS)).toBe('Microsoft Teams & Email')
    expect(getDeliveryMethodLabel(DELIVERY_METHODS.EMAIL)).toBe('Email')
  })
})
