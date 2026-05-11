/**
 * Opened Attachment tablo `mounted` → `searchCampaignJobUserAttachmentOpened` + sandbox sayacı.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserAttachmentOpened: jest.fn(),
  exportCampaignJobUserAttachmentOpened: jest.fn()
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
import CampaignManagerReportOpenedAttachmentTable from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
import { searchCampaignJobUserAttachmentOpened } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Opened Attachment table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserAttachmentOpened.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'att-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'FileName', value: 'doc.pdf' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 3
        }
      }
    })
  })

  it('maps rows, activityType default and botActivityCount after mount', async () => {
    const wrapper = mount(CampaignManagerReportOpenedAttachmentTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsOpenedAttachmentDetailsPermissions': true } }
      },
      propsData: { id: 'camp-att', instanceGroup: 'ig-att', isShowSandboxFromParent: false },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: true,
        CommonReportViewTargetGroupsModal: true,
        CampaignManagerReportBotActivityAlertBox: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserAttachmentOpened).toHaveBeenCalled()
    expect(wrapper.vm.axiosPayload.activityType).toBe(0)
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'att-1',
        preferredLanguage: 'EN',
        FileName: 'doc.pdf'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(3)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
