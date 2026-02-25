import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/SmishingReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobTypeDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ openedTime: '2026-01-01T00:00:00Z', ip: '1.1.1.1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingReport Opened CampaignManagerReportOpenedItemDetailDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportOpenedItemDetailDialog, {
      propsData: {
        status: true,
        item: {
          resourceId: 'u1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          openedCount: 4
        },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DataTable: true,
        CampaignManagerReportUserAgentColumn: true,
        CampaignManagerReportTimeZoneColumn: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title and subtitle from selected item', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getTitle).toBe('Opened Email 4 Time(s)')
    expect(wrapper.vm.getSubtitle).toBe('Ada Lovelace')
  })

  it('created initializes page size and loads detail rows', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.serverSideProps.pageSize).toBe(5)
    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'opened',
      wrapper.vm.axiosPayload,
      'u1'
    )
    expect(wrapper.vm.tableData).toEqual([{ openedTime: '2026-01-01T00:00:00Z', ip: '1.1.1.1' }])
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
