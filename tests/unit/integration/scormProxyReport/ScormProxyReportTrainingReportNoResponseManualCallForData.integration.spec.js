/**
 * SCORM proxy No Response: `mounted` içinde `callForData()` yorum satırında;
 * veri yükleme `callForData()` ile tetiklenir
 * → `AwarenessEducatorService.noResponseTrainingReportEmails(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    noResponseTrainingReportEmails: jest.fn(),
    exportNoResponseReportResults: jest.fn(),
    resendTrainingNoResponseList: jest.fn(() => Promise.resolve())
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
import TrainingReportNoResponse from '@/components/ScormProxyReport/NoResponse/TrainingReportNoResponse.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report No Response manual callForData (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-nr-1', firstName: 'Ada' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('does not fetch on mount; fetches after callForData()', async () => {
    const wrapper = mount(TrainingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nr-tr-1',
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
        TrainingReportResendDialog: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(AwarenessEducatorService.noResponseTrainingReportEmails).not.toHaveBeenCalled()

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.noResponseTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'scorm-nr-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ targetUserResourceId: 'scorm-nr-1', firstName: 'Ada' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
