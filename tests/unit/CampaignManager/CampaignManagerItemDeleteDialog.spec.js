import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'

describe('CampaignManagerItemDeleteDialog.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(CampaignManagerItemDeleteDialog, {
      localVue,
      propsData: {
        status: false,
        item: { id: '1', name: 'Test Item' },
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerItemDeleteDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AppDialogFooter in slot', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).exists()).toBe(true)
    })

    it('should display delete confirmation message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Instance will be deleted')
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should accept item prop', () => {
      const item = { id: '123', name: 'Test Campaign' }
      const wrapper = mountComponent({ item })
      expect(wrapper.vm.item).toEqual(item)
    })

    it('should accept isActionButtonDisabled prop', () => {
      const wrapper = mountComponent({ isActionButtonDisabled: true })
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })

    it('should pass status to AppDialog', () => {
      const wrapper = mountComponent({ status: true })
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('status')).toBe(true)
    })

    it('should pass isActionButtonDisabled to AppDialogFooter', () => {
      const wrapper = mountComponent({ isActionButtonDisabled: true })
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
    })
  })

  describe('Constants', () => {
    it('should have delete icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-delete')
    })

    it('should have delete title', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.title).toBe('Delete Campaign Instance?')
    })

    it('should have delete subtitle', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.subtitle).toContain('deleted')
    })

    it('should pass constants to AppDialog', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('icon')).toBe(wrapper.vm.CONSTANTS.icon)
      expect(appDialog.props('title')).toBe(wrapper.vm.CONSTANTS.title)
      expect(appDialog.props('subtitle')).toBe(wrapper.vm.CONSTANTS.subtitle)
    })
  })

  describe('Methods', () => {
    it('closeModal should emit on-close event', async () => {
      const wrapper = mountComponent()
      wrapper.vm.closeModal()
      expect(wrapper.emitted()['on-close']).toBeTruthy()
    })

    it('handleDelete should emit on-delete event with item', async () => {
      const item = { id: '456', name: 'Delete Me' }
      const wrapper = mountComponent({ item })
      wrapper.vm.handleDelete()
      expect(wrapper.emitted()['on-delete']).toBeTruthy()
      expect(wrapper.emitted()['on-delete'][0][0]).toEqual(item)
    })

    it('closeModal should emit exactly one event', async () => {
      const wrapper = mountComponent()
      wrapper.vm.closeModal()
      expect(wrapper.emitted()['on-close']).toHaveLength(1)
    })

    it('handleDelete should pass correct item data', async () => {
      const item = { id: '789', name: 'Campaign 1' }
      const wrapper = mountComponent({ item })
      wrapper.vm.handleDelete()
      const emitted = wrapper.emitted()['on-delete'][0][0]
      expect(emitted.id).toBe('789')
      expect(emitted.name).toBe('Campaign 1')
    })
  })

  describe('Event Emission', () => {
    it('changeStatus event from AppDialog should trigger closeModal', async () => {
      const wrapper = mountComponent({ status: true })
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      await appDialog.vm.$emit('changeStatus')
      expect(wrapper.emitted()['on-close']).toBeTruthy()
    })

    it('handleClose from AppDialogFooter should emit on-close', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      await footer.vm.$emit('handleClose')
      expect(wrapper.emitted()['on-close']).toBeTruthy()
    })

    it('handleConfirm from AppDialogFooter should emit on-delete', async () => {
      const item = { id: 'test-123' }
      const wrapper = mountComponent({ item })
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      await footer.vm.$emit('handleConfirm')
      expect(wrapper.emitted()['on-delete']).toBeTruthy()
    })

    it('should handle multiple close emissions', async () => {
      const wrapper = mountComponent()
      wrapper.vm.closeModal()
      wrapper.vm.closeModal()
      wrapper.vm.closeModal()
      expect(wrapper.emitted()['on-close']).toHaveLength(3)
    })

    it('should handle multiple delete emissions', async () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDelete()
      wrapper.vm.handleDelete()
      expect(wrapper.emitted()['on-delete']).toHaveLength(2)
    })
  })

  describe('Component Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('component should maintain props after mount', () => {
      const item = { id: '111', name: 'Test' }
      const wrapper = mountComponent({ status: true, item, isActionButtonDisabled: true })
      expect(wrapper.vm.status).toBe(true)
      expect(wrapper.vm.item).toEqual(item)
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })
  })

  describe('Dialog Configuration', () => {
    it('dialog should be of type delete', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('type')).toBe('delete')
    })

    it('footer should be of type delete', () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('type')).toBe('delete')
    })

    it('should have correct dialog IDs for accessibility', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('titleId')).toBe('text--campaign-manager-item-delete-popup-title')
      expect(appDialog.props('subtitleId')).toBe('text--campaign-manager-item-delete-popup-subtitle')
    })

    it('footer should have correct button IDs', () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('cancelButtonId')).toBe('btn-cancel--campaign-manager-popup')
      expect(footer.props('confirmButtonId')).toBe('btn-delete--campaign-manager-popup')
    })
  })

  describe('Button States', () => {
    it('delete button should be disabled when isActionButtonDisabled is true', () => {
      const wrapper = mountComponent({ isActionButtonDisabled: true })
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
    })

    it('delete button should be enabled when isActionButtonDisabled is false', () => {
      const wrapper = mountComponent({ isActionButtonDisabled: false })
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(false)
    })

    it('should update button state when prop changes', async () => {
      const wrapper = mountComponent({ isActionButtonDisabled: false })
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).props('confirmButtonDisabled')).toBe(false)

      await wrapper.setProps({ isActionButtonDisabled: true })
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).props('confirmButtonDisabled')).toBe(true)
    })
  })

  describe('Dialog Status', () => {
    it('dialog status prop should be false by default', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.status).toBe(false)
    })

    it('dialog should reflect status prop changes', async () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.findComponent({ name: 'AppDialog' }).props('status')).toBe(false)

      await wrapper.setProps({ status: true })
      expect(wrapper.findComponent({ name: 'AppDialog' }).props('status')).toBe(true)
    })

    it('should handle status toggle', async () => {
      const wrapper = mountComponent({ status: false })
      await wrapper.setProps({ status: true })
      await wrapper.setProps({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })
  })

  describe('Item Data Handling', () => {
    it('should handle item with various data types', () => {
      const item = {
        id: '123',
        name: 'Test',
        count: 5,
        active: true,
        metadata: { key: 'value' }
      }
      const wrapper = mountComponent({ item })
      expect(wrapper.vm.item).toEqual(item)
    })

    it('should handle null item', () => {
      const wrapper = mountComponent({ item: null })
      expect(wrapper.vm.item).toBeNull()
    })

    it('should emit item with all data intact', () => {
      const item = { id: '999', name: 'Complex Item', details: 'Some details' }
      const wrapper = mountComponent({ item })
      wrapper.vm.handleDelete()
      const emitted = wrapper.emitted()['on-delete'][0][0]
      expect(emitted).toEqual(item)
    })
  })

  describe('Multiple Instances', () => {
    it('should create multiple independent instances', () => {
      const item1 = { id: '1', name: 'Item 1' }
      const item2 = { id: '2', name: 'Item 2' }
      const wrapper1 = mountComponent({ item: item1 })
      const wrapper2 = mountComponent({ item: item2 })

      expect(wrapper1.vm.item).toEqual(item1)
      expect(wrapper2.vm.item).toEqual(item2)
    })

    it('multiple instances should emit independently', () => {
      const wrapper1 = mountComponent({ item: { id: '1' } })
      const wrapper2 = mountComponent({ item: { id: '2' } })

      wrapper1.vm.handleDelete()
      wrapper2.vm.handleDelete()

      expect(wrapper1.emitted()['on-delete'][0][0].id).toBe('1')
      expect(wrapper2.emitted()['on-delete'][0][0].id).toBe('2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete delete workflow', () => {
      const item = { id: '123', name: 'Campaign to Delete' }
      const wrapper = mountComponent({ status: true, item })

      // Dialog is shown
      expect(wrapper.vm.status).toBe(true)

      // User clicks delete button
      wrapper.vm.handleDelete()

      // Correct event emitted with item
      expect(wrapper.emitted()['on-delete'][0][0]).toEqual(item)
    })

    it('complete cancel workflow', () => {
      const wrapper = mountComponent({ status: true })

      // Dialog is shown
      expect(wrapper.vm.status).toBe(true)

      // User cancels
      wrapper.vm.closeModal()

      // Close event emitted
      expect(wrapper.emitted()['on-close']).toBeTruthy()
      expect(wrapper.emitted()['on-delete']).not.toBeTruthy()
    })

    it('should handle disabled state during delete workflow', () => {
      const item = { id: 'test' }
      const wrapper = mountComponent({ item, isActionButtonDisabled: true })

      // Button is disabled
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).props('confirmButtonDisabled')).toBe(true)

      // User tries to delete
      wrapper.vm.handleDelete()

      // Event still emitted (button state is UI concern, event emission is component concern)
      expect(wrapper.emitted()['on-delete']).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid close calls', () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 5; i++) {
        wrapper.vm.closeModal()
      }
      expect(wrapper.emitted()['on-close']).toHaveLength(5)
    })

    it('should handle rapid delete calls', () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 3; i++) {
        wrapper.vm.handleDelete()
      }
      expect(wrapper.emitted()['on-delete']).toHaveLength(3)
    })

    it('should handle empty item object', () => {
      const wrapper = mountComponent({ item: {} })
      wrapper.vm.handleDelete()
      expect(wrapper.emitted()['on-delete'][0][0]).toEqual({})
    })

    it('should handle item with special characters', () => {
      const item = { id: 'test-!@#$%', name: 'Item <with> & special' }
      const wrapper = mountComponent({ item })
      wrapper.vm.handleDelete()
      expect(wrapper.emitted()['on-delete'][0][0]).toEqual(item)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('methods should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()

      for (let i = 0; i < 100; i++) {
        wrapper.vm.closeModal()
        wrapper.vm.handleDelete()
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })
  })
})
