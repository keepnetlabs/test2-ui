/**
 * Vishing kullanıcı etkileşimleri diyaloğu `created`
 * → `getVishingReportUsersInteractions(payload)`; payload `resourceId` satır kimliğini içerir.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportUsersInteractions: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 5,
      orderBy: 'CallDate',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingReportUserInteractionsModal from '@/components/VishingReport/VishingReportUserInteractionsModal.vue'
import { getVishingReportUsersInteractions } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report User Interactions modal created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getVishingReportUsersInteractions.mockResolvedValue({
      data: {
        data: {
          results: [
            { status: 'Answered', callDate: '2026-05-10', callDuration: '00:01:30' }
          ]
        }
      }
    })
  })

  it('loads interaction rows via getVishingReportUsersInteractions', async () => {
    const wrapper = mount(VishingReportUserInteractionsModal, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'vish-interact-row-1',
          firstName: 'Ada',
          lastName: 'Call'
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
        VBtn: true,
        VIcon: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportUsersInteractions).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'vish-interact-row-1',
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'CallDate'
      })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        status: 'Answered',
        callDate: '2026-05-10',
        callDuration: '00:01:30'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
