import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'

jest.mock('awesome-phonenumber', () => {
  function MockPhoneNumber(phoneNumber = '') {
    this.g = { number: { international: `intl:${phoneNumber}` } }
    this.getRegionCode = () => 'US'
  }
  MockPhoneNumber.getCountryCodeForRegionCode = () => '1'
  return MockPhoneNumber
})

describe('InputCallerPhoneNumber.vue (extra branch coverage)', () => {
  it('getPhoneNumberItems returns phoneNumbers when defaultPhoneNumbers is undefined', () => {
    const ctx = {
      defaultPhoneNumbers: undefined,
      phoneNumbers: [{ text: '+123', value: 'v1' }]
    }
    expect(InputCallerPhoneNumber.computed.getPhoneNumberItems.call(ctx)).toEqual([
      { text: '+123', value: 'v1' }
    ])
  })

  it('getPhoneNumberItems returns phoneNumbers when defaultPhoneNumbers is null', () => {
    const ctx = {
      defaultPhoneNumbers: null,
      phoneNumbers: [{ text: '+456', value: 'v2' }]
    }
    expect(InputCallerPhoneNumber.computed.getPhoneNumberItems.call(ctx)).toEqual([
      { text: '+456', value: 'v2' }
    ])
  })

  it('getPhoneNumberCountry uses phoneNumber.text when typeof phoneNumber is object (phishing path)', () => {
    const createPhoneNumberObj = jest.fn(() => ({ getRegionCode: () => 'GB' }))
    const regionNamesOf = jest.fn(() => 'United Kingdom')
    const originalOf = Intl.DisplayNames.prototype.of
    Intl.DisplayNames.prototype.of = regionNamesOf

    const ctx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      phoneNumbers: [{ value: 'r1', text: '+441234567890' }],
      createPhoneNumberObj
    }
    const result = InputCallerPhoneNumber.methods.getPhoneNumberCountry.call(ctx, {
      text: '+441234567890'
    })
    expect(createPhoneNumberObj).toHaveBeenCalledWith('+441234567890')
    expect(result).toBe('United Kingdom')
    Intl.DisplayNames.prototype.of = originalOf
  })

  it('getPhoneNumberCountry uses find result when value is string and phoneNumbers has match', () => {
    const createPhoneNumberObj = jest.fn(() => ({ getRegionCode: () => 'DE' }))
    const regionNamesOf = jest.fn(() => 'Germany')
    const originalOf = Intl.DisplayNames.prototype.of
    Intl.DisplayNames.prototype.of = regionNamesOf

    const ctx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      phoneNumbers: [{ value: 'res-1', text: '+491234567890' }],
      createPhoneNumberObj
    }
    const result = InputCallerPhoneNumber.methods.getPhoneNumberCountry.call(ctx, 'res-1')
    expect(createPhoneNumberObj).toHaveBeenCalledWith('+491234567890')
    expect(result).toBe('Germany')
    Intl.DisplayNames.prototype.of = originalOf
  })

  it('getPhoneNumberFormatted uses phoneNumber directly when not phishing/smishing/quishing', () => {
    const createPhoneNumberObj = jest.fn(() => ({
      g: { number: { international: '+1234567890' } }
    }))
    const ctx = {
      isPhishingScenario: false,
      isSmishing: false,
      isQuishing: false,
      createPhoneNumberObj
    }
    const result = InputCallerPhoneNumber.methods.getPhoneNumberFormatted.call(ctx, '+1234567890')
    expect(createPhoneNumberObj).toHaveBeenCalledWith('+1234567890')
    expect(result).toBe('+1234567890')
  })

  it('getPhoneNumberFormatted uses phoneNumber.text when phishing scenario', () => {
    const createPhoneNumberObj = jest.fn(() => ({
      g: { number: { international: '+441234567890' } }
    }))
    const ctx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      createPhoneNumberObj
    }
    const result = InputCallerPhoneNumber.methods.getPhoneNumberFormatted.call(ctx, {
      text: '+441234567890'
    })
    expect(createPhoneNumberObj).toHaveBeenCalledWith('+441234567890')
    expect(result).toBe('+441234567890')
  })

  it('handleInputChange emits undefined for update:callerPhoneNumber when no match found', () => {
    const emit = jest.fn()
    const ctx = {
      phoneNumbers: [{ value: 'id-1', text: '+123' }],
      $emit: emit
    }
    InputCallerPhoneNumber.methods.handleInputChange.call(ctx, 'non-existent')
    expect(emit).toHaveBeenCalledWith('update:callerPhoneNumber', undefined)
  })
})
