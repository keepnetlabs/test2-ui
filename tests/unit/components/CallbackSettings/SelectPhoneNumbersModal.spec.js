jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getAvailableCallbackNumbers: jest.fn(() =>
      Promise.resolve({
        data: { data: [{ number: '+100', providerNumberId: 'p1' }] }
      })
    )
  }
}))

import SelectPhoneNumbersModal from '@/components/CallbackSettings/SelectPhoneNumbersModal.vue'
import CallbackService from '@/api/callback'

describe('SelectPhoneNumbersModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(SelectPhoneNumbersModal.name).toBe('SelectPhoneNumbersModal')
  })

  it('isDoneDisabled handles loading, empty and over-limit selections', () => {
    expect(
      SelectPhoneNumbersModal.computed.isDoneDisabled.call({
        isLoading: true,
        selectedPhoneNumbers: [1],
        selectablePhoneNumberCount: 2
      })
    ).toBe(true)
    expect(
      SelectPhoneNumbersModal.computed.isDoneDisabled.call({
        isLoading: false,
        selectedPhoneNumbers: [],
        selectablePhoneNumberCount: 2
      })
    ).toBe(true)
    expect(
      SelectPhoneNumbersModal.computed.isDoneDisabled.call({
        isLoading: false,
        selectedPhoneNumbers: [1, 2, 3],
        selectablePhoneNumberCount: 2
      })
    ).toBe(true)
    expect(
      SelectPhoneNumbersModal.computed.isDoneDisabled.call({
        isLoading: false,
        selectedPhoneNumbers: [1],
        selectablePhoneNumberCount: 2
      })
    ).toBe(false)
  })

  it('getSubtitle and getRules produce singular/plural messages', () => {
    expect(
      SelectPhoneNumbersModal.computed.getSubtitle.call({ selectablePhoneNumberCount: 1 })
    ).toContain('number')
    expect(
      SelectPhoneNumbersModal.computed.getSubtitle.call({ selectablePhoneNumberCount: 2 })
    ).toContain('numbers')

    const rule = SelectPhoneNumbersModal.computed.getRules.call({ selectablePhoneNumberCount: 1 })[0]
    expect(rule([1])).toBe(true)
    expect(rule([1, 2])).toContain('maximum 1 callback phone number')
  })

  it('callPhoneNumbers loads available numbers', async () => {
    const ctx = { phoneNumberItems: [] }
    SelectPhoneNumbersModal.methods.callPhoneNumbers.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.getAvailableCallbackNumbers).toHaveBeenCalled()
    expect(ctx.phoneNumberItems).toEqual([{ number: '+100', providerNumberId: 'p1' }])
  })

  it('input and modal events update state and emit payload', () => {
    const $emit = jest.fn()
    const ctx = { selectedPhoneNumbers: [], $emit }

    SelectPhoneNumbersModal.methods.handleSelectedPhoneNumberChange.call(ctx, ['p1', 'p2'])
    expect(ctx.selectedPhoneNumbers).toEqual(['p1', 'p2'])

    SelectPhoneNumbersModal.methods.changeStatus.call(ctx)
    SelectPhoneNumbersModal.methods.confirm.call(ctx)
    expect($emit).toHaveBeenCalledWith('close')
    expect($emit).toHaveBeenCalledWith('confirm', ['p1', 'p2'])
  })
})
