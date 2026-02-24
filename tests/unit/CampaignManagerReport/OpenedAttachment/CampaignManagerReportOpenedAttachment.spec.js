import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpenedAttachment from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachment'

describe('CampaignManagerReportOpenedAttachment.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    id: 'test-id',
    instanceGroup: '123',
    customFields: []
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportOpenedAttachment, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportOpenedAttachmentTable: true,
        CampaignManagerReportOpenedAttachmentItemDetailDialog: true
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportOpenedAttachment')
    })

    it('should render header', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
    })

    it('should render table', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'CampaignManagerReportOpenedAttachmentTable' }).exists())
        .toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'attachment-1' })
      expect(wrapper.vm.id).toBe('attachment-1')
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: '456' })
      expect(wrapper.vm.instanceGroup).toBe('456')
    })

    it('should accept customFields prop', () => {
      const fields = [{ name: 'filename' }]
      const wrapper = mountComponent({ customFields: fields })
      expect(wrapper.vm.customFields).toEqual(fields)
    })
  })

  describe('Dialog State', () => {
    it('should track detail dialog visibility', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isShowDetailDialog).toBe('boolean')
    })

    it('should store selected item data', () => {
      const wrapper = mountComponent()
      const item = { id: '1', filename: 'document.pdf' }
      wrapper.vm.selectedRow = item
      expect(wrapper.vm.selectedRow.filename).toBe('document.pdf')
    })
  })

  describe('Table Integration', () => {
    it('should render attachment table', () => {
      const wrapper = mountComponent({ id: 'attachment-table' })
      const table = wrapper.findComponent({ name: 'CampaignManagerReportOpenedAttachmentTable' })
      expect(table.exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ id: 'att-1' })
      const wrapper2 = mountComponent({ id: 'att-2' })

      expect(wrapper1.vm.id).toBe('att-1')
      expect(wrapper2.vm.id).toBe('att-2')
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
    it('complete workflow: render with data', () => {
      const wrapper = mountComponent({
        id: 'attachment-complete',
        instanceGroup: '400'
      })

      expect(wrapper.findComponent({ name: 'CampaignManagerReportHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CampaignManagerReportOpenedAttachmentTable' }).exists())
        .toBe(true)
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
