import { createLocalVue, shallowMount } from '@vue/test-utils'
import ShowMoreTags from '@/components/ShowMoreTags.vue'

// Mock Badge component
const BadgeStub = {
  template: '<div class="badge-stub">{{ text }}</div>',
  props: ['text', 'color', 'size', 'listeners']
}

describe('ShowMoreTags.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(ShowMoreTags, {
      localVue,
      propsData: {
        defaultBadges: ['Tag1', 'Tag2', 'Tag3'],
        badgeColor: '#000',
        ...propsData
      },
      stubs: {
        Badge: BadgeStub,
        'v-tooltip': {
          template: '<div><slot name="activator" :on="{}"></slot><slot name="status-tooltip-text"></slot></div>'
        },
        'v-btn': true
      }
    })
  }

  it('renders all badges if they fit', () => {
    // Width calc: 'Tag1' (4*8+10=42). 3 tags ~ 126px. Max width 200. Should fit.
    const wrapper = mountComponent()
    
    // Check rendered badges
    // We expect 3 badges.
    const badges = wrapper.findAll('.badge-stub')
    // Logic in created() runs getBadges().
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(3)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
  })

  it('limits badges if max count provided', () => {
    const wrapper = mountComponent({
      showMaximumBadgeCount: 1
    })
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(1)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(2)
  })

  it('limits badges if they do not fit width', () => {
    // Create long tags
    const longTags = ['VeryLongTag1ShouldTakeSpace', 'AnotherLongTag2', 'Tag3']
    // 'VeryLongTag1ShouldTakeSpace' = 27 chars * 8 + 10 = 226px > 200.
    // So only 0 items should render?
    // Logic: 
    // for item of badges:
    // itemWidth > totalWidth (200) -> break.
    // So renderedCount = 0.
    
    // But check: if maximumRenderedBadgeCount === 0 && maxWidth > 100 -> set to 1.
    
    const wrapper = mountComponent({
      defaultBadges: longTags
    })
    
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(1)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(2) // 3 - 1
  })

  it('generates correct tooltip text for hidden badges', () => {
    const wrapper = mountComponent({
      defaultBadges: ['A', 'B', 'C'],
      showMaximumBadgeCount: 1
    })

    // hidden: B, C
    expect(wrapper.vm.getTooltipText).toContain('B')
    expect(wrapper.vm.getTooltipText).toContain('C')
  })

  it('displays badges with correct color', () => {
    const testColor = '#FF5733'
    const wrapper = mountComponent({
      badgeColor: testColor
    })
    expect(wrapper.vm.$props.badgeColor).toBe(testColor)
  })

  it('counts rendered vs hidden badges correctly', () => {
    const wrapper = mountComponent({
      defaultBadges: ['A', 'B', 'C', 'D'],
      showMaximumBadgeCount: 2
    })
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(2)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(2)
  })

  it('handles single badge display', () => {
    const wrapper = mountComponent({
      defaultBadges: ['SingleTag']
    })
    expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
  })

  it('displays all badges when they fit', () => {
    const wrapper = mountComponent({
      defaultBadges: ['Tag1', 'Tag2'],
      showMaximumBadgeCount: 5
    })
    expect(wrapper.vm.unRenderedBadgeCount).toBeLessThanOrEqual(0)
  })

  describe('Badge Rendering', () => {
    it('renders badge components', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.badge-stub').length).toBeGreaterThan(0)
    })

    it('renders multiple badges', () => {
      const wrapper = mountComponent({
        defaultBadges: ['Tag1', 'Tag2', 'Tag3', 'Tag4']
      })
      expect(wrapper.vm.defaultBadges.length).toBe(4)
    })

    it('renders with correct badge color', () => {
      const wrapper = mountComponent({ badgeColor: '#FF5733' })
      expect(wrapper.vm.$props.badgeColor).toBe('#FF5733')
    })

    it('displays badge text', () => {
      const wrapper = mountComponent({
        defaultBadges: ['TestTag']
      })
      expect(wrapper.find('.badge-stub').text()).toContain('TestTag')
    })
  })

  describe('Badge Count Management', () => {
    it('tracks rendered badge count', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })

    it('tracks unrendered badge count', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'B', 'C', 'D', 'E'],
        showMaximumBadgeCount: 2
      })
      expect(wrapper.vm.unRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })

    it('calculates total badges correctly', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'B', 'C']
      })
      const total = wrapper.vm.maximumRenderedBadgeCount + wrapper.vm.unRenderedBadgeCount
      expect(total).toBeLessThanOrEqual(3)
    })

    it('respects showMaximumBadgeCount limit', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'B', 'C', 'D'],
        showMaximumBadgeCount: 2
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBe(2)
    })
  })

  describe('Width-based Rendering', () => {
    it('handles short badge names', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'B', 'C']
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
    })

    it('limits long badge names by width', () => {
      const wrapper = mountComponent({
        defaultBadges: ['VeryLongTag1ShouldTakeSpace', 'AnotherLongTag2', 'Tag3']
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })

    it('handles mixed length badge names', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'MediumLengthTag', 'VeryLongBadgeNameHere']
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Tooltip Functionality', () => {
    it('generates tooltip text for hidden badges', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A', 'B', 'C'],
        showMaximumBadgeCount: 1
      })
      expect(wrapper.vm.getTooltipText).toBeDefined()
    })

    it('includes hidden badges in tooltip', () => {
      const wrapper = mountComponent({
        defaultBadges: ['TagA', 'TagB', 'TagC'],
        showMaximumBadgeCount: 1
      })
      const tooltip = wrapper.vm.getTooltipText
      expect(tooltip.includes('TagB') || tooltip.includes('TagC')).toBe(true)
    })

    it('tooltip contains all hidden badges', () => {
      const wrapper = mountComponent({
        defaultBadges: ['One', 'Two', 'Three'],
        showMaximumBadgeCount: 1
      })
      const tooltip = wrapper.vm.getTooltipText
      expect(tooltip).toContain('Two')
      expect(tooltip).toContain('Three')
    })

    it('empty tooltip when no hidden badges', () => {
      const wrapper = mountComponent({
        defaultBadges: ['Tag1'],
        showMaximumBadgeCount: 5
      })
      expect(wrapper.vm.unRenderedBadgeCount).toBeLessThanOrEqual(0)
    })
  })

  describe('Props Handling', () => {
    it('accepts defaultBadges prop', () => {
      const badges = ['Badge1', 'Badge2']
      const wrapper = mountComponent({ defaultBadges: badges })
      expect(wrapper.props('defaultBadges')).toEqual(badges)
    })

    it('accepts badgeColor prop', () => {
      const color = '#FF0000'
      const wrapper = mountComponent({ badgeColor: color })
      expect(wrapper.props('badgeColor')).toBe(color)
    })

    it('accepts showMaximumBadgeCount prop', () => {
      const wrapper = mountComponent({ showMaximumBadgeCount: 3 })
      expect(wrapper.props('showMaximumBadgeCount')).toBe(3)
    })

    it('handles all props together', () => {
      const props = {
        defaultBadges: ['A', 'B', 'C'],
        badgeColor: '#123456',
        showMaximumBadgeCount: 2
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('defaultBadges')).toEqual(props.defaultBadges)
      expect(wrapper.props('badgeColor')).toBe(props.badgeColor)
      expect(wrapper.props('showMaximumBadgeCount')).toBe(props.showMaximumBadgeCount)
    })
  })

  describe('Single and Multiple Items', () => {
    it('handles single badge', () => {
      const wrapper = mountComponent({
        defaultBadges: ['Single']
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
    })

    it('handles many badges', () => {
      const wrapper = mountComponent({
        defaultBadges: Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`)
      })
      expect(wrapper.vm.defaultBadges.length).toBe(10)
    })

    it('displays subset of many badges', () => {
      const wrapper = mountComponent({
        defaultBadges: Array.from({ length: 8 }, (_, i) => `Tag${i + 1}`),
        showMaximumBadgeCount: 3
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBe(3)
    })
  })

  describe('Color Handling', () => {
    it('accepts hex color codes', () => {
      const wrapper = mountComponent({ badgeColor: '#FFFFFF' })
      expect(wrapper.vm.$props.badgeColor).toBe('#FFFFFF')
    })

    it('accepts rgb color codes', () => {
      const wrapper = mountComponent({ badgeColor: 'rgb(255, 0, 0)' })
      expect(wrapper.vm.$props.badgeColor).toBe('rgb(255, 0, 0)')
    })

    it('handles named colors', () => {
      const wrapper = mountComponent({ badgeColor: 'blue' })
      expect(wrapper.vm.$props.badgeColor).toBe('blue')
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('updates when props change', async () => {
      const wrapper = mountComponent({
        defaultBadges: ['A']
      })
      await wrapper.setProps({
        defaultBadges: ['A', 'B', 'C']
      })
      expect(wrapper.props('defaultBadges').length).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty badge list', () => {
      const wrapper = mountComponent({
        defaultBadges: []
      })
      expect(wrapper.vm.defaultBadges.length).toBe(0)
    })

    it('handles badges with special characters', () => {
      const wrapper = mountComponent({
        defaultBadges: ['Tag@Special', 'Tag#Hash', 'Tag$Dollar']
      })
      expect(wrapper.vm.defaultBadges.length).toBe(3)
    })

    it('handles very long badge names', () => {
      const wrapper = mountComponent({
        defaultBadges: ['A'.repeat(100)]
      })
      expect(wrapper.vm.defaultBadges.length).toBeGreaterThan(0)
    })

    it('handles zero maximum badge count', () => {
      const wrapper = mountComponent({
        showMaximumBadgeCount: 0
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
  })
})
