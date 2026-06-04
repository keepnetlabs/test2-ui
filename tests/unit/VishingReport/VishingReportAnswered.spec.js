import { shallowMount } from '@vue/test-utils'
import VishingReportAnswered from '@/components/VishingReport/VishingReportAnswered.vue'
import { exportVishingAnsweredUsers, getVishingReportAnswered } from '@/api/vishing'

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
  exportVishingAnsweredUsers: jest.fn(() => Promise.resolve({ data: {} }))
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

  it('CONSTANTS defines answered data table id', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.CONSTANTS.id).toBe('vishing-report-answered-data-table')
  })

  it('callForData merges custom field values into row objects', async () => {
    const wrapper = mountComponent()
    await new Promise((r) => setTimeout(r, 0))
    getVishingReportAnswered.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'A',
              lastName: 'B',
              customFieldValues: [{ name: 'Office', value: 'London' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.vm.tableData[0].Office).toBe('London')
    expect(wrapper.vm.tableData[0].firstName).toBe('A')
  })

  it('exportVishingReportAnsweredUsers calls export API and triggers anchor click', async () => {
    const clickMock = jest.fn()
    const origCreate = document.createElement.bind(document)
    const createSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return { click: clickMock, href: '', download: '' }
      }
      return origCreate(tag)
    })
    const wrapper = mountComponent()
    wrapper.vm.exportVishingReportAnsweredUsers({
      exportTypes: ['CSV'],
      pageNumber: 2,
      pageSize: 50,
      reportAllPages: true
    })
    await new Promise((r) => setTimeout(r, 0))
    expect(exportVishingAnsweredUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 2,
        pageSize: 50,
        exportType: 'CSV',
        reportAllPages: true
      }),
      'v1'
    )
    expect(clickMock).toHaveBeenCalled()
    createSpy.mockRestore()
  })

  it('exportVishingReportAnsweredUsers maps XLS export type to Excel in payload', async () => {
    const origCreate = document.createElement.bind(document)
    const createSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return { click: jest.fn(), href: '', download: '' }
      }
      return origCreate(tag)
    })
    const wrapper = mountComponent()
    wrapper.vm.exportVishingReportAnsweredUsers({
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await new Promise((r) => setTimeout(r, 0))
    expect(exportVishingAnsweredUsers).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'v1'
    )
    createSpy.mockRestore()
  })
})
