/**
 * SCORM proxy Training Report kullanıcı etkileşimleri diyaloğu `created`
 * → `AwarenessEducatorService.getTrainingReportInteractions(enrollmentId, targetUserResourceId, interactionType)`
 * + `trackingInfo` satır birleşimi.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportInteractions: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportUserInteractionsModal from '@/components/ScormProxyReport/Users/TrainingReportUserInteractionsModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report User Interactions modal created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({
      data: {
        data: [
          {
            interaction: 'Opened',
            eventTime: '2026-05-01T10:00:00Z',
            trackingInfo: { userIpAddresslist: '203.0.113.1' }
          }
        ]
      }
    })
  })

  it('loads interaction rows via getTrainingReportInteractions and merges trackingInfo', async () => {
    const wrapper = mount(TrainingReportUserInteractionsModal, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        interactionType: 'opened',
        item: {
          enrollmentId: 'en-int-1',
          targetUserResourceId: 'tu-int-1',
          firstName: 'Ada',
          lastName: 'Test',
          status: 'Clicked'
        },
        firstColumnLabel: 'Date Opened'
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

    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'en-int-1',
      'tu-int-1',
      'opened'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        interaction: 'Opened',
        eventTime: '2026-05-01T10:00:00Z',
        userIpAddresslist: '203.0.113.1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
