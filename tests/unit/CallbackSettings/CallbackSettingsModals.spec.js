import DeselectPhoneNumberModal from '@/components/CallbackSettings/DeselectPhoneNumberModal.vue'
import ExchangePhoneNumberModal from '@/components/CallbackSettings/ExchangePhoneNumberModal.vue'
import SelectPhoneNumbersModal from '@/components/CallbackSettings/SelectPhoneNumbersModal.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  getAvailableCallbackNumbers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { number: '+1-111', providerNumberId: 'p-1' },
          { number: '+1-222', providerNumberId: 'p-2' }
        ]
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback settings modals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DeselectPhoneNumberModal.vue', () => {
    it('changeStatus emits close', () => {
      const emit = jest.fn()
      DeselectPhoneNumberModal.methods.changeStatus.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('close')
    })

    it('confirm emits confirm', () => {
      const emit = jest.fn()
      DeselectPhoneNumberModal.methods.confirm.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('confirm')
    })
  })

  describe('ExchangePhoneNumberModal.vue', () => {
    it('isExchangeDisabled computed respects loading and selection', () => {
      expect(
        ExchangePhoneNumberModal.computed.isExchangeDisabled.call({
          isLoading: true,
          selectedPhoneNumber: '+1-111'
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
          selectedPhoneNumber: '+1-111'
        })
      ).toBe(false)
    })

    it('callPhoneNumbers maps API data to items and number list', async () => {
      const ctx = { phoneNumberItems: [], phoneNumbers: [] }
      ExchangePhoneNumberModal.methods.callPhoneNumbers.call(ctx)
      await flushPromises()

      expect(CallbackService.getAvailableCallbackNumbers).toHaveBeenCalled()
      expect(ctx.phoneNumberItems).toEqual([
        { number: '+1-111', providerNumberId: 'p-1' },
        { number: '+1-222', providerNumberId: 'p-2' }
      ])
      expect(ctx.phoneNumbers).toEqual(['+1-111', '+1-222'])
    })

    it('handlePhoneNumberChange updates selected number and resource id', () => {
      const ctx = {
        phoneNumberItems: [
          { number: '+1-111', providerNumberId: 'p-1' },
          { number: '+1-222', providerNumberId: 'p-2' }
        ],
        selectedPhoneNumberResourceId: null,
        selectedPhoneNumber: null
      }
      ExchangePhoneNumberModal.methods.handlePhoneNumberChange.call(ctx, '+1-222')
      expect(ctx.selectedPhoneNumberResourceId).toBe('p-2')
      expect(ctx.selectedPhoneNumber).toBe('+1-222')
    })

    it('handlePhoneNumberChange keeps state when phone is not found', () => {
      const ctx = {
        phoneNumberItems: [{ number: '+1-111', providerNumberId: 'p-1' }],
        selectedPhoneNumberResourceId: 'p-1',
        selectedPhoneNumber: '+1-111'
      }
      ExchangePhoneNumberModal.methods.handlePhoneNumberChange.call(ctx, '+9-999')
      expect(ctx.selectedPhoneNumberResourceId).toBe('p-1')
      expect(ctx.selectedPhoneNumber).toBe('+1-111')
    })

    it('changeStatus and confirm emit expected events', () => {
      const emit = jest.fn()
      ExchangePhoneNumberModal.methods.changeStatus.call({ $emit: emit })
      ExchangePhoneNumberModal.methods.confirm.call({
        $emit: emit,
        selectedPhoneNumberResourceId: 'p-2'
      })
      expect(emit).toHaveBeenCalledWith('close')
      expect(emit).toHaveBeenCalledWith('confirm', 'p-2')
    })
  })

  describe('SelectPhoneNumbersModal.vue', () => {
    it('isDoneDisabled computed handles all disable branches', () => {
      expect(
        SelectPhoneNumbersModal.computed.isDoneDisabled.call({
          isLoading: true,
          selectedPhoneNumbers: ['p-1'],
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
          selectedPhoneNumbers: ['p-1', 'p-2', 'p-3'],
          selectablePhoneNumberCount: 2
        })
      ).toBe(true)
      expect(
        SelectPhoneNumbersModal.computed.isDoneDisabled.call({
          isLoading: false,
          selectedPhoneNumbers: ['p-1'],
          selectablePhoneNumberCount: 2
        })
      ).toBe(false)
    })

    it('getSubtitle uses singular/plural wording by selectable count', () => {
      expect(
        SelectPhoneNumbersModal.computed.getSubtitle.call({
          selectablePhoneNumberCount: 1
        })
      ).toContain('1 callback phone number.')
      expect(
        SelectPhoneNumbersModal.computed.getSubtitle.call({
          selectablePhoneNumberCount: 3
        })
      ).toContain('3 callback phone numbers.')
    })

    it('getRules validator returns true within limit and message on overflow', () => {
      const singleCtx = { selectablePhoneNumberCount: 1 }
      const singleRule = SelectPhoneNumbersModal.computed.getRules.call(singleCtx)[0]
      expect(singleRule(['p-1'])).toBe(true)
      expect(singleRule(['p-1', 'p-2'])).toContain('maximum 1 callback phone number')

      const multiCtx = { selectablePhoneNumberCount: 2 }
      const multiRule = SelectPhoneNumbersModal.computed.getRules.call(multiCtx)[0]
      expect(multiRule(['p-1', 'p-2'])).toBe(true)
      expect(multiRule(['p-1', 'p-2', 'p-3'])).toContain('maximum 2 callback phone numbers')
    })

    it('callPhoneNumbers loads available number items', async () => {
      const ctx = { phoneNumberItems: [] }
      SelectPhoneNumbersModal.methods.callPhoneNumbers.call(ctx)
      await flushPromises()

      expect(CallbackService.getAvailableCallbackNumbers).toHaveBeenCalled()
      expect(ctx.phoneNumberItems.length).toBe(2)
    })

    it('handleSelectedPhoneNumberChange updates selected numbers', () => {
      const ctx = { selectedPhoneNumbers: [] }
      SelectPhoneNumbersModal.methods.handleSelectedPhoneNumberChange.call(ctx, ['p-1', 'p-2'])
      expect(ctx.selectedPhoneNumbers).toEqual(['p-1', 'p-2'])
    })

    it('changeStatus and confirm emit expected events', () => {
      const emit = jest.fn()
      SelectPhoneNumbersModal.methods.changeStatus.call({ $emit: emit })
      SelectPhoneNumbersModal.methods.confirm.call({
        $emit: emit,
        selectedPhoneNumbers: ['p-1']
      })
      expect(emit).toHaveBeenCalledWith('close')
      expect(emit).toHaveBeenCalledWith('confirm', ['p-1'])
    })
  })
})
