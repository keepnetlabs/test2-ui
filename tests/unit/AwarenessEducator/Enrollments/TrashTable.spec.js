import { shallowMount } from '@vue/test-utils'
import TrashTable from '@/components/AwarenessEducator/Enrollments/TrashTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  searchTrash: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              enrollmentId: 'enr-1',
              trainingRoles: [{ roleName: 'Admins' }, { roleName: 'Users' }]
            },
            {
              enrollmentId: 'enr-2',
              trainingRoles: null
            }
          ],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrashTable.vue', () => {
  const createWrapper = () =>
    shallowMount(TrashTable, {
      stubs: {
        DataTable: true
      },
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads trash data and enriches target audience list', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(AwarenessEducatorService.searchTrash).toHaveBeenCalledWith(wrapper.vm.axiosPayload)
    expect(wrapper.vm.tableData).toEqual([
      {
        enrollmentId: 'enr-1',
        trainingRoles: [{ roleName: 'Admins' }, { roleName: 'Users' }],
        targetAudience: ['Admins', 'Users']
      },
      {
        enrollmentId: 'enr-2',
        trainingRoles: null,
        targetAudience: []
      }
    ])
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(2)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('emits delete and restore events', () => {
    const wrapper = createWrapper()
    const row = { enrollmentId: 'enr-9' }

    wrapper.vm.handleDelete(row)
    wrapper.vm.handleRestore(row)

    expect(wrapper.emitted('on-delete')[0]).toEqual([row])
    expect(wrapper.emitted('on-restore')[0]).toEqual([row])
  })

  it('routes to report when view report action is used', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleViewReport({ enrollmentId: 'enr-7' })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Training Report',
      params: {
        id: 'enr-7'
      }
    })
  })
})
