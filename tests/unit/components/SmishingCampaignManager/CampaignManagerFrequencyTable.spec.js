import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/SmishingCampaignManager/CampaignManagerFrequencyTable.vue'

jest.mock('@/api/smishing', () => ({
  searchSmishingCampaignJobReport: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  deleteSmishingCampaignItem: jest.fn().mockResolvedValue({}),
  stopSmishingCampaign: jest.fn().mockResolvedValue({}),
  startSmishingCampaign: jest.fn().mockResolvedValue({})
}))

describe('SmishingCampaignManager CampaignManagerFrequencyTable.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: { frequencyGroup: 'g1', frequencyDescription: 'Weekly' },
        statusItems: [],
        parentResourceId: 'parent-1',
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingCampaignJobStopPermissions': true,
            'permissions/getSmishingCampaignJobDeletePermissions': true
          }
        }
      },
      stubs: {
        DataTable: true,
        Badge: true,
        CampaignManagerItemDeleteDialog: true,
        CampaignManagerItemRowActions: true,
        CommonCampaignManagerCancelCampaignDialog: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
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

  describe('handleBackClick', () => {
    it('emits on-back-click', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleBackClick()
      expect(wrapper.emitted('on-back-click')).toBeTruthy()
    })
  })
})
