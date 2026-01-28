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
})
