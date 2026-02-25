import DataContainerWithSearchItem from '@/components/Common/Others/DataContainerWithSearchItem.vue'

describe('DataContainerWithSearchItem.vue', () => {
  it('has correct component name', () => {
    expect(DataContainerWithSearchItem.name).toBe('DataContainerWithSearchItem')
  })

  it('isValid is true for non-editable item', () => {
    expect(
      DataContainerWithSearchItem.computed.isValid.call({
        isEditable: false,
        isEdit: false,
        value: '',
        textFieldValue: '',
        textFieldRules: []
      })
    ).toBe(true)
  })

  it('getStyle reflects invalid and edit states', () => {
    expect(
      DataContainerWithSearchItem.computed.getStyle.call({
        itemHeight: '48',
        isValid: false,
        isEdit: false
      })
    ).toEqual({ height: '48px', backgroundColor: '#FEF7F7' })

    expect(
      DataContainerWithSearchItem.computed.getStyle.call({
        itemHeight: '48',
        isValid: true,
        isEdit: true
      })
    ).toEqual({ height: '48px', backgroundColor: 'white' })
  })

  it('getValidationErrorMessage returns first failing rule message', () => {
    const msg = DataContainerWithSearchItem.methods.getValidationErrorMessage.call(
      {
        textFieldRules: [(v) => !!v || 'Required', () => 'Second']
      },
      ''
    )
    expect(msg).toBe('Required')
  })

  it('handleActionButtonClick emits input when form validates', () => {
    const $emit = jest.fn()
    const ctx = {
      $refs: { refForm: { validate: () => true } },
      textFieldValue: 'new',
      value: 'old',
      index: 2,
      $emit
    }
    DataContainerWithSearchItem.methods.handleActionButtonClick.call(ctx)
    expect($emit).toHaveBeenCalledWith('input', 'new', 'old', 2)
  })

  it('handleCancelClick reverts text and exits edit mode', () => {
    const ctx = {
      value: 'orig',
      textFieldValue: 'draft',
      changeIsEdit: jest.fn()
    }
    DataContainerWithSearchItem.methods.handleCancelClick.call(ctx)
    expect(ctx.textFieldValue).toBe('orig')
    expect(ctx.changeIsEdit).toHaveBeenCalled()
  })
})
