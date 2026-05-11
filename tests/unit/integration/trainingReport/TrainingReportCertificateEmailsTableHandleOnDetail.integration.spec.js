/**
 * Eğitim raporu Sending — Certificate: satır detayı (`handleOnDetail`)
 * → `getTrainingReportCertificateEmailDetails(campaignId, userEmailId)` (`isLearningPath: false` → `this.id`).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportCertificateEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportCertificateEmailDetails: jest.fn()
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

describe('Training Report Certificate emails table handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-cert-detail-1',
              userEmailId: 'ue-cert-1',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          subject: 'Certificate',
          events: []
        }
      }
    })
  })

  it('loads extended view via getTrainingReportCertificateEmailDetails on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportCertificateEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-send-cert-detail',
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

    wrapper.vm.handleOnDetail({ userEmailId: 'ue-cert-99' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportCertificateEmailDetails).toHaveBeenCalledWith(
      'tr-send-cert-detail',
      'ue-cert-99'
    )
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        subject: 'Certificate',
        events: []
      })
    )
  })

  it('learning path: detail API uses awardCertificateEnrollmentId, not campaign id', async () => {
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-lp-cert-1',
              userEmailId: 'ue-lp-1',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          subject: 'LP Certificate',
          events: []
        }
      }
    })

    const wrapper = mount(TrainingReportCertificateEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'campaign-id-not-used-for-lp',
        formDetails: { emailStatusEnum: [] },
        isLearningPath: true,
        awardCertificateEnrollmentId: 'award-enroll-lp-1',
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
      'award-enroll-lp-1'
    )

    wrapper.vm.handleOnDetail({ userEmailId: 'ue-lp-99' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportCertificateEmailDetails).toHaveBeenCalledWith(
      'award-enroll-lp-1',
      'ue-lp-99'
    )
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        subject: 'LP Certificate',
        events: []
      })
    )
  })
})
