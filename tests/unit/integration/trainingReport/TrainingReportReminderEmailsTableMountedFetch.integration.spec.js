/**
 * Eğitim raporu Sending — Reminder e-postaları: `mounted` + `$nextTick`
 * → `AwarenessEducatorService.searchSendingReportReminderEmails(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportReminderEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportReminderEmailDetails: jest.fn(() =>
      Promise.resolve({ data: { data: [] } })
    )
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

describe('Training Report Reminder emails table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportReminderEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-rem-1',
              customFieldValues: [{ name: 'Wave', value: '2' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows after nextTick via searchSendingReportReminderEmails', async () => {
    const wrapper = mount(TrainingReportReminderEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-rem-1',
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

    expect(AwarenessEducatorService.searchSendingReportReminderEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-send-rem-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'tu-rem-1',
        Wave: '2'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
