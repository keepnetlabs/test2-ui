import DataTableFiber from '@/components/DataTableComponents/DataTableFiber.vue'

describe('DataTableFiber.vue', () => {
  it('getEmptyText returns column emptyText', () => {
    const text = DataTableFiber.computed.getEmptyText.call({ col: { emptyText: 'N/A' } })
    expect(text).toBe('N/A')
  })
})
