/**
 * SCORM proxy Opened Training Email: `mounted` içinde `callForData()` yorum satırında;
 * veri yükleme `callForData()` ile tetiklenir
 * → `AwarenessEducatorService.openedTrainingReportEmails(axiosPayload, id)`.
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

describe('Scorm Proxy Report Opened Training Email manual callForData (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.openedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-open-1', firstName: 'Bob' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('does not fetch on mount; fetches after callForData()', async () => {
    const wrapper = mount(TrainingReportOpenedTrainingEmail, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-open-tr-1',
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
    expect(AwarenessEducatorService.openedTrainingReportEmails).not.toHaveBeenCalled()

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.openedTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'scorm-open-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ targetUserResourceId: 'scorm-open-1', firstName: 'Bob' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
