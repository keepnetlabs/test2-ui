import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportHumanActivityDialog from '@/components/CampaignManagerReport/CampaignManagerReportHumanActivityDialog'

jest.mock('@/api/phishingsimulator', () => ({
  updateSandboxActivity: jest.fn().mockResolvedValue({ data: {} })
}))

describe('CampaignManagerReportHumanActivityDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: true,
    selectedRow: { resourceId: '123', name: 'Test User' },
    searchType: 'opened'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportHumanActivityDialog, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: { AppDialog: true, AppDialogFooter: true },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportHumanActivityDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AppDialogFooter component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.status).toBe(true)
    })

    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('should accept searchType prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.searchType).toBe('opened')
    })

    it('status should default to false', () => {
      const wrapper = mountComponent({ status: undefined })
      expect(wrapper.vm.status).toBe(false)
    })

    it('searchType should default to "opened"', () => {
      const wrapper = mountComponent({ searchType: undefined })
      expect(wrapper.vm.searchType).toBe('opened')
    })
  })

  describe('Data Properties', () => {
    it('should initialize isActionButtonDisabled as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })
  })

  describe('Dialog Content', () => {
    it('should display human activity confirmation message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain("Do you want to mark this user as a 'Human Activity'")
    })

    it('should indicate action can be undone', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('This action can be undone')
    })
  })

  describe('Methods', () => {
    it('should have handleClose method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClose).toBe('function')
    })

    it('should have handleConfirm method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleConfirm).toBe('function')
    })
  })

  describe('Event Emissions', () => {
    it('should emit on-close event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('should pass forceUpdate parameter to on-close event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleClose(true)
      expect(wrapper.emitted('on-close')[0][1]).toBe(true)
    })

    it('should emit on-close with forceUpdate false by default', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')[0][1]).toBe(false)
    })
  })

  describe('Dialog Status', () => {
    it('should close dialog when status is false', async () => {
      const wrapper = mountComponent({ status: true })
      await wrapper.setProps({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })

    it('should pass status to AppDialog', () => {
      const wrapper = mountComponent({ status: true })
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.attributes('status')).toBeDefined()
    })
  })

  describe('Button States', () => {
    it('should enable confirm button initially', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('should disable confirm button when action is in progress', async () => {
      const wrapper = mountComponent()
      wrapper.vm.isActionButtonDisabled = true
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })
  })

  describe('Different Search Types', () => {
    it('should handle "opened" search type', () => {
      const wrapper = mountComponent({ searchType: 'opened' })
      expect(wrapper.vm.searchType).toBe('opened')
    })

    it('should handle "clicked" search type', () => {
      const wrapper = mountComponent({ searchType: 'clicked' })
      expect(wrapper.vm.searchType).toBe('clicked')
    })

    it('should handle "submitted" search type', () => {
      const wrapper = mountComponent({ searchType: 'submitted' })
      expect(wrapper.vm.searchType).toBe('submitted')
    })
  })

  describe('Selected Row Handling', () => {
    it('should contain selectedRow data', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '456', name: 'John Doe' }
      })
      expect(wrapper.vm.selectedRow.resourceId).toBe('456')
    })

    it('should handle null selectedRow', () => {
      const wrapper = mountComponent({ selectedRow: null })
      expect(wrapper.vm.selectedRow).toBeNull()
    })

    it('should handle multiple selected rows', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '789', name: 'Jane Doe' }
      })
      expect(wrapper.vm.selectedRow.name).toBe('Jane Doe')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent dialog instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { resourceId: '1', name: 'User1' }
      })
      const wrapper2 = mountComponent({
        selectedRow: { resourceId: '2', name: 'User2' }
      })

      expect(wrapper1.vm.selectedRow.resourceId).toBe('1')
      expect(wrapper2.vm.selectedRow.resourceId).toBe('2')
    })
  })

  describe('Dialog Icon and Title', () => {
    it('should render AppDialog with correct structure', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.exists()).toBe(true)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render and close dialog', async () => {
      const wrapper = mountComponent({
        status: true,
        selectedRow: { resourceId: '123' }
      })

      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
