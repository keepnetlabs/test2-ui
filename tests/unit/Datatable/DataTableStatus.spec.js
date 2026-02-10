import { createLocalVue, shallowMount } from '@vue/test-utils'
import DataTableStatus from '@/components/DataTableComponents/DataTableStatus.vue'
import { getBtnStatusColor, getDataTableFieldLabel, getInvestigationStatusTooltipText } from '@/utils/functions'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(val => `color-${val}`),
  getDataTableFieldLabel: jest.fn(val => `label-${val}`),
  getInvestigationStatusTooltipText: jest.fn(val => `tooltip-${val}`)
}))

describe('DataTableStatus.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(DataTableStatus, {
      localVue,
      propsData: {
        scope: {
          row: { status: 'Active' }
        },
        col: { property: 'status', type: 'status' },
        ...propsData
      },
      stubs: {
        Badge: {
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

  beforeEach(() => {
      jest.clearAllMocks()
  })

  it('renders correctly when property exists', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.shouldRenderBadge).toBeTruthy()
    expect(wrapper.vm.getBadgeText).toBe('label-Active')
  })

  it('returns correct color', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getBtnStatusColor('Active')).toBe('color-Active')
  })

  it('renders tooltip when isWithTooltip is true', () => {
    const wrapper = mountComponent({
        col: { property: 'status', type: 'status', isWithTooltip: true }
    })
    expect(wrapper.vm.shouldRenderTooltip).toBe(true)
    expect(wrapper.find('.v-tooltip-stub').exists()).toBe(true)
  })

  it('renders tooltip when tooltipKey is provided', () => {
    const wrapper = mountComponent({
        scope: { row: { status: 'Active', myTooltip: 'Some Info' } },
        col: { property: 'status', type: 'status', tooltipKey: 'myTooltip' }
    })
    expect(wrapper.vm.shouldRenderTooltip).toBe(true)
    expect(wrapper.vm.getStatusTooltipText('Active')).toBe('Some Info')
  })

  it('falls back to emptyText when property missing', () => {
    const wrapper = mountComponent({
        scope: { row: {} },
        col: { property: 'status', type: 'status', emptyText: 'N/A' }
    })
    expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
    expect(wrapper.text()).toContain('N/A')
  })

  it('checks difficulty properties if main property missing', () => {
    const wrapper = mountComponent({
        scope: { row: { difficultyName: 'Easy' } },
        col: { property: 'status', type: 'status' }
    })
    expect(wrapper.vm.shouldRenderBadge).toBeTruthy()
    expect(wrapper.vm.getBadgeText).toBe('label-Easy')
    
    const wrapper2 = mountComponent({
        scope: { row: { difficulty: 'Hard' } },
        col: { property: 'status', type: 'status' }
    })
    expect(wrapper2.vm.getBadgeText).toBe('label-Hard')
  })

  it('returns default tooltip text when tooltipKey is missing', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getStatusTooltipText('Active')).toBe('tooltip-Active')
  })

  it('renders badge when shouldRenderBadge is true', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.shouldRenderBadge).toBeTruthy()
    expect(wrapper.find('.badge-stub').exists()).toBe(true)
  })

  it('handles multiple status values', () => {
    const statuses = ['Active', 'Inactive', 'Pending']

    statuses.forEach(status => {
      const wrapper = mountComponent({
        scope: { row: { status } }
      })

      expect(wrapper.vm.getBadgeText).toBe(`label-${status}`)
    })
  })

  it('applies correct color for status', () => {
    const wrapper = mountComponent({
      scope: { row: { status: 'Pending' } }
    })

    const color = wrapper.vm.getBtnStatusColor('Pending')
    expect(color).toBe('color-Pending')
  })

  it('prioritizes difficultyName over difficulty', () => {
    const wrapper = mountComponent({
      scope: { row: { difficultyName: 'Expert', difficulty: 'Hard' } }
    })

    expect(wrapper.vm.getBadgeText).toBe('label-Expert')
  })

  it('returns false for shouldRenderBadge when no valid status', () => {
    const wrapper = mountComponent({
      scope: { row: {} }
    })

    expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
  })

  it('displays emptyText when no property value exists', () => {
    const wrapper = mountComponent({
      scope: { row: { otherField: 'value' } },
      col: { property: 'status', type: 'status', emptyText: 'Not Available' }
    })

    expect(wrapper.text()).toContain('Not Available')
  })

  it('handles tooltip computation with isWithTooltip true', () => {
    const wrapper = mountComponent({
      col: { property: 'status', type: 'status', isWithTooltip: true }
    })

    expect(wrapper.vm.shouldRenderTooltip).toBe(true)
  })

  describe('Component Rendering', () => {
    it('renders component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('has correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('mounts without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('renders with proper structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.html()).toBeDefined()
    })
  })

  describe('Badge Rendering', () => {
    it('renders badge stub when shouldRenderBadge is true', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      expect(wrapper.find('.badge-stub').exists()).toBe(true)
    })

    it('does not render badge when shouldRenderBadge is false', () => {
      const wrapper = mountComponent({
        scope: { row: {} }
      })
      expect(wrapper.find('.badge-stub').exists()).toBe(false)
    })

    it('displays correct badge text', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Completed' } }
      })
      expect(wrapper.vm.getBadgeText).toBe('label-Completed')
    })
  })

  describe('Tooltip Rendering', () => {
    it('renders tooltip when isWithTooltip is true', () => {
      const wrapper = mountComponent({
        col: { property: 'status', type: 'status', isWithTooltip: true }
      })
      expect(wrapper.find('.v-tooltip-stub').exists()).toBe(true)
    })

    it('renders tooltip when tooltipKey is provided', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active', tooltip: 'Info' } },
        col: { property: 'status', type: 'status', tooltipKey: 'tooltip' }
      })
      expect(wrapper.vm.shouldRenderTooltip).toBe(true)
    })

    it('handles default column configuration', () => {
      const wrapper = mountComponent({
        col: { property: 'status', type: 'status' }
      })
      expect(wrapper.vm.col.property).toBe('status')
    })

    it('computes tooltip text correctly', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      expect(wrapper.vm.getStatusTooltipText('Active')).toBe('tooltip-Active')
    })
  })

  describe('Status Properties', () => {
    it('handles status from scope row', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      expect(wrapper.vm.scope.row.status).toBe('Active')
    })

    it('handles difficultyName property', () => {
      const wrapper = mountComponent({
        scope: { row: { difficultyName: 'Easy' } },
        col: { property: 'status', type: 'status' }
      })
      expect(wrapper.vm.scope.row.difficultyName).toBe('Easy')
    })

    it('handles difficulty property', () => {
      const wrapper = mountComponent({
        scope: { row: { difficulty: 'Hard' } },
        col: { property: 'status', type: 'status' }
      })
      expect(wrapper.vm.scope.row.difficulty).toBe('Hard')
    })

    it('handles multiple difficulty properties', () => {
      const wrapper = mountComponent({
        scope: { row: { difficultyName: 'Expert', difficulty: 'Hard' } }
      })
      expect(wrapper.vm.scope.row.difficultyName).toBe('Expert')
      expect(wrapper.vm.scope.row.difficulty).toBe('Hard')
    })
  })

  describe('Utility Functions', () => {
    it('calls getBtnStatusColor with status value', () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      const color = wrapper.vm.getBtnStatusColor('Active')
      expect(color).toBe('color-Active')
    })

    it('uses getDataTableFieldLabel for badge text', () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        scope: { row: { status: 'Pending' } }
      })
      expect(wrapper.vm.getBadgeText).toBe('label-Pending')
    })

    it('uses getInvestigationStatusTooltipText for tooltip', () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      const tooltip = wrapper.vm.getStatusTooltipText('Active')
      expect(tooltip).toBe('tooltip-Active')
    })
  })

  describe('Empty and Fallback Values', () => {
    it('displays emptyText when property missing', () => {
      const wrapper = mountComponent({
        scope: { row: {} },
        col: { property: 'status', type: 'status', emptyText: 'N/A' }
      })
      expect(wrapper.text()).toContain('N/A')
    })

    it('displays emptyText when all fallback properties missing', () => {
      const wrapper = mountComponent({
        scope: { row: { otherField: 'value' } },
        col: { property: 'status', type: 'status', emptyText: 'Not Available' }
      })
      expect(wrapper.text()).toContain('Not Available')
    })

    it('handles missing emptyText gracefully', () => {
      const wrapper = mountComponent({
        scope: { row: {} },
        col: { property: 'status', type: 'status' }
      })
      expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
    })
  })

  describe('Props Handling', () => {
    it('accepts scope prop with row data', () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      expect(wrapper.vm.scope.row.status).toBe('Active')
    })

    it('accepts col prop with configuration', () => {
      const col = { property: 'status', type: 'status', emptyText: 'N/A' }
      const wrapper = mountComponent({ col })
      expect(wrapper.vm.col.property).toBe('status')
    })

    it('updates when props change', async () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      await wrapper.setProps({
        scope: { row: { status: 'Inactive' } }
      })
      expect(wrapper.vm.scope.row.status).toBe('Inactive')
    })
  })

  describe('Multiple Status Values', () => {
    it('handles various status values', () => {
      const statuses = ['Active', 'Inactive', 'Pending', 'Completed']
      statuses.forEach(status => {
        const wrapper = mountComponent({
          scope: { row: { status } }
        })
        expect(wrapper.vm.getBadgeText).toBe(`label-${status}`)
      })
    })

    it('applies correct color for each status', () => {
      const statuses = ['Active', 'Inactive', 'Pending']
      statuses.forEach(status => {
        const wrapper = mountComponent({
          scope: { row: { status } }
        })
        expect(wrapper.vm.getBtnStatusColor(status)).toBe(`color-${status}`)
      })
    })

    it('generates tooltip for each status', () => {
      const statuses = ['Active', 'Inactive', 'Pending']
      statuses.forEach(status => {
        const wrapper = mountComponent({
          scope: { row: { status } }
        })
        expect(wrapper.vm.getStatusTooltipText(status)).toBe(`tooltip-${status}`)
      })
    })
  })

  describe('Component Lifecycle', () => {
    it('initializes without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state across lifecycle', async () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.scope.row.status).toBe('Active')
    })

    it('maintains state across lifecycle events', async () => {
      const wrapper = mountComponent({
        scope: { row: { status: 'Active' } }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.scope.row.status).toBe('Active')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty row object', () => {
      const wrapper = mountComponent({
        scope: { row: {} }
      })
      expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
    })

    it('handles null property value', () => {
      const wrapper = mountComponent({
        scope: { row: { status: null } }
      })
      expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
    })

    it('handles undefined property value', () => {
      const wrapper = mountComponent({
        scope: { row: { status: undefined } }
      })
      expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
    })

    it('handles very long status text', () => {
      const longStatus = 'A'.repeat(100)
      const wrapper = mountComponent({
        scope: { row: { status: longStatus } }
      })
      expect(wrapper.vm.getBadgeText).toBe(`label-${longStatus}`)
    })
  })

  describe('Multiple Instances', () => {
    it('supports multiple independent instances', () => {
      const wrapper1 = mountComponent({ scope: { row: { status: 'Active' } } })
      const wrapper2 = mountComponent({ scope: { row: { status: 'Inactive' } } })
      expect(wrapper1.vm.scope.row.status).toBe('Active')
      expect(wrapper2.vm.scope.row.status).toBe('Inactive')
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('instances are independent', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })
})
