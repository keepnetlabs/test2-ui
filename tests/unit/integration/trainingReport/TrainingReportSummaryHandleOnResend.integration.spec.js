/**
 * Eğitim raporu Summary (Learning Path): sertifika sekmesinden gelen `handleOnResend`
 * → `resendPayload` (dördüncü argüman `filter` olarak) + `isShowResendDialog`.
 */
jest.mock('@/utils/testRequest', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
  }
}))

jest.mock('@/api/company', () => ({
  getDefaultEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: { template: '' } } }))
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificateHtml: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    resendCertificateToUserList: jest.fn(() => Promise.resolve())
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import TrainingReportSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummary.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Summary handleOnResend (integration)', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    store = new Vuex.Store({
      modules: {
        trainingLibraryHelpers: {
          namespaced: true,
          getters: {
            getLanguages: () => []
          }
        }
      },
      state: {
        whitelabel: { emailTemplateLogoUrl: '' }
      }
    })
  })

  it('builds certificate resend payload and opens dialog', async () => {
    const filterArg = { FilterGroups: [{ FilterItems: [] }] }
    const wrapper = mount(TrainingReportSummary, {
      localVue,
      vuetify,
      store,
      propsData: {
        id: 'tr-summary-rs-1',
        trainingName: 'LP Course',
        trainingSummary: {
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH,
          reportDetail: { totalTargetUserCount: 0 },
          trainingDetails: { name: 'LP', companyName: 'Co' }
        },
        isLoading: false,
        formDetails: {},
        awardCertificateEnrollmentId: 'award-enr-summary-1',
        isSurvey: false,
        isLearningPath: true
      },
      stubs: {
        Fragment: true,
        ElTabs: { name: 'ElTabs', template: '<div><slot /></div>' },
        ElTabPane: true,
        TrainingReportResendDialog: true,
        TrainingReportSummaryAudienceDetails: true,
        TrainingReportSummaryHeader: true,
        TrainingReportSummaryCards: true,
        TrainingReportSummaryTrainingInfo: true,
        TrainingReportTrainingDelivery: true,
        TrainingReportSMSSummary: true,
        TrainingReportTrainingMaterial: true,
        TrainingReportEnrollmentEmail: true,
        TrainingReportCertificate: true,
        TrainingReportUsers: true,
        TrainingReportCertificateEmailsTable: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const items = [{ targetUserResourceId: 'tu-sum-1' }, { targetUserResourceId: 'tu-sum-2' }]
    wrapper.vm.handleOnResend(items, ['ex-sum'], true, filterArg)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['tu-sum-1', 'tu-sum-2'],
      excludedItems: ['ex-sum'],
      selectAll: true,
      filter: filterArg
    })
  })
})
