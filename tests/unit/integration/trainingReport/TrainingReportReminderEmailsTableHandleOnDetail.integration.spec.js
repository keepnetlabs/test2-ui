/**
 * Eğitim raporu Sending — Reminder: satır detayı (`handleOnDetail`)
 * → `getTrainingReportReminderEmailDetails(campaignId, userEmailId)` + `extendedViewValue`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportReminderEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportReminderEmailDetails: jest.fn()
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

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportReminderEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportReminderEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Reminder emails table handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportReminderEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-rem-detail-1',
              userEmailId: 'ue-rem-1',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    AwarenessEducatorService.getTrainingReportReminderEmailDetails.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx.remind.test', event: 'processed', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getTrainingReportReminderEmailDetails on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportReminderEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-rem-detail',
        lastSendingStatusItems: [],
        formDetails: { emailStatusEnum: [] },
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        Badge: true,
        TrainingReportSendingReportExtendedView: true,
        VTooltip: true,
        VBtn: true
      }
    })

    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnDetail({ userEmailId: 'ue-rem-99' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportReminderEmailDetails).toHaveBeenCalledWith(
      'tr-send-rem-detail',
      'ue-rem-99'
    )
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx.remind.test', event: 'processed', reason: '' }]
      })
    )
  })
})
