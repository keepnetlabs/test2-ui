import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerItemRowActions from '@/components/CampaignManager/CampaignManagerItemRowActions'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'mock123')
}))

describe('CampaignManagerItemRowActions.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    rowActions: [
      { name: 'Send', id: 'btn-send', icon: 'mdi-send', action: 'on-send' },
      { name: 'Edit', id: 'btn-edit', icon: 'mdi-pencil', action: 'on-edit' }
    ],
    scope: {
      row: {
        status: ACTION_STATUSES.IDLE,
        instanceGroup: 'group1'
      },
      $index: 0
    },
    campaignResourceId: 'campaign123',
    type: SCENARIO_TYPES.PHISHING
  }

  const mountComponent = (propsData = {}, mocks = {}) => {
    return shallowMount(CampaignManagerItemRowActions, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mocks: {
        $router: {
          push: jest.fn()
        },
        ...mocks
      },
      computed: {
        getCampaignReportsDeletePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerItemRowActions')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should have div wrapper for buttons', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should be able to find main div element', () => {
      const wrapper = mountComponent()
      expect(wrapper.element).toBeDefined()
    })
  })

  describe('Props', () => {
    it('should accept rowActions prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.rowActions).toBeDefined()
    })

    it('should accept scope prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope).toBeDefined()
    })

    it('should accept campaignResourceId prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.campaignResourceId).toBe('campaign123')
    })

    it('should accept type prop with default value', () => {
      const wrapper = mountComponent({ type: undefined })
      expect(wrapper.vm.type).toBeDefined()
    })

    it('type prop should default to SCENARIO_TYPES.PHISHING', () => {
      const wrapper = shallowMount(CampaignManagerItemRowActions, {
        localVue,
        propsData: {
          rowActions: defaultProps.rowActions,
          scope: defaultProps.scope,
          campaignResourceId: 'test'
        },
        stubs: {
          VTooltip: true,
          VBtn: true,
          VIcon: true,
          VMenu: true
        }
      })
      expect(wrapper.vm.type).toBe(SCENARIO_TYPES.PHISHING)
    })
  })

  describe('Data Properties', () => {
    it('should initialize labels in data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('labels should include Delete label', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labels.Delete).toBeDefined()
    })

    it('labels should include Launch label', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labels.Launch).toBeDefined()
    })
  })

  describe('Computed Properties - isMenuRender', () => {
    it('should be false when status is COMPLETE', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.COMPLETE } }
      })
      expect(wrapper.vm.isMenuRender).toBe(false)
    })

    it('should be false when status is IDLE', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      expect(wrapper.vm.isMenuRender).toBe(false)
    })

    it('should be false when status is DELETE', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.DELETE } }
      })
      expect(wrapper.vm.isMenuRender).toBe(false)
    })

    it('should be false when status is CANCEL', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.CANCEL } }
      })
      expect(wrapper.vm.isMenuRender).toBe(false)
    })

    it('should be true when status is RUNNING', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.isMenuRender).toBe(true)
    })

    it('should be true when status is ERROR', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.ERROR } }
      })
      expect(wrapper.vm.isMenuRender).toBe(true)
    })

    it('should be true when status is SCHEDULED', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.SCHEDULED } }
      })
      expect(wrapper.vm.isMenuRender).toBe(true)
    })
  })

  describe('Computed Properties - actionStatus', () => {
    it('should return the status from scope.row', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
    })

    it('should update when scope.row.status changes', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.IDLE)

      await wrapper.setProps({
        scope: { row: { status: ACTION_STATUSES.COMPLETE } }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.COMPLETE)
    })
  })

  describe('Computed Properties - getIconName', () => {
    it('should return mdi-text-box for COMPLETE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.COMPLETE } }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-text-box')
    })

    it('should return mdi-text-box for CANCEL status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.CANCEL } }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-text-box')
    })

    it('should return mdi-close for RUNNING status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-close')
    })

    it('should return mdi-send for IDLE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-send')
    })

    it('should return mdi-eye for other statuses', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.ERROR } }
      })
      expect(wrapper.vm.getIconName).toBe('mdi-eye')
    })
  })

  describe('Computed Properties - getTooltipText', () => {
    it('should return ViewReport for COMPLETE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.COMPLETE } }
      })
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.ViewReport)
    })

    it('should return ViewReport for CANCEL status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.CANCEL } }
      })
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.ViewReport)
    })

    it('should return Launch for IDLE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.Launch)
    })

    it('should return Delete for DELETE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.DELETE } }
      })
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.Delete)
    })

    it('should return Cancel text for RUNNING status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.getTooltipText).toBe('Cancel')
    })

    it('should return Preview for ERROR status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.ERROR } }
      })
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.Preview)
    })
  })

  describe('Computed Properties - getRowActions', () => {
    it('should return original rowActions when status is IDLE', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      expect(wrapper.vm.getRowActions).toEqual(defaultProps.rowActions)
    })

    it('should add ViewReport action when status is RUNNING', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.getRowActions[0].action).toBe('on-view-report')
      expect(wrapper.vm.getRowActions[0].icon).toBe('mdi-text-box')
    })

    it('should add ViewReport action when status is ERROR', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.ERROR } }
      })
      expect(wrapper.vm.getRowActions[0].action).toBe('on-view-report')
    })

    it('should not mutate original rowActions', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      const originalLength = defaultProps.rowActions.length
      wrapper.vm.getRowActions
      expect(defaultProps.rowActions.length).toBe(originalLength)
    })
  })

  describe('Computed Properties - getId', () => {
    it('should generate ID with view-report for COMPLETE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.COMPLETE } }
      })
      expect(wrapper.vm.getId).toContain('view-report')
    })

    it('should generate ID with cancel for RUNNING status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      expect(wrapper.vm.getId).toContain('cancel')
    })

    it('should generate ID with send for IDLE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      expect(wrapper.vm.getId).toContain('send')
    })

    it('should include btn- prefix in ID', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getId).toContain('btn-')
    })

    it('should include random string in ID', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getId).toContain('mock123')
    })
  })

  describe('Methods - handleItemClick', () => {
    it('should emit on-launch event for IDLE status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('should emit on-stop event for RUNNING status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
      expect(wrapper.emitted('on-stop')).toBeTruthy()
    })

    it('should emit on-preview event for SCHEDULED status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.SCHEDULED } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.SCHEDULED })
      expect(wrapper.emitted('on-preview')).toBeTruthy()
    })

    it('should emit on-preview event for ERROR status', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.ERROR } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.ERROR })
      expect(wrapper.emitted('on-preview')).toBeTruthy()
    })

    it('should navigate to Campaign Report for PHISHING type on view-report action', () => {
      const mockRouter = { push: jest.fn() }
      const wrapper = mountComponent({}, { $router: mockRouter })
      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Campaign Report'
        })
      )
    })

    it('should navigate to Quishing Report for QUISHING type on view-report action', () => {
      const mockRouter = { push: jest.fn() }
      const wrapper = mountComponent(
        { type: SCENARIO_TYPES.QUISHING },
        { $router: mockRouter }
      )
      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Quishing Report'
        })
      )
    })

    it('should pass correct params to router on view-report', () => {
      const mockRouter = { push: jest.fn() }
      const wrapper = mountComponent({}, { $router: mockRouter })
      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            id: 'campaign123',
            instanceGroup: 'group1'
          })
        })
      )
    })

    it('should emit event with scope.row data', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE, data: 'test' } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      const emitted = wrapper.emitted('on-launch')[0][0]
      expect(emitted.data).toBe('test')
    })
  })

  describe('Event Emission', () => {
    it('should emit events for different actions', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.SCHEDULED } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.SCHEDULED })
      expect(wrapper.emitted('on-preview')).toBeTruthy()
    })

    it('should emit multiple events for multiple clicks', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toHaveLength(2)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        campaignResourceId: 'campaign1'
      })
      const wrapper2 = mountComponent({
        campaignResourceId: 'campaign2'
      })

      expect(wrapper1.vm.campaignResourceId).toBe('campaign1')
      expect(wrapper2.vm.campaignResourceId).toBe('campaign2')
    })

    it('multiple instances should emit independently', () => {
      const wrapper1 = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })

      wrapper1.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      wrapper2.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })

      expect(wrapper1.emitted('on-launch')).toHaveLength(1)
      expect(wrapper2.emitted('on-stop')).toHaveLength(1)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow for campaign launch', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.IDLE } }
      })

      expect(wrapper.vm.getIconName).toBe('mdi-send')
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.Launch)

      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('complete workflow for campaign cancellation', () => {
      const wrapper = mountComponent({
        scope: { row: { status: ACTION_STATUSES.RUNNING } }
      })

      expect(wrapper.vm.getIconName).toBe('mdi-close')
      expect(wrapper.vm.getTooltipText).toBe('Cancel')

      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.RUNNING })
      expect(wrapper.emitted('on-stop')).toBeTruthy()
    })

    it('complete workflow for viewing report', () => {
      const mockRouter = { push: jest.fn() }
      const wrapper = mountComponent(
        { scope: { row: { status: ACTION_STATUSES.COMPLETE } } },
        { $router: mockRouter }
      )

      expect(wrapper.vm.getIconName).toBe('mdi-text-box')
      expect(wrapper.vm.getTooltipText).toBe(wrapper.vm.labels.ViewReport)

      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(mockRouter.push).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined scope.row.instanceGroup', () => {
      const mockRouter = { push: jest.fn() }
      const wrapper = mountComponent(
        { scope: { row: { status: ACTION_STATUSES.IDLE } } },
        { $router: mockRouter }
      )
      wrapper.vm.handleItemClick({ action: 'on-view-report' })
      expect(mockRouter.push).toHaveBeenCalled()
    })

    it('should handle empty rowActions array', () => {
      const wrapper = mountComponent({
        rowActions: []
      })
      expect(wrapper.vm.getRowActions).toEqual([])
    })

    it('should handle actions with missing properties', () => {
      const wrapper = mountComponent({
        rowActions: [{ name: 'Test' }]
      })
      expect(wrapper.vm.getRowActions).toBeDefined()
    })

    it('should handle rapid status changes', async () => {
      const wrapper = mountComponent()
      const statuses = [
        ACTION_STATUSES.IDLE,
        ACTION_STATUSES.RUNNING,
        ACTION_STATUSES.COMPLETE,
        ACTION_STATUSES.ERROR
      ]
      for (const status of statuses) {
        await wrapper.setProps({
          scope: { row: { status } }
        })
      }
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('handleItemClick should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleItemClick({ action: 'test-action' })
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })

    it('computed properties should be efficient', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        // Access multiple computed properties
        const a = wrapper.vm.isMenuRender
        const b = wrapper.vm.getId
        const c = wrapper.vm.actionStatus
        const d = wrapper.vm.getIconName
        const e = wrapper.vm.getTooltipText
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })
  })
})
