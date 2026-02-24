import { mount, shallowMount } from '@vue/test-utils'
import DataTableAttachment from '@/components/DataTableComponents/DataTableAttachment'
import DataTableMultiText from '@/components/DataTableComponents/DataTableMultiText'
import { DETECTED_COLORS } from '@/components/DataTableComponents/utils'

describe('DataTable multi text and utils', () => {
  it('DataTableAttachment exposes expected functional component metadata', () => {
    expect(DataTableAttachment.name).toBe('DataTableAttachment')
    expect(DataTableAttachment.functional).toBe(true)
    expect(DataTableAttachment.props).toHaveProperty('scope')
    expect(DataTableAttachment.props).toHaveProperty('col')
  })

  it('DataTableAttachment renders check icon when value > 0', () => {
    const wrapper = mount(DataTableAttachment, {
      propsData: {
        scope: { row: { attachmentCount: 3 } },
        col: { property: 'attachmentCount' }
      },
      stubs: { 'v-icon': true }
    })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.html()).toContain('mdi-check')
  })

  it('DataTableAttachment renders cancel icon when value is 0 or missing', () => {
    const wrapper = mount(DataTableAttachment, {
      propsData: {
        scope: { row: { attachmentCount: 0 } },
        col: { property: 'attachmentCount' }
      },
      stubs: { 'v-icon': true }
    })
    expect(wrapper.html()).toContain('mdi-cancel')
  })

  it('DataTableAttachment renders cancel when scope.row is missing', () => {
    const wrapper = mount(DataTableAttachment, {
      propsData: {
        scope: {},
        col: { property: 'attachmentCount' }
      },
      stubs: { 'v-icon': true }
    })
    expect(wrapper.html()).toContain('mdi-cancel')
  })

  it('DETECTED_COLORS includes expected status color mappings', () => {
    expect(DETECTED_COLORS.online).toBe('#00BCD4')
    expect(DETECTED_COLORS.inactive).toBe('#F56C6C')
    expect(DETECTED_COLORS.finished).toBe('#43A047')
    expect(DETECTED_COLORS['not running']).toBe('#F56C6C')
  })

  const mountMultiText = (scope, col = { property: 'tags', emptyText: '-' }) =>
    shallowMount(DataTableMultiText, {
      propsData: {
        scope,
        col
      },
      stubs: {
        badge: true,
        'v-tooltip': true,
        'v-btn': true
      }
    })

  it('DataTableMultiText handles string values as a single badge item', () => {
    const wrapper = mountMultiText({
      row: { tags: 'only-one' },
      column: { width: 220 }
    })

    expect(wrapper.vm.badges).toEqual(['only-one'])
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(1)
  })

  it('DataTableMultiText computes tooltip text from unrendered badges', () => {
    const wrapper = mountMultiText({
      row: { tags: ['first', 'second', 'third'] },
      column: { width: 220 }
    })

    wrapper.setData({
      badges: ['first', 'second', 'third'],
      maximumRenderedBadgeCount: 1
    })

    expect(wrapper.vm.getTooltipText).toBe('second,third')
  })

  it('DataTableMultiText renders emptyText when row value is missing', () => {
    const wrapper = mountMultiText(
      { row: {}, column: { width: 180 } },
      { property: 'tags', emptyText: 'No tags' }
    )

    expect(wrapper.text()).toContain('No tags')
  })
})
