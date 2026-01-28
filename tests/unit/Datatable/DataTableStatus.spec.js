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
    expect(wrapper.vm.shouldRenderBadge).toBe(true)
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
      scope: { row: { status: null } }
    })

    expect(wrapper.vm.shouldRenderBadge).toBe(false)
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
})
