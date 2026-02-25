import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput.vue'

describe('DataContainerWithSearchInput.vue', () => {
  it('has correct component name', () => {
    expect(DataContainerWithSearchInput.name).toBe('DataContainerWithSearchInput')
  })

  it('isButtonDisabled depends on form validity and inputValue', () => {
    expect(
      DataContainerWithSearchInput.computed.isButtonDisabled.call({
        isValid: false,
        inputValue: 'abc'
      })
    ).toBe(true)
    expect(
      DataContainerWithSearchInput.computed.isButtonDisabled.call({
        isValid: true,
        inputValue: ''
      })
    ).toBe(true)
    expect(
      DataContainerWithSearchInput.computed.isButtonDisabled.call({
        isValid: true,
        inputValue: 'abc'
      })
    ).toBe(false)
  })

  it('handleAddClick emits and resets validation when form is valid', () => {
    const resetValidation = jest.fn()
    const $emit = jest.fn()
    const ctx = {
      $emit,
      $refs: { refForm: { resetValidation } },
      validateForm: () => true,
      $nextTick: (cb) => cb()
    }
    DataContainerWithSearchInput.methods.handleAddClick.call(ctx)
    expect($emit).toHaveBeenCalledWith('on-add-click')
    expect(resetValidation).toHaveBeenCalled()
  })

  it('validateForm proxies to ref form validate', () => {
    const validate = jest.fn(() => true)
    const result = DataContainerWithSearchInput.methods.validateForm.call({
      $refs: { refForm: { validate } }
    })
    expect(validate).toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
