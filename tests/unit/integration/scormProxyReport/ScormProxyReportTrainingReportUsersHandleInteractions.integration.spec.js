/**
 * SCORM proxy Users (Target): etkileşimler (`handleInteractions`)
 * → `selectedRow` + `isShowInteractionsModal` (`TrainingReportUserInteractionsModal`).
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

describe('Scorm Proxy Report Training Report Users handleInteractions (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchTrainingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-tu-interact-1',
              firstName: 'I1',
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

  it('opens user interactions modal and stores row on handleInteractions', async () => {
    const wrapper = mount(TrainingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-users-interact',
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

    const row = { targetUserResourceId: 'scorm-tu-interact-99', firstName: 'Ix' }
    wrapper.vm.handleInteractions(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })
})
