/**
 * SCORM proxy Clicked Training Link: satır detayı (`handleOnDetail`)
 * → `selectedRow` + `isShowDetailsModal` (UserInteractionsModal, API yok).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    clickedTrainingReportEmails: jest.fn(),
    exportClickedTrainingReportEmails: jest.fn(),
    resendTrainingToClickedLinkList: jest.fn(() => Promise.resolve())
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
import TrainingReportClickedTrainingLink from '@/components/ScormProxyReport/ClickedTrainingLink/TrainingReportClickedTrainingLink.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Clicked Training Link handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.clickedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-click-detail-1', firstName: 'Ben' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('opens details modal and stores row on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportClickedTrainingLink, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-click-detail-tr',
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

    const row = { targetUserResourceId: 'row-click-99', firstName: 'Yve' }
    wrapper.vm.handleOnDetail(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDetailsModal).toBe(true)
  })
})
