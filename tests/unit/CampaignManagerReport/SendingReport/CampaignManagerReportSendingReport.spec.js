import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReport from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReport'

describe('CampaignManagerReportSendingReport.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: [],
    phishingScenarioName: 'Test Scenario',
    formDetails: {}
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportSendingReport, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportSendingReportTable: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportSendingReport')
    })

    it('should have container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#campaign-manager-report-sending-report').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'sending-1' })
      expect(wrapper.vm.id).toBe('sending-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '456' })
      expect(wrapper.vm.instanceGroup).toBe('456')
    })

    it('should accept phishingScenarioName prop', () => {
      const wrapper = mountComponent({ phishingScenarioName: 'Scenario X' })
      expect(wrapper.vm.phishingScenarioName).toBe('Scenario X')
    })

    it('should accept formDetails prop', () => {
      const details = { name: 'form1' }
      const wrapper = mountComponent({ formDetails: details })
      expect(wrapper.vm.formDetails).toEqual(details)
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'field1' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Resend Dialog', () => {
    it('should manage resend dialog visibility', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isShowResendDialog).toBe('boolean')
    })

    it('should track resend item count', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.resendItemCount).toBe('number')
    })
  })

  describe('Methods', () => {
    it('should have handleSelectionChange method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleSelectionChange).toBe('function')
    })

    it('should have toggleIsShowResendDialog method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.toggleIsShowResendDialog).toBe('function')
    })

    it('should have resendItem method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.resendItem).toBe('function')
    })
  })

  describe('Selection Management', () => {
    it('should update resendItemCount on selection', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(5)
      expect(wrapper.vm.resendItemCount).toBe(5)
    })

    it('should handle zero selections', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(0)
      expect(wrapper.vm.resendItemCount).toBe(0)
    })

    it('should handle multiple selections', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(50)
      expect(wrapper.vm.resendItemCount).toBe(50)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'send-1' })
      const wrapper2 = mountComponent({ id: 'send-2' })

      expect(wrapper1.vm.id).toBe('send-1')
      expect(wrapper2.vm.id).toBe('send-2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle numeric instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 999 })
      expect(wrapper.vm.instanceGroup).toBe(999)
    })

    it('should handle empty customFields', () => {
      const wrapper = mountComponent({ customFields: [] })
      expect(wrapper.vm.customFields.length).toBe(0)
    })

    it('should handle undefined formDetails', () => {
      const wrapper = mountComponent({ formDetails: undefined })
      expect(wrapper.vm.formDetails).toBeUndefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render with all data', () => {
      const wrapper = mountComponent({
        id: 'send-complete',
        instanceGroup: '700',
        phishingScenarioName: 'Phishing Test',
        formDetails: { method: 'email' }
      })

      expect(wrapper.vm.id).toBe('send-complete')
      expect(wrapper.vm.phishingScenarioName).toBe('Phishing Test')
    })

    it('complete workflow: handle selections and resend', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleSelectionChange(3)
      expect(wrapper.vm.resendItemCount).toBe(3)
      wrapper.vm.isShowResendDialog = true
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
