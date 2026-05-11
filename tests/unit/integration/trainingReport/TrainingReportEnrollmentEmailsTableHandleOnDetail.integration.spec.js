/**
 * Eğitim raporu Sending — Enrollment: satır detayı (`handleOnDetail`)
 * → `getTrainingReportSendingReportDetails(enrollmentId, targetUserResourceId)` + `extendedViewValue`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportEnrollmentEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportSendingReportDetails: jest.fn()
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

describe('Training Report Enrollment emails table handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-enr-detail-1',
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
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx.enroll.test', event: 'delivered', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getTrainingReportSendingReportDetails on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportEnrollmentEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-enr-detail',
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

    wrapper.vm.handleOnDetail({
      enrollmentId: 'enr-detail-99',
      targetUserResourceId: 'tu-enr-target-99'
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportSendingReportDetails).toHaveBeenCalledWith(
      'enr-detail-99',
      'tu-enr-target-99'
    )
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx.enroll.test', event: 'delivered', reason: '' }]
      })
    )
  })
})
