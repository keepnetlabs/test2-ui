const TURKIYE_REGION_CODE = 'TR'
const TURKIYE_COUNTRY_NAME = 'Türkiye'

export function getPhoneCountryName(regionCode) {
  if (!regionCode) return ''

  if (regionCode.toUpperCase() === TURKIYE_REGION_CODE) {
    return TURKIYE_COUNTRY_NAME
  }

  const regionNamesInEnglish = new Intl.DisplayNames(['en'], {
    type: 'region'
  })
  return regionNamesInEnglish.of(regionCode)
}

export function localizePhoneCountry(country = {}) {
  if (country?.iso2?.toUpperCase() !== TURKIYE_REGION_CODE) {
    return country
  }

  return {
    ...country,
    name: TURKIYE_COUNTRY_NAME
  }
}
