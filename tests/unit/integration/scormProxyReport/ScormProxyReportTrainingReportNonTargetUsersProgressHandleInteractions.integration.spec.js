/**
 * SCORM proxy Non-Target Users Progress: satır etkileşimleri (`handleInteractions`)
 * → `selectedRow` + `isShowInteractionsModal` (`TrainingReportNonTargetUsersProgressDetailDialog`).
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

describe('Scorm Proxy Report Non-Target Users Progress handleInteractions (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-prog-int-1',
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

  it('opens non-target progress detail dialog and stores row on handleInteractions', async () => {
    const wrapper = mount(TrainingReportNonTargetUsersProgress, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nt-prog-int-tr',
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

    const row = { targetUserResourceId: 'scorm-nt-int-modal-99', status: 'Completed' }
    wrapper.vm.handleInteractions(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })
})
