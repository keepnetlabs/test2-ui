/**
 * Eğitim raporu Sending — Enrollment e-postaları: `mounted` + `$nextTick`
 * → `AwarenessEducatorService.searchSendingReportEnrollmentEmails(axiosPayload, id)`
 * + `customFieldValues` birleşimi.
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

describe('Training Report Enrollment emails table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-enr-1',
              customFieldValues: [{ name: 'Site', value: 'A1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows after nextTick via searchSendingReportEnrollmentEmails', async () => {
    const wrapper = mount(TrainingReportEnrollmentEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-enr-1',
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

    expect(AwarenessEducatorService.searchSendingReportEnrollmentEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-send-enr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'tu-enr-1',
        Site: 'A1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
