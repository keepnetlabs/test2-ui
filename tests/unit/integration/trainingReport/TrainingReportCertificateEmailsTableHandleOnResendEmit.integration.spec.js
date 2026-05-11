/**
 * Eğitim raporu Sending — Certificate: `handleOnResend`
 * → `on-selection-text-change` (seçim sayısı) + parent'a `on-resend` (items, excluded, selectAll, filter).
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

describe('Training Report Certificate emails table handleOnResend emit (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-cert-rs-1',
              userEmailId: 'ue-1',
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

  it('emits on-selection-text-change and on-resend with filter from DataTable contract', async () => {
    const wrapper = mount(TrainingReportCertificateEmailsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-cert-rs-emit',
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

    const items = [{ targetUserResourceId: 'tu-cert-rs-1', userEmailId: 'ue-1' }]
    const filterArg = wrapper.vm.axiosPayload.filter
    wrapper.vm.handleOnResend(items, [], false, filterArg)

    expect(wrapper.emitted('on-selection-text-change')).toBeTruthy()
    expect(wrapper.emitted('on-selection-text-change')[0]).toEqual([items.length])

    expect(wrapper.emitted('on-resend')).toHaveLength(1)
    expect(wrapper.emitted('on-resend')[0]).toEqual([items, [], false, filterArg])
  })
})
