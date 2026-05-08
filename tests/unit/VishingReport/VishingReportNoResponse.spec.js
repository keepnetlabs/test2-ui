import { shallowMount } from '@vue/test-utils'
import VishingReportNoResponse from '@/components/VishingReport/VishingReportNoResponse.vue'
import { exportVishingReportNoResponse, getVishingReportNoResponse } from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

if (!globalThis.URL) globalThis.URL = {}
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock')

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
  exportVishingReportNoResponse: jest.fn(() => Promise.resolve({ data: {} }))
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

  it('CONSTANTS defines no-response data table id', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.CONSTANTS.id).toBe('vishing-report-no-response-data-table')
  })

  it('callForData merges custom field values into row objects', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    getVishingReportNoResponse.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'Z',
              customFieldValues: [{ name: 'Site', value: 'HQ' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    wrapper.vm.callForData()
    await flushPromises()
    expect(wrapper.vm.tableData[0].Site).toBe('HQ')
    expect(wrapper.vm.tableData[0].firstName).toBe('Z')
  })

  it('exportVishingReportUsers calls export API and triggers anchor click', async () => {
    const clickMock = jest.fn()
    const origCreate = document.createElement.bind(document)
    const createSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return { click: clickMock, href: '', download: '' }
      }
      return origCreate(tag)
    })
    const wrapper = mountComponent()
    wrapper.vm.exportVishingReportUsers({
      exportTypes: ['PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })
    await flushPromises()
    expect(exportVishingReportNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'PDF',
        pageNumber: 1,
        pageSize: 20
      }),
      'v1'
    )
    expect(clickMock).toHaveBeenCalled()
    createSpy.mockRestore()
  })
})
