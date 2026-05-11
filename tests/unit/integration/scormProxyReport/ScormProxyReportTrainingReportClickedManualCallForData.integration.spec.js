/**
 * SCORM proxy Clicked Training Link: `mounted` içinde `callForData()` yorum satırında;
 * veri yükleme `callForData()` ile tetiklenir
 * → `AwarenessEducatorService.clickedTrainingReportEmails(axiosPayload, id)`.
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

describe('Scorm Proxy Report Clicked Training Link manual callForData (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.clickedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-click-1', firstName: 'Cid' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('does not fetch on mount; fetches after callForData()', async () => {
    const wrapper = mount(TrainingReportClickedTrainingLink, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-click-tr-1',
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

    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(AwarenessEducatorService.clickedTrainingReportEmails).not.toHaveBeenCalled()

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.clickedTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'scorm-click-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ targetUserResourceId: 'scorm-click-1', firstName: 'Cid' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
