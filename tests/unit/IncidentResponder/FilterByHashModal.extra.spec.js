jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '1234')
}))

import FilterByHashModal from '@/components/IncidentResponder/FilterByHashModal.vue'

describe('FilterByHashModal.vue (extra branch coverage)', () => {
  const { computed, data, methods } = FilterByHashModal

  it('falls back to SHA512 placeholder and hint for non-MD5 filter types', () => {
    expect(computed.getPlaceholder.call({ filterProps: { filterBy: undefined } })).toBe(
      'SHA512 Hash'
    )
    expect(computed.getHint.call({ filterProps: { filterBy: 'OTHER' } })).toBe(
      'Must match 128 digits HEX characters'
    )
  })

  it('data includes generated key and validation helpers', () => {
    const state = data.call({})

    expect(state.componentKey).toBe('key-1234')
    expect(typeof state.validations.required).toBe('function')
    expect(typeof state.validations.maxLength).toBe('function')
  })

  it('handleFilter re-validates each click and only emits on valid submissions', () => {
    const emit = jest.fn()
    const validate = jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
    const ctx = {
      $emit: emit,
      $refs: {
        appDialog: {
          $refs: {
            refDialogForm: {
              validate
            }
          }
        }
      }
    }

    methods.handleFilter.call(ctx)
    methods.handleFilter.call(ctx)

    expect(validate).toHaveBeenCalledTimes(2)
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('confirm')
  })
})
