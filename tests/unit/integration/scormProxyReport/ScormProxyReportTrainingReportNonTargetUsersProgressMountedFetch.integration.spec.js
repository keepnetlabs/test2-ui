/**
 * SCORM proxy Non-Target Users Progress tablo `mounted`
 * → `AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressNonTargetUsersTrainingReportEmails: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'enrollmentDate',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportNonTargetUsersProgress from '@/components/ScormProxyReport/Progress/TrainingReportNonTargetUsersProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Non-Target Users Progress table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-prog-1',
              status: 'InProgress'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via progressNonTargetUsersTrainingReportEmails', async () => {
    const wrapper = mount(TrainingReportNonTargetUsersProgress, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nt-prog-tr-1',
        formDetails: { targetUserEnrollmentStatusEnum: [] },
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        TrainingReportNonTargetUsersProgressDetailDialog: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'enrollmentDate' }),
      'scorm-nt-prog-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'scorm-nt-prog-1',
        status: 'InProgress'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
