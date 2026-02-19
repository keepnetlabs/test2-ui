import DataTableDate from '@/components/DataTableComponents/DataTableDate'

describe('DataTableDate.vue', () => {
  it('is declared as a functional component with expected name', () => {
    expect(DataTableDate.name).toBe('DataTableDate')
    expect(DataTableDate.functional).toBe(true)
  })

  it('exposes required scope and col props', () => {
    expect(DataTableDate.props).toHaveProperty('scope')
    expect(DataTableDate.props).toHaveProperty('col')
  })
})
