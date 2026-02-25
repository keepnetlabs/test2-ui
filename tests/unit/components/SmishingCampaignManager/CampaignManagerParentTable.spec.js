const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import CampaignManagerParentTable from '@/components/SmishingCampaignManager/CampaignManagerParentTable.vue'

jest.mock('@/api/smishing', () => ({
  searchSmishingCampaigns: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  exportSmishingCampaigns: jest.fn().mockResolvedValue(mockBlob)
}))

describe('SmishingCampaignManager CampaignManagerParentTable.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerParentTable, {
      propsData: {
        statusItems: [],
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingCampaignManagerSearchPermissions': true,
            'permissions/getSmishingCampaignManagerExportPermissions': true,
            'permissions/getSmishingCampaignManagerCreatePermissions': true,
            'permissions/getSmishingCampaignManagerDeletePermissions': true
          }
        }
      },
      stubs: {
        DataTable: true,
        TheRecordsButton: true,
        CampaignManagerRowActions: true,
        Badge: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getRecordsButtonSingleLabel', () => {
    it('returns empty when status is Idle', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Idle' })).toBe('')
    })

    it('returns empty when recurring (frequency not null and not 0)', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Active', frequency: 1 })).toBe('')
    })

    it('returns View Report when not Idle and not recurring', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRecordsButtonSingleLabel({ status: 'Completed', frequency: 0 })
      ).toBe('View Report')
    })
  })

  describe('getMethodDetail', () => {
    it('parses valid JSON methodDetail', () => {
      const wrapper = createWrapper()
      const detail = [{ method: 'SMS', count: 2 }]
      expect(wrapper.vm.getMethodDetail(JSON.stringify(detail))).toEqual(detail)
    })

    it('returns empty object when methodDetail is null', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getMethodDetail(null)).toEqual({})
    })

    it('returns empty object when JSON parse fails', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getMethodDetail('invalid json')).toEqual({})
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage for Error status', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'Failed' })
      ).toBe('Failed')
    })

    it('returns empty string for non-Error status', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getErrorMessage({ status: 'Completed' })).toBe('')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('returns false when Error and has jobResultMessage', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'msg' })
      ).toBe(false)
    })

    it('returns true when status is not Error', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Completed' })).toBe(true)
    })
  })

  describe('handlePreview', () => {
    it('emits on-preview with row', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'r1' }
      wrapper.vm.handlePreview(row)
      expect(wrapper.emitted('on-preview')).toEqual([[row]])
    })
  })
})

