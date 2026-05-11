/**
 * SCORM proxy eğitim raporu Non-Target Users tablo `mounted`
 * → `AwarenessEducatorService.searchProxyTargetUsers(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchProxyTargetUsers: jest.fn(),
    exportTrainingReportUsers: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastInteractionDate',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportUsersNonTargetUsers from '@/components/ScormProxyReport/Users/TrainingReportUsersNonTargetUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Training Report Non-Target Users table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchProxyTargetUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-1',
              status: 'Completed'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via searchProxyTargetUsers', async () => {
    const wrapper = mount(TrainingReportUsersNonTargetUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-nt-1',
        formDetails: {},
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        TrainingReportNonUserInteractionsModal: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.searchProxyTargetUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'lastInteractionDate' }),
      'scorm-tr-nt-1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'scorm-nt-1',
        status: 'Completed'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
