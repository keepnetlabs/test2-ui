import { getPhoneCountryName, localizePhoneCountry } from '@/utils/phoneCountryName'

describe('phoneCountryName', () => {
  it('returns Türkiye for TR phone country names', () => {
    expect(getPhoneCountryName('TR')).toBe('Türkiye')
    expect(getPhoneCountryName('tr')).toBe('Türkiye')
  })

  it('localizes TR country objects for vue-tel-input', () => {
    expect(localizePhoneCountry({ iso2: 'TR', name: 'Turkey', dialCode: '90' })).toEqual({
      iso2: 'TR',
      name: 'Türkiye',
      dialCode: '90'
    })
  })

  it('keeps other country objects unchanged', () => {
    const country = { iso2: 'US', name: 'United States', dialCode: '1' }

    expect(localizePhoneCountry(country)).toBe(country)
  })
})
