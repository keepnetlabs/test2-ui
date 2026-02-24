import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedData from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData'

describe('CampaignManagerReportSubmittedData.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportSubmittedData, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportSubmittedTable: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportSubmittedData')
    })

    it('should render header', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render table', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportSubmittedTable' }).exists()).toBe(
        true
      )
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'submitted-1' })
      expect(wrapper.vm.id).toBe('submitted-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '456' })
      expect(wrapper.vm.instanceGroup).toBe('456')
    })

    it('should accept customFields', () => {
      const fields = [{ name: 'username' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Table Integration', () => {
    it('should render submitted data table', () => {
      const wrapper = mountComponent()
      const table = wrapper.findComponent({ name: 'CampaignManagerReportSubmittedTable' })
      expect(table.exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'sub-1' })
      const wrapper2 = mountComponent({ id: 'sub-2' })

      expect(wrapper1.vm.id).toBe('sub-1')
      expect(wrapper2.vm.id).toBe('sub-2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render with data', () => {
      const wrapper = mountComponent({
        id: 'submitted-complete',
        instanceGroup: '500'
      })

      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportSubmittedTable' }).exists()).toBe(
        true
      )
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
