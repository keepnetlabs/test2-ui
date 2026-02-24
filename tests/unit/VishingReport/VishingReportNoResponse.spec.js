import { shallowMount } from '@vue/test-utils'
import VishingReportNoResponse from '@/components/VishingReport/VishingReportNoResponse.vue'
import { getVishingReportNoResponse } from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

jest.mock('@/api/vishing', () => ({
  getVishingReportNoResponse: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ firstName: 'Jane', customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportVishingReportNoResponse: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

describe('VishingReportNoResponse.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportNoResponse, {
      propsData: { id: 'v1', customFields: [], ...propsData },
      stubs: { DataTable: true, CampaignManagerReportHeader: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportNoResponse')
  })

  it('callForData fetches and sets table data', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await flushPromises()
    expect(getVishingReportNoResponse).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].firstName).toBe('Jane')
  })

  it('callForData handles API error', async () => {
    getVishingReportNoResponse.mockRejectedValueOnce(new Error('fail'))
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
  })
})
