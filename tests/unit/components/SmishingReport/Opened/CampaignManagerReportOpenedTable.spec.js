import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpenedTable from '@/components/SmishingReport/Opened/CampaignManagerReportOpenedTable.vue'
import SmishingService from '@/api/smishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobType: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              resourceId: 'u1',
              firstName: 'Ada',
              customFieldValues: [{ name: 'region', value: 'TR' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportCampaignJobType: jest.fn(() => Promise.resolve({ data: {} }))
}))

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'region', label: 'Region' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingReport Opened CampaignManagerReportOpenedTable.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportOpenedTable, {
      propsData: {
        id: 'cmp-1',
        instanceGroup: 'group-1',
        customFields: [{ key: 'region' }],
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignReportsOpenedDetailsPermissions': true
          }
        }
      },
      stubs: {
        DataTable: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watch customFields inserts generated columns and callForData maps rows', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ key: 'region' }])
    expect(wrapper.vm.tableOptions.columns.some((column) => column.property === 'region')).toBe(true)
    expect(SmishingService.searchCampaignJobType).toHaveBeenCalledWith(
      'Opened',
      wrapper.vm.axiosPayload,
      'cmp-1',
      'group-1'
    )
    expect(wrapper.vm.tableData[0].region).toBe('TR')
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('handleSelectionChange emits selected count', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleSelectionChange(3)
    expect(wrapper.emitted('on-selection-text-change')[0]).toEqual([3])
  })

  it('handleOnResend builds payload for single and selected rows', () => {
    const wrapper = createWrapper()
    wrapper.vm.axiosPayload.filter = { FilterGroups: [] }

    wrapper.vm.handleOnResend({ resourceId: 'u2' })
    expect(wrapper.emitted('on-resend')[0][0]).toEqual(
      expect.objectContaining({ items: ['u2'], excludedItems: [], selectAll: false })
    )

    wrapper.vm.handleOnResend([{ resourceId: 'u3' }], ['u4'], true)
    expect(wrapper.emitted('on-resend')[1][0]).toEqual(
      expect.objectContaining({ items: ['u3'], excludedItems: ['u4'], selectAll: true })
    )
  })

  it('handleOnDetail emits row', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'u9' }
    wrapper.vm.handleOnDetail(row)
    expect(wrapper.emitted('on-detail')[0]).toEqual([row])
  })

  it('exportCampaignManagerReportOpenedTable maps XLS to Excel and clicks link', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test-url')

    wrapper.vm.exportCampaignManagerReportOpenedTable({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await flushPromises()

    expect(SmishingService.exportCampaignJobType).toHaveBeenNthCalledWith(
      1,
      'opened',
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true }),
      'cmp-1',
      'group-1'
    )
    expect(SmishingService.exportCampaignJobType).toHaveBeenNthCalledWith(
      2,
      'opened',
      expect.objectContaining({ exportType: 'CSV' }),
      'cmp-1',
      'group-1'
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
