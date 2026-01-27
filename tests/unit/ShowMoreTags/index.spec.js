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
})
