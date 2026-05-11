/**
 * SCORM proxy eğitim raporu Users (Target) tablo `mounted`
 * → `AwarenessEducatorService.searchTrainingReportUsers(axiosPayload, id)`
 * + `examStatus` / `examStatusName` birleşimi; Non-Target alt bileşeni stub (çift API yok).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchTrainingReportUsers: jest.fn(),
    exportTrainingReportUsers: jest.fn(),
    resendTrainingToUserList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'email',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportUsers from '@/components/ScormProxyReport/Users/TrainingReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Training Report Users table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchTrainingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-tu-1',
              firstName: 'Ada',
              examStatusName: 'Passed'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads target users via searchTrainingReportUsers and maps examStatus from examStatusName', async () => {
    const wrapper = mount(TrainingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-users-1',
        formDetails: { targetUserEnrollmentStatusEnum: [] },
        isScormProxy: true,
        isSurvey: false
      },
      stubs: {
        ElTabs: { name: 'ElTabs', template: '<div class="el-tabs"><slot /></div>' },
        ElTabPane: { name: 'ElTabPane', template: '<div class="el-tab-pane"><slot /></div>' },
        TrainingReportUsersNonTargetUsers: true,
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true,
        TrainingReportUserDetailsDialog: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.searchTrainingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'scorm-tr-users-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'scorm-tu-1',
        firstName: 'Ada',
        examStatus: 'Passed'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
