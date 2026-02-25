import TableField from '@/components/TargetUsers/subcomponents/TableField.vue'

describe('TableField.vue', () => {
  it('data returns fieldItems with types', () => {
    const data = TableField.data()
    expect(data.fieldItems).toBeDefined()
    expect(data.fieldItems.length).toBeGreaterThan(0)
    expect(data.fieldItems[0]).toEqual({ text: 'Text', value: 'String' })
  })

  it('handleDelete emits deleteTableField', () => {
    const ctx = { $emit: jest.fn() }
    TableField.methods.handleDelete.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('deleteTableField', undefined)
  })
})
