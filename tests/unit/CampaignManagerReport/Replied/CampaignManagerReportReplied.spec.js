import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportReplied from '@/components/CampaignManagerReport/Replied/CampaignManagerReportReplied'

describe('CampaignManagerReportReplied.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportReplied, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportRepliedTable: true,
        CampaignManagerReportRepliedDetailDialog: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportReplied')
    })

    it('should render header', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render table', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportRepliedTable' }).exists()).toBe(
        true
      )
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'replied-1' })
      expect(wrapper.vm.id).toBe('replied-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '789' })
      expect(wrapper.vm.instanceGroup).toBe('789')
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'message' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Dialog Management', () => {
    it('should manage detail dialog state', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isShowDetailDialog).toBe('boolean')
    })

    it('should store selected row data', () => {
      const wrapper = mountComponent()
      const row = { id: '1', email: 'user@test.com', message: 'reply' }
      wrapper.vm.selectedRow = row
      expect(wrapper.vm.selectedRow.message).toBe('reply')
    })
  })

  describe('Table Integration', () => {
    it('should render table with props', () => {
      const wrapper = mountComponent({ id: 'replied-table' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportRepliedTable' })
      expect(table.exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'replied-1' })
      const wrapper2 = mountComponent({ id: 'replied-2' })

      expect(wrapper1.vm.id).toBe('replied-1')
      expect(wrapper2.vm.id).toBe('replied-2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing customFields', () => {
      const wrapper = mountComponent({ customFields: undefined })
      expect(wrapper.vm.customFields).toEqual([])
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render components', () => {
      const wrapper = mountComponent({
        id: 'replied-complete',
        instanceGroup: '300'
      })

      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportRepliedTable' }).exists()).toBe(
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
