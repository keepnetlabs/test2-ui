import DataTableText from '@/components/DataTableComponents/DataTableText.vue'

describe('DataTableText.vue', () => {
  it('getHasRowContent returns truthy when row exists', () => {
    const value = DataTableText.getHasRowContent({
      scope: { row: { name: '' } },
      col: { property: 'name' }
    })
    expect(value).toBe(true)
  })

  it('getHasValidationError finds matching field error', () => {
    const value = DataTableText.getHasValidationError({
      scope: {
        row: {
          validationDetail: [{ fieldName: 'Name', message: 'required' }]
        }
      },
      col: { property: 'name' }
    })
    expect(value.message).toBe('required')
  })
})
