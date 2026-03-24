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

  describe('Blacklist Skeleton Loading', () => {
    it('isSkeletonLoading true when value is loading and badgeColorMap has loading key', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'loading' } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          badgeColorMap: { loading: '#bdbdbd', clean: '#217124' }
        }
      })
      expect(wrapper.vm.isSkeletonLoading).toBe(true)
    })

    it('isSkeletonLoading false when no badgeColorMap', () => {
      const wrapper = createWrapper({
        scope: { row: { status: 'loading' } },
        col: { property: 'status', type: 'status' }
      })
      expect(wrapper.vm.isSkeletonLoading).toBeFalsy()
    })

    it('isSkeletonLoading false when value is not loading', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'clean' } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          badgeColorMap: { loading: '#bdbdbd', clean: '#217124' }
        }
      })
      expect(wrapper.vm.isSkeletonLoading).toBe(false)
    })

    it('uses badgeColorMap for custom blacklist colors', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'malicious' } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          badgeColorMap: { malicious: '#b83a3a', clean: '#217124' }
        }
      })
      expect(wrapper.vm.getBadgeColor('malicious')).toBe('#b83a3a')
      expect(wrapper.vm.getBadgeColor('clean')).toBe('#217124')
    })

    it('falls back to getBtnStatusColor when status not in badgeColorMap', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'unknown-val' } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          badgeColorMap: { clean: '#217124' }
        }
      })
      expect(wrapper.vm.getBadgeColor('unknown-val')).toBe('#1173C1')
    })

    it('shows tooltip from blacklistDetail via tooltipKey', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'malicious', blacklistDetail: 'Blocked by 3 vendors' } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          tooltipKey: 'blacklistDetail',
          badgeColorMap: { malicious: '#b83a3a' }
        }
      })
      expect(wrapper.vm.shouldRenderTooltip).toBe(true)
      expect(wrapper.vm.getStatusTooltipText('malicious')).toBe('Blocked by 3 vendors')
    })

    it('no tooltip when blacklistDetail is null (clean domain)', () => {
      const wrapper = createWrapper({
        scope: { row: { blacklistStatus: 'clean', blacklistDetail: null } },
        col: {
          property: 'blacklistStatus',
          type: 'status',
          tooltipKey: 'blacklistDetail',
          badgeColorMap: { clean: '#217124' }
        }
      })
      expect(wrapper.vm.shouldRenderTooltip).toBe(false)
    })
  })
})
