import DataTableColorfulText from '@/components/DataTableComponents/DataTableColorfulText.vue'

describe('DataTableColorfulText.vue', () => {
  it('is functional component and exposes getTextColor helper', () => {
    expect(DataTableColorfulText.functional).toBe(true)
    expect(typeof DataTableColorfulText.getTextColor).toBe('function')
  })
})
