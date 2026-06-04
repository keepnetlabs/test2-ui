/**
 * Eğitim raporu Progress: yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressTrainingReportEmails: jest.fn(),
    exportProgressTrainingReportEmails: jest.fn(),
    resendTrainingToProgressList: jest.fn(() => Promise.resolve())
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
import TrainingReportProgress from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Progress handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.progressTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-prog-rs-1',
              progress: 'InProgress',
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

  it('builds resendPayload and opens resend dialog on handleOnResend', async () => {
    const wrapper = mount(TrainingReportProgress, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-prog-rs-1',
        formDetails: {},
        isScormProxy: false,
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
        TrainingReportProgressDetails: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnResend({ targetUserResourceId: 'tu-prog-rs-solo' }, [], false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['tu-prog-rs-solo'],
      excludedItems: [],
      selectAll: false,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(AwarenessEducatorService.resendTrainingToProgressList).not.toHaveBeenCalled()
  })
})
