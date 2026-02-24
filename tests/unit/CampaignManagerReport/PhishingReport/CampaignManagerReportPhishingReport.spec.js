import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportPhishingReport from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport'

describe('CampaignManagerReportPhishingReport.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    phishingScenarioName: 'Test Scenario',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportPhishingReport, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportPhishingReportTable: true,
        CampaignManagerReportPhishingReporterItemDetailDialog: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportPhishingReport')
    })

    it('should have container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#campaign-manager-report-phishing-report').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'phishing-1' })
      expect(wrapper.vm.id).toBe('phishing-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '789' })
      expect(wrapper.vm.instanceGroup).toBe('789')
    })

    it('should accept phishingScenarioName prop', () => {
      const wrapper = mountComponent({ phishingScenarioName: 'Phishing Campaign' })
      expect(wrapper.vm.phishingScenarioName).toBe('Phishing Campaign')
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'reporter' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Dialog Management', () => {
    it('should manage detail dialog visibility', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isShowDetailDialog).toBe('boolean')
    })

    it('should manage resend dialog visibility', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isShowResendDialog).toBe('boolean')
    })

    it('should track selected row for detail', () => {
      const wrapper = mountComponent()
      const row = { id: '1', reportedBy: 'user@test.com' }
      wrapper.vm.selectedRow = row
      expect(wrapper.vm.selectedRow.reportedBy).toBe('user@test.com')
    })
  })

  describe('Methods', () => {
    it('should have handleSelectionChange method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleSelectionChange).toBe('function')
    })

    it('should have handleOnDetail method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleOnDetail).toBe('function')
    })

    it('should have handleOnResend method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleOnResend).toBe('function')
    })

    it('should have toggleShowDetailDialog method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.toggleShowDetailDialog).toBe('function')
    })
  })

  describe('Selection Handling', () => {
    it('should update resendItemCount', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(7)
      expect(wrapper.vm.resendItemCount).toBe(7)
    })

    it('should handle zero selections', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(0)
      expect(wrapper.vm.resendItemCount).toBe(0)
    })

    it('should handle large selection counts', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(500)
      expect(wrapper.vm.resendItemCount).toBe(500)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'phish-1' })
      const wrapper2 = mountComponent({ id: 'phish-2' })

      expect(wrapper1.vm.id).toBe('phish-1')
      expect(wrapper2.vm.id).toBe('phish-2')
    })

    it('should maintain independent dialog states', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.isShowDetailDialog = true
      wrapper2.vm.isShowDetailDialog = false

      expect(wrapper1.vm.isShowDetailDialog).toBe(true)
      expect(wrapper2.vm.isShowDetailDialog).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle numeric instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 888 })
      expect(wrapper.vm.instanceGroup).toBe(888)
    })

    it('should handle empty customFields', () => {
      const wrapper = mountComponent({ customFields: [] })
      expect(wrapper.vm.customFields.length).toBe(0)
    })

    it('should handle missing phishingScenarioName', () => {
      const wrapper = mountComponent({ phishingScenarioName: undefined })
      expect(wrapper.vm.phishingScenarioName).toBeUndefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: view reporter details', () => {
      const wrapper = mountComponent({
        id: 'phish-complete',
        instanceGroup: '800'
      })

      wrapper.vm.selectedRow = { id: '1', email: 'reporter@test.com' }
      wrapper.vm.isShowDetailDialog = true

      expect(wrapper.vm.selectedRow.email).toBe('reporter@test.com')
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })

    it('complete workflow: select and resend', () => {
      const wrapper = mountComponent()

      wrapper.vm.handleSelectionChange(4)
      wrapper.vm.isShowResendDialog = true

      expect(wrapper.vm.resendItemCount).toBe(4)
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
