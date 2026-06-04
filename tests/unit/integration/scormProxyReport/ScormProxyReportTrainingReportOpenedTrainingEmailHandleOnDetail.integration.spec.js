/**
 * SCORM proxy Opened Training Email: satır detayı (`handleOnDetail`)
 * → `selectedRow` + `isShowDetailsModal` (UserInteractionsModal, API yok).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    openedTrainingReportEmails: jest.fn(),
    exportOpenedTrainingReportEmails: jest.fn(),
    resendTrainingToOpenedEmailList: jest.fn(() => Promise.resolve())
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
import TrainingReportOpenedTrainingEmail from '@/components/ScormProxyReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Opened Training Email handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.openedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-open-detail-1', firstName: 'Ann' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('opens details modal and stores row on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportOpenedTrainingEmail, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-open-detail-tr',
        isScormProxy: true,
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true
      }
    })

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const row = { targetUserResourceId: 'row-open-99', firstName: 'Zed' }
    wrapper.vm.handleOnDetail(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDetailsModal).toBe(true)
  })
})
