import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedMfaCode from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCode'

describe('CampaignManagerReportSubmittedMfaCode.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportSubmittedMfaCode, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportSubmittedMfaCodeTable: true,
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportSubmittedMfaCodeDetailDialog: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportSubmittedMfaCode')
    })

    it('should have container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#campaign-manager-report-submitted-data').exists()).toBe(true)
    })

    it('should have proper component structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportSubmittedMfaCode')
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'mfa-1' })
      expect(wrapper.vm.id).toBe('mfa-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '789' })
      expect(wrapper.vm.instanceGroup).toBe('789')
    })

    it('should accept customFields', () => {
      const fields = [{ name: 'mfacode' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Table Integration', () => {
    it('should have table ref', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$refs.refTable).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'mfa-1' })
      const wrapper2 = mountComponent({ id: 'mfa-2' })

      expect(wrapper1.vm.id).toBe('mfa-1')
      expect(wrapper2.vm.id).toBe('mfa-2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render MFA data', () => {
      const wrapper = mountComponent({
        id: 'mfa-complete',
        instanceGroup: '600'
      })

      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.id).toBe('mfa-complete')
      expect(wrapper.vm.instanceGroup).toBe('600')
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
