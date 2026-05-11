/**
 * Quishing Opened Attachment tablo `mounted` → `QuishingService.searchCampaignJobUserAttachmentOpened`
 * + `useReportLanguageColumns.mapPreferredLanguage` (Lookup 21 mock).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpened: jest.fn(),
    exportCampaignJobUserAttachmentOpened: jest.fn()
  }
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([{ isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-en' }])
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'FirstName',
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
import QuishingOpenedAttachmentTable from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Opened Attachment table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserAttachmentOpened.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-att-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'FileTag', value: 'pdf' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via QuishingService and maps language + custom fields', async () => {
    const wrapper = mount(QuishingOpenedAttachmentTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsOpenedAttachmentDetailsPermissions': true
          }
        }
      },
      propsData: {
        id: 'q-camp-att',
        instanceGroup: 'q-ig-att'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserAttachmentOpened).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-camp-att',
      'q-ig-att'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-att-1',
        preferredLanguage: 'EN',
        FileTag: 'pdf'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
