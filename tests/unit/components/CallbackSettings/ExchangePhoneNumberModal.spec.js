jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getAvailableCallbackNumbers: jest.fn(() =>
      Promise.resolve({
        data: {
          data: [
            { number: '+100', providerNumberId: 'p1' },
            { number: '+200', providerNumberId: 'p2' }
          ]
        }
      })
    )
  }
}))

import ExchangePhoneNumberModal from '@/components/CallbackSettings/ExchangePhoneNumberModal.vue'
import CallbackService from '@/api/callback'

describe('ExchangePhoneNumberModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(ExchangePhoneNumberModal.name).toBe('ExchangePhoneNumberModal')
  })

  it('isExchangeDisabled reacts to loading and selected number', () => {
    expect(
      ExchangePhoneNumberModal.computed.isExchangeDisabled.call({
        isLoading: true,
        selectedPhoneNumber: '+100'
      })
    ).toBe(true)
    expect(
      ExchangePhoneNumberModal.computed.isExchangeDisabled.call({
        isLoading: false,
        selectedPhoneNumber: null
      })
    ).toBe(true)
    expect(
      ExchangePhoneNumberModal.computed.isExchangeDisabled.call({
        isLoading: false,
        selectedPhoneNumber: '+100'
      })
    ).toBe(false)
  })

  it('callPhoneNumbers loads phone list and mapped numbers', async () => {
    const ctx = { phoneNumberItems: [], phoneNumbers: [] }
    ExchangePhoneNumberModal.methods.callPhoneNumbers.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.getAvailableCallbackNumbers).toHaveBeenCalled()
    expect(ctx.phoneNumberItems).toHaveLength(2)
    expect(ctx.phoneNumbers).toEqual(['+100', '+200'])
  })

  it('handlePhoneNumberChange sets selected provider id and number', () => {
    const ctx = {
      phoneNumberItems: [
        { number: '+100', providerNumberId: 'p1' },
        { number: '+200', providerNumberId: 'p2' }
      ],
      selectedPhoneNumberResourceId: null,
      selectedPhoneNumber: null
    }
    ExchangePhoneNumberModal.methods.handlePhoneNumberChange.call(ctx, '+200')
    expect(ctx.selectedPhoneNumberResourceId).toBe('p2')
    expect(ctx.selectedPhoneNumber).toBe('+200')
  })

  it('changeStatus and confirm emit expected events', () => {
    const $emit = jest.fn()
    ExchangePhoneNumberModal.methods.changeStatus.call({ $emit })
    ExchangePhoneNumberModal.methods.confirm.call({ $emit, selectedPhoneNumberResourceId: 'p1' })
    expect($emit).toHaveBeenCalledWith('close')
    expect($emit).toHaveBeenCalledWith('confirm', 'p1')
  })
})
