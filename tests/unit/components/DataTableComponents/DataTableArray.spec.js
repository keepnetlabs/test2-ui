import DataTableArray from '@/components/DataTableComponents/DataTableArray.vue'

describe('DataTableArray.vue', () => {
  it('getEmptyText returns column emptyText', () => {
    const text = DataTableArray.computed.getEmptyText.call({ col: { emptyText: '-' } })
    expect(text).toBe('-')
  })
})
