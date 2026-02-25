import DataTableService from '@/components/DataTableComponents/DataTableService.vue'

describe('DataTableService.vue', () => {
  it('getEmptyText returns emptyText fallback', () => {
    const value = DataTableService.computed.getEmptyText.call({ col: { emptyText: 'N/A' } })
    expect(value).toBe('N/A')
  })
})
