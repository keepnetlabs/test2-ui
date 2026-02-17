import { mount } from '@vue/test-utils'
import DataTableDate from '@/components/DataTableComponents/DataTableDate'

describe('DataTableDate.vue', () => {
  const mountWithHost = (scope, col) =>
    mount({
      components: { DataTableDate },
      data() {
        return { scope, col }
      },
      template: '<DataTableDate :scope="scope" :col="col" />'
    })

  it('renders date prefix when value exists', () => {
    const wrapper = mountWithHost(
      { row: { createdAt: '2026-02-17T10:00:00Z' } },
      { property: 'createdAt' }
    )

    expect(wrapper.text()).toContain('2026-02-17')
  })

  it('renders empty text when row does not exist', () => {
    const wrapper = mountWithHost(
      { row: null },
      { property: 'createdAt', emptyText: '-' }
    )

    expect(wrapper.text()).toContain('-')
  })
})

