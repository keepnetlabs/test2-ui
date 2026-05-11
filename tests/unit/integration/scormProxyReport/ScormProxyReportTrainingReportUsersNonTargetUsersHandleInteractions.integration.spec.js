/**
 * SCORM proxy Non-Target Users: etkileşimler (`handleInteractions`)
 * → `selectedRow` + `isShowInteractionsModal` (`TrainingReportNonUserInteractionsModal`).
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

describe('Scorm Proxy Report Training Report Non-Target Users handleInteractions (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchProxyTargetUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-users-int-1',
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

  it('opens non-user interactions modal and stores row on handleInteractions', async () => {
    const wrapper = mount(TrainingReportUsersNonTargetUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-nt-users-int',
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

    const row = { targetUserResourceId: 'scorm-nt-int-modal-99', status: 'Opened' }
    wrapper.vm.handleInteractions(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })
})
