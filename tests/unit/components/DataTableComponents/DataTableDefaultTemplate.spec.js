import DataTableDefaultTemplate from '@/components/DataTableComponents/DataTableDefaultTemplate.vue'

describe('DataTableDefaultTemplate.vue', () => {
  it('getTooltip includes typeName when present', () => {
    const value = DataTableDefaultTemplate.computed.getTooltip.call({
      scope: { row: { typeName: 'Welcome' } }
    })
    expect(value).toContain('Welcome')
  })

  it('getTooltip returns default text when no typeName', () => {
    const value = DataTableDefaultTemplate.computed.getTooltip.call({ scope: { row: {} } })
    expect(value).toBe('Default option')
  })
})
