import { createLocalVue, shallowMount } from '@vue/test-utils'
import DataTableSmallBadge from '@/components/DataTableComponents/DataTableSmallBadge.vue'

// Mock utils
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '123')
}))

describe('DataTableSmallBadge.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(DataTableSmallBadge, {
      localVue,
      propsData: {
        scope: {
          row: { tags: ['Tag1', 'Tag2', 'ExtremelyLongTagThatMightNotFit'] },
          column: { width: 100 }
        },
        col: { property: 'tags', label: 'Tags' },
        ...propsData
      },
      stubs: {
        badge: {
          template: '<span class="badge-stub"><slot /></span>'
        },
        'v-tooltip': {
          template: '<span class="v-tooltip-stub"><slot /></span>'
        },
        'v-btn': {
          template: '<button class="v-btn-stub"><slot /></button>'
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.small-badge').exists()).toBe(true)
  })

  it('calculates rendered and unrendered badges based on width', () => {
    // 100px width. 
    // Available width = 100 - 20 = 80px
    // Tag1: 4 chars. getMultiplyBy(4) returns 11.5. 4 * 11.5 + 5 = 51px.
    // Tag2: 4 chars. 4 * 11.5 + 5 = 51px.
    // 51 + 51 = 102 > 80.
    // So only Tag1 should fit.
    
    const wrapper = mountComponent({
        scope: {
            row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
            column: { width: 100 }
        }
    })
    
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(1)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(2)
  })

  it('responds to large width by rendering more badges', () => {
    const wrapper = mountComponent({
        scope: {
            row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
            column: { width: 500 }
        }
    })
    
    expect(wrapper.vm.maximumRenderedBadgeCount).toBe(3)
    expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
  })

  it('updates when scope changes', async () => {
    const wrapper = mountComponent()
    const spy = jest.spyOn(wrapper.vm, 'getBadges')
    
    await wrapper.setProps({
        scope: {
            row: { tags: ['NewTag'] },
            column: { width: 200 }
        }
    })
    
    expect(spy).toHaveBeenCalled()
  })

  it('returns correctly formatted tooltip text', () => {
    const wrapper = mountComponent()
    
    wrapper.setData({
        maximumRenderedBadgeCount: 1,
        badges: ['Tag1', 'Tag2', 'Tag3']
    })
    
    expect(wrapper.vm.getTooltipText).toBe('Tag2,Tag3')
  })

  it('handles empty badges', () => {
    const wrapper = mountComponent({
        scope: { row: { tags: [] }, column: { width: 100 } }
    })
    expect(wrapper.vm.badges.length).toBe(0)
  })
  
  it('handles string input instead of array', () => {
    const wrapper = mountComponent({
        scope: { row: { tags: 'SingleTag' }, column: { width: 200 } }
    })
    expect(wrapper.vm.badges).toEqual(['SingleTag'])
  })

  it('uses emptyText for empty states', () => {
      const wrapper = mountComponent({
          scope: { row: { tags: null }, column: { width: 100 } },
          col: { property: 'tags', emptyText: 'No Tags' }
      })
      expect(wrapper.text()).toContain('No Tags')
  })

  it('calculates correct multiplier based on text length', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getMultiplyBy('short')).toBe(11.5)
      expect(wrapper.vm.getMultiplyBy('li')).toBe(15)
      expect(wrapper.vm.getMultiplyBy('a bits longer text')).toBe(7.5)
      expect(wrapper.vm.getMultiplyBy('medium text')).toBe(8.6)
  })

  it('renders small badge container', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.small-badge').exists()).toBe(true)
  })

  it('handles property not existing in row', () => {
    const wrapper = mountComponent({
      scope: { row: {}, column: { width: 100 } },
      col: { property: 'nonexistent' }
    })
    expect(wrapper.vm.badges.length).toBe(0)
  })

  it('correctly handles small width', () => {
    const wrapper = mountComponent({
      scope: {
        row: { tags: ['Tag1', 'Tag2'] },
        column: { width: 80 }
      }
    })

    expect(wrapper.vm.maximumRenderedBadgeCount).toBeLessThanOrEqual(1)
  })

  it('tooltip text includes unrevealed badges', () => {
    const wrapper = mountComponent({
      scope: {
        row: { tags: ['Tag1', 'Tag2', 'Tag3'] },
        column: { width: 80 }
      }
    })

    wrapper.setData({ maximumRenderedBadgeCount: 1, badges: ['Tag1', 'Tag2', 'Tag3'] })
    const tooltipText = wrapper.vm.getTooltipText
    expect(tooltipText).toContain('Tag2')
  })

  it('handles numeric array as tags', () => {
    const wrapper = mountComponent({
      scope: {
        row: { tags: [1, 2, 3] },
        column: { width: 200 }
      }
    })
    expect(wrapper.vm.badges).toBeTruthy()
  })

  it('component reacts to scope changes', async () => {
    const wrapper = mountComponent()
    const initialCount = wrapper.vm.maximumRenderedBadgeCount

    await wrapper.setProps({
      scope: {
        row: { tags: ['NewTag1', 'NewTag2', 'NewTag3'] },
        column: { width: 200 }
      }
    })

    expect(wrapper.vm.badges).toEqual(['NewTag1', 'NewTag2', 'NewTag3'])
  })
})
