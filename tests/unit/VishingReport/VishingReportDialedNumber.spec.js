import { shallowMount } from '@vue/test-utils'
import VishingReportDialedNumber from '@/components/VishingReport/VishingReportDialedNumber.vue'
import { getVishingReportDialedNumber } from '@/api/vishing'

jest.mock('@/api/vishing', () => ({
  getVishingReportDialedNumber: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ firstName: 'Dial', lastName: 'User', customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportVishingReportDialedNumbers: jest.fn(() => Promise.resolve({ data: {} }))
}))

if (!globalThis.URL) globalThis.URL = {}
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('VishingReportDialedNumber.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportDialedNumber, {
      propsData: { id: 'v1', customFields: [], ...propsData },
      stubs: { DataTable: true, CampaignManagerReportHeader: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportDialedNumber')
  })

  it('callForData fetches and maps table data', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await flushPromises()
    expect(getVishingReportDialedNumber).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].firstName).toBe('Dial')
  })

  it('callForData handles API error', async () => {
    getVishingReportDialedNumber.mockRejectedValueOnce(new Error('fail'))
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
  })
})
