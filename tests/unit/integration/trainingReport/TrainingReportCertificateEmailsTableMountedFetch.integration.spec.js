/**
 * Eğitim raporu Sending — Certificate e-postaları: `mounted` + `$nextTick`
 * → `AwarenessEducatorService.searchSendingReportCertificateEmails(axiosPayload, id)` (normal training, `isLearningPath: false`).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportCertificateEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportCertificateEmailDetails: jest.fn(() =>
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
import TrainingReportCertificateEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportCertificateEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Certificate emails table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-cert-1',
              customFieldValues: [{ name: 'CertLane', value: 'L1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows after nextTick via searchSendingReportCertificateEmails with campaign id', async () => {
    const wrapper = mount(TrainingReportCertificateEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-cert-1',
        formDetails: { emailStatusEnum: [] },
        isLearningPath: false,
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
        VBtn: true,
        CampaignManagerReportHeader: true
      }
    })

    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.searchSendingReportCertificateEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-send-cert-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'tu-cert-1',
        CertLane: 'L1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
