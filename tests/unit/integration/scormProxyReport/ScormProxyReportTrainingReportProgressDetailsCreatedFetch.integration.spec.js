/**
 * SCORM proxy Progress detay diyaloğu `created`
 * → `AwarenessEducatorService.getProgressDetailsTable(enrollmentId, targetUserResourceId)`
 * + `trackingInfo` satır birleşimi.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getProgressDetailsTable: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportProgressDetails from '@/components/ScormProxyReport/Progress/TrainingReportProgressDetails.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Progress details dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.getProgressDetailsTable.mockResolvedValue({
      data: {
        data: [
          {
            sessionRank: 1,
            progress: 'Completed',
            trackingInfo: { userAgent: 'Mozilla/1.0' }
          }
        ]
      }
    })
  })

  it('loads detail rows via getProgressDetailsTable and merges trackingInfo', async () => {
    const wrapper = mount(TrainingReportProgressDetails, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          enrollmentId: 'en-prog-1',
          targetUserResourceId: 'tu-prog-d-1',
          firstName: 'Ada',
          lastName: 'Lovelace'
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
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

    expect(AwarenessEducatorService.getProgressDetailsTable).toHaveBeenCalledWith(
      'en-prog-1',
      'tu-prog-d-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        sessionRank: 1,
        progress: 'Completed',
        userAgent: 'Mozilla/1.0'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
