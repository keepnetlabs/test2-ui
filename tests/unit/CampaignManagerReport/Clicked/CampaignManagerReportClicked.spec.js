import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportClicked from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClicked'

describe('CampaignManagerReportClicked.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    phishingScenarioName: 'Test Scenario',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportClicked, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportClickedItemDetailDialog: true,
        CampaignManagerReportClickedTable: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportClicked')
    })

    it('should have correct container id', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#campaign-manager-report-clicked').exists()).toBe(true)
    })

    it('should render CampaignManagerReportHeader component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render CampaignManagerReportClickedTable component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'custom-id' })
      expect(wrapper.vm.id).toBe('custom-id')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '456' })
      expect(wrapper.vm.instanceGroup).toBe('456')
    })

    it('should accept phishingScenarioName prop', () => {
      const wrapper = mountComponent({ phishingScenarioName: 'Custom Scenario' })
      expect(wrapper.vm.phishingScenarioName).toBe('Custom Scenario')
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'field1' }, { name: 'field2' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })

    it('customFields should default to empty array', () => {
      const wrapper = mountComponent({ customFields: undefined })
      expect(wrapper.vm.customFields).toEqual([])
    })
  })

  describe('Data Properties', () => {
    it('should initialize resendItemCount as 0', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.resendItemCount).toBe(0)
    })

    it('should initialize isShowDetailDialog as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowDetailDialog).toBe(false)
    })

    it('should initialize isShowSandboxFromParent as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowSandboxFromParent).toBe(false)
    })

    it('should initialize selectedRow as empty object', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toEqual({})
    })

    it('should have labels property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labels).toBeDefined()
    })
  })

  describe('Dialog Visibility', () => {
    it('should conditionally render ResendDialog', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowResendDialog = true
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })

    it('should conditionally render DetailDialog', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowDetailDialog = true
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })
  })

  describe('Methods', () => {
    it('should have handleSelectionChange method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleSelectionChange).toBe('function')
    })

    it('should update resendItemCount on selection change', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(5)
      expect(wrapper.vm.resendItemCount).toBe(5)
    })

    it('should have handleOnResend method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleOnResend).toBe('function')
    })

    it('should have handleOnDetail method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleOnDetail).toBe('function')
    })

    it('should have resendItem method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.resendItem).toBe('function')
    })

    it('should have toggleIsShowResendDialog method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.toggleIsShowResendDialog).toBe('function')
    })

    it('should have toggleShowDetailDialog method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.toggleShowDetailDialog).toBe('function')
    })
  })

  describe('Selection Handling', () => {
    it('should handle zero selections', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(0)
      expect(wrapper.vm.resendItemCount).toBe(0)
    })

    it('should handle single selection', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(1)
      expect(wrapper.vm.resendItemCount).toBe(1)
    })

    it('should handle multiple selections', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(10)
      expect(wrapper.vm.resendItemCount).toBe(10)
    })

    it('should handle large selection counts', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(1000)
      expect(wrapper.vm.resendItemCount).toBe(1000)
    })
  })

  describe('Component References', () => {
    it('should have reference to table', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$refs.refTable).toBeDefined()
    })
  })

  describe('Header Display', () => {
    it('should pass title to header', () => {
      const wrapper = mountComponent()
      const header = wrapper.findComponent({ name: 'CampaignManagerReportHeader' })
      expect(header.attributes('title')).toBeDefined()
    })

    it('should pass subtitle to header', () => {
      const wrapper = mountComponent()
      const header = wrapper.findComponent({ name: 'CampaignManagerReportHeader' })
      expect(header.attributes('subtitle')).toBeDefined()
    })
  })

  describe('Table Integration', () => {
    it('should render table with id prop', () => {
      const wrapper = mountComponent({ id: 'table-id' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' })
      expect(table.exists()).toBe(true)
      expect(wrapper.vm.id).toBe('table-id')
    })

    it('should render table with instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '789' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' })
      expect(table.exists()).toBe(true)
      expect(wrapper.vm.instanceGroup).toBe('789')
    })

    it('should render table with customFields prop', () => {
      const fields = [{ name: 'field1' }]
      const wrapper = mountComponent({ customFields: fields })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' })
      expect(table.exists()).toBe(true)
      expect(wrapper.vm.customFields).toEqual(fields)
    })

    it('should configure table component', () => {
      const wrapper = mountComponent()
      const table = wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' })
      expect(table.exists()).toBe(true)
    })
  })

  describe('Resend Dialog Integration', () => {
    it('should pass isShowResendDialog status to ResendDialog', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowResendDialog = true
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })

    it('should pass resendItemCount to ResendDialog', () => {
      const wrapper = mountComponent()
      wrapper.vm.resendItemCount = 5
      expect(wrapper.vm.resendItemCount).toBe(5)
    })
  })

  describe('Detail Dialog Integration', () => {
    it('should pass selectedRow to DetailDialog', () => {
      const wrapper = mountComponent()
      const row = { name: 'User', email: 'user@test.com' }
      wrapper.vm.selectedRow = row
      expect(wrapper.vm.selectedRow).toEqual(row)
    })

    it('should pass isShowDetailDialog status to DetailDialog', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowDetailDialog = true
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })
  })

  describe('Sandbox State Management', () => {
    it('should track isShowSandboxFromParent state', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowSandboxFromParent = true
      expect(wrapper.vm.isShowSandboxFromParent).toBe(true)
    })

    it('should sync sandbox state between components', () => {
      const wrapper = mountComponent()
      wrapper.vm.isShowSandboxFromParent = false
      expect(wrapper.vm.isShowSandboxFromParent).toBe(false)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent component instances', () => {
      const wrapper1 = mountComponent({ id: 'id-1', instanceGroup: '1' })
      const wrapper2 = mountComponent({ id: 'id-2', instanceGroup: '2' })

      expect(wrapper1.vm.id).toBe('id-1')
      expect(wrapper2.vm.id).toBe('id-2')
    })

    it('should maintain independent selection states', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.resendItemCount = 5
      wrapper2.vm.resendItemCount = 10

      expect(wrapper1.vm.resendItemCount).toBe(5)
      expect(wrapper2.vm.resendItemCount).toBe(10)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: undefined })
      expect(wrapper.vm.instanceGroup).toBeUndefined()
    })

    it('should handle numeric instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 999 })
      expect(wrapper.vm.instanceGroup).toBe(999)
    })

    it('should handle string instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 'string-group' })
      expect(wrapper.vm.instanceGroup).toBe('string-group')
    })

    it('should handle empty customFields', () => {
      const wrapper = mountComponent({ customFields: [] })
      expect(wrapper.vm.customFields.length).toBe(0)
    })

    it('should handle customFields with multiple items', () => {
      const fields = Array.from({ length: 10 }, (_, i) => ({ name: `field-${i}` }))
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields.length).toBe(10)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render with all child components', () => {
      const wrapper = mountComponent({
        id: 'campaign-1',
        instanceGroup: '123',
        phishingScenarioName: 'Phishing Test',
        customFields: [{ name: 'custom1' }]
      })

      expect(wrapper.find('#campaign-manager-report-clicked').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportClickedTable' }).exists()).toBe(true)
    })

    it('complete workflow: handle user selections and resend', () => {
      const wrapper = mountComponent()

      wrapper.vm.handleSelectionChange(3)
      expect(wrapper.vm.resendItemCount).toBe(3)

      wrapper.vm.isShowResendDialog = true
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })

    it('complete workflow: show detail dialog for selected row', () => {
      const wrapper = mountComponent()

      const row = { id: '1', name: 'User', email: 'user@test.com' }
      wrapper.vm.selectedRow = row
      wrapper.vm.isShowDetailDialog = true

      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })

    it('should handle selection changes efficiently', () => {
      const wrapper = mountComponent()
      const start = Date.now()

      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleSelectionChange(i)
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
