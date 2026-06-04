/**
 * Eğitim raporu Sending — Enrollment: `handleOnResend`
 * → parent'a `on-resend` (items, excluded, selectAll, filter).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportEnrollmentEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportSendingReportDetails: jest.fn(() =>
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
import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Enrollment emails table handleOnResend emit (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-enr-rs-1',
              enrollmentId: 'enr-1',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('emits on-resend with items, excluded ids, selectAll, and axios filter', async () => {
    const wrapper = mount(TrainingReportEnrollmentEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-enr-rs-emit',
        lastSendingStatusItems: [],
        isScormProxy: false,
        formDetails: { emailStatusEnum: [{ displayName: 'Delivered', name: 'Delivered' }] },
        trainingSummary: {},
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: {
            reRenderFilters: jest.fn(),
            resetSelectableParams: jest.fn(),
            getSelectedMultipleValues: jest.fn(() => []),
            getServerSideSelectionParams: jest.fn(() => ({}))
          }
        },
        Badge: true,
        DefaultButtonRowAction: true,
        TrainingReportSendingReportExtendedView: true,
        VTooltip: true,
        VBtn: true,
        VIcon: true
      }
    })

    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const rows = [
      { targetUserResourceId: 'a', enrollmentId: 'e-a' },
      { targetUserResourceId: 'b', enrollmentId: 'e-b' }
    ]
    wrapper.vm.handleOnResend(rows, ['ex-1'], true)

    expect(wrapper.emitted('on-resend')).toHaveLength(1)
    expect(wrapper.emitted('on-resend')[0]).toEqual([
      rows,
      ['ex-1'],
      true,
      wrapper.vm.axiosPayload.filter
    ])
  })
})
