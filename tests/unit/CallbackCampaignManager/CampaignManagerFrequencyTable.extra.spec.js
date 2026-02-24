jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    searchCallbackJobs: jest.fn().mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    }),
    exportCallbackJobs: jest.fn().mockResolvedValue({ data: new Blob() })
  }
}))

import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/CallbackCampaignManager/CampaignManagerFrequencyTable.vue'

describe('CampaignManagerFrequencyTable.vue (extra branch coverage)', () => {
  const createWrapper = (props = {}) =>
    shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: {
          frequencyGroup: 'fg-1',
          frequencyDescription: 'Weekly',
          instanceGroup: 'ig-1'
        },
        statusItems: [],
        parentResourceId: 'parent-1',
        parentCampaignType: 4,
        ...props
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignReportsPausePermissions': true,
            'permissions/getCampaignReportsDeletePermissions': true
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: { template: '<div><slot name="table-all-records" /></div>' },
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })

  it('getTooltipDisabilityStatus returns true when no error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Scheduled', jobResultMessage: '' }
    expect(wrapper.vm.getTooltipDisabilityStatus(row)).toBe(true)
  })

  it('getTooltipDisabilityStatus returns false when has error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Error', jobResultMessage: 'Failed' }
    expect(wrapper.vm.getTooltipDisabilityStatus(row)).toBe(false)
  })

  it('getErrorMessage returns jobResultMessage when status is Error', () => {
    const wrapper = createWrapper()
    const row = { status: 'Error', jobResultMessage: 'Custom error' }
    expect(wrapper.vm.getErrorMessage(row)).toBe('Custom error')
  })
})
