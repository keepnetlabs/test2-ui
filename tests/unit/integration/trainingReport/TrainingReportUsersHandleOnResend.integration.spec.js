/**
 * Eğitim raporu Users (Target): yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchTrainingReportUsers: jest.fn(),
    exportTrainingReportUsers: jest.fn(),
    resendTrainingToUserList: jest.fn(() => Promise.resolve())
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
import TrainingReportUsers from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Users handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchTrainingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-users-rs-1',
              firstName: 'U1',
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
    const wrapper = mount(TrainingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-users-rs-1',
        isScormProxy: false,
        isSurvey: false,
        trainingSummary: {
          trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING,
          trainingDetails: { trainingTypeName: 'SCORM' }
        },
        formDetails: {
          targetUserEnrollmentStatusEnum: [
            {
              displayName: 'SCORM',
              enumResults: [{ displayName: 'Completed', name: 'Completed' }]
            }
          ]
        }
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true,
        TrainingReportUserDetailsDialog: true,
        Badge: true,
        VMenu: true,
        VBtn: true,
        VIcon: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true,
        VListItemContent: true,
        VRadioGroup: true,
        VRadio: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnResend({ targetUserResourceId: 'tu-users-rs-solo' }, ['ex-u'], true)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['tu-users-rs-solo'],
      excludedItems: ['ex-u'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(AwarenessEducatorService.resendTrainingToUserList).not.toHaveBeenCalled()
  })
})
