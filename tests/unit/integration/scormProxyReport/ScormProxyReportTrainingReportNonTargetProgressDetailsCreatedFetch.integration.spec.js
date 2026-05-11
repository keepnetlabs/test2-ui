/**
 * SCORM proxy Non-Target Progress detay diyaloğu `created`
 * → `AwarenessEducatorService.progressNonTargetUsersTrainingReportEmailsDetails(axiosPayload, enrollmentId, targetUserResultId)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressNonTargetUsersTrainingReportEmailsDetails: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'enrollmentDate',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportNonTargetUsersProgressDetailDialog from '@/components/ScormProxyReport/Progress/TrainingReportNonTargetUsersProgressDetailDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Non-Target Progress details dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.progressNonTargetUsersTrainingReportEmailsDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ status: 'InProgress', sessionStartDate: '2026-01-01' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via progressNonTargetUsersTrainingReportEmailsDetails', async () => {
    const wrapper = mount(TrainingReportNonTargetUsersProgressDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          enrollmentId: 'en-nt-prog-1',
          targetUserResultId: 'tres-nt-1',
          targetUserResourceId: 'tu-nt-1',
          status: 'InProgress'
        },
        interactionType: 'progress'
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooterWithClose: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        Badge: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(
      AwarenessEducatorService.progressNonTargetUsersTrainingReportEmailsDetails
    ).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'enrollmentDate' }),
      'en-nt-prog-1',
      'tres-nt-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ status: 'InProgress', sessionStartDate: '2026-01-01' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
