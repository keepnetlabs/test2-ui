import DataTableLink from '@/components/DataTableComponents/DataTableLink.vue'

describe('DataTableLink.vue', () => {
  it('getEmptyText returns emptyText fallback', () => {
    const value = DataTableLink.computed.getEmptyText.call({ col: { emptyText: '-' } })
    expect(value).toBe('-')
  })

  it('getRouterLink builds link when custom is false', () => {
    const value = DataTableLink.computed.getRouterLink.call({
      col: { custom: false, href: '/users', hrefKey: 'id' },
      scope: { row: { id: 'u1' } }
    })
    expect(value).toBe('/users/u1')
  })
})
