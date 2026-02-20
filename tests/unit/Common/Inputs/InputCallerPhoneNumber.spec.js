import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'
import { getPhoneNumbers } from '@/api/vishing'
import { getPhishingScenariosPhoneNumber } from '@/api/phishingsimulator'

jest.mock('@/api/vishing', () => ({
  getPhoneNumbers: jest.fn()
}))

jest.mock('@/api/phishingsimulator', () => ({
  getPhishingScenariosPhoneNumber: jest.fn(),
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn(),
  getPhishingScenarioRoles: jest.fn()
}))

jest.mock('@/api/smishing', () => ({
  getSmishingScenariosPhoneNumber: jest.fn()
}))

jest.mock('@/api/quishing', () => ({
  getQuishingScenariosPhoneNumber: jest.fn()
}))

jest.mock('awesome-phonenumber', () => {
  function MockPhoneNumber(phoneNumber = '') {
    this.g = {
      number: {
        international: `intl:${phoneNumber}`
      }
    }
    this.getRegionCode = () => 'US'
  }

  MockPhoneNumber.getCountryCodeForRegionCode = jest.fn(() => '1')

  return MockPhoneNumber
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputCallerPhoneNumber.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getPhoneNumberItems prefers default list when provided', () => {
    const withDefault = {
      defaultPhoneNumbers: [{ text: '+1', value: 'a' }],
      phoneNumbers: [{ text: '+2', value: 'b' }]
    }
    expect(InputCallerPhoneNumber.computed.getPhoneNumberItems.call(withDefault)).toEqual([
      { text: '+1', value: 'a' }
    ])

    const withoutDefault = {
      defaultPhoneNumbers: [],
      phoneNumbers: [{ text: '+2', value: 'b' }]
    }
    expect(InputCallerPhoneNumber.computed.getPhoneNumberItems.call(withoutDefault)).toEqual([
      { text: '+2', value: 'b' }
    ])
  })

  it('sortPhoneNumbersAndOrderByRegionCode prioritizes regional numbers', () => {
    const ctx = { countryCode: 'US' }

    const normal = InputCallerPhoneNumber.methods.sortPhoneNumbersAndOrderByRegionCode.call(ctx, [
      '+441234',
      '+12345',
      '+49111'
    ])
    expect(normal).toEqual(['+12345', '+441234', '+49111'])

    const phishing = InputCallerPhoneNumber.methods.sortPhoneNumbersAndOrderByRegionCode.call(
      ctx,
      [
        { phoneNumber: '+441234', resourceId: '2' },
        { phoneNumber: '+12345', resourceId: '1' }
      ],
      true
    )
    expect(phishing[0].resourceId).toBe('1')
    expect(phishing[1].resourceId).toBe('2')
  })

  it('getPhoneNumberCountry handles empty, default EN, and mapped item cases', () => {
    const createPhoneNumberObj = jest.fn(() => ({ getRegionCode: () => 'US' }))

    const emptyCtx = {
      isPhishingScenario: false,
      isSmishing: false,
      isQuishing: false,
      phoneNumbers: [],
      createPhoneNumberObj
    }
    expect(InputCallerPhoneNumber.methods.getPhoneNumberCountry.call(emptyCtx, '')).toBe('')

    const defaultCtx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      phoneNumbers: [],
      createPhoneNumberObj
    }
    expect(InputCallerPhoneNumber.methods.getPhoneNumberCountry.call(defaultCtx, 'resource-1')).toBe('EN')

    const mappedCtx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      phoneNumbers: [{ value: 'resource-1', text: '+12345' }],
      createPhoneNumberObj
    }
    expect(InputCallerPhoneNumber.methods.getPhoneNumberCountry.call(mappedCtx, 'resource-1')).toBe(
      'United States'
    )
    expect(createPhoneNumberObj).toHaveBeenCalledWith('+12345')
  })

  it('handleInputChange emits selected id and caller phone text', () => {
    const emit = jest.fn()
    const ctx = {
      phoneNumbers: [
        { value: 'id-1', text: '+12345' },
        { value: 'id-2', text: '+44123' }
      ],
      $emit: emit
    }

    InputCallerPhoneNumber.methods.handleInputChange.call(ctx, 'id-2')

    expect(emit).toHaveBeenCalledWith('input', 'id-2')
    expect(emit).toHaveBeenCalledWith('update:callerPhoneNumber', '+44123')
  })

  it('callForPhoneNumbers uses vishing api in default flow and auto-selects first', async () => {
    getPhoneNumbers.mockResolvedValueOnce({ data: ['+44123', '+12345'] })
    const handleInputChange = jest.fn()
    const ctx = {
      isPhishingScenario: false,
      isSmishing: false,
      isQuishing: false,
      value: '',
      selectFirstItem: true,
      phoneNumbers: [],
      sortPhoneNumbersAndOrderByRegionCode: InputCallerPhoneNumber.methods.sortPhoneNumbersAndOrderByRegionCode,
      getPhoneNumberFormatted: jest.fn((n) => `formatted:${n}`),
      handleInputChange,
      countryCode: 'US'
    }

    InputCallerPhoneNumber.methods.callForPhoneNumbers.call(ctx)
    await flushPromises()

    expect(getPhoneNumbers).toHaveBeenCalled()
    expect(ctx.phoneNumbers).toEqual(['formatted:+12345', 'formatted:+44123'])
    expect(handleInputChange).toHaveBeenCalledWith('formatted:+12345')
  })

  it('callForPhoneNumbers uses phishing api and maps text/value pairs', async () => {
    getPhishingScenariosPhoneNumber.mockResolvedValueOnce({
      data: {
        data: [
          { phoneNumber: '+44123', resourceId: 'p2' },
          { phoneNumber: '+12345', resourceId: 'p1' }
        ]
      }
    })

    const handleInputChange = jest.fn()
    const ctx = {
      isPhishingScenario: true,
      isSmishing: false,
      isQuishing: false,
      value: '',
      selectFirstItem: true,
      phoneNumbers: [],
      sortPhoneNumbersAndOrderByRegionCode: InputCallerPhoneNumber.methods.sortPhoneNumbersAndOrderByRegionCode,
      getPhoneNumberFormatted: jest.fn((p) => `formatted:${p.text}`),
      handleInputChange,
      countryCode: 'US'
    }

    InputCallerPhoneNumber.methods.callForPhoneNumbers.call(ctx)
    await flushPromises()

    expect(getPhishingScenariosPhoneNumber).toHaveBeenCalled()
    expect(ctx.phoneNumbers).toEqual([
      { text: 'formatted:+12345', value: 'p1' },
      { text: 'formatted:+44123', value: 'p2' }
    ])
    expect(handleInputChange).toHaveBeenCalledWith('p1')
  })
})
