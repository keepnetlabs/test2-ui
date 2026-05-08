import { shallowMount } from '@vue/test-utils'
import VishingReportDialedNumber from '@/components/VishingReport/VishingReportDialedNumber.vue'
import { exportVishingReportDialedNumbers, getVishingReportDialedNumber } from '@/api/vishing'

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

  it('CONSTANTS defines dialed-number data table id', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.CONSTANTS.id).toBe('vishing-report-dialed-data-table')
  })

  it('callForData merges custom field values into row objects', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    getVishingReportDialedNumber.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'Dial',
              customFieldValues: [{ name: 'Pin', value: '1234' }]
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
    expect(wrapper.vm.tableData[0].Pin).toBe('1234')
    expect(wrapper.vm.tableData[0].firstName).toBe('Dial')
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
      exportTypes: ['CSV'],
      pageNumber: 3,
      pageSize: 15,
      reportAllPages: true
    })
    await flushPromises()
    expect(exportVishingReportDialedNumbers).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV',
        pageNumber: 3,
        pageSize: 15,
        reportAllPages: true
      }),
      'v1'
    )
    expect(clickMock).toHaveBeenCalled()
    createSpy.mockRestore()
  })
})
