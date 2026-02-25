import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedtemDetailDialog from '@/components/SmishingReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobTypeDetails: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  })
}))

describe('SmishingReport SubmittedData CampaignManagerReportSubmittedtemDetailDialog.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSubmittedtemDetailDialog, {
      propsData: {
        status: true,
        item: { resourceId: 'r1', firstName: 'John', lastName: 'Doe', submittedCount: 3 },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DataTable: true,
        CampaignManagerReportTimeZoneColumn: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getTitle', () => {
    it('returns title with submittedCount from item', () => {
      const wrapper = createWrapper({
        item: { resourceId: 'r1', submittedCount: 5 }
      })
      expect(wrapper.vm.getTitle).toContain('5')
    })

    it('returns 0 when submittedCount is missing', () => {
      const wrapper = createWrapper({
        item: { resourceId: 'r1' }
      })
      expect(wrapper.vm.getTitle).toContain('0')
    })
  })

  describe('getSubtitle', () => {
    it('returns firstName and lastName from item', () => {
      const wrapper = createWrapper({
        item: { firstName: 'Jane', lastName: 'Smith', resourceId: 'r1' }
      })
      expect(wrapper.vm.getSubtitle).toBe('Jane Smith')
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })
})
