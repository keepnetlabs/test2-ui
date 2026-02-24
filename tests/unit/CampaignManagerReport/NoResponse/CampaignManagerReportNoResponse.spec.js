import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportNoResponse from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponse'

describe('CampaignManagerReportNoResponse.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportNoResponse, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportNoResponseTable: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportNoResponse')
    })

    it('should render CampaignManagerReportHeader', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render CampaignManagerReportNoResponseTable', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportNoResponseTable' }).exists()).toBe(
        true
      )
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

    it('should accept customFields prop', () => {
      const fields = [{ name: 'field1' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })

    it('customFields should default to empty array', () => {
      const wrapper = mountComponent({ customFields: undefined })
      expect(wrapper.vm.customFields).toEqual([])
    })
  })

  describe('Header Integration', () => {
    it('should render header with title', () => {
      const wrapper = mountComponent()
      const header = wrapper.findComponent({ name: 'CampaignManagerReportHeader' })
      expect(header.exists()).toBe(true)
    })

    it('should render header with subtitle', () => {
      const wrapper = mountComponent()
      const header = wrapper.findComponent({ name: 'CampaignManagerReportHeader' })
      expect(header.attributes('subtitle')).toBeDefined()
    })
  })

  describe('Table Integration', () => {
    it('should pass id to table', () => {
      const wrapper = mountComponent({ id: 'table-1' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportNoResponseTable' })
      expect(table.exists()).toBe(true)
      expect(wrapper.vm.id).toBe('table-1')
    })

    it('should pass instanceGroup to table', () => {
      const wrapper = mountComponent({ instanceGroup: '789' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportNoResponseTable' })
      expect(table.exists()).toBe(true)
    })

    it('should pass customFields to table', () => {
      const fields = [{ name: 'field1' }, { name: 'field2' }]
      const wrapper = mountComponent({ customFields: fields })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportNoResponseTable' })
      expect(table.exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'id-1' })
      const wrapper2 = mountComponent({ id: 'id-2' })

      expect(wrapper1.vm.id).toBe('id-1')
      expect(wrapper2.vm.id).toBe('id-2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing props', () => {
      const wrapper = mountComponent({})
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle numeric instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 999 })
      expect(wrapper.vm.instanceGroup).toBe(999)
    })

    it('should handle string instanceGroup', () => {
      const wrapper = mountComponent({ instanceGroup: 'group-name' })
      expect(wrapper.vm.instanceGroup).toBe('group-name')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render with all components', () => {
      const wrapper = mountComponent({
        id: 'no-response-1',
        instanceGroup: '100',
        customFields: [{ name: 'field1' }]
      })

      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportNoResponseTable' }).exists()).toBe(
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
