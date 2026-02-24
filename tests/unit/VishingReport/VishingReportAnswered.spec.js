import { shallowMount } from '@vue/test-utils'
import VishingReportAnswered from '@/components/VishingReport/VishingReportAnswered.vue'
import { getVishingReportAnswered } from '@/api/vishing'

jest.mock('@/api/vishing', () => ({
  getVishingReportAnswered: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ firstName: 'John', lastName: 'Doe', customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportVishingAnsweredUsers: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

if (!globalThis.URL) globalThis.URL = {}
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock')

describe('VishingReportAnswered.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportAnswered, {
      propsData: { id: 'v1', customFields: [], ...propsData },
      stubs: { DataTable: true, CampaignManagerReportHeader: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportAnswered')
  })

  it('callForData fetches and maps table data', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(getVishingReportAnswered).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].firstName).toBe('John')
  })

  it('callForData handles empty customFieldValues', async () => {
    getVishingReportAnswered.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ firstName: 'X', customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.vm.tableData).toHaveLength(1)
  })

  it('callForData handles API error', async () => {
    getVishingReportAnswered.mockRejectedValueOnce(new Error('fail'))
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.vm.tableData).toEqual([])
  })
})
