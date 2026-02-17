import { shallowMount } from '@vue/test-utils'
import DatatableTextWithBadge from '@/components/DataTableComponents/DatatableTextWithBadge'

describe('DatatableTextWithBadge.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(DatatableTextWithBadge, {
      propsData: {
        scope: {
          row: { tags: ['VeryLongBadgeName', 'Short', 'AnotherTag'] },
          column: { width: 220 }
        },
        col: {
          property: 'tags',
          cellPadding: 5,
          emptyText: '-'
        },
        ...propsData
      },
      stubs: {
        badge: true,
        'v-tooltip': true,
        'v-btn': true
      }
    })

  it('maps camel case values when mapper is enabled', () => {
    const wrapper = mountComponent({
      scope: {
        row: { tags: ['EmailTemplate', 'LandingPage'] },
        column: { width: 300 }
      },
      col: { property: 'tags', cellPadding: 5, hasMapper: true }
    })

    expect(wrapper.vm.badges).toEqual(['Email Template', 'Landing Page'])
  })

  it('computes tooltip text for unrendered badges', async () => {
    const wrapper = mountComponent()

    await wrapper.setData({
      badges: ['A', 'B', 'C'],
      maximumRenderedBadgeCount: 1
    })

    expect(wrapper.vm.getTooltipText).toBe('B\nC\n')
  })

  it('returns expected width multipliers', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getMultiplyBy('tiny')).toBe(11)
    expect(wrapper.vm.getMultiplyBy('mediumLen')).toBe(7)
    expect(wrapper.vm.getMultiplyBy('ThisIsAVeryLongValueOverTwentyFiveChars')).toBe(6.75)
  })

  it('keeps safe defaults when there are no badges', async () => {
    const wrapper = mountComponent({
      scope: {
        row: { tags: [] },
        column: { width: 100 }
      }
    })

    await wrapper.setData({ badges: [] })
    wrapper.vm.getBadges()

    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(0)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
  })
})
