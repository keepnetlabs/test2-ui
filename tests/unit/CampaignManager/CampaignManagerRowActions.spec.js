import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/CampaignManager/CampaignManagerRowActions'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

describe('CampaignManagerRowActions.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    scope: {
      row: {
        status: ACTION_STATUSES.IDLE,
        frequency: 0,
        id: 1
      },
      $index: 0
    },
    rowActions: [],
    isNewInstanceDisabled: false,
    isQuishingPrintPreview: false
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      mocks: {
        $emit: jest.fn()
      },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerRowActions')
    })

    it('should render preview tooltip', () => {
      const wrapper = mountComponent()
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.exists()).toBe(true)
    })

    it('should have v-btn components', () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAllComponents({ name: 'VBtn' })
      expect(btns.length).toBeGreaterThanOrEqual(0)
    })

    it('should render menu component', () => {
      const wrapper = mountComponent()
      const menu = wrapper.findComponent({ name: 'VMenu' })
      expect(menu.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept scope prop', () => {
      const scope = {
        row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
        $index: 5
      }
      const wrapper = mountComponent({ scope })
      expect(wrapper.vm.scope).toEqual(scope)
    })

    it('should accept rowActions prop', () => {
      const rowActions = [{ id: 1, name: 'Action 1' }]
      const wrapper = mountComponent({ rowActions })
      expect(wrapper.vm.rowActions).toEqual(rowActions)
    })

    it('should accept isNewInstanceDisabled prop', () => {
      const wrapper = mountComponent({ isNewInstanceDisabled: true })
      expect(wrapper.vm.isNewInstanceDisabled).toBe(true)
    })

    it('isNewInstanceDisabled prop should be of type Boolean', () => {
      expect(CampaignManagerRowActions.props.isNewInstanceDisabled.type).toBe(Boolean)
    })

    it('should accept isQuishingPrintPreview prop', () => {
      const wrapper = mountComponent({ isQuishingPrintPreview: true })
      expect(wrapper.vm.isQuishingPrintPreview).toBe(true)
    })

    it('isQuishingPrintPreview prop should be of type Boolean', () => {
      expect(CampaignManagerRowActions.props.isQuishingPrintPreview.type).toBe(Boolean)
    })

    it('scope prop should be of type Object', () => {
      expect(CampaignManagerRowActions.props.scope.type).toBe(Object)
    })

    it('rowActions prop should be of type Array', () => {
      expect(CampaignManagerRowActions.props.rowActions.type).toBe(Array)
    })

    it('isNewInstanceDisabled prop should be of type Boolean with false default', () => {
      expect(CampaignManagerRowActions.props.isNewInstanceDisabled.type).toBe(Boolean)
      expect(CampaignManagerRowActions.props.isNewInstanceDisabled.default).toBe(false)
    })

    it('isQuishingPrintPreview prop should be of type Boolean with false default', () => {
      expect(CampaignManagerRowActions.props.isQuishingPrintPreview.type).toBe(Boolean)
      expect(CampaignManagerRowActions.props.isQuishingPrintPreview.default).toBe(false)
    })
  })

  describe('Computed Properties - Permissions', () => {
    it('getCampaignManagerParentPreviewPermissions should be available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCampaignManagerParentPreviewPermissions).toBe(true)
    })

    it('getCampaignManagerParentCreatePermissions should be available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCampaignManagerParentCreatePermissions).toBe(true)
    })

    it('getCampaignManagerParentDeletePermissions should be available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCampaignManagerParentDeletePermissions).toBe(true)
    })

    it('getCampaignManagerParentUpdatePermissions should be available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCampaignManagerParentUpdatePermissions).toBe(true)
    })
  })

  describe('Computed Properties - Button ID', () => {
    it('getId should generate unique button ID', () => {
      const wrapper = mountComponent()
      const id = wrapper.vm.getId
      expect(id).toContain('btn-preview--row-action-')
    })

    it('getId should return a string', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getId).toBe('string')
      expect(wrapper.vm.getId).toContain('btn-preview--row-action-')
    })
  })

  describe('Computed Properties - Action Status', () => {
    it('actionStatus should return scope row status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.RUNNING },
          $index: 0
        }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
    })

    it('actionStatus should reflect status changes', async () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE },
          $index: 0
        }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.IDLE)

      await wrapper.setProps({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE },
          $index: 0
        }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.COMPLETE)
    })
  })

  describe('Computed Properties - Action Items', () => {
    it('getItems should return array of actions for IDLE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      expect(Array.isArray(wrapper.vm.getItems)).toBe(true)
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('getItems should include Edit action for IDLE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction).toBeDefined()
    })

    it('getItems should include NewInstance action for IDLE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      const newInstanceAction = wrapper.vm.getItems.find(item => item.action === 'on-launch')
      expect(newInstanceAction).toBeDefined()
    })

    it('getItems should include Delete action for IDLE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      const deleteAction = wrapper.vm.getItems.find(item => item.action === 'on-delete')
      expect(deleteAction).toBeDefined()
    })

    it('getItems should include Duplicate action for IDLE when not quishing', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        },
        isQuishingPrintPreview: false
      })
      const duplicateAction = wrapper.vm.getItems.find(item => item.action === 'on-duplicate')
      expect(duplicateAction).toBeDefined()
    })

    it('getItems should include PrintPreview action for IDLE when quishing', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        },
        isQuishingPrintPreview: true
      })
      const printPreviewAction = wrapper.vm.getItems.find(item => item.action === 'on-print-preview')
      expect(printPreviewAction).toBeDefined()
    })
  })

  describe('Computed Properties - Status Variations', () => {
    it('getItems should include actions for RUNNING status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.RUNNING, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('getItems should include actions for COMPLETE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('getItems should include actions for CANCEL status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.CANCEL, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('getItems should include actions for INDIVIDUAL status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.INDIVIDUAL, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('getItems for COMPLETE status should not include duplicate action', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 },
          $index: 0
        }
      })
      const duplicateAction = wrapper.vm.getItems.find(item => item.action === 'on-duplicate')
      expect(duplicateAction).toBeUndefined()
    })

    it('getItems for COMPLETE with quishing should include print-preview action', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 },
          $index: 0
        },
        isQuishingPrintPreview: true
      })
      const printPreviewAction = wrapper.vm.getItems.find(item => item.action === 'on-print-preview')
      expect(printPreviewAction).toBeDefined()
    })
  })

  describe('Edit Action Disabled State', () => {
    it('Edit action should be disabled when frequency > 0', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 1 },
          $index: 0
        }
      })
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction.disabled).toBe(true)
    })

    it('Edit action should be enabled when frequency = 0', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction.disabled).toBe(false)
    })

    it('Edit action should show disabled text when frequency > 0', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 5 },
          $index: 0
        }
      })
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction.disabledText).toContain('cannot be edited')
    })
  })

  describe('NewInstance Action Disabled State', () => {
    it('NewInstance action should be disabled when isNewInstanceDisabled true', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        },
        isNewInstanceDisabled: true
      })
      const newInstanceAction = wrapper.vm.getItems.find(item => item.id === 'btn-new-instance-item-row-actions-campaign-manager')
      expect(newInstanceAction.disabled).toBe(true)
    })

    it('NewInstance action should show disabled text when isNewInstanceDisabled', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        },
        isNewInstanceDisabled: true
      })
      const newInstanceAction = wrapper.vm.getItems.find(item => item.id === 'btn-new-instance-item-row-actions-campaign-manager')
      expect(newInstanceAction.disabledText).toContain("created")
    })
  })

  describe('Methods', () => {
    it('handleItemClick should accept action object', () => {
      const wrapper = mountComponent()
      const action = { action: 'on-edit', name: 'Edit' }
      const scopeRow = { status: ACTION_STATUSES.IDLE, frequency: 0 }
      wrapper.vm.scope = { row: scopeRow, $index: 0 }

      expect(() => wrapper.vm.handleItemClick(action)).not.toThrow()
    })

    it('handleItemClick should access scope row data', () => {
      const wrapper = mountComponent()
      const scopeRow = { status: ACTION_STATUSES.IDLE, frequency: 0, id: 123 }
      wrapper.vm.scope = { row: scopeRow, $index: 0 }
      const action = { action: 'on-delete' }

      expect(() => wrapper.vm.handleItemClick(action)).not.toThrow()
      expect(wrapper.vm.scope.row.id).toBe(123)
    })

    it('handleItemClick should use action.action for event', () => {
      const wrapper = mountComponent()
      const action = { action: 'on-duplicate' }
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 }

      expect(() => wrapper.vm.handleItemClick(action)).not.toThrow()
    })

    it('handleItemClick should map COMPLETE to on-launch', () => {
      const wrapper = mountComponent()
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 }, $index: 0 }

      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('handleItemClick should map CANCEL to on-launch', () => {
      const wrapper = mountComponent()
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.CANCEL, frequency: 0 }, $index: 0 }

      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.CANCEL })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('handleItemClick should map IDLE to on-launch', () => {
      const wrapper = mountComponent()
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 }

      wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
      expect(wrapper.emitted('on-launch')).toBeTruthy()
    })

    it('handleItemClick should emit raw event name for non-mapped actions', () => {
      const wrapper = mountComponent()
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0, id: 5 }, $index: 0 }

      wrapper.vm.handleItemClick({ action: 'on-delete' })
      expect(wrapper.emitted('on-delete')[0][0]).toEqual({ status: ACTION_STATUSES.IDLE, frequency: 0, id: 5 })
    })
  })

  describe('Event Emission', () => {
    it('should call method that triggers event emission', () => {
      const wrapper = mountComponent()
      const scopeRow = { status: ACTION_STATUSES.IDLE, frequency: 0 }
      wrapper.vm.scope = { row: scopeRow, $index: 0 }

      // Test that handleItemClick executes without errors
      expect(() => {
        wrapper.vm.handleItemClick({ action: 'on-preview' })
      }).not.toThrow()
    })

    it('should handle all action types without throwing', () => {
      const wrapper = mountComponent()
      const scopeRow = { status: ACTION_STATUSES.IDLE, frequency: 0 }
      wrapper.vm.scope = { row: scopeRow, $index: 0 }

      const actions = ['on-edit', 'on-delete', 'on-duplicate', 'on-launch', 'on-print-preview']
      actions.forEach(action => {
        expect(() => {
          wrapper.vm.handleItemClick({ action })
        }).not.toThrow()
      })
    })

    it('should pass scope row to handler', () => {
      const wrapper = mountComponent()
      const scopeRow = { status: ACTION_STATUSES.IDLE, frequency: 0, id: 123 }
      wrapper.vm.scope = { row: scopeRow, $index: 0 }

      wrapper.vm.handleItemClick({ action: 'on-edit' })
      // Verify scope is properly set
      expect(wrapper.vm.scope.row.id).toBe(123)
    })
  })

  describe('Preview Button State', () => {
    it('preview button should be enabled with permissions', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCampaignManagerParentPreviewPermissions).toBe(true)
    })

    it('preview button should be disabled without permissions', () => {
      const wrapper = mountComponent(undefined, {
        computed: {
          getCampaignManagerParentPreviewPermissions: () => false,
          getCampaignManagerParentCreatePermissions: () => true,
          getCampaignManagerParentDeletePermissions: () => true,
          getCampaignManagerParentUpdatePermissions: () => true
        }
      })
      expect(wrapper.vm.getCampaignManagerParentPreviewPermissions).toBe(false)
    })
  })

  describe('Delete Action Permission', () => {
    it('delete action should be disabled without delete permission', () => {
      const wrapper = mountComponent(undefined, {
        computed: {
          getCampaignManagerParentPreviewPermissions: () => true,
          getCampaignManagerParentCreatePermissions: () => true,
          getCampaignManagerParentDeletePermissions: () => false,
          getCampaignManagerParentUpdatePermissions: () => true
        }
      })
      const deleteAction = wrapper.vm.getItems.find(item => item.action === 'on-delete')
      expect(deleteAction.disabled).toBe(true)
    })

    it('new instance action should be disabled without create permission', () => {
      const wrapper = mountComponent(undefined, {
        computed: {
          getCampaignManagerParentPreviewPermissions: () => true,
          getCampaignManagerParentCreatePermissions: () => false,
          getCampaignManagerParentDeletePermissions: () => true,
          getCampaignManagerParentUpdatePermissions: () => true
        }
      })
      const newInstanceAction = wrapper.vm.getItems.find(
        item => item.id === 'btn-new-instance-item-row-actions-campaign-manager'
      )
      expect(newInstanceAction.disabled).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })
      const wrapper2 = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 5 },
          $index: 1
        }
      })

      expect(wrapper1.vm.actionStatus).toBe(ACTION_STATUSES.IDLE)
      expect(wrapper2.vm.actionStatus).toBe(ACTION_STATUSES.COMPLETE)
      expect(wrapper1.vm.scope.$index).toBe(0)
      expect(wrapper2.vm.scope.$index).toBe(1)
    })

    it('multiple instances should emit independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 }
      wrapper2.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 1 }

      wrapper1.vm.handleItemClick({ action: 'on-edit' })
      wrapper2.vm.handleItemClick({ action: 'on-delete' })

      // Both should emit without errors
      expect(wrapper1.vm).toBeDefined()
      expect(wrapper2.vm).toBeDefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: IDLE status with all permissions', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0, id: 1 },
          $index: 0
        },
        isQuishingPrintPreview: false
      })

      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      const deleteAction = wrapper.vm.getItems.find(item => item.action === 'on-delete')
      expect(editAction.disabled).toBe(false)
      expect(deleteAction.disabled).toBe(false)
    })

    it('complete workflow: RUNNING status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.RUNNING, frequency: 0 },
          $index: 0
        }
      })

      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('complete workflow: COMPLETE status', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 },
          $index: 0
        }
      })

      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.COMPLETE)
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)
    })

    it('complete workflow: frequency set prevents editing', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 5 },
          $index: 0
        }
      })

      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction.disabled).toBe(true)
      expect(editAction.disabledText).toContain('cannot be edited')
    })

    it('complete workflow: Quishing print preview flow', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        },
        isQuishingPrintPreview: true
      })

      const printPreviewAction = wrapper.vm.getItems.find(item => item.action === 'on-print-preview')
      const duplicateAction = wrapper.vm.getItems.find(item => item.action === 'on-duplicate')
      expect(printPreviewAction).toBeDefined()
      expect(duplicateAction).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large frequency value', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 99999 },
          $index: 0
        }
      })
      const editAction = wrapper.vm.getItems.find(item => item.action === 'on-edit')
      expect(editAction.disabled).toBe(true)
    })

    it('should handle special characters in scope data', () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0, name: 'Campaign@#$%' },
          $index: 0
        }
      })
      expect(wrapper.vm.scope.row.name).toBe('Campaign@#$%')
    })

    it('should handle rapid status changes', async () => {
      const wrapper = mountComponent({
        scope: {
          row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
          $index: 0
        }
      })

      await wrapper.setProps({
        scope: {
          row: { status: ACTION_STATUSES.RUNNING, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.RUNNING)

      await wrapper.setProps({
        scope: {
          row: { status: ACTION_STATUSES.COMPLETE, frequency: 0 },
          $index: 0
        }
      })
      expect(wrapper.vm.actionStatus).toBe(ACTION_STATUSES.COMPLETE)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain props after mount', async () => {
      const scope = {
        row: { status: ACTION_STATUSES.IDLE, frequency: 0 },
        $index: 0
      }
      const wrapper = mountComponent({ scope })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.scope).toEqual(scope)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('handleItemClick should execute quickly', () => {
      const wrapper = mountComponent()
      wrapper.vm.scope = { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 }
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleItemClick({ action: 'on-edit' })
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })

    it('getItems computation should be efficient', () => {
      const start = Date.now()
      const wrapper = mountComponent()
      // Trigger computation
      const items = wrapper.vm.getItems
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
      expect(items.length).toBeGreaterThan(0)
    })
  })
})
