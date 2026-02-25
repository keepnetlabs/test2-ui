import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip.vue'

describe('DataTableTooltip.vue', () => {
  it('mounted appends tooltip to body when appendToBody true', () => {
    const node = document.createElement('div')
    const ctx = { appendToBody: true, $refs: { tooltip: node } }
    DataTableTooltip.mounted.call(ctx)
    expect(document.body.contains(node)).toBe(true)
    document.body.removeChild(node)
  })

  it('beforeDestroy removes tooltip from body when appended', () => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const ctx = { appendToBody: true, $refs: { tooltip: node } }
    DataTableTooltip.beforeDestroy.call(ctx)
    expect(document.body.contains(node)).toBe(false)
  })
})
