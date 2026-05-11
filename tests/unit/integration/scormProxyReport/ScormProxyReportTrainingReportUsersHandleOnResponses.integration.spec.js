/**
 * SCORM proxy Users (Target): yanıt / detay (`handleOnResponses`)
 * → `selectedRow` + `isShowDetailsDialog` (`TrainingReportUserDetailsDialog`).
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

describe('Scorm Proxy Report Training Report Users handleOnResponses (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchTrainingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-tu-resp-1',
              firstName: 'R1',
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

  it('opens user details dialog and stores item on handleOnResponses', async () => {
    const wrapper = mount(TrainingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-users-resp-1',
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

    const item = { targetUserResourceId: 'scorm-resp-modal-99', firstName: 'RespRow' }
    wrapper.vm.handleOnResponses(item)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(item)
    expect(wrapper.vm.isShowDetailsDialog).toBe(true)
  })
})
