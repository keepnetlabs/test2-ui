import { shallowMount } from '@vue/test-utils'
import DataTableStatus from '@/components/DataTableComponents/DataTableStatus.vue'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#1173C1'),
  getDataTableFieldLabel: jest.fn((v) => v || ''),
  getInvestigationStatusTooltipText: jest.fn(() => 'Tooltip text')
}))

describe('DataTableStatus.vue', () => {
  const defaultScope = { row: { status: 'Active' } }
  const defaultCol = { property: 'status', type: 'status', emptyText: '-' }

  const createWrapper = (propsData = {}) =>
    shallowMount(DataTableStatus, {
      propsData: {
        scope: { ...defaultScope },
        col: { ...defaultCol },
        ...propsData
      },
      stubs: { Badge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('shouldRenderBadge truthy when row has property value', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.shouldRenderBadge).toBeTruthy()
  })

  it('shouldRenderBadge truthy when row has difficultyName', () => {
    const wrapper = createWrapper({
      scope: { row: { difficultyName: 'Easy' } },
      col: { property: 'x', type: 'status' }
    })
    expect(wrapper.vm.shouldRenderBadge).toBeTruthy()
  })

  it('shouldRenderBadge falsy when row empty', () => {
    const wrapper = createWrapper({
      scope: { row: {} },
      col: { property: 'status', type: 'status' }
    })
    expect(wrapper.vm.shouldRenderBadge).toBeFalsy()
  })

  it('getStatusTooltipText uses tooltipKey when col has it', () => {
    const wrapper = createWrapper({
      scope: { row: { status: 'Active', tooltip: 'Custom tooltip' } },
      col: { property: 'status', type: 'status', tooltipKey: 'tooltip' }
    })
    expect(wrapper.vm.getStatusTooltipText('Active')).toBe('Custom tooltip')
  })

  it('getStatusTooltipText uses getInvestigationStatusTooltipText when no tooltipKey', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusTooltipText('Active')).toBe('Tooltip text')
  })
})
