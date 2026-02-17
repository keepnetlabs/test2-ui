import { shallowMount } from '@vue/test-utils'
import EnrollmentsTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  searchEnrollments: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ enrollmentId: 'e-1' }],
          totalNumberOfRecords: 5,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('file-content') }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsTable.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(EnrollmentsTable, {
      propsData: {
        mainLanguages: [],
        enrollmentStatusEnum: [],
        ...propsData
      },
      stubs: {
        DataTable: true,
        EnrollmentsTableRowActions: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getExportEnrollmentPermission': true,
            'permissions/getEnrollmentEditPermission': true,
            'permissions/getDeleteEnrollmentPermission': true
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads enrollments on mount and updates server side props', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(AwarenessEducatorService.searchEnrollments).toHaveBeenCalledWith(wrapper.vm.axiosPayload)
    expect(wrapper.vm.tableData).toEqual([{ enrollmentId: 'e-1' }])
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('maps enrollment statuses for filter items via watcher', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refTable = { reRenderFilters: jest.fn() }

    await wrapper.setProps({
      enrollmentStatusEnum: [{ id: 1, displayName: 'Scheduled' }, { name: 'Stopped' }]
    })

    const statusColumn = wrapper.vm.tableOptions.columns.find((col) => col.property === 'status')
    expect(statusColumn.filterableItems).toEqual([
      { text: 'Scheduled', value: 1 },
      { text: 'Stopped', value: 'Stopped' }
    ])
    expect(wrapper.vm.$refs.refTable.reRenderFilters).toHaveBeenCalled()
  })

  it('exports selected formats and triggers file download', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement
    const originalCreateObjectURL = window.URL.createObjectURL
    document.createElement = jest.fn(() => ({
      click,
      href: '',
      download: ''
    }))
    window.URL.createObjectURL = jest.fn(() => 'blob:export')

    wrapper.vm.exportEnrollments({
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledTimes(2)
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    document.createElement = originalCreateElement
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
