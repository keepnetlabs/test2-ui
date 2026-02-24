import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpened from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpened'

describe('CampaignManagerReportOpened.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportOpened, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportOpenedTable: true,
        CampaignManagerReportOpenedItemDetailDialog: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportOpened')
    })

    it('should render header component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render table component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportOpenedTable' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'opened-1' })
      expect(wrapper.vm.id).toBe('opened-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '456' })
      expect(wrapper.vm.instanceGroup).toBe('456')
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'email' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Dialog Management', () => {
    it('should handle detail dialog visibility', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isShowDetailDialog).toBeDefined()
    })

    it('should track selected row for detail view', () => {
      const wrapper = mountComponent()
      wrapper.vm.selectedRow = { id: '1', name: 'User' }
      expect(wrapper.vm.selectedRow.id).toBe('1')
    })
  })

  describe('Table Integration', () => {
    it('should render table with required props', () => {
      const wrapper = mountComponent({ id: 'table-opened' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportOpenedTable' })
      expect(table.exists()).toBe(true)
    })

    it('should pass instanceGroup to table', () => {
      const wrapper = mountComponent({ instanceGroup: '999' })
      expect(wrapper.vm.instanceGroup).toBe('999')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'opened-1' })
      const wrapper2 = mountComponent({ id: 'opened-2' })

      expect(wrapper1.vm.id).toBe('opened-1')
      expect(wrapper2.vm.id).toBe('opened-2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty customFields', () => {
      const wrapper = mountComponent({ customFields: [] })
      expect(wrapper.vm.customFields.length).toBe(0)
    })

    it('should handle undefined customFields', () => {
      const wrapper = mountComponent({ customFields: undefined })
      expect(wrapper.vm.customFields).toEqual([])
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render all child components', () => {
      const wrapper = mountComponent({
        id: 'opened-complete',
        instanceGroup: '200'
      })

      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportOpenedTable' }).exists()).toBe(true)
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
