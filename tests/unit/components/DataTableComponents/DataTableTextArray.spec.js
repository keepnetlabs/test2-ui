import DataTableTextArray from '@/components/DataTableComponents/DataTableTextArray.vue'

describe('DataTableTextArray.vue', () => {
  it('is a functional component with expected name', () => {
    expect(DataTableTextArray.functional).toBe(true)
    expect(DataTableTextArray.name).toBe('DataTableText')
  })
})
