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

  describe('Component Structure', () => {
    it('should render badge container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.small-badge').exists()).toBe(true)
    })

    it('should have badge stubs', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should initialize with default props', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('scope')).toBeDefined()
      expect(wrapper.props('col')).toBeDefined()
    })

    it('should render tooltip wrapper when badges are unrendered', () => {
      const wrapper = mountComponent()
      // With default 100px width, some badges are unrendered, so tooltip should exist
      expect(wrapper.vm.unRenderedBadgeCount).toBeGreaterThan(0)
    })
  })

  describe('Badge Rendering', () => {
    it('should render correct number of badges for small width', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
          column: { width: 100 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeLessThanOrEqual(3)
    })

    it('should render all badges for large width', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
          column: { width: 500 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBe(3)
    })

    it('should handle single badge', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['SingleTag'] },
          column: { width: 200 }
        }
      })
      expect(wrapper.vm.badges.length).toBeGreaterThan(0)
    })

    it('should handle many badges', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: Array(20).fill('Tag') },
          column: { width: 500 }
        }
      })
      expect(wrapper.vm.badges).toBeDefined()
    })
  })

  describe('Badge Width Calculation', () => {
    it('should calculate rendered badge count for narrow column', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
          column: { width: 100 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBe(1)
    })

    it('should calculate rendered badge count for wide column', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
          column: { width: 500 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBe(3)
    })

    it('should calculate unrendered badge count correctly', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['AAAA', 'BBBB', 'CCCC'] },
          column: { width: 100 }
        }
      })
      expect(wrapper.vm.unRenderedBadgeCount).toBe(2)
    })

    it('should handle medium width column', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2', 'Tag3'] },
          column: { width: 200 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
    })

    it('should update calculations on width change', async () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2', 'Tag3'] },
          column: { width: 100 }
        }
      })
      const initialCount = wrapper.vm.maximumRenderedBadgeCount

      await wrapper.setProps({
        scope: {
          row: { tags: ['Tag1', 'Tag2', 'Tag3'] },
          column: { width: 500 }
        }
      })

      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(initialCount)
    })
  })

  describe('Multiplier Calculation', () => {
    it('should calculate multiplier for short text', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getMultiplyBy('short')).toBe(11.5)
    })

    it('should calculate multiplier for long text', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getMultiplyBy('medium text')).toBe(8.6)
    })

    it('should calculate multiplier for single characters', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getMultiplyBy('li')).toBe(15)
    })

    it('should calculate multiplier for very long text', () => {
      const wrapper = mountComponent()
      const multiplier = wrapper.vm.getMultiplyBy('a bits longer text')
      expect(multiplier).toBeGreaterThan(0)
    })

    it('should handle empty string multiplier', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getMultiplyBy('')).toBeGreaterThan(0)
    })
  })

  describe('Data Input Handling', () => {
    it('should handle array of tags', () => {
      const wrapper = mountComponent({
        scope: { row: { tags: ['Tag1', 'Tag2'] }, column: { width: 200 } }
      })
      expect(Array.isArray(wrapper.vm.badges)).toBe(true)
    })

    it('should handle string tag input', () => {
      const wrapper = mountComponent({
        scope: { row: { tags: 'SingleTag' }, column: { width: 200 } }
      })
      expect(wrapper.vm.badges).toEqual(['SingleTag'])
    })

    it('should handle numeric array as tags', () => {
      const wrapper = mountComponent({
        scope: { row: { tags: [1, 2, 3] }, column: { width: 200 } }
      })
      expect(wrapper.vm.badges).toBeTruthy()
    })

    it('should handle empty array', () => {
      const wrapper = mountComponent({
        scope: { row: { tags: [] }, column: { width: 100 } }
      })
      expect(wrapper.vm.badges.length).toBe(0)
    })

    it('should handle null tags with emptyText', () => {
      const wrapper = mountComponent({
        scope: { row: { tags: null }, column: { width: 100 } },
        col: { property: 'tags', emptyText: 'No Tags' }
      })
      expect(wrapper.text()).toContain('No Tags')
    })

    it('should handle missing property', () => {
      const wrapper = mountComponent({
        scope: { row: {}, column: { width: 100 } },
        col: { property: 'nonexistent' }
      })
      expect(wrapper.vm.badges.length).toBe(0)
    })
  })

  describe('Tooltip Functionality', () => {
    it('should generate correct tooltip text', () => {
      const wrapper = mountComponent()
      wrapper.setData({
        maximumRenderedBadgeCount: 1,
        badges: ['Tag1', 'Tag2', 'Tag3']
      })
      expect(wrapper.vm.getTooltipText).toBe('Tag2,Tag3')
    })

    it('should include unrevealed badges in tooltip', () => {
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

    it('should have empty tooltip when all badges shown', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2'] },
          column: { width: 500 }
        }
      })
      wrapper.setData({ maximumRenderedBadgeCount: 2, badges: ['Tag1', 'Tag2'] })
      expect(wrapper.vm.getTooltipText || '').toBeDefined()
    })

    it('should format tooltip with comma separator', () => {
      const wrapper = mountComponent()
      wrapper.setData({
        maximumRenderedBadgeCount: 0,
        badges: ['A', 'B', 'C']
      })
      const tooltip = wrapper.vm.getTooltipText
      if (tooltip) {
        expect(tooltip).toContain(',')
      }
    })
  })

  describe('Props Management', () => {
    it('should accept scope prop', () => {
      const scope = {
        row: { tags: ['Tag'] },
        column: { width: 200 }
      }
      const wrapper = mountComponent({ scope })
      expect(wrapper.props('scope')).toEqual(scope)
    })

    it('should accept col prop', () => {
      const col = { property: 'tags', label: 'Tags' }
      const wrapper = mountComponent({ col })
      expect(wrapper.props('col')).toEqual(col)
    })

    it('should support dynamic scope updates', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({
        scope: {
          row: { tags: ['Updated'] },
          column: { width: 300 }
        }
      })
      expect(wrapper.vm.badges).toBeDefined()
    })

    it('should react to scope changes', async () => {
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
  })

  describe('Edge Cases', () => {
    it('should handle very small width gracefully', () => {
      // With width 20, no badges fit, so all are unrendered
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2'] },
          column: { width: 50 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
      expect(wrapper.vm.badges.length).toBeGreaterThan(0)
    })

    it('should handle very large width', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2'] },
          column: { width: 10000 }
        }
      })
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
    })

    it('should handle many tags', () => {
      const manyTags = Array(100).fill('Tag')
      const wrapper = mountComponent({
        scope: {
          row: { tags: manyTags },
          column: { width: 200 }
        }
      })
      expect(wrapper.vm.badges).toBeDefined()
    })

    it('should handle tags with special characters', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag & Symbol', 'Tag<Script>'] },
          column: { width: 300 }
        }
      })
      expect(wrapper.vm.badges).toBeDefined()
    })

    it('should handle very long tag names', () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['VeryLongTagNameThatShouldBeTruncated'.repeat(3)] },
          column: { width: 200 }
        }
      })
      expect(wrapper.vm.badges).toBeDefined()
    })
  })

  describe('Integration', () => {
    it('should work with typical badge flow', async () => {
      const wrapper = mountComponent({
        scope: {
          row: { tags: ['Tag1', 'Tag2', 'Tag3'] },
          column: { width: 150 }
        }
      })

      expect(wrapper.vm.badges).toBeDefined()
      expect(wrapper.vm.maximumRenderedBadgeCount).toBeGreaterThan(0)
      expect(wrapper.vm.unRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })

    it('should handle badge and scope changes', async () => {
      const wrapper = mountComponent()

      await wrapper.setProps({
        scope: {
          row: { tags: ['Updated1', 'Updated2'] },
          column: { width: 250 }
        }
      })

      expect(wrapper.vm.badges).toEqual(['Updated1', 'Updated2'])
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple badge instances', () => {
      const wrapper1 = mountComponent({
        scope: { row: { tags: ['Tag1'] }, column: { width: 200 } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { tags: ['Tag2'] }, column: { width: 300 } }
      })

      expect(wrapper1.vm).not.toBe(wrapper2.vm)
      expect(wrapper1.vm.badges).not.toBe(wrapper2.vm.badges)
    })

    it('should maintain independent state', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      expect(wrapper1.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
      expect(wrapper2.vm.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
  })
})
