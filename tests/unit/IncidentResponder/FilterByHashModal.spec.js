jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '1234')
}))

import FilterByHashModal from '@/components/IncidentResponder/FilterByHashModal.vue'

describe('FilterByHashModal.vue', () => {
  const { computed, methods, watch, data } = FilterByHashModal

  it('returns placeholder and hint according to filter type', () => {
    expect(computed.getPlaceholder.call({ filterProps: { filterBy: 'MD5' } })).toBe('MD5 Hash')
    expect(computed.getPlaceholder.call({ filterProps: { filterBy: 'SHA512' } })).toBe(
      'SHA512 Hash'
    )
    expect(computed.getHint.call({ filterProps: { filterBy: 'MD5' } })).toBe(
      'Must match 32 digits HEX characters'
    )
    expect(computed.getHint.call({ filterProps: { filterBy: 'SHA512' } })).toBe(
      'Must match 128 digits HEX characters'
    )
  })

  it('status and filterBy watchers refresh component key and emit input', () => {
    const emit = jest.fn()
    const ctx = {
      componentKey: 'old',
      $emit: emit
    }

    watch.status.call(ctx, true)
    expect(ctx.componentKey).toBe('key-1234')

    watch['filterProps.filterBy'].call(ctx, 'SHA512')
    expect(ctx.componentKey).toBe('key-1234')
    expect(emit).toHaveBeenCalledWith('input', { hash: '', filterBy: 'SHA512' })
  })

  it('handleFilter emits confirm only when dialog form is valid', () => {
    const emit = jest.fn()
    const validCtx = {
      $emit: emit,
      $refs: {
        appDialog: {
          $refs: {
            refDialogForm: {
              validate: () => true
            }
          }
        }
      }
    }
    const invalidCtx = {
      $emit: emit,
      $refs: {
        appDialog: {
          $refs: {
            refDialogForm: {
              validate: () => false
            }
          }
        }
      }
    }

    methods.handleFilter.call(validCtx)
    methods.handleFilter.call(invalidCtx)

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('confirm')
  })

  it('closeOverlay emits close and data includes generated key', () => {
    const emit = jest.fn()
    methods.closeOverlay.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('close')

    const state = data.call({})
    expect(state.componentKey).toBe('key-1234')
  })
})
