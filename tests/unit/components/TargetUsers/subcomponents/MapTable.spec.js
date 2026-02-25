import MapTable from '@/components/TargetUsers/subcomponents/MapTable.vue'

describe('MapTable.vue', () => {
  it('columns computed returns empty array when no mapTableData', () => {
    const ctx = { mapTableData: null }
    expect(MapTable.computed.columns.call(ctx)).toEqual([])
  })

  it('columns computed returns mapTableData.columns when present', () => {
    const cols = [{ name: 'A' }, { name: 'B' }]
    const ctx = { mapTableData: { columns: cols } }
    expect(MapTable.computed.columns.call(ctx)).toEqual(cols)
  })

  it('getMapTableData returns mapTableData', () => {
    const mapTableData = { headers: [], columns: [], tableData: [] }
    const ctx = { mapTableData }
    expect(MapTable.methods.getMapTableData.call(ctx)).toBe(mapTableData)
  })

  it('setSelectDisableItems sets changeItemName', () => {
    const ctx = { mapTableData: {}, changeItemName: null }
    MapTable.methods.setSelectDisableItems.call(ctx, { name: 'Col1' })
    expect(ctx.changeItemName).toBe('Col1')
  })
})
